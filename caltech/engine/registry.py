"""Prompt Registry — the per-scenario hot-swap configuration.

Implements §4.5 of the Empathy Layer technical PRD. The engine binary is
scenario-agnostic: same Python entry point, same TRIBE V2, same K2 swarm,
same Opus 4.7, same iterative loop, same falsification check. Only the
``ScenarioConfig`` changes between scenarios. To add a new scenario you
add a row to :data:`SCENARIO_CONFIGS`; you do not touch the engine code.

Two scenarios ship for HackTech 2026:

- ``ironsight_workplace`` — workplace footage; manager-facing renderer.
- ``listenlabs_sideshift_consumer`` — consumer day-to-day footage;
  user-facing daily-journal renderer.

Specialist rosters are 8 brain regions per scenario. The roster determines
which K2 specialists get spawned for the per-region swarm and what
``stage2_*.md`` references when it lists the regions Opus may discuss.
"""

from __future__ import annotations

from pathlib import Path
from typing import Literal

from pydantic import BaseModel, ConfigDict


# ----------------------------------------------------------------------
# Paths
# ----------------------------------------------------------------------

# Directory layout:
#   caltech/engine/registry.py            <-- this file
#   caltech/engine/prompts/__init__.py
#   caltech/engine/prompts/stage1_workplace.md
#   caltech/engine/prompts/stage1_consumer.md
#   caltech/engine/prompts/stage2_workplace.md
#   caltech/engine/prompts/stage2_consumer.md
_ENGINE_DIR = Path(__file__).resolve().parent
_PROMPTS_DIR = _ENGINE_DIR / "prompts"


# ----------------------------------------------------------------------
# Schema
# ----------------------------------------------------------------------


class ScenarioConfig(BaseModel):
    """Per-scenario configuration consumed by the engine binary.

    ``extra="forbid"`` so that drift in scenario definitions surfaces at
    construction time, not in production. Pydantic v2.
    """

    model_config = ConfigDict(extra="forbid")

    stage_1_prompt_path: Path
    stage_2_prompt_path: Path
    specialist_roster: list[str]
    output_renderer: Literal["workplace_boss_facing", "consumer_user_facing"]
    control_video_id: str


# ----------------------------------------------------------------------
# Registry
# ----------------------------------------------------------------------


SCENARIO_CONFIGS: dict[str, ScenarioConfig] = {
    "ironsight_workplace": ScenarioConfig(
        stage_1_prompt_path=_PROMPTS_DIR / "stage1_workplace.md",
        stage_2_prompt_path=_PROMPTS_DIR / "stage2_workplace.md",
        specialist_roster=[
            "visual_attention",
            "threat_detection",
            "spatial_mapping",
            "motor_planning",
            "salience_tracking",
            "prefrontal_engagement",
            "default_mode",
            "stress_response",
        ],
        output_renderer="workplace_boss_facing",
        control_video_id="workplace_routine_baseline.mp4",
    ),
    "listenlabs_sideshift_consumer": ScenarioConfig(
        stage_1_prompt_path=_PROMPTS_DIR / "stage1_consumer.md",
        stage_2_prompt_path=_PROMPTS_DIR / "stage2_consumer.md",
        specialist_roster=[
            "visual_attention",
            "emotional_processing",
            "prefrontal_engagement",
            "default_mode",
            "social_pattern",
            "salience_tracking",
            "memory_recall",
            "language_region",
        ],
        output_renderer="consumer_user_facing",
        control_video_id="curated_short_film_baseline.mp4",
    ),
}


# ----------------------------------------------------------------------
# Lookup helpers
# ----------------------------------------------------------------------


def get_scenario(name: str) -> ScenarioConfig:
    """Return the :class:`ScenarioConfig` for ``name``.

    Raises ``ValueError`` (with the list of known scenarios) if the name
    is not registered. We deliberately raise rather than return ``None``;
    a typo in scenario name should fail loudly the moment it is read.
    """
    try:
        return SCENARIO_CONFIGS[name]
    except KeyError as exc:
        known = sorted(SCENARIO_CONFIGS.keys())
        raise ValueError(
            f"Unknown scenario {name!r}. Known scenarios: {known}"
        ) from exc


def load_prompt(scenario: str, stage: int) -> str:
    """Read the prompt markdown file for ``scenario`` + ``stage`` from disk.

    ``stage`` is 1 (vision) or 2 (empathy synthesis). Reading happens at
    runtime so prompt iterations on disk do not require a process restart
    — important during demo-day prompt-tuning.
    """
    config = get_scenario(scenario)
    if stage == 1:
        path = config.stage_1_prompt_path
    elif stage == 2:
        path = config.stage_2_prompt_path
    else:
        raise ValueError(f"stage must be 1 or 2; got {stage}")
    return path.read_text(encoding="utf-8")


__all__ = [
    "SCENARIO_CONFIGS",
    "ScenarioConfig",
    "get_scenario",
    "load_prompt",
]
