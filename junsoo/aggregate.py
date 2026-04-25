"""Aggregate TRIBE V2's (T, 20484) vertex predictions into per-network JSON.

Reads the .npz produced by run_inference.py, looks up the cached Yeo network
labels for fsaverage5 (or builds them on first run), and emits a JSON document
of the form:

{
  "stimulus": "cache/sample_video.mp4",
  "atlas": "yeo7",
  "fps": 1,
  "n_timesteps": 53,
  "frames": [
    {
      "t_s": 0,
      "regions": {"visual": 0.42, "somatomotor": 0.05, ...},
      "top_region": "visual",
      "stimulus": "What brings you to the land of the gatekeepers?"
    },
    ...
  ]
}

Predictions are offset 5 s into the past (HRF compensation) — TRIBE's API
returns this offset already applied; we pass timesteps through verbatim.

Usage:
    python aggregate.py --preds preds.npz --out activity.json
    python aggregate.py --preds preds.npz --out activity.json --atlas yeo17
"""
from __future__ import annotations

import argparse
import json
import pickle
from pathlib import Path
from typing import Any

import numpy as np

from atlas import (
    UNASSIGNED,
    load_or_build_labels,
    network_names,
)


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--preds", type=Path, required=True, help="Input .npz from run_inference.py")
    p.add_argument("--out", type=Path, required=True, help="Output .json path")
    p.add_argument(
        "--atlas",
        choices=("yeo7", "yeo17"),
        default="yeo7",
        help="Granularity (default yeo7)",
    )
    p.add_argument(
        "--cache",
        type=Path,
        default=Path("./cache"),
        help="Atlas cache folder (default ./cache)",
    )
    p.add_argument(
        "--include-unassigned",
        action="store_true",
        help="Include 'unassigned' (label 0) verts as their own bucket",
    )
    p.add_argument(
        "--segments",
        type=Path,
        default=None,
        help="Optional .segments.pkl from run_inference.py to enrich each frame "
        "with the stimulus text/segment that produced it",
    )
    return p.parse_args()


def aggregate_per_timestep(
    preds: np.ndarray,
    labels: np.ndarray,
    names: dict[int, str],
    include_unassigned: bool = False,
) -> list[dict[str, Any]]:
    """Mean-pool preds[t, vertices_in_network] for each network, each timestep.

    preds : (T, V) float
    labels : (V,) int  — 0 = unassigned, 1..N = networks
    names : {label_id: network_name}

    Returns list of T dicts {"regions": {name: float}, "top_region": name}.
    """
    if preds.shape[1] != labels.shape[0]:
        raise ValueError(
            f"preds has {preds.shape[1]} verts but labels has {labels.shape[0]}"
        )

    # Pre-compute vertex masks per label so we don't redo masking per timestep.
    masks: dict[str, np.ndarray] = {}
    for lid, name in names.items():
        mask = labels == lid
        if mask.any():
            masks[name] = mask
    if include_unassigned:
        unassigned = labels == 0
        if unassigned.any():
            masks[UNASSIGNED] = unassigned

    frames = []
    for t in range(preds.shape[0]):
        row = preds[t]
        per_region = {name: float(row[mask].mean()) for name, mask in masks.items()}
        top_region = max(per_region.items(), key=lambda kv: kv[1])[0]
        frames.append(
            {
                "t_s": int(t),
                "regions": per_region,
                "top_region": top_region,
            }
        )
    return frames


def attach_stimulus_text(frames: list[dict[str, Any]], segments_path: Path) -> None:
    """Best-effort enrichment: walk segments and pin a short text snippet per frame.

    We don't know the exact internal shape of TRIBE's segments objects across
    versions, so we treat any 'text' attribute / dict key as the snippet. If
    nothing extractable is found for a timestep, the field is omitted.
    """
    try:
        with open(segments_path, "rb") as f:
            segments = pickle.load(f)
    except Exception as e:
        print(f"[warn] could not load segments from {segments_path}: {e}")
        return

    def extract_text(seg: Any) -> str | None:
        if seg is None:
            return None
        for attr in ("text", "context", "content", "label"):
            if hasattr(seg, attr):
                v = getattr(seg, attr)
                if isinstance(v, str) and v.strip():
                    return v.strip()
            if isinstance(seg, dict) and attr in seg:
                v = seg[attr]
                if isinstance(v, str) and v.strip():
                    return v.strip()
        return None

    for t, frame in enumerate(frames):
        if t >= len(segments):
            break
        text = extract_text(segments[t])
        if text:
            frame["stimulus"] = text


def main() -> None:
    args = parse_args()

    n_networks = 7 if args.atlas == "yeo7" else 17
    names = network_names(n_networks)

    data = np.load(args.preds, allow_pickle=False)
    preds = data["preds"]
    stimulus = str(data["stimulus"]) if "stimulus" in data else None
    print(f"Loaded preds: shape={preds.shape} stimulus={stimulus!r}")

    labels = load_or_build_labels(args.cache, n_networks)
    print(f"Loaded labels: shape={labels.shape} unique={np.unique(labels).tolist()}")

    frames = aggregate_per_timestep(
        preds, labels, names, include_unassigned=args.include_unassigned
    )

    if args.segments is not None and args.segments.exists():
        attach_stimulus_text(frames, args.segments)

    out = {
        "stimulus": stimulus,
        "atlas": args.atlas,
        "fps": 1,
        "n_timesteps": preds.shape[0],
        "n_vertices": preds.shape[1],
        "frames": frames,
    }

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(out, indent=2))
    print(f"Wrote {args.out} ({len(frames)} frames)")


if __name__ == "__main__":
    main()
