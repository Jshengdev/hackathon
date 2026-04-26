---
file-type: project
status: partial
last-verified: 2026-04-25
supports-decisions:
  - ../decisions/007-agent-swarms-as-coordination-pattern.md
  - ../decisions/008-k2-think-as-speed-engine.md
cites-sources:
  - ../../../caltech/ideation/02-winner-cross-comparison.md
  - https://devpost.com/software/renaissance-research
  - https://github.com/AlexXLi12/HackTech2025
  - https://github.com/anshll/renaissance-research
  - https://www.renresearch.co
cross-links:
  - ../decisions/007-agent-swarms-as-coordination-pattern.md
  - ../decisions/008-k2-think-as-speed-engine.md
  - ../patterns/per-item-parallel-llm-evaluation.md
  - ../patterns/two-stage-llm-compile.md
  - ../patterns/witnessed-dissent.md
  - memento.md
---

# Renaissance Research

> **⚠️ Lookalike-risk teardown:** Per `caltech/ideation/INDEX.md`, this project is flagged as a **HIGH lookalike risk** for our HackTech 2026 stack. The teardown below uses *facts only* from the ideation file; recommendation language is stripped per the Socratic protocol (decision 004).
>
> Verification: two GitHub repos + a live deploy URL. **Highly verified** by Devpost + Devpost-cited links; not yet inspected at code level by this consolidation pass.

- **Hackathon / event:** HackTech 2025 (Caltech)
- **Year / date:** 2025
- **Prize won:** **Best Use of AI** (the exact track we are hard-targeting at HackTech 2026 — see [decision 005](../decisions/005-best-use-of-ai-as-hard-target.md)) + **Best Finance Project**
- **Sponsor tracks involved:** unverified — Devpost copy doesn't break out specific sponsor tracks
- **Devpost / press / video / repo:**
  - Devpost: https://devpost.com/software/renaissance-research
  - GitHub (1): https://github.com/AlexXLi12/HackTech2025
  - GitHub (2): https://github.com/anshll/renaissance-research
  - Live demo: https://www.renresearch.co
- **Local clone:** not yet — recommended pull (per ideation file footer): both repos to inspect prompt templates for the optimist/skeptic/synthesizer triad and identify token-cost budget per query.

## Pitch (one sentence)

Scrapes overlooked academic papers and PhD theses, then uses a *multi-stage debate ensemble* of LLMs to evaluate which ones are now newly viable given modern tech — type a domain (e.g., "drug delivery"), watch three LLM evaluations stream in side-by-side (one optimistic, one skeptical, one synthesizing), land on a ranked list of "papers worth re-trying today."

## What's actually in the repo (verified vs. claimed — pre-code-inspection)

| Devpost claim | Reality |
|---|---|
| Multi-stage debate ensemble of LLMs | ⚠️ Claimed; two repos verify the architecture exists; prompt templates not yet inspected by this pass |
| Three perspectives stream in real-time on screen (optimistic / skeptical / synthesizer) | ⚠️ Claimed; the live URL would confirm — not yet validated |
| Beautiful Soup for paper scraping | ⚠️ Claimed — Devpost dependency list |
| Migrated from AWS Bedrock to Gemini API for context-window reasons | ⚠️ Claimed |
| AWS deployment, Next.js + React + TypeScript frontend, Vercel deploy | ⚠️ Claimed; live URL exists |
| "Hidden alpha in dead research" thesis | ⚠️ Pitch framing — operationally unverified |

## The unique sauce (what made it stand out — per ideation file)

1. **The closest existing winner to our K2-swarm thesis.** They didn't call it a "swarm" — they called it a "debate" — but architecturally it's three LLM passes with disagreement-as-signal. **They won Best Use of AI *because* the disagreement IS the demo.**
2. **Visible multi-perspective UI** — three columns of model output streaming in parallel. Pattern B (glass-box / disagreement-as-signal) made literal.
3. **Vertical wrapper that doubled the prize** — "find investable IP" got them Best Finance Project alongside Best Use of AI.
4. **Live deploy URL** — they shipped beyond the hackathon (renresearch.co exists as of consolidation date).

## Implementation needles (claimed, pre-inspection)

- **Beautiful Soup + Python** for paper scraping (academic + thesis sources).
- **Gemini API** for the LLM ensemble (post-migration from AWS Bedrock).
- **AWS** as the orchestration backbone.
- **Next.js + React + TypeScript** frontend on Vercel.

