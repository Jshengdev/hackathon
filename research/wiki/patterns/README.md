---
file-type: pattern
status: verified
last-verified: 2026-04-25
supports-decisions: []
cites-sources: []
cross-links:
  - ../index.md
  - ../README.md
  - ../projects/README.md
---

# `patterns/` — cross-project architectural primitives

Each `<slug>.md` is a reusable architectural pattern extracted from ≥ 1 project teardown (almost always ≥ 2). Patterns describe HOW; projects show WHERE the pattern shipped. The pattern files cite the projects, not the other way around.

## Naming + schema

- `<slug>.md` — lowercase-hyphenated, names the pattern (e.g. `two-stage-llm-compile.md`, `witnessed-dissent.md`).
- `file-type: pattern` in frontmatter.
- Required sections per the per-pattern template in [`../README.md`](../README.md): one-line summary · when-to-reach-for-it · why-it-works · real-code citations · gotchas / failure modes.
- Consolidation extras: theme alignment + anti-theme alignment sections per the protocol.

## When to read

- "How do we build X?" → pattern catalog by capability
- "Why does this design work?" → why-it-works section per pattern
- "What goes wrong with this pattern?" → gotchas section
- "Theme-fit check" → theme/anti-theme alignment sections

## When to write

- A pattern lives here when **≥ 2 projects** in `projects/` exemplify it. Single-instance "patterns" stay as inline notes in the project file until a second instance lands.
- Update existing patterns rather than creating duplicates — a new project usually extends a known pattern more than it invents a new one.

## Index

See [Patterns section of `index.md`](../index.md#patterns--cross-project-architectural-primitives). Current 7: two-stage-llm-compile, robust-json-from-llms, per-item-parallel-llm-evaluation, localize-and-zoom, spatial-sidecar, grounded-citation, witnessed-dissent.
