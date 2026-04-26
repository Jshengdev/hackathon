"""Warmup — pre-bake all Layer 1 cache files for a clip.

See build-plan-locked.md §7.5. Skips any step whose JSON already exists on
disk. Writes via session_cache.write_cached. Designed to run as a
BackgroundTask kicked off from /demo/match.
"""
from __future__ import annotations

import asyncio
import json
import logging
from pathlib import Path
from typing import Any

from services.session_cache import (
    SESSION_CACHE,
    _cache_path,
    read_cached,
    write_cached,
)

logger = logging.getLogger(__name__)


_NETWORKS: tuple[str, ...] = (
    "visual",
    "somatomotor",
    "dorsal_attention",
    "ventral_attention",
    "limbic",
    "frontoparietal",
    "default_mode",
)

_PROMPTS_DIR = Path(__file__).parents[1] / "prompts"
_K2_REGION_SEMAPHORE_LIMIT = 6
_REQUIRED_KEYS = ("vision_report", "swarm_readings", "k2_region_cache", "empathy")

_CONTROL_FOR = {
    "ironside": "workplace_routine_baseline",
    "consumer": "curated_short_film_baseline",
}


def _load_scenario(prerendered_dir: Path, clip_id: str) -> dict:
    cached = read_cached(prerendered_dir, clip_id, "scenario")
    if isinstance(cached, dict) and "scenario" in cached:
        return {
            "scenario": cached.get("scenario", "consumer"),
            "label": cached.get("label", clip_id),
        }
    return {"scenario": "consumer", "label": clip_id}


def _load_activity(prerendered_dir: Path, clip_id: str) -> dict | None:
    activity_path = Path(prerendered_dir) / clip_id / "activity.json"
    if not activity_path.exists():
        return None
    try:
        return json.loads(activity_path.read_text(encoding="utf-8"))
    except Exception as e:
        logger.warning("activity.json parse failed for %s: %s", clip_id, e)
        return None


def _resolve_video_path(prerendered_dir: Path, clip_id: str) -> Path:
    clip_dir = Path(prerendered_dir) / clip_id
    for cand in (clip_dir / f"{clip_id}.mp4", clip_dir / "clip.mp4", clip_dir / "video.mp4"):
        if cand.exists():
            return cand
    mp4s = list(clip_dir.glob("*.mp4"))
    return mp4s[0] if mp4s else clip_dir / f"{clip_id}.mp4"


def _load_region_system_prompt(network: str) -> str:
    path = _PROMPTS_DIR / f"{network}.md"
    if path.exists():
        return path.read_text(encoding="utf-8")
    return (
        f"You are the {network} network. React in 1-2 sentences to your "
        "activation, grounded in published neuroscience."
    )


async def _run_k2_region(activity: dict, network: str, t: int, k2_client) -> dict:
    """Mirror of backend/main.py:k2_region handler logic — DO NOT edit main.py."""
    from services.orchestrator import _parse_observation

    frames = activity.get("frames") or []
    if not frames:
        return {
            "network": network,
            "t": t,
            "text": "[no frames]",
            "confidence": "",
            "cite": None,
        }
    frame = frames[t % len(frames)]
    regions: dict = frame.get("regions") or {}

    system_prompt = _load_region_system_prompt(network)
    others = ", ".join(
        f"{k}={v:.2f}" for k, v in regions.items() if k != network
    )
    user = (
        f"Your activation: {regions.get(network, 0.0):.2f}.\n"
        f"Other networks: {others}.\n"
        f"Time: t={t}s.\n"
        "Output the three lines exactly as specified in your system prompt."
    )

    try:
        text = await k2_client.chat(system_prompt, user, max_tokens=200)
    except Exception as e:
        return {
            "network": network,
            "t": t,
            "text": f"[K2 call failed: {e}]",
            "confidence": "",
            "cite": None,
        }

    parsed = _parse_observation(text)
    cite = parsed.get("cite") or None
    if cite:
        cite = cite.strip()
        if cite.startswith("[") and cite.endswith("]"):
            cite = cite[1:-1].strip()

    return {
        "network": network,
        "t": t,
        "text": parsed.get("reading") or text.strip(),
        "confidence": parsed.get("confidence") or "",
        "cite": cite,
    }


