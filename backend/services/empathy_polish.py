"""Stage 4 — Opus 4.7 empathy synthesis.

Takes the upstream pipeline's outputs (vision report, swarm readings, iterative-
loop trajectory + per-region attribution, falsification, pre-rendered TRIBE
activity) and asks Anthropic Claude Opus 4.7 to braid them into a structured
EmpathySynthesisDocument (CONTRACTS C6).

When OPUS_POLISH != "1" or ANTHROPIC_API_KEY is missing, the call is skipped
and the function returns None. Per CONSTRAINTS.md: no silent stubs — failures
log structurally and return None so the frontend can fall back to
best_paragraph.

Public API:
    async def synthesize_document(
        clip_id: str,
        scenario: str,
        vision_report: dict,
        activity: dict,
        swarm_readings: dict,
        round_trajectory: list,
        per_region_attribution: dict,
        falsification: dict,
        best_paragraph: str,
        clip_dir: Path | None = None,
    ) -> dict | None
"""
from __future__ import annotations

import json
import logging
import os
import time
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)

_PROMPTS_DIR = Path(__file__).parents[1] / "prompts"
_PROMPT_PATH = _PROMPTS_DIR / "opus_synthesis.md"
_DEFAULT_MODEL = "claude-opus-4-7"
_MAX_TOKENS = 4096

_REQUIRED_TOP_KEYS: tuple[str, ...] = (
    "headline",
    "synthesis_paragraph",
    "temporal_arc",
    "neural_evidence",
    "inflection_moment",
    "falsification",
    "scenario_lens",
    "model_metadata",
)

_NETWORKS: tuple[str, ...] = (
    "visual",
    "somatomotor",
    "dorsal_attention",
    "ventral_attention",
    "limbic",
    "frontoparietal",
    "default_mode",
)

_PROMPT_TEMPLATE: str | None = None


def _load_prompt_template() -> str:
    global _PROMPT_TEMPLATE
    if _PROMPT_TEMPLATE is None:
        _PROMPT_TEMPLATE = _PROMPT_PATH.read_text(encoding="utf-8")
    return _PROMPT_TEMPLATE


def cache_path(clip_dir: Path) -> Path:
    return Path(clip_dir) / "synthesis.json"


def _build_activity_summary(activity: dict | None) -> str:
    frames = (activity or {}).get("frames") or []
    if not frames:
        return "(no activity frames)"

    lines: list[str] = []
    for frame in frames:
        if not isinstance(frame, dict):
            continue
        t = frame.get("t_s")
        if t is None:
            t = frame.get("t", "?")
        regions = frame.get("regions") or {}

        top_region = frame.get("top_region")
        top_value: float | None = None
        if top_region and isinstance(regions, dict) and top_region in regions:
            try:
                top_value = float(regions[top_region])
            except Exception:
                top_value = None
        if not top_region and isinstance(regions, dict) and regions:
            try:
                top_region, top_v = max(
                    regions.items(), key=lambda kv: float(kv[1])
                )
                top_value = float(top_v)
            except Exception:
                top_region = None

        if top_region is None:
            lines.append(f"t={t}s  top=(unknown)")
        elif top_value is None:
            lines.append(f"t={t}s  top={top_region}")
        else:
            lines.append(f"t={t}s  top={top_region:<18} ({top_value:.2f})")
    return "\n".join(lines)


def _strip_json_fences(raw: str) -> str:
    s = raw.strip()
    if s.startswith("```"):
        # drop leading fence (```json or ```)
        nl = s.find("\n")
        if nl != -1:
            s = s[nl + 1 :]
        # drop trailing fence
        if s.endswith("```"):
            s = s[:-3]
    return s.strip()


def _validate_top_keys(doc: Any) -> bool:
    if not isinstance(doc, dict):
        return False
    missing = [k for k in _REQUIRED_TOP_KEYS if k not in doc]
    if missing:
        logger.warning(
            "[empathy_polish] synthesis missing required top-level keys: %s",
            missing,
        )
        return False
    return True


