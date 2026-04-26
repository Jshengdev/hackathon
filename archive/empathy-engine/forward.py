"""TRIBE V2 forward-direction wrapper: text -> predicted brain pattern.

The real path imports `tribev2.demo_utils.TribeModel`, runs forward
inference on a text stimulus, and pools the (T, 20484) prediction down
to the workplace-specialist region roster.

The mock path (`MOCK_FORWARD=1`) returns deterministic, hash-derived
activations so the iterative scoring loop can be exercised without a
GPU. The mock is structured so that:

* identical input -> identical output (deterministic)
* small perturbations (e.g. trailing whitespace) -> nearly-identical
  output (cosine sim > 0.95 is intentionally avoided in the test, but
  similar inputs land close together via shared base activations)
* unrelated inputs -> noticeably different outputs

The scoring loop only needs comparable 1-D vectors; both paths return a
`PredictedBrainPattern` whose `flatten_regions()` works identically.
"""
from __future__ import annotations

import hashlib
import os
import re

import numpy as np

from .schema import PredictedBrainPattern, RegionActivation

# Workplace specialist roster. Order does not matter for correctness
# (flatten_regions sorts alphabetically) but we keep it explicit so the
# moderator can introspect what a forward pass should produce.
WORKPLACE_REGIONS: tuple[str, ...] = (
    "visual_attention",
    "threat_detection",
    "spatial_mapping",
    "motor_planning",
    "salience_tracking",
    "prefrontal_engagement",
    "default_mode",
    "stress_response",
)


def _seed_from_text(text: str, salt: str = "") -> int:
    """Stable 32-bit seed derived from text content."""
    h = hashlib.blake2b(f"{salt}::{text}".encode("utf-8"), digest_size=8).digest()
    return int.from_bytes(h, "big") & 0xFFFFFFFF


def _tokens(text: str) -> list[str]:
    return [t for t in re.findall(r"[a-z0-9]+", text.lower()) if t]


def _mock_predict(paragraph: str) -> dict[str, RegionActivation]:
    """Hash-based pseudo-random activations.

    Each region's activation is the average of:
      * a region-only base draw (constant for a region across inputs)
      * a per-token contribution averaged over the paragraph's tokens

    This guarantees that paragraphs sharing most tokens land close to
    each other (similar tokens -> similar per-token contributions),
    while wholly different paragraphs diverge.
    """
    tokens = _tokens(paragraph) or [""]
    out: dict[str, RegionActivation] = {}
    for region in WORKPLACE_REGIONS:
        base_rng = np.random.default_rng(_seed_from_text(region, salt="region"))
        base = float(base_rng.uniform(0.2, 0.6))
        contributions = []
        for tok in tokens:
            tok_rng = np.random.default_rng(_seed_from_text(tok, salt=region))
            contributions.append(float(tok_rng.uniform(0.0, 0.4)))
        token_mean = float(np.mean(contributions))
        # Whole-string jitter so two paragraphs that tokenize to the same
        # bag still differ enough to yield cosine sim < 0.95 (per spec),
        # while shared tokens keep the centers close (cosine sim > 0.7).
        jitter_rng = np.random.default_rng(_seed_from_text(paragraph, salt=region))
        jitter = float(jitter_rng.uniform(-0.25, 0.25))
        activation = float(np.clip(base * 0.6 + token_mean * 1.0 + jitter, 0.0, 1.0))
        out[region] = RegionActivation(activation=activation)
    return out


def _real_predict(paragraph: str, scenario: str) -> dict[str, RegionActivation]:
    """Real TRIBE V2 forward call. Heavy: requires GPU + cached weights."""
    # Imports deferred so MOCK_FORWARD=1 paths stay torch-free.
    import tempfile
    from pathlib import Path

    from tribev2.demo_utils import TribeModel  # type: ignore[import-not-found]

    cache = Path(os.environ.get("TRIBE_CACHE", "./cache"))
    cache.mkdir(parents=True, exist_ok=True)
    model = TribeModel.from_pretrained(
        os.environ.get("TRIBE_MODEL_ID", "facebook/tribev2"),
        cache_folder=cache,
    )
    with tempfile.NamedTemporaryFile("w", suffix=".txt", delete=False) as fh:
        fh.write(paragraph)
        text_path = Path(fh.name)
    df = model.get_events_dataframe(text_path=text_path)
    preds, _segments = model.predict(events=df)  # (T, 20484)
    # Time-average then split the 20484-vertex vector into N equal slabs
    # — one per workplace region. This is a deliberately simple pooling;
    # the real atlas-aware mapping lives in junsoo/aggregate.py and a
    # later integration story will swap it in.
    mean_vec = preds.astype(np.float32).mean(axis=0)
    if mean_vec.max() > 0:
        mean_vec = mean_vec / float(np.abs(mean_vec).max())
    chunks = np.array_split(mean_vec, len(WORKPLACE_REGIONS))
    out: dict[str, RegionActivation] = {}
    for region, chunk in zip(WORKPLACE_REGIONS, chunks):
        activation = float(np.clip((chunk.mean() + 1.0) / 2.0, 0.0, 1.0))
        out[region] = RegionActivation(activation=activation)
    _ = scenario  # currently unused; reserved for scenario-conditioned heads
    return out


async def predict_brain_from_text(
    paragraph: str,
    scenario: str = "ironsight_workplace",
) -> PredictedBrainPattern:
    """Forward TRIBE V2 inference on a text paragraph.

    Set `MOCK_FORWARD=1` to skip the heavy model and use deterministic
    hash-based mock activations instead.
    """
    if os.environ.get("MOCK_FORWARD") == "1":
        regions = _mock_predict(paragraph)
    else:
        regions = _real_predict(paragraph, scenario)
    return PredictedBrainPattern(input_text=paragraph, regions=regions)
