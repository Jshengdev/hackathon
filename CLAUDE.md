# CLAUDE.md — Repo navigation for any Claude Code session

You are working in the **Caltech HackTech 2026 Empathy Layer** project. This file is your map. Read it first; drill into the linked files only when your task needs them.

## TL;DR — what this project is

A demo that takes a 30s video, runs **K2 swarm + iterative scoring loop** over a **pre-rendered TRIBE V2 brain pattern**, and produces an empathy paragraph polished by **Opus 4.7**. Visualized as a single-page **Vue 3 + Three.js dashboard** with a 3D fsaverage5 brain in the center and surrounding K2/swarm/iterative-loop/falsification panels.

**TRIBE V2 is NOT run live** — `backend/prerendered/<clip_id>/activity.json` is the canonical brain artifact. See `caltech/NEW-ARCHITECTURE.md` for the full pipeline.

## Read these first (in order)

1. **`caltech/NEW-ARCHITECTURE.md`** — canonical v2 pipeline + locked rules + repo layout. **Single source of truth.**
2. **`refactor/CONSTRAINTS.md`** — locked rules (no silent stubs, TRIBE not live, swarm-loop merged, real data only).
3. **`refactor/CONTRACTS.md`** — cross-shard data schemas (activity.json, EmpathyDocument, API surface).
4. **`research/INDEX.md`** — research folder navigation (sponsors, wiki, papers, clones).

If your task touches design/UI, also read `caltech/pitch-deck/DESIGN.md` (Clay-inspired tokens — colors, typography, shadows).

## Repo map

```
hackathon/
├── CLAUDE.md                          ← this file
├── backend/                           ← FastAPI + K2 + Qwen + embedding proxy (active demo)
│   ├── main.py                        ← endpoints + WS
│   ├── services/                      ← swarm_runner, iterative_loop, empathy_synthesis,
│   │                                     falsification, embedding_proxy, vision_client,
│   │                                     k2_client, warmup, session_cache
│   ├── prompts/                       ← {network}.md ×7 + moderator_synthesis.md +
│   │                                     evaluator_score.md
│   ├── prerendered/                   ← per-clip cache (activity.json, vision_report.json,
│   │   └── <clip_id>/                   swarm_readings.json, empathy.json, falsification.json)
│   ├── qa_logs/                       ← QA test outputs + screenshots
│   └── .env                           ← K2_API_KEY (IFM-prefixed → api.k2think.ai),
│                                        VISION_API_KEY (OpenRouter → Qwen3-VL)
├── frontend/                          ← Vue 3 + Vite + Three.js demo
│   ├── src/
│   │   ├── App.vue                    ← stage router
│   │   ├── stages/                    ← LandingStage, LoadingStage, MainStage, ComparisonStage
│   │   ├── components/                ← BrainScene, RegionPopup, AnalysisPanel,
│   │   │                                IterativeLoop (greenchain-style circular loop)
│   │   ├── composables/               ← useActivityPlayback
│   │   ├── api/                       ← index.js (fetch helpers for /demo/*)
│   │   └── utils/                     ← colors.js (NETWORK_COLORS, networkHex)
│   └── vite.config.js
├── caltech/                           ← project work area (planning, design, story)
│   ├── NEW-ARCHITECTURE.md            ← canonical v2 architecture (READ FIRST)
│   ├── architecture-overview.md       ← v2 prose walk-through (long-form)
│   ├── pitch-deck/                    ← public deck (Next.js, separate project)
│   │   ├── DESIGN.md                  ← Clay-inspired design system (colors, fonts, shadows)
│   │   ├── app/globals.css            ← canonical CSS tokens
│   │   ├── app/round-1/, round-2/, sponsor/[sponsor]/
│   │   └── app/components/            ← Brain, BrainCanvas, Halftone, NavDots, RedDot, SlideKit
│   ├── use-cases/                     ← ironside, listenlabs, two-demo-scenarios, etc.
│   ├── yaps/                          ← Johnny's voice notes (raw thought capture)
│   ├── PRD-INPUT-BUNDLE.md            ← all PRD source material in one bundle
│   ├── prd-final.md, prd.md           ← prior PRD drafts
│   ├── narration-script-3min.md, demo-script.md
│   └── tasks-by-person/               ← per-person epic specs
├── _bmad-output/
│   └── planning-artifacts/
│       ├── ironsight-listenlabs-technical-prd.md   ← v2 (§3, §4 authoritative)
│       ├── ironsight-listenlabs-prd.md             ← strategic PRD (CURRENTLY STALE)
│       └── yc-defensibility-review.md
├── _bmad/                             ← BMAD workflow config (don't touch)
├── refactor/                          ← THIS refactor's shards + audits + launcher
│   ├── CONSTRAINTS.md                 ← rules
│   ├── CONTRACTS.md                   ← schemas
│   ├── shards/A1...A8.md              ← 8 audit shards
│   ├── audits/                        ← reports land here
│   └── spawn-audit-swarm.sh           ← tmux launcher
├── research/                          ← read research/INDEX.md first
│   ├── INDEX.md                       ← navigation map
│   ├── sources/                       ← raw papers, repos, transcripts
│   ├── sponsors/{ironsight,k2-think,listen-labs}/
│   │   └── clones/                    ← bridge, greenchain (HackPrinceton K2 demos)
│   └── wiki/{decisions,findings,patterns,projects,tools}/
├── archive/                           ← historical (Mirofish reference, old pipelines)
│   ├── MIROFISH-REFERENCE.md          ← swarm-orchestration patterns we steal
│   └── brain-swarm-README.md, future_plan.md
├── junsoo/                            ← scratch (review for archive)
├── feesh/                             ← scratch (review for archive)
└── tmux-spawn-all.sh                  ← legacy team-orchestration script (don't reuse for refactor)
```

