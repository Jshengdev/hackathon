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

## Open gap (deferred)

The TreeHacks 2026 top-6 teardowns (Mira, Tribune, ContainOS, Keryx, Orchestration Co. of Palo Alto, 4sight) are **TODO**. A background agent attempted them but stalled (three long-running subagent stalls tonight — system pattern). Pre-loaded picks + GH URLs + rationale at [`../scrapes/treehacks-2026-winners.md`](../scrapes/treehacks-2026-winners.md) §"Top 10 to clone-and-read." Dispatch one-repo-per-agent in a fresh window for better throughput.
