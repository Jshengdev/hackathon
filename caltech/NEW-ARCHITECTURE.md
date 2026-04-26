---
title: "Empathy Layer — Canonical Architecture (post-refactor target)"
status: target architecture; refactor in progress
sources:
  - _bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md (v2 — §3 + §4 are authoritative)
  - caltech/architecture-overview.md (v2 — full prose walk-through)
  - caltech/CONSTRAINTS.md, caltech/CONTRACTS.md
---

# Canonical Architecture — Empathy Layer Engine (refactor target)

This is the **single doc** that every Claude instance — orchestrator, audit shard, refactor shard — should read first. It collapses the technical PRD §3 + §4, the architecture-overview §4, and the refactor's locked decisions into one place.

## 1. The pipeline (v2 — TRIBE-cut, swarm-loop merged, Opus terminal-only)

```
┌─────────────────────────────────────────────────────────────────────┐
│  INPUT: backend/prerendered/<clip_id>/                              │
│  Hard-code name match: filename → clip_id → folder.                 │
│  Folder must contain activity.json (TRIBE V2 pre-rendered offline). │
└────────────────────────────────────┬────────────────────────────────┘
                                     │
        ┌────────────────────────────┼────────────────────────────┐
        ▼                            ▼                            │
┌─────────────────────┐   ┌─────────────────────────────┐         │
│ STAGE 1A — VISION   │   │ STAGE 1B — K2 SWARM          │         │
│ Qwen3-VL/OpenRouter │   │ 7 parallel K2 calls           │         │
│ Reads 5 frames →    │   │ Reads activity.json →         │         │
│ vision_report.json  │   │ swarm_readings.json           │         │
│ services/           │   │ services/swarm_runner.py      │         │
│  vision_client.py   │   │                               │         │
│ ≤ 10s               │   │ ≤ 8s parallel                 │         │
└──────────┬──────────┘   └──────────────┬────────────────┘         │
           │                             │                          │
           └─────────────┬───────────────┘                          │
                         ▼                                          │
                ┌──────────────────────────────────────────┐        │
                │ STAGE 2 — K2 MODERATOR (per round)        │        │
                │ ONE K2 call combines vision + swarm        │        │
                │  + (rounds≥2) prior_score + per_region_miss│       │
                │ → candidate_paragraph                      │        │
                │ services/empathy_synthesis.py              │        │
                │ ≤ 5s per round                             │        │
                └──────────────────┬─────────────────────────┘        │
                                   ▼                                  │
                ┌──────────────────────────────────────────┐          │
                │ STAGE 3 — K2 EVALUATOR SWARM             │          │
                │ For round in 1..8 (plateau-exit):         │          │
                │   7 parallel K2 evaluator calls           │          │
                │   each: score (0..1) + 1-sentence justify │          │
                │   round_score = mean of 7                 │          │
                │   exit when |Δ|<0.02 over 2 rounds OR R==8│          │
                │ services/iterative_loop.py                │          │
                │ ≤ 60s for 8 rounds                        │          │
                │ Emits: empathy.json (best_paragraph +     │          │
                │   round_trajectory + per_region_attribution│          │
                └──────────────────┬─────────────────────────┘          │
                                   ▼                                    │
                ┌──────────────────────────────────────────┐            │
                │ STAGE 4 — OPUS POLISH (CUT-LINE; gated)  │            │
                │ Anthropic Claude Opus 4.7                 │            │
                │ Impl: services/empathy_polish.py           │            │
                │ ENV-FLAG: OPUS_POLISH=1 (default OFF).     │            │
                │ ONE call. ~140 output tokens. ~100-word    │            │
                │ literary polish over best_paragraph.       │            │
                │ Fallback (failure / guardrail / flag-off): │            │
                │  polished_paragraph: null; frontend prefers│            │
                │  polished || best. Logger.error structured.│            │
                │ Cut-line @ 8 PM Sat = OPUS_POLISH=0 re-bake│            │
                │  of cache JSON; NOT a code rollback.       │            │
                │ ≤ 5s; runs in warmup BackgroundTask.       │            │
                └──────────────────┬─────────────────────────┘            │
                                   ▼                                      │
                ┌──────────────────────────────────────────┐              │
                │ STAGE 5 — EMBEDDING-PROXY FALSIFICATION  │              │
                │ sentence-transformers/all-MiniLM-L6-v2    │              │
                │ embed best paragraph → 384-dim → 7-dim    │              │
                │  via projection_map.npy (W: 384×7)        │              │
                │ main_score = cos(emb@W, mean activity)    │              │
                │ control_score = cos(emb@W, control act)   │              │
                │ delta = main_score − control_score        │              │
                │ verdict = "anchored" if delta>0.40        │              │
                │           else "generic_plausible"        │              │
                │           else "control_unavailable"      │              │
                │           (when control activity missing) │              │
                │ Output (short-form, A4-deepdive Pick B):  │              │
                │   {main_score, control_score, delta,      │              │
                │    verdict}                               │              │
                │ services/falsification.py                 │              │
                │ ≤ 200ms                                   │              │
                └──────────────────┬─────────────────────────┘              │
                                   ▼                                        │
                ┌──────────────────────────────────────────┐                │
                │ EMPATHY-LAYER DOCUMENT (frontend)        │                │
                │ §A Vision Report (Stage 1A)              │                │
                │ §B Empathy Paragraph                     │                │
                │     (polished_paragraph if OPUS_POLISH=1 │                │
                │      and Stage 4 succeeded; else         │                │
                │      best_paragraph from Stage 3)        │                │
                │ §C Falsification Evidence (Stage 5):     │                │
                │     {main_score, control_score, delta,   │                │
                │      verdict} + per-region attribution   │                │
                │     (Stage 3) + round trajectory         │                │
                │     (collapsed)                          │                │
                │ PersonaShell: workplace / consumer /     │                │
                │   pavilion (per scenario.json)           │                │
                └──────────────────────────────────────────┘                │
                                                                            │
Fan-in summary: TRIBE = pre-rendered ONLY (offline). Live = Qwen3-VL + 3×K2 + Opus polish + proxy.
```

