# Research consolidation report — Caltech HackTech 2026

**Date:** 2026-04-25
**Agent:** consolidation pass per `caltech/RESEARCH-CONSOLIDATION-PROTOCOL.md`
**Branch:** `main` (no fan-out worktrees per protocol §"Stay on main")
**Commits in this pass:** 5 — `c5623c1` (decisions) → `3f3ee86` (vocabulary + live-thread) → `4b5858f` (project teardowns) → `218108e` (patterns) → `7b341e7` (wiki README) → THIS file pending commit.

---

## Ingested

All 16 input categories from the protocol prompt were read before writing began. Highlights:

- **Theme:** README lock doc + 7 sources (001–007) + 2 deep-dives (`tribe-v2-canonical-reference` ~10K tokens; `emotional-depth-demo-theatre-canonical` ~26K tokens, read in two passes).
- **Window-2 research-deepening:** all 9 files (`000`, `001`, `002`, `100`, `200`, `300`, `400`, `500`, `501`).
- **Existing wiki:** 3 projects + 6 patterns + 1 tool + scrapes + README.
- **Caltech context:** event + constraints + architecture + track-strategy + 4 team profiles + 8 sponsor briefs + 4 track briefs + 3 yaps.
- **Ideation sweep:** INDEX + 4 files read through the INDEX caveats (head-reads for 01/03/04; full-read for 02 because of lookalike-risk material).
- **Sponsors:** scaffolded inboxes (mostly empty) + 2 K2 analysis pointers.
- **Skills:** `/ship-velocity` SKILL.md full.
- **Protocol:** `RESEARCH-CONSOLIDATION-PROTOCOL.md` full.

---

## Written

### A. Decisions (16 files in `research/wiki/decisions/`)

001 tech-first-stack-strategy · 002 track-commitments-locked · 003 team-role-lanes-locked · 004 socratic-protocol-installed · 005 best-use-of-ai-as-hard-target · 006 tribe-v2-as-special-mode · 007 agent-swarms-as-coordination-pattern · 008 k2-think-as-speed-engine · 009 ironside-pipeline-mirror · 010 b2c-primary-b2b-overlay-positioning · 011 demo-over-execution · 012 feature-freeze-saturday-8pm · 013 prd-built-in-different-instance · 014 karpathy-llm-wiki-pattern-adopted · 015 palohouse-dropped · 016 twelve-hour-work-budget-four-people · plus README.

Every file uses the §"Decision" schema (decision / date / locked-by / why / opens / closes / reversibility / trace) with standard frontmatter and per-claim source citations. Open tensions surfaced as named questions, never resolved.

### B. Vocabulary (1 file)

`research/wiki/themes/ai-paradox-invisible-use-cases/vocabulary.md` — ~120 terms across all sources, bucketed (failure-mode · architectural-fix · augmentation/mind · LLM-wiki · demo/pitch · persona/process). Each row: term · source(s) · one-line definition · companion terms · opposing terms. Synthesized terms marked "(synth)" — two used.

### C. Wiki README updated

PRD-builder reading order banner at top; folder-layout tree updated; new sections for Decisions + extended Themes (with cross-links to the 4 new theme files); Memento + Renaissance Research added to Projects with 🔴 HIGH lookalike-risk flags; witnessed-dissent added to Patterns; standard-frontmatter note added.

### D. Theme live-thread promoted

`themes/ai-paradox-invisible-use-cases/live-thread.md` (NEW) — SOTARE-style append-only file. Stub left in `README.md` pointing here. New entry per significant ingestion this consolidation pass dated 2026-04-25.

### E. Per-winner teardowns for HIGH lookalike risks (2 files)

- `projects/memento.md` — HackTech 2025 Best Health. AR glasses + temporal-frame analysis. No GitHub; all needles claimed-unverified. 🔴 HIGH risk reason: same hackathon prior year, same first-person-VLM problem space.
- `projects/renaissance-research.md` — HackTech 2025 Best Use of AI + Best Finance. Multi-LLM debate ensemble. 🔴 HIGH risk reason: won the exact prize we are hard-targeting; same architectural pattern (multi-LLM disagreement-as-signal); same visual UX wedge (parallel streams of model reasoning visible to user).

Both teardowns use existing project template + new lookalike-risk fields. Recommendation language stripped per Socratic protocol; differentiation paths held as named options for Johnny.

### F. Patterns updates (1 new file + 6 extended)

- NEW: `patterns/witnessed-dissent.md` — actor/auditor/mediator + emotional-mechanics §3.6. Genuine-novelty test passed (distinct trigger emotion / failure mode / architectural primitive vs. grounded-citation).
- Extended (frontmatter + theme/anti-theme alignment + cross-links): `grounded-citation.md` · `per-item-parallel-llm-evaluation.md` · `two-stage-llm-compile.md` · `robust-json-from-llms.md` · `spatial-sidecar.md` · `localize-and-zoom.md`.

No existing pattern body content was rewritten — only additions per the protocol's "EXTENDS and INDEXES; does not overwrite" rule.

### G. This report

`caltech/CONSOLIDATION-REPORT.md` (this file).

---

## Intentionally dropped (with reasons)

Each drop is a Socratic-protocol enforcement (decision 004) per `caltech/ideation/INDEX.md` "DROP / DON'T ingest" section.

