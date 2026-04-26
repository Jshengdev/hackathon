"""Pre-bake all K2/Opus cache outputs for one or all prerendered clips.

Usage (from backend/):
    python -m scripts.prewarm                    # all clips with activity.json
    python -m scripts.prewarm 30s_ironsite2      # specific clip(s)

Idempotent: warmup_clip() skips files already on disk.
"""
from __future__ import annotations
import asyncio
import sys
from pathlib import Path

# Make `services.*` importable when run as `python -m scripts.prewarm` from backend/.
_BACKEND = Path(__file__).resolve().parent.parent
if str(_BACKEND) not in sys.path:
    sys.path.insert(0, str(_BACKEND))

from services.warmup import warmup_clip  # noqa: E402

PRERENDERED = _BACKEND / "prerendered"


async def main(targets: list[str]) -> int:
    if not PRERENDERED.exists():
        print(f"[prewarm] {PRERENDERED} does not exist", file=sys.stderr)
        return 1

    if targets:
        clips = targets
    else:
        clips = sorted(
            p.name for p in PRERENDERED.iterdir()
            if p.is_dir() and (p / "activity.json").exists()
        )

    if not clips:
        print("[prewarm] no clips to bake")
        return 0

    failures = 0
    for cid in clips:
        clip_dir = PRERENDERED / cid
        if not (clip_dir / "activity.json").exists():
            print(f"[prewarm] skip {cid}: no activity.json")
            continue
        print(f"[prewarm] → {cid}")
        result = await warmup_clip(PRERENDERED, cid)
        print(
            f"[prewarm]   completed={result.get('completed')} "
            f"skipped={result.get('skipped')} errors={result.get('errors')}"
        )
        if result.get("errors"):
            failures += 1
    return 0 if failures == 0 else 2


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main(sys.argv[1:])))
