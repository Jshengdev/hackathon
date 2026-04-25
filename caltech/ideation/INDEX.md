# Ideation Sweep — Index + Consolidation Notes

**Status:** RAW FEEDSTOCK. Not a recommendation. Not a decision.
**Branch:** `research/ideation-sweep` (worktree).
**Run date:** 2026-04-25.
**Run by:** parallel ideation sweep — 4 agents dispatched in parallel from a separate Claude window while another window was simultaneously building the canonical theme lock document.

---

## Critical caveat (read first)

These four files were generated **before** this window had visibility into the canonical theme structure at:

- `research/wiki/themes/ai-paradox-invisible-use-cases/README.md`

That theme lock document installs the **Socratic interaction protocol**: Claude reflects, never proposes the idea. These ideation outputs **violate that protocol** in places — they propose, rank, and recommend.

**How to read them anyway:** treat each idea / pattern / hook / concept as a *sharpened reflection* of the problem space, not a proposal. The job during consolidation is to extract the *vocabulary*, *failure modes named*, *adjacent comparables*, and *form-factor primitives* — and then let Johnny do the choosing.

Anything in these files that looks like "you should build X" should be re-read as "X is a shape that exists in the option space."

---

## What's here

| File | What it is | Strongest signal | Weakest signal |
|---|---|---|---|
| [`01-problem-space-buffet.md`](01-problem-space-buffet.md) | 30 distinct problem-space framings across 20+ domains, each with persona / demo case / stack mapping / Best-AI hook / risk | Domain-coverage map; vocabulary across creative-tools, AI-literacy, mental-health, civic, accessibility | Top-5 ranking inside file (violates Socratic — ignore the ranking) |
| [`02-winner-cross-comparison.md`](02-winner-cross-comparison.md) | 16 past hackathon winners profiled + 7 recurring patterns + lookalike-risk schema | **Memento (HackTech 2025) + Renaissance Research (HackTech 2025) flagged as HIGH lookalike risk for our stack** | Comparison-ready scaffold is empty by design |
| [`03-pitch-hooks.md`](03-pitch-hooks.md) | 15 30-second hooks + 12 closes + 8 narrative arcs + 12-row judge lean-forward audit | The lean-forward audit rubric (12-row) — usable as a check for ANY future idea | Hook ranking inside file (violates Socratic — ignore) |
| [`04-front-facing-concepts.md`](04-front-facing-concepts.md) | 15 user-facing artifact concepts across 15 archetypes + reusability matrix | The reusability matrix (which front-end primitives appear across multiple concepts → drives shared-lane investment) | The "recommended portfolio" of 3 concepts (violates Socratic — ignore) |

---

## Consolidation feedstock map

When the next-window consolidation agent ingests these files into the canonical wiki, here's where each section's signal belongs:

### → `research/wiki/themes/ai-paradox-invisible-use-cases/sources/`
- New source files for any **vocabulary** introduced here that maps to the theme but isn't already in the cross-source vocabulary list. Candidates from `01-problem-space-buffet.md`: AI-as-bubble, persuasion-engineering, with-the-kid-not-on-the-kid, brain-rot-arxiv-citation, voice-chatbot-mental-health-crisis. From `03-pitch-hooks.md`: manipulation-only-works-in-the-dark, sycophancy-headlines-2026.

### → `research/wiki/projects/`
- Per-winner teardowns for the highest-risk lookalikes from `02`: **Memento** and **Renaissance Research** specifically. Use the existing per-project template. These are not optional — the team needs them to differentiate.

### → `research/wiki/patterns/`
- Cross-reference the 7 patterns from `02-winner-cross-comparison.md` (Live transformation demo, Glass-box / disagreement-as-signal, Personal stakes hook, Hidden-audience reframing, Sympathetic-underdog, Theatrical hardware, Two-stage LLM compile) against the existing 6 patterns. Where they overlap, reinforce; where they're new, add.

### → `caltech/context/yaps/` or `caltech/context/architecture.md`
- The reusability matrix from `04-front-facing-concepts.md` should inform the architecture refinement: which front-end primitives are worth investing in once and reusing across surfaces. This is engineering-decision feedstock for the PRD, not a wiki concern.

### → Theme lock document `live thread`
- Add a single line to `themes/ai-paradox-invisible-use-cases/README.md` live-thread changelog noting that the ideation sweep ran and produced this feedstock. Do NOT add the rankings or recommendations — only the existence of the buffet and the highest-leverage signals (Memento/Renaissance lookalike risk; manipulation-only-works-in-the-dark hook framing; reusability matrix).

### → DROP / DON'T ingest
- The ranked top-3 / top-5 inside each file. These are pre-Socratic-protocol artifacts.
- The "recommended portfolio" in `04`. Same reason.
- The "strongest hook" in `03`. Same reason.
- Any prescriptive "we should build X" language.

---

## What this branch does NOT have

These were intentionally out of scope for this sweep — they belong in the consolidation step or in Johnny's own hands:

- A chosen idea
- A chosen theme refinement
- A chosen pitch hook
- A chosen front-facing artifact
- A PRD
- A sprint plan

---

## How to merge this branch

When consolidation begins:

```bash
# From main:
git merge research/ideation-sweep --no-ff -m "merge: ideation sweep feedstock for consolidation"
```

Or cherry-pick only the ideation files if the theme-lock-document edits should stay separate:

```bash
git checkout research/ideation-sweep -- caltech/ideation/
```

The branch carries no other changes besides the ideation files and this index.
