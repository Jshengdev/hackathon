---
file-type: decision
status: verified
last-verified: 2026-04-25
supports-decisions:
  - 001-tech-first-stack-strategy.md
  - 002-track-commitments-locked.md
cites-sources:
  - research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/sources/004-multi-agent-alignment-actor-auditor-mediator.md
  - research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/100-tribe-v2-and-agent-swarms-architectural-anchors.md
cross-links:
  - 006-tribe-v2-as-special-mode.md
  - 008-k2-think-as-speed-engine.md
  - 009-ironside-pipeline-mirror.md
  - ../patterns/per-item-parallel-llm-evaluation.md
  - ../patterns/grounded-citation.md
---

# 007 — Agent swarms as the coordination pattern

## Decision

The architecture's coordination pattern is a **multi-agent triad** — Actor / Auditor / Mediator (per source 004). Disagreement between agents is the binding force, not a bug. The auditor's diff against the actor IS the un-black-boxing — the user *sees* the system reasoning with itself.

## Date locked

2026-04-25 (paired with the TRIBE V2 anchor decision in `100-tribe-v2-and-agent-swarms-architectural-anchors.md`).

## Locked by

Johnny (verbatim, same quote as decision 006): "agent swarms obviously."

## Why

- Source 004 names the architectural blueprint the prior three sources (Hak / culture-flattening / trends-slop) were missing — they all named the disease (single-model surface confidence; corpus mean; opacity); source 004 names a candidate cure: **multi-agent disagreement as the un-black-box mechanism**.
- Inspirations: Michael Levin's biology (cells coordinating via shared stress signals) + US Constitution checks-and-balances ("the weak link was always us humans — AI agents have none of that"). Both analogies, neither derivation; named explicitly in the source.
- Maps to existing wiki patterns:
  - `patterns/per-item-parallel-llm-evaluation.md` — primitive form (fan-out per-item evaluation).
  - `patterns/two-stage-llm-compile.md` — generalist→specialist 2-agent specialization (BRIDGE shape).
  - `patterns/grounded-citation.md` — auditor's role is to enforce citations from outside.

## What this opens

- The "show me where the auditor disagreed" UI feature → the demo's un-black-box surface.
- Sponsor leverage stacks: Actor = consumer-friendly tone (Listen Labs voice); Auditor = K2 Think reasoning specialist; Mediator = arbitration logic; TRIBE V2 = neural-response check at any/all of the three.
- Pitch narrative: "we didn't invent this — biology and the US Constitution invented it; the components are finally good enough for the design."

## What this closes

- Single-model demos — those would contradict the entire premise.
- Agent disagreement that always resolves the same way (the auditor "wins" 100% of the time) — that's theatre and the trust collapses.
- A Mediator that the user can't audit — collapses single-model alignment problem at the resolution layer.

## Reversibility

Reversible only if (a) Johnny names a different coordination pattern as the project's spine, OR (b) the friction-positive UX fights consumer gravity so hard the demo collapses (T3 below).

## Tensions held (per protocol — not resolved)

- **T3 from `500-elicitation-qa-pass.md`:** "Disagreement is the binding force" vs. source 002's documented "we are free to choose anything yet the choice we often make is not to have a choice." The architecture proposes friction-positive UX into a documented friction-negative consumer preference. **No counter exists in the corpus.**
- **T4:** TRIBE V2's modality stack (V-JEPA 2 + Wav2Vec-BERT + Llama-3.2) ≠ the sponsor stack (Listen Labs / Ironside / K2). The 100-anchor file maps modalities to sponsors; the canonical sources show Meta's components. The intrinsic-vs-bolted-on test cannot be performed without resolving this.
- **A2 / A3 / A4 from `501-party-mode-roundtable.md`:** structural separation between the three agents (preventing "three system prompts on the same base model"); whether the Mediator is neutral; who audits the Auditor.
- **A7 (Mina + Aydın cross-persona):** what is the external, non-platform-derived referent that grounds the Auditor and prevents the triad from being Filter World with extra steps? Not yet named in the architecture.
- **R5 (Mina):** "show me the disagreement" UI feature is structurally a Spotify-Wrapped move ("Because you listened to X") — visibility ≠ autonomy. Adding more synthetic voices to a polyphony already losing volume could accelerate the failure mode.

## Trace

- `research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/sources/004-multi-agent-alignment-actor-auditor-mediator.md` — full source (YouTube transcript on multi-agent alignment).
- `research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/100-tribe-v2-and-agent-swarms-architectural-anchors.md` — pair-anchor synthesis.
- `research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/501-party-mode-roundtable.md` Section 6 (R. Aydın persona) + Section 8 (Mina ↔ Aydın cross-persona) — surfaces the load-bearing open architectural questions.
- `research/wiki/projects/greenchain.md` (existing pattern reference: Dedalus agent swarm + per-item parallel K2 evaluation).