## 2. Stack (model + API per stage)

| Stage | Tool | Model | API | Cost |
|---|---|---|---|---|
| 1A Vision | Qwen3-VL via OpenRouter | `qwen/qwen3-vl-235b-a22b-instruct` | `https://openrouter.ai/api/v1` | $0.20/$0.88 per M tokens |
| 1B Swarm specialists | Cerebras K2 Think | `MBZUAI-IFM/K2-Think-v2` | `https://api.k2think.ai/v1` | Free (sponsor) |
| 2 Moderator | Cerebras K2 Think (same surface) | `MBZUAI-IFM/K2-Think-v2` | same | Free |
| 3 Evaluator swarm | Cerebras K2 Think (same surface) | `MBZUAI-IFM/K2-Think-v2` | same | Free |
| 4 Polish | Anthropic Claude Opus 4.7 | `claude-opus-4-7` | Messages API | $5/$25 per M tokens |
| 5 Falsification | sentence-transformers (CPU) | `all-MiniLM-L6-v2` | local | Free |

K2 plays three roles on one surface — same auth, three prompt files (`backend/prompts/{network}.md` × 7 + `moderator_synthesis.md` + `evaluator_score.md`).

## 3. Pre-rendered cache layout (per clip)

```
backend/prerendered/<clip_id>/
├── <clip_id>.mp4                  ← original video (frame extraction for 1A)
├── activity.json                  ← TRIBE V2 brain output (offline-baked, OUR INPUT)
├── scenario.json                  ← {"scenario": "ironside"|"consumer", "label": "..."}
├── vision_report.json             ← Stage 1A output (cached after first call)
├── swarm_readings.json            ← Stage 1B output
├── k2_region_cache.json           ← 7 networks × N seconds of K2 readings
│                                     (instant brain-3D click responses)
├── empathy.json                   ← Stages 2 + 3 + 4 result
│                                     {best_paragraph, polished_paragraph,
│                                      polish_status, polish_error,
│                                      final_score, round_trajectory[],
│                                      per_region_attribution{}, falsification:
│                                       {main_score, control_score, delta,
│                                        verdict}}
├── falsification.json             ← Stage 5 result
└── (control_activity.json optional — only on control clips for falsification)
```

**Pre-warmup contract (PRD §3):** `POST /demo/match` triggers `BackgroundTask` `services/warmup.py:warmup_clip` to pre-bake every Layer 1 cache file. Frontend polls `/demo/warmup-status/{clip_id}` until `ready: true`, then transitions Loading → Dashboard. Subsequent reads are O(1) — `SESSION_CACHE` (memory) → disk → cold compute.

## 4. API surface

