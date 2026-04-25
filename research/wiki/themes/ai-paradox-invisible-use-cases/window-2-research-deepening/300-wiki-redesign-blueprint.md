# 300 — Wiki redesign blueprint (LLM Wiki + SOTARE pattern, applied to `research/`)

> **Status:** blueprint, not yet applied. Execute AFTER (a) the other window's `research/ideation-sweep` branch consolidates into `main` and (b) the SOTARE structural teardown agent lands at `200-llm-wiki-recall-patterns-sotare-and-karpathy.md`. This file proposes the new structure, conventions, and migration plan. The actual `git mv` happens in a clearly-tagged commit so it's reviewable in one diff.

> **Authority for this file:** the user explicitly authorized wiki-architecture work — *"you are in charge of designing the entire research wiki."* The Socratic rule still binds the *project idea* (Johnny names it; Claude reflects). It does NOT bind wiki structure, PRD scaffolding, demo-packaging principles, or schema conventions.

## Three primary sources for the redesign

1. [`sources/007-karpathy-llm-wiki-pattern.md`](sources/007-karpathy-llm-wiki-pattern.md) — the canonical pattern essay (verbatim).
2. SOTARE (`/tmp/SOTARE/`) — Johnny's own meta-research lab. Top-level idiom: `live-thread.md` · `source-library.md` · `research-state.md` · `SCOUT_REPORT.md` · `CLAUDE.md` · `principles/` · `methodology/` · `findings/` · `inspiration/` · `case-studies/` · `experts/` · `experiments/` · `metaharness/` · `tools/auto-research/` · `harness.sh`. Deep teardown landing at [`200-llm-wiki-recall-patterns-sotare-and-karpathy.md`](200-llm-wiki-recall-patterns-sotare-and-karpathy.md) (background agent still running).
3. Existing wiki state under `research/wiki/` and `research/sponsors/` — what we already have, what stays, what gets re-shaped.

## The first-principles distillation

From Karpathy's essay, three principles that override everything else:

1. **Three layers, one direction of writes.**
   - **Raw sources** — immutable. LLM reads only.
   - **The wiki** — LLM writes; human reads.
   - **The schema** — co-evolved (`CLAUDE.md`).
   *Anything that violates this — e.g. humans editing wiki entries directly, or LLM modifying raw sources — breaks the model.*
2. **The wiki compounds; the chat does not.** *"Good answers can be filed back into the wiki as new pages. A comparison you asked for, an analysis, a connection you discovered — these are valuable and shouldn't disappear into chat history."* Every meaningful Claude response in this thread that we want to keep MUST land as a wiki page.
3. **`index.md` + `log.md` are not optional.** Index = content-oriented catalog (front door for query). Log = chronological append-only with greppable prefixes (front door for "what just happened?"). Both replace embedding-RAG infra at our scale.

From SOTARE's idiom, three more:

4. **`live-thread.md` is a *directional* changelog.** Distinct from `log.md` (operational). The live thread captures shifts in framing, hypothesis, and direction — what the project *is becoming.* Our existing `themes/ai-paradox-invisible-use-cases/README.md` already has a "Live thread" section; promote it to a top-level file at theme-level.
5. **Separate `findings/` from `sources/`.** Sources are inputs; findings are synthesized outputs. Our current themes/ folder collapses these — sources sit next to the synthesis. Split.
6. **`principles/` is its own directory.** Cross-cutting first-principles surface here, not buried inside theme readmes. They're queryable: *"what are our principles for X?"*

## The new tree (proposed)

