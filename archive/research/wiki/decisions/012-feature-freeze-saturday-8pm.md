---
file-type: decision
status: verified
last-verified: 2026-04-25
supports-decisions:
  - 011-demo-over-execution.md
  - 016-twelve-hour-work-budget-four-people.md
cites-sources:
  - .claude/skills/ship-velocity/SKILL.md
  - caltech/context/event.md
  - caltech/context/constraints.md
cross-links:
  - 016-twelve-hour-work-budget-four-people.md
  - 011-demo-over-execution.md
---

# 012 — Feature freeze Saturday 8 PM PDT

## Decision

**Feature freeze: Saturday 2026-04-25 8:00 PM PDT.** **Submit: Saturday 11:00 PM PDT.** That gives 10 hours of buffer before the hard 9:00 AM Sunday Devpost deadline.

After 8 PM Saturday: only bug fixes, demo recording, Devpost writeup, slide polish. **No new features.** Anyone caught building a new feature after 8 PM Saturday gets pulled to demo prep.

## Date locked

2026-04-25 (`/ship-velocity` skill principle 10, mandated for the team).

## Locked by

`/ship-velocity` skill (principle 10 — adapted from the solo-dev Yelp-AI walkthrough).

## Why

- Devpost submission is a **hard 9:00 AM Sunday** deadline — no exceptions [source: `caltech/context/event.md` line 17].
- Round 1 judging starts 10:00 AM Sunday (Bechtel) — needs ~1 hour to set up the demo.
- The solo-dev source for `/ship-velocity` lost a hackathon by submitting late even with imperfect work — *"submitted before deadline even when imperfect"* is the principle [source: `/ship-velocity` principle 10].
- Sleep + breakfast + judging-prep buffer = 10 hours minimum. Anything less risks shipping a broken Devpost.

## What this opens

- Predictable handoff window: 8 PM Saturday → 11 PM Saturday is "polish only."
- Emilie's launch video, Devpost writeup, design polish all have a guaranteed window.
- Backup demo recording happens Saturday night, not panic-mode Sunday morning.

## What this closes

- Mid-demo-prep "let me also add..." scope creep — anti-pattern caught by `/ship-velocity` [source: principle 10 anti-pattern table].
- New-feature work in the 13 hours before the deadline.
- The team optimizing for "build everything" at the expense of "ship something."

## Reversibility

Reversible only by the team explicitly + collectively, with full awareness that it shortens the buffer to <10 hours.

## Trace

- `.claude/skills/ship-velocity/SKILL.md` principle 10 + quick-fire check 8 (schedule check).
- `caltech/context/event.md` lines 17–18 — Devpost deadline + hacking window.
- `caltech/context/constraints.md` lines 5–8 — hard time constraints.
