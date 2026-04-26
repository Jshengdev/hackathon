"""Build / load Yeo 7- or 17-network labels on the fsaverage5 surface.

TRIBE V2 emits predictions over 20,484 vertices (10,242 per hemisphere on the
fsaverage5 mesh). To answer "which part of the brain is active", we group those
vertices into Yeo's canonical functional networks via:

    1. Fetch Yeo's volumetric atlas from nilearn (MNI152, NIfTI).
    2. Project nearest-neighbour onto the fsaverage5 pial surface for each
       hemisphere using nilearn.surface.vol_to_surf.
    3. Concatenate hemispheres into a single (20484,) int32 label array,
       where 0 = unassigned, 1..N = Yeo networks.

Result is cached to disk so the slow projection only runs once.

Yeo 7-network names (in label order 1..7) are the canonical labels from
Yeo et al. 2011, J. Neurophysiol.
"""
from __future__ import annotations

from pathlib import Path

import numpy as np

YEO7_NAMES = {
    1: "visual",
    2: "somatomotor",
    3: "dorsal_attention",
    4: "ventral_attention",
    5: "limbic",
    6: "frontoparietal",
    7: "default_mode",
}

YEO17_NAMES = {
    1: "visual_central",
    2: "visual_peripheral",
    3: "somatomotor_a",
    4: "somatomotor_b",
    5: "dorsal_attention_a",
    6: "dorsal_attention_b",
    7: "ventral_attention",
    8: "salience",
    9: "limbic_a",
    10: "limbic_b",
    11: "control_a",
    12: "control_b",
    13: "control_c",
    14: "default_a",
    15: "default_b",
    16: "default_c",
    17: "temporal_parietal",
}

UNASSIGNED = "unassigned"
N_FSAVERAGE5_BILATERAL = 20484  # 10242 verts × 2 hemis


def network_names(n_networks: int) -> dict[int, str]:
    if n_networks == 7:
        return YEO7_NAMES
    if n_networks == 17:
        return YEO17_NAMES
    raise ValueError(f"n_networks must be 7 or 17, got {n_networks}")


def labels_cache_path(cache_dir: Path, n_networks: int) -> Path:
    return cache_dir / f"yeo{n_networks}_fsaverage5_labels.npy"


def build_yeo_labels(cache_dir: Path, n_networks: int = 7) -> np.ndarray:
    """Project Yeo volumetric atlas to fsaverage5; return (20484,) int32 array.

    Hemispheres are concatenated [left, right] to match TRIBE's vstack order
    (see tribev2.utils_fmri.TribeSurfaceProjector.apply line 226).
    """
    from nilearn import datasets, surface

    cache_dir.mkdir(parents=True, exist_ok=True)
    cached = labels_cache_path(cache_dir, n_networks)
    if cached.exists():
        return np.load(cached)

    if n_networks not in (7, 17):
        raise ValueError(f"n_networks must be 7 or 17, got {n_networks}")
    atlas = datasets.fetch_atlas_yeo_2011(n_networks=n_networks, thickness="thick")
    atlas_img = atlas["maps"]

    fsaverage = datasets.fetch_surf_fsaverage(mesh="fsaverage5")

    hemispheres = []
    for hemi in ("left", "right"):
        labels_hemi = surface.vol_to_surf(
            atlas_img,
            surf_mesh=fsaverage[f"pial_{hemi}"],
            inner_mesh=fsaverage[f"white_{hemi}"],
            interpolation="nearest_most_frequent",
        )
        # vol_to_surf can return float labels with shape (n_vertices,) or
        # (n_vertices, 1); squeeze and round to nearest integer.
        labels_hemi = np.asarray(labels_hemi).squeeze().round().astype(np.int32)
        hemispheres.append(labels_hemi)

    labels = np.concatenate(hemispheres, axis=0)
    if labels.shape[0] != N_FSAVERAGE5_BILATERAL:
        raise RuntimeError(
            f"Expected {N_FSAVERAGE5_BILATERAL} vertices, got {labels.shape[0]}"
        )

    np.save(cached, labels)
    return labels


def load_or_build_labels(cache_dir: Path, n_networks: int = 7) -> np.ndarray:
    cached = labels_cache_path(cache_dir, n_networks)
    if cached.exists():
        return np.load(cached)
    return build_yeo_labels(cache_dir, n_networks)
