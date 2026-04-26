"""End-to-end smoke test for Person A's report-card lane.

Tests four things, no GPU / no network / no Cerebras key required:

    1. The 8 specialist prompts exist on disk under papers/prompts/ironside/.
    2. aggregate_per_action.py produces visibly different per-action region
       averages when fed a synthetic high-load action vs a synthetic low-load
       action (≥ 0.2 spread on at least 2 networks — matches the Definition
       of Done bar in research/wiki/findings/2026-04-25-ironside-report-card-person-a.md).
    3. The shared per_action_activations.json schema (Contract with Person B)
       validates against a fresh aggregator output.
    4. A synthetic ironside_report.json fixture passes schema validation —
       all 8 specialist evidence keys present, all 4 numeric scores in [0, 1],
       archetype_state from the allowed list.

Why include (4) before Person B's runner exists: it locks the report-card
schema from this side. When Person B drops `validate_report_card`, this test
imports it; until then it falls back to an inline equivalent so the test runs
today and auto-upgrades the moment the real validator lands.

Run:
    python junsoo/report_card/smoke_test.py
"""
from __future__ import annotations

import json
import sys
import tempfile
from pathlib import Path

# Make the sibling aggregate_per_action.py importable without packaging.
HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

from aggregate_per_action import (  # noqa: E402
    YEO7_KEYS,
    aggregate_per_action,
    load_activity,
    load_segments,
)

REPO_ROOT = HERE.parent.parent  # junsoo/report_card -> junsoo -> repo root
PROMPTS_DIR = REPO_ROOT / "junsoo" / "papers" / "prompts" / "ironside"

SPECIALIST_NAMES = (
    "visual_attention",
    "threat_detection",
    "spatial_mapping",
    "motor_planning",
    "salience_tracking",
    "prefrontal_engagement",
    "default_mode",
    "stress_response",
)

ALLOWED_ARCHETYPES = (
    "focused",
    "overloaded",
    "complacent",
    "panicked",
    "wandering",
    "routine_engaged",
    "deliberating",
    "stressed",
    "parse_failure",
)

SCORE_KEYS = (
    "attention_score",
    "threat_engagement",
    "cognitive_load",
    "decision_quality",
)


def test_specialist_prompts_exist() -> None:
    missing = [n for n in SPECIALIST_NAMES if not (PROMPTS_DIR / f"{n}.md").exists()]
    if missing:
        raise AssertionError(
            f"missing specialist prompt files in {PROMPTS_DIR}: {missing}"
        )
    for name in SPECIALIST_NAMES:
        body = (PROMPTS_DIR / f"{name}.md").read_text()
        if len(body) < 500:
            raise AssertionError(
                f"{name}.md looks too short ({len(body)} chars) — likely a stub"
            )


def synthetic_activity(
    n_seconds: int = 40, high_load_window: tuple[int, int] = (0, 20)
) -> dict:
    """Build an activity.json with two contrasting halves.

    High-load window: visual / dorsal_attention / frontoparietal / somatomotor
        all ~0.75; default_mode ~0.10.
    Low-load window:  default_mode ~0.75; everything else ~0.15.
    """
    high_lo, high_hi = high_load_window
    frames = []
    for t in range(n_seconds):
        in_high = high_lo <= t < high_hi
        if in_high:
            regions = {
                "visual": 0.75,
                "somatomotor": 0.72,
                "dorsal_attention": 0.78,
                "ventral_attention": 0.40,
                "limbic": 0.30,
                "frontoparietal": 0.70,
                "default_mode": 0.10,
            }
        else:
            regions = {
                "visual": 0.15,
                "somatomotor": 0.18,
                "dorsal_attention": 0.20,
                "ventral_attention": 0.12,
                "limbic": 0.22,
                "frontoparietal": 0.18,
                "default_mode": 0.75,
            }
        top_region = max(regions.items(), key=lambda kv: kv[1])[0]
        frames.append({"t_s": t, "regions": regions, "top_region": top_region})
    return {
        "stimulus": "synthetic://smoke-test",
        "atlas": "yeo7",
        "fps": 1,
        "n_timesteps": n_seconds,
        "n_vertices": 20484,
        "frames": frames,
    }


