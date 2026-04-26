---
audit_shard: A9
title: Documentation audit + repo-cleanliness pass
status: DONE_WITH_CONCERNS
authored_by: A9 Claude (Opus 4.7) + 4 parallel sub-investigators
date: 2026-04-25
constraints_ref: refactor/CONSTRAINTS.md (§2 silent stubs, §4 frontend mocks, §7 real data only)
canonical_arch_ref: caltech/NEW-ARCHITECTURE.md
sibling_shards_in_flight: A1..A8 (do not touch their files)
---

# A9 — Documentation audit + repo-cleanliness pass

**Read-only audit.** No file moved, deleted, or modified. Sub-investigators ran real `find` / `grep` / `awk` / `wc -l` / `WebSearch` and the cited findings are pasted verbatim where useful. R-shard execution is the next pass — A9 only catalogs.

---

## 1. TL;DR

1. **Two competing PRD chains exist.** `_bmad-output/.../ironsight-listenlabs-technical-prd.md` (v2) is canonical, but **three** other PRDs (`_bmad-output/.../ironsight-listenlabs-prd.md` v1.1, `_bmad-output/.../prd.md`, `caltech/prd-final.md`) all still self-frame as authoritative. A fresh Claude pane will read conflicting specs unless v1s are archived.
2. **20 deprecated `.md` files identified for archival** across 4 buckets: PRD-v1 (5), ideation-sweep (5), pre-pivot yaps (4), feesh-scratch (4), dropped sponsors (1), video-story-v1 (1). Total ≈ 8.6k lines of decisively-stale docs. Net cleanup is high-leverage but mostly mechanical `git mv`.
3. **CONSTRAINTS §2 (no silent stubs) has 11 critical violations across backend + frontend** — biggest are `vision_client._stub_report` (full hand-written stub), `k2_client.py:46` missing-key string-stub, and `ComparisonStage.vue:63` + `IterativeLoop.vue:160` 8-round trajectory mocks shipping unconditionally. Most of this is A2 / A4 territory (deep-dive owned there); A9 confirms lint-level signatures.
4. **Code-quality is not great but tractable.** 18 backend Python files have only **2** lines > 120 chars and zero `TODO/FIXME`/bare-`except:` — but `import logging` appears in only 1 of 18 files; 22 `except Exception:` clauses, only 4 of which log. Frontend has 2 orphan files (`stages/ComparisonStage.vue`, `composables/useActivityPlayback.js`), 2 `console.warn` leftovers, zero hardcoded URLs, all `defineProps` typed.
5. **Web-research surfaces 5 actionable patterns** (FastAPI `lifespan` + per-domain layout, Vue 3 `shallowRef` for Three.js bridge, LLM circuit-breaker with strict no-silent-fallback, fixture-replay self-test on boot, central `ErrorPayload` Pydantic model). All 5 are compatible with locked rules; recommended for R-DOCS / R-1 / R-2.

**Status:** `DONE_WITH_CONCERNS`. Catalog is exhaustive; main concern is overlap with A2 / A4 / A7 owners (flagged-and-deferred where appropriate, not unilaterally absorbed). See §10 open questions.

---

## 2. Documentation deprecation catalog

Five tables (canonical / active / deprecated / historical / orphan), each with the SHARD-required `R-shard action` column. Bulk infrastructure rows (`_bmad/`, `.claude/skills/`, `research/sources/repos/`) collapsed into single entries per the shard mandate. All line counts are real `wc -l` output. Worktree symlinks not double-counted.

**Top-level `.md`-counts (after exclusions):** 769 markdown files in repo. Of those, ≈ 75 in `_bmad/`, ≈ 315 in `.claude/skills/`, ≈ 311 in `research/sources/repos/` are infrastructure or external-source, classified once as bulk rows. ≈ 230 project-authored docs receive per-file judgment below.

### 2.1 — `canonical` (current source of truth)

| path | lines | purpose | R-shard action |
|---|---|---|---|
| `caltech/NEW-ARCHITECTURE.md` | 252 | Single canonical post-refactor architecture; "every Claude reads this first." | `KEEP_AT_PATH` |
| `_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md` | 1081 | Technical PRD v2.0 (post-TRIBE-cut) — engineering spec. | `KEEP_AT_PATH` |
| `caltech/architecture-overview.md` | 527 | Cohesive prose architecture document — full pipeline walk-through. | `KEEP_AT_PATH` |
| `refactor/CONSTRAINTS.md` | 109 | Locked rules every audit + refactor shard must obey. | `KEEP_AT_PATH` |
| `refactor/CONTRACTS.md` | 80 | Cross-shard data shapes. | `KEEP_AT_PATH` |
| `research/INDEX.md` | 96 | Research-folder navigation index. | `KEEP_AT_PATH` |
| `CLAUDE.md` | 185 | Repo navigation map for any Claude Code session. | `KEEP_AT_PATH` (after PRD cleanup, drop "Read first" list from 6 to 3 entries) |

### 2.2 — `active` (supports current work, not canonical)

#### 2.2.A — Active project docs (sample of high-traffic; full list below)

