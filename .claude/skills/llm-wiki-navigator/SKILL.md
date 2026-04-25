---
name: llm-wiki-navigator
description: 'Navigate, query, and operate the Karpathy-LLM-wiki research base at research/wiki/ for Caltech HackTech 2026. Use whenever asked to: query the wiki, browse the catalog, bootstrap a fresh Claude session, build a PRFAQ or PRD off the research, ingest a new source, run a lint or QA pass, look up a vocabulary term, find what is locked vs open, navigate the caltech/context tree, or understand the Socratic interaction protocol that binds idea-naming to Johnny. Invoke before any "what does the wiki say about X?" / "is this decided?" / "what term means Y?" / "where do I file this source?" / "what are the open tensions?" / "where is everything?" question.'
---

# LLM Wiki Navigator

## 30-second orientation

The research base is a **Karpathy LLM Wiki** ([decision 014](../../../research/wiki/decisions/014-karpathy-llm-wiki-pattern-adopted.md)). It exists across two parallel trees:

- **`research/wiki/`** — the synthesized layer (LLM writes; human reads).
- **`caltech/`** — the contextual layer (event / sponsors / tracks / team / yaps / protocols; canonical, immutable).

Navigation has three distinct surfaces:

| Surface | When to use | File |
|---|---|---|
| **Browse the catalog** | "Show me everything" | [`research/wiki/index.md`](../../../research/wiki/index.md) — flat content catalog, every file one-line each |
| **Lookup by question** | "I want to know X" | the cheatsheet at the bottom of THIS file |
| **Per-folder explanation** | "What lives in this folder?" | `<folder>/README.md` in every wiki folder |

## The one constraint that overrides everything else — Socratic protocol

Verbatim from Johnny 2026-04-25:

> *"You cannot tell me what the idea is. I have to tell you what the idea is and you have to just repeat it back to me. But you can help guide me getting closer and closer and closer to what exactly I'm trying to get about."*

The Socratic protocol binds: hypothesis-naming, hook, demo, product surface, idea ranking. It does NOT bind: wiki structure, lint, navigator-skill maintenance, sponsor research, source ingestion mechanics, code-teardowns of past projects.

## The reading order (≤ 10 files for cold-start bootstrap)

A fresh Claude session reading these in order has every PRFAQ-ready bootstrap context. From `caltech/CONSOLIDATION-REPORT.md`:

1. [`research/wiki/themes/ai-paradox-invisible-use-cases/README.md`](../../../research/wiki/themes/ai-paradox-invisible-use-cases/README.md) — theme lock + Socratic protocol + theme-vs-hypothesis split
2. [`research/wiki/themes/ai-paradox-invisible-use-cases/vocabulary.md`](../../../research/wiki/themes/ai-paradox-invisible-use-cases/vocabulary.md) — ~120 terms in 6 buckets
3. [`research/wiki/decisions/README.md`](../../../research/wiki/decisions/README.md) — table of all 16 locked decisions
4. [`research/wiki/decisions/006-tribe-v2-as-special-mode.md`](../../../research/wiki/decisions/006-tribe-v2-as-special-mode.md) + [`007-agent-swarms-as-coordination-pattern.md`](../../../research/wiki/decisions/007-agent-swarms-as-coordination-pattern.md) — bonded pair (the two architectural anchors)
5. [`research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/tribe-v2-canonical-reference.md`](../../../research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/tribe-v2-canonical-reference.md) — primary-source TRIBE v2 facts (CORRECTS three claims in source 006)
6. [`research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/emotional-depth-demo-theatre-canonical.md`](../../../research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/emotional-depth-demo-theatre-canonical.md) — 8-emotion taxonomy + 16-mechanic catalog + 90-second demo template
7. [`research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/500-elicitation-qa-pass.md`](../../../research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/500-elicitation-qa-pass.md) — Socratic / Red Team / Pre-Mortem / First-Principles attacks; **T1 lives here**
8. [`research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/501-party-mode-roundtable.md`](../../../research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/501-party-mode-roundtable.md) — 6-persona roundtable with 23 open questions; **T2 lives here**
9. [`research/wiki/projects/renaissance-research.md`](../../../research/wiki/projects/renaissance-research.md) — 🔴 HIGH lookalike risk teardown
10. [`caltech/CONSOLIDATION-REPORT.md`](../../../caltech/CONSOLIDATION-REPORT.md) — what was ingested, what was intentionally dropped, gaps remaining

Total ~25-35 min cold read; ~45 min from zero to first PRFAQ paragraph.

## Folder taxonomy — `research/wiki/`

