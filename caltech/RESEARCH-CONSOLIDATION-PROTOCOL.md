# Research Consolidation Protocol — Caltech Hacktech 2026

**Audience:** the next Claude window (or the consolidation subagent it dispatches).
**Goal:** turn the entire scattered research pile into ONE Karpathy-style LLM wiki dense enough that a PRD-builder agent can hyper-narrow against it without re-deriving anything.
**Authority:** Johnny is the only one who picks the idea. Claude reflects, indexes, and sharpens — never proposes. (See `research/wiki/themes/ai-paradox-invisible-use-cases/README.md` Socratic protocol.)
**Status:** PROTOCOL — read before dispatching the consolidation agent.

---

## Why this exists

We have research arriving from multiple parallel streams that will collide if uncoordinated:

| Stream | Source | Branch / location | Status |
|---|---|---|---|
| Theme lock + sources | Other Claude window (prior + ongoing) | `main` — `research/wiki/themes/ai-paradox-invisible-use-cases/` | live, growing |
| TreeHacks 2026 winner scrape | Other Claude window | `main` — `research/wiki/scrapes/treehacks-2026-winners.md` | committed |
| Inspiration wiki seed | Original setup | `main` — `research/wiki/{projects,patterns,tools}/` | 3 projects + 6 patterns + 1 tool, room to grow |
| Sponsor research | Original setup | `main` — `research/sponsors/{ironsight,k2-think,listen-labs}/` | scaffolded |
| Caltech context | Original setup | `main` — `caltech/context/` | locked (event, tracks, sponsors, team, constraints, yaps) |
| Ideation sweep feedstock | This window | worktree branch `research/ideation-sweep` — `caltech/ideation/` | committed, with INDEX.md flagging Socratic-protocol caveats |
| Other-window deep research | Other Claude window, tmux-spawned subagents | `main` — destinations TBD | INCOMING |

Without protocol, these streams either duplicate, contradict, or buried the high-signal pieces under noise. The consolidation agent's job is to fuse them into one ground truth that is *dense enough for an LLM to ingest in one read* and *honest about provenance* so the PRD-builder can trust it.

---

## The Karpathy LLM-wiki principle

> **An LLM wiki is not written for humans. It's written for an LLM that has 30 seconds to read it before answering a hard question.**

That implies these properties (these are the gates):

1. **Dense** — no fluff, no hedging, no "this is interesting because..." — just the load-bearing claim. If a sentence doesn't change a downstream decision, cut it.
2. **Indexed** — every file has frontmatter declaring (a) what it is, (b) what decision it supports, (c) what evidence it cites, (d) when it was last verified.
3. **Cross-referenced** — every claim that depends on another file links to it explicitly. No floating assertions.
4. **Provenance-honest** — every claim cites a source. Sources cite where in the original they appear (file:line, URL, video timestamp). No "as we know" or "it's well established."
5. **Decision-traceable** — when the PRD makes a call, the trace from PRD → wiki claim → original source must be one click each direction.
6. **Scannable for LLMs** — consistent schemas, predictable section order, no creative document structure. If file A is about a project and file B is about a project, they have the SAME section headings in the SAME order.
7. **Small files, many of them** — one file per atomic unit (one project, one pattern, one source, one decision). Big composite files are unsearchable.
8. **Status-marked** — every file says: ✅ verified / ⚠️ partial / ❌ aspirational / 🟡 in-progress. The PRD-builder needs to know how much weight to give each claim.

---

## The Socratic protocol — non-negotiable

From `research/wiki/themes/ai-paradox-invisible-use-cases/README.md`:

> *"You cannot tell me what the idea is. I have to tell you what the idea is and you have to just repeat it back to me. But you can help guide me getting closer and closer and closer to what exactly I'm trying to get about."*

**For the consolidation agent:**

- **Reflect, don't propose.** When a source contains a recommendation, store the recommendation as *one option among many*. Never elevate one idea, hook, hypothesis, or front-facing concept above another in the consolidated wiki.
- **Sharpen, don't summarize.** Compress to vocabulary, claims, citations, contrasts. A "summary" smooths edges; a "sharpening" preserves them.
- **Surface tensions.** When two sources contradict, the consolidated wiki must hold BOTH and name the contradiction. Don't average.
- **No rankings.** No "top 5," no "strongest hook," no "recommended portfolio." Those are Johnny's calls.
- **Questions over answers.** Where the source landscape leaves an unresolved question, the wiki names it as an open question for Johnny — not as a TODO for Claude to resolve.

The ideation sweep in `.worktrees/research-ideation-sweep/caltech/ideation/` violates this protocol in places (rankings, recommendations). Its `INDEX.md` flags exactly which sections to ingest and which to drop. The consolidation agent must respect that index.

---

## Target wiki structure (the destination)

The consolidated wiki keeps the existing `research/wiki/` layout — just denser and more interlinked:

