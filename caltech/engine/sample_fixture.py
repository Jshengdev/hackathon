"""Stub fixtures for offline tests / demos.

Provides a deterministic CONTROL `BrainPattern` whose region activations
are intentionally chosen to differ sharply from anything `junsoo.brain.reverse`
will produce for an arbitrary mock video. The cosine-sim between the
mock-encoded video and this control is therefore low, so the falsification
delta in the offline test will exceed `ANCHOR_THRESHOLD` (0.40).

We pin region values by hand rather than using a hash-derived RNG: this
makes the control numerically stable across Python versions and easy to
read when debugging a falsification verdict regression.
"""
from __future__ import annotations

from junsoo.brain.forward import WORKPLACE_REGIONS
from junsoo.brain.schema import BrainFrame, BrainPattern, RegionActivation


# Anti-correlated activations — high where the typical mock target tends to
# be middling, near-zero where it tends to be high. Concretely, the encode_video
# mock draws every region from U(0.1, 0.9) which centers ~0.5; we push half of
# the regions to ~0.95 and the other half to ~0.05 so the cosine angle between
# control and any reasonable encoded video sits far from 1.0.
_CONTROL_ACTIVATIONS: dict[str, float] = {
    "visual_attention": 0.95,
    "threat_detection": 0.05,
    "spatial_mapping": 0.92,
    "motor_planning": 0.08,
    "salience_tracking": 0.90,
    "prefrontal_engagement": 0.10,
    "default_mode": 0.93,
    "stress_response": 0.07,
}


def make_stub_control_brain(
    video_id: str = "control_routine_visit_demo",
    scenario: str = "ironsight_workplace",
    n_frames: int = 3,
) -> BrainPattern:
    """Return a deterministic control `BrainPattern` for falsification tests.

    The same activations are repeated across `n_frames` frames so the
    time-averaged flatten matches the per-frame snapshot exactly — useful
    for asserting stable cosine similarities in tests.
    """
    # Sanity-check that the canonical region roster hasn't drifted; if it
    # has, fall back to whatever WORKPLACE_REGIONS defines and zero the
    # missing keys instead of crashing the fixture.
    activations: dict[str, float] = {}
    for region in WORKPLACE_REGIONS:
        activations[region] = _CONTROL_ACTIVATIONS.get(region, 0.5)

    frames: list[BrainFrame] = []
    for t in range(n_frames):
        regions = {
            r: RegionActivation(activation=v) for r, v in activations.items()
        }
        frames.append(BrainFrame(time_s=t, regions=regions))

    return BrainPattern(
        video_id=video_id,
        scenario=scenario,  # type: ignore[arg-type]
        frames=frames,
    )


__all__ = ["make_stub_control_brain"]
