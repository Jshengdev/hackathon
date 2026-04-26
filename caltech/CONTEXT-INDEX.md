# `caltech/` CONTEXT INDEX — what every dev (and every Claude) has at hand

This dir is the **shared brain** for backend (Jacob), frontend (Junsu), and demo (Johnny). Everything here is canonical and up-to-date as of post-R-DOCS merge.

## The standing QA contract (load-bearing — every refactor measures against these)

| File | Purpose |
|---|---|
| `CONSTRAINTS.md` | Locked rules: TRIBE not live, no silent stubs, swarm-loop merged, real-data-only, design tokens, skills to load. **Read first.** |
| `CONTRACTS.md` | v2 data schemas: `activity.json` per-clip cache layout, `EmpathyDocument` shape, API surface, hard-code clip-name match rule. |
| `REFACTOR-PLAN.md` | 5-phase synthesized plan from 12 audits. PHASE 1 (R-DOCS) merged. PHASE 2-5 queued. |

## The architecture (one-doc + long-form)

| File | Purpose |
|---|---|
| `NEW-ARCHITECTURE.md` | Single-doc canonical pipeline (v2 — TRIBE-cut, swarm-loop merged, Opus terminal). Read this for the big picture. |
| `architecture-overview.md` | Long-form architecture prose, junsoo's v2-current. Read for design rationale. |

## The dev split + verification workflow

| File | Purpose |
|---|---|
| `3-PERSON-PARALLEL-PLAN.md` | Jacob (backend) / Junsu (frontend) / Johnny (demo) with verify-and-report task lists, sequencing, hand-off contracts. |
| `audits/A1..A9` | 9 audit reports cataloging every gap (5,124 lines total). Each finding is the spec a refactor implements. |
| `audits/A1-deepdive.md`, `A3-deepdive.md`, `A4-deepdive.md` | Targeted dives: control-clip strategy, Stage 4 Opus polish ship-decision, falsification field-name resolution. |
| `audits/R-DOCS-summary.md` | What changed in the v2.1 PRD edits. |

## Demo + product

| File | Purpose |
|---|---|
| `README.md` | Johnny's bible — demo flow, sponsor tracks, JS.1-JS.14 task list. |
| `pitch-deck/` | Next.js public deck (separate project; round-1, round-2, sponsor variants). |
| `pitch-deck/DESIGN.md` | Clay-inspired design system — canonical color/font/shadow tokens for ALL UI work. |
| `demo-script.md` | 90-second demo runbook (BEAT-0 → BEAT-5). |
| `narration-script-3min.md` | 3-min Round 2 launch video script. |
| `video-story-empathy-layer.md` | Cinematic acts (1-4) extended narrative. |
| `use-cases/` | Per-scenario writeups: ironside, listenlabs, two-demo-scenarios, hero-output, yc-stress-test. |

## Source material (raw input)

| File | Purpose |
|---|---|
| `yaps/` | Johnny's voice-note dumps — verbatim source material every R-shard reads before editing. |
| `prfaq.md` | Working-Backwards PRFAQ (Stage 1). |
| `PRD-INPUT-BUNDLE.md` | All PRD source material in one bundle. |
| `research-context/` | Curated research extracts. |
| `tier-2-epics/` | Downstream packaging epics (brand, landing, deck, social, tech-writeup). |

## What got archived (no longer in caltech/)

These were historical and are now in `archive/`:
- `pitch-story-v2-canonical.md` → `archive/pitch-story-v1-v2/` (v3 is canonical)
- `3-person-build-plan.md` (v1) → `archive/3-person-build-plan-v1.md` (replaced by `3-PERSON-PARALLEL-PLAN.md`)
- `emilie-brief.md` → `archive/emilie-brief.md`
- `PRD-BUILDER-ACTIVATION-PROMPT.md`, `PITCHDECK-BUILDER-ACTIVATION-PROMPT.md` → `archive/builder-prompts/`

See `archive/INDEX.md` for the full archive map.

## What lives elsewhere (not in caltech/)

| Topic | Canonical path |
|---|---|
| Backend code | `backend/services/` |
| Frontend code | `frontend/src/` |
| Pre-rendered cache | `backend/prerendered/<clip>/` |
| Strategic + technical PRDs (v2.1) | `_bmad-output/planning-artifacts/ironsight-listenlabs-{technical-prd,prd}.md` |
| Research (sponsors, papers, wiki) | `research/` (with `archive/research/INDEX.md`) |
| Refactor scaffolding (shards, scripts) | `archive/refactor/` (audit-time historical) |
| Repo-level navigation | `CLAUDE.md` (root) |

## Reading order for a fresh Claude session

1. `CLAUDE.md` (root) — repo map
2. `caltech/CONTEXT-INDEX.md` (this file) — what's in caltech/
3. `caltech/NEW-ARCHITECTURE.md` — what we're building
4. `caltech/CONSTRAINTS.md` — locked rules
5. Section README (`backend/README.md`, `frontend/README.md`, or `caltech/README.md`) — your lane
6. `caltech/3-PERSON-PARALLEL-PLAN.md` — your task list
7. `caltech/audits/` — audit findings relevant to your tasks
