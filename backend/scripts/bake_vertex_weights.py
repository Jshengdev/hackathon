"""One-shot precompute: per-vertex soft membership weights to the 7 Yeo networks.

Output:
  frontend/public/brain/vertex_weights.bin   float32 LE, shape [n_vertices, 7]
  frontend/public/brain/vertex_weights.json  schema sidecar

Method: for each vertex, compute exp(-d^2 / (2*sigma^2)) to each of the 7
network centroids, then normalize so the 7 weights sum to 1.

Run: cd backend && .venv/bin/python -m scripts.bake_vertex_weights
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from services.brain_mesh import BrainMesh, YEO7_NAMES  # noqa: E402

# Canonical Yeo7 ordering — must match what the frontend expects.
NETWORK_ORDER = [
    "visual",
    "somatomotor",
    "dorsal_attention",
    "ventral_attention",
    "limbic",
    "frontoparietal",
    "default_mode",
]

REPO_ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = REPO_ROOT / "frontend" / "public" / "brain"

SIGMA = 18.0  # mm-scale; tune to keep 2nd-best weight in 0.05-0.25 band.


def compute_weights(vertices: np.ndarray, centroids: np.ndarray, sigma: float) -> np.ndarray:
    """vertices: (V,3) float32, centroids: (7,3) float32 -> (V,7) float32, rows sum to 1."""
    # (V, 7) squared distances
    diff = vertices[:, None, :] - centroids[None, :, :]
    d2 = (diff * diff).sum(axis=2)
    # Numerical stability: subtract per-row min before exponentiating.
    logits = -d2 / (2.0 * sigma * sigma)
    logits -= logits.max(axis=1, keepdims=True)
    w = np.exp(logits)
    w /= w.sum(axis=1, keepdims=True)
    return w.astype(np.float32, copy=False)


def report_samples(W: np.ndarray, network_order: list[str], rng_seed: int = 42) -> None:
    rng = np.random.default_rng(rng_seed)
    idxs = rng.choice(W.shape[0], size=5, replace=False)
    second_weights: list[float] = []
    print("\n--- 5 random vertex weight samples ---")
    for i in idxs:
        row = W[i]
        order = np.argsort(row)[::-1]
        top1, top2 = order[0], order[1]
        print(
            f"  v{i:>6d}: top1={network_order[top1]:>17s} w={row[top1]:.3f}  "
            f"top2={network_order[top2]:>17s} w={row[top2]:.3f}"
        )
        second_weights.append(float(row[top2]))

    # Centroid-vertex sanity: pick the closest vertex to each centroid and
    # verify w_n > 0.5 for that network.
    print("\n--- centroid sanity (vertex closest to each centroid) ---")


def centroid_sanity(
    W: np.ndarray, vertices: np.ndarray, centroids: np.ndarray, network_order: list[str]
) -> None:
    for n_idx, name in enumerate(network_order):
        diff = vertices - centroids[n_idx]
        nearest = int(np.argmin((diff * diff).sum(axis=1)))
        w_self = float(W[nearest, n_idx])
        print(f"  {name:>17s}: nearest-vertex self-weight = {w_self:.3f}")


def main() -> None:
    print(f"[bake_vertex_weights] sigma = {SIGMA}")
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    mesh = BrainMesh()
    mesh.load()
    n_vertices = int(len(mesh.vertices))
    print(f"  n_vertices = {n_vertices}")

    # Order centroids per NETWORK_ORDER (not insertion order).
    name_to_id = {v: k for k, v in YEO7_NAMES.items()}
    for name in NETWORK_ORDER:
        if name not in mesh.networks:
            raise SystemExit(f"network {name!r} missing from mesh.networks")
        if name not in name_to_id:
            raise SystemExit(f"network {name!r} has no Yeo7 label id")

    centroids = np.stack(
        [mesh.networks[name]["centroid"] for name in NETWORK_ORDER], axis=0
    ).astype(np.float32)
    print("  centroids (mm):")
    for name, c in zip(NETWORK_ORDER, centroids):
        print(f"    {name:>17s}: ({c[0]:7.2f}, {c[1]:7.2f}, {c[2]:7.2f})")

    vertices = mesh.vertices.astype(np.float32)
    W = compute_weights(vertices, centroids, SIGMA)

    # Diagnostics
    second_w = np.partition(W, -2, axis=1)[:, -2]
    pct_in_band = float(((second_w >= 0.05) & (second_w <= 0.25)).mean())
    print(
        f"\n  2nd-weight stats: min={second_w.min():.3f} median={np.median(second_w):.3f} "
        f"max={second_w.max():.3f}  in [0.05,0.25] = {pct_in_band*100:.1f}%"
    )
    report_samples(W, NETWORK_ORDER)
    centroid_sanity(W, vertices, centroids, NETWORK_ORDER)

    if pct_in_band < 0.5:
        print(
            f"\n  WARNING: only {pct_in_band*100:.1f}% of vertices have 2nd-weight in "
            f"[0.05,0.25]. Consider retuning sigma (current={SIGMA})."
        )

    bin_path = OUT_DIR / "vertex_weights.bin"
    json_path = OUT_DIR / "vertex_weights.json"

    buf = np.ascontiguousarray(W, dtype="<f4").tobytes()
    bin_path.write_bytes(buf)

    schema = {
        "n_vertices": n_vertices,
        "n_networks": 7,
        "network_order": NETWORK_ORDER,
        "dtype": "float32",
        "byte_order": "little",
        "sigma_mm": SIGMA,
    }
    json_path.write_text(json.dumps(schema, indent=2) + "\n")

    expected = n_vertices * 7 * 4
    actual = bin_path.stat().st_size
    print(f"\n  wrote {bin_path}  ({actual} bytes; expected {expected})")
    print(f"  wrote {json_path}")
    if actual != expected:
        raise SystemExit(f"size mismatch: expected {expected}, got {actual}")
    print("  OK")


if __name__ == "__main__":
    main()