The "three streams in parallel" UI is the load-bearing demo affordance — structurally identical to the per-item parallel evaluation pattern (`patterns/per-item-parallel-llm-evaluation.md`) the team has already documented in GreenChain, except *visible to the user as the surface*, not as a backend optimization.

## Capability stack

| Layer | Choice |
|---|---|
| Frontend | Next.js + React + TypeScript |
| LLM | Gemini API |
| LLM (alt, replaced) | AWS Bedrock |
| Scraping | Beautiful Soup |
| Backend | Python |
| Cloud | AWS |
| Deploy | Vercel |

## Why it won

- **Disagreement IS the demo** — judges see three model perspectives stream in side-by-side; the visualization of multi-LLM debate is the wow.
- **Vertical wrapper drives a second prize** — the Best Finance prize attaches because the demo's surface is "find investable IP," not "look at this cool architecture."
- **Two GitHub repos + live deploy URL** signals shipping discipline (lift not common in HackTech-class projects).

## Lookalike-risk score for our HackTech 2026 entry

**🔴 HIGH** — Same hackathon (HackTech), one year prior (2025); same target prize (Best Use of AI); same architectural pattern (multi-LLM disagreement-as-signal — structurally the actor/auditor/mediator triad we're committing to per [decision 007](../decisions/007-agent-swarms-as-coordination-pattern.md)); same visual UX wedge (parallel streams of model reasoning visible to user). **A judge who scored Renaissance Research in 2025 will pattern-match to our demo within 60 seconds.**

The risk is sharpest because: the wedge that won Renaissance Research the *exact prize we are hard-targeting* is the same architectural wedge our locked anchors give us. Renaissance Research already proved the wedge works at this judging panel; *that's good news for whether the wedge works, and very bad news for "have I seen this before" in the judge's head*.

## What this project's existence forecloses for our project

- **"AI debate as the demo" with N=3 perspectives.** They own that exact framing at this hackathon. If we ship N=3 we read as derivative.
- **The "watch the AI argue with itself" pitch line as the hook.** Burned.
- **A finance/research vertical wrapper for the demo.** They own the "find investable IP" frame.
- **Anything that looks like three colored side-by-side LLM streams as the hero UI.** Visual signature is taken.

## What's still open (per ideation file)

The ideation file (lines 380–384) flagged three differentiation paths the team can consider — the consolidation pass holds these as *named options*, not recommendations:
1. **Use K2's speed to run 100+ debaters not 3.** The N=3 → N=100+ jump is uncopiable from Renaissance Research's stack (they were on Gemini, not K2-on-Cerebras).
2. **Substitute brain-region activations as one of the "perspectives."** TRIBE V2 as a *non-LLM voice in the polyphony* is structurally different from "three LLMs disagree."
3. **Apply to video / spatial reasoning, not text / papers.** Different input modality breaks the visual lookalike.

## Open questions

- What's the actual prompt template structure of the optimist/skeptic/synthesizer triad? (Repo inspection would resolve.)
- What's their token-cost budget per query? (Tells us whether N=3 was a budget choice or a model-quality choice.)
- Did they have a "Mediator" agent equivalent (per decision 007), or did the synthesizer step subsume it?
- How did they prevent the synthesizer from collapsing into the corpus mean (T1 tension — picking the trends-slop word as the un-trends-slop framing)?

## Open tensions (per Socratic protocol — held, not resolved)

- The team's anchor decisions lean on the same architecture that already won this prize — the question of whether to differentiate by *count* (N=100+ vs N=3), *modality* (TRIBE as a non-LLM voice), or *domain* (video vs text) is **Johnny's call**. Each open path has different implications for sponsor stacking, demo theatre, and the wow-toggle. The consolidation pass surfaces all three; resolution stays open.

## Cross-links

- `caltech/ideation/02-winner-cross-comparison.md` lines 97–113 — full ideation entry.
- `caltech/ideation/02-winner-cross-comparison.md` lines 380–384 — "Top 3 winners we should study most carefully" footer entry.
- `decisions/007-agent-swarms-as-coordination-pattern.md` — our locked anchor that is structurally close.
- `decisions/008-k2-think-as-speed-engine.md` — speed differentiator path.
- `patterns/per-item-parallel-llm-evaluation.md` — primitive of the same shape.
- `patterns/witnessed-dissent.md` — the agent-disagreement pattern (new file added in this consolidation pass).
- `projects/memento.md` — sibling lookalike (different vertical, same hackathon).
- `projects/greenchain.md` — closest existing wiki entry that uses the K2 + multi-LLM swarm shape we're considering.
