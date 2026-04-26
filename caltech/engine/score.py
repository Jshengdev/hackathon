"""Pure scoring utilities for the iterative loop.

No HTTP calls, no model calls. Just numpy + the brain-pattern schema.

The Empathy Layer engine inverts the Clair de Lune protocol: a candidate
paragraph is fed forward through TRIBE V2 (text -> predicted brain) and the
predicted pattern is compared via cosine similarity against the TARGET
pattern produced from the actual video. This module owns those metrics.
"""
from __future__ import annotations

from typing import TYPE_CHECKING

import numpy as np

if TYPE_CHECKING:  # pragma: no cover - typing-only
    from junsoo.brain.schema import BrainPattern, PredictedBrainPattern
else:
    try:
        from junsoo.brain.schema import BrainPattern, PredictedBrainPattern
    except Exception:  # pragma: no cover - fallback if Agent 1 not done
        BrainPattern = object  # type: ignore[assignment,misc]
        PredictedBrainPattern = object  # type: ignore[assignment,misc]


def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    """Cosine similarity, clamped to [-1, 1].

    Returns 0.0 if either vector has zero norm or the lengths differ.
    """
    a = np.asarray(a, dtype=np.float64).ravel()
    b = np.asarray(b, dtype=np.float64).ravel()
    if a.size == 0 or b.size == 0 or a.size != b.size:
        return 0.0
    na = float(np.linalg.norm(a))
    nb = float(np.linalg.norm(b))
    if na == 0.0 or nb == 0.0:
        return 0.0
    sim = float(np.dot(a, b) / (na * nb))
    if sim > 1.0:
        sim = 1.0
    elif sim < -1.0:
        sim = -1.0
    return sim


def score_candidate(
    predicted: "PredictedBrainPattern",
    target: "BrainPattern",
) -> tuple[float, dict[str, float]]:
    """Cosine sim + signed per-region miss (target - candidate).

    Both inputs are flattened via their `.flatten_regions()` method. The
    target's region keys (sorted, time-averaged) define the canonical
    ordering; the candidate is aligned to that ordering before comparison.
    Per-region miss is `target_activation - candidate_activation` per
    region key in the target, signed so the synthesizer can tell whether
    it under- or over-shot a region.
    """
    target_vec = target.flatten_regions()
    target_keys = sorted(
        {k for f in target.frames for k in f.regions.keys()}
    )

    cand_regions = predicted.regions
    cand_aligned = np.zeros(len(target_keys), dtype=np.float32)
    for i, k in enumerate(target_keys):
        ra = cand_regions.get(k)
        cand_aligned[i] = float(ra.activation) if ra is not None else 0.0

    score = cosine_similarity(cand_aligned, target_vec)

    per_region_miss: dict[str, float] = {}
    for i, k in enumerate(target_keys):
        per_region_miss[k] = float(target_vec[i]) - float(cand_aligned[i])

    return score, per_region_miss


def is_plateau(
    trajectory: list[float],
    delta_threshold: float = 0.02,
    lookback: int = 2,
) -> bool:
    """True iff max abs delta over the last `lookback` entries < threshold.

    Needs at least `lookback + 1` entries to evaluate; otherwise False.
    Comparing delta = traj[i] - traj[i-1] for the final `lookback` deltas.
    """
    if lookback < 1:
        return False
    if len(trajectory) < lookback + 1:
        return False
    tail = trajectory[-(lookback + 1) :]
    deltas = [abs(tail[i] - tail[i - 1]) for i in range(1, len(tail))]
    return max(deltas) < delta_threshold