```
research/
├── CLAUDE.md                     ← THE SCHEMA (Layer 3) — wiki-maintenance contract
├── README.md                     ← Human-facing entry point (what is this repo)
│
├── wiki/                         ← THE WIKI (Layer 2) — LLM writes; human reads
│   ├── index.md                  ★ Karpathy: content catalog (front door)
│   ├── log.md                    ★ Karpathy: append-only operations log
│   ├── live-thread.md            ★ SOTARE: directional changelog
│   ├── overview.md               ★ Karpathy: the synthesis-of-syntheses page
│   │
│   ├── themes/                   ← Directional anchors (KEEP)
│   │   └── ai-paradox-invisible-use-cases/
│   │       ├── README.md         (the lock document)
│   │       └── (sources/ moves out — see Layer 1)
│   │
│   ├── concepts/                 ★ NEW. Term pages. Each = one definition + cited usages.
│   │                             (trends-slop.md, comprehension-debt.md, jagged-frontier.md,
│   │                              filter-world.md, augmented-intelligence.md, emotivist-layer.md,
│   │                              actor-auditor-mediator.md, mind-as-gap.md, double-distortion.md, ...)
│   │
│   ├── entities/                 ★ NEW. Atomic pages for things-that-exist.
│   │   ├── people/               (Karpathy.md, Hak.md, Levin.md, JeanRemiKing.md, ...)
│   │   ├── products/             (tribe-v2.md, k2-think.md, dedalus.md, claude-agent-sdk.md,
│   │   │                          v-jepa-2.md, w2v-bert.md, llama-3.2.md, midas.md, mediapipe.md,
│   │   │                          yolov8.md, modal.md, vapi.md, browserbase.md, ...)
│   │   ├── sponsors/             ← consolidate research/sponsors/<x>/SOURCES.md → here
│   │   ├── projects/             ← move research/wiki/projects/* → here
│   │   ├── studies/              (algonauts-2025.md, harvard-trends-slop.md,
│   │   │                          seniority-biased-tech-change.md, geometer-benchmark.md, ...)
│   │   └── companies/            (Meta.md, Krafton.md, AgentiveStack.md, ...)
│   │
│   ├── patterns/                 ← Architectural patterns (KEEP)
│   ├── stacks/                   ← Tech-stack combos (KEEP, currently empty)
│   ├── tools/                    ← Tool notes (KEEP — overlaps with entities/products; see migration)
│   │
│   ├── findings/                 ★ NEW. Synthesized insights crossing 2+ sources.
│   │                             (winning-archetypes-2026.md, sponsor-overlap-matrix.md,
│   │                              demo-theatre-patterns.md, anti-slop-architectures.md, ...)
│   │
│   ├── threads/                  ★ NEW. Open questions, unresolved tensions.
│   │                             (b2c-vs-b2b-hero.md, federation-or-not.md,
│   │                              auditor-visibility.md, ...)
│   │
│   ├── principles/               ★ NEW (SOTARE idiom). Cross-cutting first-principles.
│   │                             (socratic-interaction.md, claimed-vs-verified.md,
│   │                              demo-over-execution.md, three-layer-wiki.md, ...)
│   │
│   ├── decks/                    ★ NEW (optional). Marp slide decks generated from wiki.
│   │                             (theme-pitch.md, sponsor-deck.md, ...)
│   │
│   ├── prd/                      ★ NEW. The hero output. PRD + scaffolds + iterations.
│   │   ├── README.md
│   │   ├── current-prd.md        ← the canonical PRD (kept current)
│   │   ├── demo-scenario.md      ← the demo storyboard (the most-important file in the repo)
│   │   ├── sponsor-mapping.md    ← per-sponsor pitch + integration hook
│   │   ├── build-plan.md         ← hour-by-hour hackathon plan
│   │   ├── risk-register.md      ← what could break + mitigations
│   │   └── pitches/              (15-sec, 60-sec, 5-min variants)
│   │
│   └── scrapes/                  ← KEEP for now (large gallery scrapes are a hybrid type)
│
└── sources/                      ★ NEW (Layer 1 — RAW, IMMUTABLE)
    ├── README.md                 (curation policy)
    ├── transcripts/              ← move themes/.../sources/00N-*.md → here, renamed by date
    │   └── 2026-04-25-hak-systems-thinking.md
    │   └── 2026-04-25-algorithmic-culture-flattening.md
    │   └── 2026-04-25-trends-slop.md
    │   └── 2026-04-25-multi-agent-alignment.md
    │   └── 2026-04-25-kurzgesagt-secret-mind.md
    │   └── 2026-04-25-tribe-v2.md
    ├── essays/
    │   └── 2026-karpathy-llm-wiki-pattern.md
    ├── papers/                   ← put primary research papers here when verified
    ├── repos/                    ← move sponsors/*/clones/* → here
    │   ├── bridge/                       (verified)
    │   ├── greenchain/                   (verified)
    │   ├── treehacks-2026-mira/          (next-clone target)
    │   └── treehacks-2026-tribune/       (next-clone target)
    ├── scrapes-raw/              ← raw HTML/JSON dumps from agent scrapes
    └── images/                   ← screenshots, diagrams (the 2 Jarvis pipeline diagrams go here)
```

## Mapping the migration (existing → new)

