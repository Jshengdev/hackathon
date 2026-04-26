"""TRIBE V2 reverse-direction wrapper: video -> BrainPattern.

Thin adapter over the existing CLI `junsoo/run_inference.py` (we shell
out via its underlying TribeModel rather than duplicating the load /
save plumbing). The output shape mirrors the §6.2 BrainPattern contract.

A `MOCK_FORWARD=1` env-var path returns a deterministic 3-frame mock so
the iterative loop and downstream consumers can be tested without a GPU.
"""
from __future__ import annotations

import hashlib
import os
from pathlib import Path

import numpy as np

from .forward import WORKPLACE_REGIONS
from .schema import BrainFrame, BrainPattern, RegionActivation


def _video_id(video_path: Path) -> str:
    return video_path.stem or hashlib.blake2b(
        str(video_path).encode("utf-8"), digest_size=6
    ).hexdigest()


def _mock_frames(video_path: Path, n_frames: int = 3) -> list[BrainFrame]:
    seed_bytes = hashlib.blake2b(
        str(video_path).encode("utf-8"), digest_size=8
    ).digest()
    seed = int.from_bytes(seed_bytes, "big") & 0xFFFFFFFF
    rng = np.random.default_rng(seed)
    frames: list[BrainFrame] = []
    for t in range(n_frames):
        regions = {
            r: RegionActivation(activation=float(rng.uniform(0.1, 0.9)))
            for r in WORKPLACE_REGIONS
        }
        frames.append(BrainFrame(time_s=t, regions=regions))
    return frames


def _real_frames(video_path: Path) -> list[BrainFrame]:
    """Run TRIBE V2 forward on a video stimulus and pool to regions."""
    from tribev2.demo_utils import TribeModel  # type: ignore[import-not-found]

    cache = Path(os.environ.get("TRIBE_CACHE", "./cache"))
    cache.mkdir(parents=True, exist_ok=True)
    model = TribeModel.from_pretrained(
        os.environ.get("TRIBE_MODEL_ID", "facebook/tribev2"),
        cache_folder=cache,
    )
    df = model.get_events_dataframe(video_path=video_path)
    preds, _segments = model.predict(events=df)  # (T, 20484)
    preds = preds.astype(np.float32)
    if np.abs(preds).max() > 0:
        preds = preds / float(np.abs(preds).max())
    frames: list[BrainFrame] = []
    for t in range(preds.shape[0]):
        chunks = np.array_split(preds[t], len(WORKPLACE_REGIONS))
        regions = {
            r: RegionActivation(activation=float(np.clip((c.mean() + 1.0) / 2.0, 0.0, 1.0)))
            for r, c in zip(WORKPLACE_REGIONS, chunks)
        }
        frames.append(BrainFrame(time_s=int(t), regions=regions))
    return frames


async def encode_video(
    video_path: Path,
    scenario: str = "ironsight_workplace",
) -> BrainPattern:
    """Reverse TRIBE V2 inference: produce a `BrainPattern` from a video.

    Set `MOCK_FORWARD=1` to bypass the heavy model.
    """
    video_path = Path(video_path)
    if scenario not in ("ironsight_workplace", "listenlabs_sideshift_consumer"):
        raise ValueError(f"unknown scenario: {scenario!r}")
    if os.environ.get("MOCK_FORWARD") == "1":
        frames = _mock_frames(video_path)
    else:
        frames = _real_frames(video_path)
    return BrainPattern(
        video_id=_video_id(video_path),
        scenario=scenario,  # type: ignore[arg-type]
        frames=frames,
    )
