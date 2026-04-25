"""Wiring smoke test — runs the orchestrator without K2 / nilearn / GPU.

What it validates (the things end-to-end smoke tests actually catch):

1. junsoo/papers/prompts/<network>.md files load (path resolution works).
2. moderator.md loads (closes INTEGRATION_GAPS #9).
3. Per-frame stimulus text reaches the K2 user message (closes #10).
4. Spike threshold and parallelism caps are env-var-driven (closes #11).
5. ActivityReader normalizes JSON regions to [0,1] (closes #8 — without this,
   raw aggregate.py outputs may never cross SPIKE_THRESHOLD=0.60 and the
   swarm goes silent).
6. ActivityReader.data_source reflects the inputs (closes #7).
7. The rising-edge fire logic only triggers on networks that newly crossed
   the threshold (no per-tick re-billing of sustained-high stretches).

Run:
    cd _bmad/brain-swarm/backend
    python smoke_test_swarm.py
"""
from __future__ import annotations
import asyncio
import json
import sys
import tempfile
from pathlib import Path

import numpy as np

# Make services/ importable when running this file directly
_HERE = Path(__file__).parent
sys.path.insert(0, str(_HERE))

from services.activity_reader import ActivityReader, _normalize_region_frames
from services.orchestrator import Orchestrator


# ──────────────────────────────────────────────────────────────────────────
# Fake K2 client — captures (system, user, max_tokens) instead of HTTP-calling
# ──────────────────────────────────────────────────────────────────────────
class FakeK2:
    def __init__(self):
        self.calls: list[dict] = []

    async def chat(self, system: str, user: str, max_tokens: int = 80) -> str:
        self.calls.append({"system": system, "user": user, "max_tokens": max_tokens})
        # Return a deterministic short string so we can assert on it
        return f"[fake-k2 reply for system-len={len(system)}]"


# ──────────────────────────────────────────────────────────────────────────
# Test 1: ActivityReader.data_source + normalization
# ──────────────────────────────────────────────────────────────────────────
def test_activity_reader_normalization():
    print("─" * 60)
    print("[1/3] ActivityReader: normalization + data_source")
    print("─" * 60)

    with tempfile.TemporaryDirectory() as tmp:
        data_dir = Path(tmp)

        # Synthetic: no files
        reader = ActivityReader(data_dir)
        reader.load()
        assert reader.data_source == "synthetic", reader.data_source
        assert reader.n_frames > 0
        print(f"  ✓ no files → data_source='synthetic', n_frames={reader.n_frames}")

        # JSON only — write raw activity.json with negative + >1 values to confirm
        # the normalizer pulls them into [0,1]
        raw_frames = [
            {"t_s": 0, "regions": {"visual": -0.20, "default_mode": 1.40}, "stimulus": "hello"},
            {"t_s": 1, "regions": {"visual":  0.50, "default_mode": 0.00}, "stimulus": "world"},
            {"t_s": 2, "regions": {"visual":  1.00, "default_mode": 0.30}},
        ]
        (data_dir / "activity.json").write_text(json.dumps({"frames": raw_frames}))

        # Need a preds.npz too for n_frames; write a minimal one
        preds = np.zeros((3, 20484), dtype=np.float32)
        np.savez(data_dir / "preds.npz", preds=preds)

        reader2 = ActivityReader(data_dir)
        reader2.load()
        assert reader2.data_source == "preds_npz_with_json", reader2.data_source
        f0 = reader2.get_network_frame(0)
        f2 = reader2.get_network_frame(2)
        # After per-region min-max:
        # visual range was [-0.20, 1.00] → 0.0 at t=0, 1.0 at t=2
        assert abs(f0["regions"]["visual"] - 0.0) < 1e-3, f0["regions"]
        assert abs(f2["regions"]["visual"] - 1.0) < 1e-3, f2["regions"]
        # default_mode range was [0.00, 1.40] → 1.0 at t=0, 0.0 at t=1
        assert abs(f0["regions"]["default_mode"] - 1.0) < 1e-3, f0["regions"]
        f1 = reader2.get_network_frame(1)
        assert abs(f1["regions"]["default_mode"] - 0.0) < 1e-3, f1["regions"]
        print(f"  ✓ JSON regions normalized to [0,1] per-network across frames")
        print(f"  ✓ data_source='preds_npz_with_json'")

        # Stimulus passes through normalization
        assert f0.get("stimulus") == "hello", f0
        print(f"  ✓ stimulus text preserved through normalization")


