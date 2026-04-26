"""Offline tests for Stage 1 + Stage 2 clients.

Uses MOCK_VISION=1 / MOCK_OPUS=1 so no HTTP is attempted. Run as:

    MOCK_VISION=1 MOCK_OPUS=1 python3 -m caltech.engine.test_stages_offline

Coverage:
    - VisionClassifier mock returns valid VisionReport
    - EmpathySynthesizer mock returns DIFFERENT paragraphs for round 1 vs round 8
    - Schema strictness (extra='forbid') rejects unknown keys
    - Missing API key raises RuntimeError (no silent placeholder leak)
"""
from __future__ import annotations

import asyncio
import os
import sys
from pathlib import Path

from pydantic import ValidationError

from caltech.engine.stage1 import VisionClassifier, VisionReport
from caltech.engine.stage2 import (
    CandidateParagraph,
    EmpathySynthesizer,
    SynthesisInput,
)


def _assert(cond: bool, msg: str) -> None:
    if not cond:
        print(f"FAIL: {msg}", file=sys.stderr)
        sys.exit(1)


async def test_vision_mock_returns_valid_report() -> None:
    os.environ["MOCK_VISION"] = "1"
    clf = VisionClassifier()
    report = await clf.classify(
        Path("ironsight_warehouse_demo.mp4"),
        scenario="ironsight",
    )
    _assert(isinstance(report, VisionReport), "report should be VisionReport")
    _assert(len(report.scene_summary) > 0, "scene_summary should be populated")
    _assert(len(report.actions) > 0, "actions should be populated")
    _assert(
        len(report.temporal_sequence) > 0, "temporal_sequence should be populated"
    )
    print("[ok] test_vision_mock_returns_valid_report")


async def test_vision_mock_unknown_video_falls_back() -> None:
    os.environ["MOCK_VISION"] = "1"
    clf = VisionClassifier()
    report = await clf.classify(Path("never_seen_clip.mp4"), scenario="sideshift")
    _assert(isinstance(report, VisionReport), "fallback should still validate")
    print("[ok] test_vision_mock_unknown_video_falls_back")


def test_vision_report_schema_forbids_extras() -> None:
    payload = {
        "scene_summary": "x",
        "actions": [],
        "temporal_sequence": [],
        "spatial_relationships": [],
        "rogue_field": "boom",
    }
    raised = False
    try:
        VisionReport.model_validate(payload)
    except ValidationError:
        raised = True
    _assert(raised, "extra='forbid' should reject rogue_field")
    print("[ok] test_vision_report_schema_forbids_extras")


async def test_vision_missing_key_raises() -> None:
    # Live mode (no MOCK_VISION) + no API key must RAISE, not return a
    # placeholder. This is the bug-bite-once-shame-on-us check.
    os.environ.pop("MOCK_VISION", None)
    os.environ.pop("OPENROUTER_API_KEY", None)
    clf = VisionClassifier()
    raised = False
    try:
        await clf.classify(Path("anything.mp4"), scenario="ironsight")
    except RuntimeError as exc:
        raised = "OPENROUTER_API_KEY" in str(exc)
    _assert(raised, "missing OPENROUTER_API_KEY must raise RuntimeError")
    print("[ok] test_vision_missing_key_raises")


def _make_payload(round_n: int, previous_score: float | None) -> SynthesisInput:
    vr = VisionReport(
        scene_summary="warehouse scan + hesitate + rescan",
        actions=["scan", "hesitate", "rescan"],
        temporal_sequence=[{"t": 0.0, "event": "scan_start"}],
        spatial_relationships=[{"subject": "worker", "object": "shelf", "relation": "in_front_of"}],
    )
    return SynthesisInput(
        vision_report=vr,
        brain_pattern_summary={"emotional_processing": 0.41, "salience": 0.62},
        specialist_observations={
            "emotional_processing": "sustained engagement",
            "salience": "elevated tracking near rescan event",
        },
        round_n=round_n,
        previous_score=previous_score,
        per_region_miss={"emotional_processing": 0.18, "salience": 0.05}
        if previous_score is not None
        else None,
        system_prompt="You are an empathy translator. Be observational only.",
        scenario="ironsight",
    )


async def test_opus_mock_round_divergence() -> None:
    os.environ["MOCK_OPUS"] = "1"
    synth = EmpathySynthesizer()
    r1 = await synth.synthesize(_make_payload(round_n=1, previous_score=None))
    r8 = await synth.synthesize(_make_payload(round_n=8, previous_score=0.71))
    _assert(isinstance(r1, CandidateParagraph), "r1 should be CandidateParagraph")
    _assert(isinstance(r8, CandidateParagraph), "r8 should be CandidateParagraph")
    _assert(
        r1.candidate_paragraph != r8.candidate_paragraph,
        "round 1 and round 8 mock paragraphs must differ",
    )
    _assert(r1.round_n == 1, "round_n preserved on r1")
    _assert(r8.round_n == 8, "round_n preserved on r8")
    _assert(
        r1.guardrail_pre_flight in ("passed", "flagged"),
        "guardrail_pre_flight must be literal",
    )
    _assert(
        sorted(r1.specialist_roster_used) == ["emotional_processing", "salience"],
        "specialist roster carried through",
    )
    print("[ok] test_opus_mock_round_divergence")


def test_candidate_paragraph_schema_forbids_extras() -> None:
    payload = {
        "candidate_paragraph": "x",
        "round_n": 1,
        "specialist_roster_used": [],
        "guardrail_pre_flight": "passed",
        "model_metadata": {},
        "rogue": True,
    }
    raised = False
    try:
        CandidateParagraph.model_validate(payload)
    except ValidationError:
        raised = True
    _assert(raised, "CandidateParagraph extra='forbid' should reject rogue")
    print("[ok] test_candidate_paragraph_schema_forbids_extras")


async def test_opus_missing_key_raises() -> None:
    os.environ.pop("MOCK_OPUS", None)
    os.environ.pop("ANTHROPIC_API_KEY", None)
    synth = EmpathySynthesizer()
    raised = False
    try:
        await synth.synthesize(_make_payload(round_n=1, previous_score=None))
    except RuntimeError as exc:
        raised = "ANTHROPIC_API_KEY" in str(exc)
    _assert(raised, "missing ANTHROPIC_API_KEY must raise RuntimeError")
    print("[ok] test_opus_missing_key_raises")


async def main() -> None:
    # Synchronous schema tests first (they don't need the event loop).
    test_vision_report_schema_forbids_extras()
    test_candidate_paragraph_schema_forbids_extras()

    # Mock-path async tests.
    await test_vision_mock_returns_valid_report()
    await test_vision_mock_unknown_video_falls_back()
    await test_opus_mock_round_divergence()

    # Missing-key tests run LAST because they unset env vars.
    await test_vision_missing_key_raises()
    await test_opus_missing_key_raises()

    print("\nAll offline stage tests passed.")


if __name__ == "__main__":
    asyncio.run(main())
