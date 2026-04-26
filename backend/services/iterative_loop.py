"""Stage 3 — iterative scoring loop.

K2 swarm acts as evaluator: each round fires 7 parallel K2 calls (one per
Yeo7 network) rating how well the candidate paragraph captures that region's
reading. Aggregate -> round_score. Plateau-exit on |Δ|<0.02 over 2 rounds,
or 8 rounds max.
"""
from __future__ import annotations
import asyncio
import re
from pathlib import Path
from typing import Any

from services.k2_client import K2Client

NETWORKS: tuple[str, ...] = (
    "visual",
    "somatomotor",
    "dorsal_attention",
    "ventral_attention",
    "limbic",
    "frontoparietal",
    "default_mode",
)

_PROMPTS_DIR = Path(__file__).parents[1] / "prompts"
_EVALUATOR_PROMPT_PATH = _PROMPTS_DIR / "evaluator_score.md"
_PER_CALL_MAX_TOKENS = 120
_PER_CALL_TIMEOUT_S = 90.0
_TARGET_SCORE = 1.0

_SCORE_RE = re.compile(r"^\s*score\s*:\s*([0-9]*\.?[0-9]+)", re.IGNORECASE | re.MULTILINE)
_JUST_RE = re.compile(r"^\s*justification\s*:\s*(.+)$", re.IGNORECASE | re.MULTILINE)

_k2_client: K2Client | None = None


def _get_k2() -> K2Client:
    global _k2_client
    if _k2_client is None:
        _k2_client = K2Client()
    return _k2_client


def _load_evaluator_system_prompt() -> str:
    if _EVALUATOR_PROMPT_PATH.exists():
        return _EVALUATOR_PROMPT_PATH.read_text()
    return (
        "You are a brain-region specialist evaluator. Output exactly two lines: "
        "'Score: 0.XX' and 'Justification: <one sentence>'."
    )


def _build_user_prompt(network: str, region_reading: str, paragraph: str) -> str:
    return (
        f"You are the {network} network specialist.\n"
        f'Your region\'s expected reading: "{region_reading}"\n\n'
        f"Candidate paragraph:\n"
        f'"{paragraph}"\n\n'
        f"Output the two lines exactly as specified."
    )


def _parse_evaluator_output(text: str) -> tuple[float, str]:
    if not text:
        return 0.0, "[parse error]"
    score: float | None = None
    just: str | None = None
    m = _SCORE_RE.search(text)
    if m:
        try:
            score = float(m.group(1))
            score = max(0.0, min(1.0, score))
        except ValueError:
            score = None
    j = _JUST_RE.search(text)
    if j:
        just = j.group(1).strip().strip('"').strip()
    if score is None:
        return 0.0, "[parse error]"
    if not just:
        just = ""
    return score, just


async def _evaluate_one(network: str, region_reading: str, paragraph: str) -> dict[str, Any]:
    system = _load_evaluator_system_prompt()
    user = _build_user_prompt(network, region_reading, paragraph)
    k2 = _get_k2()
    try:
        raw = await asyncio.wait_for(
            k2.chat(system, user, max_tokens=_PER_CALL_MAX_TOKENS),
            timeout=_PER_CALL_TIMEOUT_S,
        )
    except Exception as e:
        return {"network": network, "score": 0.0, "justification": f"[parse error: {e}]"}
    score, just = _parse_evaluator_output(raw)
    return {"network": network, "score": score, "justification": just}


async def evaluate_paragraph(
    paragraph: str,
    swarm_readings: dict,
) -> tuple[float, dict]:
    regions_block = (swarm_readings or {}).get("regions", {}) or {}
    tasks = []
    for net in NETWORKS:
        region_entry = regions_block.get(net, {}) or {}
        region_reading = region_entry.get("reading", "") or ""
        tasks.append(_evaluate_one(net, region_reading, paragraph))

    results = await asyncio.gather(*tasks, return_exceptions=False)

    per_region_attribution: dict[str, dict[str, Any]] = {}
    score_sum = 0.0
    for r in results:
        net = r["network"]
        score = float(r["score"])
        per_region_attribution[net] = {
            "candidate_match": score,
            "target": _TARGET_SCORE,
            "justification": r["justification"],
        }
        score_sum += score

    overall = score_sum / len(NETWORKS) if NETWORKS else 0.0
    return overall, per_region_attribution


def _per_region_miss(attribution: dict) -> dict[str, float]:
    miss: dict[str, float] = {}
    for net, entry in attribution.items():
        cand = float(entry.get("candidate_match", 0.0))
        target = float(entry.get("target", _TARGET_SCORE))
        if cand < target:
            miss[net] = round(target - cand, 4)
    return miss


async def run_iterative_loop(
    vision_report: dict,
    swarm_readings: dict,
    scenario: str,
    max_rounds: int = 8,
    plateau_threshold: float = 0.02,
) -> dict:
    from services.empathy_synthesis import synthesize  # local import: agent-K2's file

    round_trajectory: list[dict] = []
    best_paragraph = ""
    best_score = -1.0
    best_attribution: dict = {}

    prior_score: float | None = None
    prior_paragraph: str | None = None
    prior_attribution: dict | None = None
    plateau_streak = 0

    for round_idx in range(1, max_rounds + 1):
        synth_kwargs: dict[str, Any] = {
            "vision_report": vision_report,
            "swarm_readings": swarm_readings,
            "scenario": scenario,
        }
        if prior_score is not None:
            synth_kwargs["prior_score"] = prior_score
            synth_kwargs["per_region_miss"] = _per_region_miss(prior_attribution or {})
            synth_kwargs["prior_paragraph"] = prior_paragraph

        try:
            candidate = await synthesize(**synth_kwargs)
        except TypeError:
            # Tolerant fallback if agent-K2's signature differs slightly.
            candidate = await synthesize(vision_report, swarm_readings, scenario)

        if not isinstance(candidate, str):
            candidate = str(candidate)

        score, attribution = await evaluate_paragraph(candidate, swarm_readings)

        round_trajectory.append({
            "round": round_idx,
            "score": round(score, 4),
            "paragraph_excerpt": candidate[:80],
        })

        if score > best_score:
            best_score = score
            best_paragraph = candidate
            best_attribution = attribution

        if prior_score is not None and round_idx >= 3 and abs(score - prior_score) < plateau_threshold:
            plateau_streak += 1
        else:
            plateau_streak = 0

        prior_score = score
        prior_paragraph = candidate
        prior_attribution = attribution

        if plateau_streak >= 2:
            break

    return {
        "best_paragraph": best_paragraph,
        "final_score": round(best_score if best_score >= 0 else 0.0, 4),
        "round_trajectory": round_trajectory,
        "per_region_attribution": best_attribution,
    }
