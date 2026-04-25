"""Schema validation for ironside_report.json. Single source of truth.

Imported by:
    - run_report_card.py (post-synthesis check)
    - smoke_test.py (Person A's smoke test imports validate_action_card)
"""
from __future__ import annotations

from typing import Any

ALLOWED_ARCHETYPES = frozenset({
    "focused",
    "overloaded",
    "complacent",
    "panicked",
    "wandering",
    "routine_engaged",
    "deliberating",
    "stressed",
    "parse_failure",   # placeholder when synth fails twice
})

REQUIRED_SPECIALISTS = (
    "visual_attention",
    "threat_detection",
    "spatial_mapping",
    "motor_planning",
    "salience_tracking",
    "prefrontal_engagement",
    "default_mode",
    "stress_response",
)

NUMERIC_SCORES = (
    "attention_score",
    "threat_engagement",
    "cognitive_load",
    "decision_quality",
)


def _check(cond: bool, msg: str, errors: list[str]) -> None:
    if not cond:
        errors.append(msg)


def validate_action_card(card: dict[str, Any], idx: int = -1) -> list[str]:
    """Validate one action's report card. Returns list of error strings (empty = ok)."""
    errors: list[str] = []
    prefix = f"action[{idx}]" if idx >= 0 else "action"

    # Top-level keys
    for key in ("time_window", "action", "archetype_state", "supporting_specialist_evidence", *NUMERIC_SCORES):
        _check(key in card, f"{prefix}: missing key '{key}'", errors)

    # time_window
    tw = card.get("time_window", {})
    if isinstance(tw, dict):
        _check("start_t" in tw and "end_t" in tw,
               f"{prefix}.time_window: must have start_t + end_t", errors)
    else:
        errors.append(f"{prefix}.time_window: must be a dict")

    # numeric scores in [0, 1]
    for score in NUMERIC_SCORES:
        v = card.get(score)
        if v is None:
            continue  # already flagged above
        _check(isinstance(v, (int, float)),
               f"{prefix}.{score}: must be numeric, got {type(v).__name__}", errors)
        if isinstance(v, (int, float)):
            _check(0.0 <= float(v) <= 1.0,
                   f"{prefix}.{score}: must be in [0, 1], got {v}", errors)

    # archetype_state in allowed list
    arch = card.get("archetype_state")
    if arch is not None:
        _check(arch in ALLOWED_ARCHETYPES,
               f"{prefix}.archetype_state: '{arch}' not in {sorted(ALLOWED_ARCHETYPES)}", errors)

    # supporting_specialist_evidence: all 8 keys, all non-empty strings
    ev = card.get("supporting_specialist_evidence", {})
    if isinstance(ev, dict):
        for spec in REQUIRED_SPECIALISTS:
            _check(spec in ev, f"{prefix}.supporting_specialist_evidence: missing '{spec}'", errors)
            val = ev.get(spec)
            if val is not None:
                _check(isinstance(val, str) and val.strip() != "",
                       f"{prefix}.supporting_specialist_evidence.{spec}: must be non-empty string", errors)
    else:
        errors.append(f"{prefix}.supporting_specialist_evidence: must be a dict")

    return errors


def validate_report_card(d: dict[str, Any]) -> None:
    """Validate full ironside_report.json structure. Raises ValueError on any failure."""
    errors: list[str] = []

    for key in ("video_stem", "n_actions", "actions"):
        _check(key in d, f"top-level: missing key '{key}'", errors)

    actions = d.get("actions", [])
    if not isinstance(actions, list):
        errors.append("actions: must be a list")
    else:
        n_claimed = d.get("n_actions")
        if isinstance(n_claimed, int):
            _check(n_claimed == len(actions),
                   f"n_actions={n_claimed} but actions has {len(actions)} entries", errors)
        for i, card in enumerate(actions):
            if isinstance(card, dict):
                errors.extend(validate_action_card(card, idx=i))
            else:
                errors.append(f"action[{i}]: must be a dict, got {type(card).__name__}")

    if errors:
        raise ValueError("ironside_report schema check failed:\n  - " + "\n  - ".join(errors))


# CLI entrypoint for ad-hoc validation
if __name__ == "__main__":
    import argparse
    import json
    import sys

    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("path", help="Path to ironside_report.json")
    args = p.parse_args()

    with open(args.path) as f:
        data = json.load(f)
    try:
        validate_report_card(data)
    except ValueError as e:
        print(f"[FAIL] {e}", file=sys.stderr)
        sys.exit(1)
    print(f"[ok] {args.path}: valid ({data.get('n_actions')} actions)")
