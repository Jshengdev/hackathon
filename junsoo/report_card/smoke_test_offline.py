"""Offline smoke test — no network calls.

Verifies:
  - validate_schema.py rejects malformed cards and accepts well-formed ones
  - synthesize._build_user_message + _placeholder_card produce schema-valid output
  - run_specialists._build_user_message produces sane string

Run: python -m junsoo.report_card.smoke_test_offline
"""
from __future__ import annotations

import sys

from .run_specialists import REQUIRED_SPECIALISTS, _build_user_message as build_spec_user
from .synthesize import _extract_json_object, _placeholder_card
from .validate_schema import validate_action_card, validate_report_card


def _sample_action() -> dict:
    return {
        "action": "pick up drill",
        "t_start": 12,
        "t_end": 25,
        "regions": {
            "visual": 0.62, "somatomotor": 0.71, "dorsal_attention": 0.55,
            "ventral_attention": 0.32, "limbic": 0.18,
            "frontoparietal": 0.49, "default_mode": 0.08,
        },
        "stimulus": "approaching scaffold",
        "specialists": {s: f"<obs from {s}>" for s in REQUIRED_SPECIALISTS},
    }


def _sample_card() -> dict:
    return {
        "time_window": {"start_t": 12, "end_t": 25},
        "action": "pick up drill",
        "attention_score": 0.74,
        "threat_engagement": 0.31,
        "cognitive_load": 0.58,
        "decision_quality": 0.52,
        "archetype_state": "routine_engaged",
        "supporting_specialist_evidence": {s: f"evidence for {s}" for s in REQUIRED_SPECIALISTS},
    }


def test_validator_accepts_good_card() -> None:
    errors = validate_action_card(_sample_card())
    assert not errors, f"Good card should validate, got: {errors}"


def test_validator_rejects_missing_specialist() -> None:
    bad = _sample_card()
    del bad["supporting_specialist_evidence"]["stress_response"]
    errors = validate_action_card(bad)
    assert any("stress_response" in e for e in errors), f"Should flag missing specialist, got: {errors}"


def test_validator_rejects_bad_score_range() -> None:
    bad = _sample_card()
    bad["attention_score"] = 1.5
    errors = validate_action_card(bad)
    assert any("attention_score" in e and "[0, 1]" in e for e in errors)


def test_validator_rejects_bad_archetype() -> None:
    bad = _sample_card()
    bad["archetype_state"] = "definitely_not_allowed"
    errors = validate_action_card(bad)
    assert any("archetype_state" in e for e in errors)


def test_full_report_validates() -> None:
    report = {
        "video_stem": "test_clip",
        "n_actions": 2,
        "model": "test:test",
        "actions": [_sample_card(), _sample_card()],
    }
    validate_report_card(report)  # raises on failure


def test_n_actions_mismatch_caught() -> None:
    report = {
        "video_stem": "test_clip",
        "n_actions": 5,  # wrong
        "model": "test:test",
        "actions": [_sample_card()],
    }
    try:
        validate_report_card(report)
    except ValueError as e:
        assert "n_actions" in str(e)
        return
    raise AssertionError("Should have raised on n_actions mismatch")


def test_placeholder_card_is_valid() -> None:
    placeholder = _placeholder_card(_sample_action(), reason="test")
    errors = validate_action_card(placeholder)
    assert not errors, f"Placeholder card must be schema-valid, got: {errors}"


def test_specialist_user_message_includes_all_regions() -> None:
    msg = build_spec_user(_sample_action())
    for region in ("visual", "somatomotor", "default_mode"):
        assert region in msg, f"User message missing region {region!r}"
    assert "pick up drill" in msg


def test_extract_plain_json() -> None:
    raw = '{"action": "x", "score": 0.5}'
    out = _extract_json_object(raw)
    parsed = __import__("json").loads(out)
    assert parsed["action"] == "x"


def test_extract_fenced_json() -> None:
    raw = '```json\n{"action": "x"}\n```'
    out = _extract_json_object(raw)
    parsed = __import__("json").loads(out)
    assert parsed["action"] == "x"


def test_extract_preamble_then_fenced_json() -> None:
    raw = 'Here is the report card you requested:\n```json\n{"action": "x", "n": 7}\n```'
    out = _extract_json_object(raw)
    parsed = __import__("json").loads(out)
    assert parsed["n"] == 7


def test_extract_json_with_trailing_prose() -> None:
    raw = '{"action": "x", "n": 7}\n\nNote: scores reflect routine engagement.'
    out = _extract_json_object(raw)
    parsed = __import__("json").loads(out)
    assert parsed["n"] == 7


def test_extract_handles_braces_inside_strings() -> None:
    # The closing "}" inside the string must not be counted as object close.
    raw = '{"text": "she said {hello}", "n": 1}'
    out = _extract_json_object(raw)
    parsed = __import__("json").loads(out)
    assert parsed["n"] == 1
    assert "hello" in parsed["text"]


def test_extract_nested_objects() -> None:
    raw = 'preamble {"outer": {"inner": {"deep": 42}}, "tail": "ok"} trailing'
    out = _extract_json_object(raw)
    parsed = __import__("json").loads(out)
    assert parsed["outer"]["inner"]["deep"] == 42
    assert parsed["tail"] == "ok"


def test_k2_missing_key_raises() -> None:
    """Regression: K2 missing API key must raise, not return a placeholder string
    that flows through as a real specialist observation."""
    import asyncio
    import os

    # Ensure key is unset for this call
    saved = os.environ.pop("K2_API_KEY", None)
    try:
        from .k2_caller import K2ReasoningClient
        client = K2ReasoningClient()
        client.api_key = ""  # belt-and-suspenders
        try:
            asyncio.run(client.chat("system", "user"))
        except RuntimeError as e:
            assert "K2_API_KEY" in str(e)
            return
        raise AssertionError("Expected RuntimeError when K2_API_KEY missing")
    finally:
        if saved is not None:
            os.environ["K2_API_KEY"] = saved


def main() -> int:
    tests = [
        test_validator_accepts_good_card,
        test_validator_rejects_missing_specialist,
        test_validator_rejects_bad_score_range,
        test_validator_rejects_bad_archetype,
        test_full_report_validates,
        test_n_actions_mismatch_caught,
        test_placeholder_card_is_valid,
        test_specialist_user_message_includes_all_regions,
        test_extract_plain_json,
        test_extract_fenced_json,
        test_extract_preamble_then_fenced_json,
        test_extract_json_with_trailing_prose,
        test_extract_handles_braces_inside_strings,
        test_extract_nested_objects,
        test_k2_missing_key_raises,
    ]
    failures = []
    for t in tests:
        try:
            t()
            print(f"  [ok] {t.__name__}")
        except Exception as e:
            print(f"  [FAIL] {t.__name__}: {type(e).__name__}: {e}")
            failures.append(t.__name__)

    if failures:
        print(f"\n{len(failures)} failure(s): {failures}")
        return 1
    print(f"\nAll {len(tests)} offline checks passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