async def _bake_k2_region_cache(activity: dict, k2_client) -> dict:
    n_frames = len(activity.get("frames") or [])
    if n_frames == 0:
        return {}

    sem = asyncio.Semaphore(_K2_REGION_SEMAPHORE_LIMIT)

    async def _gated(network: str, t: int):
        async with sem:
            return await _run_k2_region(activity, network, t, k2_client)

    tasks = [
        _gated(net, t) for net in _NETWORKS for t in range(n_frames)
    ]
    results = await asyncio.gather(*tasks, return_exceptions=False)

    cache: dict[str, dict] = {}
    for entry in results:
        cache[f"{entry['network']}_t{entry['t']}"] = entry
    return cache


async def _build_empathy(
    vision_report: dict,
    swarm_readings: dict,
    scenario: dict,
    main_activity: dict,
    control_activity: dict,
    clip_id: str,
    clip_dir: Path,
) -> dict:
    """Wraps iterative_loop.run_iterative_loop + falsification.compute_falsification.

    Returns the §4.4 empathy.json dict.
    """
    from services.iterative_loop import run_iterative_loop

    scenario_name = scenario.get("scenario", "consumer")
    scenario_label = scenario.get("label", "")

    loop_result = await run_iterative_loop(
        vision_report=vision_report,
        swarm_readings=swarm_readings,
        scenario=scenario_name,
    )

    best_paragraph = loop_result.get("best_paragraph", "")
    round_trajectory = loop_result.get("round_trajectory", [])
    per_region_attribution = loop_result.get("per_region_attribution", {})

    falsification_block: dict[str, Any]
    try:
        from services.falsification import compute_falsification  # type: ignore

        falsification_block = await _maybe_await(
            compute_falsification(
                paragraph=best_paragraph,
                main_activity=main_activity,
                control_activity=control_activity,
            )
        )
    except Exception as e:
        logger.warning("falsification compute failed: %s", e)
        falsification_block = {
            "main_score": 0.0,
            "control_score": 0.0,
            "delta": 0.0,
            "verdict": "unknown",
            "error": str(e),
        }

    synthesis_document: dict | None = None
    try:
        from services.empathy_polish import synthesize_document

        synthesis_document = await synthesize_document(
            clip_id=clip_id,
            scenario=scenario_name,
            vision_report=vision_report,
            activity=main_activity,
            swarm_readings=swarm_readings,
            round_trajectory=round_trajectory,
            per_region_attribution=per_region_attribution,
            falsification=falsification_block,
            best_paragraph=best_paragraph,
            clip_dir=clip_dir,
        )
    except Exception as e:
        logger.warning(
            "[empathy_polish] unexpected error clip=%s err=%s: %s",
            clip_id,
            type(e).__name__,
            e,
        )
        synthesis_document = None

    polished_paragraph = (
        synthesis_document.get("synthesis_paragraph")
        if isinstance(synthesis_document, dict)
        else None
    )

    return {
        "scenario": scenario_name,
        "scenario_label": scenario_label,
        "vision_report": vision_report,
        "swarm_readings": swarm_readings,
        "best_paragraph": best_paragraph,
        "polished_paragraph": polished_paragraph,
        "final_score": loop_result.get("final_score", 0.0),
        "round_trajectory": round_trajectory,
        "per_region_attribution": per_region_attribution,
        "falsification": falsification_block,
        "synthesis_document": synthesis_document,
    }


async def _maybe_await(value):
    if asyncio.iscoroutine(value):
        return await value
    return value


def _load_control_activity(prerendered_dir: Path, scenario_name: str, fallback_clip_id: str) -> dict:
    control_id = _CONTROL_FOR.get(scenario_name)
    if control_id:
        path = Path(prerendered_dir) / control_id / "activity.json"
        if path.exists():
            try:
                return json.loads(path.read_text(encoding="utf-8"))
            except Exception as e:
                logger.warning("control activity parse failed (%s): %s", control_id, e)
    logger.warning(
        "control activity missing for scenario=%s; falling back to main clip activity",
        scenario_name,
    )
    main = _load_activity(prerendered_dir, fallback_clip_id)
    return main or {"frames": []}


