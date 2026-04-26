"""Pydantic v2 models for the brain-pattern JSON contracts.

Two flavors of brain pattern flow through the Empathy Layer engine:

* `BrainPattern`: TRIBE V2 reverse-direction output (video -> brain), keyed
  by time step. Used by the moderator and by the iterative scoring loop's
  TARGET reference.
* `PredictedBrainPattern`: TRIBE V2 forward-direction output (text ->
  brain), no time dimension. Used as the CANDIDATE in cosine-sim scoring.

Both expose `flatten_regions()` -> 1-D `np.ndarray` whose length is fixed
(set by the alphabetically-sorted region keys), so cosine similarity is
always defined regardless of who produced the pattern.
"""
from __future__ import annotations

from typing import Literal

import numpy as np
from pydantic import BaseModel, ConfigDict, Field


class RegionActivation(BaseModel):
    """Per-region activation, normalized into [0, 1]."""

    model_config = ConfigDict(extra="forbid")

    activation: float = Field(..., ge=0.0, le=1.0)
    vertex_ids: list[int] | None = None


class BrainFrame(BaseModel):
    """One temporal step of a `BrainPattern`."""

    model_config = ConfigDict(extra="forbid")

    time_s: int
    regions: dict[str, RegionActivation]


class BrainPattern(BaseModel):
    """Reverse-direction TRIBE output: video -> brain over time."""

    model_config = ConfigDict(extra="forbid")

    video_id: str
    scenario: Literal["ironsight_workplace", "listenlabs_sideshift_consumer"]
    tribe_version: str = "v2"
    mesh: str = "fsaverage5"
    n_vertices: int = 20484
    temporal_resolution_hz: int = 1
    hrf_lag_s: int = 5
    frames: list[BrainFrame]

    def flatten_regions(self) -> np.ndarray:
        """Time-averaged region activations, sorted alphabetically by region.

        Returns a 1-D float32 array. If `frames` is empty, returns a zero
        vector with length equal to the number of distinct region keys
        encountered (zero if none).
        """
        keys = _collect_keys([f.regions for f in self.frames])
        if not self.frames or not keys:
            return np.zeros(len(keys), dtype=np.float32)
        per_frame = np.zeros((len(self.frames), len(keys)), dtype=np.float32)
        for i, frame in enumerate(self.frames):
            for j, k in enumerate(keys):
                ra = frame.regions.get(k)
                per_frame[i, j] = float(ra.activation) if ra is not None else 0.0
        return per_frame.mean(axis=0).astype(np.float32)


class PredictedBrainPattern(BaseModel):
    """Forward-direction TRIBE output: text -> brain (no time dimension)."""

    model_config = ConfigDict(extra="forbid")

    input_text: str
    regions: dict[str, RegionActivation]

    def flatten_regions(self) -> np.ndarray:
        keys = sorted(self.regions.keys())
        if not keys:
            return np.zeros(0, dtype=np.float32)
        return np.array(
            [float(self.regions[k].activation) for k in keys], dtype=np.float32
        )


def _collect_keys(region_dicts: list[dict[str, RegionActivation]]) -> list[str]:
    """Sorted union of region keys across all frames (stable length)."""
    keys: set[str] = set()
    for d in region_dicts:
        keys.update(d.keys())
    return sorted(keys)
