# `caltech/engine/` — Empathy Layer Engine

The end-to-end backend pipeline for the Caltech HackTech 2026 Empathy Layer. Takes a video → produces a brain-grounded paragraph describing what the human felt during the footage, with a falsifiable similarity score and per-region attribution.

Strategic context: [`../architecture-overview.md`](../architecture-overview.md).
Technical spec: [`../../_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md`](../../_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md).

## Pipeline

```
INPUT VIDEO ─┬──► stage1.py (Qwen3-VL) ────► VisionReport ─┐
             │                                              │
             └──► junsoo.brain.reverse ────► BrainPattern ──┤
                                                ↓           │
                                          swarm.py (K2)     │
                                                ↓           │
                                       SwarmResult (R1+R2)──┤
                                                            ▼
                                                      stage2.py (Opus)
                                                            ↓
                                                   CandidateParagraph
                                                            ↓
                                              iterative_loop.py (×8 rounds)
                                                            ↓
                                                       LoopResult
                                                            ↓
                                              falsification.py (vs control)
                                                            ↓
                                                  EmpathyDocument (runner.py)
```

## Modules

| File | Owns | External calls |
|---|---|---|
| `stage1.py` | Stage 1 vision classification | OpenRouter Qwen3-VL |
| `stage2.py` | Stage 2 empathy synthesis | Anthropic Claude Opus 4.7 |
| `swarm.py` | 8-region specialist swarm, 2-pass cross-talk | Cerebras K2 Think |
| `score.py` | Cosine similarity + plateau detection | none (pure numpy) |
| `iterative_loop.py` | 8-round iterative scoring orchestrator | calls stage2 + brain.forward |
| `falsification.py` | Falsification delta vs control video | calls brain.forward |
| `registry.py` | Per-scenario hot-swap config (workplace vs consumer) | none |
| `guardrails.py` | Forbidden-claim regex pre-flight | none (pure regex) |
| `runner.py` | End-to-end orchestrator + CLI + pre-cache fallback | calls everything |
| `sample_fixture.py` | Stub control BrainPattern for tests | none |

## Env vars

See [`.env.example`](.env.example). All three live providers:

```bash
# Cerebras — K2 Think (swarm + loop control)
K2_API_KEY=sk-...
K2_BASE_URL=https://api.cerebras.ai/v1
K2_MODEL=k2-think-v2

# OpenRouter — Qwen3-VL (Stage 1)
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# Anthropic — Claude Opus 4.7 (Stage 2)
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-opus-4-7
```

## Running

### Offline (no API keys required)

Every module has a `MOCK_*` env-var path that returns deterministic fake outputs:

```bash
# Per-module
MOCK_FORWARD=1   python3 junsoo/brain/test_brain_offline.py
MOCK_VISION=1 MOCK_OPUS=1 python3 -m caltech.engine.test_stages_offline
                  python3 -m caltech.engine.test_loop_offline
                  python3 -m caltech.engine.test_registry_guardrails
MOCK_K2=1        python3 -m caltech.engine.test_swarm_offline

# End-to-end (all mocks)
MOCK_VISION=1 MOCK_OPUS=1 MOCK_K2=1 MOCK_FORWARD=1 \
    python3 -m caltech.engine.test_runner_offline
```

Use these in CI, on planes, when API keys aren't set up yet.

### Live (requires all three keys)

```bash
python3 -m caltech.engine.runner \
    --video junsoo/prerendered/example_clip/video.mp4 \
    --scenario ironsight_workplace \
    --out /tmp/empathy_output.json
```

### With pre-cache fallback (demo-day mode)

```bash
python3 -m caltech.engine.runner \
    --video junsoo/prerendered/example_clip/video.mp4 \
    --scenario ironsight_workplace \
    --prerendered junsoo/prerendered \
    --out /tmp/empathy_output.json
```

If `<prerendered>/<clip_id>/{vision_report,target_brain,control_brain,swarm_result,round_trajectory}.json` exists, the runner reads from disk instead of calling the API. Stage by stage — partial pre-cache is fine.

## Lane discipline

This module is the **new** Empathy Engine. The older `junsoo/report_card/` module is the previous Ironside-only experiment (8 specialists + JSON report card, K2-only). It still works and shares some helpers, but the two pipelines are independent — they were built under different strategic frames. New work goes here; old report-card stays in maintenance.

## Forbidden claims (NON-NEGOTIABLE)

The synthesis prompt + `guardrails.py` regex pre-flight enforce these in every empathy paragraph:

| Forbidden | Allowed alternative |
|---|---|
| Reverse inference (*"she felt grief"*) | *"emotional-processing specialist sustained engagement"* |
| Clinical claims (*"clinical fatigue"*) | *"workforce-context augmentation, not psychological evaluation"* |
| Sub-second predictions | Per-second granularity only (TRIBE is 1Hz, 5s HRF lag) |
| Population-norm comparison (*"average healthy brain"*) | Within-subject contrast only |
| Inflated TRIBE numbers (70K voxels, 700 subjects) | ~20K vertices, ~25 subjects |

Tested with positive + negative cases in `test_registry_guardrails.py`.

## Architecture invariants

- **Every stage has a pre-cache fallback** — the demo never depends on a single live API
- **Round trajectory is the visual reveal** — score climbing 0.42 → 0.84 across 8 rounds is logged in `round_trajectory[]` and consumed by frontend
- **K2 is the speed layer; Opus is the depth layer** — never invert the roles (Decision 008)
- **Same engine, two scenarios** — workplace vs. consumer differ ONLY in the prompt registry (`registry.py`); the binary is one
