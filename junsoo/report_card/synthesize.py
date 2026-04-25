"""B3 — Instruct-model JSON synthesizer.

Takes 8 specialist observations + per-action activations and emits a strict-JSON
report card. Uses a fast instruct-tuned model (Cerebras Llama-3.3-70B by
default; Anthropic Haiku fallback) — NOT K2 Think, because reasoning models
burn token budget on chain-of-thought and return truncated JSON. See
_bmad/brain-swarm/backend/services/orchestrator.py:26-32 for the bug history.

Retry policy: parse failure → one retry with feedback ("your last response was
not valid JSON: <err>. Return only valid JSON."). After two failures, return
a placeholder report card with archetype_state="parse_failure" so the pipeline
doesn't abort mid-render.
"""
from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

from .k2_caller import InstructClient
from .validate_schema import (
    NUMERIC_SCORES,
    REQUIRED_SPECIALISTS,
    validate_action_card,
)

SYSTEM_PROMPT_PATH = (
    Path(__file__).resolve().parents[1]
    / "papers" / "prompts" / "ironside" / "report_card_synthesis.md"
)


# Instruct models sometimes wrap JSON in ```json ... ``` fences. Strip those.
_FENCE_RE = re.compile(r"^\s*```(?:json)?\s*(.*?)\s*```\s*$", re.DOTALL)


def _strip_fences(text: str) -> str:
    m = _FENCE_RE.match(text)
    return m.group(1) if m else text.strip()


def _build_user_message(action_with_specialists: dict[str, Any]) -> str:
    a = action_with_specialists
    regions = a.get("regions", {})
    region_str = ", ".join(f"{k}={v:.2f}" for k, v in regions.items())

    obs_lines = []
    for spec in REQUIRED_SPECIALISTS:
        obs = a.get("specialists", {}).get(spec, f"[{spec}: no observation]")
        obs_lines.append(f"- {spec}: {obs}")

    parts = [
        f"Action: {a.get('action', '<unlabeled>')}",
        f"Time window: start_t={a.get('t_start')}, end_t={a.get('t_end')}",
        f"Per-action averaged Yeo7 activations: {region_str}",
    ]
    if a.get("stimulus"):
        parts.append(f'Stimulus context: "{a["stimulus"]}"')

    parts.append("\nSpecialist observations:")
    parts.extend(obs_lines)
    parts.append(
        "\nReturn the strict JSON report card per your system prompt. "
        "JSON only — no preamble, no code fences, no trailing prose."
    )
    return "\n".join(parts)


def _placeholder_card(action: dict[str, Any], reason: str) -> dict[str, Any]:
    """Schema-valid card returned when synthesis fails — keeps pipeline running."""
    specialists = action.get("specialists", {})
    return {
        "time_window": {
            "start_t": int(action.get("t_start", 0)),
            "end_t": int(action.get("t_end", 0)),
        },
        "action": action.get("action", "<unlabeled>"),
        **{score: 0.0 for score in NUMERIC_SCORES},
        "archetype_state": "parse_failure",
        "supporting_specialist_evidence": {
            spec: specialists.get(spec) or f"[{spec}: not run]"
            for spec in REQUIRED_SPECIALISTS
        },
        "_synthesis_error": reason,
    }


def _coerce_card(parsed: Any, action: dict[str, Any]) -> dict[str, Any]:
    """Some instruct models return a string-encoded JSON or wrap in {"report":...}.
    Best-effort to find the dict."""
    if isinstance(parsed, dict) and "action" in parsed:
        return parsed
    if isinstance(parsed, dict):
        for k in ("report", "report_card", "result"):
            if k in parsed and isinstance(parsed[k], dict):
                return parsed[k]
    raise ValueError(f"Could not locate report-card dict in synthesis output: {type(parsed).__name__}")


class Synthesizer:
    def __init__(self, provider: str | None = None) -> None:
        self.client = InstructClient(provider=provider)
        self.system = SYSTEM_PROMPT_PATH.read_text() if SYSTEM_PROMPT_PATH.exists() else (
            "Output a strict JSON report card with keys: time_window, action, "
            "attention_score, threat_engagement, cognitive_load, decision_quality, "
            "archetype_state, supporting_specialist_evidence (8 specialist keys). "
            "All scores in [0,1]. JSON only, no prose."
        )

    async def synthesize(self, action_with_specialists: dict[str, Any]) -> dict[str, Any]:
        user = _build_user_message(action_with_specialists)
        attempts: list[str] = []

        for attempt_idx in range(2):
            user_for_attempt = user
            if attempt_idx > 0:
                # Retry with feedback
                user_for_attempt = (
                    user
                    + f"\n\nYour previous response was not valid JSON. Error: {attempts[-1]}. "
                    "Return ONLY a valid JSON object — no markdown, no prose."
                )
            try:
                raw = await self.client.chat_json(self.system, user_for_attempt, max_tokens=1500)
            except Exception as e:
                attempts.append(f"network/api error: {type(e).__name__}: {e}")
                continue

            stripped = _strip_fences(raw)
            try:
                parsed = json.loads(stripped)
                card = _coerce_card(parsed, action_with_specialists)
                errors = validate_action_card(card)
                if errors:
                    attempts.append("schema errors: " + "; ".join(errors[:3]))
                    continue
                return card
            except (json.JSONDecodeError, ValueError) as e:
                attempts.append(f"{type(e).__name__}: {e}")
                continue

        return _placeholder_card(
            action_with_specialists,
            reason="2 synthesis attempts failed: " + " | ".join(attempts),
        )
