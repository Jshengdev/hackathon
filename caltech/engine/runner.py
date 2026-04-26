"""End-to-end Empathy-Layer Engine orchestrator.

Wires every stage together (per `caltech/architecture-overview.md`):

    INPUT VIDEO ─┐
                 ├── Stage 1 vision  (parallel)
                 └── TRIBE V2 reverse (parallel)
                          ↓
                  K2 specialist swarm (2-pass)
                          ↓
                  Stage 2 round-1 synthesis
                          ↓
                  Iterative loop ×8 rounds
                          ↓
                  Falsification check
                          ↓
                  EmpathyDocument

Two execution lanes per stage: (1) pre-cache fallback when
``<prerendered>/<clip_id>/<stage>.json`` exists, (2) live call (honouring
per-stage MOCK_* env vars). Sibling modules being authored in parallel are
imported via try/except ImportError so this orchestrator runs even before
they land — stubs keep the schema honest.
"""
from __future__ import annotations

import argparse
import asyncio
import json
import sys
import time
from pathlib import Path
from typing import Any

from pydantic import BaseModel, ConfigDict, ValidationError

from caltech.engine.stage1 import VisionClassifier, VisionReport
from caltech.engine.stage2 import (
    CandidateParagraph,
    EmpathySynthesizer,
    SynthesisInput,
)
from caltech.engine.iterative_loop import IterativeLoop, LoopResult
from caltech.engine.falsification import (
    FalsificationResult,
    compute_falsification,
)
from junsoo.brain.reverse import encode_video
from junsoo.brain.forward import predict_brain_from_text
from junsoo.brain.schema import BrainPattern

# ── Swarm sibling (Jacob's lane) ────────────────────────────────────────────
try:
    from caltech.engine.swarm import SpecialistSwarm  # type: ignore
    _SWARM_AVAILABLE = True
except ImportError:
    _SWARM_AVAILABLE = False

    class SpecialistSwarm:  # type: ignore[no-redef]
        """Stub mirror of swarm.SpecialistSwarm.run(...) shape."""

        def __init__(self, max_parallel: int = 6) -> None:
            self.max_parallel = max_parallel

        async def run(
            self,
            brain_pattern: BrainPattern,
            scenario: str,
            specialist_roster: list[str],
            prompts_dir: Path,
        ) -> Any:
            class _R:
                pass

            r = _R()
            r.round_1 = {k: f"[stub-r1] {k}." for k in specialist_roster}
            r.round_2 = {k: f"[stub-r2] {k} obs." for k in specialist_roster}
            r.cross_region_edges = []
            r.scenario = scenario
            r.specialists_used = list(specialist_roster)
            return r


# ── Registry sibling (Johnny's lane) ────────────────────────────────────────
_STUB_SYSTEM_PROMPT = (
    "[stub-prompt] You are an empathy translator. Be observational, "
    "evidence-grounded, and never claim subjective mental states."
)
try:
    from caltech.engine.registry import (  # type: ignore
        get_scenario as _real_get_scenario,
        load_prompt as _real_load_prompt,
    )
    _REGISTRY_AVAILABLE = True
except ImportError:
    _REGISTRY_AVAILABLE = False
    _VALID_SCENARIOS = {"ironsight_workplace", "listenlabs_sideshift_consumer"}


def get_scenario(name: str) -> Any:
    if _REGISTRY_AVAILABLE:
        return _real_get_scenario(name)
    if name not in _VALID_SCENARIOS:
        raise ValueError(f"unknown scenario: {name!r}")
    return {"name": name, "stub": True}


def load_stage2_prompt(scenario: str) -> str:
    """Return the Stage 2 system prompt; stub if registry/file is missing."""
    if _REGISTRY_AVAILABLE:
        try:
            return _real_load_prompt(scenario, 2)
        except (FileNotFoundError, OSError):
            return _STUB_SYSTEM_PROMPT
    return _STUB_SYSTEM_PROMPT


# ── Public schema ───────────────────────────────────────────────────────────
class EmpathyDocument(BaseModel):
    """Final orchestrator output: vision_report + best_paragraph + falsification."""

    model_config = ConfigDict(extra="forbid")

    clip_id: str
    scenario: str
    vision_report: dict
    best_paragraph: str
    final_score: float
    round_trajectory: list[dict]
    per_region_attribution: dict[str, dict[str, float]]
    falsification: dict | None
    model_metadata: dict[str, Any]


# ── Cache helpers ───────────────────────────────────────────────────────────
def _cache_path(prerendered: Path | None, clip_id: str, name: str) -> Path | None:
    if prerendered is None:
        return None
    return prerendered / clip_id / f"{name}.json"


def _try_load_json(path: Path | None) -> dict | None:
    if path is None or not path.exists():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None


def _log(idx: int, total: int, name: str, source: str, dt: float) -> None:
    print(
        f"==> [{idx}/{total}] {name} ({source}): {dt:.1f}s",
        file=sys.stderr,
        flush=True,
    )