def synthetic_segments() -> list[dict]:
    return [
        {"start_t": 0, "end_t": 20, "action": "execute novel install"},
        {"start_t": 20, "end_t": 40, "action": "stand idle between steps"},
    ]


def test_aggregator_contrast() -> list[dict]:
    """Run aggregator on synthetic data; verify high-load vs low-load spread."""
    with tempfile.TemporaryDirectory() as td:
        td_path = Path(td)
        activity_path = td_path / "activity.json"
        segments_path = td_path / "segments.json"
        out_path = td_path / "per_action.json"

        activity_path.write_text(json.dumps(synthetic_activity()))
        segments_path.write_text(json.dumps(synthetic_segments()))

        frames = load_activity(activity_path)
        segments = load_segments(segments_path)
        per_action = aggregate_per_action(frames, segments)
        out_path.write_text(json.dumps(per_action, indent=2))

    if len(per_action) != 2:
        raise AssertionError(f"expected 2 actions, got {len(per_action)}")

    high, low = per_action[0], per_action[1]
    big_spread_networks = [
        k for k in YEO7_KEYS if abs(high["regions"][k] - low["regions"][k]) >= 0.2
    ]
    if len(big_spread_networks) < 2:
        raise AssertionError(
            "Definition-of-Done bar not met: routine vs novel must show ≥0.2 "
            f"spread on ≥2 networks. Got {len(big_spread_networks)}: "
            f"{big_spread_networks}"
        )
    return per_action


def test_per_action_schema(per_action: list[dict]) -> None:
    """Lock the Contract A schema (Person A → Person B handoff)."""
    if not isinstance(per_action, list) or not per_action:
        raise AssertionError("per_action_activations.json must be a non-empty list")
    for i, entry in enumerate(per_action):
        for key in ("action", "t_start", "t_end", "regions"):
            if key not in entry:
                raise AssertionError(f"action[{i}] missing key {key!r}")
        if entry["t_end"] <= entry["t_start"]:
            raise AssertionError(f"action[{i}] t_end must be > t_start")
        regions = entry["regions"]
        if set(regions.keys()) != set(YEO7_KEYS):
            raise AssertionError(
                f"action[{i}] regions keys mismatch: got {sorted(regions.keys())} "
                f"expected {sorted(YEO7_KEYS)}"
            )
        for k, v in regions.items():
            if not isinstance(v, (int, float)):
                raise AssertionError(f"action[{i}].regions[{k}] is not numeric")


def synthetic_ironside_report() -> dict:
    """A handcrafted, schema-correct ironside_report fixture."""
    def make_action(label: str, window: tuple[int, int], scores: tuple[float, ...]) -> dict:
        att, threat, load, decision = scores
        return {
            "time_window": {"start_t": window[0], "end_t": window[1]},
            "action": label,
            "attention_score": att,
            "threat_engagement": threat,
            "cognitive_load": load,
            "decision_quality": decision,
            "archetype_state": "routine_engaged",
            "supporting_specialist_evidence": {
                name: f"{name} synthetic evidence for {label}."
                for name in SPECIALIST_NAMES
            },
        }
    return {
        "video_stem": "smoke",
        "n_actions": 2,
        "model": "synthetic-smoke",
        "actions": [
            make_action("execute novel install", (0, 20), (0.74, 0.31, 0.62, 0.55)),
            make_action("stand idle between steps", (20, 40), (0.18, 0.05, 0.12, 0.40)),
        ],
    }


