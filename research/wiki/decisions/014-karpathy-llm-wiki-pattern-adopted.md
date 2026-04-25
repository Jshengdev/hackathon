---
file-type: decision
status: verified
last-verified: 2026-04-25
supports-decisions:
  - 004-socratic-protocol-installed.md
  - 013-prd-built-in-different-instance.md
cites-sources:
  - research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/sources/007-karpathy-llm-wiki-pattern.md
  - research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/200-llm-wiki-recall-patterns-sotare-and-karpathy.md
  - research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/300-wiki-redesign-blueprint.md
  - caltech/RESEARCH-CONSOLIDATION-PROTOCOL.md
cross-links:
  - 004-socratic-protocol-installed.md
  - 013-prd-built-in-different-instance.md
  - ../README.md
---

# 014 — Karpathy LLM Wiki pattern adopted (Karpathy + SOTARE)

## Decision

Wiki structure follows Karpathy's three-layer (raw / wiki / schema) + three-operation (ingest / query / lint) pattern, augmented with SOTARE's append-only `live-thread.md` and per-source-folder shape. The wiki is "written for an LLM that has 30 seconds to read it before answering a hard question" (Karpathy gates per consolidation protocol).

## Date locked

2026-04-25 (consolidation protocol installation).

## Locked by

Johnny (authorized wiki-architecture work explicitly):
> "you are in charge of designing the entire research wiki." [source: `300-wiki-redesign-blueprint.md` line 5]

## Why

- The pre-existing wiki layout (3 projects + 6 patterns + 1 tool + theme lock) was a one-shot teardown library — written once, no compounding layer, no `index.md`/`log.md`, no frontmatter [source: `200-llm-wiki-recall-patterns-sotare-and-karpathy.md` §1].
- The Karpathy LLM-wiki pattern is the canonical recipe for compounding (vs. RAG-style retrieve-each-time): cross-references, contradictions, synthesis already filed [source: `sources/007-karpathy-llm-wiki-pattern.md`].
- SOTARE (Johnny's own meta-research lab at `/tmp/SOTARE`) already implements the pattern in production-shape with `live-thread.md` / `source-library.md` / per-expert-mini-wikis / append-only `loop-learnings.md` / cadenced auto-loop. Lift the conventions.
- The Karpathy LLM-wiki essay itself is **double-duty** — both *content* for the AI-paradox theme (it's the canonical "augmented intelligence done right") and *operating manual* for the team's own wiki.

## What this opens

- Standard frontmatter on every file (per consolidation protocol §"Standard frontmatter").
- Per-file-type schemas enforced (source / project / pattern / decision / vocabulary).
- `decisions/` folder as the spine — the rest hangs off it.
- `vocabulary.md` as the cross-source glossary lookup.
- The PRD-builder agent has a 5-file pre-load reading list (per consolidation protocol §"Pre-PRD reading order").

## What this closes

- Free-form "write whatever helps" wiki entries — schemas now constrained.
- Floating assertions without provenance — every claim cites a source.
- Embedding-RAG infra at our scale (~hundreds of pages) — `index.md` + LLM context window suffices per Karpathy.

## Reversibility

Reversible only if the wiki redesign blueprint is itself wrong-shape for the actual research and the team writes a counter-proposal in `caltech/CONSOLIDATION-REPORT.md` "protocol revision proposal" section.

## Scope note

The full SOTARE-style migration (`raw/` immutable folder, full `experts/<expert>/` subdirectories, `harness.sh` cadenced auto-loop) is **planned but not executed** — see `300-wiki-redesign-blueprint.md` §"Migration order." The current consolidation pass adopts Karpathy's frontmatter, the `decisions/` spine, the `vocabulary.md` glossary, and the `live-thread.md` promotion (per consolidation protocol output D), but defers the deeper SOTARE structural changes for a later authorized commit.

## Trace

- `sources/007-karpathy-llm-wiki-pattern.md` — verbatim Karpathy essay.
- `200-llm-wiki-recall-patterns-sotare-and-karpathy.md` — SOTARE structural teardown + first-principles synthesis.
- `300-wiki-redesign-blueprint.md` — proposed migration plan (parked).
- `caltech/RESEARCH-CONSOLIDATION-PROTOCOL.md` — Karpathy LLM-wiki principles enforced as gates.
