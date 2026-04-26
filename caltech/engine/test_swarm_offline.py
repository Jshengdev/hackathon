"""Offline test for the K2 per-region specialist swarm.

Uses MOCK_K2=1 so no HTTP is attempted. Run as:

    MOCK_K2=1 python3 -m caltech.engine.test_swarm_offline

Coverage:
    - Round 1 returns one entry per roster specialist
    - Round 2 returns one entry per roster specialist
    - cross_region_edges is a list (may be empty for trivial mocks — accepted)
    - All 8 workplace roster names appear as keys
    - Switching to consumer roster yields consumer keys
    - SwarmResult schema is strict (extra='forbid')

Brain-pattern stub mimics the junsoo.brain.schema shape (frames with regions
keyed by name, each having a .activation float). Tests do not import the real
schema since Agent 1 may not be done.
"""
from __future__ import annotations

import asyncio
import os
import random
import sys
from dataclasses import dataclass, field
from pathlib import Path

from pydantic import ValidationError

from caltech.engine.swarm import SpecialistSwarm, SwarmResult


PROMPTS_DIR = Path(__file__).resolve().parent / "prompts" / "specialists"

WORKPLACE_ROSTER = [
    "visual_attention",
    "threat_detection",
    "spatial_mapping",
    "motor_planning",
    "salience_tracking",
    "prefrontal_engagement",
    "default_mode",
    "stress_response",
]

CONSUMER_ROSTER = [
    "visual_attention",
    "emotional_processing",
    "prefrontal_engagement",
    "default_mode",
    "social_pattern",
    "salience_tracking",
    "memory_recall",
    "language_region",
]


# ---------- duck-typed BrainPattern stub ----------


@dataclass
class _StubRegion:
    activation: float


@dataclass
class _StubFrame:
    time_s: int
    regions: dict[str, _StubRegion]


@dataclass
class _StubBrainPattern:
    video_id: str
    scenario: str
    frames: list[_StubFrame] = field(default_factory=list)


def _make_stub(roster: list[str], n_frames: int = 30, seed: int = 7) -> _StubBrainPattern:
    """Build a deterministic 30-frame brain pattern over the given roster."""
    rng = random.Random(seed)
    frames: list[_StubFrame] = []
    for t in range(n_frames):
        regions: dict[str, _StubRegion] = {}
        for name in roster:
            # values stable in [0.2, 0.85] band so specialists get non-trivial input
            regions[name] = _StubRegion(activation=round(0.2 + 0.65 * rng.random(), 3))
        frames.append(_StubFrame(time_s=t, regions=regions))
    return _StubBrainPattern(
        video_id="stub_clip_001",
        scenario="ironsight_workplace",
        frames=frames,
    )


# ---------- assertions ----------


def _assert(cond: bool, msg: str) -> None:
    if not cond:
        print(f"FAIL: {msg}", file=sys.stderr)
        sys.exit(1)


# ---------- tests ----------


async def test_workplace_roster_full_run() -> None:
    os.environ["MOCK_K2"] = "1"
    bp = _make_stub(WORKPLACE_ROSTER)
    swarm = SpecialistSwarm()
    result = await swarm.run(
        brain_pattern=bp,
        scenario="ironsight_workplace",
        specialist_roster=WORKPLACE_ROSTER,
        prompts_dir=PROMPTS_DIR,
    )
    _assert(isinstance(result, SwarmResult), "result must be SwarmResult")
    _assert(
        len(result.round_1) == 8,
        f"round_1 should have 8 entries, got {len(result.round_1)}",
    )
    _assert(
        len(result.round_2) == 8,
        f"round_2 should have 8 entries, got {len(result.round_2)}",
    )
    _assert(
        sorted(result.round_1.keys()) == sorted(WORKPLACE_ROSTER),
        "round_1 keys must match workplace roster",
    )
    _assert(
        sorted(result.round_2.keys()) == sorted(WORKPLACE_ROSTER),
        "round_2 keys must match workplace roster",
    )
    _assert(
        isinstance(result.cross_region_edges, list),
        "cross_region_edges must be a list (empty OK for trivial mocks)",
    )
    _assert(result.scenario == "ironsight_workplace", "scenario carried through")
    _assert(
        sorted(result.specialists_used) == sorted(WORKPLACE_ROSTER),
        "specialists_used must echo the roster",
    )
    print("[ok] test_workplace_roster_full_run")
    print(f"     round_1 sample: {result.round_1['visual_attention'][:80]}...")
    print(f"     edges count: {len(result.cross_region_edges)}")