Every folder has its own `README.md` explaining purpose + naming + schema + when-to-read + when-to-write. The list:

| Folder | What lives here | Key file |
|---|---|---|
| `research/wiki/` (root) | Front door + flat content catalog | [`README.md`](../../../research/wiki/README.md), [`index.md`](../../../research/wiki/index.md) |
| `decisions/` | 16 numbered decision files — **the spine** | [`README.md`](../../../research/wiki/decisions/README.md) |
| `themes/` | Directional anchors (1 active theme) | [`README.md`](../../../research/wiki/themes/README.md) |
| `themes/ai-paradox-invisible-use-cases/` | The active theme: lock document + live-thread + vocabulary + sources + window-2 archive | [`README.md`](../../../research/wiki/themes/ai-paradox-invisible-use-cases/README.md) |
| `themes/<slug>/sources/` | Per-source pages (verbatim + extracts) | [`README.md`](../../../research/wiki/themes/ai-paradox-invisible-use-cases/sources/README.md) |
| `themes/<slug>/sources/deep-dives/` | Primary-source canonical references (authoritative on contradictions) | [`README.md`](../../../research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/README.md) |
| `projects/` | Per-project teardowns of past hackathon projects | [`README.md`](../../../research/wiki/projects/README.md) |
| `patterns/` | Cross-project architectural primitives | [`README.md`](../../../research/wiki/patterns/README.md) |
| `tools/` | Per-tool API + integration template + gotchas | [`README.md`](../../../research/wiki/tools/README.md) |
| `stacks/` | Recurring full-stack combos that ship in 24-36h (currently empty) | [`README.md`](../../../research/wiki/stacks/README.md) |
| `scrapes/` | Agent-produced gallery scrapes (GH-URL-first) | [`README.md`](../../../research/wiki/scrapes/README.md) |
| `findings/` | Query-time synthesis + lint outputs + verification | [`README.md`](../../../research/wiki/findings/README.md) |

## The contextual tree — `caltech/`

Parallel to `research/wiki/`. Canonical for event / sponsor / track / team / yap details. The wiki's `decisions/` cite into here for trace; the navigator skill cheatsheet (below) routes lookups directly.

| Subfolder / file | What's there |
|---|---|
| `caltech/RESEARCH-CONSOLIDATION-PROTOCOL.md` | Karpathy gates + Socratic protocol + per-file-type schemas |
| `caltech/CONSOLIDATION-REPORT.md` | What consolidation produced, dropped, gaps remaining + the PRD-builder reading order |
| `caltech/HANDOFF.md` | Hand-off note from earlier setup |
| `caltech/context/event.md` | Event date / format / sponsor list |
| `caltech/context/architecture.md` | Team's own architecture context |
| `caltech/context/constraints.md` | Time / sponsor / scope constraints |
| `caltech/context/track-strategy.md` | Track-strategy summary |
| `caltech/context/team.md` + `team/{johnny,jacob,emilie,junsoo}.md` + `team/johnny-public-corpus.md` | Team overview + per-person profile + lane assignment |
| `caltech/context/sponsors/{ifm-k2,ironsite,listenlabs,palohouse,sideshift,yc,mlh-mini-challenges}.md` | **Authoritative** per-sponsor briefs (research/sponsors/ are inboxes only) |
| `caltech/context/tracks/{best-use-of-ai,creativity,cybersecurity-safety,not-so-sexy}.md` | Per-track briefs |
| `caltech/context/yaps/2026-04-24-{opening-team-direction,judge-conversations-and-emerging-themes,strategy-pivot-tech-first-stack}.md` | Chronological yap notes |
| `caltech/ideation/INDEX.md` + `01-04` | Other-window ideation sweep — read INDEX FIRST for Socratic-protocol caveats; do NOT ingest the rankings/recommendations sections |

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

1. **For "show me everything"** → start with [`research/wiki/index.md`](../../../research/wiki/index.md). Flat catalog, one-line each.
2. **For "I want to know X"** → use the cheatsheet at the bottom of this file.
3. **Drill into the indicated folder.** Each folder's `README.md` explains what's there + naming + schema.
4. **Follow `cross-links` and `cites-sources`** from the file you land on. The graph IS the answer; one file rarely suffices.
5. **File novel synthesis as `findings/<topic>.md`.** Don't lose query insights to chat history.

## How to ingest a new source (7-step Karpathy flow)

