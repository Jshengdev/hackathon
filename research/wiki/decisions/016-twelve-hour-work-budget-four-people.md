---
file-type: decision
status: verified
last-verified: 2026-04-25
supports-decisions:
  - 003-team-role-lanes-locked.md
  - 012-feature-freeze-saturday-8pm.md
cites-sources:
  - caltech/context/track-strategy.md
  - caltech/context/constraints.md
  - caltech/context/event.md
cross-links:
  - 003-team-role-lanes-locked.md
  - 012-feature-freeze-saturday-8pm.md
---

# 016 — 12-hour work budget × 4 people

## Decision

**Total work budget = ~12 hours of actual build time × 4 people = ~48 person-hours.** Each PRD-split task should fit into a ~3–4 person-hour bucket. This is "actual build hours" — separate from the ~36hr nominal hackathon window.

## Date locked

2026-04-24 (late Friday team lock-in).

## Locked by

Johnny — direct verbal lock-in.

## Why

The ~36-hour HackTech window minus mandatory time sinks:
- Sleep / food / showers / breakfast etc. (~12h)
- Friday IFM workshop (~1.5h)
- Saturday Listen Labs talk (1h, mandatory if going for them)
- Saturday YC talk + 1-on-1 (~1.5h, mandatory if going for them)
- Saturday Ironside fireside (1h, mandatory)
- Sunday 9 AM hard stop + 1+ hour demo setup before Round 1

Realistic build = 22–24 hours; with 4 people split across 3 lanes (decision 003), individually each person has ~6 hours of focused build per teammate. Multiplied by 4 = ~24 hours of "I'm at my keyboard building" time. The "12 hours" is the team-coordinated, integration-friendly window — the rest is solo-grind time outside coordination.

[sources: `caltech/context/event.md` lines 13–46 + `caltech/context/constraints.md` lines 1–22 + `caltech/context/track-strategy.md` lines 64–67]

## What this opens

- PRD slicer has a clean budget per task (~3–4 person-hours).
- `/ship-velocity` parallelization (principle 4) is mandatory — pair-programming only at integration.
- Triage tool: any feature scoped >4 person-hours either gets cut or split.

## What this closes

- Single-person-owns-everything workloads — they don't fit the budget.
- Solo-hero anti-pattern (`/ship-velocity` table: "I'll just do all the backend tonight" → "Lane it. Single-points-of-failure die.")
- Architecture decisions whose implementation cost dwarfs the budget — they're vetoed at PRD time.

## Reversibility

Budget is a mathematical floor; non-reversible without reducing the number of mandatory time-sinks (which are fixed by the hackathon schedule).

## Trace

- `caltech/context/track-strategy.md` lines 64–67 — 12hr × 4-people work budget statement.
- `caltech/context/constraints.md` lines 12–17 — work-budget detail + per-task bucketing.
- `caltech/context/event.md` lines 13–46 — full schedule + mandatory time-sinks.
