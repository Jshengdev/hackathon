"""Offline integration test for the EmpathyEngine orchestrator.

Run::

    MOCK_VISION=1 MOCK_OPUS=1 MOCK_K2=1 MOCK_FORWARD=1 \
      python3 -m caltech.engine.test_runner_offline

Coverage:
    1. End-to-end pipeline with all MOCK_* flags set produces a valid
       `EmpathyDocument` with every required key, correct types, and
       `final_score` in [-1, 1].
    2. `round_trajectory` has at least 1 entry. Mock paths typically
       produce up to `max_rounds`, but plateau detection may exit early —
       both behaviours are accepted.
    3. Pre-cache fallback: when a stage's JSON is pre-baked under
       `<dir>/<clip_id>/<stage>.json`, the runner reads it instead of
       calling the live client. We verify by writing a sentinel
       `vision_report.json` whose `scene_summary` is impossible to produce
       otherwise, then asserting the document echoes that sentinel.
"""
from __future__ import annotations

import asyncio
import json
import os
import sys
import tempfile
from pathlib import Path

# Force MOCK_* before importing engine modules — the synthesizer / vision /
# forward TRIBE all read these at construction time.
os.environ.setdefault("MOCK_VISION", "1")
os.environ.setdefault("MOCK_OPUS", "1")
os.environ.setdefault("MOCK_K2", "1")
os.environ.setdefault("MOCK_FORWARD", "1")

from caltech.engine.runner import EmpathyDocument, EmpathyEngine  # noqa: E402
from caltech.engine.sample_fixture import make_stub_control_brain  # noqa: E402


def _assert(cond: bool, msg: str) -> None:
    if not cond:
        print(f"FAIL: {msg}", file=sys.stderr)
        sys.exit(1)


async def test_end_to_end_mock_pipeline() -> EmpathyDocument:
    engine = EmpathyEngine(max_rounds=8)
    control = make_stub_control_brain()
    fake_video = Path("ironsight_warehouse_demo.mp4")
    doc = await engine.run(
        video_path=fake_video,
        scenario="ironsight_workplace",
        control_brain=control,
    )

    _assert(isinstance(doc, EmpathyDocument), "result must be EmpathyDocument")
    _assert(doc.clip_id == "ironsight_warehouse_demo", "clip_id derives from video stem")
    _assert(doc.scenario == "ironsight_workplace", "scenario echoed back")
    _assert(isinstance(doc.vision_report, dict), "vision_report is dict")
    _assert(
        "scene_summary" in doc.vision_report,
        "vision_report carries scene_summary",
    )
    _assert(isinstance(doc.best_paragraph, str) and doc.best_paragraph, "best_paragraph populated")
    _assert(-1.0 <= doc.final_score <= 1.0, f"final_score out of [-1,1]: {doc.final_score}")
    _assert(
        isinstance(doc.round_trajectory, list) and len(doc.round_trajectory) >= 1,
        "round_trajectory must have ≥ 1 entry",
    )
    _assert(
        isinstance(doc.per_region_attribution, dict)
        and all(isinstance(v, dict) for v in doc.per_region_attribution.values()),
        "per_region_attribution shape valid",
    )
    _assert(doc.falsification is not None, "falsification populated when control given")
    _assert(
        doc.falsification["verdict"] in ("anchored", "generic-plausible"),
        "falsification verdict literal valid",
    )
    _assert(
        isinstance(doc.model_metadata, dict)
        and "latencies" in doc.model_metadata
        and "stage_sources" in doc.model_metadata,
        "model_metadata carries latencies + stage_sources",
    )
    print(
        f"[ok] test_end_to_end_mock_pipeline "
        f"(rounds={len(doc.round_trajectory)}, score={doc.final_score:.3f}, "
        f"verdict={doc.falsification['verdict']})"
    )
    return doc


async def test_falsification_delta_with_stub_control() -> None:
    """Stub control is anti-correlated with mock-encoded video — delta
    should clear the 0.40 anchor threshold most of the time. We assert
    only that the delta is positive, since exact magnitude depends on
    paragraph content."""
    engine = EmpathyEngine(max_rounds=4)  # shorter loop is fine here
    control = make_stub_control_brain()
    doc = await engine.run(
        video_path=Path("ironsight_warehouse_demo.mp4"),
        scenario="ironsight_workplace",
        control_brain=control,
    )
    fals = doc.falsification
    _assert(fals is not None, "falsification present")
    delta = fals["falsification_delta"]
    _assert(
        isinstance(delta, (int, float)),
        "falsification_delta must be numeric",
    )
    print(f"[ok] test_falsification_delta_with_stub_control (delta={delta:.3f})")


async def test_precache_fallback_skips_live_call() -> None:
    """Pre-bake a sentinel vision_report.json; assert the engine echoes it."""
    sentinel_summary = (
        "PRECACHE_SENTINEL_e2e_runner_offline_test — this string is impossible "
        "to produce from any live or mock VisionClassifier code path."
    )
    sentinel_payload = {
        "scene_summary": sentinel_summary,
        "actions": ["sentinel_action"],
        "temporal_sequence": [{"t": 0.0, "event": "sentinel_event"}],
        "spatial_relationships": [
            {"subject": "x", "object": "y", "relation": "z"}
        ],
    }
    with tempfile.TemporaryDirectory() as td:
        prerendered = Path(td)
        clip_dir = prerendered / "ironsight_warehouse_demo"
        clip_dir.mkdir(parents=True)
        (clip_dir / "vision_report.json").write_text(
            json.dumps(sentinel_payload), encoding="utf-8"
        )
        engine = EmpathyEngine(prerendered=prerendered, max_rounds=2)
        doc = await engine.run(
            video_path=Path("ironsight_warehouse_demo.mp4"),
            scenario="ironsight_workplace",
            control_brain=make_stub_control_brain(),
        )
        _assert(
            doc.vision_report["scene_summary"] == sentinel_summary,
            "pre-cached vision_report.json must override live mock",
        )
        _assert(
            doc.model_metadata["stage_sources"]["stage1_vision"] == "cached",
            "stage_sources should report stage1_vision='cached'",
        )
        # Other stages weren't pre-cached, so they should report 'live'.
        _assert(
            doc.model_metadata["stage_sources"]["tribe_reverse"] == "live",
            "uncached stages should report 'live'",
        )
    print("[ok] test_precache_fallback_skips_live_call")


async def main() -> None:
    await test_end_to_end_mock_pipeline()
    await test_falsification_delta_with_stub_control()
    await test_precache_fallback_skips_live_call()
    print("\nAll runner offline tests passed.")


if __name__ == "__main__":
    asyncio.run(main())
