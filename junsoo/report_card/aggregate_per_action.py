"""Mean-pool per-second activity.json regions across action segments.

Reads two JSON inputs:
    1. activity.json      — per-second Yeo7 activations from aggregate.py
    2. action_segments.json — manually annotated [{start_t, end_t, action}, ...]

Emits per_action_activations.json matching Contract A in PERSON_A_PIPELINE.md:

[
  {
    "action": "pick up drill",
    "t_start": 12,
    "t_end": 25,
    "regions": {"visual": 0.62, "somatomotor": 0.71, ...},
    "stimulus": "Optional concat of transcript text in the window"
  },
  ...
]

Slice semantics: [start_t, end_t) — start inclusive, end exclusive.
A segment whose window contains no frames is skipped with a warning rather
than written as zeros (silent zeros would mislead the synthesizer).

Usage:
    python aggregate_per_action.py \
        --activity prerendered/clip1/activity.json \
        --segments prerendered/clip1/action_segments.json \
        --out      prerendered/clip1/per_action_activations.json
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

YEO7_KEYS = (
    "visual",
    "somatomotor",
    "dorsal_attention",
    "ventral_attention",
    "limbic",
    "frontoparietal",
    "default_mode",
)


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument(
        "--activity",
        type=Path,
        required=True,
        help="Input activity.json from aggregate.py",
    )
    p.add_argument(
        "--segments",
        type=Path,
        required=True,
        help="Input action_segments.json (manual annotation)",
    )
    p.add_argument(
        "--out",
        type=Path,
        required=True,
        help="Output per_action_activations.json path",
    )
    return p.parse_args()


def load_activity(path: Path) -> list[dict[str, Any]]:
    blob = json.loads(path.read_text())
    frames = blob.get("frames")
    if not isinstance(frames, list):
        raise ValueError(f"{path}: missing or malformed 'frames' list")
    return frames


def load_segments(path: Path) -> list[dict[str, Any]]:
    segs = json.loads(path.read_text())
    if not isinstance(segs, list):
        raise ValueError(f"{path}: expected a top-level JSON array")
    for i, seg in enumerate(segs):
        for key in ("start_t", "end_t", "action"):
            if key not in seg:
                raise ValueError(f"{path}[{i}]: missing key {key!r}")
        if seg["end_t"] <= seg["start_t"]:
            raise ValueError(
                f"{path}[{i}]: end_t ({seg['end_t']}) must be > start_t ({seg['start_t']})"
            )
    return segs


def slice_frames(
    frames: list[dict[str, Any]], start_t: float, end_t: float
) -> list[dict[str, Any]]:
    """Return frames with t_s in [start_t, end_t)."""
    return [f for f in frames if start_t <= f["t_s"] < end_t]


def mean_regions(window: list[dict[str, Any]]) -> dict[str, float]:
    """Mean-pool the 7 Yeo7 region values across the window's frames."""
    sums: dict[str, float] = {k: 0.0 for k in YEO7_KEYS}
    n = 0
    for frame in window:
        regions = frame.get("regions", {})
        for k in YEO7_KEYS:
            if k not in regions:
                raise ValueError(
                    f"frame t_s={frame.get('t_s')!r} missing region key {k!r}"
                )
            sums[k] += float(regions[k])
        n += 1
    if n == 0:
        raise ValueError("mean_regions called on empty window")
    return {k: sums[k] / n for k in YEO7_KEYS}


def concat_stimulus(window: list[dict[str, Any]]) -> str | None:
    """Join unique non-empty stimulus snippets in window order."""
    seen: set[str] = set()
    parts: list[str] = []
    for frame in window:
        text = frame.get("stimulus")
        if isinstance(text, str):
            t = text.strip()
            if t and t not in seen:
                seen.add(t)
                parts.append(t)
    if not parts:
        return None
    return " ".join(parts)


def aggregate_per_action(
    frames: list[dict[str, Any]], segments: list[dict[str, Any]]
) -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []
    for seg in segments:
        start_t = seg["start_t"]
        end_t = seg["end_t"]
        window = slice_frames(frames, start_t, end_t)
        if not window:
            print(
                f"[warn] action {seg['action']!r} window [{start_t},{end_t}) "
                f"contained no frames; skipping (check segment vs activity bounds)"
            )
            continue
        entry: dict[str, Any] = {
            "action": seg["action"],
            "t_start": start_t,
            "t_end": end_t,
            "regions": mean_regions(window),
        }
        stim = concat_stimulus(window)
        if stim is not None:
            entry["stimulus"] = stim
        out.append(entry)
    return out


def main() -> None:
    args = parse_args()

    frames = load_activity(args.activity)
    segments = load_segments(args.segments)
    print(f"Loaded {len(frames)} per-second frames from {args.activity}")
    print(f"Loaded {len(segments)} action segments from {args.segments}")

    per_action = aggregate_per_action(frames, segments)

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(per_action, indent=2))
    print(f"Wrote {args.out} ({len(per_action)} actions)")


if __name__ == "__main__":
    main()
