"""Smoke test for the aggregator using synthetic (T, 20484) data.

Validates the JSON shape and the per-timestep aggregation logic without
needing nilearn, a GPU, the TRIBE V2 weights, or any network access — so
we can prove the JSON pipeline before paying for a cloud GPU.

What we test:
    1. aggregate_per_timestep returns the expected number of frames.
    2. Each frame has every Yeo 7-network name as a key in `regions`.
    3. When we synthetically inject high signal in network N at timestep N,
       `top_region` for that frame matches the expected network name.
    4. The full output is JSON-serializable.

Run:
    python smoke_test.py
"""
from __future__ import annotations

import json
import sys

import numpy as np

from aggregate import aggregate_per_timestep
from atlas import N_FSAVERAGE5_BILATERAL, YEO7_NAMES


def make_synthetic_labels(n_vertices: int, n_networks: int) -> np.ndarray:
    """Partition n_vertices into n_networks roughly-equal blocks (labels 1..N).

    Leaves a small `unassigned` band (label 0) at the end to mirror the real
    Yeo atlas which has unassigned medial-wall vertices.
    """
    labels = np.zeros(n_vertices, dtype=np.int32)
    block = n_vertices // (n_networks + 1)
    for net_id in range(1, n_networks + 1):
        start = (net_id - 1) * block
        end = net_id * block
        labels[start:end] = net_id
    return labels


def make_synthetic_preds(
    labels: np.ndarray, n_timesteps: int, n_networks: int, rng: np.random.Generator
) -> np.ndarray:
    """At timestep t, network ((t % n_networks) + 1) gets a strong positive bump."""
    preds = rng.normal(loc=0.0, scale=0.1, size=(n_timesteps, labels.shape[0])).astype(
        np.float32
    )
    for t in range(n_timesteps):
        target_network = (t % n_networks) + 1
        preds[t, labels == target_network] += 1.0
    return preds


def main() -> int:
    rng = np.random.default_rng(seed=42)
    n_networks = 7
    n_timesteps = 14  # two full passes through the 7 networks

    labels = make_synthetic_labels(N_FSAVERAGE5_BILATERAL, n_networks)
    preds = make_synthetic_preds(labels, n_timesteps, n_networks, rng)

    frames = aggregate_per_timestep(preds, labels, YEO7_NAMES)

    # 1. Frame count
    assert len(frames) == n_timesteps, f"expected {n_timesteps} frames, got {len(frames)}"

    # 2. Region keys present
    for t, frame in enumerate(frames):
        assert set(frame["regions"].keys()) == set(YEO7_NAMES.values()), (
            f"frame {t} regions={list(frame['regions'].keys())}"
        )
        assert "top_region" in frame
        assert "t_s" in frame and frame["t_s"] == t

    # 3. top_region tracks the injected signal
    expected_order = list(YEO7_NAMES.values())  # label 1 -> visual, 2 -> somatomotor, etc.
    for t, frame in enumerate(frames):
        expected = expected_order[t % n_networks]
        assert frame["top_region"] == expected, (
            f"frame {t}: top_region={frame['top_region']!r} expected={expected!r}"
        )

    # 4. JSON round-trip
    blob = {
        "stimulus": "synthetic://smoke-test",
        "atlas": "yeo7",
        "fps": 1,
        "n_timesteps": n_timesteps,
        "n_vertices": int(N_FSAVERAGE5_BILATERAL),
        "frames": frames,
    }
    serialized = json.dumps(blob, indent=2)
    parsed = json.loads(serialized)
    assert parsed["frames"][0]["top_region"] == "visual"

    # Pretty-print first 3 frames so the human can eyeball it
    print("OK — first 3 frames:")
    for frame in frames[:3]:
        regions_str = ", ".join(f"{k}={v:+.2f}" for k, v in frame["regions"].items())
        print(f"  t={frame['t_s']}s  top={frame['top_region']:<18}  {regions_str}")
    print(f"\nSmoke test passed. {n_timesteps} frames × {n_networks} networks.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
