"""8-round iterative scoring loop — the Clair de Lune protocol inverted.

Orchestrates the swarm of paragraph candidates competing across rounds:

    For each round:
      1. synthesizer.synthesize(input)           -> candidate paragraph
      2. predict_brain_fn(paragraph)             -> predicted brain pattern
      3. score_candidate(predicted, target)      -> score + per-region miss
      4. log round; check plateau; feed score + miss back into the next
         synthesizer call

This module is loose-coupled to its collaborators: the synthesizer and the
forward-prediction function are passed in by the caller. We only require:

  * `await synthesizer.synthesize(input_dict)` returning an object whose
    `candidate_paragraph` (or `paragraph`) field is a string, OR a string
    directly.
  * `await predict_brain_fn(paragraph_text)` returning a
    `PredictedBrainPattern` (or anything with `.flatten_regions()` and
    `.regions`).
"""
from __future__ import annotations

from typing import TYPE_CHECKING, Any, Awaitable, Callable, Protocol

from pydantic import BaseModel, ConfigDict

from caltech.engine.score import is_plateau, score_candidate

if TYPE_CHECKING:  # pragma: no cover - typing-only
    from junsoo.brain.schema import BrainPattern, PredictedBrainPattern
else:
    try:
        from junsoo.brain.schema import BrainPattern, PredictedBrainPattern
    except Exception:  # pragma: no cover - fallback if Agent 1 not done
        BrainPattern = object  # type: ignore[assignment,misc]
        PredictedBrainPattern = object  # type: ignore[assignment,misc]


class _SynthesizerLike(Protocol):
    async def synthesize(self, input: dict[str, Any]) -> Any: ...


class RoundEntry(BaseModel):
    model_config = ConfigDict(extra="forbid")

    round: int
    score: float
    paragraph_excerpt: str


class LoopResult(BaseModel):
    model_config = ConfigDict(extra="forbid")

    best_paragraph: str
    final_score: float
    round_trajectory: list[RoundEntry]
    per_region_attribution: dict[str, dict[str, float]]


def _excerpt(text: str, n: int = 80) -> str:
    if len(text) <= n:
        return text
    return text[:n] + "..."


def _extract_paragraph(synth_output: Any) -> str:
    """Pull the candidate paragraph string out of a flexible synth return.

    Accepts: a bare string; a Pydantic model with `candidate_paragraph` or
    `paragraph`; a dict with the same keys.
    """
    if isinstance(synth_output, str):
        return synth_output
    for attr in ("candidate_paragraph", "paragraph"):
        val = getattr(synth_output, attr, None)
        if isinstance(val, str):
            return val
    if isinstance(synth_output, dict):
        for key in ("candidate_paragraph", "paragraph"):
            val = synth_output.get(key)
            if isinstance(val, str):
                return val
    raise TypeError(
        "synthesizer output did not yield a paragraph string "
        "(checked str, .candidate_paragraph, .paragraph, dict keys)"
    )


class IterativeLoop:
    """The 8-round scoring loop. Stateless across `run()` calls."""

    def __init__(
        self,
        delta_threshold: float = 0.02,
        plateau_lookback: int = 2,
    ) -> None:
        self.delta_threshold = delta_threshold
        self.plateau_lookback = plateau_lookback

    async def run(
        self,
        target: "BrainPattern",
        synthesizer: _SynthesizerLike,
        predict_brain_fn: Callable[[str], Awaitable["PredictedBrainPattern"]],
        initial_payload: dict[str, Any],
        max_rounds: int = 8,
    ) -> LoopResult:
        trajectory: list[RoundEntry] = []
        score_history: list[float] = []
        paragraphs: list[str] = []
        last_miss: dict[str, float] = {}
        last_score: float = 0.0

        for round_n in range(1, max_rounds + 1):
            payload = dict(initial_payload)
            payload["round_n"] = round_n
            payload["prior_score"] = last_score
            payload["per_region_miss"] = dict(last_miss)

            synth_output = await synthesizer.synthesize(payload)
            paragraph = _extract_paragraph(synth_output)
            predicted = await predict_brain_fn(paragraph)

            score, per_region_miss = score_candidate(predicted, target)

            trajectory.append(
                RoundEntry(
                    round=round_n,
                    score=score,
                    paragraph_excerpt=_excerpt(paragraph),
                )
            )
            score_history.append(score)
            paragraphs.append(paragraph)
            last_miss = per_region_miss
            last_score = score

            if is_plateau(
                score_history,
                delta_threshold=self.delta_threshold,
                lookback=self.plateau_lookback,
            ):
                break

        # "best" = highest-score round, not last
        best_idx = max(range(len(score_history)), key=lambda i: score_history[i])
        best_paragraph = paragraphs[best_idx]
        final_score = score_history[best_idx]

        # per_region_attribution: candidate match (1 - |miss|) + raw target
        target_vec = target.flatten_regions()
        target_keys = sorted(
            {k for f in target.frames for k in f.regions.keys()}
        )
        per_region_attribution: dict[str, dict[str, float]] = {}
        for i, k in enumerate(target_keys):
            tgt_val = float(target_vec[i]) if i < len(target_vec) else 0.0
            miss = float(last_miss.get(k, 0.0))
            cand_match = max(0.0, min(1.0, 1.0 - abs(miss)))
            per_region_attribution[k] = {
                "candidate_match": cand_match,
                "target": tgt_val,
            }

        return LoopResult(
            best_paragraph=best_paragraph,
            final_score=final_score,
            round_trajectory=trajectory,
            per_region_attribution=per_region_attribution,
        )
