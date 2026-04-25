---
name: llm-wiki-navigator
description: 'Navigate and operate the Karpathy-LLM-wiki-shaped research base at research/wiki/ for Caltech HackTech 2026. Use whenever asked to: query the wiki, bootstrap a fresh Claude session, build a PRFAQ or PRD off the research, ingest a new source, run a lint pass, look up a term in vocabulary, find what is locked vs open, or understand the Socratic interaction protocol that binds idea-naming to Johnny. Invoke before any "what does the wiki say about X?" / "is this decided?" / "what term means Y?" / "where do I file this source?" / "what are the open tensions?" question.'
---

# LLM Wiki Navigator

## 30-second orientation

`research/wiki/` is a **Karpathy LLM Wiki** ([decision 014](../../../research/wiki/decisions/014-karpathy-llm-wiki-pattern-adopted.md)). Three layers, three operations, one protocol.

- **Three layers.** Raw sources (immutable, LLM reads only) → wiki (LLM writes; human reads) → schema (this file + protocol doc; co-evolved).
- **Three operations.** `ingest` (new source → write summary + update affected pages + log) · `query` (read index → drill in → cite) · `lint` (find contradictions / orphans / stale claims / missing concepts / broken links / data gaps).
- **One protocol — Socratic.** Under the active theme, **Claude reflects, never proposes the project idea.** Verbatim from Johnny 2026-04-25:

> *"You cannot tell me what the idea is. I have to tell you what the idea is and you have to just repeat it back to me. But you can help guide me getting closer and closer and closer to what exactly I'm trying to get about."*

The Socratic protocol binds: hypothesis-naming, hook, demo, product surface, idea ranking. It does NOT bind: wiki structure, lint, navigator-skill maintenance, sponsor research, source ingestion mechanics.

## The reading order (≤ 10 files for cold-start bootstrap)

A fresh Claude session reading these in order has every PRFAQ-ready bootstrap context. From `caltech/CONSOLIDATION-REPORT.md`:

1. [`research/wiki/themes/ai-paradox-invisible-use-cases/README.md`](../../../research/wiki/themes/ai-paradox-invisible-use-cases/README.md) — theme lock + Socratic protocol + theme-vs-hypothesis split
2. [`research/wiki/themes/ai-paradox-invisible-use-cases/vocabulary.md`](../../../research/wiki/themes/ai-paradox-invisible-use-cases/vocabulary.md) — ~120 terms in 6 buckets (failure-mode / architectural-fix / augmentation-and-mind / LLM-wiki-process / demo-and-pitch / persona-and-process)
3. [`research/wiki/decisions/README.md`](../../../research/wiki/decisions/README.md) — table of all 16 locked decisions with one-line each
4. [`research/wiki/decisions/006-tribe-v2-as-special-mode.md`](../../../research/wiki/decisions/006-tribe-v2-as-special-mode.md) + [`007-agent-swarms-as-coordination-pattern.md`](../../../research/wiki/decisions/007-agent-swarms-as-coordination-pattern.md) — bonded pair (the two architectural anchors)
5. [`research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/tribe-v2-canonical-reference.md`](../../../research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/tribe-v2-canonical-reference.md) — primary-source TRIBE v2 facts (CORRECTS three claims in source 006)
6. [`research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/emotional-depth-demo-theatre-canonical.md`](../../../research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/emotional-depth-demo-theatre-canonical.md) — 8-emotion taxonomy + 16-mechanic catalog + 90-second demo template
7. [`research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/500-elicitation-qa-pass.md`](../../../research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/500-elicitation-qa-pass.md) — Socratic / Red Team / Pre-Mortem / First-Principles attacks on the theme; **T1 lives here**
8. [`research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/501-party-mode-roundtable.md`](../../../research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/501-party-mode-roundtable.md) — 6-persona roundtable with 23 open questions; **T2 lives here**
9. [`research/wiki/projects/renaissance-research.md`](../../../research/wiki/projects/renaissance-research.md) — 🔴 HIGH lookalike risk teardown (HackTech 2025 winner with overlapping shape)
10. [`caltech/CONSOLIDATION-REPORT.md`](../../../caltech/CONSOLIDATION-REPORT.md) — what was ingested, what was intentionally dropped, gaps remaining

If you've read these 10, you have the bootstrap context. Anything else is on-demand.

