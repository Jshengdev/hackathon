"""Sequential standalone prebake — runs warmup_clip for one clip with verbose
error reporting. Bypasses FastAPI BackgroundTasks so exceptions surface.

Usage: python -m scripts.bake_one <clip_id> [<clip_id> ...]
"""
import asyncio
import json
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from services.warmup import warmup_clip  # noqa: E402

PRERENDERED = Path(__file__).resolve().parents[1] / "prerendered"


async def bake(clip_id: str) -> None:
    print(f"\n{'=' * 60}\nBAKING {clip_id}\n{'=' * 60}", flush=True)
    t0 = time.time()
    try:
        result = await warmup_clip(PRERENDERED, clip_id)
    except Exception as e:
        print(f"  💥 warmup_clip raised: {type(e).__name__}: {e}", flush=True)
        import traceback
        traceback.print_exc()
        return
    dt = time.time() - t0
    print(f"  finished in {dt:.1f}s", flush=True)
    print(f"  completed: {result.get('completed')}", flush=True)
    print(f"  skipped:   {result.get('skipped')}", flush=True)
    errors = result.get("errors") or {}
    if errors:
        print(f"  errors:", flush=True)
        for k, v in errors.items():
            print(f"    {k}: {v}", flush=True)
    else:
        print(f"  errors: none", flush=True)

    files = ["vision_report", "swarm_readings", "k2_region_cache", "empathy", "iterative_trajectory"]
    print(f"  on-disk:")
    for f in files:
        p = PRERENDERED / clip_id / f"{f}.json"
        mark = "✅" if p.exists() else "❌"
        size = f" ({p.stat().st_size // 1024} KB)" if p.exists() else ""
        print(f"    {mark} {f}.json{size}")


async def main():
    clips = sys.argv[1:] or ["30s_ironsite", "30s_ironsite2", "30s_ironsite3", "30s_twitter", "example_clip"]
    for c in clips:
        await bake(c)


if __name__ == "__main__":
    asyncio.run(main())
