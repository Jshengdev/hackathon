"""Stage 2 — Empathy Synthesis.

K2 in moderator role combines (a) the Qwen vision report with (b) the K2
swarm readings into ONE candidate empathy paragraph (150-300 words)
describing what the human in the captured video was experiencing.

Public API:
    async def synthesize(vision_report, swarm_readings, scenario,
                         prior_score=None, per_region_miss=None) -> str
"""
from __future__ import annotations

import asyncio
from pathlib import Path
from typing import Any

from services.k2_client import K2Client

try:
    from services.guardrails import pass_guardrail_pre_flight  # type: ignore
except Exception:  # pragma: no cover - fail-soft if module missing
    def pass_guardrail_pre_flight(text: str) -> bool:  # type: ignore
        return True


_PROMPTS_DIR = Path(__file__).parents[1] / "prompts"
_SYSTEM_PROMPT_PATH = _PROMPTS_DIR / "moderator_synthesis.md"
_MAX_TOKENS = 600
_TIMEOUT_S = 120.0

_NETWORKS: tuple[str, ...] = (
    "visual",
    "somatomotor",
    "dorsal_attention",
    "ventral_attention",
    "limbic",
    "frontoparietal",
    "default_mode",
)

_STRICTER_DIRECTIVE = (
    "\n\nSTRICT MODE: A previous draft of this paragraph violated the "
    "forbidden-claim guardrails. Re-read the Forbidden section. Do NOT use "
    "the words 'felt', 'was thinking', 'clinical', 'diagnosis', 'average', "
    "'normal', 'symptom', or 'disorder'. Do NOT make reverse inferences. "
    "Stay strictly observational and network-level. Output ONE paragraph, "
    "150-300 words, plain text only."
)

_k2_client: K2Client | None = None


def _get_k2() -> K2Client:
    global _k2_client
    if _k2_client is None:
        _k2_client = K2Client()
    return _k2_client


def _load_system_prompt() -> str:
    if _SYSTEM_PROMPT_PATH.exists():
        return _SYSTEM_PROMPT_PATH.read_text()
    return (
        "You are the moderator. Combine the vision report and the seven "
        "brain-region readings into ONE plain-text paragraph (150-300 "
        "words). Use only observational, network-level language. Do not "
        "use reverse inference or clinical language."
    )


def _format_list(items: Any) -> str:
    if not items:
        return "(none provided)"
    if isinstance(items, str):
        return items
    try:
        return "; ".join(str(x) for x in items)
    except Exception:
        return str(items)


def _format_swarm(swarm_readings: dict) -> str:
    regions = (swarm_readings or {}).get("regions", {}) or {}
    lines: list[str] = []
    for net in _NETWORKS:
        entry = regions.get(net, {}) or {}
        reading = (entry.get("reading") or "").strip() or "(no reading)"
        lines.append(f"- {net}: {reading}")
    return "\n".join(lines)


def _format_per_region_miss(per_region_miss: dict | None) -> str:
    if not per_region_miss:
        return ""
    lines: list[str] = []
    for region, val in per_region_miss.items():
        if isinstance(val, dict):
            cm = val.get("candidate_match")
            tg = val.get("target")
            if cm is not None and tg is not None:
                try:
                    lines.append(
                        f"- {region}: candidate_match={float(cm):.2f}, "
                        f"target={float(tg):.2f}"
                    )
                    continue
                except Exception:
                    pass
            lines.append(f"- {region}: {val}")
        else:
            try:
                lines.append(f"- {region}: miss={float(val):.2f}")
            except Exception:
                lines.append(f"- {region}: {val}")
    return "\n".join(lines)


def _build_user_message(
    vision_report: dict,
    swarm_readings: dict,
    scenario: str,
    prior_score: float | None,
    per_region_miss: dict | None,
) -> str:
    vr = vision_report or {}
    scene = (vr.get("scene_summary") or "").strip() or "(no scene summary)"
    actions = _format_list(vr.get("actions"))
    spatial = _format_list(vr.get("spatial_relationships"))

    parts: list[str] = []
    parts.append("Vision report (from Qwen — what physically happened):")
    parts.append(f"Scene summary: {scene}")
    parts.append(f"Actions: {actions}")
    parts.append(f"Spatial relationships: {spatial}")
    parts.append("")
    parts.append("Swarm readings (from K2 brain-region specialists):")
    parts.append(_format_swarm(swarm_readings))
    parts.append("")
    parts.append(f"Scenario: {scenario}")

    miss_block = _format_per_region_miss(per_region_miss)
    if prior_score is not None or miss_block:
        parts.append("")
        if prior_score is not None:
            try:
                parts.append(f"Prior candidate score: {float(prior_score):.2f}.")
            except Exception:
                parts.append(f"Prior candidate score: {prior_score}.")
        if miss_block:
            parts.append(
                "Per-region miss (regions where prior candidate did not "
                "capture target):"
            )
            parts.append(miss_block)
        parts.append(
            "Refine the paragraph to emphasize the missed regions while "
            "preserving fidelity to the vision report."
        )

    parts.append("")
    parts.append("Output: ONE paragraph (150-300 words). No markdown, no commentary.")
    return "\n".join(parts)


async def _fire_once(system: str, user: str) -> str:
    k2 = _get_k2()
    raw = await asyncio.wait_for(
        k2.chat(system, user, max_tokens=_MAX_TOKENS, tag="moderator"),
        timeout=_TIMEOUT_S,
    )
    return (raw or "").strip()


async def synthesize(
    vision_report: dict,
    swarm_readings: dict,
    scenario: str,
    prior_score: float | None = None,
    per_region_miss: dict | None = None,
) -> str:
    system = _load_system_prompt()
    user = _build_user_message(
        vision_report, swarm_readings, scenario, prior_score, per_region_miss
    )

    try:
        candidate = await _fire_once(system, user)
    except Exception as e:
        return f"[empathy_synthesis error: {e}]"

    try:
        ok = bool(pass_guardrail_pre_flight(candidate))
    except Exception:
        ok = True

    if not ok:
        try:
            candidate = await _fire_once(system + _STRICTER_DIRECTIVE, user)
        except Exception as e:
            return f"[empathy_synthesis retry error: {e}]"

    return candidate
