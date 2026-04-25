---
file-type: decision
status: verified
last-verified: 2026-04-25
supports-decisions: []
cites-sources:
  - research/wiki/themes/ai-paradox-invisible-use-cases/README.md
  - caltech/RESEARCH-CONSOLIDATION-PROTOCOL.md
cross-links:
  - 013-prd-built-in-different-instance.md
  - 014-karpathy-llm-wiki-pattern-adopted.md
  - ../themes/ai-paradox-invisible-use-cases/README.md
---

# 004 — Socratic interaction protocol installed

## Decision

Under the AI-paradox theme, Claude **reflects, sharpens, surfaces tensions** — never proposes the idea, hook, demo, hypothesis, or product surface. Johnny names the project; Claude indexes and challenges; resolution is Johnny's call.

## Date locked

2026-04-25.

## Locked by

Johnny (verbatim):
> "You cannot tell me what the idea is. I have to tell you what the idea is and you have to just repeat it back to me. But you can help guide me getting closer and closer and closer to what exactly I'm trying to get about." [source: `research/wiki/themes/ai-paradox-invisible-use-cases/README.md` lines 25]

## Why

The team is doing tech-first stack-stacking (decision 001). The temptation is for Claude to propose a "best" project shape from the option space. The Socratic rule forecloses that path so the idea remains Johnny's, the tension/contradiction work remains visible, and the option space stays open until Johnny converges.

The protocol explicitly:
- Reflects what Johnny says back to him sharper, structured, in his own framing.
- Surfaces tensions, gaps, and contradictions — does NOT resolve them with a recommendation.
- Asks Socratic questions: *what would have to be true? what's the test that would falsify it? what's the smallest version that would prove the bet?*
- Indexes evidence (sources, patterns, projects, sponsors) — points Johnny toward, never chooses for him.
- Distinct from the rest of the wiki: under this theme, Claude is the librarian and the foil, not the architect.

## What this opens

- Every consolidation, ingest, or QA pass leaves the idea space open instead of pre-collapsing.
- Tensions get held as named open questions (e.g., T1–T10 in `500-elicitation-qa-pass.md`) rather than averaged.
- The PRD-builder agent inherits a clean "what's locked vs. what's open" distinction.

## What this closes

- Recommendations / rankings / "top 5" / "strongest hook" language inside any wiki file under this theme.
- Claude proposing project ideas, demo theatrics, or front-facing artifacts.
- Resolutions of contradictions by averaging or picking sides — they must be held as tensions.

## Reversibility

Reversible only by Johnny himself, explicitly. No workflow output, no skill, no agent can override.

**Scope note:** the protocol does NOT bind wiki structure, schema conventions, ingest/lint operations, or PRD scaffolding mechanics — those are Claude's domain. Only the *idea / hook / demo / hypothesis / product surface* is reserved for Johnny.

## Trace

- `research/wiki/themes/ai-paradox-invisible-use-cases/README.md` lines 21–35 — full protocol statement.
- `caltech/RESEARCH-CONSOLIDATION-PROTOCOL.md` lines 45–61 — protocol enforcement in the consolidation agent.
- `caltech/ideation/INDEX.md` — flags ideation-sweep files that violated the protocol; consolidation respects those exclusions.
