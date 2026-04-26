"""B3 — Instruct-model JSON synthesizer.

Takes 8 specialist observations + per-action activations and emits a strict-JSON
report card. Uses Cerebras Llama-3.3-70B-Instruct — NOT K2 Think, because
reasoning models burn token budget on chain-of-thought and return truncated
JSON. See _bmad/brain-swarm/backend/services/orchestrator.py:26-32 for the
bug history.

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


# Instruct models do three annoying things with JSON:
#   1. Wrap the whole response in ```json ... ``` fences
#   2. Add prose preamble: "Here is the report:\n```json\n{...}\n```"
#   3. Add trailing prose after the JSON object
# We extract the first balanced top-level JSON object from anywhere in the
# response. Per pattern: research/wiki/patterns/robust-json-from-llms.md
_FENCE_RE = re.compile(r"```(?:json)?\s*(.*?)\s*```", re.DOTALL | re.IGNORECASE)


def _extract_json_object(text: str) -> str:
    """Return the first balanced { ... } object found in text.

    Handles fenced JSON, prose-wrapped JSON, and trailing prose. Strings and
    escaped chars inside JSON are tracked so braces inside strings don't
    confuse the counter.
    """
    if not text:
        return ""

    # First try: the contents of a ```json ... ``` fence (anywhere in text)
    fence = _FENCE_RE.search(text)
    if fence:
        candidate = fence.group(1).strip()
        if candidate.startswith("{") and candidate.endswith("}"):
            return candidate
        # Fence content might still have prose; fall through to scanner

    # Brace-balanced scan over the full text (ignoring chars inside strings)
    start = text.find("{")
    if start == -1:
        return text.strip()  # caller will fail JSON parse with clean error

    depth = 0
    in_string = False
    escape = False
    for i in range(start, len(text)):
        ch = text[i]
        if escape:
            escape = False
            continue
        if ch == "\\" and in_string:
            escape = True
            continue
        if ch == '"':
            in_string = not in_string
            continue
        if in_string:
            continue
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return text[start:i + 1]
    # Unbalanced braces — return what we have and let json.loads fail clearly
    return text[start:].strip()


# Backwards-compat alias used by tests.
_strip_fences = _extract_json_object


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
        attempts: list[tuple[str, str]] = []  # [(category, detail), ...]

        for attempt_idx in range(2):
            user_for_attempt = user
            if attempt_idx > 0:
                # Tailor the retry message to the actual previous failure so we
                # don't tell the model "your JSON was invalid" when the call
                # didn't even reach the model.
                last_kind, last_detail = attempts[-1]
                if last_kind == "network":
                    # Network errors are transient — just retry the same prompt.
                    pass
                else:
                    user_for_attempt = (
                        user
                        + f"\n\nYour previous response could not be parsed as the "
                        f"required report card. Specifically: {last_detail}. "
                        "Return ONLY a valid JSON object matching the schema — "
                        "no markdown fences, no preamble, no trailing prose."
                    )
            try:
                raw = await self.client.chat_json(self.system, user_for_attempt, max_tokens=1500)
            except Exception as e:
                attempts.append(("network", f"{type(e).__name__}: {e}"))
                continue

            extracted = _extract_json_object(raw)
            try:
                parsed = json.loads(extracted)
                card = _coerce_card(parsed, action_with_specialists)
                errors = validate_action_card(card)
                if errors:
                    attempts.append(("schema", "; ".join(errors[:3])))
                    continue
                return card
            except (json.JSONDecodeError, ValueError) as e:
                attempts.append(("parse", f"{type(e).__name__}: {e}"))
                continue

        joined = " | ".join(f"[{k}] {d}" for k, d in attempts)
        return _placeholder_card(
            action_with_specialists,
            reason=f"2 synthesis attempts failed: {joined}",
        )
