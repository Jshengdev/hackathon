"""Falsification check — proves the best paragraph is grounded, not generic.

Re-scores the best paragraph from the iterative loop against a CONTROL
video's brain pattern (same nurse on a routine vitals visit, etc.). If
the main score is meaningfully higher than the control score, the
paragraph is anchored to the original scene's emotional reality. This is
the same logic Johnny used for Clair de Lune falsification against
control music.
"""
from __future__ import annotations

from typing import TYPE_CHECKING, Awaitable, Callable, Literal

from pydantic import BaseModel, ConfigDict

from caltech.engine.score import score_candidate

if TYPE_CHECKING:  # pragma: no cover - typing-only
    from junsoo.brain.schema import BrainPattern, PredictedBrainPattern
else:
    try:
        from junsoo.brain.schema import BrainPattern, PredictedBrainPattern
    except Exception:  # pragma: no cover - fallback if Agent 1 not done
        BrainPattern = object  # type: ignore[assignment,misc]
        PredictedBrainPattern = object  # type: ignore[assignment,misc]


ANCHOR_THRESHOLD = 0.40


class FalsificationResult(BaseModel):
    model_config = ConfigDict(extra="forbid")

    main_video_id: str
    control_video_id: str
    main_paragraph_score: float
    control_paragraph_score: float
    falsification_delta: float
    verdict: Literal["anchored", "generic-plausible"]


async def compute_falsification(
    best_paragraph: str,
    target_score: float,
    control_target: "BrainPattern",
    predict_brain_fn: Callable[[str], Awaitable["PredictedBrainPattern"]],
    main_video_id: str | None = None,
) -> FalsificationResult:
    """Score the best paragraph against the control brain pattern.

    `target_score` is the main-video score from the iterative loop (already
    computed, no need to recompute). `control_target` is the pre-cached
    brain pattern of the control video. We re-run the same paragraph
    forward through TRIBE V2 and score it against control_target.

    Verdict is "anchored" when delta = main - control > 0.40, else
    "generic-plausible" (a red flag — paragraph reads as plausible but
    isn't anchored to scene-specific evidence).
    """
    predicted = await predict_brain_fn(best_paragraph)
    control_score, _miss = score_candidate(predicted, control_target)

    delta = float(target_score) - float(control_score)
    verdict: Literal["anchored", "generic-plausible"] = (
        "anchored" if delta > ANCHOR_THRESHOLD else "generic-plausible"
    )

    main_id = main_video_id
    if main_id is None:
        main_id = getattr(control_target, "video_id", "main") + "__main"

    control_id = getattr(control_target, "video_id", "control")

    return FalsificationResult(
        main_video_id=main_id,
        control_video_id=control_id,
        main_paragraph_score=float(target_score),
        control_paragraph_score=float(control_score),
        falsification_delta=delta,
        verdict=verdict,
    )