## Folder taxonomy — what lives where

| Path | Purpose | Naming | Frontmatter `file-type` | Read when | Write when |
|---|---|---|---|---|---|
| `research/wiki/README.md` | Top-level wiki index | — | (no FM) | First, always | Only when adding/removing a top-level section |
| `research/wiki/decisions/` | Numbered append-only decision log; the **spine** | `NNN-<slug>.md` | `decision` | "Is X locked?" | New decision locked by Johnny + verifiable trace |
| `research/wiki/themes/<slug>/` | Directional anchors | `README.md` per theme | `theme` | Cold start; framing question | Theme shifts (rare); add new theme only with explicit Johnny go |
| `research/wiki/themes/<slug>/live-thread.md` | SOTARE-style append-only directional changelog | one file per theme | `theme` | "What changed in framing today?" | Significant ingestion / direction shift |
| `research/wiki/themes/<slug>/vocabulary.md` | Term lookup table | one file per theme | `vocabulary` | "What does Johnny mean by X?" | New term coined or imported |
| `research/wiki/themes/<slug>/sources/` | Per-source pages (verbatim + extracts + how-it-maps + open questions) | `NNN-<slug>.md` | `source` | Need ground truth / quote | New source dropped |
| `research/wiki/themes/<slug>/sources/deep-dives/` | Canonical reference pages (primary-source verified) | `<topic>-canonical-reference.md` | `source` (status: `verified`) | Need precise capability / fact | Original sources contradict each other → arbitrate from primary |
| `research/wiki/projects/` | Per-project teardowns of past hackathon winners | `<slug>.md` | `project` | "Has someone done this before?" / lookalike-risk check | New project worth dissecting |
| `research/wiki/patterns/` | Cross-project architectural primitives | `<slug>.md` | `pattern` | "How do we build X?" | New pattern ≥ 2 projects exemplify |
| `research/wiki/tools/` | Per-tool API / integration / gotchas | `<slug>.md` | `tool` | Tool selection / debug | New sponsor tool / API integration |
| `research/wiki/stacks/` | Recurring full-stack combos that ship in 24-36h | `<slug>.md` | `stack` | Tech-stack picking | New combo emerges from ≥ 2 wins |
| `research/wiki/scrapes/` | Agent-produced gallery scrapes (TreeHacks, etc.) | `<event>-winners.md` | `scrape` | Gallery survey | New event scraped |
| `research/wiki/findings/` | Synthesized insights crossing 2+ sources; lint outputs | `<topic>.md` or `lint-YYYY-MM-DD.md` | `finding` | Need cross-cutting answer | Query-time synthesis worth keeping; lint pass output |

## Standard frontmatter (every wiki file)

```yaml
---
file-type: <theme | source | project | pattern | stack | tool | scrape | decision | vocabulary | finding>
status: <verified | partial | aspirational | in-progress>
last-verified: <YYYY-MM-DD>
supports-decisions: [list of decisions/NNN-*.md]
cites-sources: [list of source paths]
cross-links: [list of related wiki paths]
---
```

If a section can't be filled honestly, write `unknown`. Never fabricate.

## How to query

5-step loop:

1. **Read `research/wiki/README.md` first.** It's the front door; lists everything.
2. **Drill via the right folder.** "Locked?" → `decisions/`. "Term?" → `vocabulary.md`. "Direction?" → theme `README.md`. "Past winner?" → `projects/`. "Architecture primitive?" → `patterns/`. "Tool?" → `tools/`.
3. **Follow `cross-links` and `cites-sources`** from the file you land on. The graph IS the answer; one file rarely suffices.
4. **Cite specifically.** Every claim cites a wiki path or source URL. Never bare assertions.
5. **File novel synthesis as `findings/<topic>.md`.** Don't lose query insights to chat history.

## How to ingest a new source

7-step flow per Karpathy:

1. Drop raw source into `themes/<slug>/sources/NNN-<slug>.md` with full frontmatter, key-extracts header, "how it maps to theme," and full verbatim content.
2. Discuss takeaways with Johnny. **Under Socratic theme: surface, don't propose.**
3. Update `themes/<slug>/vocabulary.md` if new terms appeared.
4. Update or create relevant `concepts/`, `entities/`, `findings/` pages (note: `concepts/` and `entities/` directories not yet created — see `research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/300-wiki-redesign-blueprint.md` for the planned expansion if/when authorized).
5. **Flag contradictions explicitly** — write a "tension" entry. Do NOT average.
6. Append to `themes/<slug>/live-thread.md` IF the source meaningfully shifts framing/hypothesis/direction.
7. Update `wiki/README.md` index for new pages.