| Method | Path | Returns | Purpose |
|---|---|---|---|
| GET | `/demo/clips` | clip list with thumbnails | landing UI |
| POST | `/demo/match` `{filename}` | clip_id + warmup task started | upload → resolve |
| GET | `/demo/warmup-status/{clip_id}` | `{ready: bool, stages_done: [...]}` | loading poll |
| GET | `/demo/vision-report/{clip_id}` | vision_report.json | dashboard panel |
| GET | `/demo/activity/{clip_id}` | activity.json | brain mesh activations |
| GET | `/demo/empathy/{clip_id}` | empathy.json (full document) | hero output |
| GET | `/demo/iterative-trajectory/{clip_id}` | round_trajectory[] | iterative loop visual |
| GET | `/demo/falsification/{clip_id}` | falsification.json | bottom strip |
| POST | `/demo/k2-region` `{clip_id, network, t}` | popup payload | brain-region hover |
| WS | `/ws` | per-frame swarm events | live agent edges |
| GET | `/brain/mesh` | fsaverage5 vertices + faces + Yeo7 labels | 3D init |
| GET/POST | `/brain/{status,start,stop,reload}` | sim control | dev/debug |

## 5. Frontend dashboard (greenchain layout × icarus 3D hover anchors)

**Single page** — collapse Landing → Loading → Main → Comparison into one dashboard with a brief Loading overlay.