| Current | Target | Notes |
|---|---|---|
| `research/wiki/README.md` | `research/wiki/index.md` | Promote to canonical content catalog; cross-link to overview/log/live-thread |
| `research/wiki/themes/ai-paradox-invisible-use-cases/README.md` | unchanged | Stays as the theme lock document; remove embedded "live thread" section after promoting to `wiki/live-thread.md` |
| `research/wiki/themes/ai-paradox-invisible-use-cases/sources/00N-*.md` | `research/sources/transcripts/2026-04-25-<slug>.md` (raw) + `research/wiki/findings/00N-<slug>-extract.md` (synthesis) | **Split: raw transcript → sources; key-extracts + maps-to-theme → findings.** Karpathy's three-layer rule. |
| `research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/*` | merge into `wiki/findings/`, `wiki/threads/`, `wiki/prd/` per content type | Window-2's role was scratch; output graduates to permanent locations |
| `research/wiki/projects/*.md` | `research/wiki/entities/projects/*.md` | Semantically projects ARE entities |
| `research/wiki/patterns/*.md` | `research/wiki/patterns/` | Stay |
| `research/wiki/tools/*.md` | `research/wiki/entities/products/*.md` (renamed) | A "tool" IS a product entity; collapse the duplication |
| `research/sponsors/<x>/SOURCES.md` | `research/wiki/entities/sponsors/<x>.md` | Consolidate one-page-per-sponsor |
| `research/sponsors/<x>/analysis/*.md` | `research/wiki/findings/<x>-<topic>.md` | Synthesis output |
| `research/sponsors/<x>/clones/*` | `research/sources/repos/<x>/` | Raw third-party code = source |
| `research/wiki/scrapes/treehacks-2026-winners.md` | `research/wiki/findings/treehacks-2026-winners.md` (synthesis) + `research/sources/scrapes-raw/treehacks-2026-winners-raw.json` (if we have the raw json) | The scrape itself is a finding; the raw HTML/JSON would be source |
| `_bmad/`, `caltech/`, `feesh/` | unchanged | Outside the wiki concern |

## The schema document — `research/CLAUDE.md`

This is the file Karpathy calls "the key configuration file — what makes the LLM a disciplined wiki maintainer rather than a generic chatbot." Below is a draft to commit at the top of `research/`. It encodes:

- The three-layer rule
- File-naming conventions
- Frontmatter schema
- Cross-link syntax
- The ingest/query/lint operations
- The Socratic interaction rule (theme-scoped)

```markdown
# research/CLAUDE.md — wiki maintainer contract

This directory is an LLM Wiki (Karpathy pattern, see sources/essays/2026-karpathy-llm-wiki-pattern.md).

## The three-layer rule (do not violate)

1. `sources/` — RAW. Never edit. Read-only for the LLM.
2. `wiki/` — LLM writes; human reads. The LLM owns this layer.
3. `CLAUDE.md` (this file) — co-evolved between LLM + human.

## File naming

- Sources: `sources/<type>/<YYYY-MM-DD>-<slug>.md` (e.g. `sources/transcripts/2026-04-25-tribe-v2.md`)
- Wiki entities: `wiki/entities/<kind>/<slug>.md`, lowercase-hyphenated (e.g. `wiki/entities/products/tribe-v2.md`)
- Wiki findings: `wiki/findings/<topic>.md` — multi-source synthesis
- Wiki concepts: `wiki/concepts/<term>.md` — single term, defined + cited
- Wiki threads: `wiki/threads/<question>.md` — open questions
- Wiki principles: `wiki/principles/<rule>.md` — first-principles
- PRD: `wiki/prd/<doc>.md`

## Frontmatter (every wiki page)

```yaml
---
type: source | entity | concept | finding | thread | principle | pattern | stack | prd
kind: <subtype>           # for entities: people/products/sponsors/projects/studies/companies
slug: <hyphenated>
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources:                  # source files this page is derived from
  - sources/transcripts/2026-04-25-tribe-v2.md
links:                    # other wiki pages this page references
  - wiki/concepts/trends-slop.md
status: live | stale | archived
---
```

## Cross-link syntax

Use relative markdown links: `[Tribe V2](../entities/products/tribe-v2.md)`. Always link first mention. The wiki's value is the graph.

## Operations

- **Ingest** (new source lands in `sources/`):
  1. Read source.
  2. Discuss takeaways with Johnny.
  3. Create `sources/<type>/<date>-<slug>.md` with full content + key-extracts header.
  4. Create or update `wiki/findings/<topic>.md` with synthesis.
  5. Update or create relevant `wiki/concepts/`, `wiki/entities/` pages.
  6. Append entry to `wiki/log.md`: `## [YYYY-MM-DD] ingest | <source title>`.
  7. Append entry to `wiki/live-thread.md` ONLY if the source meaningfully shifts framing/hypothesis/direction.
  8. Update `wiki/index.md` for any new pages.