async def test_consumer_roster_full_run() -> None:
    os.environ["MOCK_K2"] = "1"
    bp = _make_stub(CONSUMER_ROSTER, seed=11)
    swarm = SpecialistSwarm()
    result = await swarm.run(
        brain_pattern=bp,
        scenario="listenlabs_sideshift_consumer",
        specialist_roster=CONSUMER_ROSTER,
        prompts_dir=PROMPTS_DIR,
    )
    _assert(
        len(result.round_1) == 8,
        f"consumer round_1 should have 8 entries, got {len(result.round_1)}",
    )
    _assert(
        len(result.round_2) == 8,
        f"consumer round_2 should have 8 entries, got {len(result.round_2)}",
    )
    _assert(
        sorted(result.round_1.keys()) == sorted(CONSUMER_ROSTER),
        "consumer round_1 keys must match consumer roster",
    )
    _assert(
        sorted(result.round_2.keys()) == sorted(CONSUMER_ROSTER),
        "consumer round_2 keys must match consumer roster",
    )
    # Sanity: consumer-only specialists (not in workplace) are present.
    consumer_only = {"emotional_processing", "social_pattern", "memory_recall", "language_region"}
    _assert(
        consumer_only.issubset(result.round_2.keys()),
        "consumer-specific specialists must appear in round_2",
    )
    print("[ok] test_consumer_roster_full_run")


async def test_cross_region_edges_shape() -> None:
    """Edges (if any) must be {from, to, weight} dicts."""
    os.environ["MOCK_K2"] = "1"
    bp = _make_stub(WORKPLACE_ROSTER)
    swarm = SpecialistSwarm()
    result = await swarm.run(
        brain_pattern=bp,
        scenario="ironsight_workplace",
        specialist_roster=WORKPLACE_ROSTER,
        prompts_dir=PROMPTS_DIR,
    )
    for edge in result.cross_region_edges:
        _assert(
            set(edge.keys()) == {"from", "to", "weight"},
            f"edge keys malformed: {edge}",
        )
        _assert(isinstance(edge["weight"], (int, float)), "weight must be numeric")
        _assert(edge["from"] in WORKPLACE_ROSTER, f"edge.from outside roster: {edge}")
        _assert(edge["to"] in WORKPLACE_ROSTER, f"edge.to outside roster: {edge}")
    print(
        f"[ok] test_cross_region_edges_shape "
        f"({len(result.cross_region_edges)} edges)"
    )


def test_swarm_result_schema_forbids_extras() -> None:
    payload = {
        "round_1": {"a": "x"},
        "round_2": {"a": "y"},
        "cross_region_edges": [],
        "scenario": "ironsight_workplace",
        "specialists_used": ["a"],
        "rogue_field": "boom",
    }
    raised = False
    try:
        SwarmResult.model_validate(payload)
    except ValidationError:
        raised = True
    _assert(raised, "SwarmResult extra='forbid' should reject rogue_field")
    print("[ok] test_swarm_result_schema_forbids_extras")


async def main() -> None:
    test_swarm_result_schema_forbids_extras()
    await test_workplace_roster_full_run()
    await test_consumer_roster_full_run()
    await test_cross_region_edges_shape()
    print("\nAll offline swarm tests passed.")


if __name__ == "__main__":
    asyncio.run(main())
