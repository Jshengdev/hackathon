from __future__ import annotations
import json
from pathlib import Path
from typing import Any
import numpy as np

YEO7_NAMES = {
    1: "visual", 2: "somatomotor", 3: "dorsal_attention",
    4: "ventral_attention", 5: "limbic", 6: "frontoparietal", 7: "default_mode",
}

N_VERTS = 20484


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


def _normalize(raw: np.ndarray) -> np.ndarray:
    """Per-vertex z-score → sigmoid squeeze to [0, 1]."""
    mean = raw.mean(axis=0)
    std = raw.std(axis=0) + 1e-6
    z = (raw - mean) / std
    return np.clip((z + 3.0) / 6.0, 0.0, 1.0).astype(np.float32)


class ActivityReader:
    def __init__(self, data_dir: Path):
        self.data_dir = Path(data_dir)
        self._preds: np.ndarray = None   # (T, 20484) float32 normalized [0,1]
        self._frames: list[dict] = []    # Junsoo activity.json frame list
        self.n_frames: int = 0

    def load(self):
        preds_path = self.data_dir / "preds.npz"
        activity_path = self.data_dir / "activity.json"

        if preds_path.exists():
            data = np.load(preds_path, allow_pickle=False)
            raw = data["preds"].astype(np.float32)
            self._preds = _normalize(raw)
            print(f"ActivityReader: loaded preds {self._preds.shape}")
        else:
            print("ActivityReader: no preds.npz — using synthetic activations")
            self._preds = _generate_synthetic()

        self.n_frames = self._preds.shape[0]

        if activity_path.exists():
            blob = json.loads(activity_path.read_text())
            self._frames = blob.get("frames", [])
            print(f"ActivityReader: loaded activity.json ({len(self._frames)} frames)")
        else:
            print("ActivityReader: no activity.json — network values derived from vertex data")

    def get_vertex_frame(self, t: int) -> np.ndarray:
        return self._preds[t % self.n_frames]

    def get_network_frame(self, t: int) -> dict[str, Any]:
        if self._frames:
            return self._frames[t % len(self._frames)]
        # Derive network means directly from vertex predictions
        frame = self._preds[t % self.n_frames]
        block = N_VERTS // 8
        regions: dict[str, float] = {}
        for label_id, name in YEO7_NAMES.items():
            start = (label_id - 1) * block
            end = label_id * block
            regions[name] = float(frame[start:end].mean())
        top = max(regions, key=lambda k: regions[k])
        return {"t_s": t, "regions": regions, "top_region": top}
