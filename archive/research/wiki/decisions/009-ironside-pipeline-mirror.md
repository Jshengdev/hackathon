---
file-type: decision
status: verified
last-verified: 2026-04-25
supports-decisions:
  - 002-track-commitments-locked.md
  - 007-agent-swarms-as-coordination-pattern.md
cites-sources:
  - caltech/context/sponsors/ironsite.md
  - caltech/context/yaps/2026-04-24-judge-conversations-and-emerging-themes.md
  - caltech/context/architecture.md
cross-links:
  - 006-tribe-v2-as-special-mode.md
  - 007-agent-swarms-as-coordination-pattern.md
  - 008-k2-think-as-speed-engine.md
---

# 009 — Mirror Ironside's 3-step pipeline

## Decision

The K2 swarm's structural template **mirrors Ironside's own internal pipeline**:
1. **Auto-Classifier** — many parallel agents classify what they "see" (frame + brain encoding).
2. **Narration** — agents narrate the action / context they perceive (parallel narration reduces single-narrator hallucination).
3. **Observer-as-Judge** — meta-agents Q&A the classifier and narrator outputs, surface disagreement, resolve ambiguity.

Brain encoding (TRIBE V2) is the *parallel data stream* added at every step.

## Date locked

2026-04-24 (Friday personal conversation with Ironside founders Ken + Dani at the booth).

## Locked by

Ironside founders (Ken/CEO, Dani/CTO) + Johnny — direct in-person conversation Friday after their fireside.

## Why

Ironside revealed their internal 3-step pipeline at the booth + cited a specific failure they had:
> "They tried augmenting the hands themselves (highlighting them in the video) → made performance WORSE. Lesson: visual augmentation of the subject can confuse the model. Augmentation should add new modality, not modify existing pixels." [source: `caltech/context/sponsors/ironsite.md` lines 131–134]

Their suggested direction: "use a camera ALONGSIDE the video — a second sensor stream provides the spatial reasoning the model was missing. Adding a parallel data stream about what's happening dramatically improves classification" [source: lines 136–138].

**Our hypothesis maps directly:** brain-encoding output is the "second stream" — gives the model semantic context that pixel-only video lacks.

The team's wedge framing (Junsoo's insight): VLMs jump straight to instance recognition based on pixel similarity (screwdriver vs hammer collide). Brain encoding gives hierarchical semantic clustering for free (TOOL → WORK TOOL vs CULINARY TOOL → instance). [source: `caltech/context/yaps/2026-04-24-strategy-pivot-tech-first-stack.md` lines 215–220]

## What this opens

- Pitch lands harder: *"we built what you're already trying to build, but with a novel second input modality."*
- A quantitative side-by-side becomes possible: "their pipeline" vs "their pipeline + brain encoding" disambiguation accuracy delta.
- Architectural validation: their own engineers built this exact 3-step shape — the team isn't speculating about whether the structure works.

## What this closes

- Pixel-modification interventions (highlighting hands, drawing bounding boxes on raw frames) — they explicitly underperform.
- A swarm shape that *doesn't* mirror their pipeline — the demo loses the "we extended your work" pitch.
- Single-narrator architectures — parallel narration is a pillar of the mirror.

## Reversibility

Reversible only if Saturday 6 PM Ironside fireside reveals a fundamentally different judging rubric than what the booth conversation surfaced.

## Trace

- `caltech/context/sponsors/ironsite.md` lines 116–146 — full personal-conversation transcript with Ken + Dani.
- `caltech/context/yaps/2026-04-24-judge-conversations-and-emerging-themes.md` lines 23–34 — architectural template + failed-experiment lesson.
- `caltech/context/architecture.md` Layer 4 lines 56–67 — explicit mirror in the directional stack.
