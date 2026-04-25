"""Run TRIBE V2 inference on a stimulus and save raw predictions to .npz.

Mirrors cells 1-8 of the upstream tribe_demo.ipynb but skips PlotBrain so we
can run headless on a cloud GPU. Pair the resulting .npz with aggregate.py to
emit per-region JSON.

Usage:
    python run_inference.py --video path/to/video.mp4 --out preds.npz
    python run_inference.py --text  path/to/passage.txt --out preds.npz
    python run_inference.py --audio path/to/audio.wav   --out preds.npz
"""
from __future__ import annotations

import argparse
import json
import pickle
from pathlib import Path

import numpy as np


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description=__doc__)
    src = p.add_mutually_exclusive_group(required=True)
    src.add_argument("--video", type=Path, help="Path to a video file (.mp4 etc.)")
    src.add_argument("--text", type=Path, help="Path to a .txt file")
    src.add_argument("--audio", type=Path, help="Path to an audio file (.wav etc.)")
    p.add_argument("--out", type=Path, required=True, help="Output .npz path")
    p.add_argument(
        "--cache",
        type=Path,
        default=Path("./cache"),
        help="HuggingFace cache folder (default ./cache)",
    )
    p.add_argument(
        "--model-id",
        default="facebook/tribev2",
        help="HuggingFace model id (default facebook/tribev2)",
    )
    return p.parse_args()


def main() -> None:
    args = parse_args()

    # Imports deferred so --help works on machines without torch installed.
    from tribev2.demo_utils import TribeModel

    args.cache.mkdir(parents=True, exist_ok=True)
    model = TribeModel.from_pretrained(args.model_id, cache_folder=args.cache)

    if args.video is not None:
        df = model.get_events_dataframe(video_path=args.video)
        stimulus = str(args.video)
    elif args.text is not None:
        df = model.get_events_dataframe(text_path=args.text)
        stimulus = str(args.text)
    else:
        df = model.get_events_dataframe(audio_path=args.audio)
        stimulus = str(args.audio)

    preds, segments = model.predict(events=df)
    print(f"Predictions shape: {preds.shape}  (n_timesteps, n_vertices)")

    args.out.parent.mkdir(parents=True, exist_ok=True)

    # `segments` is a list of objects from neuralset that may not be plain
    # numpy-saveable, so we pickle it alongside the array. Aggregator only
    # needs the predictions tensor + a stimulus tag; segments is optional
    # context for richer JSON output.
    segments_path = args.out.with_suffix(".segments.pkl")
    with open(segments_path, "wb") as f:
        pickle.dump(segments, f)

    np.savez(
        args.out,
        preds=preds.astype(np.float32),
        stimulus=np.array(stimulus),
        n_timesteps=np.array(preds.shape[0]),
        n_vertices=np.array(preds.shape[1]),
    )

    meta_path = args.out.with_suffix(".meta.json")
    meta_path.write_text(
        json.dumps(
            {
                "stimulus": stimulus,
                "n_timesteps": int(preds.shape[0]),
                "n_vertices": int(preds.shape[1]),
                "segments_pickle": str(segments_path),
            },
            indent=2,
        )
    )
    print(f"Saved preds -> {args.out}")
    print(f"Saved segments -> {segments_path}")
    print(f"Saved meta -> {meta_path}")


if __name__ == "__main__":
    main()