```
research/wiki/
├── README.md                      ← top-level index (already exists; consolidation extends it)
├── themes/
│   └── ai-paradox-invisible-use-cases/
│       ├── README.md              ← lock document; live-thread changelog grows
│       ├── sources/               ← NNN-<slug>.md, one per discrete source
│       └── (new) vocabulary.md    ← consolidated glossary of all named failure-modes / fixes / archetypes
├── projects/                      ← per-project teardowns; canonical
├── patterns/                      ← cross-project patterns; cite projects
├── stacks/                        ← recurring full-stack combos
├── tools/                         ← per-tool API surface + gotchas
├── scrapes/                       ← gallery scrapes, GH-URL-first
└── (new) decisions/               ← named decisions the PRD will inherit
    ├── README.md
    └── NNN-<decision-slug>.md     ← what was decided, why, on what evidence, by whom, when
```

**Two new folders the consolidation agent should create:**

1. **`themes/<slug>/vocabulary.md`** — single page listing every named term across all sources (currently scattered in source files and the cross-source-vocabulary section). Each entry: term, source(s), one-line definition, opposing/companion terms. This becomes the LLM's lookup table when the PRD asks "what does 'trends slop' mean?"

2. **`decisions/`** — every load-bearing decision Johnny has made gets a numbered file. Examples that already exist scattered across yaps and the theme README:
   - `001-tech-first-stack-strategy.md` (Friday yap)
   - `002-track-commitments-locked.md` (track-strategy.md)
   - `003-team-role-lanes-locked.md` (team.md)
   - `004-socratic-protocol-installed.md` (theme README)
   - `005-best-use-of-ai-as-hard-target.md` (anchor memory)
   - ...etc.

   These pull from existing files but become the canonical decision log. PRD-builder reads `decisions/` first to know what's locked vs. open.

---

## Standard frontmatter (apply to EVERY consolidated file)

```yaml
---
file-type: <theme | source | project | pattern | stack | tool | scrape | decision | vocabulary>
status: <verified | partial | aspirational | in-progress>
last-verified: <YYYY-MM-DD>
supports-decisions: [list of decisions/NNN-*.md this file backs]
cites-sources: [list of themes/*/sources/NNN-*.md this file draws from]
cross-links: [list of related wiki paths]
---
```

If a section can't be filled honestly, write `unknown` — never fabricate.

---

## Schemas (what each file type must contain)

These are the section orderings the consolidation agent must enforce so the PRD-builder agent can scan reliably.

### Source (`themes/<slug>/sources/NNN-*.md`)
1. Frontmatter
2. **Origin** — URL, author, date, format (article / video / talk / paper / tweet)
3. **Key extracts** — 3-5 bullets, the load-bearing claims with original wording where it carries weight
4. **Vocabulary introduced** — terms this source coined or imported (these flow into `vocabulary.md`)
5. **How it maps to the theme** — 1-3 lines connecting source claim to the theme's anchor problem statement
6. **What it contradicts / complicates** — explicit naming of where this source pushes against another source
7. **Open questions raised** — questions this source surfaces that no source yet answers
8. **Full content** — verbatim transcript / article body

### Project (`projects/<slug>.md`)
Use the existing template in `wiki/README.md`. Add to it:
- **Lookalike-risk score for our HackTech 2026 entry** — 🟢 low / 🟡 medium / 🔴 high, with one-sentence reason
- **What this project's existence forecloses** for our project (if it won the same track last year, what angle is now harder for us)

### Pattern (`patterns/<slug>.md`)
Use the existing lighter template. Add:
- **Theme alignment** — which themes does this pattern serve, with one-line each
- **Anti-theme alignment** — which themes does this pattern UNDERMINE if applied wrongly

### Decision (`decisions/NNN-*.md`)
1. Frontmatter
2. **Decision** — one sentence, plain language, what was decided
3. **Date locked**
4. **Locked by** — who (Johnny, team, sponsor constraint, hard date, etc.)
5. **Why** — the specific reason; cite source files
6. **What this opens** — downstream possibilities this enables
7. **What this closes** — downstream possibilities this rules out
8. **Reversibility** — what would have to be true to reopen this
9. **Trace** — pointers to original yap/source/conversation where this was decided

### Vocabulary entry (within `themes/<slug>/vocabulary.md`)
| Term | Source(s) | One-line definition | Companion terms | Opposing terms |

---

## The consolidation prompt (for the next window to dispatch)

When the other window's tmux research agents finish and the consolidation step begins, dispatch ONE max-effort subagent with this prompt shape (the next window can refine):

