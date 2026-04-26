"""Offline tests for guardrails + scenario registry.

Run from repo root::

    python3 -m caltech.engine.test_registry_guardrails

No network, no GPU, no API keys required. All assertions must pass before
the engine binary is allowed to consume the registry or the guardrail
helper.
"""

from __future__ import annotations

from caltech.engine.guardrails import (
    FORBIDDEN_PATTERNS,
    check_paragraph_for_forbidden_claims,
)
from caltech.engine.registry import (
    SCENARIO_CONFIGS,
    ScenarioConfig,
    get_scenario,
    load_prompt,
)


# ----------------------------------------------------------------------
# Guardrails
# ----------------------------------------------------------------------


def test_guardrails_clean_paragraph_passes() -> None:
    clean = (
        "The activation pattern is consistent with sustained engagement. "
        "The prefrontal-engagement specialist held its signature for the "
        "full window. Compared with the same worker on a routine baseline, "
        "the salience-tracking specialist shifted at second twelve."
    )
    passed, reason = check_paragraph_for_forbidden_claims(clean)
    assert passed, f"clean paragraph should pass; got reason={reason!r}"
    assert reason == "passed"


def test_guardrails_flags_reverse_inference() -> None:
    text = "She felt grief as the consultation continued."
    passed, reason = check_paragraph_for_forbidden_claims(text)
    assert not passed, "reverse inference should trip the guardrail"
    assert "reverse inference" in reason
    assert "char 0" in reason


def test_guardrails_flags_population_norm() -> None:
    text = (
        "The activation matches what we would expect from an average "
        "healthy brain at rest."
    )
    passed, reason = check_paragraph_for_forbidden_claims(text)
    assert not passed, "population-norm comparison should trip the guardrail"
    assert "population-norm" in reason


def test_guardrails_flags_inflated_tribe_numbers() -> None:
    text = "We measured 70,000 voxels of activation across the cortex."
    passed, reason = check_paragraph_for_forbidden_claims(text)
    assert not passed, "inflated TRIBE numbers should trip the guardrail"
    assert "inflated TRIBE" in reason


def test_guardrails_flags_clinical_claim() -> None:
    text = "The pattern is consistent with clinical fatigue."
    passed, reason = check_paragraph_for_forbidden_claims(text)
    assert not passed, "clinical claim should trip the guardrail"
    assert "clinical" in reason


def test_guardrails_flags_diagnostic_verb() -> None:
    text = "The worker is suffering from chronic stress."
    passed, reason = check_paragraph_for_forbidden_claims(text)
    assert not passed, "diagnostic verb should trip the guardrail"
    assert "diagnostic" in reason


def test_guardrails_flags_inner_monologue() -> None:
    text = "The engine reads her inner monologue throughout the scene."
    passed, reason = check_paragraph_for_forbidden_claims(text)
    assert not passed, "inner monologue framing should trip the guardrail"
    assert "inner monologue" in reason


def test_guardrails_pattern_list_is_introspectable() -> None:
    # Other modules introspect FORBIDDEN_PATTERNS; lock the surface.
    assert isinstance(FORBIDDEN_PATTERNS, list)
    assert len(FORBIDDEN_PATTERNS) >= 6
    for pattern, label in FORBIDDEN_PATTERNS:
        assert hasattr(pattern, "search"), "expected compiled regex"
        assert isinstance(label, str) and label, "label must be non-empty"


# ----------------------------------------------------------------------
# Registry
# ----------------------------------------------------------------------


def test_registry_workplace_loads() -> None:
    config = get_scenario("ironsight_workplace")
    assert isinstance(config, ScenarioConfig)
    assert config.output_renderer == "workplace_boss_facing"
    assert config.control_video_id.endswith(".mp4")
    assert config.stage_1_prompt_path.exists(), (
        f"stage 1 workplace prompt missing: {config.stage_1_prompt_path}"
    )
    assert config.stage_2_prompt_path.exists(), (
        f"stage 2 workplace prompt missing: {config.stage_2_prompt_path}"
    )


def test_registry_consumer_loads() -> None:
    config = get_scenario("listenlabs_sideshift_consumer")
    assert isinstance(config, ScenarioConfig)
    assert config.output_renderer == "consumer_user_facing"
    assert config.control_video_id.endswith(".mp4")
    assert config.stage_1_prompt_path.exists(), (
        f"stage 1 consumer prompt missing: {config.stage_1_prompt_path}"
    )
    assert config.stage_2_prompt_path.exists(), (
        f"stage 2 consumer prompt missing: {config.stage_2_prompt_path}"
    )


def test_registry_unknown_scenario_raises() -> None:
    try:
        get_scenario("does_not_exist")
    except ValueError as exc:
        assert "Unknown scenario" in str(exc)
        return
    raise AssertionError("get_scenario should raise on unknown name")


def test_registry_specialist_rosters_have_eight_entries() -> None:
    for name, config in SCENARIO_CONFIGS.items():
        assert len(config.specialist_roster) == 8, (
            f"scenario {name!r} roster must have exactly 8 entries; "
            f"got {len(config.specialist_roster)}"
        )
        # No duplicates.
        assert len(set(config.specialist_roster)) == 8, (
            f"scenario {name!r} roster contains duplicate region names"
        )


def test_registry_prompt_files_load_substantive_text() -> None:
    for name in SCENARIO_CONFIGS:
        s1 = load_prompt(name, 1)
        s2 = load_prompt(name, 2)
        # Prompt files are real production prompts; they should be long.
        assert len(s1.splitlines()) >= 80, (
            f"stage 1 prompt for {name!r} too short: {len(s1.splitlines())} lines"
        )
        assert len(s2.splitlines()) >= 80, (
            f"stage 2 prompt for {name!r} too short: {len(s2.splitlines())} lines"
        )


def test_registry_load_prompt_rejects_bad_stage() -> None:
    try:
        load_prompt("ironsight_workplace", 3)
    except ValueError as exc:
        assert "stage must be 1 or 2" in str(exc)
        return
    raise AssertionError("load_prompt should raise on stage != 1, 2")


# ----------------------------------------------------------------------
# Runner
# ----------------------------------------------------------------------


def _run_all() -> int:
    tests = [
        # guardrails
        test_guardrails_clean_paragraph_passes,
        test_guardrails_flags_reverse_inference,
        test_guardrails_flags_population_norm,
        test_guardrails_flags_inflated_tribe_numbers,
        test_guardrails_flags_clinical_claim,
        test_guardrails_flags_diagnostic_verb,
        test_guardrails_flags_inner_monologue,
        test_guardrails_pattern_list_is_introspectable,
        # registry
        test_registry_workplace_loads,
        test_registry_consumer_loads,
        test_registry_unknown_scenario_raises,
        test_registry_specialist_rosters_have_eight_entries,
        test_registry_prompt_files_load_substantive_text,
        test_registry_load_prompt_rejects_bad_stage,
    ]
    failures: list[tuple[str, BaseException]] = []
    for fn in tests:
        try:
            fn()
            print(f"  PASS  {fn.__name__}")
        except BaseException as exc:  # noqa: BLE001 — local test runner
            failures.append((fn.__name__, exc))
            print(f"  FAIL  {fn.__name__}: {exc!r}")
    print()
    if failures:
        print(f"{len(failures)} of {len(tests)} tests failed.")
        return 1
    print(f"All {len(tests)} tests passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(_run_all())