1. **Rankings + "top N" lists across all 4 ideation files** — pre-Socratic-protocol artifacts. The vocabulary, lookalike-risk facts, reusability matrix, and lean-forward-audit rubric are kept; the rankings + "must-read" / "strongest hook" / "recommended portfolio" prescriptive language are not ingested.
2. **Window-2 file `400-prd-scaffold.md`** — **PARKED**, not ingested, per Johnny's verbatim directive (decision 013).
3. **`300-wiki-redesign-blueprint.md` full SOTARE migration** — planned but **not executed** per decision 014. The current pass adopts Karpathy frontmatter, the `decisions/` spine, `vocabulary.md`, and the `live-thread.md` promotion only.
4. **Sponsor SOURCES inboxes** — scaffold-only; no signal to consolidate. K2 `analysis/{bridge,greenchain}.md` pointers redirect to `research/wiki/projects/{bridge,greenchain}.md`, so no synthesis needed.
5. **TRIBE v2 contradictions** (~70K voxels vs ~20K vertices; 700 trained vs ~25 trained; license openness) — **NOT averaged**. Both claims held as T1+T2; deep-dive `tribe-v2-canonical-reference.md` named authoritative on load-bearing facts; source 006 preserved unchanged for record.

---

## Gaps remaining (open questions; missing sources; unverified projects)

### Open questions the wiki cannot answer (Johnny's call)

T1–T10 from `500-elicitation-qa-pass.md` + the full consolidated pool (A1–A8, S1–S5, D1–D3, SC1–SC5, R1–R6) from `501-party-mode-roundtable.md` are held, not resolved. They are surfaced in the relevant decision files' "Tensions held" sections (`decisions/005`, `006`, `007`, `010`). Notably unresolved: *what's the killer toggle* (D1); *whose voice does TRIBE score — user's vs system's* (S4); *what's the external non-platform-derived referent grounding the Auditor* (A7).

### Missing sources

- **Sponsor SOURCES inboxes** (Ironsight / K2 Think / Listen Labs) — all scaffold-only, no per-project teardowns dropped in. Sponsor research is best-known via `caltech/context/sponsors/*.md` (which captures live-signal from opening ceremony + personal conversations) rather than via `research/sponsors/`.
- **The Krafton / Unknown Worlds Delaware ruling** (source 003) is single-source — claimed by the YouTube commentary, not verified against actual case filings. Source file flags this with "⚠️ verify against actual case filings before citing in our own work."
- **The Harvard "trends slop" 30,000-data-point study** (source 003) — claimed but not yet identified by paper title or authors.
- **The "24-month deadline"** (source 004) — single anonymous YouTuber, no second source. Held as T2.

### Unverified projects

- `projects/memento.md` — Devpost-only; no GitHub link.
- `projects/jarvis.md` — pre-existing; no public repo found in user dump.

### Engineering reality unknowns (per P3 in `500-elicitation-qa-pass.md`)

The wiki contains TRIBE V2's *capabilities* but no entry on the *engineering reality* — GPU floor for inference, cold-start time, cost per inference, latency in seconds, whether the public demo wraps the model or hosts an API. Johnny's prior corpus has experiment-level evidence (Synthetic Synesthesia + DMN floor-and-bounce) but not a production-deploy-cost note.

---

## PRD-builder reading order (≤ 10 files)

The minimal reading list a PRD-builder agent must load to bootstrap, in order:

1. **`research/wiki/themes/ai-paradox-invisible-use-cases/README.md`** — theme lock document + Socratic protocol + open questions.
2. **`research/wiki/themes/ai-paradox-invisible-use-cases/vocabulary.md`** — ~120 terms; the glossary lookup for any "what does X mean?" question.
3. **`research/wiki/decisions/README.md`** — index of all 16 locked decisions; decide which to drill into based on PRD section.
4. **`research/wiki/decisions/006-tribe-v2-as-special-mode.md`** + **`007-agent-swarms-as-coordination-pattern.md`** — the two architectural anchors. (Counted as one in the protocol's ≤10 budget; they're a bonded pair.)
5. **`research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/tribe-v2-canonical-reference.md`** — primary-source verified facts (supersedes source 006 on three load-bearing items).
6. **`research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/emotional-depth-demo-theatre-canonical.md`** — 90-second demo template + 16-mechanic catalog (decision 011 backbone).
7. **`research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/500-elicitation-qa-pass.md`** — the 10 open tensions the PRD must address (or explicitly defer).
8. **`research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/501-party-mode-roundtable.md`** — six-persona open-question pool, structured for PRD-section mapping.
9. **`research/wiki/projects/renaissance-research.md`** — the closest prior-art that won the exact prize we are hard-targeting; the differentiation gap is the PRD's wedge.
10. **`caltech/CONSOLIDATION-REPORT.md`** (this file) — what to read next + gaps.

**Density check:** 10 files ≤ 10. Pre-PRD reading test passed per protocol verification gate.

---

## Protocol-revision proposal

**None.** The protocol's gates and schemas were correct-shape for the actual research. Two minor process notes for the next consolidation pass (not protocol revisions; just learnings):

- The protocol asks the consolidation agent to "build `decisions/` first (it's the spine)." That order is correct — every later file leaned on the decision IDs as cross-link targets.
- The protocol's Socratic-protocol enforcement worked exactly as intended on the `caltech/ideation/` files. The INDEX.md's pre-flagging of which sections to drop was load-bearing.

---

## Verification checklist (per protocol §"Verification before completion")

- [x] Every new file has standard frontmatter.
- [x] Every claim cites a source (file path or URL).
- [x] No file makes a recommendation about what to build.
- [x] PRD-builder reading order ≤ 10 files (10 exactly; bonded-pair counts as one).
- [x] All contradictions surfaced as tensions (T1–T10), not resolved.
- [x] Aspirational claims marked ❌ or "claimed-unverified" with explicit caveats.
- [x] Stayed on `main`. No fan-out worktrees from this agent.
- [x] No deletions of anyone else's files. Theme README live-thread section was *promoted* to its own file (per protocol allowance for splitting); stub left pointing to new location.

---

*Word count: ~1,420. Within the ≤ 1500 budget per protocol.*