## API surface (live demo)

| Method | Path | Returns |
|---|---|---|
| GET | `/demo/clips` | clip list |
| POST | `/demo/match` `{filename}` | clip_id + warmup task started |
| GET | `/demo/warmup-status/{clip_id}` | `{ready, stages_done}` |
| GET | `/demo/vision-report/{clip_id}` | Stage 1A output |
| GET | `/demo/activity/{clip_id}` | TRIBE pre-rendered activations |
| GET | `/demo/empathy/{clip_id}` | full EmpathyDocument |
| GET | `/demo/iterative-trajectory/{clip_id}` | round_trajectory[] |
| GET | `/demo/falsification/{clip_id}` | Stage 5 output |
| POST | `/demo/k2-region` | per-region popup payload |
| WS | `/ws` | per-frame swarm events |
| GET | `/brain/mesh` | fsaverage5 + Yeo7 labels |

## Skills to load (per task type)

**Always:**
- `superpowers:writing-plans` — convert findings into executable plan
- `superpowers:verification-before-completion` — claims need run-commands

**Audit / refactor:**
- `superpowers:subagent-driven-development` — spawn sub-implementers when work decomposes
- `superpowers:using-git-worktrees` — your worktree is the isolation boundary
- `superpowers:test-driven-development` — write failing test first
- `superpowers:systematic-debugging` — root-cause failures
- `code-simplifier:code-simplifier` — clarity, dead-code removal

**Frontend:**
- `frontend-design:frontend-design` — production-grade structure
- `figma:figma-use` — only when handling Figma designs

**Architecture:**
- `feature-dev:code-architect` — multi-file architectural decisions

**When stuck:**
- `bmad-advanced-elicitation` — Socratic / first-principles / pre-mortem / red-team
- `bmad-party-mode` — multi-perspective audit (PM + architect + QA + designer)

## Design tokens (from `caltech/pitch-deck/DESIGN.md` — Clay system)

```css
/* Surface — warm cream canvas + oat borders */
--clay-black: #000000;
--pure-white: #ffffff;
--warm-cream: #faf9f7;
--warm-silver: #9f9b93;
--warm-charcoal: #55534e;
--border-light: #eee9df;
--oat-border: #dad4c8;

/* Accent — blueberry navy */
--blueberry-800: #01418d;   /* primary accent (also brain cool stop) */
--blueberry-600: #0a5dbf;
--blueberry-300: #6da6e8;

/* Cortical activation gradient (brain visuals) */
--activation-cool: var(--blueberry-800);
--activation-warm: #c44569;  /* pomegranate */
--activation-hot:  #f5a142;  /* lemon */

/* NAY column on YEA/NAY rubric */
--red: #fc7981;  /* pomegranate-400 */
--red-soft: #ff9aa1;

/* Radius scale */
--r-sharp: 4px;
--r-standard: 8px;
--r-card: 12px;
--r-feature: 24px;
--r-section: 40px;
--r-pill: 9999px;

/* Multi-layer shadow (Clay signature) */
--elev-1:
  rgba(0, 0, 0, 0.10) 0px 1px 1px,
  rgba(0, 0, 0, 0.04) 0px -1px 1px inset,
  rgba(0, 0, 0, 0.05) 0px -0.5px 1px;
```

**Typography:** Roobert (display/UI) + Space Mono (code/labels). Five OpenType stylistic sets (`ss01`, `ss03`, `ss10`, `ss11`, `ss12`). Display: 80px / weight 600 / -3.2px tracking. Body: 18px / 1.60 line-height. Uppercase labels: 12px / 1.08px tracking / weight 600.

**Hover micro-animation (Clay signature):** `rotateZ(-8deg) translateY(-80%)` + hard offset shadow `rgb(0,0,0) -7px 7px`.

**For the demo dashboard:** keep our existing dark-navy `#050510` background (the brain reads against dark). Use blueberry-800 as primary accent, pomegranate-400 as failure/control accent, lemon-500 for highlights. Roobert + Space Mono per pitch-deck. Multi-layer shadow on cards.

## Key constraints (locked)

1. **TRIBE V2 NEVER live.** Pre-rendered `activity.json` only.
2. **No silent stubs.** Failures log structurally + render visible "FAILED" badge. Dev-mode mocks gated behind `import.meta.env.DEV` / `MOCK_*=1`.
3. **Swarm-loop merged.** K2 plays 3 roles on one surface (specialists + moderator + evaluators). Opus is Stage 4 polish only, cut-line.
4. **Frontend dashboard.** Single page (greenchain layout × icarus 3D hover anchors), brain-hero center.
5. **Real data only.** Every panel consumes a real backend endpoint.
6. **Don't be a blocker.** Constraints are guardrails — flag conflicts as findings, don't freeze.

## Current refactor status

We have 8 audit shards ready to spawn (`refactor/shards/A1-A8.md`). Each runs in its own worktree + tmux window via `bash refactor/spawn-audit-swarm.sh spawn`. Reports land in `refactor/audits/`. After audits, the orchestrator window QAs them and writes refactor execution shards (R1–R8 + R-DOCS).
