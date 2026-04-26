---
file-type: stack
status: verified
last-verified: 2026-04-25
supports-decisions: []
cites-sources: []
cross-links:
  - ../index.md
  - ../README.md
---

# `stacks/` — recurring full-stack combos that ship in 24-36h

Each `<slug>.md` is an end-to-end tech-stack combo verified across ≥ 2 hackathon-winning projects. Stack files are PRD-builder shortcuts: "we want a real-time agent UI with grounded citations and voice + spatial — what's the minimum viable stack that's been ship-tested?"

## Naming + schema

- `<slug>.md` — lowercase-hyphenated stack name (e.g. `agent-swarm-ml-viz.md`).
- `file-type: stack` in frontmatter.
- Required sections: combo recipe · which projects ship this combo · why it ships in 24-36h · failure modes when stacking these specific tools · cost / latency budget.

## When to read

- "We want to ship X capabilities — what's the proven combo?"
- "Which 5 tools snap together cleanest for a hackathon timeline?"

## When to write

- A stack gets a file here when ≥ 2 projects in `projects/` use the same combo AND it's a candidate for our build.
- Single-project combos stay as inline notes in the project file.

## Status

**Currently empty.** Reserve for combos that emerge from the TreeHacks 2026 top-6 teardowns (in flight) — likely candidates: Claude Agent SDK + Modal sandboxes + Browserbase Stagehand combo (used by 5+ TreeHacks winners per scrape).

## Index

See [Stacks section of `index.md`](../index.md#stacks--recurring-full-stack-combos).
