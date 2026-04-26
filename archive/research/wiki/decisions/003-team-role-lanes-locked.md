---
file-type: decision
status: verified
last-verified: 2026-04-25
supports-decisions: []
cites-sources:
  - caltech/context/team.md
  - caltech/context/team/johnny.md
  - caltech/context/team/junsoo.md
  - caltech/context/team/jacob.md
  - caltech/context/team/emilie.md
cross-links:
  - 011-demo-over-execution.md
  - 016-twelve-hour-work-budget-four-people.md
---

# 003 — Team role lanes locked

## Decision

Three lanes, four people:
- **Johnny** — difficult implementation + innovative ideas (the *hard* and *novel* pieces).
- **Jacob + Junsoo** — execution + agentic orchestration (the swarm / agent plumbing); both can self-route within this lane.
- **Emilie** — entire packaging process (Devpost, design guidelines + color palette, launch video, all polish/story/visual sauce).

## Date locked

2026-04-25.

## Locked by

Johnny (verbatim):
> "Three of us are technical and when it comes to difficult implementation and specific innovative ideas, leave them to Johnny. When it comes to execution to get something to work, leave that up to Jacob and Junsoo who are well-versed in agentic orchestration and up to their skill sets. And for Emilie, help her do the entire packaging process." [source: `caltech/context/team.md` lines 19–22]

## Why

Lane fit per individual profile:
- **Johnny** has hands-on TRIBE V2 experience (Synthetic Synesthesia + DMN floor-and-bounce experiments), runs the BMAD orchestrator suite, owns context-engineering pipelines [source: `caltech/context/team/johnny-public-corpus.md`].
- **Jacob** explicit anti-prefs: ❌ frontend, ❌ model/research lead, ❌ pitcher. Wants agent orchestration / infrastructure / systems / backend — proven on Nucleus (Fetch.AI uAgents) [source: `caltech/context/team/jacob.md` lines 36–53].
- **Junsoo** has direct egocentric-video → VLM supervision pipeline experience + LLM↔PDDL bridge work + KG-grounded LLM reasoning. Anti-pref: ❌ "build another LangChain agent" — frame swarm work as orchestration challenge, not LLM-wrapper work [source: `caltech/context/team/junsoo.md` lines 100–108].
- **Emilie** is designer/founder/storyteller, NOT engineer. Owns Devpost, design system, launch video, brand. Quality bar: must "pass the startup test" — look fundable, not hackathon-y [source: `caltech/context/team/emilie.md` lines 128–142].

## What this opens

- PRD splitter has a clear three-lane structure to bucket tasks.
- Demo packaging starts in parallel with build (Emilie can wireframe Friday, polish Saturday — `/ship-velocity` principle 7).
- Innovation tasks → Johnny lane; implementation → Jacob+Junsoo lane; packaging → Emilie lane.

## What this closes

- Splitting Emilie across both packaging AND ML pipeline work — she's not autonomous on AI APIs; she needs support there.
- Putting Jacob on frontend or pitching despite his hackathon-win track record — he's actively trying to leave that lane.
- Routing PDDL/classical-planner work to Junsoo as the project ceiling — that's his target deepening direction *separately*; not the hackathon project's job.

## Reversibility

Re-routable mid-build only if a teammate hits an unforeseen hard block (illness, family emergency). Otherwise fixed for the weekend; respected at PRD-split time.

## Trace

- `caltech/context/team.md` lines 17–53 — locked role assignments + per-lane mandates.
- Individual profile files in `caltech/context/team/*.md` for each teammate's anti-prefs + skill inventory.
- `/ship-velocity` skill principle 4 (parallel lanes) — each person gets a dedicated AI coding session, no shared Cursor windows.
