# 200 — LLM-recallable wiki patterns: SOTARE teardown + Karpathy first principles

> Two-job research note. Job 1: reverse-engineer SOTARE's wiki-recall pattern from the local clone at `/tmp/SOTARE`. Job 2: pull the actual Karpathy LLM-Wiki pattern (and stand-ins where Karpathy is silent) and synthesize the first principles for a recall-optimized knowledge base. Output is opinionated and quote-heavy by design — this file is itself meant to be LLM-recallable.

---

## 1. Summary punchline

- **Strongest SOTARE pattern to copy verbatim:** the **`live-thread.md` / `source-library.md` / `research-state.md` / `next-session-handoff.md` quartet** at repo root, written in append-only "What Just Clicked (Wave N — date)" entries with hypothesis IDs (H-XXX), gotcha IDs (G-XXX), and learned-method IDs (LM-XXX) inlined as first-class atoms. This is the front door an LLM can open in <30s and orient. Our wiki has none of this.
- **Strongest external first principle to adopt:** Karpathy's own framing — *"raw data from a given number of sources is collected, then compiled by an LLM into a `.md` wiki, then operated on by various CLIs by the LLM to do Q&A and to incrementally enhance the wiki, and all of it viewable in Obsidian. You rarely ever write or edit the wiki manually, it's the domain of the LLM."* Three layers (raw → wiki → schema) and three operations (ingest → query → lint). Our wiki currently does step 1-3 of ingest only and has no lint.
- **Single biggest gap between current wiki and recall-optimized target:** there is **no compounding layer**. `research/wiki/` today is a one-shot teardown library — projects/, patterns/, tools/, scrapes/, themes/ get *written once*. There is no `index.md`, no `log.md`, no append-only `live-thread.md`, no `principles/`, no `experts/`, no `sources/` per-source summary directory, no frontmatter on any file, no `[[wikilink]]` cross-reference convention, and no lint pass. We are at SOTARE-circa-Wave-2, not SOTARE-circa-Wave-10.

---

## 2. SOTARE structural teardown

### 2.1 Repo top-level (the front door)

`/tmp/SOTARE` root holds five "index" files that an LLM hits first. From `CLAUDE.md`:

> *"## Core Philosophy (Read These First)*
>
> | File | What |
> |------|------|
> | `principles/extracted/philosophy.md` | 23 core beliefs driving the research |
> | `principles/extracted/hypotheses.md` | 22 testable hypotheses (the "tickets" of this system) |
> | `principles/extracted/actionable-objectives.md` | Build queue in dependency order |
> | `roadmap-v1.md` | Full predicted roadmap with timeline (will be wrong, the diff is the learning) |
> | `live-thread.md` | What's active RIGHT NOW — start here each session |
> | `source-library.md` | What's in Johnny's head, what needs ingesting |"

That table IS the recall index. There is no separate `index.md` — `CLAUDE.md` plays that role. Note the **one-line semantic summary per file**, the **prescribed read order**, and the **explicit "start here each session"** for `live-thread.md`. This is exactly the affordance an LLM needs.

Also in root: `roadmap-v1.md`, `next-session-handoff.md`, `research-state.md`, `SCOUT_REPORT.md`, `harness.sh` (the auto-loop bash conductor), and `CLAUDE.md`.

### 2.2 `live-thread.md` — the active-context atom

This is the highest-signal file in the repo. Its skeleton:

```
# Live Thread — Active Train of Thought
> Updated: <date>  (<one-line state summary>)
> **Current focus:** <one paragraph>

## What's Active RIGHT NOW
### The One Thing: <topic>
<3–5 sentence narrative>

### Sequence (Updated)
1. ~~<DONE step>~~ [DONE] --> 2. ~~<DONE>~~ [DONE] --> ... --> N. **<active step>** (NEXT) --> ...

## What Just Clicked (<date> — Wave N: <one-line takeaway>)
1. **<Bolded headline claim with ID, e.g. G-006: ...>** <body with numbers, deltas, "before→after" framing>
2. **<...>**

## Prior Clicks (<date> — Wave N-1: ...)
... (older clicks compound below, never deleted)

## Open Threads
### CRITICAL: ...
- [ ] **<bolded action>** — <how-to>
- [x] ~~<done thing>~~ — <delta>

### Still open
- [ ] ...

## Closed Threads
- ~~<thing>~~ --> <resolution>

## Active Hypotheses
| ID | Hypothesis | Status |
| H-NAME | one-liner | **VALIDATED** / partially / Conceptual |

## Decision Count
- Sessions ...: D1-D59
- **Total: 110+ design decisions**
- **Total hypotheses: H1-H30 + 19 named = 49**
- **Total gotchas: 6**
- **Total Learned Methods: 7**

## Artifacts
- 6 domain experts (sutton 126, karpathy 224, ralph 762, ...)
- 10 tools (ingest.py, expert.py, ...)

## Hard Deadlines
- 2026-04-21: Stan follow-up
```

What an LLM can recall from a single read: the active focus, the dependency-ordered sequence, every numbered "click" with its hypothesis/gotcha ID for grep-back, the open vs closed thread split, the validation status of each hypothesis, and the artifact inventory with chunk counts. **The strongest convention is the bolded ID-prefix on every claim** (G-006, LM-007, H-EXPERT-EVAL). That's how a downstream agent reattaches a quote to its origin.

Quote discipline is loose — claims are usually paraphrased with embedded numbers ("Karpathy 55%→2%", "5.2x words, 21x context awareness"). The verbatim source is elsewhere (`srm-state/train-of-thought/yap-...`).

### 2.3 `source-library.md` — "what's in Johnny's head"

Maintains tables of:

- **Currently Loaded (Foremost Thought)** — what's active in human working memory (not the repo's working memory)
- **Ingested Sources** — Videos | Transcriptions | Open-Source Tools, with status column ("raw — not evaluated")
- **Ingestion Queue (Priority Order — Revised)** — must-ingest, high-priority, future-exploration, when-needed, faded
- **People / Thinkers** — who, status, why-it-matters

Recall affordance: an LLM asked "what does Johnny know about X?" can grep this file and get either a pointer ("Karpathy AutoResearch repo — actual code, not just principles — must ingest") or a reason for absence ("~~Spotify audiobook~~ — deferred, no transcription pipeline yet"). **Faded items are kept and struck-through, not deleted.** That preserves negative information.

