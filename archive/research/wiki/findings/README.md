---
file-type: finding
status: verified
last-verified: 2026-04-25
supports-decisions: []
cites-sources: []
cross-links:
  - ../index.md
  - ../README.md
---

# `findings/` — query-time synthesis + lint outputs + verification

Two kinds of files live here:

1. **Query-time synthesis** — when a query against the wiki produces novel synthesis worth keeping, file it as `<topic>.md`. Per Karpathy: *"Good answers can be filed back into the wiki as new pages. A comparison you asked for, an analysis, a connection you discovered — these are valuable and shouldn't disappear into chat history."*

2. **Lint + verification outputs** — periodic health-check passes and reading-order verifications. Named with date: `lint-YYYY-MM-DD.md`, `qa-YYYY-MM-DD-<topic>.md`, `verification-<topic>.md`.

## Naming + schema

- `<topic>.md` — for query-synthesis findings.
- `lint-YYYY-MM-DD.md` — for periodic lint passes.
- `qa-YYYY-MM-DD-<topic>.md` — for quality-assurance passes.
- `<verb>-<noun>.md` — for verification artifacts (e.g. `prd-builder-reading-order-verification.md`).
- `file-type: finding` in frontmatter.
- `status: verified` once written; lint/QA findings should also note overall wiki health verdict.

## When to read

- "What did the last lint pass surface?" → `lint-*` file
- "Is the wiki PRD-buildable?" → `prd-builder-reading-order-verification.md` + `qa-*-research-completeness.md`
- "What synthesis came out of past queries?" → topic-named files

## When to write

- After a query produces synthesis worth keeping (don't let it disappear to chat).
- After a periodic lint pass (cadence: every major ingestion wave or before a PRD pass).
- After any verification step against a stated quality gate.

## Lint / QA cadence

- Run a lint pass after every Claude session that touched ≥ 3 wiki files.
- Run a QA pass before generating any pitch or PRD revision.
- Run a verification pass before merging a worktree branch into main.

## Index

See [Findings section of `index.md`](../index.md#findings--query-time-synthesis--lint-outputs). Current 5: `lint-2026-04-25.md`, `prd-builder-reading-order-verification.md`, `qa-2026-04-25-research-completeness.md`, `2026-04-25-ironside-report-card-person-a.md`, `2026-04-25-ironside-report-card-person-b.md`.
