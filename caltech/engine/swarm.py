"""K2 per-region specialist swarm with 2-pass cross-talk.

Architecture ref: caltech/architecture-overview.md §"K2 PER-REGION SPECIALIST SWARM".

Round 1: N specialists fan out in parallel (asyncio.Semaphore(6)). Each sees
its own region's time-averaged activation and outputs an independent hypothesis.
Round 2: each specialist sees its OWN R1 output plus peers' R1, may revise.

Cross-region edges: if a specialist's R2 text mentions a peer's name or
echoes peer keywords (and that token wasn't in its own R1), record an edge
peer -> self with weight 0.5. Empty list is acceptable.

K2 client logic copied (not imported) from junsoo/report_card/k2_caller.py.
MOCK_K2=1 triggers deterministic mocks; no network.
"""
from __future__ import annotations

import asyncio
import os
import re
from pathlib import Path
from typing import TYPE_CHECKING, Any

import httpx
from pydantic import BaseModel, ConfigDict, Field

if TYPE_CHECKING:  # Agent 1's schema may not exist yet — guard the import
    from junsoo.brain.schema import BrainPattern  # noqa: F401


# ---------- K2 client (copied from junsoo/report_card/k2_caller.py) ----------

_THINK_TAG_RE = re.compile(r"<think>.*?</think>", re.DOTALL | re.IGNORECASE)


def _strip_reasoning(text: str) -> str:
    text = _THINK_TAG_RE.sub("", text)
    if "</think>" in text:
        text = text.rsplit("</think>", 1)[1]
    text = text.strip()
    for marker in ("Final answer:", "FINAL ANSWER:", "Answer:", "ANSWER:"):
        idx = text.rfind(marker)
        if idx != -1:
            text = text[idx + len(marker):].strip()
    return text


class _K2ReasoningClient:
    """K2 Think reasoning client. Same Cerebras endpoint as the live swarm."""

    def __init__(self) -> None:
        self.base_url = os.getenv("K2_BASE_URL", "https://api.cerebras.ai/v1")
        self.api_key = os.getenv("K2_API_KEY", "")
        self.model = os.getenv("K2_MODEL", "k2-think-v2")
        self.timeout = float(os.getenv("K2_TIMEOUT", "45.0"))

    async def chat(self, system: str, user: str, max_tokens: int = 180) -> str:
        if not self.api_key:
            raise RuntimeError("K2_API_KEY not set in environment / .env")
        directive = (
            "\n\nIMPORTANT: Respond with ONLY the final answer in the format "
            "requested. Do not show your reasoning. Output the requested "
            "sentence(s) and stop."
        )
        budget = max(max_tokens * 4, 800)
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.post(
                f"{self.base_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": self.model,
                    "messages": [
                        {"role": "system", "content": system + directive},
                        {"role": "user", "content": user},
                    ],
                    "max_tokens": budget,
                    "temperature": 0.7,
                },
            )
            resp.raise_for_status()
            return _strip_reasoning(resp.json()["choices"][0]["message"]["content"])


# ---------- Output schema ----------


class SwarmResult(BaseModel):
    model_config = ConfigDict(extra="forbid")

    round_1: dict[str, str] = Field(..., description="specialist -> observation")
    round_2: dict[str, str] = Field(..., description="specialist -> revised observation")
    cross_region_edges: list[dict[str, Any]] = Field(
        default_factory=list,
        description="[{from, to, weight}] — peer R1 outputs that shifted this R2",
    )
    scenario: str
    specialists_used: list[str]


# ---------- Prompt loading ----------

_FALLBACK_STUB = (
    "You are the {name} specialist. Read your composite activation pattern. "
    "Report in 1-2 sentences whether the activation pattern is consistent "
    "with engagement of your network during this window. Use observational, "
    "within-subject framing only."
)


def _load_prompt(name: str, prompts_dir: Path) -> str:
    path = prompts_dir / f"{name}.md"
    if path.exists():
        return path.read_text()
    return _FALLBACK_STUB.format(name=name)