### 2.4 `research-state.md` — active research questions in numbered form

Skeleton:

```
# Research State — SOTARE Active Questions
> Updated: <date>
> Current phase: <one line>

## The Revised Sequence
<numbered, with [DONE] / (ACTIVE) / (NEXT) status inline>

## Active Research Questions

### RQ1: <question>
**Status:** PRIMARY FOCUS / NEW / EXTERNALLY VALIDATED / OPERATIONAL
**Evidence:** <numbers, prior experiments, citations>
**Next:** <concrete action>
**Key insight (Johnny):** "<verbatim quote>"

### RQ2: ...
```

The Johnny-verbatim quote per RQ is load-bearing. It re-grounds the question in the human's actual phrasing. This is the convention that prevents drift.

### 2.5 `principles/` folder — the lens layer

```
principles/
├── carlini-principles.md         (one expert, one file, "core principles" + "what we took from this")
├── karpathy-principles.md        (same shape)
├── ralph-principles.md           (same shape)
├── johnny-profile.md             (the human himself as a "principles source")
├── extracted/
│   ├── philosophy.md             (23 enumerated beliefs, each with a pithy title + 3-sentence rationale)
│   ├── hypotheses.md             (H1...H30 + named H-ABSTRACTION etc.; each with Source / Statement / Test / Status)
│   └── actionable-objectives.md  (OBJ-1...OBJ-N in dependency order)
├── vision-v1.md                  (root verbatim)
├── vision-v1-part2.md … part20.md (verbatim chunks of Johnny's yapping, never edited)
└── vision-v1-part19-new-hypotheses.md / -reasoning-chains.md / -full-yap-verbatim.md (extracted layer for that part)
```

Conventions to lift:

- **One expert per file at this level**, named `<expert>-principles.md`. Three sections: **The Idea** (one para), **Core Principles** (numbered, bolded titles), **What We Took From This** (bullet list mapping principles to our system). Example from `karpathy-principles.md`:
  > *"1. **Single metric as arbiter.** val_bpb is the ONLY decision variable. No "well it's slower but the code is nicer." One metric, one direction, binary decision."*
- **`extracted/`** is the compressed/structured second pass; raw `vision-v1-partN.md` is verbatim and immutable. Two-tier: raw human signal preserved, compressed view derived. **Never lose the raw.** This maps directly to philosophy #7: *"Save Everything, Compress the Best — Verbatim first, extraction second. Never lose the raw human signal."*
- **Hypotheses are first-class citizens with stable IDs** (H1, H-ABSTRACTION). Each is a card with Source / Statement / Test / Status. A downstream PRD agent can cite "per H-EXPERT-EVAL (VALIDATED, Wave 8)" and the chain is recoverable.

### 2.6 `experts/` — per-expert mini-wikis

Each expert has its own subdirectory:

```
experts/karpathy/
├── config.yaml              (name, description, total_sources, total_chunks, first_principles count, sources list)
├── chunks.json              (raw 224 chunks)
├── embeddings.npy           (vector index)
├── expert-prompt.md         (the system prompt that turns this corpus into an "expert agent")
├── eval/
├── first-principles/
│   ├── fp-index.json
│   ├── fp-embeddings.npy
│   └── <one-fp-per-file>.md (kebab-case, named after the principle itself, e.g. meta-optimization-comes-from-iterating-the-process-description-itself.md)
├── raw/                      (the original sources verbatim — llm-wiki-gist-karpathy-2026-04.md etc.)
└── sources/                  (per-source intermediate artifacts)
```

The **first-principle file convention** (lifted directly):

```
# First Principle: <full sentence as title>

> Source: karpathy

## The Principle
<one paragraph statement>

## Exact Words
> "<verbatim quote 1>"
> "<verbatim quote 2>"
> "<verbatim quote 3>"

## What This Means in Practice
<2–4 paragraphs>

## Anti-Patterns
- **<Anti-pattern name>:** <description>

## The Critical Insight
<one sentence punchline>
```

This is the most LLM-recallable file shape in the entire repo. It separates **Principle (compressed) | Exact Words (verbatim, quote-block discipline) | Practice | Anti-Patterns | Critical Insight (TL;DR)**. An LLM querying for "what does Karpathy say about meta-optimization?" can return the Critical Insight as the answer and the Exact Words block as the citation — and the filename is itself the principle, so `find experts/karpathy/first-principles -name "*meta-optimization*"` is the index lookup.

### 2.7 `inspiration/` — per-source ingest dumps

Each YouTube video gets its own folder:

```
inspiration/kwSVtQ7dziU/                       (the YouTube ID is the folder name)
├── full-transcript.md                          (verbatim)
├── index.md                                    (signal-scored topic table with progress bars)
├── summary.md
└── topic-01-agents-code-know-think-hours.md   (one file per identified topic)
    topic-02-...md
    ...
    topic-33-...md
```

The `index.md` is a thing of beauty — a progress-bar-rendered table:

```
1. [████████████░░░░░░░░] 0.64 [Agents Code Know Think Hours](topic-01-...md) | 00:00 - 02:38 | 592 words
2. [██████████░░░░░░░░░░] 0.52 [Forefront Nervous Claws Appropriately Use](...) | 02:38 - 03:10 | 132 words
...
```

LLM can grep for high-signal topics by score, jump straight to the topic file. The folder name is the source ID; the topic files are atoms.

### 2.8 `findings/`, `case-studies/`, `methodology/`

- `findings/learnings/loop-learnings.md` — **golden append-only file** (their words). Each entry is `### [date] Innovation/Inefficiency: <name>` with **What / Evidence / Action** triplets. Never deleted.
- `findings/retrospectives/<date>-retro.md` — per-session retro
- `findings/quality-gates/<date>-qa.md` — per-session QA
- `case-studies/stale-baseline-incident.md` — full post-mortems with **What Happened / Why / The Cascade (numbered) / How We Found It / Fixes Applied / Lessons / Metrics**. Reads like an SRE incident report.
- `methodology/scientific-method.md` — protocol, not folklore. Hypothesis → Baseline → Treatment → Comparison (with a verdict table) → Replication → Logging. Every experiment in the repo is supposed to follow this.

### 2.9 `proprietary-paradigm/`

