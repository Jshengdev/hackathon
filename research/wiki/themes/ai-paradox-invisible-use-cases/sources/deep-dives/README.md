---
file-type: source
status: verified
last-verified: 2026-04-25
supports-decisions: []
cites-sources: []
cross-links:
  - ../README.md
  - ../../../../index.md
---

# `themes/<slug>/sources/deep-dives/` — primary-source canonical references

Long-form, primary-source-verified reference pages for individual entities (TRIBE v2, demo-theatre, etc.). When a YouTube-transcript source contradicts the actual paper / repo / blog, the deep-dive here is **authoritative** and explicitly flags the contradiction with `[contradiction noted; primary source wins]` markers.

## Naming + schema

- `<topic>-canonical-reference.md` — explicit "this is the verified version."
- `file-type: source` (still source-shape) in frontmatter.
- `status: verified` — primary-source-confirmed.
- Required sections (heavier than regular sources): 30-second answer · canonical references list (with access tier) · what-it-actually-does (verified, not the YouTuber) · capabilities-matrix (in-scope / out-of-scope) · integration paths · license + privacy + regulatory · risks + failure modes · how-it-connects-to-the-theme · open questions · verbatim quote vault.

## When to read

- Need primary-source-verified facts on a load-bearing entity → start here, NOT the regular source files
- Integration template for a tool that has a deep-dive → here (until promoted to `tools/`)
- License / regulatory check on a tool → here

## When to write

- A topic gets a deep-dive when (a) regular sources contradict each other on load-bearing facts, OR (b) the team is committing architecturally to the entity and needs the integration template + risk analysis.

## Index

| File | One-line | Supersedes |
|---|---|---|
| `tribe-v2-canonical-reference.md` | TRIBE v2 verified facts (~20K vertices, ~25 training subjects, CC BY-NC) | `../../window-2-research-deepening/sources/006-tribe-v2-meta-trimodal-brain-encoder.md` on the 3 load-bearing facts |
| `emotional-depth-demo-theatre-canonical.md` | 8-emotion taxonomy + 16-mechanic catalog + 90-second demo template | (no prior; new entity-shape) |

## Open gap

`tribe-v2-canonical-reference.md` is structurally an **entity / tool** doc more than a source doc — when `concepts/` and `entities/` directories get added per the redesign blueprint, mirror-promote it. Same for the emotional-depth doc (it's framework-shape, not source-shape).
