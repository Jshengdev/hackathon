"""B4 — Top-level driver.

Orchestrates: per_action_activations.json (Person A's output)
                -> run_specialists (8 K2 calls per action)
                -> synthesize       (1 instruct-model call per action)
                -> ironside_report.json (validated)

Usage:
    python -m junsoo.report_card.run_report_card \\
        --activations junsoo/prerendered/clip1/per_action_activations.json \\
        --out         junsoo/prerendered/clip1/ironside_report.json

Env vars (loaded by k2_caller.py via dotenv):
    K2_API_KEY              required (Cerebras)
    K2_BASE_URL             default https://api.cerebras.ai/v1
    K2_MODEL                default k2-think-v2
    INSTRUCT_MODEL          default llama-3.3-70b
    INSTRUCT_PROVIDER       'cerebras' (default) or 'anthropic'
    ANTHROPIC_API_KEY       required if --provider anthropic
"""
from __future__ import annotations

import argparse
import asyncio
import json
import sys
from pathlib import Path
from typing import Any

from .run_specialists import run_specialists_all
from .synthesize import Synthesizer
from .validate_schema import validate_report_card


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument(
        "--activations",
        type=Path,
        required=True,
        help="Path to per_action_activations.json (from Person A's aggregate_per_action.py)",
    )
    p.add_argument(
        "--out",
        type=Path,
        required=True,
        help="Output path for ironside_report.json",
    )
    p.add_argument(
        "--provider",
        choices=("cerebras", "anthropic"),
        default=None,
        help="Override INSTRUCT_PROVIDER env var",
    )
    p.add_argument(
        "--max-parallel",
        type=int,
        default=4,
        help="Max parallel specialist calls per action (default 4)",
    )
    p.add_argument(
        "--video-stem",
        default=None,
        help="Video stem name to embed in output (default: parent dir of activations file)",
    )
    return p.parse_args()


async def main_async(args: argparse.Namespace) -> int:
    if not args.activations.exists():
        print(f"ERROR: {args.activations} not found", file=sys.stderr)
        return 1

    actions: list[dict[str, Any]] = json.loads(args.activations.read_text())
    if not isinstance(actions, list) or not actions:
        print(f"ERROR: {args.activations} must be a non-empty JSON array", file=sys.stderr)
        return 1

    video_stem = args.video_stem or args.activations.parent.name
    print(f"==> Video: {video_stem}  |  {len(actions)} actions")

    print(f"==> [1/2] Running 8 specialists for each action ({len(actions) * 8} K2 calls total)")
    enriched = await run_specialists_all(actions, max_parallel=args.max_parallel)

    print(f"==> [2/2] Synthesizing report cards via instruct model")
    synthesizer = Synthesizer(provider=args.provider)
    cards: list[dict[str, Any]] = []
    for i, action in enumerate(enriched):
        print(f"  [synth] action {i+1}/{len(enriched)}: {action.get('action')!r}")
        card = await synthesizer.synthesize(action)
        cards.append(card)

    report = {
        "video_stem": video_stem,
        "n_actions": len(cards),
        "model": f"{synthesizer.client.provider}:{synthesizer.client.model}",
        "actions": cards,
    }

    try:
        validate_report_card(report)
    except ValueError as e:
        # Schema check found something — write anyway so the user can inspect,
        # but exit non-zero so CI catches it.
        args.out.parent.mkdir(parents=True, exist_ok=True)
        args.out.write_text(json.dumps(report, indent=2))
        print(f"\n[FAIL] schema validation failed:\n{e}", file=sys.stderr)
        print(f"\nWrote (invalid) report to {args.out} for inspection.", file=sys.stderr)
        return 2

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(report, indent=2))
    print(f"\n==> Done. {args.out} ({len(cards)} action report cards)")

    # Quick summary
    print("\nSummary:")
    for card in cards:
        scores = " ".join(
            f"{s}={card.get(s, 0):.2f}"
            for s in ("attention_score", "threat_engagement", "cognitive_load", "decision_quality")
        )
        print(f"  - {card.get('action')!r:40s}  [{card.get('archetype_state')}]  {scores}")

    return 0


def main() -> None:
    args = parse_args()
    sys.exit(asyncio.run(main_async(args)))


if __name__ == "__main__":
    main()