```
# Proprietary Paradigm
Research-backed, proven findings. Nothing goes here without evidence.
Each entry requires:
- Claim
- Source
- Evidence
- Delta
- Repos used as test facility
This folder is the output of the entire research lab. Everything else is process — this is product.
```

It's nearly empty (one README). The point is the **schema**: the gate to "proven" requires Claim + Source + Evidence + Delta + Test Facility. That schema IS the Karpathy "compiler output" idea — only validated artifacts compile down here.

### 2.10 `harness.sh` and `tools/` — the automation

`harness.sh` is a 372-line bash auto-loop with modes: `scout | build | retro | qa | auto | status`. Cadence: build, build, ..., every 5 builds run a `retro`, every 6 runs a `qa`. State persisted in `state/harness-state.json`. Logs in `state/logs/<ts>_<mode>.log`. Three-consecutive-no-ops → terminate. The retro mode writes to `findings/retrospectives/`, **appends** to `findings/learnings/loop-learnings.md`, and writes machine-readable `state/retro-action-items.md` for the next builder to consume.

In `tools/`: `ingest.py` (unified), `expert.py`, `query.py` (RAG), `eval.py`, `prime.py`, `route.py`, `consult.py` + `consult.sh` (multi-Claude orchestration via tmux), `verify-sources.sh` (mechanical fabrication check — grep quoted passages back to source files), `run-regression.sh`, `status.sh` (dashboard). This is the "various CLIs by the LLM" Karpathy describes — they ARE the maintenance layer.

### 2.11 The CLAUDE.md contract (full text worth quoting)

From `/tmp/SOTARE/CLAUDE.md`, the Workflow block:

> *"Johnny yaps about an idea  
>   → Save verbatim (principles/vision-v1-partN.md)  
>   → Extract hypotheses, philosophy, objectives (principles/extracted/)  
>   → Update live-thread.md  
>   → Route hypothesis to test:  
>       → Ingest external sources (tools/yt-ingest.sh, future tools)  
>       → Compare interpretation vs. source (Level 2)  
>       → Run through auto-research loop on a project (Level 3)  
>       → Results → proprietary-paradigm/ (if proven)  
>   → Commit often (git history = context persistence for future agents)"*

And the **Session Protocol**:

> *"1. Read `live-thread.md` — what's active?  
>  2. Read `source-library.md` — what's in Johnny's head?  
>  3. Read `principles/extracted/hypotheses.md` — what's being tested?  
>  4. When Johnny talks: save verbatim → extract → update live thread  
>  5. When building: commit early, commit often, descriptive messages  
>  6. When closing: update live-thread.md, update process trace"*

And the **Two-Eyes Testing** invariant:

> *"Every doc in this repo has two judges:  
> - **Eye 1 (Docs):** Spawn a fresh agent, give it the docs, see if it's aligned  
> - **Eye 2 (Johnny):** Does the output match what he actually means?  
> The delta between them IS the alignment gap. Closing it is the research."*

That last paragraph is the load-bearing rationale for everything else: every convention in SOTARE is justified by "would a fresh agent reading this be aligned?" — i.e. **the wiki is recall-optimized for a future LLM, by design, as the literal QA test.**

### 2.12 Patterns we should lift verbatim

1. **Top-of-repo `CLAUDE.md` with a 5-row "Read These First" table** + Session Protocol + Workflow block + Two-Eyes invariant.
2. **`live-thread.md` at root** with the "What's Active RIGHT NOW / What Just Clicked / Prior Clicks (compounding) / Open Threads / Closed Threads / Active Hypotheses / Decision Count / Artifacts / Hard Deadlines" skeleton.
3. **`source-library.md` at root** with status-tagged ingestion queue and a "People / Thinkers" table.
4. **Stable-ID convention for atomic claims** (H-XXX hypotheses, G-XXX gotchas, LM-XXX learned methods, OBJ-N objectives, D-N decisions, RQ-N research questions). Bold them inline so they're greppable.
5. **Two-tier preservation:** verbatim folder (immutable) + extracted folder (compressed). Never delete raw.
6. **Per-expert subdirectory schema** with `config.yaml` + `raw/` + `first-principles/` (kebab-case-named files, FP file template above) + `sources/` + `expert-prompt.md`.
7. **First-Principle file template** — Title / Source / The Principle / Exact Words (block-quoted) / What This Means in Practice / Anti-Patterns / Critical Insight.
8. **Per-source ingest folder** named by source ID, with `full-transcript.md` + `index.md` (signal-scored topic table) + per-topic files + `summary.md`.
9. **Append-only `loop-learnings.md`** with `### [date] Innovation/Inefficiency: <name>` + What/Evidence/Action.
10. **`case-studies/<incident>.md`** SRE-style post-mortems with the numbered cascade.
11. **`methodology/scientific-method.md`** as the protocol gate.
12. **`proprietary-paradigm/`** as the output folder with a strict Claim/Source/Evidence/Delta/Test-Facility schema.
13. **Cadence-based automation** (`harness.sh`) — every N builds → retro, every M → QA, append to learnings.

---

## 3. First principles for LLM-recallable knowledge bases

### 3.1 Karpathy's LLM Wiki — the actual pattern (verbatim)

Source: Karpathy's own tweet/post (preserved in `/tmp/SOTARE/experts/karpathy/raw/llm-wiki-original-tweet-karpathy-2026-04.md`) and his gist <https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f>.

**Three layers:**

1. **Raw sources** — *"I index source documents (articles, papers, repos, datasets, images, etc.) into a `raw/` directory."* Immutable; LLM reads but never modifies.
2. **The wiki** — *"a collection of `.md` files in a directory structure. The wiki includes summaries of all the data in `raw/`, backlinks, and then it categorizes data into concepts, writes articles for them, and links them all."*
3. **The schema** — `CLAUDE.md` / `AGENTS.md` describing structure, conventions, workflows. Co-evolved.

**Three operations** (verbatim from the SOTARE-ingested gist):

