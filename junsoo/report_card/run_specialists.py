"""B1 — K2 specialist runner.

For each per-action entry, fan out 8 parallel K2 (reasoning) calls — one per
Ironside cognitive specialist. Returns per-action specialist observation dicts
ready for the synthesizer.

Reads specialist prompts from junsoo/papers/prompts/ironside/<spec>.md. Falls
back to a one-line stub if a prompt file is missing (so Person A can develop
prompts incrementally without breaking Person B's pipeline).
"""
from __future__ import annotations

import asyncio
from pathlib import Path
from typing import Any

from .k2_caller import K2ReasoningClient
from .validate_schema import REQUIRED_SPECIALISTS

PROMPTS_DIR = Path(__file__).resolve().parents[1] / "papers" / "prompts" / "ironside"

# One-line fallback so Person B can run end-to-end while Person A is still
# writing prompts. Each fallback names the composite source so K2 has at least
# minimal grounding.
_FALLBACK_PROMPTS: dict[str, str] = {
    "visual_attention":
        "You are the visual-attention specialist (composite of visual cortex + dorsal attention). "
        "Report in 1-2 sentences: where is the spotlight, and is it sustained on task-relevant content.",
    "threat_detection":
        "You are the threat-detection specialist (composite of limbic + ventral attention with stimulus context). "
        "Report in 1-2 sentences: did the worker register the hazard? Use observational language only.",
    "spatial_mapping":
        "You are the spatial-mapping specialist (composite of dorsal attention + visual). "
        "Report in 1-2 sentences: how is the environmental layout being tracked.",
    "motor_planning":
        "You are the motor-planning specialist (based on somatomotor cortex). "
        "Report in 1-2 sentences: what motor sequence is being prepared or executed.",
    "salience_tracking":
        "You are the salience-tracking specialist (based on ventral attention). "
        "Report in 1-2 sentences: what just changed; did anything unexpected enter the scene.",
    "prefrontal_engagement":
        "You are the prefrontal-engagement specialist (based on frontoparietal control). "
        "Report in 1-2 sentences: how much cognitive control is being recruited.",
    "default_mode":
        "You are the default-mode specialist (based on default-mode network). "
        "Report in 1-2 sentences: is the worker mind-wandering or self-referentially processing.",
    "stress_response":
        "You are the stress-response specialist (limbic HIGH + frontoparietal LOW dysregulation signature). "
        "Report in 1-2 sentences: any sign of dysregulation. Observational language only.",
}


def _load_prompt(spec: str) -> str:
    path = PROMPTS_DIR / f"{spec}.md"
    if path.exists():
        return path.read_text()
    return _FALLBACK_PROMPTS.get(spec, f"You are the {spec} specialist. React in 1 sentence.")


def _build_user_message(action: dict[str, Any]) -> str:
    """User message shown to every specialist for one action."""
    regions = action.get("regions", {})
    region_str = ", ".join(f"{k}={v:.2f}" for k, v in regions.items())
    parts = [
        f"Action: {action.get('action', '<unlabeled>')}",
        f"Window: t={action.get('t_start')}s to t={action.get('t_end')}s",
        f"Per-action averaged Yeo7 activations (normalized 0-1): {region_str}",
    ]
    if action.get("stimulus"):
        parts.append(f'Stimulus context: "{action["stimulus"]}"')
    parts.append(
        "Read your composite from the Yeo7 activations above. Output only the "
        "Reading + Confidence as instructed in your system prompt."
    )
    return "\n".join(parts)


async def _call_one(
    client: K2ReasoningClient,
    spec: str,
    user_msg: str,
    semaphore: asyncio.Semaphore,
) -> tuple[str, str]:
    async with semaphore:
        try:
            text = await client.chat(_load_prompt(spec), user_msg, max_tokens=180)
            if not text or not text.strip():
                text = f"[{spec}: empty response]"
            return spec, text.strip()
        except Exception as e:  # network, parse, anything
            return spec, f"[{spec}: call failed — {type(e).__name__}]"


async def run_specialists_for_action(
    action: dict[str, Any],
    client: K2ReasoningClient | None = None,
    max_parallel: int = 4,
) -> dict[str, str]:
    """Run all 8 specialists for one action. Returns {spec_name: observation_str}."""
    client = client or K2ReasoningClient()
    semaphore = asyncio.Semaphore(max_parallel)
    user_msg = _build_user_message(action)

    tasks = [
        asyncio.create_task(_call_one(client, spec, user_msg, semaphore))
        for spec in REQUIRED_SPECIALISTS
    ]
    results = await asyncio.gather(*tasks)
    return dict(results)


async def run_specialists_all(
    actions: list[dict[str, Any]],
    max_parallel: int = 4,
) -> list[dict[str, Any]]:
    """For each action, attach a `specialists` dict. Returns enriched action list."""
    client = K2ReasoningClient()
    out: list[dict[str, Any]] = []
    for i, action in enumerate(actions):
        print(f"  [specialists] action {i+1}/{len(actions)}: {action.get('action')!r}")
        observations = await run_specialists_for_action(action, client=client, max_parallel=max_parallel)
        enriched = dict(action)
        enriched["specialists"] = observations
        out.append(enriched)
    return out