async def warmup_clip(prerendered_dir: Path, clip_id: str) -> dict:
    """Pre-bake all Layer 1 cache files for a clip if missing.

    Order: vision_report → swarm_readings → k2_region_cache → empathy.
    """
    from services.k2_client import K2Client
    from services.swarm_runner import run_swarm
    from services.vision_client import VisionClient

    completed: list[str] = []
    skipped: list[str] = []
    errors: dict[str, str] = {}

    activity = _load_activity(prerendered_dir, clip_id)
    if activity is None:
        return {
            "completed": completed,
            "skipped": skipped,
            "errors": {"activity": f"activity.json missing for {clip_id}"},
        }

    scenario = _load_scenario(prerendered_dir, clip_id)
    k2_client = K2Client()

    # 1. vision_report
    vision_report: dict | None = read_cached(prerendered_dir, clip_id, "vision_report")
    if vision_report is not None:
        skipped.append("vision_report")
    else:
        try:
            vision = VisionClient()
            video_path = _resolve_video_path(prerendered_dir, clip_id)
            vision_report = await vision.analyze_video(video_path, clip_id)
            write_cached(prerendered_dir, clip_id, "vision_report", vision_report)
            completed.append("vision_report")
        except Exception as e:
            errors["vision_report"] = str(e)
            vision_report = {"scene_summary": "", "stub": True, "error": str(e)}

    # 2. swarm_readings
    swarm_readings: dict | None = read_cached(prerendered_dir, clip_id, "swarm_readings")
    if swarm_readings is not None:
        skipped.append("swarm_readings")
    else:
        try:
            swarm_readings = await run_swarm(activity, clip_id)
            write_cached(prerendered_dir, clip_id, "swarm_readings", swarm_readings)
            completed.append("swarm_readings")
        except Exception as e:
            errors["swarm_readings"] = str(e)
            swarm_readings = {"clip_id": clip_id, "regions": {}}

    # 3. k2_region_cache
    if read_cached(prerendered_dir, clip_id, "k2_region_cache") is not None:
        skipped.append("k2_region_cache")
    else:
        try:
            region_cache = await _bake_k2_region_cache(activity, k2_client)
            write_cached(prerendered_dir, clip_id, "k2_region_cache", region_cache)
            completed.append("k2_region_cache")
        except Exception as e:
            errors["k2_region_cache"] = str(e)

    # 4. empathy (full pipeline)
    if read_cached(prerendered_dir, clip_id, "empathy") is not None:
        skipped.append("empathy")
    else:
        try:
            control_activity = _load_control_activity(
                prerendered_dir, scenario.get("scenario", "consumer"), clip_id
            )
            empathy = await _build_empathy(
                vision_report=vision_report or {},
                swarm_readings=swarm_readings or {},
                scenario=scenario,
                main_activity=activity,
                control_activity=control_activity,
                clip_id=clip_id,
                clip_dir=Path(prerendered_dir) / clip_id,
            )
            empathy["clip_id"] = clip_id
            write_cached(prerendered_dir, clip_id, "empathy", empathy)
            completed.append("empathy")

            trajectory_blob = {
                "clip_id": clip_id,
                "round_trajectory": empathy.get("round_trajectory", []),
                "final_score": empathy.get("final_score", 0.0),
            }
            write_cached(prerendered_dir, clip_id, "iterative_trajectory", trajectory_blob)

            falsification_blob = dict(empathy.get("falsification") or {})
            falsification_blob.setdefault("clip_id", clip_id)
            write_cached(prerendered_dir, clip_id, "falsification", falsification_blob)
        except Exception as e:
            errors["empathy"] = str(e)

    return {"completed": completed, "skipped": skipped, "errors": errors}


async def get_warmup_status(prerendered_dir: Path, clip_id: str) -> dict:
    from services.swarm_runner import get_swarm_progress

    completed: list[str] = []
    pending: list[str] = []
    for key in _REQUIRED_KEYS:
        path = _cache_path(Path(prerendered_dir), clip_id, key)
        if path.exists():
            completed.append(key)
        else:
            pending.append(key)

    # Merge in per-network swarm progress. If swarm_readings is already cached
    # we synthesize a "done" state for all 7 networks straight from disk so a
    # cache-hit warmup still drives the SwarmStatusPanel into its done state.
    swarm_readings_progress: dict[str, dict] = {}
    cached_swarm = read_cached(Path(prerendered_dir), clip_id, "swarm_readings")
    if isinstance(cached_swarm, dict) and isinstance(cached_swarm.get("regions"), dict):
        for net, reading in cached_swarm["regions"].items():
            if not isinstance(reading, dict):
                continue
            swarm_readings_progress[net] = {
                "state": "done",
                "text": reading.get("reading", "") or "",
                "confidence": reading.get("confidence", "") or "",
                "cite": reading.get("cite"),
            }
    else:
        swarm_readings_progress = get_swarm_progress(clip_id)

    return {
        "ready": len(pending) == 0,
        "completed": completed,
        "pending": pending,
        "swarm_readings_progress": swarm_readings_progress,
    }