1. Drop raw source into `themes/<slug>/sources/NNN-<slug>.md` (verbatim + key-extracts header + frontmatter).
2. Discuss takeaways with Johnny. **Under Socratic theme: surface, don't propose.**
3. Update `themes/<slug>/vocabulary.md` if new terms appeared.
4. Update or create relevant pages in `findings/`, `projects/`, `patterns/`, `tools/` etc.
5. **Flag contradictions explicitly** — write a "tension" entry. Do NOT average.
6. Append to `themes/<slug>/live-thread.md` IF the source meaningfully shifts framing/hypothesis/direction.
7. Update [`research/wiki/index.md`](../../../research/wiki/index.md) AND `wiki/README.md` index for any new pages.

## How to lint (7-check pass)

1. Contradictions across pages (silently averaged ❌ vs explicitly held as tension ✅)
2. Stale claims newer sources have superseded
3. Orphan pages (no inbound links)
4. Concepts mentioned but lacking their own page
5. Broken cross-references (every markdown link walked)
6. Data gaps (claims without sources)
7. Suggested next questions / sources

Output: `wiki/findings/lint-YYYY-MM-DD.md`. Latest pass: [`findings/lint-2026-04-25.md`](../../../research/wiki/findings/lint-2026-04-25.md).

## The two open tensions Johnny needs to know about

These are HELD per Socratic protocol — not resolved. The PRD-builder must see them at the top of its reading.

- **T1.** *"Augmented human intelligence"* — the hypothesis-frame Johnny adopted — is the **exact word** source 003 (trends slop) names as one of the four corpus-mean defaults every model reaches for. The theme's banner is mean-regressed. **No counter exists in current material.** Surfaces in: [`decisions/004`](../../../research/wiki/decisions/004-socratic-protocol-installed.md), [`decisions/005`](../../../research/wiki/decisions/005-best-use-of-ai-as-hard-target.md), [`vocabulary.md`](../../../research/wiki/themes/ai-paradox-invisible-use-cases/vocabulary.md), [`live-thread.md`](../../../research/wiki/themes/ai-paradox-invisible-use-cases/live-thread.md), [`projects/renaissance-research.md`](../../../research/wiki/projects/renaissance-research.md), [`window-2-research-deepening/500-elicitation-qa-pass.md`](../../../research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/500-elicitation-qa-pass.md).
- **T2.** The Actor / Auditor / Mediator triad has **no external, non-platform-derived referent** for the auditor. Without one, the un-black-boxing architecture is **structurally indistinguishable from Filter World with extra steps**. TRIBE v2 named as **candidate external referent** but not yet operationalized in the architecture. Surfaces in: [`patterns/witnessed-dissent.md`](../../../research/wiki/patterns/witnessed-dissent.md), [`decisions/006`](../../../research/wiki/decisions/006-tribe-v2-as-special-mode.md), [`decisions/007`](../../../research/wiki/decisions/007-agent-swarms-as-coordination-pattern.md), [`tribe-v2-canonical-reference.md` §10.5](../../../research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/tribe-v2-canonical-reference.md), [`window-2-research-deepening/501-party-mode-roundtable.md`](../../../research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/501-party-mode-roundtable.md).

## Decisions snapshot (16 locked, see [`decisions/README.md`](../../../research/wiki/decisions/README.md) for the full table)