> *"**Ingest.** Drop source into raw collection, tell LLM to process. Seven steps:  
> 1. LLM reads raw source  
> 2. Extracts key information — concepts, entities, claims, data points  
> 3. Writes summary page with metadata and tags  
> 4. Updates ALL existing entity/concept pages with new information  
> 5. Flags contradictions when new data conflicts with existing claims  
> 6. Updates index (master catalog)  
> 7. Appends to log (timestamped record)  
>
> One source might touch 10-15 wiki pages. The compounding effect.  
>
> **Query.** Ask questions against wiki. LLM searches index, reads relevant pages, synthesizes answer with citations. KEY INSIGHT: good answers can be filed back into wiki as new pages. Explorations compound just like ingested sources.  
>
> **Lint.** Maintenance pass. Find: contradictions between pages, stale claims superseded by newer sources, orphan pages with no inbound links, important concepts lacking pages, missing cross-references, data gaps fillable with web search."*

**Why it works** (Karpathy directly):

> *"Humans abandon wikis because the maintenance burden grows faster than the value. LLMs don't get bored, don't forget to update a cross-reference, and can touch 15 files in one pass. The cost of maintenance drops to near zero."*

And the famous closer (from his original post):

> *"raw data from a given number of sources is collected, then compiled by an LLM into a `.md` wiki, then operated on by various CLIs by the LLM to do Q&A and to incrementally enhance the wiki, and all of it viewable in Obsidian. You rarely ever write or edit the wiki manually, it's the domain of the LLM. I think there is room here for an incredible new product instead of a hacky collection of scripts."*

Indexing/logging:

- **`index.md`** — content-oriented catalog. Each page: link, one-line summary, metadata. Organized by category. "LLM reads index first to find relevant pages, then drills in. Works at ~100 sources / hundreds of pages without embeddings."
- **`log.md`** — chronological, append-only. Records ingests, queries, lint passes. Consistent prefix format → unix-tool-parseable.

Karpathy's stated scale-without-RAG: *"~100 articles and ~400K words"* maintained without embeddings, just `index.md` + LLM context window.

Frontmatter (from community implementations — Karpathy doesn't mandate but Spisak's `second-brain` and the Starmorph guide both converge on):

```yaml
---
title: <Page Title>
type: concept | entity | source-summary | comparison
sources:
  - raw/papers/<file>.md
related:
  - "[[other-concept]]"
created: YYYY-MM-DD
updated: YYYY-MM-DD
confidence: high | medium | low
---
```

Cross-references: **`[[wikilinks]]`** (Obsidian-native). Filenames: kebab-case matching the concept (`attention-mechanism.md`).

**What this means for our wiki:** we should adopt the three-layer split (`raw/` → `wiki/` → `CLAUDE.md`), the three operations, the `index.md` + `log.md` pair, frontmatter on every page, and `[[wikilinks]]` for cross-refs. We have precisely none of these today.

### 3.2 Karpathy's deeper principle: "stop building agents, build markdown files"

From the SOTARE-extracted FP `treat-llm-answers-as-executable-artifacts-only-after-they-re-validated-and-iterated.md`, exact words section:

> *"if it doesn't do produce anything good, it'll just, like, ignore it"*  
> *"you'll document what it tried. And would have, like, swear it away."*  
> *"I have to retrain my entire loop off of all these new transcriptions"*  
> *"stop building agents, right? Like build markdown files."*

The Critical Insight: *"Don't worship the model output — build a workflow where LLM responses are tentative, measurable, and continuously iterated until they earn commitment (or are explicitly rejected with evidence)."*

**What this means for our wiki:** every entry should be inspectable, paraphrasable, and rewritable as plain markdown. Avoid encoding state in vector DBs, JSON blobs, or app-specific formats when a `.md` file would do. Files-over-apps.

### 3.3 Karpathy's meta-optimization principle

From `meta-optimization-comes-from-iterating-the-process-description-itself.md`:

> *"program MD is my crappy attempt at describing like how the auto researcher should work"*  
> *"you can 100% look at where the improvements came from and like can I change the program MD such that more of these kinds of things would be done"*  
> *"write a better program MD"*

Critical Insight: *"The fastest path to better agent behavior is often to meta-optimize the agent's own instruction/workflow description — measure what helped, then rewrite the 'program MD' so future runs do more of the winning things automatically."*

**What this means for our wiki:** the `CLAUDE.md` / `README.md` of the wiki itself is a **first-class iterable artifact**. It should be re-edited every time a session reveals a missing convention. Treat it like code, not docs.

### 3.4 Andy Matuschak — Evergreen Notes (the academic ancestor)

Source: <https://notes.andymatuschak.org/Evergreen_notes>. The five canonical principles:

1. **Atomic** — one note = one idea. Combinable, recombinable.
2. **Concept-oriented** — title is the concept, not the source. (NOT "Notes on Karpathy podcast" but "Meta-optimization comes from iterating the process description.")
3. **Densely linked** — every note links to many others. Linking is the work.
4. **Prefer associative ontologies to hierarchical taxonomies** — graphs > trees. Don't pre-decide the folder hierarchy.
5. **Write notes for yourself by default, disregarding audience** — clarity emerges from honesty, not performance.

Matuschak: *"'Better note-taking' misses the point; what matters is 'better thinking.'"*

**What this means for our wiki:** the SOTARE per-FP-file naming convention (the principle IS the filename) is Matuschak-compliant. Our current `patterns/two-stage-llm-compile.md` style is partway there — it's concept-oriented, but our `projects/<slug>.md` files are source-oriented (one per project). That's fine for projects, but we should add a `concepts/` or `principles/` layer so concepts can transclude across projects.

### 3.5 Maggie Appleton — Digital Gardens

Source: <https://maggieappleton.com/garden-history>. Six principles:

1. **Topography over timelines** — organize by association, not date.
2. **Continuous growth** — ideas evolve, no "final version."
3. **Imperfection / learning in public** — show the seedlings.
4. **Playful, personal, experimental** — no cookie-cutter templates.
5. **Intercropping** — text, audio, video, diagrams, code mixed.
6. **Independent ownership** — open formats, your domain.

Most relevant for us: **#2 (continuous growth)** maps to SOTARE's "What Just Clicked Wave N" log — entries compound chronologically without ever being deleted or rewritten. **#1 (topography)** justifies the cross-link convention.

**What this means for our wiki:** every page should have a `## Status` or frontmatter `confidence: high|medium|low` so seedling-stage and mature pages are visibly distinct. Don't pretend everything is final.

### 3.6 Simon Willison — context engineering + `llms.txt`

