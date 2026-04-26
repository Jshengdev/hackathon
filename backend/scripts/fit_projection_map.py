"""Fit the 384 -> 7 projection matrix W from training_pairs.yaml.

Run from repo root:
    python backend/scripts/fit_projection_map.py
"""
from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
import yaml

REPO_ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO_ROOT))

from backend.services.embedding_proxy import EMBEDDING_DIM, NETWORKS, embed_text

PAIRS_PATH = REPO_ROOT / "backend" / "services" / "embedding_proxy" / "training_pairs.yaml"
OUT_PATH = REPO_ROOT / "backend" / "services" / "embedding_proxy" / "projection_map.npy"


def main() -> None:
    raw = yaml.safe_load(PAIRS_PATH.read_text())
    pairs = raw["pairs"]
    print(f"loaded {len(pairs)} pairs from {PAIRS_PATH.name}")

    X = np.zeros((len(pairs), EMBEDDING_DIM), dtype=np.float32)
    Y = np.zeros((len(pairs), len(NETWORKS)), dtype=np.float32)

    for i, p in enumerate(pairs):
        X[i] = embed_text(p["paragraph"])
        Y[i] = np.array([p["activation"][n] for n in NETWORKS], dtype=np.float32)
        print(f"  pair {i:2d} [{p['scenario']:9s}]: ||emb||={np.linalg.norm(X[i]):.2f}")

    W, residuals, rank, sv = np.linalg.lstsq(X, Y, rcond=None)
    pred = X @ W
    rmse = float(np.sqrt(((pred - Y) ** 2).mean()))
    print(f"\nfit: W shape={W.shape} rank={rank} rmse={rmse:.4f}")

    np.save(OUT_PATH, W.astype(np.float32))
    print(f"wrote {OUT_PATH} ({OUT_PATH.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
