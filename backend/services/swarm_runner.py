"""Stage 1B — parallel K2 swarm over the 7 Yeo7 networks for a whole clip.

Pre-aggregates per-network frame stats into a compact ~150-token summary so
the swarm fires once per network across the clip (not once per frame).
"""
from __future__ import annotations
import asyncio
import time
from pathlib import Path
from typing import Any

from services.k2_client import K2Client
from services.orchestrator import _parse_observation

# Per-clip live progress dict for the 7-agent swarm. Populated incrementally
# as each network's K2 call resolves so /demo/warmup-status can drip readings
# to the frontend before the whole swarm finishes. Process-local, ephemeral.
SWARM_PROGRESS: dict[str, dict[str, dict[str, Any]]] = {}

NETWORKS: tuple[str, ...] = (
    "visual",
    "somatomotor",
    "dorsal_attention",
    "ventral_attention",
    "limbic",
    "frontoparietal",
    "default_mode",
)

_PROMPTS_DIR = Path(__file__).parents[1] / "prompts"
_PER_CALL_MAX_TOKENS = 200
_PER_CALL_TIMEOUT_S = 90.0

_k2_client: K2Client | None = None


def _get_k2() -> K2Client:
    global _k2_client
    if _k2_client is None:
        _k2_client = K2Client()
    return _k2_client


def _load_system_prompt(network: str) -> str:
    path = _PROMPTS_DIR / f"{network}.md"
    if path.exists():
        return path.read_text()
    return f"You are the {network} network. Output Reading / Confidence / Cite, three lines."


def _aggregate_per_network(frames: list[dict]) -> dict[str, dict[str, Any]]:
    """For each Yeo7 network, compute mean / peak time / dominance count
    plus the mean of every other network (for cross-signal context)."""
    n = len(frames)
    agg: dict[str, dict[str, Any]] = {}
    if n == 0:
        return {net: {"mean": 0.0, "peak_t": 0, "peak_val": 0.0,
                      "dominance_count": 0, "n": 0, "others": {}} for net in NETWORKS}

    sums = {net: 0.0 for net in NETWORKS}
    peak_t = {net: 0 for net in NETWORKS}
    peak_val = {net: float("-inf") for net in NETWORKS}
    dominance = {net: 0 for net in NETWORKS}

    for f in frames:
        regions = f.get("regions", {}) or {}
        t = f.get("t_s", 0)
        for net in NETWORKS:
            v = float(regions.get(net, 0.0))
            sums[net] += v
            if v > peak_val[net]:
                peak_val[net] = v
                peak_t[net] = t
        top = f.get("top_region")
        if top in dominance:
            dominance[top] += 1

    means = {net: sums[net] / n for net in NETWORKS}
    for net in NETWORKS:
        others = {k: round(means[k], 3) for k in NETWORKS if k != net}
        agg[net] = {
            "mean": means[net],
            "peak_t": peak_t[net],
            "peak_val": peak_val[net] if peak_val[net] != float("-inf") else 0.0,
            "dominance_count": dominance[net],
            "n": n,
            "others": others,
        }
    return agg


def _build_user_prompt(clip_id: str, network: str, stats: dict[str, Any]) -> str:
    others_str = ", ".join(f"{k}={v:+.3f}" for k, v in stats["others"].items())
    return (
        f"Clip: {clip_id}.\n"
        f"Your network: {network}.\n"
        f"Mean activation across {stats['n']} frames: {stats['mean']:.3f}.\n"
        f"Peak at t={stats['peak_t']}s with value {stats['peak_val']:.3f}.\n"
        f"Dominant in {stats['dominance_count']}/{stats['n']} frames.\n"
        f"Other-network mean activations: {others_str}.\n"
        f"Output the three lines exactly as your system prompt specifies "
        f"(Reading / Confidence / Cite)."
    )


async def _call_one(
    network: str, system: str, user: str, clip_id: str | None = None,
) -> dict[str, Any]:
    k2 = _get_k2()
    try:
        raw = await asyncio.wait_for(
            k2.chat(system, user, max_tokens=_PER_CALL_MAX_TOKENS, tag=f"specialist:{network}"),
            timeout=_PER_CALL_TIMEOUT_S,
        )
        parsed = _parse_observation(raw)
        result = {
            "reading": parsed.get("reading", "") or "",
            "confidence": parsed.get("confidence", "") or "",
            "cite": parsed.get("cite") or None,
        }
    except Exception as e:
        result = {"reading": f"[K2 error: {e}]", "confidence": "", "cite": None}

    if clip_id is not None:
        SWARM_PROGRESS.setdefault(clip_id, {})[network] = {
            "state": "done",
            "text": result["reading"],
            "confidence": result["confidence"],
            "cite": result["cite"],
            "completed_at": time.time(),
        }
    return result


def get_swarm_progress(clip_id: str) -> dict[str, dict[str, Any]]:
    """Snapshot of the per-network in-flight progress for a clip.

    Networks not present in the dict have not finished yet; callers should
    treat absence as 'thinking'.
    """
    return dict(SWARM_PROGRESS.get(clip_id) or {})


def reset_swarm_progress(clip_id: str) -> None:
    SWARM_PROGRESS.pop(clip_id, None)


async def run_swarm(activity_json: dict, clip_id: str) -> dict:
    frames = activity_json.get("frames", []) or []
    n = len(frames)
    agg = _aggregate_per_network(frames)

    # Reset progress so a re-run for the same clip doesn't show stale state.
    reset_swarm_progress(clip_id)

    tasks = []
    for net in NETWORKS:
        system = _load_system_prompt(net)
        user = _build_user_prompt(clip_id, net, agg[net])
        tasks.append(_call_one(net, system, user, clip_id=clip_id))

    results = await asyncio.gather(*tasks, return_exceptions=False)
    regions = {net: results[i] for i, net in enumerate(NETWORKS)}

    return {
        "clip_id": clip_id,
        "frame_window": f"aggregated across all {n} frames",
        "regions": regions,
    }
