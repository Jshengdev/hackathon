"""Stage 5 — sentence-transformer embedding proxy for TRIBE forward.

Public API (per build-plan-locked.md §4.5):
    embed_text(text)               -> NDArray (384,)
    project_to_yeo7(embedding)     -> NDArray (7,)
    activity_target_vector(act)    -> NDArray (7,)
    proxy_score(text, target_act)  -> (float, dict)

Network ordering throughout this module (and the YAML / projection map):
    [visual, somatomotor, dorsal_attention, ventral_attention,
     limbic, frontoparietal, default_mode]

NOTE: We could not place implementation in a sibling ``embedding_proxy.py``
file because the data directory ``backend/services/embedding_proxy/`` is
also named ``embedding_proxy`` and a Python package directory shadows a
sibling module of the same name. Implementation therefore lives in this
package's ``__init__.py``; the public import path is unchanged
(``from backend.services.embedding_proxy import proxy_score``).
"""

from __future__ import annotations

import functools
from pathlib import Path
from typing import Tuple

import numpy as np
from numpy.typing import NDArray

# Yeo7 network ordering used everywhere in this module.
NETWORKS: tuple[str, ...] = (
    "visual",
    "somatomotor",
    "dorsal_attention",
    "ventral_attention",
    "limbic",
    "frontoparietal",
    "default_mode",
)

EMBEDDING_DIM = 384  # all-MiniLM-L6-v2
MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

# projection_map.npy lives next to this file.
_PROJECTION_PATH = Path(__file__).resolve().parent / "projection_map.npy"


# ---------------------------------------------------------------------------
# Sentence-transformer model: lazy singleton
# ---------------------------------------------------------------------------


@functools.lru_cache(maxsize=1)
def _get_model():
    """Lazy-loaded SentenceTransformer singleton."""
    # Imported lazily so this module can be imported (e.g. during the fit
    # script's argument parsing) without paying model-load cost up-front.
    from sentence_transformers import SentenceTransformer

    return SentenceTransformer(MODEL_NAME)


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


def embed_text(text: str) -> NDArray:
    """Sentence-transformer embedding (384-dim float32) for ``text``.

    Uses sentence-transformers/all-MiniLM-L6-v2. The model is lazy-loaded
    once and cached for the process lifetime via lru_cache.
    """
    if not isinstance(text, str):
        raise TypeError(f"embed_text expected str, got {type(text).__name__}")
    model = _get_model()
    vec = model.encode(text, convert_to_numpy=True, normalize_embeddings=False)
    return np.asarray(vec, dtype=np.float32)


@functools.lru_cache(maxsize=1)
def _load_projection_map() -> NDArray:
    """Load W (shape 384 x 7) from disk; cached for process lifetime."""
    if not _PROJECTION_PATH.exists():
        raise RuntimeError(
            f"projection_map.npy not found at {_PROJECTION_PATH}. "
            "Run `python backend/scripts/fit_projection_map.py` to fit it "
            "from training_pairs.yaml."
        )
    W = np.load(_PROJECTION_PATH)
    if W.shape != (EMBEDDING_DIM, len(NETWORKS)):
        raise RuntimeError(
            f"projection_map.npy has shape {W.shape}, expected "
            f"({EMBEDDING_DIM}, {len(NETWORKS)}). Re-run fit script."
        )
    return W.astype(np.float32)


def project_to_yeo7(embedding: NDArray) -> NDArray:
    """Project a 384-dim sentence embedding into the 7-dim Yeo7 space.

    Returns a length-7 vector in the order of NETWORKS:
        [visual, somatomotor, dorsal_attention, ventral_attention,
         limbic, frontoparietal, default_mode]
    """
    emb = np.asarray(embedding, dtype=np.float32).reshape(-1)
    if emb.shape[0] != EMBEDDING_DIM:
        raise ValueError(
            f"project_to_yeo7 expected ({EMBEDDING_DIM},) embedding, "
            f"got {emb.shape}"
        )
    W = _load_projection_map()  # (384, 7)
    # W @ embedding in the spec's wording reads as a 7-d output; matrix
    # math is embedding (384,) @ W (384,7) -> (7,). Same thing, transpose-free.
    return emb @ W


def activity_target_vector(activity_json: dict) -> NDArray:
    """Reduce activity_json.frames -> single 7-dim mean-activation vector.

    activity_json must follow the prerendered/<clip>/activity.json schema:
        {"frames": [{"regions": {"visual": float, ...}}, ...]}
    """
    frames = activity_json.get("frames")
    if not frames:
        raise ValueError("activity_json has no 'frames' or it is empty")
    matrix = np.array(
        [[float(f["regions"][n]) for n in NETWORKS] for f in frames],
        dtype=np.float32,
    )
    return matrix.mean(axis=0)


def _cosine(a: NDArray, b: NDArray) -> float:
    a = np.asarray(a, dtype=np.float64).reshape(-1)
    b = np.asarray(b, dtype=np.float64).reshape(-1)
    na = float(np.linalg.norm(a))
    nb = float(np.linalg.norm(b))
    if na == 0.0 or nb == 0.0:
        return 0.0
    sim = float(np.dot(a, b) / (na * nb))
    # Clamp to [-1, 1] to absorb fp wobble.
    return max(-1.0, min(1.0, sim))


def proxy_score(text: str, target_activity: dict) -> Tuple[float, dict]:
    """Cosine similarity between projected paragraph and activity target.

    Returns
    -------
    (similarity, per_region_attribution)
        similarity : float in [-1, 1]
        per_region_attribution : dict keyed by network name with values
            ``{"projected": float, "target": float}``.
    """
    emb = embed_text(text)
    projected = project_to_yeo7(emb)
    target = activity_target_vector(target_activity)
    similarity = _cosine(projected, target)

    attribution: dict[str, dict[str, float]] = {}
    for i, net in enumerate(NETWORKS):
        attribution[net] = {
            "projected": float(projected[i]),
            "target": float(target[i]),
        }
    return similarity, attribution
