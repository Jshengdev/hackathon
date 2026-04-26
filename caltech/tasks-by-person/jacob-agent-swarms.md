---
file-type: tasks-by-person
status: scaffold (extracted from PRFAQ canvas yap 2026-04-25; not yet a locked PRD slice)
last-verified: 2026-04-25
locked-by: Johnny verbatim PRFAQ canvas yap
cross-links:
  - ../yaps/2026-04-25-prfaq-canvas/01-high-signal-extracts.md
  - ../../research/wiki/decisions/007-agent-swarms-as-coordination-pattern.md
  - ../../research/wiki/decisions/008-k2-think-as-speed-engine.md
  - ../context/team/jacob.md
---

# Jacob — Agent swarms (orchestration + K2 fan-out)

> **Source:** Johnny's verbatim PRFAQ canvas yap, 2026-04-25. This is scaffolding only. The PRD-slicing pass will turn this into an actionable epic with I/O contracts.

## What Johnny named you'll be doing

The swarm-split + parallel-specialist + **cross-region communication** + aggregate orchestration. Concretely:

1. **Ingest** the per-region brain-activation JSON file produced by Junsoo's TRIBE V2 layer
2. **Fan-out** across N agents — **each agent tied 1:1 to a brain region (locked 2026-04-25 yap)**. Each agent IS a specialist for that part of the brain.
3. **Each agent** receives:
   - the activation intensity / pattern for its region (per-time-step, since TRIBE outputs at 1Hz)
   - the original video as context
   - a region-specific specialist prompt (you author the prompt template; per-region content TBD — Q-J5 below)
4. **Cross-region communication — LOCKED (2026-04-25 yap):** agents talk to each other. The cross-talk is the "sauce" Johnny explicitly named. Implementation: a second pass where region-A's output is visible to region-B before B finalizes its inference. This is what makes the metaphor *"reconstructing how a thought travels across your brain"* operationally distinct from a static parallel-fan-out.
5. **Each agent outputs** a semantic interpretation of "what the person was thinking about, given this region fired this way + given what the other regions said."
6. **Aggregate** the per-region + cross-region outputs into a single "how the brain would have inferred it" payload — this is the spine the visualization renders.
7. **Knowledge-graph build** — edges between region-outputs based on the cross-region communication pattern. Edge weight = how much region-B's output was shifted by region-A's input. **The graph IS the visualization of the cross-talk.**

## Why K2 (not Claude/GPT) for the fan-out

Decision 008 — K2 ~1,300 tok/s on Cerebras. The architecture must be *infeasible without K2's speed* or it's decorative. Sponsor judges (IFM) will check: does the demo collapse if K2 is swapped for Claude? If yes — load-bearing. If no — fail.

**Implication for your build:** the demo must run in seconds. If N=12 (rough upper bound for major brain regions) × per-region specialist call, the fan-out is the only way to fit in the demo window. Do NOT serialize.

## High-signal extracts from the yap (your context)

- *"do a swarm based off the intensity"* — the activation magnitude shapes which agents get fired with what priority
- *"separate, split, divide into all swarm agents and then we conquer it"* — classic map-reduce, but per-region not per-shard
- *"reconstructing how a thought travels across your brain"* — the user-facing metaphor; your aggregation should produce something visualizable as a path/graph traversal
- *"each thing communicates with each other"* — agents may need a second pass that lets one region's output reference another's (open: do you need this in v1, or is single-pass aggregate enough for the demo?)

## Open questions for you to bring back

