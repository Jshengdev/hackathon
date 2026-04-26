"""Live ping — verify K2 + Instruct API connectivity end-to-end.

Runs ONE specialist call (K2 reasoning) + ONE synthesis call (instruct model)
against the example fixture's first action. ~10–30s total. Exits non-zero
on any failure so `make test` catches it.

Usage:
    python -m junsoo.report_card.test_live_ping

Requires K2_API_KEY (and ANTHROPIC_API_KEY if INSTRUCT_PROVIDER=anthropic).
"""
from __future__ import annotations

import asyncio
import json
import os
import sys
import time
from pathlib import Path

from .k2_caller import InstructClient, K2ReasoningClient
from .run_specialists import (
    REQUIRED_SPECIALISTS,
    _build_user_message,
    _load_prompt,
)
from .synthesize import Synthesizer

FIXTURE = Path(__file__).resolve().parent / "fixtures" / "example_per_action_activations.json"


async def main() -> int:
    if not os.getenv("K2_API_KEY"):
        print("[FAIL] K2_API_KEY not set. Copy junsoo/.env.example -> junsoo/.env "
              "or symlink _bmad/brain-swarm/backend/.env.")
        return 1

    actions = json.loads(FIXTURE.read_text())
    action = actions[0]
    print(f"==> Pinging against fixture action: {action['action']!r}")

    # ── Test 1: K2 reasoning call (one specialist) ────────────────────────
    print("\n[1/2] K2 reasoning model — visual_attention specialist")
    print(f"      base_url={os.getenv('K2_BASE_URL', 'https://api.cerebras.ai/v1')}")
    print(f"      model={os.getenv('K2_MODEL', 'k2-think-v2')}")
    t0 = time.time()
    try:
        client = K2ReasoningClient()
        text = await client.chat(
            _load_prompt("visual_attention"),
            _build_user_message(action),
            max_tokens=180,
        )
    except Exception as e:
        print(f"      [FAIL] {type(e).__name__}: {e}")
        return 1
    elapsed = time.time() - t0

    if not text or text.startswith("[K2_API_KEY") or text.startswith("[visual_attention:"):
        print(f"      [FAIL] {elapsed:.1f}s — bad response: {text!r}")
        return 1
    snippet = text if len(text) <= 200 else text[:200] + "..."
    print(f"      [ok] {elapsed:.1f}s")
    print(f"      response: {snippet}")

    # ── Test 2: Instruct model synthesis ──────────────────────────────────
    provider = os.getenv("INSTRUCT_PROVIDER", "cerebras")
    print(f"\n[2/2] Instruct model — synthesis (provider={provider})")
    if provider == "cerebras":
        print(f"      model={os.getenv('INSTRUCT_MODEL', 'llama-3.3-70b')}")
    else:
        print(f"      model={os.getenv('ANTHROPIC_MODEL', 'claude-haiku-4-5-20251001')}")

    # Reuse the K2 specialist response for all 8 slots so we don't burn 8
    # more K2 calls on a connectivity check. Real runs go through
    # run_specialists_for_action.
    action_for_synth = {
        **action,
        "specialists": {spec: text for spec in REQUIRED_SPECIALISTS},
    }
    t0 = time.time()
    try:
        card = await Synthesizer().synthesize(action_for_synth)
    except Exception as e:
        print(f"      [FAIL] {type(e).__name__}: {e}")
        return 1
    elapsed = time.time() - t0

    if card.get("archetype_state") == "parse_failure":
        print(f"      [FAIL] {elapsed:.1f}s — synthesizer returned placeholder")
        print(f"      reason: {card.get('_synthesis_error')}")
        return 1

    print(f"      [ok] {elapsed:.1f}s")
    print(f"      archetype: {card.get('archetype_state')}")
    print(f"      scores:    "
          f"attention={card.get('attention_score', 0):.2f}  "
          f"threat={card.get('threat_engagement', 0):.2f}  "
          f"load={card.get('cognitive_load', 0):.2f}  "
          f"quality={card.get('decision_quality', 0):.2f}")

    print("\n==> All live checks passed.")
    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
