"""Offline tests for the iterative loop and falsification check.

No network, no model calls. Run with:

    python3 -m caltech.engine.test_loop_offline
"""
from __future__ import annotations

import asyncio
import sys
import traceback

import numpy as np

from junsoo.brain.schema import (
    BrainFrame,
    BrainPattern,
    PredictedBrainPattern,
    RegionActivation,
)

from caltech.engine.falsification import compute_falsification
from caltech.engine.iterative_loop import IterativeLoop
from caltech.engine.score import cosine_similarity, is_plateau, score_candidate

REGION_KEYS = [
    "default_mode",
    "emotion_processing",
    "prefrontal_engagement",
    "threat_detection",
    "visual_attention",
]


def _target_pattern() -> BrainPattern:
    acts = [0.6, 0.9, 0.7, 0.3, 0.8]
    regions = {k: RegionActivation(activation=v) for k, v in zip(REGION_KEYS, acts)}
    frames = [BrainFrame(time_s=0, regions=regions), BrainFrame(time_s=1, regions=regions)]
    return BrainPattern(video_id="demo-1.mp4", scenario="ironsight_workplace", frames=frames)


def _control_pattern() -> BrainPattern:
    acts = [0.1, 0.05, 0.9, 0.95, 0.05]
    regions = {k: RegionActivation(activation=v) for k, v in zip(REGION_KEYS, acts)}
    return BrainPattern(
        video_id="control.mp4",
        scenario="ironsight_workplace",
        frames=[BrainFrame(time_s=0, regions=regions)],
    )


def _predicted_at_round(round_n: int, target: BrainPattern) -> PredictedBrainPattern:
    """Linear interpolation: round 1 far, round 8 near."""
    target_vec = target.flatten_regions()
    keys = sorted({k for f in target.frames for k in f.regions.keys()})
    baseline = np.array([0.5, 0.1, 0.5, 0.9, 0.1], dtype=np.float32)
    t = min(0.10 + (round_n - 1) * 0.107, 0.95)
    blended = np.clip((1 - t) * baseline + t * target_vec, 0.0, 1.0)
    return PredictedBrainPattern(
        input_text=f"paragraph_round_{round_n}",
        regions={k: RegionActivation(activation=float(v)) for k, v in zip(keys, blended)},
    )


class _StubSynth:
    def __init__(self) -> None:
        self.calls = 0

    async def synthesize(self, input):  # noqa: ANN001
        self.calls += 1
        n = input.get("round_n", self.calls)
        return f"paragraph_round_{n} " + ("x" * 90)


class _StubPredictor:
    def __init__(self, target: BrainPattern) -> None:
        self.target = target
        self.calls = 0

    async def __call__(self, text: str) -> PredictedBrainPattern:
        self.calls += 1
        n = self.calls
        try:
            n = int(text.split()[0].rsplit("_", 1)[-1])
        except Exception:
            pass
        return _predicted_at_round(n, self.target)


_results: list[tuple[str, bool]] = []


def check(name: str, cond: bool, detail: str = "") -> None:
    _results.append((name, cond))
    print(f"  [{'PASS' if cond else 'FAIL'}] {name}{(' — ' + detail) if detail else ''}")


def test_cosine() -> None:
    print("test_cosine_similarity")
    a = np.array([1.0, 2.0, 3.0])
    check("identical -> 1.0", abs(cosine_similarity(a, a) - 1.0) < 1e-9)
    check("orthogonal -> 0.0", abs(cosine_similarity(np.array([1.0, 0.0]), np.array([0.0, 1.0]))) < 1e-9)
    check("anti -> -1.0", abs(cosine_similarity(np.array([1.0, 2.0]), np.array([-1.0, -2.0])) + 1.0) < 1e-9)
    check("zero -> 0.0", cosine_similarity(np.zeros(3), np.array([1.0, 2.0, 3.0])) == 0.0)


def test_plateau() -> None:
    print("test_is_plateau")
    check("flat tail detected", is_plateau([0.10, 0.30, 0.60, 0.605, 0.610], 0.02, 2))
    check("climbing not plateau", not is_plateau([0.10, 0.30, 0.50, 0.70, 0.90], 0.02, 2))
    check("too-short -> False", not is_plateau([0.5, 0.51], 0.02, 2))
    check("delta<thresh plateau", is_plateau([0.5, 0.51, 0.52], 0.02, 2))


def test_score_candidate() -> None:
    print("test_score_candidate")
    target = _target_pattern()
    pred = _predicted_at_round(1, target)
    score, miss = score_candidate(pred, target)
    check("score in [-1,1]", -1.0 <= score <= 1.0, f"score={score:.3f}")
    check("miss has target keys", set(miss.keys()) == set(REGION_KEYS))
    check("miss values are float", all(isinstance(v, float) for v in miss.values()))


async def _loop_run():
    target = _target_pattern()
    loop = IterativeLoop(delta_threshold=0.0, plateau_lookback=2)
    return await loop.run(
        target=target,
        synthesizer=_StubSynth(),
        predict_brain_fn=_StubPredictor(target),
        initial_payload={"per_region_specialist_outputs": {}},
        max_rounds=8,
    )


def test_iterative_loop() -> None:
    print("test_iterative_loop")
    result = asyncio.run(_loop_run())
    scores = [e.score for e in result.round_trajectory]
    check("trajectory has 8 entries", len(result.round_trajectory) == 8, f"got {len(result.round_trajectory)}")
    check("rounds 1..8", [e.round for e in result.round_trajectory] == list(range(1, 9)))
    check("final_score == max", abs(result.final_score - max(scores)) < 1e-9, f"final={result.final_score:.4f}")
    check("best_paragraph from trajectory", "paragraph_round_" in result.best_paragraph)
    check("scores climb", scores[-1] > scores[0], f"first={scores[0]:.3f} last={scores[-1]:.3f}")
    check("excerpts <= 83 chars", all(len(e.paragraph_excerpt) <= 83 for e in result.round_trajectory))
    check("per_region_attribution keys", set(result.per_region_attribution.keys()) == set(REGION_KEYS))


async def _fals_run():
    target = _target_pattern()
    control = _control_pattern()
    predictor = _StubPredictor(target)
    best = "paragraph_round_8 " + ("x" * 80)
    main_pred = await predictor(best)
    main_score, _ = score_candidate(main_pred, target)
    return await compute_falsification(
        best_paragraph=best,
        target_score=main_score,
        control_target=control,
        predict_brain_fn=predictor,
        main_video_id="demo-1.mp4",
    )


def test_falsification() -> None:
    print("test_falsification")
    r = asyncio.run(_fals_run())
    check(
        "main > control",
        r.main_paragraph_score > r.control_paragraph_score,
        f"main={r.main_paragraph_score:.3f} ctrl={r.control_paragraph_score:.3f}",
    )
    check("delta > 0.40", r.falsification_delta > 0.40, f"delta={r.falsification_delta:.3f}")
    check("verdict == anchored", r.verdict == "anchored")
    check("main_video_id set", r.main_video_id == "demo-1.mp4")
    check("control_video_id set", r.control_video_id == "control.mp4")


def main() -> int:
    for t in (test_cosine, test_plateau, test_score_candidate, test_iterative_loop, test_falsification):
        try:
            t()
        except Exception:
            traceback.print_exc()
            _results.append((t.__name__, False))
    passed = sum(1 for _, ok in _results if ok)
    print(f"\n{passed}/{len(_results)} checks passed")
    return 0 if passed == len(_results) else 1


if __name__ == "__main__":
    sys.exit(main())