- **Q-J1.** N = ? (How many brain-region specialists? Constrained by TRIBE's region partition + demo time budget.)
- **Q-J2.** ~~Single-pass vs. multi-pass~~ **RESOLVED 2026-04-25:** multi-pass with cross-region communication. Open sub-question: how many rounds of cross-talk before merge? (Two rounds is cheap; more is interesting but blows the demo time budget.)
- **Q-J3.** What's the mock contract? — i.e., when Junsoo's TRIBE pipeline isn't ready, what shape of fake JSON do you build against so you're never blocked? (Per ship-velocity principle 6: every external dep gets a mock.)
- **Q-J4.** Does Renaissance's "three streams visible side-by-side" pattern apply, or do you need a different visible-output shape? (Differentiation question — links to Johnny's slice; **partly resolved by output-shape lock to Spotify Wrapped session-replay**, not live three-stream.)
- **Q-J5.** Per-region specialist prompts — what's the system prompt template for "you are the specialist for [region X]"? Region-specific content can be lightweight ("frontal lobe = executive function / planning"; "amygdala = salience / emotional valence" — Johnny said don't worry about being scientifically rigorous; the per-region archetype is enough to make the swarm produce differentiated output).
- **Q-J6.** **NEW — inverted-brain-search mechanic.** The Land-card output requires: given a grayed-out region, what content WOULD activate it? Two implementation options: (a) reverse-lookup over a precomputed library of TRIBE-scored content, (b) prompt the swarm to *generate* the content description, (c) hand it to a search API (YouTube / Spotify) with the brain-region archetype as the query. Pick one for v1.

## What's NOT yet your problem

- The brain visualization itself (Emilie / Johnny — packaging + orchestration)
- The TRIBE V2 → JSON pipeline (Junsoo)
- The pitch / story / sponsor closes (Emilie)
- The "compare move" (feed new content, show drift) — open whether it's even in v1

## Lane tools (per ship-velocity principle 4)

- Claude Code or Codex for the K2 swarm orchestration
- Build against a mock TRIBE JSON; swap to Junsoo's real output at integration

## What you are NOT cleared to do until Johnny locks the PRFAQ

Don't start writing code yet. The PRFAQ has 5 open soft-locks. Wait for the green-light from the orchestration pane (Johnny). Use the time to:
- Read decision 007 + 008 + the K2 integration template at `research/wiki/tools/k2-think.md`
- Confirm K2 API access works (per the IFM tooling notes)
- Sketch the I/O contract you want from Junsoo's brain-activation output

## NEW — Nucleus is the working precedent (2026-04-25 sync)

Per the team-profile + corpus gap-filler analysis (`caltech/validation-findings/2026-04-25-team-gap-fillers.md`):

**Nucleus already IS this architecture in another domain.** The pattern you shipped (Fetch.AI uAgents architecture, async specialized agents on fixed cycle, Claude as downstream "reasoning seal," Supabase WebSockets to React UI, NEWS2 severity scoring on a 10-second vitals cycle) is structurally identical to what we need:

| Nucleus component | Maps to |
|---|---|
| Specialized async agents on fixed cycle | Per-region brain specialist agents (one per region, each fires when TRIBE outputs activation for it) |
| Claude as downstream reasoning seal | Mediator agent (synthesizes per-region outputs into "how the brain would have inferred it") |
| Supabase WebSockets → React UI | Live brain-activity stream → 3D visualization on frontend |
| NEWS2 severity scoring on 10-second cycle | Activation-magnitude scoring per brain region, swarm fan-out triggered by score threshold |

**Port the architecture, don't rebuild it.** Your time advantage on this hackathon = you've already shipped this pattern. The work is K2 + brain-region prompts swapped in.

**Career-narrative win:** the K2 swarm + cross-region communication + observability story IS the resume narrative you said you wanted (per `jacob.md`: *"credible story for AI-adjacent or low-level systems role"*). The MLOps / latency / failure modes / human-in-the-loop UX gaps you flagged as growth areas are *exactly* what this build forces.

## NEW — your role as the "Cross-talk demo example" defender

The validation pass surfaced a red-team attack: *"two passes of agents talking to each other can produce coherent-sounding nonsense."* This kills the demo if there's no worked example showing actor/auditor/mediator outputs visibly diverge on the same brain-pattern input.

**Your deliverable:** ONE hand-tuned scenario for the demo input video where:
- Region A's specialist outputs Hypothesis X
- Region B's specialist outputs Hypothesis Y (visibly different)
- Mediator's synthesis is non-trivially derived from both (not a copy-paste of either)

Junsoo will defend the *empirical* method (does the cross-talk actually diverge across many inputs); you defend the *demo-day* example (this specific input shows visible divergence).