# ---------- User-message builders ----------


def _time_averaged_regions(brain_pattern: Any) -> dict[str, float]:
    """Time-averaged region activation across all frames. Duck-typed: accepts
    real BrainPattern or any object with .frames -> [.regions[name].activation]."""
    frames = getattr(brain_pattern, "frames", None) or []
    if not frames:
        return {}
    sums: dict[str, float] = {}
    counts: dict[str, int] = {}
    for fr in frames:
        regions = getattr(fr, "regions", {}) or {}
        for k, v in regions.items():
            act = float(getattr(v, "activation", v))
            sums[k] = sums.get(k, 0.0) + act
            counts[k] = counts.get(k, 0) + 1
    return {k: sums[k] / counts[k] for k in sums}


def _build_round1_user_msg(
    specialist: str, averaged: dict[str, float], scenario: str
) -> str:
    own = averaged.get(specialist)
    own_str = f"{own:.2f}" if own is not None else "n/a"
    region_str = ", ".join(f"{k}={v:.2f}" for k, v in sorted(averaged.items()))
    return (
        f"Scenario: {scenario}\n"
        f"Your region ({specialist}) time-averaged activation: {own_str}\n"
        f"All region activations (averaged across frames, normalized 0-1): "
        f"{region_str}\n"
        f"Output the Reading + Confidence as instructed."
    )


def _build_round2_user_msg(
    specialist: str,
    averaged: dict[str, float],
    scenario: str,
    own_round1: str,
    peer_round1: dict[str, str],
) -> str:
    peers_block = "\n".join(f"  - {p}: {t}" for p, t in peer_round1.items())
    own = averaged.get(specialist)
    own_str = f"{own:.2f}" if own is not None else "n/a"
    region_str = ", ".join(f"{k}={v:.2f}" for k, v in sorted(averaged.items()))
    return (
        f"Scenario: {scenario}\n"
        f"Your region ({specialist}) time-averaged activation: {own_str}\n"
        f"All region activations: {region_str}\n\n"
        f"Round 1 — your own hypothesis was:\n  {own_round1}\n\n"
        f"Round 1 — your peers reported:\n{peers_block}\n\n"
        f"Round 2 task: re-evaluate given peer outputs. You may keep or revise "
        f"your Round 1 reading. If a peer signal flips your call (per your "
        f"system prompt's cross-network signals), revise. Output Reading + Confidence."
    )


# ---------- Cross-talk edge heuristic ----------

# If a specialist's R2 text mentions another specialist's name OR a known
# keyword for that peer (and that token is NOT in its own R1), mark edge
# peer -> self at weight 0.5. Captures peer-induced shifts only.
_PEER_KEYWORDS: dict[str, tuple[str, ...]] = {
    "visual_attention": ("visual", "gaze", "foveation", "look", "spotlight"),
    "threat_detection": ("threat", "hazard", "danger", "limbic"),
    "spatial_mapping": ("spatial", "layout", "environment", "map"),
    "motor_planning": ("motor", "hand", "movement", "somatomotor"),
    "salience_tracking": ("salience", "surprise", "unexpected", "ventral"),
    "prefrontal_engagement": ("prefrontal", "control", "frontoparietal", "cognitive control"),
    "default_mode": ("default-mode", "default mode", "dmn", "mind-wander", "self-referential"),
    "stress_response": ("stress", "dysregulation", "overload"),
    "emotional_processing": ("emotion", "affect", "valence", "limbic"),
    "social_pattern": ("social", "mentalizing", "tpj", "face"),
    "memory_recall": ("memory", "retrieval", "hippocampus", "remind"),
    "language_region": ("language", "linguistic", "broca", "wernicke", "dialogue"),
}


