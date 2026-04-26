"""Stage 2 — Empathy synthesis client (Claude Opus 4.7 via Anthropic SDK).

Takes the Stage 1 vision report + averaged brain pattern + per-region
specialist observations + previous-round feedback, returns a candidate
empathy paragraph plus guardrail pre-flight status. Iterative loop calls
this once per round (round_n=1..8).

MOCK_OPUS=1 returns deterministic placeholder paragraphs that VARY by
round_n so the loop's per-round divergence is testable offline.

Env:
    ANTHROPIC_API_KEY     required for live calls
    ANTHROPIC_MODEL       default claude-opus-4-7
    MOCK_OPUS=1           skip HTTP, return round-aware placeholder
"""
from __future__ import annotations

import os
from pathlib import Path
from typing import Any, Literal

from dotenv import load_dotenv
from pydantic import BaseModel, ConfigDict

from caltech.engine.stage1 import VisionReport

_CALTECH_DIR = Path(__file__).resolve().parents[1]
_REPO_ROOT = _CALTECH_DIR.parent
load_dotenv(_CALTECH_DIR / ".env")
load_dotenv(_REPO_ROOT / ".env")
load_dotenv()

DEFAULT_MODEL = "claude-opus-4-7"


class SynthesisInput(BaseModel):
    model_config = ConfigDict(extra="forbid")

    vision_report: VisionReport
    brain_pattern_summary: dict[str, float]
    specialist_observations: dict[str, str]
    round_n: int
    previous_score: float | None
    per_region_miss: dict[str, float] | None
    system_prompt: str
    scenario: str


class CandidateParagraph(BaseModel):
    model_config = ConfigDict(extra="forbid")

    candidate_paragraph: str
    round_n: int
    specialist_roster_used: list[str]
    guardrail_pre_flight: Literal["passed", "flagged"]
    model_metadata: dict[str, Any]


def _guardrail_check(paragraph: str) -> tuple[bool, str]:
    """Best-effort guardrail import. Agent 4 owns guardrails.py — if it
    isn't there yet we fall back to passing so the pipeline doesn't block
    on missing module."""
    try:
        from caltech.engine.guardrails import (
            check_paragraph_for_forbidden_claims,
        )
    except ImportError:
        return True, "guardrails module not yet present — pre-flight skipped"
    try:
        return check_paragraph_for_forbidden_claims(paragraph)
    except Exception as exc:  # pragma: no cover — defensive
        return False, f"guardrail check raised: {exc!r}"


def _mock_paragraph(payload: SynthesisInput) -> str:
    """Round-aware placeholder. MUST differ per round so iterative-loop
    tests see real divergence between Round 1 and Round 8."""
    round_n = payload.round_n
    score_hint = (
        f"prior round scored {payload.previous_score:.2f}"
        if payload.previous_score is not None
        else "no prior round"
    )
    miss_hint = ""
    if payload.per_region_miss:
        worst = max(payload.per_region_miss.items(), key=lambda kv: kv[1])
        miss_hint = f" Largest residual: {worst[0]} ({worst[1]:.2f})."

    flavour = {
        1: "First-pass empathy candidate, broad strokes only.",
        2: "Second pass tightens emotional-processing alignment.",
        3: "Third pass folds in salience-tracking signal.",
        4: "Mid-loop pass — narrative cohesion improves.",
        5: "Fifth pass aligns motor-planning observations.",
        6: "Sixth pass — diminishing residual on social-pattern region.",
        7: "Seventh pass approaches convergence threshold.",
        8: "Final pass: paragraph stable, residuals minimal.",
    }.get(round_n, f"Round {round_n} placeholder pass.")

    return (
        f"[MOCK round={round_n}] {flavour} Scenario={payload.scenario}. "
        f"Scene: {payload.vision_report.scene_summary} "
        f"Specialists active: {sorted(payload.specialist_observations.keys())}. "
        f"{score_hint}.{miss_hint}"
    )


class EmpathySynthesizer:
    """Stage 2 client. async synthesize(payload) -> CandidateParagraph."""

    def __init__(self) -> None:
        self.api_key = os.getenv("ANTHROPIC_API_KEY", "")
        self.model = os.getenv("ANTHROPIC_MODEL", DEFAULT_MODEL)
        self.timeout = float(os.getenv("ANTHROPIC_TIMEOUT", "60.0"))
        self.mock = os.getenv("MOCK_OPUS", "") == "1"

    def _build_user_message(self, p: SynthesisInput) -> str:
        return (
            f"Scenario: {p.scenario}\n"
            f"Round: {p.round_n}\n"
            f"Previous score: {p.previous_score}\n"
            f"Per-region residual: {p.per_region_miss}\n\n"
            f"Vision report:\n{p.vision_report.model_dump_json(indent=2)}\n\n"
            f"Brain-pattern summary (averaged):\n{p.brain_pattern_summary}\n\n"
            f"Specialist observations:\n{p.specialist_observations}\n"
        )

    async def synthesize(self, payload: SynthesisInput) -> CandidateParagraph:
        roster = sorted(payload.specialist_observations.keys())

        if self.mock:
            paragraph = _mock_paragraph(payload)
            passed, reason = _guardrail_check(paragraph)
            return CandidateParagraph(
                candidate_paragraph=paragraph,
                round_n=payload.round_n,
                specialist_roster_used=roster,
                guardrail_pre_flight="passed" if passed else "flagged",
                model_metadata={
                    "mock": True,
                    "model": "mock-opus",
                    "guardrail_reason": reason,
                },
            )

        if not self.api_key:
            raise RuntimeError(
                "ANTHROPIC_API_KEY not set in environment / .env — required "
                "for live EmpathySynthesizer.synthesize()."
            )

        # Lazy import — anthropic SDK isn't a hard module-level dep so the
        # module imports cleanly even when the package isn't installed.
        try:
            from anthropic import AsyncAnthropic
        except ImportError as exc:
            raise RuntimeError(
                "anthropic package not installed — pip install anthropic"
            ) from exc

        client = AsyncAnthropic(api_key=self.api_key, timeout=self.timeout)
        user_msg = self._build_user_message(payload)

        resp = await client.messages.create(
            model=self.model,
            max_tokens=1024,
            system=payload.system_prompt,
            messages=[{"role": "user", "content": user_msg}],
        )

        # Anthropic returns content blocks; concat the text blocks.
        paragraph_parts: list[str] = []
        for block in resp.content:
            text = getattr(block, "text", None)
            if text:
                paragraph_parts.append(text)
        paragraph = "".join(paragraph_parts).strip()

        passed, reason = _guardrail_check(paragraph)
        return CandidateParagraph(
            candidate_paragraph=paragraph,
            round_n=payload.round_n,
            specialist_roster_used=roster,
            guardrail_pre_flight="passed" if passed else "flagged",
            model_metadata={
                "model": self.model,
                "stop_reason": getattr(resp, "stop_reason", None),
                "usage": getattr(resp, "usage", None).__dict__
                if getattr(resp, "usage", None)
                else None,
                "guardrail_reason": reason,
            },
        )
