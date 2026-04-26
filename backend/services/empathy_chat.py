"""Stage 4-bis — Opus 4.7 viewer Q&A about an empathy document.

Takes the clip's cached empathy.json + a chat-message history and asks
Anthropic Claude Opus 4.7 to answer the viewer's question grounded in
the brain-trace data, with the same forbidden-claim guardrails as
moderator_synthesis (no reverse inference, no clinical claims).

When ANTHROPIC_API_KEY is missing or the API errors, raises so the
endpoint can surface a structured 502 — no silent stubs.

System prompt is sent with `cache_control: ephemeral` so the per-clip
context (~3-5k tokens) cache-hits across turns within a 5-minute window.

Public API:
    async def answer(clip_id, history, empathy, activity) -> str
"""
from __future__ import annotations

import json
import logging
import os
import time
from pathlib import Path

logger = logging.getLogger(__name__)

_PROMPTS_DIR = Path(__file__).parents[1] / "prompts"
_PROMPT_PATH = _PROMPTS_DIR / "empathy_chat.md"
_DEFAULT_MODEL = "claude-opus-4-7"
_MAX_TOKENS = 800
_MAX_TURNS = 12  # cap recent history to keep prompt small

_PROMPT_TEMPLATE: str | None = None


def _load_prompt_template() -> str:
    global _PROMPT_TEMPLATE
    if _PROMPT_TEMPLATE is None:
        _PROMPT_TEMPLATE = _PROMPT_PATH.read_text(encoding="utf-8")
    return _PROMPT_TEMPLATE


def _build_activity_summary(activity: dict | None) -> str:
    frames = (activity or {}).get("frames") or []
    if not frames:
        return "(no activity frames)"
    lines: list[str] = []
    for frame in frames:
        if not isinstance(frame, dict):
            continue
        t = frame.get("t_s", frame.get("t", "?"))
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
                top_region, top_v = max(regions.items(), key=lambda kv: float(kv[1]))
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


def _build_system_block(clip_id: str, empathy: dict, activity: dict) -> str:
    template = _load_prompt_template()
    return template.format(
        clip_id=clip_id,
        scenario_label=empathy.get("scenario_label") or empathy.get("scenario") or "",
        vision_report_json=json.dumps(empathy.get("vision_report") or {}, indent=2),
        swarm_readings_json=json.dumps(empathy.get("swarm_readings") or {}, indent=2),
        per_region_attribution_json=json.dumps(
            empathy.get("per_region_attribution") or {}, indent=2
        ),
        falsification_json=json.dumps(empathy.get("falsification") or {}, indent=2),
        best_paragraph=empathy.get("best_paragraph") or "",
        polished_paragraph=empathy.get("polished_paragraph") or "",
        activity_summary=_build_activity_summary(activity),
    )


def _sanitize_history(history: list[dict]) -> list[dict]:
    """Keep only valid role+content pairs; drop leading non-user messages
    (Anthropic requires the first message to be `user`); cap to last
    _MAX_TURNS to keep the prompt tight."""
    cleaned: list[dict] = []
    for msg in history or []:
        if not isinstance(msg, dict):
            continue
        role = msg.get("role")
        content = msg.get("content")
        if role not in {"user", "assistant"}:
            continue
        if not isinstance(content, str) or not content.strip():
            continue
        cleaned.append({"role": role, "content": content.strip()})
    while cleaned and cleaned[0]["role"] != "user":
        cleaned.pop(0)
    if len(cleaned) > _MAX_TURNS:
        cleaned = cleaned[-_MAX_TURNS:]
    return cleaned


async def answer(
    clip_id: str,
    history: list[dict],
    empathy: dict,
    activity: dict,
) -> str:
    api_key = os.getenv("ANTHROPIC_API_KEY")
    model = os.getenv("ANTHROPIC_MODEL", _DEFAULT_MODEL)
    if not api_key:
        logger.error("[empathy_chat] ANTHROPIC_API_KEY missing clip=%s", clip_id)
        raise ValueError("ANTHROPIC_API_KEY not configured")

    try:
        from anthropic import AsyncAnthropic
    except Exception as e:
        logger.error("[empathy_chat] anthropic import failed: %s", e)
        raise

    messages = _sanitize_history(history)
    if not messages:
        raise ValueError("no user message in history")

    try:
        system_text = _build_system_block(clip_id, empathy, activity)
    except KeyError as e:
        logger.error("[empathy_chat] prompt-render-error missing-key=%s", e)
        raise

    client = AsyncAnthropic(api_key=api_key)
    started = time.perf_counter()
    try:
        response = await client.messages.create(
            model=model,
            max_tokens=_MAX_TOKENS,
            system=[
                {
                    "type": "text",
                    "text": system_text,
                    "cache_control": {"type": "ephemeral"},
                }
            ],
            messages=messages,
        )
    except Exception as e:
        logger.error(
            "[empathy_chat] anthropic api error clip=%s err=%s: %s",
            clip_id, type(e).__name__, e,
        )
        raise
    elapsed_ms = int((time.perf_counter() - started) * 1000)

    try:
        reply_text = response.content[0].text  # type: ignore[index,attr-defined]
    except Exception as e:
        logger.error("[empathy_chat] response shape error: %s", e)
        raise

    usage = getattr(response, "usage", None)
    logger.info(
        "[empathy_chat] clip=%s turns=%d elapsed_ms=%d in=%s out=%s cache_read=%s cache_write=%s",
        clip_id,
        len(messages),
        elapsed_ms,
        getattr(usage, "input_tokens", 0) or 0,
        getattr(usage, "output_tokens", 0) or 0,
        getattr(usage, "cache_read_input_tokens", 0) or 0,
        getattr(usage, "cache_creation_input_tokens", 0) or 0,
    )
    return reply_text.strip()
