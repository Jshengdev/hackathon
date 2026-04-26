# `archive/` INDEX — historical artifacts (read-only)

This dir collects artifacts that were once load-bearing but have been superseded by the v2 architecture or by a project pivot. **Nothing here is canonical.** If you need to know what's currently true, read these instead:

- `caltech/NEW-ARCHITECTURE.md` — current pipeline (single-doc summary)
- `caltech/architecture-overview.md` — v2 long-form prose
- `_bmad-output/planning-artifacts/ironsight-listenlabs-{technical-prd,prd}.md` v2.1 — current PRDs
- `caltech/3-PERSON-PARALLEL-PLAN.md` — current dev split (Jacob / Junsu / Johnny)
- `CLAUDE.md` (repo root) — navigation map

---

## Folder layout

```
archive/
├── INDEX.md                                ← this file
├── prd-v1/                                 ← all v1 PRDs (Maya-Reels-primary framing, pre-TRIBE-cut)
│   ├── _bmad-prd.md                        comprehensive BMAD-format PRD v1
│   ├── caltech-prd-draft-v1.md             original PRD draft
│   ├── caltech-prd-final-pre-v2-cut.md     PRD-FINAL (pre-v2 cut)
│   └── yc-defensibility-review.md          YC review of v1 strategic PRD
├── video-story-v1/                         ← v1 video story (Maya-Reels-primary)
│   └── video-story.md                      replaced by caltech/video-story-empathy-layer.md
├── ideation-sweep/                         ← pre-PRD ideation feedstock (RAW; not decisions)
│   ├── INDEX.md
│   ├── 01-problem-space-buffet.md
│   ├── 02-winner-cross-comparison.md
│   ├── 03-pitch-hooks.md
│   └── 04-front-facing-concepts.md
├── dropped-sponsors/                       ← sponsor tracks we explicitly cut
│   └── palohouse.md                        flagged "🚫 DROPPED · NOT a target track"
├── yaps-pre-pivot/                         ← Johnny voice-notes from before the architecture pivot
│   ├── 2026-04-24-opening-team-direction.md
│   ├── 2026-04-24-judge-conversations-and-emerging-themes.md
│   ├── 2026-04-24-strategy-pivot-tech-first-stack.md
│   └── 2026-04-25-pivot-best-use-of-ai-hard-target-cultural-flattening-frame.md
├── ironside-prompts/                       ← v1 K2 specialist prompts (8-region Ironside roster)
│   │                                          superseded by backend/prompts/ (7-region Yeo7)
│   ├── default_mode.md, motor_planning.md, prefrontal_engagement.md,
│   ├── salience_tracking.md, spatial_mapping.md, stress_response.md,
│   ├── threat_detection.md, visual_attention.md, report_card_synthesis.md
├── empathy-engine/                         ← legacy caltech/engine/ (parallel build attempt)
│   └── README.md
├── junsoo-papers-CONTEXT.md                ← v1 TRIBE-direct integration notes
├── junsoo-scripts/                         ← v1 inference helpers
├── tribe-pipeline/                         ← v1 TRIBE pipeline (live-inference attempt)
├── colab_prerender.ipynb                   ← TRIBE pre-render notebook
├── tribe_prerender_simple.ipynb            ← simplified TRIBE pre-render
├── report_card/                            ← v1 Ironside report-card path (8-specialist)
├── brain-swarm-README.md                   ← v1 brain-swarm doc
├── future_plan.md                          ← v1 forward plan
├── INTEGRATION_GAPS.md                     ← v1 integration audit
├── MIROFISH-REFERENCE.md                   ← Mirofish swarm-orchestration patterns we steal
│                                              (REFERENCE — still useful for swarm event schema)
├── swarm_contract.md                       ← v1 swarm contract (superseded by refactor/CONTRACTS.md)
└── (other v1 artifacts moved here over time)
```

---

## How to use the archive

### As an LLM explorer
- Each subdir is one supersession bucket. Don't blend them.
- The most useful items here are `MIROFISH-REFERENCE.md` (still-load-bearing for swarm event schemas) and `prd-v1/` (when you need to understand WHY a v1 decision was made before reading the v2 spec).
- Everything else is read-only history.

### As a developer
- If a v2 doc references "the v1 PRD", look in `archive/prd-v1/` for the exact match.
- If you see a yap referenced that's not in `caltech/yaps/`, check `archive/yaps-pre-pivot/`.
- If a Python module imports from `caltech/engine/`, check `archive/empathy-engine/` — that lane was superseded by `backend/services/`.

### What lives where canonically (NOT in archive)

| Topic | Canonical location |
|---|---|
| Current pipeline | `caltech/NEW-ARCHITECTURE.md` + `caltech/architecture-overview.md` |
| Current PRDs (v2.1) | `_bmad-output/planning-artifacts/ironsight-listenlabs-{technical-prd,prd}.md` |
| Current strategic-PRD v1 sections | `_bmad-output/planning-artifacts/archive/strategic-prd-v1-sections.md` (R-DOCS preserved) |
| Current dev split | `caltech/3-PERSON-PARALLEL-PLAN.md` |
| Current K2 prompts | `backend/prompts/` (7-region Yeo7 roster) |
| Current empathy paragraph + falsification logic | `backend/services/{empathy_synthesis,iterative_loop,falsification,empathy_polish}.py` |
| Current frontend | `frontend/src/` |
| Current swarm-event schema reference | `archive/MIROFISH-REFERENCE.md` (yes, still useful — reference, not legacy) |

---

## Provenance

Most moves landed via the A9-doc-audit-and-cleanup recommendation (`refactor/audits/A9-doc-audit-and-cleanup.md`). Anything that arrived earlier is from the original junsoo-merge or the v1→v2 architecture pivot.
