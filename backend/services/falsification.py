from __future__ import annotations

from typing import Any

from .embedding_proxy import proxy_score

ANCHORED_THRESHOLD = 0.40


def compute_falsification(
    paragraph: str,
    main_activity: dict[str, Any],
    control_activity: dict[str, Any],
) -> dict[str, Any]:
    main_score, _ = proxy_score(paragraph, main_activity)
    control_score, _ = proxy_score(paragraph, control_activity)
    delta = main_score - control_score
    verdict = "anchored" if delta > ANCHORED_THRESHOLD else "generic_plausible"
    return {
        "main_score": float(main_score),
        "control_score": float(control_score),
        "delta": float(delta),
        "verdict": verdict,
    }
