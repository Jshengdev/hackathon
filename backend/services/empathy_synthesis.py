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
# K2's moderator endpoint can take 2-4 min under load (longer prompt + larger
# output than evaluator calls). 120s was guaranteeing failures during fresh
# bakes — bumped to 300s after observing 9/9 moderator calls timing out.
_TIMEOUT_S = 300.0

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

# Triggered when a candidate comes back shaped like a region:value list
# instead of flowing prose (a known K2 failure mode in late refinement
# rounds where the model mirrors the per_region_miss input format).
_LIST_ESCAPE_DIRECTIVE = (
    "\n\nFORMAT CORRECTION: A previous draft was returned as a list of "
    "'region: value' pairs instead of prose. The output MUST be ONE flowing "
    "paragraph (150-300 words). Do NOT emit lines like 'visual: 0.85' or "
    "'- dorsal_attention: …'. Do NOT use bullet points, numbered lists, or "
    "colons followed by numeric scores. Write essayist prose only — full "
    "sentences that braid the vision events with the network-level "
    "observations into a single arc."
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


def _looks_like_region_list_dump(text: str) -> bool:
    """True if `text` reads like a list of `network: value` pairs instead
    of paragraph prose. Defends against a K2 failure mode where the model
    mirrors the per_region_miss input format back as its candidate."""
    if not text:
        return True
    lines = [ln.strip() for ln in text.strip().splitlines() if ln.strip()]
    if not lines:
        return True
    network_set = set(_NETWORKS)
    region_line_count = 0
    for ln in lines:
        head = ln.lstrip("-* \t").split(":", 1)[0].strip().lower()
        if head in network_set:
            region_line_count += 1
    # Mostly region-shaped lines with little prose around them ⇒ malformed.
    return region_line_count >= 2 and len(lines) <= region_line_count + 2


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
        return f"[empathy_synthesis error: {type(e).__name__}: {e}]"

    try:
        ok = bool(pass_guardrail_pre_flight(candidate))
    except Exception:
        ok = True

    if not ok:
        try:
            candidate = await _fire_once(system + _STRICTER_DIRECTIVE, user)
        except Exception as e:
            return f"[empathy_synthesis retry error: {type(e).__name__}: {e}]"

    if _looks_like_region_list_dump(candidate):
        print(
            f"[empathy_synthesis] region-list dump detected, retrying with "
            f"format directive (len={len(candidate)})"
        )
        try:
            candidate = await _fire_once(system + _LIST_ESCAPE_DIRECTIVE, user)
        except Exception as e:
            return f"[empathy_synthesis format-retry error: {type(e).__name__}: {e}]"

    return candidate