def _compute_edges(
    round_2: dict[str, str], round_1: dict[str, str]
) -> list[dict[str, Any]]:
    edges: list[dict[str, Any]] = []
    for self_name, r2_text in round_2.items():
        r2_low = r2_text.lower()
        r1_low = round_1.get(self_name, "").lower()
        for peer in round_1:
            if peer == self_name:
                continue
            triggers = (peer.replace("_", " "), peer, *_PEER_KEYWORDS.get(peer, ()))
            for kw in triggers:
                if kw and kw.lower() in r2_low and kw.lower() not in r1_low:
                    edges.append({"from": peer, "to": self_name, "weight": 0.5})
                    break
    return edges


# ---------- Mock path ----------


def _mock_response(
    specialist: str,
    averaged: dict[str, float],
    round_n: int,
    peer_round1: dict[str, str] | None = None,
) -> str:
    score = averaged.get(specialist, 0.0)
    if round_n == 1:
        return (
            f"[{specialist}] Round 1 reading: activation={score:.2f}; pattern is "
            f"consistent with moderate engagement of the {specialist} network. "
            f"Confidence: med."
        )
    peer_hint = ""
    if peer_round1:
        first_peer = next(iter(peer_round1))
        peer_hint = f" Cross-network: {first_peer} signal noted."
    return (
        f"[{specialist}] Round 2 revised: activation={score:.2f}; holding prior "
        f"call after peer review.{peer_hint} Confidence: med."
    )


# ---------- The swarm ----------


class SpecialistSwarm:
    """2-pass K2 per-region specialist swarm."""

    def __init__(self, max_parallel: int = 6) -> None:
        self.max_parallel = max_parallel
        self._mock = os.getenv("MOCK_K2") == "1"
        self._client: _K2ReasoningClient | None = None

    def _get_client(self) -> _K2ReasoningClient:
        if self._client is None:
            self._client = _K2ReasoningClient()
        return self._client

    async def _call_one(
        self,
        specialist: str,
        system_prompt: str,
        user_msg: str,
        sem: asyncio.Semaphore,
        round_n: int,
        averaged: dict[str, float],
        peer_round1: dict[str, str] | None = None,
    ) -> tuple[str, str]:
        async with sem:
            if self._mock:
                return specialist, _mock_response(specialist, averaged, round_n, peer_round1)
            try:
                text = await self._get_client().chat(system_prompt, user_msg, max_tokens=180)
                if not text or not text.strip():
                    text = f"[{specialist}: empty response]"
                return specialist, text.strip()
            except Exception as exc:  # noqa: BLE001 — broad on purpose
                return specialist, f"[{specialist}: call failed — {type(exc).__name__}]"

    async def run(
        self,
        brain_pattern: Any,
        scenario: str,
        specialist_roster: list[str],
        prompts_dir: Path,
    ) -> SwarmResult:
        averaged = _time_averaged_regions(brain_pattern)
        sem = asyncio.Semaphore(self.max_parallel)

        # Round 1 — independent fan-out
        r1_tasks = [
            asyncio.create_task(
                self._call_one(
                    spec,
                    _load_prompt(spec, prompts_dir),
                    _build_round1_user_msg(spec, averaged, scenario),
                    sem,
                    round_n=1,
                    averaged=averaged,
                )
            )
            for spec in specialist_roster
        ]
        round_1: dict[str, str] = dict(await asyncio.gather(*r1_tasks))

        # Round 2 — cross-talk fan-out
        r2_tasks = []
        for spec in specialist_roster:
            peer_r1 = {p: t for p, t in round_1.items() if p != spec}
            r2_tasks.append(
                asyncio.create_task(
                    self._call_one(
                        spec,
                        _load_prompt(spec, prompts_dir),
                        _build_round2_user_msg(
                            spec, averaged, scenario, round_1.get(spec, ""), peer_r1
                        ),
                        sem,
                        round_n=2,
                        averaged=averaged,
                        peer_round1=peer_r1,
                    )
                )
            )
        round_2: dict[str, str] = dict(await asyncio.gather(*r2_tasks))

        return SwarmResult(
            round_1=round_1,
            round_2=round_2,
            cross_region_edges=_compute_edges(round_2, round_1),
            scenario=scenario,
            specialists_used=list(specialist_roster),
        )


__all__ = ["SpecialistSwarm", "SwarmResult"]