Source: <https://simonwillison.net/tags/context-engineering/>, <https://simonwillison.net/2026/Feb/9/structured-context-engineering-for-file-native-agentic-systems/>. Willison: *"context engineering is the art of providing all the context for the task to be plausibly solvable by the LLM."* He champions the `llms.txt` pattern — a top-level markdown index of documentation that an agent can fetch to bootstrap. Claude Code itself uses `claude_code_docs_map.md` as this index.

**What this means for our wiki:** we should have an `llms.txt` (or repurpose the top-level `README.md` to that role) that an external agent can hit first to get the wiki's structure, conventions, and entry points. SOTARE's `CLAUDE.md` IS this. Our wiki's `README.md` partially is this but lacks frontmatter conventions, ID conventions, lint instructions, and an explicit "read these first" table.

### 3.7 Carlini's "context pollution prevention" (cross-applies)

From `/tmp/SOTARE/principles/carlini-principles.md`, principle #4: *"Test harness should NOT print thousands of useless bytes. At most, a few lines of output. Log everything to files that the agent can read when needed. Pre-compute aggregate statistics."*

**What this means for our wiki:** keep page bodies dense and short. Push verbosity into `raw/` or `sources/` linked artifacts. Every wiki page should answer one question; deep-dives are linked, not inlined.

### 3.8 Synthesized first principles (the short list)

| # | Principle | One-line rationale | What this means for our wiki |
|---|---|---|---|
| 1 | **Three layers** (raw / wiki / schema) | Karpathy's compiler analogy — separate truth, derived knowledge, and compilation rules. | Add `raw/` (immutable) and split `wiki/` into derived pages. `README.md` is the schema. |
| 2 | **Three operations** (ingest, query, lint) | Without lint, the wiki rots. Without query-writeback, explorations are lost. | Build a `wiki/log.md` + a `wiki/index.md` + a documented lint procedure (even if manually invoked). |
| 3 | **Verbatim first, compressed second** | SOTARE Philosophy #7. The raw human signal IS the training data for future agents. | Capture Johnny's yaps verbatim into a `raw/yaps/` folder, derived summaries elsewhere. |
| 4 | **Stable atomic IDs** for claims (H-, G-, LM-, OBJ-, D-) | Greppable; an LLM can re-attach a quote to its origin in one ripgrep. | Adopt at minimum H- (hypothesis), P- (pattern), Q- (open question) IDs. |
| 5 | **One concept per file, named after the concept** | Matuschak atomicity + concept-orientation. | Continue patterns/<concept>.md. Add concepts/ or principles/ for cross-project ideas. |
| 6 | **Frontmatter on every page** | Lets lint actually work; lets index.md auto-derive. | YAML frontmatter: title / type / sources / related / created / updated / confidence. |
| 7 | **`[[wikilinks]]` over plain links** | Densely linked notes; orphan-page detection in lint. | Adopt `[[slug]]` cross-refs in addition to current relative-path links. |
| 8 | **`live-thread.md` as the front door** | Karpathy: index.md works at ~100 pages without RAG. SOTARE: live-thread.md is the start-here. | Add a root `live-thread.md` that any session reads first. |
| 9 | **Append-only logs** (loop-learnings.md, log.md) | Compounding; never lose negative information. | Add a `wiki/log.md` for ingest/query/lint events. |
| 10 | **Files-over-apps** | Karpathy: "build markdown files." Maggie: open formats. | Don't encode state in vector DBs when a `.md` will do. (We already do this well.) |
| 11 | **Two-eyes invariant** | SOTARE: every doc must pass "fresh agent reading it is aligned" + "Johnny says yes." | Periodically spawn a fresh Claude on a wiki section and ask it Johnny's likely questions. The delta IS the lint output. |
| 12 | **Quote-block discipline** ("Exact Words" sections) | LLMs cite better when verbatim text is sectioned and ID-able. | On any synthesis page, embed source quotes in `> "..."` blocks with citations. Required for `principles/<expert>-principles.md` shape. |

---

## 4. Mapping to our current wiki

Current state of `/Users/johnnysheng/code/hackathon/research/wiki/`:

```
wiki/
├── README.md          (the index — partially Karpathy's CLAUDE.md role; no frontmatter spec, no live-thread pointer)
├── themes/            (directional anchors; this is the only place we have a "live-thread"-like changelog, embedded in theme READMEs)
│   └── ai-paradox-invisible-use-cases/
│       ├── README.md          (the lock document; 13K, has live-thread embedded)
│       ├── sources/           (per-source markdown — closest analog to SOTARE inspiration/<id>/)
│       └── window-2-research-deepening/  (this folder)
├── projects/          (per-hackathon-project teardowns; SOTARE analog: case-studies/ for the "Devpost vs reality" pattern, OR experts/<project>/ if treated as deep ingest)
├── patterns/          (cross-project architecture patterns; SOTARE analog: principles/ — but ours are tactical, not philosophical)
├── tools/             (per-tool notes; SOTARE has no direct analog — closest is experts/<tool>/ or research/<tool>.md)
├── stacks/            (empty; intended as recurring full-stack combos)
└── scrapes/           (agent-produced gallery scrapes; SOTARE analog: inspiration/<id>/ for the per-source ingest dump)
```

### 4.1 SOTARE-equivalent map

| Our folder | SOTARE equivalent | Verdict |
|---|---|---|
| `wiki/README.md` | `CLAUDE.md` (top-level schema + read-order) | Partial. Lacks Session Protocol, Workflow block, Two-Eyes invariant, and a "Read These First" table pointing at a `live-thread.md`. |
| `themes/<theme>/README.md` | `live-thread.md` for that theme + `principles/<theme>-principles.md` merged | Functional but bloated. Mixes thread-state, lock-doc, and principles in one 13K file. SOTARE splits these. |
| `themes/<theme>/sources/` | `inspiration/<source-id>/` | Close. Missing the per-source `index.md` (signal-scored topic table) and per-topic shard files. |
| `themes/<theme>/window-2-research-deepening/` | `srm-state/train-of-thought/` (verbatim yaps) + `findings/retrospectives/` | Closer to retrospectives. Numbered prefix (000, 100, 200) is a SOTARE-compatible convention. |
| `projects/<slug>.md` | No exact analog — closest is `case-studies/<incident>.md` (post-mortem shape) merged with `experts/<expert>/` (per-source deep file) | Our shape is fine. Adding the case-study "What Happened / Why / The Cascade / Fixes / Lessons / Metrics" sub-shape for each project would be a recall win. |
| `patterns/<concept>.md` | `principles/extracted/philosophy.md` (one file, all principles) but split by concept | We split better than SOTARE here. Keep this. Add the FP-file template (Principle / Exact Words / Practice / Anti-Patterns / Critical Insight) for higher recall. |
| `tools/<tool>.md` | No direct analog. SOTARE's `tools/` is *executable code*, not knowledge. Knowledge about tools lives under `experts/<tool>/` if ingested deeply. | Our shape is fine for our use case. Treat `tools/` as concept pages, not as code. |
| `stacks/` | No analog. | Empty here, empty in SOTARE. Defer until we have ≥3 stacks to cross-cite. |
| `scrapes/` | `inspiration/<source-id>/` for the bulk-source case | Functional. Add an `index.md` per scrape (signal-scored). |

