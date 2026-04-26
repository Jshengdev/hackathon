---
file-type: pattern
status: in-progress
last-verified: 2026-04-25
supports-decisions:
  - ../decisions/007-agent-swarms-as-coordination-pattern.md
  - ../decisions/011-demo-over-execution.md
cites-sources:
  - ../themes/ai-paradox-invisible-use-cases/window-2-research-deepening/sources/004-multi-agent-alignment-actor-auditor-mediator.md
  - ../themes/ai-paradox-invisible-use-cases/sources/deep-dives/emotional-depth-demo-theatre-canonical.md
cross-links:
  - ../decisions/007-agent-swarms-as-coordination-pattern.md
  - grounded-citation.md
  - per-item-parallel-llm-evaluation.md
  - two-stage-llm-compile.md
  - ../projects/renaissance-research.md
  - ../projects/greenchain.md
---

# Witnessed dissent

**Render multiple agents disagreeing on screen. The auditor flags the actor; the diff is visible. The mediator (optional) resolves it. The user sees the system reasoning *with itself* in real time. Disagreement IS the un-black-box surface — not the failure mode.**

> **Why this is a separate file from `grounded-citation.md`:** they're complementary but mechanically distinct. Grounded citation = an output unit (sentence, number, row) cites a source artifact. Witnessed dissent = the *process* of arriving at that output is rendered as visible disagreement between agents. A demo can use one without the other; both together is the strongest comfort/safety play. The genuine-novelty test (per consolidation protocol output F) is met because (a) the trigger emotion is different (recognition + comfort + flash of anger vs. comfort/safety alone); (b) the failure mode is different (staged-looking dissent vs. uncited claim); (c) the architectural primitive is different (multi-agent triad vs. citation handle).

## When to reach for it

- The audience expects the AI to be confidently wrong (trends slop framing); you want to *visibly* prove it isn't.
- Your demo's wow needs to land in real time, not after a click — the dissent is the show.
- The vertical demands auditability *of the reasoning process*, not just *of the final claim* (compliance, safety, regulated industries, governance).
- You have ≥2 agent roles with structurally different objectives — Actor (talks to user; fast/friendly) + Auditor (background; checks rules + external reality) + optionally Mediator (resolves Actor/Auditor conflicts).

## The pattern

```
       user input
           │
           ▼
   ┌───────────────────┐         ┌─────────────────────┐
   │     ACTOR         │         │      AUDITOR        │
   │  (fast, friendly, │ ──────► │  (background;       │
   │   user-facing)    │  claim  │   checks rules +    │
   └───────────────────┘         │   external reality) │
           │                     └──────────┬──────────┘
           │                                │
           │ output (with claim chips)      │ diff (with citations)
           │                                │
           ▼                                ▼
   ┌─────────────────────────────────────────────────┐
   │    UI surface: the dissent is rendered          │
   │                                                 │
   │    [Actor's claim] ──── Auditor disagrees ───►  │
   │                              │                  │
   │                              ▼                  │
   │                    [diff: what auditor saw      │
   │                     that contradicts the claim] │
   │                                                 │
   │    optional: mediator resolves                  │
   └─────────────────────────────────────────────────┘
```

## Why it works

- **Disagreement is the binding force.** Per source 004, alignment isn't trained into a model; it emerges when you set up a whole structure of them. The friction *between* Actor and Auditor binds the system together — like cellular stress signals binding a body, or constitutional checks-and-balances binding a government.
- **The user sees the un-black-boxing happen.** The auditor's diff against the actor IS the un-black-box mechanism — it's a system property, not a UX feature.
- **Multiple agent roles don't dilute attention; they *focus* it on the disagreement.** Each agent has a small, focused, well-scoped job (cf. `per-item-parallel-llm-evaluation.md`). The visible artifact is the meta-conversation between them.
- **Recognition + comfort stack with a flash of anger** when the auditor catches the actor doing something the user already finds objectionable (cf. `emotional-depth-demo-theatre-canonical.md` §3.6).

## Real-code citations

- [`projects/renaissance-research.md`](../projects/renaissance-research.md) — HackTech 2025 Best Use of AI + Best Finance. Three perspectives stream side-by-side (optimistic / skeptical / synthesizer); the disagreement IS the demo. **Won the exact prize we are hard-targeting** (decision 005). Highest-leverage prior art.
- [`projects/greenchain.md`](../projects/greenchain.md) — Dedalus agent swarm + per-item K2 evaluation; structurally a primitive form of the pattern (the swarm "discovers + scores" but no explicit actor/auditor diff yet rendered to user).
- TreeHacks 2026 #42 [aimogus](https://devpost.com/software/aimogus) — Among Us simulation evaluating LLM deception + alignment interventions; the visible disagreement *is* the demo.
- TreeHacks 2026 #59 [Arena](https://devpost.com/software/arena-lz2m84) — "Agents *compete* to write the frontend that best serves you." The competition is the surface.