def _inline_validate_report_card(d: dict) -> None:
    """Fallback validator. Mirrors B5's documented checks.

    Will be superseded by Person B's `validate_report_card` once available.
    """
    for key in ("video_stem", "n_actions", "actions"):
        if key not in d:
            raise ValueError(f"top-level missing {key!r}")
    if not isinstance(d["actions"], list) or not d["actions"]:
        raise ValueError("'actions' must be a non-empty list")
    if d["n_actions"] != len(d["actions"]):
        raise ValueError(
            f"n_actions={d['n_actions']} disagrees with len(actions)={len(d['actions'])}"
        )
    for i, action in enumerate(d["actions"]):
        for key in (
            "time_window",
            "action",
            *SCORE_KEYS,
            "archetype_state",
            "supporting_specialist_evidence",
        ):
            if key not in action:
                raise ValueError(f"actions[{i}] missing {key!r}")
        for sk in SCORE_KEYS:
            v = action[sk]
            if not isinstance(v, (int, float)) or not 0.0 <= float(v) <= 1.0:
                raise ValueError(f"actions[{i}].{sk}={v!r} not a float in [0,1]")
        if action["archetype_state"] not in ALLOWED_ARCHETYPES:
            raise ValueError(
                f"actions[{i}].archetype_state={action['archetype_state']!r} "
                f"not in {ALLOWED_ARCHETYPES}"
            )
        evidence = action["supporting_specialist_evidence"]
        if set(evidence.keys()) != set(SPECIALIST_NAMES):
            missing = set(SPECIALIST_NAMES) - set(evidence.keys())
            extra = set(evidence.keys()) - set(SPECIALIST_NAMES)
            raise ValueError(
                f"actions[{i}].supporting_specialist_evidence key mismatch — "
                f"missing={sorted(missing)} extra={sorted(extra)}"
            )
        for name, text in evidence.items():
            if not isinstance(text, str) or not text.strip():
                raise ValueError(
                    f"actions[{i}].supporting_specialist_evidence[{name}] empty"
                )


def _resolve_validator():
    """Prefer Person B's validator; fall back to inline. Returns (fn, source)."""
    try:
        from validate_schema import validate_report_card  # type: ignore
        return validate_report_card, "validate_schema.validate_report_card"
    except ImportError:
        return _inline_validate_report_card, "inline fallback"


def test_ironside_schema() -> None:
    validate, source = _resolve_validator()
    report = synthetic_ironside_report()
    validate(report)

    # Negative test: corrupting a score should be rejected.
    bad = json.loads(json.dumps(report))
    bad["actions"][0]["attention_score"] = 1.7
    try:
        validate(bad)
    except (ValueError, Exception):  # noqa: BLE001
        pass
    else:
        raise AssertionError(
            f"validator ({source}) accepted attention_score=1.7 — schema is too lax"
        )

    # Negative test: dropping a specialist key should be rejected.
    bad2 = json.loads(json.dumps(report))
    del bad2["actions"][0]["supporting_specialist_evidence"]["stress_response"]
    try:
        validate(bad2)
    except (ValueError, Exception):  # noqa: BLE001
        pass
    else:
        raise AssertionError(
            f"validator ({source}) accepted missing specialist key — schema is too lax"
        )

    print(f"  ironside schema validated via {source}")


def main() -> int:
    print("Person A smoke test")
    print("-" * 60)

    print("[1/4] specialist prompt files exist...")
    test_specialist_prompts_exist()
    print(f"      OK — found all 8 prompts in {PROMPTS_DIR.relative_to(REPO_ROOT)}")

    print("[2/4] aggregator produces high-load vs low-load contrast...")
    per_action = test_aggregator_contrast()
    high, low = per_action[0], per_action[1]
    spreads = {
        k: round(high["regions"][k] - low["regions"][k], 2) for k in YEO7_KEYS
    }
    print(f"      OK — high vs low region spread: {spreads}")

    print("[3/4] per_action_activations schema (Contract with Person B)...")
    test_per_action_schema(per_action)
    print("      OK — 7 Yeo7 keys present, t_end > t_start, numeric values")

    print("[4/4] ironside_report schema validates...")
    test_ironside_schema()
    print("      OK — all 8 specialists fire, 4 scores in [0,1], archetype valid")

    print("-" * 60)
    print("Smoke test passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