### 4.2 Specifically address: do we have…?

- **A `live-thread.md`?** **No.** The closest is `themes/ai-paradox-invisible-use-cases/README.md` which embeds a live-thread changelog at the bottom, plus `window-2-research-deepening/000-coordination-and-thesis-snapshot.md` which acts as session-handoff. We need a top-level (or per-theme) `live-thread.md` with the SOTARE skeleton.
- **A `source-library.md`?** **No.** We have ingestion-queue-like content scattered across theme READMEs and `scrapes/`. We need an explicit `source-library.md` listing what's ingested, what's queued, what's faded, with status tags.
- **A `principles/`?** **Partially.** `patterns/` is concept-oriented (good) but tactical (small-p principles). We have no philosophical principles file — no SOTARE-style `philosophy.md` with 23 enumerated beliefs. We have no expert-principles files (e.g. `principles/karpathy-principles.md`).
- **`case-studies/`?** **No.** Our `projects/<slug>.md` files do some of this work but use a different template (Pitch / What's in the repo / Unique sauce / Implementation needles / Capability stack / Why it won / Reusable for us). The SOTARE incident-report shape (numbered Cascade + Lessons + Metrics) is a different and complementary recall asset.
- **`experts/`?** **No.** We have no concept of an ingested expert. The closest analog would be treating each major sponsor (K2 Think, Listen Labs, Tribe V2, etc.) as an "expert" with `experts/k2-think/raw/`, `first-principles/`, `expert-prompt.md`. This would massively raise recall for sponsor-fit questions.
- **`hypotheses.md` with stable IDs?** **No.** We have implicit hypotheses scattered through theme READMEs ("the 5-sponsor lens fits if..."). No H-XXX IDs, no Status column.
- **`log.md` (append-only)?** **No.** Git history is the only log. SOTARE has both git AND a human-readable `loop-learnings.md` (append-only) and per-session retros.
- **`index.md` (Karpathy-style content catalog)?** **Partially.** `wiki/README.md` has an Index section. But it's not in a category-organized one-line-per-page format with metadata. Closer to a TOC than a Karpathy index.

---

## 5. Recommended reorganization (concrete file moves / renames / new files)

> Per the Socratic rule active under this theme, this section proposes **how to structure the wiki for recall**, not what the project should be.

### 5.1 New top-level files (create now)

| Path | Shape | Purpose |
|---|---|---|
| `research/wiki/CLAUDE.md` (new) | SOTARE CLAUDE.md template (Read-These-First table + Workflow + Session Protocol + Two-Eyes invariant + Conventions block listing frontmatter spec, ID conventions, `[[wikilinks]]`, naming) | The wiki's schema. Distinct from `README.md` (which stays human-facing). |
| `research/wiki/live-thread.md` (new) | SOTARE live-thread skeleton (Active Right Now / What Just Clicked Wave-N / Prior Clicks / Open Threads / Closed Threads / Active Hypotheses table / Decision Count / Artifacts / Hard Deadlines) | The session front door. Updated end-of-session, never deleted. |
| `research/wiki/source-library.md` (new) | Tables: Currently Loaded / Ingested Sources (Videos, Repos, Articles) / Ingestion Queue (must / high / future / faded) / People & Thinkers | What we know about + the priority queue of what to ingest next. |
| `research/wiki/log.md` (new, append-only) | `YYYY-MM-DD HH:MM | INGEST|QUERY|LINT | <one-line-summary>` | Karpathy-style append-only operation log. Greppable. |
| `research/wiki/index.md` (new) | Category-organized: Themes / Projects / Patterns / Tools / Sources / Experts / Hypotheses, one line per page with frontmatter-derived summary | The Karpathy `index.md` — content catalog for both LLM and human. |
| `research/wiki/llms.txt` (new, optional) | Willison-style top-level pointer file pointing at CLAUDE.md + index.md + live-thread.md | Bootstrap for external agents pulling our wiki. |

### 5.2 New folders (create as needed)

| Path | Shape | Purpose |
|---|---|---|
| `research/wiki/principles/` | One file per "expert" (`karpathy-principles.md`, `matuschak-principles.md`, `appleton-principles.md`, `willison-principles.md`, `johnny-profile.md`) using the SOTARE expert-principles template | Philosophical lens layer. Different from `patterns/` which is tactical. |
| `research/wiki/principles/extracted/` | `philosophy.md` (numbered beliefs), `hypotheses.md` (H-XXX cards with Source/Statement/Test/Status), `actionable-objectives.md` (OBJ-N in dependency order) | Compressed second pass over the raw principles. |
| `research/wiki/raw/` | Verbatim-only folder. Subfolders: `yaps/` (Johnny's transcribed yapping per session), `clones/` (gitignored repo clones), `articles/` (clipped web articles), `videos/<id>/` (full transcripts) | The Karpathy `raw/`. Immutable. Source of truth. |
| `research/wiki/raw/yaps/` | `yap-YYYY-MM-DD-NNN-<slug>.md` | Per-session verbatim. Mirrors SOTARE's `srm-state/train-of-thought/`. |
| `research/wiki/experts/<expert>/` | `config.yaml` + `raw/` + `first-principles/` (kebab-case-named, FP template) + `sources/` + `expert-prompt.md` | Per-deep-source knowledge unit. Use for sponsors (k2-think, listen-labs, ironside, tribe-v2). |
| `research/wiki/case-studies/` | `<incident>.md` with What Happened / Why / The Cascade / Fixes / Lessons / Metrics | Post-mortems and "decision retro" entries. |
| `research/wiki/methodology/` | `socratic-protocol.md`, `bmad-elicitation.md`, `pre-mortem.md`, `red-team.md`, `yc-stress-test.md`, `scientific-method.md` (lifted from SOTARE) | Process protocols. Cited from theme READMEs. |
| `research/wiki/scrapes/<scrape>/` (folder, not flat) | `full-source.md` + `index.md` (signal-scored table) + per-topic shard files | Lifts SOTARE's `inspiration/<id>/` shape. Current `scrapes/treehacks-2026-winners.md` becomes `scrapes/treehacks-2026-winners/full-source.md` + `index.md` + per-project shards. |

### 5.3 Frontmatter spec (apply to every wiki page)

```yaml
---
id: P-002                        # stable atomic ID; type prefix per table below
title: Two-stage LLM compile
type: pattern                    # theme | project | pattern | tool | stack | source | concept | expert-fp | case-study | hypothesis | objective
status: validated                # seedling | growing | validated | superseded | faded
confidence: high                 # high | medium | low
sources:                         # links to raw/ files or other wiki pages
  - "[[projects/bridge]]"
  - "[[projects/greenchain]]"
related:
  - "[[patterns/robust-json-from-llms]]"
  - "[[patterns/grounded-citation]]"
created: 2026-04-25
updated: 2026-04-25
authors: [johnny, claude]
---
```

ID type prefixes (greppable atoms):

| Prefix | Type | Example |
|---|---|---|
| `T-` | Theme | T-001 ai-paradox-invisible-use-cases |
| `P-` | Project | P-003 jarvis |
| `PA-` | Pattern | PA-002 two-stage-llm-compile |
| `TO-` | Tool | TO-001 k2-think |
| `S-` | Source / scrape | S-007 treehacks-2026-winners |
| `H-` | Hypothesis | H-001 best-use-of-ai-thesis |
| `Q-` | Open question | Q-001 b2c-vs-b2b-hero-surface |
| `D-` | Decision | D-014 lean-into-tribe-v2 |
| `LM-` | Learned method | LM-001 socratic-rule-prevents-claude-proposing-projects |
| `G-` | Gotcha / case study | G-001 stale-baseline-incident |
| `OBJ-` | Objective / build queue item | OBJ-002 wire-tribe-v2-into-actor-auditor |
| `FP-<expert>-` | First principle of expert | FP-karpathy-007 stop-building-agents-build-markdown-files |

### 5.4 Naming conventions

- **Files:** kebab-case, named after the concept itself (Matuschak rule). For numbered notes (this folder uses 000/100/200 prefixes), keep that; the prefix is the read-order, the slug is the concept.
- **Folders:** kebab-case, plural for collections (`patterns/`, `tools/`), singular only when there's exactly one canonical artifact.
- **Cross-references:** `[[slug]]` for intra-wiki, full markdown links for external.
- **Quotes:** every verbatim quote in a `> "..."` block, attributed inline `(Karpathy, 2026)` or via `sources:` frontmatter.
- **IDs:** bolded inline at first mention, e.g. **G-001 (stale-baseline-incident)**.

### 5.5 Concrete moves

| From | To | Reason |
|---|---|---|
| `wiki/scrapes/treehacks-2026-winners.md` | `wiki/scrapes/treehacks-2026-winners/full-source.md` + new `index.md` + per-project shards | Lifts SOTARE per-source folder pattern; enables greppable signal-scored entry. |
| `wiki/themes/ai-paradox-invisible-use-cases/README.md` (the live-thread changelog block at bottom) | Extract to `wiki/themes/ai-paradox-invisible-use-cases/live-thread.md` | Separate active state from the lock document. README stays as the schema/anchor; live-thread becomes the session front door. |
| `wiki/themes/ai-paradox-invisible-use-cases/sources/` | Stays. Add a `sources/index.md` with frontmatter-derived summaries. | Keep current shape; add the index. |
| `wiki/README.md` | Stays as human-facing intro. Add `wiki/CLAUDE.md` as the LLM contract sibling. | Two-audience split. README sells, CLAUDE.md instructs. |
| `wiki/patterns/<file>.md` | Stays in place. Add frontmatter + `[[wikilinks]]` per spec above. | Cheap recall win. |

### 5.6 Lint procedure (manual, then automate)

Document as `wiki/CLAUDE.md` § Lint, executable by any Claude session reading the wiki:

```
1. Read wiki/index.md and wiki/log.md.
2. For each page in wiki/, check:
   a. Frontmatter present and valid (all required fields).
   b. All sources: links resolve.
   c. All related: [[wikilinks]] resolve to existing pages.
   d. created / updated dates present.
   e. status field present and one of {seedling, growing, validated, superseded, faded}.
3. Build the implicit cross-link graph. Flag:
   - Orphan pages (no inbound [[wikilinks]] AND no inbound sources: refs).
   - Missing concept pages (a page references [[X]] but X.md does not exist).
   - Stale pages (updated > 30 days ago AND status != faded|superseded).
   - Contradiction candidates (two pages making opposite claims about the same entity — heuristic, requires LLM judgment).
4. Write the report to wiki/log.md as a LINT entry with date.
5. Optionally: write actionable items to wiki/lint-action-items.md for the next ingest pass to consume (mirrors SOTARE's state/retro-action-items.md).
```

Run cadence: every Nth ingest (SOTARE: every 5 builds). For a hackathon timeline, every meaningful session-close.

### 5.7 Automation hooks (optional, low-effort wins)

- `tools/wiki-lint.sh` (new) — wraps the lint procedure as a one-shot Claude invocation, piped into `wiki/log.md`.
- `tools/wiki-index.sh` (new) — regenerates `wiki/index.md` by walking all pages and reading their frontmatter `title` + `type` + `status` + `confidence`. Pure script, no LLM needed.
- `tools/wiki-yap-ingest.sh` (new, when needed) — takes a recorded yap, transcribes, drops verbatim into `raw/yaps/yap-<date>-<NNN>-<slug>.md`, then spawns a Claude session whose prompt is "ingest this per CLAUDE.md § Workflow; touch all relevant pages; append to log.md."
- Reuse SOTARE's `harness.sh` shape if we need a cadenced auto-loop later.

---

## 6. Sources

### Primary (Karpathy and SOTARE — verified)

- Karpathy original tweet/post — captured verbatim in `/tmp/SOTARE/experts/karpathy/raw/llm-wiki-original-tweet-karpathy-2026-04.md`
- Karpathy LLM Wiki gist — <https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f> (the full operation-level spec was extracted into `/tmp/SOTARE/experts/karpathy/raw/llm-wiki-gist-karpathy-2026-04.md`)
- SOTARE local clone at `/tmp/SOTARE`. Specific files cited:
  - `/tmp/SOTARE/CLAUDE.md`
  - `/tmp/SOTARE/live-thread.md`
  - `/tmp/SOTARE/source-library.md`
  - `/tmp/SOTARE/research-state.md`
  - `/tmp/SOTARE/SCOUT_REPORT.md`
  - `/tmp/SOTARE/next-session-handoff.md`
  - `/tmp/SOTARE/harness.sh`
  - `/tmp/SOTARE/principles/karpathy-principles.md`
  - `/tmp/SOTARE/principles/carlini-principles.md`
  - `/tmp/SOTARE/principles/ralph-principles.md`
  - `/tmp/SOTARE/principles/johnny-profile.md`
  - `/tmp/SOTARE/principles/extracted/philosophy.md`
  - `/tmp/SOTARE/principles/extracted/hypotheses.md`
  - `/tmp/SOTARE/principles/extracted/actionable-objectives.md`
  - `/tmp/SOTARE/proprietary-paradigm/README.md`
  - `/tmp/SOTARE/methodology/scientific-method.md`
  - `/tmp/SOTARE/case-studies/stale-baseline-incident.md`
  - `/tmp/SOTARE/findings/learnings/loop-learnings.md`
  - `/tmp/SOTARE/experts/karpathy/config.yaml`
  - `/tmp/SOTARE/experts/karpathy/first-principles/meta-optimization-comes-from-iterating-the-process-description-itself.md`
  - `/tmp/SOTARE/experts/karpathy/first-principles/treat-llm-answers-as-executable-artifacts-only-after-they-re-validated-and-iterated.md`
  - `/tmp/SOTARE/inspiration/kwSVtQ7dziU/index.md`

### Secondary (community implementations of Karpathy LLM Wiki — verified via WebFetch)

- NicholasSpisak/second-brain — <https://github.com/NicholasSpisak/second-brain> (Obsidian-flavored implementation; contributed the `raw/` + `wiki/sources/`, `wiki/entities/`, `wiki/concepts/`, `wiki/synthesis/` folder shape and the four-skill split: `/second-brain`, `/second-brain-ingest`, `/second-brain-query`, `/second-brain-lint`)
- Starmorph "How to Build Karpathy's LLM Wiki: Complete Guide" — <https://blog.starmorph.com/blog/karpathy-llm-wiki-knowledge-base-guide> (contributed the YAML frontmatter spec and the explicit 5-step ingest workflow; this is a community condensation of Karpathy's gist, not Karpathy himself)

### Secondary (first-principles authors — verified via WebFetch)

- Andy Matuschak — Evergreen Notes — <https://notes.andymatuschak.org/Evergreen_notes>
- Maggie Appleton — Garden History — <https://maggieappleton.com/garden-history>
- Simon Willison — context engineering tag — <https://simonwillison.net/tags/context-engineering/>
- Simon Willison — Structured Context Engineering for File-Native Agentic Systems — <https://simonwillison.net/2026/Feb/9/structured-context-engineering-for-file-native-agentic-systems/>

### Tertiary (referenced but not fully fetched — flagged unverified)

- DAIR.AI Academy — "LLM Knowledge Bases" Karpathy writeup — <https://academy.dair.ai/blog/llm-knowledge-bases-karpathy> *(unverified; surfaced in search, not fetched)*
- VentureBeat — "Karpathy shares LLM Knowledge Base architecture" — <https://venturebeat.com/data/karpathy-shares-llm-knowledge-base-architecture-that-bypasses-rag-with-an> *(unverified; surfaced in search, not fetched)*
- MindStudio — "What Is Andrej Karpathy's LLM Wiki" — <https://www.mindstudio.ai/blog/andrej-karpathy-llm-wiki-knowledge-base-claude-code> *(unverified)*
- Plaban Nayak — "Beyond RAG: Karpathy's LLM Wiki Pattern" — <https://levelup.gitconnected.com/beyond-rag-how-andrej-karpathys-llm-wiki-pattern-builds-knowledge-that-actually-compounds-31a08528665e> *(unverified)*
- Tahir — "What is LLM Wiki Pattern?" — <https://medium.com/@tahirbalarabe2/what-is-llm-wiki-pattern-persistent-knowledge-with-llm-wikis-3227f561abc1> *(unverified)*
- Urvil Joshi — "Andrej Karpathy's LLM Wiki: Create your own knowledge base" — <https://medium.com/@urvvil08/andrej-karpathys-llm-wiki-create-your-own-knowledge-base-8779014accd5> *(unverified)*
- Rohit G — "LLM Wiki v2 — extending Karpathy's pattern with lessons from agentmemory" — <https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2> *(unverified; flagged because the gist title claims to extend Karpathy's pattern with formation-trigger and decay mechanisms — relevant to OMEGA's "formation problem" referenced in SOTARE's gist ingest)*

### Honest gaps

- **Karpathy DOES have an explicit LLM wiki pattern** — the gist + the original tweet/post are it. We did not have to substitute. The community implementations (Spisak, Starmorph) flesh out frontmatter and folder shapes that Karpathy himself underspecifies, and we used those to fill the recipe.
- **The `tools/` automation in SOTARE** (10+ Python scripts: `ingest.py`, `consult.py`, `verify-sources.sh`, etc.) is *implementation* not *pattern*. We extracted the pattern (cadenced auto-loop, append-to-learnings, retro-action-items as machine-readable handoff) but did not deep-read each script. If the user wants the automation lifted, that's a separate pass.
- **The `proprietary-paradigm/` folder is nearly empty in SOTARE** — only a README defining the schema. So we lifted the schema (Claim/Source/Evidence/Delta/Test-Facility) but had no example entries to study.
- **`vision-v1-part19-full-yap-verbatim.md`** (36KB) and the rest of the `vision-v1-partN.md` series were sampled, not exhaustively read. The pattern they instantiate (verbatim + two derived files: `-new-hypotheses.md` and `-reasoning-chains.md`) is the load-bearing convention and was extracted.
