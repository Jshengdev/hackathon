"""Session cache — Layer 2 in-process memory cache + Layer 1 disk passthrough.

See build-plan-locked.md §7.5. Memory dies on uvicorn restart; disk persists.
Read-path: memory hit → disk hit (populates memory) → cold (None).
Write-path: atomic temp-file + os.replace, then memory.
"""
from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any, Optional


SESSION_CACHE: dict[str, dict[str, Any]] = {}

KNOWN_KEYS = (
    "scenario",
    "vision_report",
    "swarm_readings",
    "k2_region_cache",
    "empathy",
    "iterative_trajectory",
    "falsification",
)


def _cache_path(prerendered_dir: Path, clip_id: str, key: str) -> Path:
    if not clip_id or "/" in clip_id or "\\" in clip_id or clip_id.startswith("."):
        raise ValueError(f"invalid clip_id: {clip_id!r}")
    if not key or "/" in key or "\\" in key or key.startswith("."):
        raise ValueError(f"invalid key: {key!r}")
    return Path(prerendered_dir) / clip_id / f"{key}.json"


def read_cached(prerendered_dir: Path, clip_id: str, key: str) -> Optional[Any]:
    mem = SESSION_CACHE.get(clip_id, {}).get(key)
    if mem is not None:
        return mem
    path = _cache_path(prerendered_dir, clip_id, key)
    if path.exists():
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            return None
        SESSION_CACHE.setdefault(clip_id, {})[key] = data
        return data
    return None


def write_cached(prerendered_dir: Path, clip_id: str, key: str, value: Any) -> None:
    path = _cache_path(prerendered_dir, clip_id, key)
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(".tmp.json")
    tmp.write_text(json.dumps(value, indent=2), encoding="utf-8")
    os.replace(tmp, path)
    SESSION_CACHE.setdefault(clip_id, {})[key] = value


def invalidate(clip_id: str, key: str | None = None) -> None:
    if clip_id not in SESSION_CACHE:
        return
    if key is None:
        SESSION_CACHE.pop(clip_id, None)
        return
    SESSION_CACHE[clip_id].pop(key, None)