```
┌──────────────────────────────────────────────────────────────────────┐
│  [scenario chip]                              [persona switcher]      │
├──────────────────────────────────────────────────────────────────────┤
│ ┌──────────────┐         ┌──────────────────┐  ┌────────────────────┐│
│ │ Vision       │         │                  │  │ K2 Swarm Activity  ││
│ │ Report (1A)  │         │                  │  │ (live, per-network ││
│ │              │         │                  │  │  specialist firing)││
│ └──────────────┘         │                  │  └────────────────────┘│
│ ┌──────────────┐         │   BRAIN HERO     │  ┌────────────────────┐│
│ │ Persona      │         │  (Three.js +     │  │ Iterative Loop     ││
│ │ + Clip Info  │         │  PresentationCtl │  │ (circular SVG —    ││
│ │              │         │  + 7 anchored    │  │  existing comp)    ││
│ │              │         │  hover zones)    │  │                    ││
│ └──────────────┘         │                  │  └────────────────────┘│
│                          │                  │  ┌────────────────────┐│
│                          │  hover→insight   │  │ Empathy Paragraph  ││
│                          │  card (icarus)   │  │ (Stage 4 polished, ││
│                          │                  │  │  literature-grade) ││
│                          └──────────────────┘  └────────────────────┘│
│ ┌──────────────────────────────────────────────────────────────────┐ │
│ │ Falsification: delta=0.57 anchored · per-region attribution       │ │
│ └──────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

**Vue 3 + Three.js translation of icarus R3F patterns:**
- `<Canvas>` → existing `BrainScene.vue` Three.js init
- `<PresentationControls>` → constrained `OrbitControls` (azimuth ±36°) OR custom quaternion drag with damping
- `<AnchorHoverZone>` → DOM div absolutely-positioned via `vector.project(camera)` per frame, sized in screen pixels
- `<InsightHtml>` → `RegionPopup.vue` portal'd, anchored to projected world coords with safe-triangle transit
- `<CameraRig>` parallax bob → manual mouse-tracked camera lerp in animation loop
- `<PostEffects>` → Three.js `EffectComposer` + `UnrealBloomPass` + custom vignette/grain shader

**Mirofish swarm pattern** (per `archive/MIROFISH-REFERENCE.md`): the per-agent action log shape (`{round, agent_id, action_type, action_args, result}`) is the schema for the WS swarm-activity feed. Translate `MOVE_TO_REGION` → `MOVE_TO_HOTSPOT`, add `position` + `velocity` in normalized brain-space coords. Keep the SimulationState enum (`idle → loading → spawning → running → completed`).

## 6. Where things live (repo layout — current vs target)

**Current state (don't fight it):**
```
hackathon/
├── backend/                    ← active demo backend (FastAPI, K2, Qwen, embedding proxy)
├── frontend/                   ← active demo UI (Vue 3 + Three.js)
├── caltech/                    ← project-work area (PRD, architecture, use cases, pitch-deck, this doc)
│   ├── architecture-overview.md (v2 — long-form prose)
│   ├── NEW-ARCHITECTURE.md     ← THIS FILE (canonical summary)
│   ├── pitch-deck/             ← public deck (separate Next.js project)
│   ├── use-cases/, yaps/, ...
├── _bmad-output/               ← planning artifacts (technical PRD, strategic PRD)
├── _bmad/                      ← BMAD workflow config
├── refactor/                   ← THIS refactor's shards + audits + launcher
├── research/                   ← sponsor cloned repos, wikis, sources
│   └── INDEX.md                ← (NEW — see research/INDEX.md)
├── archive/                    ← historical artifacts (Mirofish ref, old docs)
└── junsoo/, feesh/             ← scratch areas (review for archive/cleanup)
```

**Target layout (clean repo, post-refactor):**
- `backend/` + `frontend/` STAY at root — that's where the demo runs.
- All design + planning + use-case docs live under `caltech/`.
- All research (sponsor clones, wikis, source material) lives under `research/`.
- `archive/` collects everything that was once load-bearing but isn't anymore.
- Root has only: top-level configs, `tmux-spawn-all.sh`, README/TODO.

The structure consolidation shard (A7) audits the actual moves needed; refactor shard R7 executes them.

## 7. Locked rules (from caltech/CONSTRAINTS.md — abbreviated)

1. **TRIBE V2 NEVER live.** Pre-rendered activity.json only. Cache miss → log + 404.
2. **No silent stubs.** Failures log structurally + return error payloads + render visibly. Dev-mode mocks gated behind `import.meta.env.DEV` / `MOCK_*=1`.
3. **Swarm-loop merged.** K2 specialists fire INSIDE each loop round (Stages 1B + 2 + 3 are one K2 surface). Opus is Stage 4 polish only, runs ONCE post-loop, cut-line. **Stage 4 ship path:** `services/empathy_polish.py`, gated `OPUS_POLISH=1` (default OFF), single Anthropic Messages API call (~140 output tokens), K2-best fallback on any failure or guardrail violation. Cut-line at 8 PM Saturday is implemented as `OPUS_POLISH=0` re-bake of the cache JSON — frontend already prefers `polished_paragraph || best_paragraph`; no code rollback required.
4. **Frontend dashboard.** Single page, brain-hero + ringed panels (greenchain layout), icarus-style hover anchors with insight cards.
5. **Real data only.** Every panel consumes a real backend endpoint; missing data renders "REAL DATA MISSING" red badge in PROD.
6. **Don't be a blocker.** Constraints are guardrails. If a real demo-day deadline conflicts, surface as audit finding, don't freeze.

## 8. Refactor shards (audit-then-refactor sequence)

**Audit pass (8 shards, parallel via tmux):**

| # | Shard | Purpose |
|---|---|---|
| A1 | prerender-cache | TRIBE-cut + activity.json layout audit |
| A2 | stub-fallbacks | Catalog every silent-substitution violation |
| A3 | swarm-loop-merge | Verify code matches v2 §3 architecture |
| A4 | frontend-empathy-wiring | Replace inline mocks with real /demo/empathy fetch |
| A5 | prd-alignment-master | FR/NFR coverage; flag stale strategic PRD |
| A6 | qa-eval-harness | No-fallback eval tools + golden outputs + e2e gate |
| A7 | structure-consolidation | Long-term repo layout proposal |
| A8 | brain-dashboard-redesign | Greenchain layout × icarus 3D hover anchors |

**Refactor pass (R-shards, sequential after audits land):** the orchestrator window will write R1–R8 + R-DOCS based on audit findings.

## 9. References

- Strategic PRD: `_bmad-output/planning-artifacts/ironsight-listenlabs-prd.md` (currently STALE — R-DOCS rewrites)
- Technical PRD v2: `_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md` (§3 + §4 authoritative; §13 + §14 carry v1 with `[v2-superseded]` tags)
- Architecture overview v2: `caltech/architecture-overview.md`
- Mirofish swarm patterns: `archive/MIROFISH-REFERENCE.md`
- Greenchain dashboard: `research/sponsors/k2-think/clones/greenchain/backend/CLAUDE.md`
- Icarus 3D hover anchors: `/Users/johnnysheng/code/icarus/web/src/three/`
- Refactor shards: `refactor/shards/A{1-8}-*.md`
- Refactor constraints: `caltech/CONSTRAINTS.md`
- Refactor contracts: `caltech/CONTRACTS.md`
