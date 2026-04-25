---
file-type: project
status: verified
last-verified: 2026-04-25
supports-decisions: []
cites-sources: []
cross-links:
  - ../index.md
  - ../README.md
  - ../scrapes/treehacks-2026-winners.md
---

# `projects/` — per-project teardowns

Canonical deep-dive per past hackathon project relevant to our HackTech 2026 entry. Each `<slug>.md` is the source-of-truth for what that team built, how it actually works (per the repo, not just the Devpost prose), what the unique sauce was, what's reusable for us, and — for past winners — the lookalike-risk score against our direction.

## Naming + schema

- `<slug>.md` — lowercase-hyphenated slug from the project's actual name. No date prefix.
- `file-type: project` in frontmatter.
- `status:` — `verified` if the repo was cloned and read; `partial` if some claims unverified; `aspirational` if no repo / Devpost-prose-only.
- Required sections per the per-project template in [`../README.md`](../README.md): pitch · claimed-vs-verified table · unique sauce · implementation needles · capability stack · why-it-won · reusable-for-us · cross-links.
- For HackTech 2026 lookalike-risk teardowns, two extra fields per the protocol: lookalike-risk score (🟢 / 🟡 / 🔴) + what-this-project's-existence-forecloses for our project.

## When to read

- "Has someone done this shape before?" → search this folder by capability stack
- "What's the lookalike risk for our angle?" → 🔴 entries first
- "What real-code patterns can we lift?" → implementation-needles section per file

## When to write

- A new project gets a teardown here when (a) Johnny pastes Devpost text + GH URL, OR (b) a scrape surfaces a high-relevance lookalike. The repo MUST be cloned and read before writing — verify Devpost prose against actual code.
- Cloned repos go to `research/sponsors/<sponsor>/clones/` (gitignored) or `research/sources/repos/` (gitignored, planned).

## Index

See the [Projects section of `index.md`](../index.md#projects--per-project-teardowns) for the live list with one-line descriptions and verified-status.

## Coverage status — TreeHacks 2026 top-6 teardowns landed 2026-04-25

After a single mega-agent attempt stalled on laptop sleep, the 6 highest-relevance TreeHacks 2026 winners were teardown'd via parallel one-repo-per-agent dispatches:

- [`mira.md`](mira.md) — 🔴 HIGH lookalike — 6 Devpost claims unimplemented
- [`tribune.md`](tribune.md) — 🟠 8/10 — civic-tech + voice + cited-diff locked from us; audio-clip citations unimplemented
- [`containos.md`](containos.md) — 🟡 6/10 — claimed multi-LLM ensemble; Claude SDK mocked
- [`keryx.md`](keryx.md) — 🟡 — Depth Pro shipped but never called by agent path
- [`orchestration-co-of-palo-alto.md`](orchestration-co-of-palo-alto.md) — 🔴 HIGH — closest witnessed-dissent UI precedent (with Vercel-preview as external referent)
- [`4sight.md`](4sight.md) — 🔴 HIGH — not actually an agent loop (1-min Worker cron over SQL)

The remaining ~54 winners with public repos are pre-prioritized in [`../scrapes/treehacks-2026-winners.md`](../scrapes/treehacks-2026-winners.md) §"Top 10 to clone-and-read" — clone on demand if needed.