## Theme alignment

- **Restoring humanity in the age of AI** (theme `ai-paradox-invisible-use-cases`) — the auditor's diff against the actor *is* the un-black-boxing the theme calls for. Maps directly to Johnny's verbatim "do some sort of stimulation of some Socratic version" — the system Socratically interrogates itself in front of the user.

## Anti-theme alignment (where this pattern UNDERMINES the theme if applied wrongly)

- **If the dissent always resolves the same way** (the auditor "wins" 100% of the time), the witnessed dissent is theatre and the comfort beat is shallow. The system is back to a single-model oracle wearing a costume.
- **If the dissent is staged-looking** (the user senses the disagreement is pre-scripted), trust collapses and the demo reads as performative — the exact "presentation product, not thinking product" failure mode source 003 names as trends slop.
- **If the auditor and actor are the same model with different system prompts**, the disagreement is shallow because they share a base distribution (cf. R. Aydın persona challenge in `501-party-mode-roundtable.md`). Cellular stress signals work because cells are *physically separate organisms*; constitutional checks work because branches have *competing electorates*. Without structural separation, the witnessed dissent is theatre.
- **If the user inherits the *resolved* output of the disagreement without choice**, you've added 4 layers of opaque curation between the user and the world — a Filter World with extra steps (Mina Lee persona challenge in `501-party-mode-roundtable.md`).

## Gotchas / failure modes

- **Latency stacking.** Each agent adds inference time. K2 Think's ~1,300 tok/s on Cerebras (decision 008) is what makes this pattern viable in a 90-second demo; at normal LLM speeds, the swarm chain is too slow to feel real-time.
- **Mediator opacity.** If the Mediator is a single model resolving Actor/Auditor disagreement from an undisclosed standpoint, you've reintroduced the single-model alignment problem at the resolution layer. Disagreement was supposed to be the binding force; collapsing it through an opaque arbiter undoes the bet.
- **Infinite regress.** When the Auditor disagrees with the Actor, who audits the Auditor? Source 004's "double distortion" is in *every* agent. Name where you cut the regress; name what that cut costs.
- **Manufactured-disagreement risk.** Platforms in source 002 already manufacture disagreement for engagement (outrage cycles, reply-guy threads, the comment section in flesh from source 003 — all *visible disagreement* that nonetheless converges culture toward the mean). The triad's disagreement must be selected for *accuracy-against-external-reality*, not visibility.
- **No external referent = Filter World with extra steps.** Without an external, non-platform-derived ground truth that the Auditor checks against, the triad is theatre that performs deliberation. (Tribe V2 is *one candidate* external referent — see decision 006 — but it's not yet operationalized in the architecture per A7 from `501-party-mode-roundtable.md`.)

## Generalizes to

- **Compliance dashboards** (legal, medical, finance) — auditor flags actor's recommendation; diff renders the rule it triggers.
- **Code review** — TreeHacks 2026 #59 Arena pattern (agents compete to write the frontend; user sees the competition).
- **Content moderation / fact-checking** — actor proposes, auditor verifies, mediator resolves disputes (Tribune-style citation).
- **AI safety / alignment** — TreeHacks 2026 #42 aimogus (Among Us simulation evaluating deception + alignment).
- **Strategic decision-making** — multi-perspective evaluation visible to user (the Renaissance Research pattern, applied to non-research verticals).

## Cross-links

- [`grounded-citation.md`](grounded-citation.md) — companion pattern for the *output unit* layer (witnessed dissent renders the *process*; grounded citation renders the *artifact*).
- [`per-item-parallel-llm-evaluation.md`](per-item-parallel-llm-evaluation.md) — the engineering primitive (fan-out, semaphore-bounded parallelism) that makes the Auditor pass tractable.
- [`two-stage-llm-compile.md`](two-stage-llm-compile.md) — generalist→specialist 2-agent specialization-of-roles; primitive ancestor of actor→auditor.
- [`robust-json-from-llms.md`](robust-json-from-llms.md) — structured output discipline for the diff format (auditor's diff must be parseable, not prose).
- [`themes/ai-paradox-invisible-use-cases/window-2-research-deepening/sources/004-multi-agent-alignment-actor-auditor-mediator.md`](../themes/ai-paradox-invisible-use-cases/window-2-research-deepening/sources/004-multi-agent-alignment-actor-auditor-mediator.md) — full source.
- [`themes/ai-paradox-invisible-use-cases/sources/deep-dives/emotional-depth-demo-theatre-canonical.md`](../themes/ai-paradox-invisible-use-cases/sources/deep-dives/emotional-depth-demo-theatre-canonical.md) §3.6 — emotional mechanics for the demo theatre.