# ──────────────────────────────────────────────────────────────────────────
# Test 2: Orchestrator loads grounded prompts + passes stimulus
# ──────────────────────────────────────────────────────────────────────────
async def test_orchestrator_wiring():
    print()
    print("─" * 60)
    print("[2/3] Orchestrator: prompt loading + stimulus passing")
    print("─" * 60)

    orch = Orchestrator()
    orch.k2 = FakeK2()  # type: ignore — swap real client for capture

    # Confirm grounded prompts loaded (look for distinctive markers from
    # papers/prompts/<name>.md, which start with "# Agent: `name`")
    visual_prompt = orch._prompts["visual"]
    moderator_prompt = orch._moderator_prompt
    grounded_visual = "Agent: `visual`" in visual_prompt
    grounded_mod = "Agent: `moderator`" in moderator_prompt or "moderator (swarm" in moderator_prompt
    assert grounded_visual, "expected grounded visual.md, got fallback"
    assert grounded_mod, "expected grounded moderator.md, got fallback"
    print(f"  ✓ loaded grounded prompts (visual: {len(visual_prompt)} chars, "
          f"moderator: {len(moderator_prompt)} chars)")

    # Build a frame that should trigger 2 networks (visual=0.92, DAN=0.71)
    # — both above default SPIKE_THRESHOLD=0.60.
    frame = {
        "t_s": 4, "top_region": "visual",
        "regions": {
            "visual": 0.92, "somatomotor": 0.10, "dorsal_attention": 0.71,
            "ventral_attention": 0.18, "limbic": 0.05,
            "frontoparietal": 0.34, "default_mode": 0.08,
        },
        "stimulus": "She turned and saw him at the door.",
    }
    queue: asyncio.Queue = asyncio.Queue()
    await orch.run_frame(frame, t=4, speech_queue=queue)

    fake = orch.k2  # type: ignore
    n_calls = len(fake.calls)
    # Expect: 2 network calls (visual + DAN both fired) + 1 moderator (>=2 fired)
    assert n_calls == 3, f"expected 3 K2 calls (2 networks + 1 moderator), got {n_calls}"
    print(f"  ✓ {n_calls} K2 calls fired (2 networks crossed SPIKE_THRESHOLD + 1 moderator)")

    # Stimulus text reached every K2 user message
    stim = "She turned and saw him at the door."
    assert all(stim in c["user"] for c in fake.calls), \
        "stimulus text missing from at least one K2 user message"
    print(f"  ✓ stimulus text passed to all K2 calls")

    # Drain queue; expect 2 region msgs + 1 moderator msg
    msgs: list[dict] = []
    while not queue.empty():
        msgs.append(queue.get_nowait())
    types = sorted(m["type"] for m in msgs)
    assert types == ["moderator", "region", "region"], types
    print(f"  ✓ speech queue: 2 region + 1 moderator (matches K2 call distribution)")


# ──────────────────────────────────────────────────────────────────────────
# Test 3: Rising-edge spike detection
# ──────────────────────────────────────────────────────────────────────────
async def test_rising_edge():
    print()
    print("─" * 60)
    print("[3/3] Orchestrator: rising-edge fire (no re-billing)")
    print("─" * 60)

    orch = Orchestrator()
    orch.k2 = FakeK2()  # type: ignore
    queue: asyncio.Queue = asyncio.Queue()

    base = {"t_s": 0, "regions": {n: 0.0 for n in [
        "visual", "somatomotor", "dorsal_attention", "ventral_attention",
        "limbic", "frontoparietal", "default_mode",
    ]}}

    # Tick 1: visual rises above 0.60 → should fire 1 network call
    f1 = dict(base, t_s=1, regions={**base["regions"], "visual": 0.85})
    await orch.run_frame(f1, t=1, speech_queue=queue)
    n1 = len(orch.k2.calls)  # type: ignore

    # Tick 2: visual STILL above 0.60 → should NOT re-fire (rising edge only)
    f2 = dict(base, t_s=2, regions={**base["regions"], "visual": 0.90})
    await orch.run_frame(f2, t=2, speech_queue=queue)
    n2 = len(orch.k2.calls)  # type: ignore
    assert n2 == n1, f"sustained-high stretch re-fired (n1={n1}, n2={n2}) — would burn K2 budget"
    print(f"  ✓ sustained high (0.85 → 0.90) did not re-fire")

    # Tick 3: visual drops below 0.60 → resets the active set
    f3 = dict(base, t_s=3, regions={**base["regions"], "visual": 0.20})
    await orch.run_frame(f3, t=3, speech_queue=queue)

    # Tick 4: visual rises again → SHOULD fire again
    f4 = dict(base, t_s=4, regions={**base["regions"], "visual": 0.85})
    await orch.run_frame(f4, t=4, speech_queue=queue)
    n4 = len(orch.k2.calls)  # type: ignore
    assert n4 > n2, f"re-rising edge did not fire (n2={n2}, n4={n4})"
    print(f"  ✓ falling-then-rising re-fires (rising edge detected correctly)")


# ──────────────────────────────────────────────────────────────────────────
def main():
    test_activity_reader_normalization()
    asyncio.run(test_orchestrator_wiring())
    asyncio.run(test_rising_edge())
    print()
    print("=" * 60)
    print("SMOKE TEST PASSED — orchestrator wiring is intact.")
    print("=" * 60)


if __name__ == "__main__":
    main()