## How to lint

Periodic health-check pass. 7 checks:

1. Contradictions across pages (e.g. T1, T2 below)
2. Stale claims newer sources superseded (e.g. source 006 TRIBE v2 voxel/subject counts → corrected by `tribe-v2-canonical-reference.md`)
3. Orphan pages (no inbound links from README, vocabulary, decisions)
4. Concepts mentioned but lacking their own page
5. Broken cross-references (every markdown link walked)
6. Data gaps (claims without sources)
7. Suggested next questions / sources

Output: `wiki/findings/lint-YYYY-MM-DD.md`.

## The two open tensions Johnny needs to know about

These are HELD per Socratic protocol — not resolved. The PRD-builder must see them at the top of its reading.

- **T1.** *"Augmented human intelligence"* — the hypothesis-frame Johnny adopted — is the **exact word** source 003 (trends slop) names as one of the four corpus-mean defaults every model reaches for ("they always preferred differentiation, collaboration, long-term thinking, and **augmentation**"). The theme's banner is mean-regressed. **No counter exists in current material.** Lives in `window-2-research-deepening/500-elicitation-qa-pass.md` "Open tensions" §.
- **T2.** The Actor / Auditor / Mediator triad has **no external, non-platform-derived referent** for the auditor. Without one, the un-black-boxing architecture is **structurally indistinguishable from Filter World with extra steps**. Cultural critic conceded this in the cross-persona exchange. Lives in `window-2-research-deepening/501-party-mode-roundtable.md` §8.

The PRD-builder cannot resolve these. Johnny names the resolution (or accepts the tension).

## Decisions snapshot (16 locked, see `decisions/README.md` for the full table)