# ── Engine ──────────────────────────────────────────────────────────────────
class EmpathyEngine:
    """Orchestrates the six-stage pipeline. One instance per CLI invocation."""

    TOTAL_STAGES = 6

    def __init__(
        self,
        prerendered: Path | None = None,
        max_rounds: int = 8,
    ) -> None:
        self.prerendered = prerendered
        self.max_rounds = max_rounds
        self.vision = VisionClassifier()
        self.synthesizer = EmpathySynthesizer()
        self.swarm = SpecialistSwarm()
        self.loop = IterativeLoop()

    async def _stage1(
        self, video_path: Path, scenario: str, clip_id: str
    ) -> tuple[VisionReport, str, float]:
        cached = _try_load_json(_cache_path(self.prerendered, clip_id, "vision_report"))
        t0 = time.perf_counter()
        if cached is not None:
            return VisionReport.model_validate(cached), "cached", time.perf_counter() - t0
        report = await self.vision.classify(video_path, scenario=scenario)
        return report, "live", time.perf_counter() - t0

    async def _stage_reverse(
        self, video_path: Path, scenario: str, clip_id: str
    ) -> tuple[BrainPattern, str, float]:
        cached = _try_load_json(_cache_path(self.prerendered, clip_id, "target_brain"))
        t0 = time.perf_counter()
        if cached is not None:
            return BrainPattern.model_validate(cached), "cached", time.perf_counter() - t0
        target = await encode_video(video_path, scenario=scenario)
        return target, "live", time.perf_counter() - t0

    async def _stage_swarm(
        self,
        target: BrainPattern,
        vision_report: VisionReport,
        scenario: str,
        clip_id: str,
    ) -> tuple[dict[str, Any], str, float]:
        """Returns a normalized dict whose `specialist_observations` (Round 2)
        feeds Stage 2; `round_1_raw` + `cross_region_edges` go to metadata."""
        cached = _try_load_json(_cache_path(self.prerendered, clip_id, "swarm_result"))
        t0 = time.perf_counter()
        if cached is not None:
            return cached, "cached", time.perf_counter() - t0

        roster = sorted({k for f in target.frames for k in f.regions.keys()})
        prompts_dir = Path(__file__).parent / "prompts" / "specialists"
        raw = await self.swarm.run(
            brain_pattern=target,
            scenario=scenario,
            specialist_roster=roster,
            prompts_dir=prompts_dir,
        )
        _ = vision_report  # reserved for future K2 prompt revisions
        result = {
            "specialist_observations": dict(getattr(raw, "round_2", {})),
            "round_1_raw": dict(getattr(raw, "round_1", {})),
            "cross_region_edges": list(getattr(raw, "cross_region_edges", [])),
            "model_metadata": {
                "n_specialists": len(roster),
                "specialists_used": list(getattr(raw, "specialists_used", roster)),
                "swarm_available": _SWARM_AVAILABLE,
            },
        }
        return result, "live", time.perf_counter() - t0

    async def _stage_loop(
        self,
        target: BrainPattern,
        vision_report: VisionReport,
        swarm_result: dict[str, Any],
        scenario: str,
        clip_id: str,
    ) -> tuple[LoopResult, str, float]:
        cached = _try_load_json(_cache_path(self.prerendered, clip_id, "round_trajectory"))
        t0 = time.perf_counter()
        if cached is not None:
            try:
                return LoopResult.model_validate(cached), "cached", time.perf_counter() - t0
            except ValidationError:
                pass  # bad cache — fall through to live run

        avg_vec = target.flatten_regions()
        target_keys = sorted(
            {k for f in target.frames for k in f.regions.keys()}
        )
        brain_summary = {
            k: float(avg_vec[i]) if i < len(avg_vec) else 0.0
            for i, k in enumerate(target_keys)
        }
        specialist_obs: dict[str, str] = swarm_result.get("specialist_observations", {})
        system_prompt = load_stage2_prompt(scenario)

        synthesizer = self.synthesizer
        vr = vision_report

        class _SynthShim:
            async def synthesize(_self, payload: dict[str, Any]) -> CandidateParagraph:
                si = SynthesisInput(
                    vision_report=vr,
                    brain_pattern_summary=brain_summary,
                    specialist_observations=specialist_obs,
                    round_n=int(payload["round_n"]),
                    previous_score=payload.get("prior_score"),
                    per_region_miss=payload.get("per_region_miss") or None,
                    system_prompt=system_prompt,
                    scenario=scenario,
                )
                return await synthesizer.synthesize(si)

        async def _predict(text: str):
            return await predict_brain_from_text(text, scenario=scenario)

        loop_result = await self.loop.run(
            target=target,
            synthesizer=_SynthShim(),
            predict_brain_fn=_predict,
            initial_payload={"scenario": scenario},
            max_rounds=self.max_rounds,
        )
        return loop_result, "live", time.perf_counter() - t0

    async def _stage_falsification(
        self,
        best_paragraph: str,
        final_score: float,
        control_brain: BrainPattern | None,
        clip_id: str,
        main_video_id: str,
    ) -> tuple[FalsificationResult | None, str, float]:
        t0 = time.perf_counter()
        if control_brain is None:
            cached = _try_load_json(
                _cache_path(self.prerendered, clip_id, "control_brain")
            )
            if cached is not None:
                control_brain = BrainPattern.model_validate(cached)
        if control_brain is None:
            return None, "skipped", time.perf_counter() - t0

        async def _predict(text: str):
            return await predict_brain_from_text(text)

        result = await compute_falsification(
            best_paragraph=best_paragraph,
            target_score=final_score,
            control_target=control_brain,
            predict_brain_fn=_predict,
            main_video_id=main_video_id,
        )
        return result, "live", time.perf_counter() - t0

    async def run(
        self,
        video_path: Path,
        scenario: str,
        control_brain: BrainPattern | None = None,
    ) -> EmpathyDocument:
        get_scenario(scenario)  # raises on unknown scenario
        clip_id = video_path.stem or "unnamed_clip"
        latencies: dict[str, float] = {}
        sources: dict[str, str] = {}
        run_started = time.time()
        N = self.TOTAL_STAGES

        # Stage 1 + reverse run concurrently. We log them as separate steps
        # because that matches the architecture diagram even though wall-time
        # is shared.
        (vr, vis_src, vis_dt), (target, rev_src, rev_dt) = await asyncio.gather(
            self._stage1(video_path, scenario, clip_id),
            self._stage_reverse(video_path, scenario, clip_id),
        )
        _log(1, N, "Stage 1 vision", vis_src, vis_dt)
        _log(2, N, "TRIBE reverse", rev_src, rev_dt)
        latencies["stage1_vision_s"] = vis_dt
        latencies["tribe_reverse_s"] = rev_dt
        sources["stage1_vision"] = vis_src
        sources["tribe_reverse"] = rev_src

        swarm_result, swarm_src, swarm_dt = await self._stage_swarm(
            target, vr, scenario, clip_id
        )
        _log(3, N, "K2 swarm 2-pass", swarm_src, swarm_dt)
        latencies["k2_swarm_s"] = swarm_dt
        sources["k2_swarm"] = swarm_src

        loop_result, loop_src, loop_dt = await self._stage_loop(
            target, vr, swarm_result, scenario, clip_id
        )
        _log(
            4, N,
            f"Iterative loop ×{len(loop_result.round_trajectory)}",
            loop_src, loop_dt,
        )
        latencies["iterative_loop_s"] = loop_dt
        sources["iterative_loop"] = loop_src

        fals, fals_src, fals_dt = await self._stage_falsification(
            best_paragraph=loop_result.best_paragraph,
            final_score=loop_result.final_score,
            control_brain=control_brain,
            clip_id=clip_id,
            main_video_id=target.video_id,
        )
        _log(5, N, "Falsification", fals_src, fals_dt)
        latencies["falsification_s"] = fals_dt
        sources["falsification"] = fals_src

        doc = EmpathyDocument(
            clip_id=clip_id,
            scenario=scenario,
            vision_report=vr.model_dump(),
            best_paragraph=loop_result.best_paragraph,
            final_score=loop_result.final_score,
            round_trajectory=[r.model_dump() for r in loop_result.round_trajectory],
            per_region_attribution=loop_result.per_region_attribution,
            falsification=fals.model_dump() if fals is not None else None,
            model_metadata={
                "started_at": run_started,
                "completed_at": time.time(),
                "latencies": latencies,
                "stage_sources": sources,
                "max_rounds": self.max_rounds,
                "rounds_executed": len(loop_result.round_trajectory),
                "swarm_metadata": swarm_result.get("model_metadata", {}),
                "models": {
                    "vision": getattr(self.vision, "model", None),
                    "synthesizer": getattr(self.synthesizer, "model", None),
                },
            },
        )
        _log(6, N, "Document assembled", "ok", 0.0)
        return doc


# ── CLI ─────────────────────────────────────────────────────────────────────
def _build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="caltech.engine.runner")
    p.add_argument("--video", required=True, type=Path)
    p.add_argument(
        "--scenario",
        required=True,
        choices=["ironsight_workplace", "listenlabs_sideshift_consumer"],
    )
    p.add_argument("--out", required=True, type=Path)
    p.add_argument("--prerendered", type=Path, default=None)
    p.add_argument("--max-rounds", type=int, default=8)
    return p


async def _amain(argv: list[str]) -> int:
    args = _build_parser().parse_args(argv)
    engine = EmpathyEngine(prerendered=args.prerendered, max_rounds=args.max_rounds)
    try:
        doc = await engine.run(args.video, args.scenario)
    except (ValidationError, ValueError, RuntimeError) as exc:
        print(f"runner: pipeline failed: {exc}", file=sys.stderr)
        return 2
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(doc.model_dump_json(indent=2), encoding="utf-8")
    return 0


def main() -> None:
    sys.exit(asyncio.run(_amain(sys.argv[1:])))


if __name__ == "__main__":
    main()