```
You are the Caltech Hacktech 2026 research consolidation agent. Your single job is to fuse all
research streams into one Karpathy-style LLM wiki at research/wiki/.

Inputs you must read in full before writing anything:
  1. caltech/RESEARCH-CONSOLIDATION-PROTOCOL.md (this file — the gates and schemas)
  2. research/wiki/themes/ai-paradox-invisible-use-cases/README.md (theme lock + Socratic protocol)
  3. research/wiki/themes/ai-paradox-invisible-use-cases/sources/*.md
  4. research/wiki/projects/*.md
  5. research/wiki/patterns/*.md
  6. research/wiki/tools/*.md
  7. research/wiki/scrapes/*.md
  8. research/wiki/README.md
  9. research/sponsors/**/*.md
  10. caltech/context/**/*.md (event, tracks, sponsors, team, constraints, yaps)
  11. .worktrees/research-ideation-sweep/caltech/ideation/INDEX.md (and the 4 ideation files,
      reading them through the lens of the INDEX caveats)
  12. Whatever the other window's tmux research agents produced — locate via git log on main
      since 2026-04-25 and via any new files in research/wiki/ or caltech/context/

Your output:
  A. New canonical files in research/wiki/decisions/ — one per load-bearing decision found in
     yaps, theme README, track-strategy, architecture, sponsors notes, and team profiles.
  B. New research/wiki/themes/ai-paradox-invisible-use-cases/vocabulary.md consolidating every
     named term across all sources.
  C. Updates to research/wiki/README.md index.
  D. Updates to research/wiki/themes/ai-paradox-invisible-use-cases/README.md live-thread
     changelog (one line per significant ingestion, dated).
  E. Per-winner teardowns in research/wiki/projects/ for the two HIGH lookalike risks flagged
     in the ideation sweep INDEX (Memento, Renaissance Research) — using the existing template
     plus the new lookalike-risk fields.
  F. Updates to existing patterns/ files where the ideation sweep introduced new patterns
     that overlap or extend them. Do NOT add a new pattern file unless it's genuinely new.
  G. A single output report at caltech/CONSOLIDATION-REPORT.md naming:
       - what you ingested
       - what you wrote
       - what you intentionally did not ingest (and why — usually Socratic-protocol violations)
       - what gaps remain (open questions, missing sources, unverified projects)
       - a "PRD-builder reading order" — the minimal set of wiki files the PRD-builder agent
         must read first

Constraints (non-negotiable):
  - Apply the Karpathy LLM-wiki principles in this protocol document. Density, indexing,
    cross-referencing, provenance, decision-traceability, scannability, small files,
    status-marked.
  - Apply the Socratic protocol. Reflect, don't propose. No rankings. No recommendations.
    Surface tensions; never average them. Surface questions; never answer them on Johnny's
    behalf.
  - Apply the standard frontmatter to every file you touch.
  - Apply the schemas to every file by type.
  - When two sources contradict, write a "tension" entry. Do NOT pick a side.
  - When a claim has no source, mark it ❌ aspirational and surface it as an open question.
  - Stay on main (or a single consolidation branch). Do not fan out worktrees from inside
    the consolidation agent — your work is fusion, not parallel research.
  - Update the live-thread changelog in the theme README with one line per significant
    ingestion, dated.

Method:
  - Read everything first. Do not start writing until you've read all 12 input categories.
  - Build the decisions/ folder first (it's the spine the rest hangs off).
  - Build the vocabulary.md second.
  - Then per-project lookalike teardowns.
  - Then index/changelog updates.
  - Then the consolidation report.

Verification before completion:
  - Every new file has the standard frontmatter
  - Every claim in every new file cites a source
  - No file in your output makes a recommendation about what to build
  - The PRD-builder reading order in the consolidation report is <= 10 files
  - The consolidation report names every gap honestly

Report format:
  Single file at caltech/CONSOLIDATION-REPORT.md, ≤ 1500 words, structured as the F bullet
  above. Do not pad.
```

---

## What this protocol does NOT do

- Does not pick the idea, theme, hypothesis, hook, demo, or front-facing artifact.
- Does not write the PRD.
- Does not run the build.
- Does not validate the work the other window's tmux agents are doing — they're authoritative for their own outputs; consolidation just fuses.
- Does not delete or rewrite anyone else's files. Consolidation EXTENDS and INDEXES; it does not overwrite.

---

## Pre-PRD reading order (the test for consolidation success)

When consolidation is complete, the PRD-builder agent should be able to load this minimal reading list and have everything it needs:

1. `research/wiki/themes/ai-paradox-invisible-use-cases/README.md` (theme + protocol)
2. `research/wiki/themes/ai-paradox-invisible-use-cases/vocabulary.md` (terms)
3. `research/wiki/decisions/` — every numbered file (what's locked)
4. `caltech/CONSOLIDATION-REPORT.md` (what to read next + gaps)
5. The 3-5 wiki files the consolidation report names as critical for whatever phase the PRD is in

If that reading list is more than ~10 files, consolidation has failed the density test and must be re-run.

---

## When this protocol is itself wrong

If during consolidation the agent finds that this protocol is the wrong shape for the actual research, **stop, write a counter-proposal in `caltech/CONSOLIDATION-REPORT.md` under a "protocol revision proposal" heading, and surface it to Johnny rather than silently improvising.** Protocol overrides are Johnny's call, not the agent's.