001 tech-first stack · 002 track commitments (3 sponsored CORE: K2 / Ironside / Listen Labs + 2 main: Best AI / Creativity; Palohouse dropped) · 003 team lanes (Johnny=hard innovation; Jacob+Junsoo=execution+agentic; Emilie=packaging) · 004 Socratic protocol installed · 005 Best Use of AI as hard target · **006 TRIBE v2 as special mode (anchor #1)** · **007 agent swarms as coordination (anchor #2)** · 008 K2 = speed engine ~1,300 tok/s for swarm fan-out (NOT smart reasoning) · 009 Ironside pipeline mirror (Auto-Classifier → Narration → Observer-as-Judge) · 010 B2C-primary + B2B-overlay positioning · 011 demo-over-execution · 012 feature-freeze Saturday 8 PM PDT · 013 PRD built in different Claude instance · 014 Karpathy LLM Wiki pattern adopted · 015 Palohouse dropped · 016 12hr × 4 people = ~48 person-hours total budget.

## Quick-reference cheatsheet

| I want to know | Start here |
|---|---|
| What's locked? | [`decisions/README.md`](../../../research/wiki/decisions/README.md) |
| What does TRIBE v2 actually do (corrected facts)? | [`themes/ai-paradox-invisible-use-cases/sources/deep-dives/tribe-v2-canonical-reference.md`](../../../research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/tribe-v2-canonical-reference.md) |
| What term does Johnny mean by "augmented intelligence" / "trends slop" / "un-black-box"? | [`themes/ai-paradox-invisible-use-cases/vocabulary.md`](../../../research/wiki/themes/ai-paradox-invisible-use-cases/vocabulary.md) |
| Are we leaning toward a known winner shape? | [`projects/renaissance-research.md`](../../../research/wiki/projects/renaissance-research.md), [`projects/memento.md`](../../../research/wiki/projects/memento.md) (both 🔴 HIGH lookalike risk) |
| What demo mechanic triggers awe / surprise / recognition / comfort? | [`themes/ai-paradox-invisible-use-cases/sources/deep-dives/emotional-depth-demo-theatre-canonical.md`](../../../research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/emotional-depth-demo-theatre-canonical.md) §2–3 |
| What's the shape of a witnessed-dissent UI? | [`patterns/witnessed-dissent.md`](../../../research/wiki/patterns/witnessed-dissent.md) |
| How do we get parse-safe JSON from K2? | [`patterns/robust-json-from-llms.md`](../../../research/wiki/patterns/robust-json-from-llms.md) |
| How do we fan-out per-item LLM calls cheaply? | [`patterns/per-item-parallel-llm-evaluation.md`](../../../research/wiki/patterns/per-item-parallel-llm-evaluation.md) |
| What's the K2 Think API surface + gotchas? | [`tools/k2-think.md`](../../../research/wiki/tools/k2-think.md) |
| Has anything shifted in framing today? | [`themes/ai-paradox-invisible-use-cases/live-thread.md`](../../../research/wiki/themes/ai-paradox-invisible-use-cases/live-thread.md) |
| Which TreeHacks 2026 projects line up with our direction? | [`scrapes/treehacks-2026-winners.md`](../../../research/wiki/scrapes/treehacks-2026-winners.md) |
| Why did the team commit to TRIBE v2 + agent swarms? | [`decisions/006-tribe-v2-as-special-mode.md`](../../../research/wiki/decisions/006-tribe-v2-as-special-mode.md) + [`decisions/007-agent-swarms-as-coordination-pattern.md`](../../../research/wiki/decisions/007-agent-swarms-as-coordination-pattern.md) |
| What's the team budget? | [`decisions/016-twelve-hour-work-budget-four-people.md`](../../../research/wiki/decisions/016-twelve-hour-work-budget-four-people.md) |
| When's the freeze? | [`decisions/012-feature-freeze-saturday-8pm.md`](../../../research/wiki/decisions/012-feature-freeze-saturday-8pm.md) |
| What's the Karpathy wiki pattern operating manual? | [`themes/ai-paradox-invisible-use-cases/window-2-research-deepening/sources/007-karpathy-llm-wiki-pattern.md`](../../../research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/sources/007-karpathy-llm-wiki-pattern.md) (verbatim essay) |
| What did the consolidation pass actually do? | [`caltech/CONSOLIDATION-REPORT.md`](../../../caltech/CONSOLIDATION-REPORT.md) |
| What sponsor info is canonical? | `caltech/context/sponsors/` — full list: `ifm-k2.md` (K2), `ironsite.md` (Ironside), `listenlabs.md` (Listen Labs), `palohouse.md` (dropped per decision 015), `sideshift.md`, `yc.md`, `mlh-mini-challenges.md`. NOT `research/sponsors/` (those are inboxes). |
| What track is the team committing to? | `caltech/context/tracks/best-use-of-ai.md` (hard target per decision 005), `creativity.md` (curveball via TRIBE v2 per decision 006); also-considered: `cybersecurity-safety.md`, `not-so-sexy.md`. Track-strategy summary at `caltech/context/track-strategy.md`. |
| What yap notes capture team conversations? | `caltech/context/yaps/` (chronological by date) — opening team direction, judge conversations, strategy pivot to tech-first stack. |
| Who's on the team + what lane do they own? | `caltech/context/team.md` overview + per-person `caltech/context/team/{johnny,jacob,emilie,junsoo}.md` (lane assignments per decision 003). |
| What is the architectural shape per the team's own context doc? | `caltech/context/architecture.md` |
| What are the constraints (time, sponsor commitments, etc.)? | `caltech/context/constraints.md` |
| What's the event itself — date, format, sponsors? | `caltech/context/event.md` |

## What this skill does NOT do

- Does NOT propose the project idea, hypothesis, hook, or demo (Socratic protocol — Johnny names; Claude reflects).
- Does NOT write the PRD ([decision 013](../../../research/wiki/decisions/013-prd-built-in-different-instance.md): PRD lives in a different Claude instance).
- Does NOT auto-ingest sources without Johnny's go.
- Does NOT reorganize the wiki (consolidation agent's job; see `caltech/RESEARCH-CONSOLIDATION-PROTOCOL.md`).
- Does NOT resolve T1 or T2 — those are held until Johnny addresses them.

## Heritage

Vannevar Bush's Memex (1945) was the original "personal, curated knowledge store with associative trails between documents." The part Bush couldn't solve was who maintains the trails. Karpathy's LLM Wiki pattern (2026) puts the LLM in the maintenance role; the human curates sources and asks the questions. This wiki is one instantiation of that pattern, scoped to one hackathon, with one team, under one Socratic constraint.
