---
file-type: decision
status: verified
last-verified: 2026-04-25
supports-decisions: []
cites-sources:
  - research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/400-prd-scaffold.md
  - research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/emotional-depth-demo-theatre-canonical.md
  - .claude/skills/ship-velocity/SKILL.md
cross-links:
  - 003-team-role-lanes-locked.md
  - 005-best-use-of-ai-as-hard-target.md
---

# 011 — Demo over execution (packaging > engineering depth)

## Decision

The hackathon's Pareto principle: **80% of judging weight is on the demo moment.** Per Johnny's directive, *"execution doesn't matter as much as the visualization of all the things that are happening and the result of that."* Every architectural choice is scored against: does this make the demo-day human-in-front-of-us **feel** the thing?

## Date locked

2026-04-25 (parked PRD scaffold, design principle that overrides everything else).

## Locked by

Johnny (verbatim, parked PRD line 18):
> "Execution doesn't matter as much as the visualization of all the things that are happening and the result of that." [source: `research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/400-prd-scaffold.md` line 18]

## Why

- HackTech 2026 Round 1 = 5 minutes; Round 2 = 3 minutes. Judges remember **how they felt**, not what was built [source: `.claude/skills/ship-velocity/SKILL.md` principle 9].
- Emotional taxonomy (per `emotional-depth-demo-theatre-canonical.md` §2): a hackathon demo lands when it lets the judge *feel something specific* in a moment they did not see coming — held breath, leaned-forward laugh, quiet "oh." Eight emotions worth engineering for: awe, surprise, recognition, hope, anger, comfort/safety, pride, disgust.
- 4-act demo arc (Hook / Body / Surprise / Land) — every winning HackTech-class teardown follows it [source: `400-prd-scaffold.md` §4].
- The team's locked role lane already foregrounds packaging: Emilie owns Devpost + launch video + design system + demo; quality bar = "passes the startup test" (decision 003).

## What this opens

- Every feature gets a "feeling tag" (aha, trust, fear, delight, relief, recognition, surprise, awe, pride, comfort) — features without one get cut [source: `/ship-velocity` quick-fire check 6].
- Emilie's deliverables run in parallel from Friday wireframes → Saturday afternoon polish.
- Backup loop pre-recorded for any wow-object beat (Norman visceral level / wow-object failure mode in `emotional-depth-demo-theatre-canonical.md` §3.3).

## What this closes

- "Technically interesting" features with no felt outcome get cut.
- Sub-second-latency UX claims that Tribe V2's seconds-scale latency cannot deliver (T7 tension).
- Architecture decisions that deepen engineering at the expense of judge-legibility.

## Reversibility

Not reversible — this is the design-principle root of the rest of the build's value calculus.

## Trace

- `research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/400-prd-scaffold.md` line 18 — principle statement.
- `research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/emotional-depth-demo-theatre-canonical.md` — full emotion taxonomy + mechanics catalog + 90-second demo template.
- `.claude/skills/ship-velocity/SKILL.md` principles 7, 9, 10 — UX polish last; demo discipline; submit on time.