async def synthesize_document(
    clip_id: str,
    scenario: str,
    vision_report: dict,
    activity: dict,
    swarm_readings: dict,
    round_trajectory: list,
    per_region_attribution: dict,
    falsification: dict,
    best_paragraph: str,
    clip_dir: Path | None = None,
) -> dict | None:
    if clip_dir is not None:
        cache_file = cache_path(Path(clip_dir))
        if cache_file.exists():
            try:
                cached = json.loads(cache_file.read_text(encoding="utf-8"))
                if isinstance(cached, dict):
                    return cached
            except Exception as e:
                logger.warning(
                    "[empathy_polish] cache read failed (%s): %s — recomputing",
                    cache_file,
                    e,
                )

    opus_polish = os.getenv("OPUS_POLISH", "1")
    api_key = os.getenv("ANTHROPIC_API_KEY")
    model = os.getenv("ANTHROPIC_MODEL", _DEFAULT_MODEL)

    if opus_polish != "1":
        logger.info(
            "[empathy_polish] skipped clip=%s reason=OPUS_POLISH!=1 value=%r",
            clip_id,
            opus_polish,
        )
        return None
    if not api_key:
        logger.info(
            "[empathy_polish] skipped clip=%s reason=ANTHROPIC_API_KEY missing",
            clip_id,
        )
        return None

    try:
        from anthropic import AsyncAnthropic
    except Exception as e:
        logger.error(
            "[empathy_polish] failed clip=%s reason=anthropic-import-error err=%s: %s",
            clip_id,
            type(e).__name__,
            e,
        )
        return None

    try:
        template = _load_prompt_template()
    except Exception as e:
        logger.error(
            "[empathy_polish] failed clip=%s reason=prompt-load-error err=%s: %s",
            clip_id,
            type(e).__name__,
            e,
        )
        return None

    inputs = {
        "clip_id": clip_id,
        "scenario": scenario,
        "vision_report_json": json.dumps(vision_report or {}, indent=2),
        "activity_summary": _build_activity_summary(activity),
        "swarm_readings_json": json.dumps(swarm_readings or {}, indent=2),
        "round_trajectory_json": json.dumps(round_trajectory or [], indent=2),
        "per_region_attribution_json": json.dumps(
            per_region_attribution or {}, indent=2
        ),
        "falsification_json": json.dumps(falsification or {}, indent=2),
        "best_paragraph": best_paragraph or "",
    }

    try:
        rendered = template.format(**inputs)
    except KeyError as e:
        logger.error(
            "[empathy_polish] failed clip=%s reason=prompt-render-error missing-key=%s",
            clip_id,
            e,
        )
        return None

    client = AsyncAnthropic(api_key=api_key)
    started = time.perf_counter()
    try:
        response = await client.messages.create(
            model=model,
            max_tokens=_MAX_TOKENS,
            messages=[{"role": "user", "content": rendered}],
        )
    except Exception as e:
        logger.error(
            "[empathy_polish] failed clip=%s reason=anthropic-api-error err=%s: %s",
            clip_id,
            type(e).__name__,
            e,
        )
        return None
    elapsed_ms = int((time.perf_counter() - started) * 1000)

    try:
        raw_text = response.content[0].text  # type: ignore[index,attr-defined]
    except Exception as e:
        logger.error(
            "[empathy_polish] failed clip=%s reason=response-shape-error err=%s: %s",
            clip_id,
            type(e).__name__,
            e,
        )
        return None

    cleaned = _strip_json_fences(raw_text)
    try:
        doc = json.loads(cleaned)
    except Exception as e:
        tail = cleaned[-400:] if len(cleaned) > 400 else cleaned
        logger.error(
            "[empathy_polish] failed clip=%s reason=json-parse-error err=%s tail=%r",
            clip_id,
            e,
            tail,
        )
        return None

    if not _validate_top_keys(doc):
        logger.error(
            "[empathy_polish] failed clip=%s reason=missing-top-level-keys",
            clip_id,
        )
        return None

    metadata: dict[str, Any] = {
        "model": model,
        "input_tokens": getattr(getattr(response, "usage", None), "input_tokens", 0) or 0,
        "output_tokens": getattr(getattr(response, "usage", None), "output_tokens", 0) or 0,
        "elapsed_ms": elapsed_ms,
    }
    existing_meta = doc.get("model_metadata")
    if isinstance(existing_meta, dict):
        existing_meta.update(metadata)
        doc["model_metadata"] = existing_meta
    else:
        doc["model_metadata"] = metadata

    if clip_dir is not None:
        try:
            cache_file = cache_path(Path(clip_dir))
            cache_file.parent.mkdir(parents=True, exist_ok=True)
            tmp = cache_file.with_suffix(".tmp.json")
            tmp.write_text(json.dumps(doc, indent=2), encoding="utf-8")
            os.replace(tmp, cache_file)
        except Exception as e:
            logger.warning(
                "[empathy_polish] cache write failed clip=%s err=%s: %s",
                clip_id,
                type(e).__name__,
                e,
            )

    return doc
