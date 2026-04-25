from __future__ import annotations
import json
from pathlib import Path
from typing import Any, Literal
import numpy as np

YEO7_NAMES = {
    1: "visual", 2: "somatomotor", 3: "dorsal_attention",
    4: "ventral_attention", 5: "limbic", 6: "frontoparietal", 7: "default_mode",
}

N_VERTS = 20484

DataSource = Literal["preds_npz_with_json", "preds_npz_only", "json_only", "synthetic"]


def _generate_synthetic(n_frames: int = 120) -> np.ndarray:
    """Fallback: 7 networks pulse in round-robin at 1 Hz with noise."""
    rng = np.random.default_rng(42)
    preds = rng.normal(0, 0.04, (n_frames, N_VERTS)).astype(np.float32)
    block = N_VERTS // 8
    for t in range(n_frames):
        net = t % 7
        amp = 0.5 + 0.5 * np.sin(2 * np.pi * t / 14)
        preds[t, net * block: (net + 1) * block] += amp
    preds = np.clip(preds / (preds.max() + 1e-6), 0, 1)
    return preds


def _normalize_vertex(raw: np.ndarray) -> np.ndarray:
    """Per-vertex z-score → sigmoid squeeze to [0, 1]."""
    mean = raw.mean(axis=0)
    std = raw.std(axis=0) + 1e-6
    z = (raw - mean) / std
    return np.clip((z + 3.0) / 6.0, 0.0, 1.0).astype(np.float32)


def _normalize_region_frames(frames: list[dict]) -> list[dict]:
    """Per-region min-max normalize across all frames so values land in [0,1].

    aggregate.py emits raw per-network mean activations which can be negative or
    >1. The orchestrator's SPIKE_THRESHOLD and the frontend glow shaders expect
    [0,1]. We normalize per-network independently so each network's dynamic
    range is preserved, and we don't lose the relative-ranking information the
    JSON encodes.

    Each frame['regions'] is replaced; everything else (t_s, top_region,
    stimulus, ...) is preserved verbatim.
    """
    if not frames:
        return frames

    network_names = sorted({k for f in frames for k in f.get("regions", {})})
    if not network_names:
        return frames

    # Build (T, N) matrix of raw values
    T = len(frames)
    N = len(network_names)
    mat = np.zeros((T, N), dtype=np.float32)
    for t, frame in enumerate(frames):
        regions = frame.get("regions", {})
        for j, name in enumerate(network_names):
            mat[t, j] = float(regions.get(name, 0.0))

    # Per-network min-max → [0,1]
    mins = mat.min(axis=0, keepdims=True)
    maxs = mat.max(axis=0, keepdims=True)
    rng = (maxs - mins) + 1e-6
    norm = np.clip((mat - mins) / rng, 0.0, 1.0)

    out = []
    for t, frame in enumerate(frames):
        new_regions = {name: float(norm[t, j]) for j, name in enumerate(network_names)}
        new_frame = dict(frame)
        new_frame["regions"] = new_regions
        # Recompute top_region against normalized values (was based on raw)
        new_frame["top_region"] = max(new_regions, key=lambda k: new_regions[k])
        out.append(new_frame)
    return out


class ActivityReader:
    def __init__(self, data_dir: Path):
        self.data_dir = Path(data_dir)
        self._preds: np.ndarray = None   # (T, 20484) float32 normalized [0,1]
        self._frames: list[dict] = []    # Junsoo activity.json frame list, normalized
        self.n_frames: int = 0
        self.data_source: DataSource = "synthetic"
        self.stimulus_label: str = ""    # original .mp4/.txt path or empty

    def load(self):
        """(Re-)load preds.npz + activity.json from data_dir.

        Safe to call repeatedly — used by POST /brain/reload after a fresh
        infer_pipeline.sh run drops new files.
        """
        preds_path = self.data_dir / "preds.npz"
        activity_path = self.data_dir / "activity.json"

        has_preds = preds_path.exists()
        has_json = activity_path.exists()

        if has_preds:
            data = np.load(preds_path, allow_pickle=False)
            raw = data["preds"].astype(np.float32)
            self._preds = _normalize_vertex(raw)
            print(f"ActivityReader: loaded preds {self._preds.shape}")
        else:
            print("ActivityReader: no preds.npz — using synthetic activations")
            self._preds = _generate_synthetic()

        self.n_frames = self._preds.shape[0]

        if has_json:
            blob = json.loads(activity_path.read_text())
            raw_frames = blob.get("frames", [])
            self._frames = _normalize_region_frames(raw_frames)
            self.stimulus_label = str(blob.get("stimulus", ""))
            print(
                f"ActivityReader: loaded activity.json ({len(self._frames)} frames, "
                f"normalized per-network to [0,1])"
            )
        else:
            self._frames = []
            self.stimulus_label = ""
            print("ActivityReader: no activity.json — network values derived from vertex data")

        if has_preds and has_json:
            self.data_source = "preds_npz_with_json"
        elif has_preds:
            self.data_source = "preds_npz_only"
        elif has_json:
            self.data_source = "json_only"
        else:
            self.data_source = "synthetic"

    def reload(self) -> dict[str, Any]:
        """Public reload hook for POST /brain/reload. Returns load summary."""
        self.load()
        return {
            "n_frames": self.n_frames,
            "data_source": self.data_source,
            "stimulus_label": self.stimulus_label,
        }

    def get_vertex_frame(self, t: int) -> np.ndarray:
        return self._preds[t % self.n_frames]

    def get_network_frame(self, t: int) -> dict[str, Any]:
        if self._frames:
            return self._frames[t % len(self._frames)]
        # Derive network means directly from normalized vertex predictions
        frame = self._preds[t % self.n_frames]
        block = N_VERTS // 8
        regions: dict[str, float] = {}
        for label_id, name in YEO7_NAMES.items():
            start = (label_id - 1) * block
            end = label_id * block
            regions[name] = float(frame[start:end].mean())
        top = max(regions, key=lambda k: regions[k])
        return {"t_s": t, "regions": regions, "top_region": top}