001 tech-first stack · 002 track commitments (3 sponsored CORE: K2 / Ironside / Listen Labs + 2 main: Best AI / Creativity; Palohouse dropped) · 003 team lanes (Johnny=hard innovation; Jacob+Junsoo=execution+agentic; Emilie=packaging) · 004 Socratic protocol installed · 005 Best Use of AI as hard target · **006 TRIBE v2 as special mode (anchor #1)** · **007 agent swarms as coordination (anchor #2)** · 008 K2 = speed engine ~1,300 tok/s for swarm fan-out (NOT smart reasoning) · 009 Ironside pipeline mirror (Auto-Classifier → Narration → Observer-as-Judge) · 010 B2C-primary + B2B-overlay positioning · 011 demo-over-execution · 012 feature-freeze Saturday 8 PM PDT · 013 PRD built in different Claude instance · 014 Karpathy LLM Wiki pattern adopted · 015 Palohouse dropped · 016 12hr × 4 people = ~48 person-hours total budget.

## Quick-reference cheatsheet

The lookup table. Every row maps a question to the file that answers it.

| I want to know | Start here |
|---|---|
| What's everything in the wiki? | [`research/wiki/index.md`](../../../research/wiki/index.md) (flat catalog) |
| What's the folder layout? | [`research/wiki/README.md`](../../../research/wiki/README.md) |
| What's locked? | [`decisions/README.md`](../../../research/wiki/decisions/README.md) |
| Why was decision N made? | [`decisions/NNN-<slug>.md`](../../../research/wiki/decisions/) — full schema (decision / date / locked-by / why / opens / closes / reversibility / trace) |
| What does TRIBE v2 actually do (corrected facts)? | [`themes/.../sources/deep-dives/tribe-v2-canonical-reference.md`](../../../research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/tribe-v2-canonical-reference.md) |
| What term does Johnny mean by "augmented intelligence" / "trends slop" / "un-black-box" / "Filter World"? | [`themes/.../vocabulary.md`](../../../research/wiki/themes/ai-paradox-invisible-use-cases/vocabulary.md) (~120 terms × 6 buckets) |
| What's the source for term X? | vocabulary entry has source path; trace back to `themes/.../sources/NNN-*.md` |
| What's the latest framing shift? | [`themes/.../live-thread.md`](../../../research/wiki/themes/ai-paradox-invisible-use-cases/live-thread.md) (append-only, dated entries) |
| Are we leaning toward a known winner shape? | [`projects/renaissance-research.md`](../../../research/wiki/projects/renaissance-research.md), [`projects/memento.md`](../../../research/wiki/projects/memento.md) (both 🔴 HIGH lookalike risk) |
| Which past hackathon winners did this thing we want to do? | [`projects/`](../../../research/wiki/projects/) — current 5 + 6 TreeHacks 2026 teardowns in flight |
| What past gallery have we scraped? | [`scrapes/treehacks-2026-winners.md`](../../../research/wiki/scrapes/treehacks-2026-winners.md) (64 winners, 60 with public repos) |
| What demo mechanic triggers awe / surprise / recognition / comfort / anger / pride? | [`themes/.../sources/deep-dives/emotional-depth-demo-theatre-canonical.md`](../../../research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/emotional-depth-demo-theatre-canonical.md) §2-3 |
| What's the shape of a witnessed-dissent UI? | [`patterns/witnessed-dissent.md`](../../../research/wiki/patterns/witnessed-dissent.md) |
| How do I get parse-safe JSON from an LLM? | [`patterns/robust-json-from-llms.md`](../../../research/wiki/patterns/robust-json-from-llms.md) |
| How do I fan-out per-item LLM calls cheaply? | [`patterns/per-item-parallel-llm-evaluation.md`](../../../research/wiki/patterns/per-item-parallel-llm-evaluation.md) |
| How do I defeat VLM spatial blindness? | [`patterns/localize-and-zoom.md`](../../../research/wiki/patterns/localize-and-zoom.md) |
| How do I fuse cheap perception models with an LLM reasoner? | [`patterns/spatial-sidecar.md`](../../../research/wiki/patterns/spatial-sidecar.md) |
| How do I make every output claim auditable? | [`patterns/grounded-citation.md`](../../../research/wiki/patterns/grounded-citation.md) |
| How do I split a generalist + specialist LLM call? | [`patterns/two-stage-llm-compile.md`](../../../research/wiki/patterns/two-stage-llm-compile.md) |
| What's the K2 Think API surface + gotchas + integration template? | [`tools/k2-think.md`](../../../research/wiki/tools/k2-think.md) |
| What did the lint pass surface? | [`findings/lint-2026-04-25.md`](../../../research/wiki/findings/lint-2026-04-25.md) |
| Is the wiki PRD-buildable? | [`findings/qa-2026-04-25-research-completeness.md`](../../../research/wiki/findings/qa-2026-04-25-research-completeness.md) + [`findings/prd-builder-reading-order-verification.md`](../../../research/wiki/findings/prd-builder-reading-order-verification.md) |
| What sponsor info is canonical? | `caltech/context/sponsors/` — full list: `ifm-k2.md` (K2), `ironsite.md` (Ironside), `listenlabs.md` (Listen Labs), `palohouse.md` (dropped per [decision 015](../../../research/wiki/decisions/015-palohouse-dropped.md)), `sideshift.md`, `yc.md`, `mlh-mini-challenges.md`. NOT `research/sponsors/` (those are empty inbox templates) |
| What track is the team committing to? | `caltech/context/tracks/best-use-of-ai.md` (hard target per [decision 005](../../../research/wiki/decisions/005-best-use-of-ai-as-hard-target.md)), `creativity.md` (curveball via TRIBE v2 per [decision 006](../../../research/wiki/decisions/006-tribe-v2-as-special-mode.md)); also-considered: `cybersecurity-safety.md`, `not-so-sexy.md`. Track-strategy summary at `caltech/context/track-strategy.md` |
| What yap notes capture team conversations? | `caltech/context/yaps/` (chronological by date) — opening team direction, judge conversations, strategy pivot to tech-first stack |
| Who's on the team + what lane do they own? | `caltech/context/team.md` overview + per-person `caltech/context/team/{johnny,jacob,emilie,junsoo}.md` (lane assignments per [decision 003](../../../research/wiki/decisions/003-team-role-lanes-locked.md)) |
| What is the team's architecture context doc? | `caltech/context/architecture.md` |
| What are the constraints? | `caltech/context/constraints.md` |
| What are the event details? | `caltech/context/event.md` |
| What did the consolidation pass do? | [`caltech/CONSOLIDATION-REPORT.md`](../../../caltech/CONSOLIDATION-REPORT.md) |
| Why did the team commit to TRIBE v2 + agent swarms? | [`decisions/006`](../../../research/wiki/decisions/006-tribe-v2-as-special-mode.md) + [`decisions/007`](../../../research/wiki/decisions/007-agent-swarms-as-coordination-pattern.md) |
| What's the budget? | [`decisions/016`](../../../research/wiki/decisions/016-twelve-hour-work-budget-four-people.md) |
| When's the freeze? | [`decisions/012`](../../../research/wiki/decisions/012-feature-freeze-saturday-8pm.md) |
| What's the Karpathy wiki essay (the pattern itself)? | [`themes/.../window-2-research-deepening/sources/007-karpathy-llm-wiki-pattern.md`](../../../research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/sources/007-karpathy-llm-wiki-pattern.md) (verbatim) |
| What's the consolidation protocol the wiki was built against? | [`caltech/RESEARCH-CONSOLIDATION-PROTOCOL.md`](../../../caltech/RESEARCH-CONSOLIDATION-PROTOCOL.md) |
| What did the other window's ideation sweep produce? | `caltech/ideation/INDEX.md` first (Socratic-protocol caveats), then `01-04*.md` filtered through INDEX |

## What this skill does NOT do

- Does NOT propose the project idea, hypothesis, hook, or demo (Socratic protocol — Johnny names; Claude reflects).
- Does NOT write the PRD ([decision 013](../../../research/wiki/decisions/013-prd-built-in-different-instance.md): PRD lives in a different Claude instance).
- Does NOT auto-ingest sources without Johnny's go.
- Does NOT reorganize the wiki (consolidation agent's job; see [`caltech/RESEARCH-CONSOLIDATION-PROTOCOL.md`](../../../caltech/RESEARCH-CONSOLIDATION-PROTOCOL.md)).
- Does NOT resolve T1 or T2 — those are held until Johnny addresses them.
- Does NOT generate `index.md` automatically — `index.md` is **maintained**, not generated. If a file exists that's not in the index, that's drift; the next lint pass surfaces it.

## What this skill DOES well — usability summary

**For a fresh Claude session asked to do PRFAQ work:**
- Reads the navigator skill (this file) → 30-second orientation + reading order.
- Reads the 10-file PRD-builder bootstrap in order → ~25-35 min cold load.
- Has T1 + T2 surfaced as the first decisions to put to Johnny.
- Has every concept queryable via vocabulary; every decision traceable to source; every demo-mechanic queryable via emotional-depth deep-dive.

**For a fresh Claude session asked to ingest a new source:**
- Reads the 7-step ingest flow above.
- Drops the source under `themes/<slug>/sources/NNN-<slug>.md` with frontmatter + verbatim content.
- Updates vocabulary, live-thread, index per the flow.
- Files cross-cutting synthesis as `findings/<topic>.md`.

**For a fresh Claude session asked to lint or QA:**
- Reads the 7-check lint flow above.
- Outputs `findings/lint-YYYY-MM-DD.md` with the standard sections (contradictions, stale claims, orphans, broken links, data gaps, next questions).

**For a fresh Claude session asked "what's everything?":**
- Opens [`research/wiki/index.md`](../../../research/wiki/index.md) — flat catalog, every file one-line each.

**For a fresh Claude session asked "I want to know X":**
- Scans the cheatsheet rows above. Lands on the right file in one hop.

## Heritage

Vannevar Bush's Memex (1945) was the original "personal, curated knowledge store with associative trails between documents." The part Bush couldn't solve was who maintains the trails. Karpathy's LLM Wiki pattern (2026) puts the LLM in the maintenance role; the human curates sources and asks the questions. This wiki is one instantiation of that pattern, scoped to one hackathon, with one team, under one Socratic constraint.
