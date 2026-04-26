"""Offline tests for the brain-encoding module.

Run directly:

    MOCK_FORWARD=1 python3 junsoo/brain/test_brain_offline.py

These tests must pass without a GPU and without TRIBE V2 weights — they
exercise schema invariants, the `flatten_regions` helper, and the
deterministic mock forward path.
"""
from __future__ import annotations

import asyncio
import os
import sys
import traceback
from pathlib import Path

import numpy as np
from pydantic import ValidationError

# Allow `python3 junsoo/brain/test_brain_offline.py` from anywhere by
# putting the repo root on sys.path so `junsoo.brain` resolves.
_REPO_ROOT = Path(__file__).resolve().parents[2]
if str(_REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(_REPO_ROOT))

from junsoo.brain import (  # noqa: E402
    BrainFrame,
    BrainPattern,
    PredictedBrainPattern,
    RegionActivation,
    predict_brain_from_text,
)


def _cosine(a: np.ndarray, b: np.ndarray) -> float:
    na = float(np.linalg.norm(a))
    nb = float(np.linalg.norm(b))
    if na == 0.0 or nb == 0.0:
        return 0.0
    return float(np.dot(a, b) / (na * nb))


def test_extra_forbid_rejects_unknown_fields() -> None:
    try:
        RegionActivation(activation=0.5, mystery=123)  # type: ignore[call-arg]
    except ValidationError:
        pass
    else:
        raise AssertionError("RegionActivation should reject extra fields")
    try:
        BrainFrame(time_s=0, regions={}, junk="x")  # type: ignore[call-arg]
    except ValidationError:
        pass
    else:
        raise AssertionError("BrainFrame should reject extra fields")
    try:
        PredictedBrainPattern(input_text="x", regions={}, surprise=1)  # type: ignore[call-arg]
    except ValidationError:
        pass
    else:
        raise AssertionError("PredictedBrainPattern should reject extra fields")


def test_flatten_regions_stable_length() -> None:
    a = PredictedBrainPattern(
        input_text="A",
        regions={
            "alpha": RegionActivation(activation=0.1),
            "beta": RegionActivation(activation=0.2),
            "gamma": RegionActivation(activation=0.3),
        },
    )
    b = PredictedBrainPattern(
        input_text="B",
        regions={
            "gamma": RegionActivation(activation=0.4),
            "alpha": RegionActivation(activation=0.5),
            "beta": RegionActivation(activation=0.6),
        },
    )
    va = a.flatten_regions()
    vb = b.flatten_regions()
    assert va.shape == vb.shape, f"shape mismatch: {va.shape} vs {vb.shape}"
    # alphabetical order: alpha, beta, gamma
    assert np.allclose(va, [0.1, 0.2, 0.3])
    assert np.allclose(vb, [0.5, 0.6, 0.4])

    # BrainPattern flatten averages over time and shares the same key set.
    bp = BrainPattern(
        video_id="v0",
        scenario="ironsight_workplace",
        frames=[
            BrainFrame(
                time_s=0,
                regions={
                    "alpha": RegionActivation(activation=0.0),
                    "beta": RegionActivation(activation=1.0),
                },
            ),
            BrainFrame(
                time_s=1,
                regions={
                    "alpha": RegionActivation(activation=1.0),
                    "beta": RegionActivation(activation=0.0),
                },
            ),
        ],
    )
    flat = bp.flatten_regions()
    assert flat.shape == (2,)
    assert np.allclose(flat, [0.5, 0.5])


def test_mock_forward_differs_for_different_inputs() -> None:
    os.environ["MOCK_FORWARD"] = "1"
    a = asyncio.run(predict_brain_from_text("the auditor stares at the screen"))
    b = asyncio.run(
        predict_brain_from_text("a calm afternoon drifts by the window pane")
    )
    va = a.flatten_regions()
    vb = b.flatten_regions()
    assert va.shape == vb.shape
    assert not np.allclose(va, vb), "different inputs must yield different vectors"
    # Sanity: cosine sim between unrelated inputs should be < 1.
    assert _cosine(va, vb) < 0.999


def test_mock_forward_similar_for_similar_inputs() -> None:
    os.environ["MOCK_FORWARD"] = "1"
    p = "ops lead checks the dashboard for spikes"
    a = asyncio.run(predict_brain_from_text(p))
    b = asyncio.run(predict_brain_from_text(p + " ."))
    va = a.flatten_regions()
    vb = b.flatten_regions()
    sim = _cosine(va, vb)
    assert 0.7 < sim < 0.95, f"expected 0.7 < cosine < 0.95, got {sim}"


def test_mock_forward_returns_workplace_roster() -> None:
    os.environ["MOCK_FORWARD"] = "1"
    pred = asyncio.run(predict_brain_from_text("hello"))
    expected = {
        "visual_attention",
        "threat_detection",
        "spatial_mapping",
        "motor_planning",
        "salience_tracking",
        "prefrontal_engagement",
        "default_mode",
        "stress_response",
    }
    assert set(pred.regions.keys()) == expected


def main() -> int:
    tests = [
        test_extra_forbid_rejects_unknown_fields,
        test_flatten_regions_stable_length,
        test_mock_forward_differs_for_different_inputs,
        test_mock_forward_similar_for_similar_inputs,
        test_mock_forward_returns_workplace_roster,
    ]
    failures = 0
    for t in tests:
        try:
            t()
        except Exception:
            failures += 1
            print(f"FAIL: {t.__name__}")
            traceback.print_exc()
        else:
            print(f"ok: {t.__name__}")
    print(f"\n{len(tests) - failures}/{len(tests)} passed")
    return 0 if failures == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
