---
file-type: scrape
status: verified
last-verified: 2026-04-25
supports-decisions: []
cites-sources: []
cross-links:
  - ../index.md
  - ../README.md
  - ../projects/README.md
---

# `scrapes/` — agent-produced gallery scrapes

Each `<event-name>-winners.md` is a structured table of every winner from a hackathon gallery, **GH-URL-first** (per Johnny's directive: *"Devpost prose is the pitch; the repo is the truth; the gold is in the gap between them"*). Scrapes are the discovery surface; the per-project teardowns in `projects/` are the depth dive into the highest-relevance picks.

## Naming + schema

- `<event-name>-winners.md` — lowercase-hyphenated event name + year (e.g. `treehacks-2026-winners.md`).
- `file-type: scrape` in frontmatter.
- Required: full winners table (project · pitch · industry · stack · prize · GH URL · repo-availability flag), industry breakdown, architectural-pattern overlap with our direction, top-N picks for code teardown, sources list.

## When to read

- "Which past winners line up with our direction?" → architectural-overlap section
- "What did winners in industry X build?" → industry breakdown
- "Which repos should we clone first?" → top-N picks

## When to write

- Dispatch a scrape agent for any hackathon event whose winners are relevant prior art for our build.
- Don't pre-filter while scraping — capture the full winner list with GH URLs, then mark architectural-overlap for our direction in a separate section.

## Index

See [Scrapes section of `index.md`](../index.md#scrapes--agent-produced-gallery-scrapes). Currently 1: `treehacks-2026-winners.md` (64 winners, 60 with public repos, 6 of which are now in flight for code-teardown).
