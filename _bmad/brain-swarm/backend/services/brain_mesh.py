from __future__ import annotations
import sys
from pathlib import Path
import numpy as np

# Try to import Junsoo's atlas helpers (junsoo/ lives at repo root)
_JUNSOO = Path(__file__).parents[3] / "junsoo"
if str(_JUNSOO) not in sys.path:
    sys.path.insert(0, str(_JUNSOO))

try:
    from atlas import load_or_build_labels, YEO7_NAMES
    _HAS_ATLAS = True
except ImportError:
    _HAS_ATLAS = False
    YEO7_NAMES = {
        1: "visual", 2: "somatomotor", 3: "dorsal_attention",
        4: "ventral_attention", 5: "limbic", 6: "frontoparietal", 7: "default_mode",
    }

CACHE_DIR = Path("./cache")

YEO7_COLORS = {
    "visual":           "#ff6b6b",
    "somatomotor":      "#4ecdc4",
    "dorsal_attention": "#45b7d1",
    "ventral_attention":"#f7dc6f",
    "limbic":           "#bb8fce",
    "frontoparietal":   "#82e0aa",
    "default_mode":     "#f0b27a",
}

# Activation threshold per network — fraction of normalized [0,1] scale
# at which a region is considered "firing"
ACTIVATION_THRESHOLD = 0.55


class BrainMesh:
    def __init__(self):
        self.vertices: np.ndarray = None   # (20484, 3) float32
        self.faces: np.ndarray = None      # (N_faces, 3) int32
        self.n_left: int = 0
        self.labels: np.ndarray = None     # (20484,) int32
        self.networks: dict = {}           # name → {centroid, vertex_indices, color, ...}

    def load(self):
        from nilearn import datasets, surface

        print("BrainMesh: loading fsaverage5 inflated surface...")
        fsaverage = datasets.fetch_surf_fsaverage("fsaverage5")

        coords_l, faces_l = surface.load_surf_mesh(fsaverage.infl_left)
        coords_r, faces_r = surface.load_surf_mesh(fsaverage.infl_right)

        self.n_left = len(coords_l)

        # Right hemisphere: offset +10 mm in X to prevent hemisphere overlap
        coords_r = coords_r.copy().astype(np.float32)
        coords_r[:, 0] += 10.0

        self.vertices = np.vstack([coords_l.astype(np.float32), coords_r])
        self.faces = np.vstack([
            faces_l.astype(np.int32),
            faces_r.astype(np.int32) + self.n_left,
        ])

        print(f"  {len(self.vertices)} verts, {len(self.faces)} faces")

        # Yeo7 labels
        CACHE_DIR.mkdir(parents=True, exist_ok=True)
        if _HAS_ATLAS:
            try:
                self.labels = load_or_build_labels(CACHE_DIR, n_networks=7)
                print(f"  Loaded Yeo7 labels: {np.unique(self.labels).tolist()}")
            except Exception as e:
                print(f"  Atlas error: {e} — falling back to synthetic labels")
                self.labels = self._synthetic_labels()
        else:
            print("  atlas.py not found — using synthetic labels")
            self.labels = self._synthetic_labels()

        self._build_networks()
        print(f"  Networks: {list(self.networks.keys())}")

    def use_mock(self):
        """Build a UV sphere mock brain when nilearn is unavailable."""
        print("BrainMesh: generating mock UV-sphere brain...")
        phi = np.linspace(0, np.pi, 60)
        theta = np.linspace(0, 2 * np.pi, 80)
        P, T = np.meshgrid(phi, theta)
        R = 90.0
        x = R * np.sin(P) * np.cos(T)
        y = R * np.cos(P)
        z = R * np.sin(P) * np.sin(T)
        verts = np.stack([x.ravel(), y.ravel(), z.ravel()], axis=1).astype(np.float32)

        # Triangulate the grid
        rows, cols = T.shape
        faces = []
        for r in range(rows - 1):
            for c in range(cols - 1):
                i = r * cols + c
                faces += [[i, i + 1, i + cols], [i + 1, i + cols + 1, i + cols]]
        self.vertices = verts
        self.faces = np.array(faces, dtype=np.int32)
        self.n_left = len(verts) // 2
        self.labels = self._synthetic_labels()
        self._build_networks()
        print(f"  Mock mesh: {len(self.vertices)} verts, {len(self.faces)} faces")

    def _build_networks(self):
        for label_id, name in YEO7_NAMES.items():
            mask = self.labels == label_id
            centroid = self.vertices[mask].mean(axis=0) if mask.any() else np.zeros(3, dtype=np.float32)
            self.networks[name] = {
                "centroid": centroid.astype(np.float32),
                "vertex_indices": np.where(mask)[0],
                "color": YEO7_COLORS.get(name, "#ffffff"),
                "label_id": label_id,
                "activation_threshold": ACTIVATION_THRESHOLD,
            }

    def _synthetic_labels(self) -> np.ndarray:
        """Fallback: evenly partition vertices into 7 networks."""
        n = len(self.vertices) if self.vertices is not None else 20484
        labels = np.zeros(n, dtype=np.int32)
        block = n // 8
        for i in range(1, 8):
            labels[(i - 1) * block: i * block] = i
        return labels

    def to_dict(self) -> dict:
        return {
            "vertices": self.vertices.flatten().tolist(),
            "faces": self.faces.flatten().tolist(),
            "n_vertices": int(len(self.vertices)),
            "n_left": int(self.n_left),
            "networks": {
                name: {
                    "centroid": data["centroid"].tolist(),
                    "color": data["color"],
                    "vertex_indices": data["vertex_indices"].tolist(),
                }
                for name, data in self.networks.items()
            },
        }