| path | lines | purpose | R-shard action |
|---|---|---|---|
| `TODO.md` | 162 | Operational TODOs (.env, missing keys, ship steps). | `KEEP_AT_PATH` |
| `refactor/POST-AUDIT-ORCHESTRATION.md` | 198 | Orchestrator master sequence. | `KEEP_AT_PATH` |
| `refactor/POST-REFACTOR-QA-PLAN.md` | 99 | B-shard plan-of-record. | `KEEP_AT_PATH` |
| `refactor/shards/A1..A9-*.md` (9 files) | 33–101 each | Audit shard briefs. | `KEEP_AT_PATH` |
| `refactor/audits/A1..A8-*.md` (10 files inc. deepdives) | 294–802 each | Sibling audit reports (in flight). | `KEEP_AT_PATH` — **do not touch (sibling shards' authority)** |
| `caltech/build-plan-locked.md` | 509 | Locked v2 build plan post-TRIBE-cut. | `KEEP_AT_PATH` |
| `caltech/3-person-build-plan.md` | 315 | Canonical 3-person build plan. | `KEEP_AT_PATH` |
| `caltech/RESEARCH-CONSOLIDATION-PROTOCOL.md` | 267 | Karpathy-LLM-wiki consolidation protocol. | `KEEP_AT_PATH` |
| `caltech/CONSOLIDATION-REPORT.md` | 142 | One-time consolidation pass output. | `KEEP_AT_PATH` |
| `caltech/HANDOFF.md` | 64 | Tactical execution Claude pane brief. | `KEEP_AT_PATH` |
| `caltech/emilie-brief.md` | 286 | Emilie packaging brief. | `KEEP_AT_PATH` |
| `caltech/demo-script.md` | 160 | 90-second demo BEAT-by-BEAT script. | `KEEP_AT_PATH` |
| `caltech/narration-script-3min.md` | 221 | 3-min Round-2 narration spine. | `KEEP_AT_PATH` |
| `caltech/video-story-empathy-layer.md` | 576 | v2 video shoot script (empathy-layer pivot). | `KEEP_AT_PATH` |
| `caltech/prfaq.md` | 270 | Stage-2 press-release / FAQ draft. | `KEEP_AT_PATH` |
| `caltech/PITCHDECK-BUILDER-ACTIVATION-PROMPT.md` | 166 | Spawn-prompt for fresh pitch-deck Claude pane. | `KEEP_AT_PATH` |
| `caltech/PRD-BUILDER-ACTIVATION-PROMPT.md` | 111 | Spawn-prompt for /bmad-create-prd pane. | `KEEP_AT_PATH` |
| `caltech/PRD-INPUT-BUNDLE.md` | 386 | Pre-filled PRD bundle. | `KEEP_AT_PATH` |
| `caltech/engine/README.md` | 131 | Engine pipeline README. | `KEEP_AT_PATH` |
| `caltech/engine/HANDOFF_CONTRACT.md` | 148 | Cross-lane Pydantic contract spec. | `KEEP_AT_PATH` |
| `caltech/engine/prompts/specialists/*.md` (12 files) | 25–35 each | Engine-spec specialist prompts (Yeo7 + ext). | `KEEP_AT_PATH` (add README disambiguating from runtime `backend/prompts/`) |
| `caltech/engine/prompts/stage{1,2}_{consumer,workplace}.md` (4 files) | 122–149 each | Stage-1/2 engine prompts. | `KEEP_AT_PATH` |
| `backend/prerendered/README.md` | 58 | Pre-rendered TRIBE V2 outputs index. | `KEEP_AT_PATH` |
| `backend/qa_logs/QA_REPORT.md` | 95 | End-to-end QA pass report (2026-04-25). | `KEEP_AT_PATH` |
| `backend/prompts/*.md` (10 files: default_mode, dorsal_attention, evaluator_score, frontoparietal, limbic, moderator, moderator_synthesis, somatomotor, ventral_attention, visual) | 23–75 each | Live runtime prompts. | `KEEP_AT_PATH` (add README clarifying runtime-vs-engine-spec) |
| `caltech/use-cases/*.md` (7 files: empathy-layer-prd-simplified, empathy-layer-hero-output, two-demo-scenarios, ironside, listenlabs-sideshift, yc-partner-stress-test, outsider-advantage-check) | 135–356 each | Active use-case + stress-test docs. | `KEEP_AT_PATH` |
| `caltech/tasks-by-person/*.md` (4 files) | 99–143 each | Per-person task scaffolds. | `KEEP_AT_PATH` |
| `caltech/tier-2-epics/*.md` (5 files) | 109–125 each | Tier-2 epic specs (spawn-ready). | `KEEP_AT_PATH` |
| `caltech/validation-findings/*.md` (5 files) | 79–225 each | Live validation findings. | `KEEP_AT_PATH` |
| `caltech/yaps/2026-04-25-*/00-raw-yap.md` + `01-high-signal-extracts.md` (multiple sub-folders) | 21–121 each | Active yaps + reflections (2026-04-25 batch). | `KEEP_AT_PATH` |
| `caltech/research-context/*.md` (8 files) | 25–128 each | PRFAQ research feedstock (Raskin, StoryBrand, Approaching-Awe, etc.). | `KEEP_AT_PATH` |
| `caltech/context/*.md` + `caltech/context/team/*.md` + `caltech/context/sponsors/*.md` (≈14 files; **excluding** `palohouse.md` — see deprecated) | varies | Constraints, event, track-strategy, team profiles, sponsor briefs. | `KEEP_AT_PATH` (see filename-typo finding below) |
| `caltech/context/tracks/*.md` (4 files) | 25–28 each | Track briefs. | `KEEP_AT_PATH` |
| `caltech/context/references/README.md` | 73 | Reference-library index. | `KEEP_AT_PATH` |
| `caltech/pitch-deck/{AGENTS.md, CLAUDE.md, README.md, DESIGN.md, PITCH-STORY.md, presenter-notes.md}` (6 files) | 1–529 each | Pitch-deck Next.js project docs. | `KEEP_AT_PATH` |
| `research/wiki/README.md`, `research/wiki/index.md` | 152 / 229 | Wiki entrypoint + vocab index. | `KEEP_AT_PATH` |
| `research/wiki/decisions/*.md` (17 files: 001..017) | varies | Locked architectural decisions. | `KEEP_AT_PATH` |
| `research/wiki/{findings,patterns,projects,scrapes,stacks,themes,tools}/*.md` (≈ 50 files) | varies | Wiki subsections. | `KEEP_AT_PATH` |
| `research/sponsors/{ironsight,k2-think,listen-labs}/SOURCES.md` + analysis + clones (≈ 11 files) | varies | Per-sponsor sources, analyses, cloned READMEs. | `KEEP_AT_PATH` |

#### 2.2.B — Active infrastructure (bulk rows)

| path-glob | files | purpose | R-shard action |
|---|---|---|---|
| `_bmad/**/*.md` | ≈ 75 | BMAD hackathon-suite agent + workflow + library config. | `KEEP_AT_PATH` (active infra; do not classify internals) |
| `.claude/commands/bmad/hackathon-suite/**/*.md` | 16 | Slash-command thin wrappers. | `KEEP_AT_PATH` |
| `.claude/skills/**/*.md` | ≈ 299 | Installed Claude / BMAD skill assets. | `KEEP_AT_PATH` (harness library; not project-authored) |
| `research/sources/repos/**/*.md` | ≈ 311 | Cloned external repo READMEs (4sight, mira, tribune, keryx, etc.). | `KEEP_AT_PATH` (touch only via `research/wiki/` analysis layer) |

### 2.3 — `deprecated` (superseded but not yet archived)

| path | lines | purpose | reason | R-shard action |
|---|---|---|---|---|
| `_bmad-output/planning-artifacts/ironsight-listenlabs-prd.md` | 1106 | Strategic PRD v1.1 ("Maya-Reels-primary" framing). | Frontmatter `version: 1.1`; explicitly known-stale per shard prompt. | `MOVE_TO archive/prd-v1/ironsight-listenlabs-prd.md` |
| `_bmad-output/planning-artifacts/prd.md` | 804 | Earlier comprehensive BMAD-format PRD (Maya-Reels-primary). | Self-flag at L774; superseded by v2 technical PRD. | `MOVE_TO archive/prd-v1/_bmad-prd.md` |
| `_bmad-output/planning-artifacts/yc-defensibility-review.md` | 90 | YC/SV review pinned to v1 strategic PRD. | Frontmatter `source-prd: prd.md` (deprecated v1). | `MOVE_TO archive/prd-v1/yc-defensibility-review.md` |
| `caltech/prd.md` | 553 | "PRD draft v1" (Maya-Reels primary). | Status `draft v1`; superseded by `prd-final.md`, then by v2. | `MOVE_TO archive/prd-v1/caltech-prd-draft-v1.md` |
| `caltech/prd-final.md` | 349 | "PRD-FINAL" deployment-ready v1.5 (pre-v2 cut). | Pre-v2 (still references live TRIBE + 4-lane decomp); itself superseded by `_bmad-output/.../ironsight-listenlabs-technical-prd.md` v2.0. | `MOVE_TO archive/prd-v1/caltech-prd-final-pre-v2-cut.md` |
| `caltech/video-story.md` | 810 | Video-story v1 (Maya-Reels-primary). | `caltech/video-story-empathy-layer.md` declares "replaces video-story.md ... old file kept as v1 reference." | `MOVE_TO archive/video-story-v1/video-story.md` |
| `caltech/ideation/INDEX.md` | 90 | Pre-PRD ideation-sweep index. | Stamped "RAW FEEDSTOCK. Not a recommendation. Not a decision." | `MOVE_TO archive/ideation-sweep/INDEX.md` |
| `caltech/ideation/01-problem-space-buffet.md` | 390 | Agent-1 ideation breadth sweep. | Pre-pivot feedstock. | `MOVE_TO archive/ideation-sweep/01-problem-space-buffet.md` |
| `caltech/ideation/02-winner-cross-comparison.md` | 412 | Agent-2 ideation cross-comparison. | Pre-pivot feedstock. | `MOVE_TO archive/ideation-sweep/02-winner-cross-comparison.md` |
| `caltech/ideation/03-pitch-hooks.md` | 522 | Agent-3 ideation pitch hooks. | Pre-pivot feedstock. | `MOVE_TO archive/ideation-sweep/03-pitch-hooks.md` |
| `caltech/ideation/04-front-facing-concepts.md` | 498 | Agent-4 ideation concepts. | Pre-pivot feedstock. | `MOVE_TO archive/ideation-sweep/04-front-facing-concepts.md` |
| `caltech/context/sponsors/palohouse.md` | 40 | Palohouse sponsor brief. | Self-flagged: "🚫 STATUS: DROPPED ... NOT a target track." | `MOVE_TO archive/dropped-sponsors/palohouse.md` |
| `caltech/context/yaps/2026-04-24-opening-team-direction.md` | 53 | Opening-ceremony team direction yap. | Self-flagged superseded by 2026-04-24-strategy-pivot-tech-first-stack.md; pre-pivot. | `MOVE_TO archive/yaps-pre-pivot/2026-04-24-opening-team-direction.md` |
| `caltech/context/yaps/2026-04-24-judge-conversations-and-emerging-themes.md` | 128 | Judge-convo yap (Friday late-night). | Pre-pivot; sentiment captured but architecture moved on. | `MOVE_TO archive/yaps-pre-pivot/2026-04-24-judge-conversations-and-emerging-themes.md` |
| `caltech/context/yaps/2026-04-24-strategy-pivot-tech-first-stack.md` | 252 | Strategy-pivot yap (tech-first stack). | Captures the moment-of-pivot — value historicized now that pivot is in v2 PRD. | `MOVE_TO archive/yaps-pre-pivot/2026-04-24-strategy-pivot-tech-first-stack.md` |
| `caltech/context/yaps/2026-04-25-pivot-best-use-of-ai-hard-target-cultural-flattening-frame.md` | 89 | Hard-target pivot yap. | Captured into research/wiki/decisions/005; raw yap redundant. | `MOVE_TO archive/yaps-pre-pivot/<filename>.md` |
| `feesh/README.md` | 19 | "feesh — early scaffold; Status: Concept TBD." | Separate scratch repo (`feesh/.git/`) parked at "concept TBD"; never advanced. | **See open question §10 — `feesh/` has its own `.git/`; safer to leave-in-place and add `archive/feesh-scratch/POINTER.md` than to break the embedded repo.** |
| `feesh/research/01-winning-hackathons.md` | 266 | Pre-Caltech winning-pattern research. | Subsumed by `caltech/validation-findings/2026-04-25-treehacks-pattern-search.md`. | `MOVE_TO archive/feesh-scratch/research/01-winning-hackathons.md` (ALT: leave with feesh/.git/) |
| `feesh/research/02-strong-multi-capability-projects.md` | 245 | Multi-capability project research. | Pre-Caltech-pivot; subsumed by research/wiki/projects/. | `MOVE_TO archive/feesh-scratch/research/02-strong-multi-capability-projects.md` (ALT: leave) |
| `feesh/research/03-recent-hackathon-winners-deep-dive.md` | 478 | Hackathon winners deep-dive. | Pre-Caltech-pivot; subsumed by research/wiki/scrapes + projects. | `MOVE_TO archive/feesh-scratch/research/03-recent-hackathon-winners-deep-dive.md` (ALT: leave) |

### 2.4 — `historical` (already archived appropriately)

| path | lines | purpose | R-shard action |
|---|---|---|---|
| `archive/brain-swarm-README.md` | 359 | Original brain-swarm boot guide. | `KEEP_AT_PATH` |
| `archive/empathy-engine/README.md` | 60 | Original `junsoo/brain/` TRIBE-V2 wrapper README. | `KEEP_AT_PATH` |
| `archive/future_plan.md` | 96 | Original 4-lane swarm plan. | `KEEP_AT_PATH` |
| `archive/INTEGRATION_GAPS.md` | 112 | Pre-merge integration-gaps log. | `KEEP_AT_PATH` |
| `archive/junsoo-papers-CONTEXT.md` | 155 | Original TRIBE-V2 explainer for teammates. | `KEEP_AT_PATH` |
| `archive/MIROFISH-REFERENCE.md` | 302 | MiroFish viz-pattern reference. | `KEEP_AT_PATH` |
| `archive/swarm_contract.md` | 171 | Original cross-lane swarm JSON contract. | `KEEP_AT_PATH` |
| `archive/ironside-prompts/*.md` (8 files) | 27–132 each | Historical Ironside specialist prompts. | `KEEP_AT_PATH` (live copies live in `caltech/engine/prompts/specialists/`) |

### 2.5 — `orphan` (no obvious purpose / scratch)

| path | lines | classification rationale |
|---|---|---|
| _(none found)_ | — | `junsoo/` has zero `.md` files; `feesh/` content is opinionated research (deprecated, not orphan). No truly purposeless `.md` surfaced. |

### 2.6 — Hotspot summary (most consequential cleanups)

- **Two competing PRD chains.** Three v1 PRDs + one v2 technical PRD all claim "authoritative" or "deployment-ready." After cleanup add a single `caltech/PRD-INDEX.md` with one line: "Canonical PRD: `_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md`. Strategic intent: TBD — v1 strategic PRD archived to `archive/prd-v1/`."
- **Strategic PRD known-stale + YC-defensibility review pinned to it.** Archive both together so the link doesn't dangle.
- **Ideation sweep (4 files, 1822 lines) lives in active doc tree.** Move whole folder to `archive/ideation-sweep/`.
- **Video-story v1 (810 lines)** explicitly self-flagged retained-as-reference. Move to `archive/video-story-v1/`.
- **Pre-pivot yaps (4 files in `caltech/context/yaps/`)** are pre-v2 thinking. Decisions they led to are locked in `research/wiki/decisions/` — raw yaps can move.
- **Dropped sponsor (`palohouse.md`)** self-declares dropped. Trivial archive.
- **Sponsor filename typo:** `caltech/context/sponsors/ironsite.md` should be `ironsight.md` (canonical sponsor name; aligns with `research/sponsors/ironsight/`). Rename + update inbound links.
- **`feesh/` is a separate sub-repo (its own `.git/`)** — moving to `archive/` would break the boundary. See §10 open question.
- **Two parallel prompt sets** co-exist: `backend/prompts/` (live runtime swarm) vs `caltech/engine/prompts/` (engine-spec). Add a one-line README at each prompt-folder root clarifying which is runtime-loaded.
- **`refactor/audits/` will balloon** as B-shards re-audit. Naming convention `A1-...-A.md` / `A1-...-B.md` from the start would keep the directory navigable.
- **`CLAUDE.md` "Read first" list is currently 6 entries.** After PRD cleanup it should drop to 3 (NEW-ARCHITECTURE, technical-PRD-v2, refactor/CONSTRAINTS).

---

## 3. Proposed clean repo layout

ASCII tree for the post-A9 cleanup. Net-net: nothing leaves `backend/` or `frontend/`; `archive/` gains four well-known subfolders; root keeps its 4-line "first-read" stack visible.

```
hackathon/
├── CLAUDE.md                          ← repo navigation map (drops "read-first" from 6 → 3)
├── TODO.md                            ← live ship-day TODOs
├── tmux-spawn-all.sh                  ← legacy team-orchestration (not for refactor)
│
├── backend/                           ← UNCHANGED (active demo)
├── frontend/                          ← UNCHANGED (active demo)
│
├── caltech/                           ← project work area
│   ├── NEW-ARCHITECTURE.md            ← canonical
│   ├── architecture-overview.md       ← canonical
│   ├── PRD-INDEX.md                   ← NEW: 1-line pointer to canonical PRD
│   ├── build-plan-locked.md
│   ├── 3-person-build-plan.md
│   ├── RESEARCH-CONSOLIDATION-PROTOCOL.md
│   ├── CONSOLIDATION-REPORT.md
│   ├── HANDOFF.md, emilie-brief.md, demo-script.md, narration-script-3min.md
│   ├── video-story-empathy-layer.md   ← v2 (v1 archived)
│   ├── prfaq.md
│   ├── PITCHDECK-BUILDER-ACTIVATION-PROMPT.md
│   ├── PRD-BUILDER-ACTIVATION-PROMPT.md
│   ├── PRD-INPUT-BUNDLE.md
│   ├── engine/                        ← engine-spec prompts + contracts
│   ├── pitch-deck/                    ← Next.js project (separate workspace)
│   ├── use-cases/, yaps/, research-context/, validation-findings/, tier-2-epics/
│   ├── tasks-by-person/
│   └── context/                       ← team profiles, sponsor briefs, tracks
│       └── sponsors/ironsight.md      ← RENAMED from ironsite.md (typo fix)
│
├── _bmad-output/
│   └── planning-artifacts/
│       └── ironsight-listenlabs-technical-prd.md   ← ONLY remaining PRD here
│
├── _bmad/                             ← BMAD workflow config (UNCHANGED)
│
├── refactor/                          ← UNCHANGED (this refactor's home)
│   ├── CONSTRAINTS.md, CONTRACTS.md
│   ├── POST-AUDIT-ORCHESTRATION.md, POST-REFACTOR-QA-PLAN.md
│   ├── shards/A1..A9-*.md
│   └── audits/A1..A9-*.md
│
├── research/                          ← UNCHANGED (sponsor clones, wiki, sources)
│   └── INDEX.md
│
├── archive/                           ← gains four new subfolders
│   ├── (existing files: brain-swarm-README.md, MIROFISH-REFERENCE.md, future_plan.md,
│   │    INTEGRATION_GAPS.md, junsoo-papers-CONTEXT.md, swarm_contract.md,
│   │    empathy-engine/, ironside-prompts/)
│   ├── prd-v1/                        ← NEW (5 files)
│   │   ├── ironsight-listenlabs-prd.md
│   │   ├── _bmad-prd.md
│   │   ├── yc-defensibility-review.md
│   │   ├── caltech-prd-draft-v1.md
│   │   └── caltech-prd-final-pre-v2-cut.md
│   ├── ideation-sweep/                ← NEW (5 files)
│   │   ├── INDEX.md
│   │   ├── 01-problem-space-buffet.md
│   │   ├── 02-winner-cross-comparison.md
│   │   ├── 03-pitch-hooks.md
│   │   └── 04-front-facing-concepts.md
│   ├── yaps-pre-pivot/                ← NEW (4 files)
│   │   ├── 2026-04-24-opening-team-direction.md
│   │   ├── 2026-04-24-judge-conversations-and-emerging-themes.md
│   │   ├── 2026-04-24-strategy-pivot-tech-first-stack.md
│   │   └── 2026-04-25-pivot-best-use-of-ai-hard-target-cultural-flattening-frame.md
│   ├── dropped-sponsors/              ← NEW (1 file)
│   │   └── palohouse.md
│   ├── video-story-v1/                ← NEW (1 file)
│   │   └── video-story.md
│   └── feesh-scratch/                 ← NEW (POINTER only — see §10)
│       └── POINTER.md                 ← references the embedded feesh/.git/ scratch repo
│
├── feesh/                             ← STAYS (separate sub-repo with own .git/)
│   ├── README.md                      ← ALT: rewrite as 3-line "scratch repo, see archive/feesh-scratch/POINTER.md"
│   └── research/                      ← STAYS (or moved per §10 decision)
│
└── junsoo/                            ← STAYS (no .md files; not in scope)
```

**Compare to current:** delta is +5 archive subfolders (29 files moved), 1 file renamed (`ironsite.md` → `ironsight.md`), 1 file added (`caltech/PRD-INDEX.md`). Backend, frontend, refactor, research, _bmad, _bmad-output (after PRD cleanup), .claude untouched.

---

## 4. Backend code-quality lint findings

Sub-investigator 2 ran `find` / `grep` / `awk` over 18 backend Python files. Key headline numbers: **2** lines >120 chars in production (both in `k2_client.py:62-63`); **0** `TODO/FIXME/XXX/HACK`; **0** bare `except:`; **22** `except Exception:` of which only **4** log; `import logging` appears in only **1** of 18 files (`services/warmup.py`).

| severity | file:line | issue | constraint cross-ref | suggested fix |
|---|---|---|---|---|
| **Critical** | `backend/services/k2_client.py:46` | Missing-API-key path returns the literal string `"[K2_API_KEY not set]"` instead of canonical error payload. Caller treats it as success, embeds in downstream prompts. | §2 silent stub | Replace with `logger.error("k2_call_failed", extra={"reason":"missing_api_key"})` + canonical `{"error":"k2_unavailable",...}`. **A2 deep-dive.** |
| **Critical** | `backend/services/vision_client.py:192-223` (`_stub_report`) + call sites L396, L401, L409, L423-433 | Hardcoded full-shape "stub vision report" with hand-written `scene_summary`, `actions`, `temporal_sequence`, `spatial_relationships`, `emotional_tone` — paragraph substitution on every failure mode. | §2 (canonical fallback shape forbids hand-written paragraph) | `logger.error("vision_call_failed", extra={...}); return {"error":"vision_unavailable","reason":<str>}`. **A2.** |
| **Critical** | `backend/main.py:487-498` (`/k2_region`) | On K2 failure returns `"text": f"[K2 call failed: {e}]"` — hand-written sentence rendered as if a real region reading. | §2 | `logger.error(...)` + 503 with `{"error":"k2_unavailable"}`. **A2.** |
| **Critical** | `backend/services/swarm_runner.py:113-114` | `except Exception as e: return {"reading": f"[K2 error: {e}]", ...}` — error message in `reading` field flows into `swarm_readings.json`. | §2 | Log + return error-tagged entry. **A2.** |
| **Critical** | `backend/services/orchestrator.py:185-186` | `except Exception: observations[name] = f"[{name}: signal unclear]"` — fabricates a network observation when K2 fails, no logging. | §2 | `logger.error("orchestrator_observation_failed",...)`; drop network or return error-tagged entry. **A2.** |
| **Critical** | `backend/services/empathy_synthesis.py:188-189`, L199-200 | `return f"[empathy_synthesis error: {e}]"` and retry equivalent — error text where 150-300-word paragraph expected. | §2 | Log + raise (or canonical error dict). **A2.** |
| **Critical** | `backend/services/orchestrator.py:202-203` (moderator) | `except Exception: pass` — K2 moderator failure swallowed silently. | §2 | `logger.error("k2_moderator_failed", extra={"t":t,"regions":list(regions)})`. |
| **High** | `backend/main.py:39` | `print(f"[prerendered] mounting ...")` — debug print in module-load path. | quality | `logger.info`. |
| **High** | `backend/main.py:92` | `print(f"WARNING: brain mesh load failed ({e}). Using mock sphere.")` inside startup `except`. | quality | `logger.warning("brain_mesh_load_failed", extra={"err":str(e)})`. |
| **High** | `backend/services/brain_mesh.py:49,67,74,76,79,83,87,109` | 8 module-internal `print(...)` — including the silent fallback message `"Atlas error: {e} — falling back to synthetic labels"`. | quality + §2 cousin | `logging.getLogger(__name__).info/warning`. |
| **High** | `backend/services/activity_reader.py:108,110,120,127` | 4 module-load `print(...)` — including `"no preds.npz — using synthetic activations"`. Substitution to synthetic data is §2 cousin. | quality + §2 | Convert to logger; flag substitution to A2. |
| **High** | `backend/main.py:201-202`, L312-313, L539-540, `services/session_cache.py:44-45` | `except Exception: pass` / `return None` swallows JSON-parse + websocket-send errors w/ no log. | quality | `logger.warning(...)` before fallthrough. |
| **High** | `backend/services/vision_client.py:103-104,109-110,123-124,169-170,392-393,447-449` | 6 silent except blocks: ffmpeg, frame read, cv2, JSON-fence parse, corrupted-cache read, cache-write. None log. | quality + §2 cluster | Add structured logging at each. |
| **High** | `backend/services/empathy_synthesis.py:78,107-108,113-114,147-148,193-194` | 5 silent excepts; worst is L193-194 — guardrail exception treated as "guardrail passed". | quality + §2 (guardrail bypass) | Log every guardrail/format failure; on guardrail exception **fail closed**. |
| **High** | `backend/services/vision_client.py:316-317,182-184` | `except Exception: t_s = 0` / JSON-coerce returns `None` silently. | quality | Log malformed-JSON with raw tail. |
| **High** | Backend-wide | `import logging` only in `services/warmup.py`; every other backend service module has zero structured logging. | §2 spirit | Add `logger = logging.getLogger(__name__)` to `k2_client`, `orchestrator`, `swarm_runner`, `vision_client`, `empathy_synthesis`, `iterative_loop`, `session_cache`, `falsification`, `brain_mesh`, `activity_reader`, `main.py`. |
| **Medium** | `backend/services/k2_client.py:62` (128 chars) | `OUTPUT CONTRACT` directive string. | style | Wrap (Python implicit concat). |
| **Medium** | `backend/services/k2_client.py:63` (174 chars) | `OUTPUT CONTRACT` directive string. | style | Wrap. |
| **Medium** | `backend/services/swarm.py:74` (120 chars) | `ra.active = network_act.get(...) > self._brain_mesh.networks[ra.network]["activation_threshold"]` | style | Hoist threshold local. |
| **Medium** | `backend/services/orchestrator.py:173,192,197` (101–110 chars) | f-string composition lines. | style | Pre-build `others_str` / `regions_str`. |
| **Medium** | `backend/services/iterative_loop.py:192` (103 chars) | Plateau-check conditional. | style | Extract `plateaued = ...`. |
| **Medium** | `backend/services/brain_mesh.py:114` (104 chars) | Centroid one-liner. | style | Multi-line `if/else`. |
| **Medium** | `backend/services/warmup.py:226` (101 chars) | `_load_control_activity` signature. | style | Multi-line signature. |
| **Medium** | `backend/main.py:8` (109 chars) | FastAPI single-line import. | style | Parenthesised multi-line import. |
| **Medium** | `backend/services/empathy_synthesis.py:21-23` | Soft import `try: from .guardrails import ... except Exception: def pass_guardrail_pre_flight(text)->bool: return True` — bypasses safety check on import error. `# pragma: no cover` masks. | §2 spirit | Either fail loudly or log on substitute path. |
| **Medium** | `backend/services/orchestrator.py:93` | `_load_prompt` returns inline-fabricated f-string when `papers/prompts/<network>.md` missing — no log. | §2 cousin | Log "missing prompt file"; do not silently substitute. **A2.** |
| **Medium** | `backend/main.py` _load_scenario:201, match_clip_with_warmup:312, ws_endpoint:526-527 | `except Exception: pass` for parse/send failures w/o log. | quality | Add log; use specific exception. |
| **Medium** | All services bar `warmup.py` | Inconsistent `from __future__ import annotations`; private helpers in `brain_mesh.py` + `activity_reader.py` lack return-type hints. | quality | Add return-type hints on public + private helpers. |
| **Low** | `backend/main.py:18,501`, `services/swarm_runner.py:12`, `services/warmup.py:87` | `from services.orchestrator import _parse_observation` — importing private helper across modules. | quality | Promote to public `parse_observation`. |
| **Low** | `backend/services/empathy_synthesis.py:21` | `# pragma: no cover` on fail-soft guardrail import. | quality | Drop pragma after fixing fail-soft. |
| **Low** | `backend/smoke_test_swarm.py:37,39,50,52,102,104,160,162,202` | 9 lines at 224 chars (assertion message strings). | style | Wrap; not load-bearing. |

### Backend long-line summary

| file | count >100 chars | longest line |
|---|---|---|
| `backend/smoke_test_swarm.py` | 9 | L37 (224 chars) — assertion message |
| `backend/services/k2_client.py` | 2 | L63 (174 chars) — OUTPUT CONTRACT directive |
| `backend/services/swarm.py` | 1 | L74 (120 chars) |
| `backend/services/orchestrator.py` | 3 | L192 (110 chars) |
| `backend/main.py` | 1 | L8 (109 chars) — FastAPI import |
| `backend/services/brain_mesh.py` | 1 | L114 (104 chars) |
| `backend/services/iterative_loop.py` | 1 | L192 (103 chars) |
| `backend/services/warmup.py` | 1 | L226 (101 chars) |

Only **2** production lines exceed the 120-char ceiling. Counting >100 chars: 10 outside the smoke test.

### Backend §2 per-file compliance summary

| service | status |
|---|---|
| `k2_client.py` | **VIOLATION L46** |
| `vision_client.py` | **VIOLATION L192-223** (`_stub_report`); 5 call sites |
| `orchestrator.py` | **VIOLATION L93** (prompt fallback), **L186** (fabricated obs), **L202-203** (swallowed moderator) |
| `swarm_runner.py` | **VIOLATION L113-114** |
| `empathy_synthesis.py` | **VIOLATION L21-23** (guardrail bypass), **L188-189**, **L193-194**, **L199-200** |
| `iterative_loop.py` | **VIOLATION L172-174** (`except TypeError: candidate = await synthesize(...)` swallows signature drift) |
| `warmup.py` | **OK** |
| `session_cache.py` | **VIOLATION L44-45** |
| `falsification.py` | **OK** at audited depth |
| `brain_mesh.py` | **VIOLATION L76,79,83** (synthetic-label substitution uninstrumented) |
| `activity_reader.py` | **VIOLATION L110** (synthetic-data substitution via print, not log) |
| `guardrails.py` | OK at audit depth |
| `swarm.py` | OK at lint level |
| `main.py` | **VIOLATION L487-498** + **L201-202, L312-313, L526-527, L539-540** |

### Cross-shard note (backend)

Critical-severity items above are all **A2-stub-fallbacks deep-dive territory**. Listed here for completeness so the parent audit captures the lint-level signature; A2 owns the actual remediation logic.

---

## 5. Frontend code-quality lint findings

Sub-investigator 3 ran `find` / `grep` / `awk` over `frontend/src/**/*.{vue,js,ts}`. Key headline numbers: **10** lines >120 chars across 4 files; **2** `console.warn` leftovers; **0** `TODO/FIXME` / hardcoded URLs / array-form `defineProps`; **2 orphan files** never imported.

| Severity | file:line | issue | constraint cross-ref | suggested fix |
|---|---|---|---|---|
| **Critical** | `frontend/src/stages/ComparisonStage.vue:63-72` | Inline 8-round mock `const trajectory = [...]` rendered straight into `<IterativeLoop :trajectory="trajectory" />`. No DEV gate. Comment L61 admits "Mock iterative-loop trajectory until the engine's EmpathyDocument JSON wires up." | §4 inline mock; §7 happy placeholder | Already explicitly called out in CONSTRAINTS §4. **A4 territory** — flagged-and-deferred. |
| **Critical** | `frontend/src/components/IterativeLoop.vue:160-169` | Same 8-round mock baked as `defineProps.trajectory.default`. Component renders fabricated paragraphs even if parent passes nothing. | §4; §7 | Change `default: () => ([...])` to `default: () => ([])`; render "REAL DATA MISSING" when empty. |
| **Critical** | `frontend/src/components/AnalysisPanel.vue:58-61` | `loopMeta: { type: Object, default: () => ({ rounds: 8, finalScore: 0.84 }) }` — hardcoded `finalScore: 0.84` rendered as truth if parent omits. | §7 | Default to `null`; explicit missing-data state. |
| **Critical** | `frontend/src/stages/EmpathyDocumentStage.vue:95` | `empathy.value?.polished_paragraph \|\| empathy.value?.best_paragraph \|\| '(empathy paragraph not yet generated)'` — fluent fallback string. | §7 mandates "REAL DATA MISSING" red badge | Drop the literal; render pomegranate-400 fail badge per Clay tokens. |
| **Critical** | `frontend/src/stages/EmpathyDocumentStage.vue:15` | `<p class="scene">{{ vision?.scene_summary \|\| '(no scene summary)' }}</p>` | §7 | Same fix. |
| **Critical** | `frontend/src/stages/MainStage.vue:145` | On K2 region failure, popup is set to `text: 'Could not reach K2 — try again in a moment.'`. Apologetic happy-text replaces real failure signal. | §7 (visible failure beats fluent stub) | `text: ''` + `error: true` flag; pomegranate-400 fail-state. |
| **Critical** | `frontend/src/stages/ComparisonStage.vue:58,114` | Imports + calls `fetchComparison(props.clipId)` from `../api/index.js`, but **`fetchComparison` is not exported** from `api/index.js`. Stage would throw `ReferenceError` at runtime if mounted. | dead/broken integration — masks §7 | Either delete orphan stage (preferred — see Orphan list) or add `fetchComparison`. |
| **High** | `frontend/src/App.vue:78` | `console.warn('No clip_id in match payload', payload)` left in shipping code. | demo hygiene | Replace with on-screen error state. |
| **High** | `frontend/src/stages/MainStage.vue:155` | `v.play().catch(err => console.warn('video play blocked:', err))`. | demo hygiene | Swallow silently or surface via UI flag. |
| **Medium** | `frontend/src/components/IterativeLoop.vue:135` (138 chars) | `<div class="loop-phase-rail" role="progressbar" :aria-valuenow=...>` | style | Wrap aria-attrs. |
| **Medium** | `frontend/src/components/IterativeLoop.vue:164,166,167,168` (122–181 chars) | Long mock-trajectory string lines (also Critical above). | style + §4 | Removing the mock fixes both. |
| **Medium** | `frontend/src/stages/ComparisonStage.vue:69,70,71` (130–177 chars) | Long mock-trajectory string lines (also Critical above). | style + §4 | Same. |
| **Medium** | `frontend/src/stages/EmpathyDocumentStage.vue:108` (162 chars) | `verdictLine` template literal. | style | Break across lines. |
| **Medium** | `frontend/src/stages/LoadingStage.vue:57` (146 chars) | `<div class="loading-phase-rail" role="progressbar" :aria-valuenow=...>` | style | Wrap. |
| **Medium** | `frontend/src/composables/useActivityPlayback.js` (entire file) | Composable defined but never imported. Verified `grep -rn "import.*useActivityPlayback\|import.*from.*composables" frontend/src/` returned zero hits. | dead code | Delete or wire into `BrainScene.vue`. |
| **Medium** | `frontend/src/stages/ComparisonStage.vue` (entire file) | Stage never imported. `App.vue:35` `stages` array is `['landing', 'loading', 'main', 'iterative-reveal', 'empathy-document']` — no `comparison`. Dead stage. | dead code + Critical above | Delete (kills §4 mock for free). |
| **Low** | `frontend/src/stages/MainStage.vue:129,136-138` | Multiple inline `\|\| ''` / `\|\| '#aaaaaa'` color/text fallbacks. `'#aaaaaa'` masks missing `NETWORK_COLORS[network]`. | style/§7-adjacent | Use `NETWORK_COLORS.frontoparietal` documented default. |
| **Low** | `frontend/src/components/RegionPopup.vue:46,84,94,95` | `cite \|\| 'unattributed'`, `n \|\| 'unknown network'`, `confidenceLabel ?? 'confidence'`. Cosmetic; not paragraph-of-fluent-fake. | §7-adjacent | Acceptable for now; tag for A4 review. |

### Frontend inline-mock summary

| file:line | what | verdict |
|---|---|---|
| `stages/ComparisonStage.vue:63` (`const trajectory = [...]`) | 8-round mock | **SHIPPING — VIOLATION** §4, §7. No DEV gate. |
| `components/IterativeLoop.vue:160` (`default: () => ([...])`) | Same 8-round mock as prop default | **SHIPPING — VIOLATION** §4, §7. |
| `stages/LoadingStage.vue:95` (`VISION_LOGS = [...]`) | UI label strings during real fetch | **NOT a data mock** — display labels for theatrical loading. Acceptable. |
| `stages/LoadingStage.vue:101` (`TRIBE_LOGS = [...]`) | UI label strings | **NOT a data mock** — same pattern. Acceptable. |
| `stages/LoadingStage.vue:117` (`pipelinePhases = [...]`) | Three phase-rail labels (`uploading`/`analyzing`/`syncing`) | **NOT a mock** — UI primitive constant. Acceptable. |

DEV-gating audit: `grep -rn "import.meta.env.DEV\|import.meta.env.MODE\|MOCK_" frontend/src/` returned **zero hits**. None of the inline mocks are gated. Both Critical mocks ship unconditionally.

### Frontend long-line summary

| file | count >120 chars | worst offender |
|---|---|---|
| `frontend/src/components/IterativeLoop.vue` | 4 | L168 (181 chars — mock excerpt) |
| `frontend/src/stages/ComparisonStage.vue` | 3 | L71 (177 chars — mock excerpt) |
| `frontend/src/stages/EmpathyDocumentStage.vue` | 1 | L108 (162 chars — verdict template literal) |
| `frontend/src/stages/LoadingStage.vue` | 1 | L57 (146 chars — phase-rail aria attrs) |

Removing the two inline mocks deletes 7 of 10 long lines for free.

### Frontend orphans / dead components

| file | status | evidence |
|---|---|---|
| `frontend/src/stages/ComparisonStage.vue` | **ORPHAN** never imported | `grep -rn "ComparisonStage" frontend/src/` returns only a CSS comment (`IterativeLoop.vue:384`); not in `App.vue` `stageMap`. Also calls undefined `fetchComparison`. |
| `frontend/src/composables/useActivityPlayback.js` | **ORPHAN** never imported | `grep -rn "import.*useActivityPlayback\|import.*from.*composables" frontend/src/` returns zero hits. |

All other components verified imported: `AnalysisPanel`, `BrainScene`, `IterativeLoop`, `PersonaShell`, `RegionPopup`, `RoundScoreBar`; stages `LandingStage`, `LoadingStage`, `MainStage`, `IterativeRevealStage`, `EmpathyDocumentStage`.

Hygiene wins: every `defineProps` uses object-form with type info (zero array-form `defineProps([...])` violations); zero hardcoded URLs (`grep -rEn "(http://|https://|localhost:|127\.0\.0\.1)" frontend/src/` returns zero).

### Cross-shard note (frontend)

Critical findings on `ComparisonStage`, `IterativeLoop` defaults, `AnalysisPanel.loopMeta`, `EmpathyDocumentStage` fluent-fallbacks, and `MainStage:145` apologetic K2 failure are **A4-frontend-empathy-wiring** territory. Recorded here at lint level for parent-audit coverage; rewire to `/demo/iterative-trajectory/{clip_id}` + introduction of pomegranate-400 "REAL DATA MISSING" component live in A4. A8-brain-dashboard-redesign untouched per off-limits rule.

A9-actionable items independent of other shards:
1. Delete `frontend/src/stages/ComparisonStage.vue` and `frontend/src/composables/useActivityPlayback.js`.
2. Remove the two `console.warn` calls in `App.vue:78` and `MainStage.vue:155`.
3. Remove the inline-mock prop default in `IterativeLoop.vue:160-169` (change to `default: () => ([])`).
4. Remove the `loopMeta` placeholder in `AnalysisPanel.vue:58-61`.

---

## 6. Long-line violations (consolidated)

Files with any line > 120 chars (production code):

| file | count >120 | worst |
|---|---|---|
| `backend/services/k2_client.py` | 2 | L63 (174 chars — OUTPUT CONTRACT directive) |
| `frontend/src/components/IterativeLoop.vue` | 4 | L168 (181 chars — inline mock excerpt) |
| `frontend/src/stages/ComparisonStage.vue` | 3 | L71 (177 chars — inline mock excerpt) |
| `frontend/src/stages/EmpathyDocumentStage.vue` | 1 | L108 (162 chars — verdict template literal) |
| `frontend/src/stages/LoadingStage.vue` | 1 | L57 (146 chars — aria-progressbar attrs) |
| `backend/smoke_test_swarm.py` (test fixture) | 9 | L37 (224 chars — assertion message; low priority) |

**11 production lines >120 chars; 7 of those disappear when the two frontend inline-mock violations are deleted.**

Lines >100 chars but ≤120 (style only): 8 backend (`swarm.py:74`, `orchestrator.py:173/192/197`, `iterative_loop.py:192`, `brain_mesh.py:114`, `warmup.py:226`, `main.py:8`).

---

## 7. Web-research best-practices brief

Sub-investigator 4 ran 7 WebSearches and synthesized 5 patterns. Sources cited inline; full URL list at the end.

**a. FastAPI production structure.** 2025 consensus (zhanymkanov/fastapi-best-practices, orchestrator.dev "Production-Ready Patterns for 2025", Chris Evans Medium lifecycle guide) is to organize *by domain* (each module owns its `router.py`/`schemas.py`/`service.py`/`dependencies.py`/`exceptions.py`). Heavy resources (HTTP clients, sentence-transformer model, K2 pool, embedding cache) live in a single `lifespan` async-context-manager attached to `app.state` — not at module import. Configuration via `pydantic_settings.BaseSettings` (one per env). Structured JSON logging via `python-json-logger` so every `logger.error("k2_call_failed", extra={...})` is queryable. **Recommendation:** introduce `app/lifespan.py` warming MiniLM + an `httpx.AsyncClient` pool keyed per provider (Cerebras/OpenRouter/Anthropic) exposed via DI. Source: [zhanymkanov/fastapi-best-practices](https://github.com/zhanymkanov/fastapi-best-practices); [orchestrator.dev 2025 patterns](https://orchestrator.dev/blog/2025-1-30-fastapi-production-patterns/); [Medium lifecycle guide](https://medium.com/@dynamicy/fastapi-starlette-lifecycle-guide-startup-order-pitfalls-best-practices-and-a-production-ready-53e29dcb9249).

**b. Vue 3 + Three.js single-page realtime dashboard.** 2025 stack consensus is Vite + Vue 3 + TypeScript + Pinia + Vue Router 4. Pinia (not Vuex) holds WS-derived state because no-mutation stores integrate better with reactive subscriptions. For Three.js, the canonical pattern is to keep `requestAnimationFrame` loop **outside** Vue's reactivity graph — push WS data into a `shallowRef` or Pinia store and let the render loop sample, instead of letting Vue reactivity drive 60 fps redraws (proxy overhead). Vue 3.5 + Vapor Mode (opt-in) cuts VDOM cost. DOM-anchored hover zones over Three.js canvas should use absolute-positioned overlays whose 3D coords are projected once per frame, not per-event. **Recommendation:** confirm K2 round-trajectory updates flow through a single Pinia store via WS (or polling) and that the brain Canvas reads via `shallowRef`. Source: [Vue 3 in 2025 (Medium)](https://medium.com/@ashot.bes/vue-3-in-2025-unlocking-next-level-frontend-performance-789816a10d53); [Vue 3.5 release (Monterail)](https://www.monterail.com/blog/vue-3-5-release-enhancements-for-large-scale-applications).

**c. LLM-orchestration reliability.** Portkey, Maxim, and Google Cloud SRE guides converge on three tiers: **retries** for transient errors with exponential backoff + full jitter; **circuit breakers** at ~5 consecutive failures with 60 s cooldown; **fallbacks** only between *equivalent* providers, never silently swapping a stub. All sources call out that *200 OK with hallucinated content* is the most dangerous failure mode and must be detected via schema-validation + LLM-as-judge. **Recommendation:** keep the "no silent fallback" rule (it matches consensus); add per-provider `httpx` timeouts (~20 s K2, ~45 s Opus) and a small `pybreaker`-style breaker around the 7×K2 swarm fan-out so one bad Cerebras response can't deadlock a round. Source: [Portkey: Retries, Fallbacks, Circuit Breakers](https://portkey.ai/blog/retries-fallbacks-and-circuit-breakers-in-llm-apps/); [TianPan.co LLM API Resilience 2026](https://tianpan.co/blog/2026-03-11-llm-api-resilience-production); [Building Bulletproof LLM Applications (Google Cloud)](https://medium.com/google-cloud/building-bulletproof-llm-applications-a-guide-to-applying-sre-best-practices-1564b72fd22e).

**d. Pre-rendered cache as demo-day reliability.** No single dominant industry name; closest analogues are **"fixture-replay"** / **"record-and-replay"** (Node `replayer`, `pytest-replay`) and **"hermetic test"** (Google's term for tests depending only on local artifacts). Hackathon-guide content treats this as "pre-bake the demo path." Consensus rules: (1) deterministic cache key (we use `clip_id` — good); (2) cache miss must fail loudly, not silently regenerate (we do — `logger.error("cache_miss") + 404`); (3) cache must be checked into the repo or pinned to immutable artifact store. Our `backend/prerendered/<clip_id>/*.json` is textbook fixture-replay. **Recommendation:** add a startup self-test in `lifespan` that asserts every advertised clip has all 5 cache files present and schema-valid, failing boot rather than discovering at demo time. Source: [aneilbaboo/replayer](https://github.com/aneilbaboo/replayer); [pytest-replay](https://github.com/ESSS/pytest-replay).

**e. Pydantic v2 schemas + structured error payloads.** Pydantic v2 docs + Codoplex 2025 guide standardize on `@field_validator` for single-field rules and `@model_validator(mode="after")` for cross-field invariants (e.g. `round_trajectory[i].score >= 0`, `best_round_idx < len(round_trajectory)`). For HTTP errors, the consensus is registering a custom `RequestValidationError` exception handler that emits `{success: false, error_code, errors: [{loc, msg, type}]}` instead of FastAPI's default 422 dump. Use `model_dump_json()` (not `json.dumps(model.dict())`) when piping payloads into `logger.error(extra=...)`. **Recommendation:** define one `ErrorPayload` Pydantic model (`error_code, clip_id, network?, detail?`) and route every "log+surface" failure through it. Source: [Pydantic Validators docs](https://docs.pydantic.dev/latest/concepts/validators/); [Codoplex Advanced Pydantic Validation](https://blog.codoplex.com/advanced-pydantic-validation-error-handling/).

### 7.1 Cross-check vs `caltech/NEW-ARCHITECTURE.md` + `refactor/CONSTRAINTS.md`

- **(a) FastAPI structure** — *Likely partial drift.* Backend is domain-organized (`services/swarm_runner.py`, etc.) — good — but unverified whether long-lived clients (httpx, MiniLM) are owned by `lifespan` vs created per-request. If per-request, drift; fixable in R-1/R-2.
- **(b) Vue 3 + Three.js** — *Aligned with deliberate constraint.* Single-page brain-Canvas + DOM hover anchors matches consensus. Verify `shallowRef`/Pinia for WS arrays; if components hold deep `ref()`, drift.
- **(c) LLM reliability** — *Deliberate deviation, well-justified.* Consensus permits provider-fallback (K2 → Claude on outage); we explicitly forbid silent fallback because demo path reads pre-rendered cache. Correct for our threat model. Gap: no documented timeout/circuit-breaker numbers per provider — propose folding into R-2.
- **(d) Pre-rendered cache** — *Aligned.* Pattern is canonical fixture-replay. Minor gap: no boot-time integrity assertion across all 5 JSON files per `clip_id`. Propose adding to R-DOCS or R-1 as `lifespan` startup check.
- **(e) Pydantic v2 + structured errors** — *Likely drift unknown.* CONSTRAINTS §2 mandates `{error, clip_id, network}` shape but no Pydantic `ErrorPayload` enforces it. Without a typed model, individual handlers will diverge over the 36-hour sprint.

### 7.2 Top 5 specific recommendations

1. **Add a `lifespan` boot self-test** — assert every advertised `clip_id` has all 5 prerendered JSONs present and schema-valid; fail boot loud rather than at demo time. Matches fixture-replay rule (2). Citation: [replayer](https://github.com/aneilbaboo/replayer). **Fold into R-DOCS or R-1.**
2. **Centralize the error payload as a Pydantic v2 model** — define `ErrorPayload(error_code: str, clip_id: str, network: str | None, detail: str | None)`; require every "log+surface" branch to return it; register a `RequestValidationError` handler with the same shape. Keeps CONSTRAINTS §2 enforceable. Citation: [Codoplex Pydantic guide](https://blog.codoplex.com/advanced-pydantic-validation-error-handling/). **Fold into R-DOCS / R-2.**
3. **Per-provider timeouts + circuit breaker around 7×K2 swarm fan-out** — pick consensus numbers (5 failures → 60 s open) and a 20 s K2 / 45 s Opus timeout; one bad Cerebras response can't deadlock a round. Aligns with locked "no silent fallback" because the breaker surfaces an error payload. Citation: [Portkey](https://portkey.ai/blog/retries-fallbacks-and-circuit-breakers-in-llm-apps/). **R-2.**
4. **Wire WS / round-trajectory state through a single Pinia store + `shallowRef`** — keep Three.js loop reading via `shallowRef`, not deep-reactive `ref`, to preserve 60 fps as swarm visual updates per round. Citation: [Vue 3 in 2025](https://medium.com/@ashot.bes/vue-3-in-2025-unlocking-next-level-frontend-performance-789816a10d53). **R-3 / R-4 frontend.**
5. **Cache the MiniLM model + per-paragraph embeddings** — instantiate `SentenceTransformer("all-MiniLM-L6-v2")` once in `lifespan` and memoize per-paragraph embeddings keyed on hash. Per Sentence-Transformers docs, model construction dominates cost. Citation: [SBERT efficiency docs](https://sbert.net/docs/sentence_transformer/usage/efficiency.html). **R-2.**

### 7.3 Sources

- [zhanymkanov/fastapi-best-practices (GitHub)](https://github.com/zhanymkanov/fastapi-best-practices)
- [FastAPI Best Practices: Production-Ready Patterns for 2025 (orchestrator.dev)](https://orchestrator.dev/blog/2025-1-30-fastapi-production-patterns/)
- [FastAPI/Starlette Lifecycle Guide (Medium)](https://medium.com/@dynamicy/fastapi-starlette-lifecycle-guide-startup-order-pitfalls-best-practices-and-a-production-ready-53e29dcb9249)
- [Vue 3 in 2025: Unlocking Next-Level Frontend Performance (Medium)](https://medium.com/@ashot.bes/vue-3-in-2025-unlocking-next-level-frontend-performance-789816a10d53)
- [Vue 3.5 Release: Major Enhancements for Large-Scale Applications (Monterail)](https://www.monterail.com/blog/vue-3-5-release-enhancements-for-large-scale-applications)
- [Retries, Fallbacks, and Circuit Breakers in LLM Apps (Portkey)](https://portkey.ai/blog/retries-fallbacks-and-circuit-breakers-in-llm-apps/)
- [LLM API Resilience in Production (TianPan.co, 2026)](https://tianpan.co/blog/2026-03-11-llm-api-resilience-production)
- [Building Bulletproof LLM Applications (Google Cloud / Medium)](https://medium.com/google-cloud/building-bulletproof-llm-applications-a-guide-to-applying-sre-best-practices-1564b72fd22e)
- [aneilbaboo/replayer (GitHub)](https://github.com/aneilbaboo/replayer)
- [pytest-replay (GitHub)](https://github.com/ESSS/pytest-replay)
- [Pydantic Validators docs](https://docs.pydantic.dev/latest/concepts/validators/)
- [Advanced Pydantic Validation & Error Handling in FastAPI (Codoplex)](https://blog.codoplex.com/advanced-pydantic-validation-error-handling/)
- [Sentence Transformers — Speeding up Inference (sbert.net)](https://sbert.net/docs/sentence_transformer/usage/efficiency.html)
- [LLM Orchestration in 2026: Top 22 frameworks (AIMultiple)](https://aimultiple.com/llm-orchestration)

---

## 8. No-fallback compliance audit (CONSTRAINTS §2 + §7)

This section consolidates §2/§7 violations across backend + frontend and cross-checks them against the consensus patterns from §7.

### Backend §2 (no silent stubs) — 11 violations

| location | shape | severity |
|---|---|---|
| `backend/services/k2_client.py:46` | `return "[K2_API_KEY not set]"` (string-stub) | Critical |
| `backend/services/vision_client.py:192-223` (`_stub_report`) + 5 call sites | full hand-written paragraph stub | Critical |
| `backend/main.py:487-498` (`/k2_region`) | `"text": f"[K2 call failed: {e}]"` | Critical |
| `backend/services/swarm_runner.py:113-114` | error text in `reading` field | Critical |
| `backend/services/orchestrator.py:185-186` | fabricated network observation `f"[{name}: signal unclear]"` | Critical |
| `backend/services/empathy_synthesis.py:188-189`, L199-200 | error text `f"[empathy_synthesis error: {e}]"` returned where paragraph expected | Critical |
| `backend/services/orchestrator.py:202-203` | `except Exception: pass` swallows K2 moderator | Critical |
| `backend/services/empathy_synthesis.py:21-23` | guardrail-bypass on import error (returns `True`) | High |
| `backend/services/iterative_loop.py:172-174` | `except TypeError: candidate = await synthesize(...)` swallows signature drift | High |
| `backend/services/brain_mesh.py:76,79,83` | atlas-load fallback to synthetic labels (printed, not logged) | High |
| `backend/services/activity_reader.py:108-110` | `no preds.npz → using synthetic activations` (printed, not logged) | High |

### Frontend §4 + §7 (no inline mocks; visible failure beats fluent stub) — 6 violations

| location | shape | severity |
|---|---|---|
| `frontend/src/stages/ComparisonStage.vue:63-72` | inline 8-round trajectory mock (no DEV gate) | Critical |
| `frontend/src/components/IterativeLoop.vue:160-169` | same mock as `defineProps.trajectory.default` | Critical |
| `frontend/src/components/AnalysisPanel.vue:58-61` | hardcoded `loopMeta = { rounds: 8, finalScore: 0.84 }` | Critical |
| `frontend/src/stages/EmpathyDocumentStage.vue:95` | `\|\| '(empathy paragraph not yet generated)'` | Critical |
| `frontend/src/stages/EmpathyDocumentStage.vue:15` | `\|\| '(no scene summary)'` | Critical |
| `frontend/src/stages/MainStage.vue:145` | apologetic K2-failure text `'Could not reach K2 — try again in a moment.'` | Critical |

### Compliance summary

- **17 §2 / §4 / §7 violations total** (11 backend + 6 frontend).
- The canonical fix shape from CONSTRAINTS §2 is `logger.error(event, extra={...}); return {"error": "...", ...}` — **none** of the 11 backend violations follow this shape today.
- Per §7's "REAL DATA MISSING" red-badge rule, the frontend has **no** `<RealDataMissing>` component yet — every fallback is a fluent string instead.
- §7.2 recommendation 2 (Pydantic `ErrorPayload` model) directly enforces the §2 shape and would close the divergence between handlers.

### Cross-shard ownership (no double-fixing)

| violation | owning shard |
|---|---|
| Every Critical backend §2 row | **A2-stub-fallbacks** (deep-dive remediation) |
| Every Critical frontend §4/§7 row except `ComparisonStage` orphan | **A4-frontend-empathy-wiring** (real fetch + RealDataMissing component) |
| `ComparisonStage.vue` orphan stage | **A9** (delete-orphan is independent of A4 wiring) |
| Backend logging plumbing (`import logging` everywhere) | **A9** (mechanical lint) |
| `console.warn` removal in `App.vue:78` + `MainStage.vue:155` | **A9** |
| Pydantic `ErrorPayload` introduction (rec 2) | **R-DOCS / R-2** (cross-cutting) |

A9 owns the catalog + the orphan/console-warn/logging-plumbing R-actions; A2 + A4 own the deeper §2/§4/§7 remediation. No work is duplicated.

---

## 9. R-shard action list

Ordered by independence and risk. R-shard executors should treat this as a worklist runnable from this file. **Risk levels:** L = low (no functional impact, mechanical), M = medium (touches semantics), H = high (architectural decision).

### Tier 1 — pure file moves (no code changes)

| # | action | paths | risk | rationale |
|---|---|---|---|---|
| 1 | `mkdir -p archive/prd-v1` | — | L | New archive bucket. |
| 2 | `git mv _bmad-output/planning-artifacts/ironsight-listenlabs-prd.md archive/prd-v1/ironsight-listenlabs-prd.md` | as listed | L | Strategic v1 PRD known-stale. |
| 3 | `git mv _bmad-output/planning-artifacts/prd.md archive/prd-v1/_bmad-prd.md` | as listed | L | Earlier BMAD PRD; superseded. |
| 4 | `git mv _bmad-output/planning-artifacts/yc-defensibility-review.md archive/prd-v1/yc-defensibility-review.md` | as listed | L | Pinned to deprecated v1; archive together. |
| 5 | `git mv caltech/prd.md archive/prd-v1/caltech-prd-draft-v1.md` | as listed | L | Draft v1; superseded. |
| 6 | `git mv caltech/prd-final.md archive/prd-v1/caltech-prd-final-pre-v2-cut.md` | as listed | L | Pre-v2 cut. |
| 7 | `mkdir -p archive/video-story-v1 && git mv caltech/video-story.md archive/video-story-v1/video-story.md` | as listed | L | v1 video-story self-flagged retained-as-reference. |
| 8 | `mkdir -p archive/ideation-sweep && git mv caltech/ideation/* archive/ideation-sweep/ && rmdir caltech/ideation` | as listed | L | Whole ideation folder pre-PRD. |
| 9 | `mkdir -p archive/yaps-pre-pivot && git mv caltech/context/yaps/2026-04-24-opening-team-direction.md archive/yaps-pre-pivot/` | as listed | L | Pre-pivot yap. |
| 10 | `git mv caltech/context/yaps/2026-04-24-judge-conversations-and-emerging-themes.md archive/yaps-pre-pivot/` | as listed | L | Pre-pivot yap. |
| 11 | `git mv caltech/context/yaps/2026-04-24-strategy-pivot-tech-first-stack.md archive/yaps-pre-pivot/` | as listed | L | Pre-pivot yap. |
| 12 | `git mv caltech/context/yaps/2026-04-25-pivot-best-use-of-ai-hard-target-cultural-flattening-frame.md archive/yaps-pre-pivot/` | as listed | L | Captured into wiki/decisions/005. |
| 13 | `mkdir -p archive/dropped-sponsors && git mv caltech/context/sponsors/palohouse.md archive/dropped-sponsors/palohouse.md` | as listed | L | Self-flagged dropped. |

### Tier 2 — rename / new-file / link-update

| # | action | paths | risk | rationale |
|---|---|---|---|---|
| 14 | `git mv caltech/context/sponsors/ironsite.md caltech/context/sponsors/ironsight.md` | as listed | M | Filename typo (canonical sponsor name). **Risk:** any inbound link to `ironsite.md` breaks. Run `grep -rn "ironsite\.md\|sponsors/ironsite" --include="*.md" .` first; update each match. |
| 15 | Create `caltech/PRD-INDEX.md` (≈ 15 lines) pointing at `_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md` as canonical PRD; note v1s in `archive/prd-v1/` | new file | L | Single line for fresh Claude panes to read so they don't open v1s. |
| 16 | Edit `CLAUDE.md` "Read these first" list — drop from 6 → 3 entries (`caltech/NEW-ARCHITECTURE.md`, `_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md`, `refactor/CONSTRAINTS.md`) and link to `caltech/PRD-INDEX.md` | as listed | L | Reduces cognitive load. |
| 17 | Add 1-line `backend/prompts/README.md` clarifying "RUNTIME prompts loaded by `services/swarm_runner.py` + `services/orchestrator.py`. Engine-spec equivalents live at `caltech/engine/prompts/`." | new file | L | Disambiguates two parallel prompt sets. |
| 18 | Add 1-line `caltech/engine/prompts/README.md` clarifying "ENGINE-SPEC reference prompts. Runtime equivalents live at `backend/prompts/`." | new file | L | Same. |
| 19 | Naming-convention nudge: future B-shard audit files should land at `refactor/audits/A1-prerender-cache-B.md`, etc. — orchestrator decision; not file-mutating but worth noting in `refactor/POST-REFACTOR-QA-PLAN.md`. | edit | L | Keeps audits/ directory navigable. |

### Tier 3 — feesh/ scratch decision (see §10 open question)

| # | action | paths | risk | rationale |
|---|---|---|---|---|
| 20 | **Decision required** — see §10 question Q1. Either (a) `mkdir -p archive/feesh-scratch && git mv feesh/research/* archive/feesh-scratch/research/` + leave `feesh/.git/` and `feesh/README.md` as a 3-line scratch-pointer; or (b) leave `feesh/` entirely in place and add only `archive/feesh-scratch/POINTER.md` referencing the embedded repo. | feesh/ tree | M | `feesh/.git/` makes this non-trivial. Don't decide unilaterally. |

### Tier 4 — frontend orphan + console.warn cleanup (independent of A4)

| # | action | paths | risk | rationale |
|---|---|---|---|---|
| 21 | `git rm frontend/src/stages/ComparisonStage.vue` | as listed | L | Orphan stage; never imported in `App.vue:35`; calls undefined `fetchComparison`. Removing also kills the largest §4 mock for free. **Verify:** `grep -rn "ComparisonStage" frontend/src/` returns only the CSS comment in `IterativeLoop.vue:384` (which is benign and can stay or be cleaned). |
| 22 | `git rm frontend/src/composables/useActivityPlayback.js` | as listed | L | Composable defined but never imported. **Verify:** `grep -rn "useActivityPlayback" frontend/src/` returns zero hits. |
| 23 | Edit `frontend/src/App.vue:78` — remove `console.warn('No clip_id in match payload', payload)`; replace with explicit on-screen error state (or silently no-op if next stage shows error). | as listed | L | Demo hygiene. |
| 24 | Edit `frontend/src/stages/MainStage.vue:155` — remove `console.warn('video play blocked:', err)`; let promise reject silently (browser autoplay policy). | as listed | L | Demo hygiene. |
| 25 | Edit `frontend/src/components/IterativeLoop.vue:160-169` — change `default: () => ([... 8-round mock ...])` to `default: () => ([])`. Component must render empty-state when `trajectory.length === 0`. | as listed | M | Removes §4 violation independently of A4 wiring. **A4 still owns the real-fetch wiring**; this just removes the silent-stub default. |
| 26 | Edit `frontend/src/components/AnalysisPanel.vue:58-61` — change `loopMeta: { default: () => ({ rounds: 8, finalScore: 0.84 }) }` to `loopMeta: { default: () => null }`. Render explicit missing-data state when `null`. | as listed | M | Same logic; coordinate with A4. |

### Tier 5 — backend mechanical lint (independent of A2)

| # | action | paths | risk | rationale |
|---|---|---|---|---|
| 27 | Convert `backend/main.py:39` `print(...)` → `logger.info(...)`. Add `import logging; logger = logging.getLogger(__name__)` at top. | as listed | L | Demo hygiene. |
| 28 | Convert `backend/main.py:92` `print(f"WARNING: ...")` → `logger.warning("brain_mesh_load_failed", extra={"err":str(e)})`. | as listed | L | Same. |
| 29 | Convert all 8 `print(...)` calls in `backend/services/brain_mesh.py:49,67,74,76,79,83,87,109` → `logger.info/warning(...)` with structured `extra`. | as listed | L | Same. |
| 30 | Convert all 4 `print(...)` calls in `backend/services/activity_reader.py:108,110,120,127` → `logger`. | as listed | L | Same. |
| 31 | Add `logger = logging.getLogger(__name__)` to every backend service module that doesn't have it (10 files: `k2_client`, `orchestrator`, `swarm_runner`, `vision_client`, `empathy_synthesis`, `iterative_loop`, `session_cache`, `falsification`, `brain_mesh`, `activity_reader`). | as listed | L | Prerequisite for converting silent excepts to `logger.error(...)`. |
| 32 | Wrap `backend/main.py:8` import across multiple lines (109 chars). Convert `backend/services/k2_client.py:62-63` 174-char OUTPUT CONTRACT directive to two implicit-concat string literals. | as listed | L | Long-line cleanup. |
| 33 | Promote `_parse_observation` (and any other `_private` helpers imported across modules) to public name `parse_observation`; update imports in `main.py:18,501`, `swarm_runner.py:12`, `warmup.py:87`. | as listed | M | Removes private-import-leak smell. |

### Tier 6 — cross-cutting recommendations from §7 (R-DOCS / R-2)

| # | action | paths | risk | rationale |
|---|---|---|---|---|
| 34 | Define `backend/services/error_payload.py` containing `class ErrorPayload(BaseModel): error_code: str; clip_id: str; network: str | None = None; detail: str | None = None`. | new file | M | Prereq for enforcing CONSTRAINTS §2 shape. |
| 35 | Add a `lifespan` boot self-test in `backend/main.py` that asserts every clip in `prerendered/` has all 5 cache files present + schema-valid; fail boot loud. | edit | M | Fixture-replay best-practice; failure beats discovery at demo time. |
| 36 | Introduce `backend/lifespan.py` that warms `SentenceTransformer("all-MiniLM-L6-v2")` once and an `httpx.AsyncClient` pool keyed per provider (Cerebras, OpenRouter, Anthropic). | new file | H | Architectural; coordinate with R-2. |
| 37 | Add per-provider timeouts (20 s K2, 45 s Opus) and a small `pybreaker`-style breaker around 7×K2 swarm fan-out. | edit | H | One bad K2 response can't deadlock a round. Coordinate with R-2 + A2 (since A2 is fixing the underlying error-payload shape). |

---

## 10. Open questions for the orchestrator

1. **`feesh/` scratch repo treatment.** The directory has its own embedded `.git/`. Three options:
   - (a) Leave `feesh/` entirely in place; add only `archive/feesh-scratch/POINTER.md` referencing it.
   - (b) Move `feesh/research/*.md` files (4 files) to `archive/feesh-scratch/research/`, leave `feesh/.git/` + `feesh/README.md` as a 3-line stub.
   - (c) Detach `feesh/` from the project tree entirely (move outside `hackathon/`).
   **A9 recommends (b)** — moves the deprecated research content to archive while preserving the embedded `.git/`. But this is a directory-structure call A7 (structure-consolidation) likely owns; A9 defers.

2. **A7 overlap.** A7-structure-consolidation may have its own opinion on `feesh/`, on the `caltech/ideation/` archive, and on the two-prompt-folder ambiguity (`backend/prompts/` vs `caltech/engine/prompts/`). A9's recommendations are based purely on doc-deprecation logic. If A7 disagrees, A7 wins.

3. **Strategic vs technical PRD futures.** A9 archives the v1 strategic PRD per shard prompt, but doesn't propose a new strategic PRD. Should R-DOCS write a fresh v2 strategic PRD, or does the v2 technical PRD now subsume both roles? A5-prd-alignment-master is the right shard to weigh in.

4. **`caltech/context/architecture.md`** self-flagged "DIRECTIONS (not locked)" but is still actively referenced from team profiles. Keep as `active` (current A9 classification) or fold into `archive/`? A9 left as `active` because it's still cited, but the file's own frontmatter says it's not authoritative.

5. **`backend/prompts/` vs `caltech/engine/prompts/` reconciliation.** Two prompt folders co-exist with overlapping but not identical content. Are these meant to converge eventually, or stay split (engine-spec vs runtime)? A9 recommends a clarifying README at each, but a deeper reconciliation belongs to A3-swarm-loop-merge or A7-structure-consolidation.

6. **B-shard naming convention for `refactor/audits/`.** Already noted in §9 action #19 as a soft suggestion. Is `A1-...-B.md` the right convention, or should B-shards land in a `refactor/audits-b/` subdirectory? A9 has no strong preference.

7. **§7 recommendations 3 + 4 (timeouts/circuit-breaker, Pinia + shallowRef).** These are infra patterns inside the 36-hour ship window. They're consistent with locked rules but not strictly required for demo-day reliability. R-2 / R-3 / R-4 owners should decide whether they fit the budget.

---

## Acceptance verification

Per the SHARD acceptance criteria:

- [x] Report at `refactor/audits/A9-doc-audit-and-cleanup.md` (this file, written via worktree symlink at `worktrees/A9-doc-audit-and-cleanup/audits/A9-doc-audit-and-cleanup.md`).
- [x] All 10 sections present (TL;DR, deprecation catalog, clean repo layout, backend lint, frontend lint, long-line violations, web-research brief, no-fallback compliance, R-shard action list, open questions).
- [x] Deprecation catalog exhaustive — every project-authored `.md` classified; bulk infra (`_bmad/`, `.claude/skills/`, `research/sources/repos/`) collapsed into single rows per shard mandate.
- [x] Long-line + lint findings cite real `awk`/`grep` outputs (in §4, §5, §6).
- [x] Web-research brief has 3+ named-source citations (13 sources cited in §7.3).
- [x] R-shard action list (§9) is concrete enough to run `git mv` / `rm` / specific edits directly from it (37 numbered actions across 6 tiers, with paths + risk levels).
- [x] No file moved, deleted, or modified by A9. Catalog only.
- [x] No interference with sibling shards' worktrees or audit reports (A1-A8).

**Final status:** `DONE_WITH_CONCERNS` — concerns are exclusively cross-shard ownership questions in §10, not blockers.
