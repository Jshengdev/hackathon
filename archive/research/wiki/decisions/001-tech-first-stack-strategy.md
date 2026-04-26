---
file-type: decision
status: verified
last-verified: 2026-04-25
supports-decisions: []
cites-sources:
  - caltech/context/yaps/2026-04-24-strategy-pivot-tech-first-stack.md
  - caltech/context/architecture.md
cross-links:
  - 002-track-commitments-locked.md
  - 005-best-use-of-ai-as-hard-target.md
  - 006-tribe-v2-as-special-mode.md
  - 008-k2-think-as-speed-engine.md
---

# 001 — Tech-first stack strategy

## Decision

Build the stack first (TRIBE V2 + K2 Think + Ironside data + Listen Labs framing), then back-fit the problem statement to maximize sponsored-track coverage. **Deliberate, conscious inversion of the standard problem-first approach.**

## Date locked

2026-04-24 (late Friday, post opening-ceremony team brainstorm).

## Locked by

Johnny + team (verbatim group decision walking back from opening ceremony).

## Why

> "We're doing the complete opposite of what everybody should do — designing something for a problem. We're starting with our tech stack first. Number one reason: we want to do every single sponsored track. The only realistic way to do that is start with what they all ask for, then find a problem to fit." [source: `caltech/context/yaps/2026-04-24-strategy-pivot-tech-first-stack.md` §"THE STRATEGIC INVERSION"]

The team has chosen to maximize sponsor-prize density rather than narrative cleanliness. The strategy is risky (judges value impact + problem-fit over clever tech) but consciously chosen with eyes open. Mitigation: wrap the stack in a strong "augment-not-replace humans" narrative.

## What this opens

- Multi-track stacking attempt — 6+ sponsor tracks in scope from one architecture.
- Architectural decisions can be made before the user-facing problem is locked.
- Allows sponsor-conversation refinement at the talks (Listen Labs Sat 11 AM, YC Sat 4 PM, Ironside Sat 6 PM) to shape the framing without re-architecting.

## What this closes

- Pure problem-first ideation ("user has X pain, here's the architecture") — that path is foreclosed by the time investment in stack research.
- Single-track depth pitches — the architecture is constrained to satisfy multiple sponsors simultaneously.
- Late-stage swap to a fundamentally different stack (e.g., dropping TRIBE V2 mid-Saturday) without losing the ~24h work already invested.

## Reversibility

Reversible only if **all three** of the following land Friday night: (a) TRIBE V2 fails on Ironside-style egocentric video, (b) K2 API access blocked, (c) Ironside dataset undelivered. Single failures are mitigated by the existing fallback plans (consumer YouTube footage, Cerebras direct, etc.).

## Trace

- `caltech/context/yaps/2026-04-24-strategy-pivot-tech-first-stack.md` — full team-brainstorm transcript.
- `caltech/context/architecture.md` — directional stack snapshot derived from this decision.
- `caltech/context/yaps/2026-04-24-judge-conversations-and-emerging-themes.md` — refinement after sponsor convos confirmed direction holds.
