---
file-type: decision
status: verified
last-verified: 2026-04-25
supports-decisions:
  - 004-socratic-protocol-installed.md
  - 014-karpathy-llm-wiki-pattern-adopted.md
cites-sources:
  - research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/400-prd-scaffold.md
  - caltech/RESEARCH-CONSOLIDATION-PROTOCOL.md
cross-links:
  - 004-socratic-protocol-installed.md
  - 014-karpathy-llm-wiki-pattern-adopted.md
---

# 013 — PRD built in a different Claude instance

## Decision

The PRD will be **built in a separate Claude instance** after consolidation completes. This window's job is **wiki consolidation + decision-locking via PRFAQ pattern**, not PRD writing. Pre-PRD work happens via the **PRFAQ approach** — scaffold + decision-locking — which the consolidation agent's `decisions/` folder + `vocabulary.md` outputs feed into.

## Date locked

2026-04-25.

## Locked by

Johnny (verbatim, parked PRD scaffold lines 4–8):
> "Try not to do any of the PRD related tasks... do not do anything regarding the PRD. Your only job here is to consolidate research into the LM wiki and define what it's capable of by creating strong indexes and also the structure. We're basically going to do a PRFAQ, where we can primarily scaffold all of and solve lock most of our decisions and then we'll create a PRD in a completely different instance of cloud that won't be related to this." [source: `400-prd-scaffold.md` lines 4–8]

## Why

- The consolidation agent's job is *fusion*, not *parallel research* (per `caltech/RESEARCH-CONSOLIDATION-PROTOCOL.md` line 215).
- The Socratic protocol (decision 004) bars Claude from proposing the project — a PRD presupposes a chosen project, which is Johnny's call.
- Decisions land here (`decisions/`) and vocabulary lands here (`vocabulary.md`) so the PRD-builder agent in the next Claude instance has a clean reading list.
- The pre-PRD scaffold at `400-prd-scaffold.md` is **PARKED** — preserved as feedstock for the consolidation agent (it surfaces what kind of slots a PRD will eventually need to fill, which informs decision-extraction). It is NOT to be extended in this window.

## What this opens

- A clean handoff: PRD-builder agent reads `decisions/` (the spine), `vocabulary.md` (the terms), `themes/ai-paradox-invisible-use-cases/README.md` (the lock document), and the PRD-builder reading order in `caltech/CONSOLIDATION-REPORT.md` (≤ 10 files).
- This window stays focused on its single job (per the protocol's verification gate: "PRD-builder reading order ≤ 10 files").
- Multiple PRFAQ iterations possible without consolidation drift.

## What this closes

- Mixing PRD-writing with consolidation in this window — that conflates "what's locked" with "what's proposed."
- Claude proposing project shapes inside the PRD scaffold (would violate decision 004).

## Reversibility

Reversible only by Johnny re-scoping this window's job.

## Trace

- `research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/400-prd-scaffold.md` lines 4–8 — Johnny's verbatim parking directive.
- `caltech/RESEARCH-CONSOLIDATION-PROTOCOL.md` lines 240–262 — pre-PRD reading order.