- **Query** (Johnny asks a question):
  1. Read `wiki/index.md` first; identify candidate pages.
  2. Drill into pages; cite specifically.
  3. If the answer is novel synthesis worth keeping, file it as a new `wiki/findings/` or `wiki/concepts/` page and link from the answer.
  4. Append to `wiki/log.md`: `## [YYYY-MM-DD] query | <question>`.

- **Lint** (periodic, on demand or weekly):
  1. Find contradictions across pages.
  2. Find stale claims that newer sources have superseded.
  3. Find orphan pages (no inbound links).
  4. Find concepts mentioned but lacking a page.
  5. Suggest new questions / new sources to investigate.
  6. Output: `wiki/findings/lint-YYYY-MM-DD.md`.

## Theme-scoped behavior — Socratic rule (active under `wiki/themes/ai-paradox-invisible-use-cases/`)

When working on the active HackTech 2026 ideation theme:
- Johnny names the project idea / hypothesis. Claude does not.
- Reflect, sharpen, surface evidence — don't propose.
- See `wiki/principles/socratic-interaction.md` for the full rule.
- Does NOT bind: wiki structure, PRD scaffolding, demo-packaging principles, schema, ingest/lint operations. Those are Claude's domain.

## Lint cadence

- After every Claude session that touched 3+ wiki files.
- Before generating any pitch / PRD revision.
- Before merging a worktree branch into main.
```

## Migration order (when authorized to apply)

1. **Create new top-level dirs** (empty + `.gitkeep`): `sources/`, `wiki/concepts/`, `wiki/entities/{people,products,sponsors,projects,studies,companies}`, `wiki/findings/`, `wiki/threads/`, `wiki/principles/`, `wiki/prd/`, `wiki/decks/`.
2. **Write `research/CLAUDE.md`** (the schema above).
3. **Write `wiki/index.md`** + `wiki/log.md` + `wiki/live-thread.md` + `wiki/overview.md` (initial scaffolds with current state).
4. **Move source transcripts** out of `themes/.../sources/` → `sources/transcripts/<date>-<slug>.md` (one `git mv` per file with redirect note in source's old location for one commit, then delete).
5. **Split each transcript:** raw content stays in `sources/`; the key-extracts + how-it-maps-to-theme become a new `wiki/findings/<slug>-extract.md`.
6. **Reshape `projects/` → `entities/projects/`, `tools/` → `entities/products/`.** Add frontmatter to every page.
7. **Consolidate `research/sponsors/<x>/SOURCES.md` + `analysis/*.md` → `wiki/entities/sponsors/<x>.md` + `wiki/findings/<x>-*.md`.** Move `clones/` → `sources/repos/`.
8. **Promote the live thread** out of `themes/.../README.md` into `wiki/live-thread.md`. Theme README references it.
9. **Write `wiki/principles/socratic-interaction.md`, `claimed-vs-verified.md`, `demo-over-execution.md`, `three-layer-wiki.md`.**
10. **Write `wiki/prd/current-prd.md` from the scaffold at [`400-prd-scaffold.md`](400-prd-scaffold.md).**
11. **Run a lint pass.** Output: `wiki/findings/lint-2026-04-25.md`.

This is one large commit by intent — wiki-shape changes are easier to review in one diff than across a dozen partial commits.

## Cross-window / cross-branch caveats

- Window 1 (other Claude session, branch `research/ideation-sweep`) is currently consolidating into main. Window 2 (this session, branch `caltech/ideation/window-2`) waits for that to land.
- After window-1's merge: pull main into this branch (`git merge main` or `git rebase main`), resolve any conflicts, then apply the migration above as a single commit on this branch.
- Final merge of this branch into main carries: window-2 sources + synthesis + redesign + PRD scaffold.

## Background-agent persistence (the "constantly running" directive)

Karpathy's `index.md` + `log.md` already do most of this passively. To go further per Johnny's directive, install one of these as a recurring backgrounded loop after the redesign lands:
- **`bmad-distillator`** (already installed) — pre-existing BMAD skill; can be wrapped in a cron-style loop to re-read wiki + emit "what's high-signal that's not yet a concept page" diffs.
- **`bmad-index-docs`** (already installed) — auto-maintain `wiki/index.md`.
- **`Jeffallan/claude-skills` "The Fool"** (just installed) — periodic Pre-Mortem / Red-Team passes on `wiki/prd/current-prd.md`, output to `wiki/findings/`.
- **SOTARE-style `harness.sh`** — port the auto-research loop pattern. Defer until after migration; it's not load-bearing for the hackathon, but it's the right long-term shape.

The Skill tool can invoke each manually before that wrapping is in place.
