---
file-type: finding
status: verified
last-verified: 2026-04-25
supports-decisions: []
cites-sources:
  - lint-2026-04-25.md
  - prd-builder-reading-order-verification.md
  - ../README.md
  - ../decisions/README.md
  - ../themes/ai-paradox-invisible-use-cases/README.md
  - ../themes/ai-paradox-invisible-use-cases/vocabulary.md
  - ../../../caltech/CONSOLIDATION-REPORT.md
  - ../../../.claude/skills/llm-wiki-navigator/SKILL.md
cross-links:
  - lint-2026-04-25.md
  - prd-builder-reading-order-verification.md
---

# QA — research completeness + searchability + process cleanliness

Final QA pass before handing off to the PRFAQ session. Three checks:
**(1) all research consulted** · **(2) searchable by concept / idea / theme** · **(3) overall process clean**.

## Verdict

**✅ PASS — ready for PRFAQ.** Coverage strong across 25 concepts; reachability strong for 51 of 51 indexable wiki+caltech files; window-2 feedstock fully indexed; one set of orphans found (4 caltech/context files) was patched in the navigator skill.

## Inventory

| Location | .md files (tracked) | Notes |
|---|---|---|
| `research/wiki/` | 56 | the LLM wiki proper |
| `research/sponsors/` | 6 (+ 5 inside cloned repos) | inboxes only; canonical sponsor info lives at `caltech/context/sponsors/` |
| `caltech/context/` | 25 | event / sponsors / tracks / team / yaps / architecture / constraints / track-strategy |
| `caltech/ideation/` | 5 | other-window ideation sweep + INDEX |
| `caltech/` (root) | 3 | RESEARCH-CONSOLIDATION-PROTOCOL, CONSOLIDATION-REPORT, HANDOFF |
| `_bmad/hackathon-suite/` | 75 | BMAD framework support files (not project research) |
| `.claude/skills/` | 299 | installed skills (mostly third-party; project-specific: ship-velocity + llm-wiki-navigator) |
| `.claude/commands/` | 16 | BMAD command bridges |
| **Total tracked .md** | **485** | |

## Check 1 — all research consulted

### Concept searchability (25 load-bearing concepts × file-count grep)

| Concept | files | Concept | files |
|---|---|---|---|
| trends slop | 17 | TRIBE | 40 |
| comprehension debt | 10 | K2 Think | 28 |
| Filter World | 15 | agent swarm | 12 |
| jagged frontier | 6 | witnessed dissent | 7 |
| augmented | 16 | actor / auditor | 21 |
| un-black-box | 20 | spatial sidecar | 5 |
| Localize-and-Zoom | 11 | grounded citation | 10 |
| two-stage | 17 | Karpathy | 17 |
| SOTARE | 8 | Ironsite | 13 |
| Listen Labs | 32 | Socratic | 31 |
| memento | 9 | renaissance | 17 |
| Tribe V2 | 39 | B2C | 20 |
| demo theatre | 12 | | |

**0 missing concepts.** Every load-bearing term registers ≥5 hits across the wiki + context. The thinnest concept (spatial sidecar) appears in 5 files; the most-saturated (TRIBE) in 40. No concept is one-place-only or undefined.

### Window-2 research-deepening indexing

All 13 files in `themes/ai-paradox-invisible-use-cases/window-2-research-deepening/` are reachable from outside the folder. Inbound-reference counts:

| File | Outside refs |
|---|---|
| `500-elicitation-qa-pass.md` | 11 (heavily cited — T1 lives here) |
| `501-party-mode-roundtable.md` | 10 (T2 lives here) |
| `sources/004-multi-agent-alignment-actor-auditor-mediator.md` | 8 |
| `300-wiki-redesign-blueprint.md` | 5 |
| `sources/006-tribe-v2-meta-trimodal-brain-encoder.md` | 5 |
| `100-tribe-v2-and-agent-swarms-architectural-anchors.md` | 4 |
| `400-prd-scaffold.md` | 4 (parked but referenced as decision-extraction feedstock) |
| `sources/007-karpathy-llm-wiki-pattern.md` | 4 |
| `000-coordination-and-thesis-snapshot.md` | 3 |
| `sources/005-kurzgesagt-the-secret-mind-and-collaborative-inner-universe.md` | 3 |
| `200-llm-wiki-recall-patterns-sotare-and-karpathy.md` | 2 |
| `001-claude-code-research-skills-survey.md` | 1 |
| `002-installed-skills-inventory.md` | 1 |

**0 unconsulted feedstock.** Even the lowest-cited feedstock (skill survey/inventory) has at least 1 inbound reference + is the source of cross-cutting facts the wiki ingested.

### Caltech-context coverage

Yap notes (`caltech/context/yaps/`) — 3 of 3 directly cited from `decisions/` files (decisions/001 cites strategy-pivot; decisions/002 cites judge-conversations; decisions/003 cites opening-team-direction).

Sponsor-context files (7) — 6 cited from decisions/ + navigator-skill cheatsheet. The MLH sub-prizes file was orphaned pre-QA and is now reachable via the navigator skill.

Track-context files (4) — 4 of 4 cited from `caltech/context/track-strategy.md` + decisions/ + navigator-skill cheatsheet (creativity / not-so-sexy / cybersecurity-safety were orphaned pre-QA; patched).

Team-context files (5 + corpus) — 5 of 5 cited from `caltech/context/team.md` + decisions/003.

Architecture / constraints / event / track-strategy — all directly cited from decisions or navigator skill.

## Check 2 — searchable by concept / idea / theme

**The navigator skill `.claude/skills/llm-wiki-navigator/SKILL.md` is the front door.** It auto-triggers on PRFAQ / wiki-query / "what's locked?" / "what does X mean?" prompts. The cheatsheet (~24 rows) covers:

- Locked decisions
- TRIBE v2 corrected facts
- Vocabulary lookup
- Lookalike-risk past winners
- Demo mechanics by emotion
- Witnessed-dissent UI shape
- K2 patterns
- TreeHacks 2026 winners
- Decision context for the two architectural anchors
- Team budget + freeze
- Karpathy wiki essay
- Consolidation report
- Sponsor canonical info (full list)
- Track committed + considered
- Yap notes
- Team profiles + lanes
- Architecture context doc
- Constraints
- Event details

The cheatsheet's "I want to know X → start here Y" table is directly LLM-actionable and makes every research artifact one query away.

### Search verbs supported

- **Concept lookup** — `vocabulary.md` (~120 terms × 6 buckets)
- **Decision lookup** — `decisions/README.md` table
- **Tension lookup** — T1 in `500-elicitation-qa-pass.md`; T2 in `501-party-mode-roundtable.md`; both surfaced in 6+ other files
- **Source lookup** — `themes/.../sources/00*` + `sources/deep-dives/`
- **Idea / past-winner lookup** — `projects/` (5 teardowns) + `scrapes/treehacks-2026-winners.md` (64 winners with GH URLs)
- **Pattern lookup** — `patterns/` (7 architectural primitives)
- **Sponsor lookup** — `caltech/context/sponsors/` (canonical) + `research/sponsors/` (inboxes)
- **Process / protocol lookup** — `caltech/RESEARCH-CONSOLIDATION-PROTOCOL.md` + `decisions/004-socratic-protocol-installed.md` + navigator skill body

## Check 3 — overall process clean

### Karpathy three-layer rule

- **Raw layer** (`themes/.../sources/`, `caltech/context/yaps/`, `caltech/context/sponsors/`, `caltech/context/team/`, `caltech/ideation/` per INDEX caveats) — immutable; LLM reads only ✅
- **Wiki layer** (`research/wiki/{decisions,patterns,projects,tools,stacks,scrapes,findings,themes/<slug>/{README,vocabulary,live-thread}}`) — LLM writes; human reads ✅
- **Schema layer** (`caltech/RESEARCH-CONSOLIDATION-PROTOCOL.md` + `.claude/skills/llm-wiki-navigator/SKILL.md`) — co-evolved ✅

### Karpathy three operations

- **Ingest** — pattern documented in navigator skill §"How to ingest a new source" (7 steps); evidenced by 7 sources + 2 deep-dives ingested 2026-04-25 ✅
- **Query** — pattern documented in navigator skill §"How to query" (5 steps); evidenced by lint + reading-order verification using it ✅
- **Lint** — first lint pass landed (`findings/lint-2026-04-25.md`); pattern documented in navigator skill §"How to lint" (7 checks) ✅

### Socratic protocol enforcement

- 0 wiki files propose a project idea, hook, demo, or hypothesis
- T1 + T2 held as named tensions in 6+ files each; never silently averaged
- All 16 decisions are Johnny-named with verifiable trace; not Claude-proposed

### Provenance honesty

- All claims in decisions/ + patterns/ + deep-dives/ cite source paths
- TRIBE v2 corrections explicitly tagged `[contradiction noted; primary source wins]` rather than silently overwritten
- 1 known broken link (the self-flagged sponsor-footprint stub) — acknowledged in theme README

### Density gates

- All 11 PRD-builder reading-order files within reasonable cold-load budget (~25–35 min total)
- Decisions are ≤ 700 words each (scannable spine)
- Vocabulary ~120 terms in table form (lookup-shaped, not narrative)
- Cheatsheet in navigator skill is a single table, ~24 rows

### Status-marking

- Every consolidation-pass file uses standard frontmatter with `status: verified | partial | aspirational | in-progress`
- Sources keep `status: in-progress` until primary-source verified (deep-dives are `verified`; YouTube-transcript sources are `in-progress`)

## Patches applied this QA pass

1. **Navigator skill cheatsheet extended** — 4 orphan files patched into reachability via 6 new cheatsheet rows: full sponsor list (including dropped Palohouse + MLH sub-prizes), track lookup (committed + considered), team profiles + lanes, architecture / constraints / event context-docs.
2. **No content rewrites** — all patches are additive index-building per the protocol's "consolidation EXTENDS and INDEXES; it does not overwrite" rule.

## Gaps remaining (named, not blocking)

Carried forward from `lint-2026-04-25.md`:

1. Re-dispatch sponsor-footprint discovery agent (failed mid-run earlier; theme README links to its missing output)
2. T1 (augmentation framing IS trends-slop default) — Johnny's call to resolve or own
3. T2 (no external referent for triad) — TRIBE v2 named candidate; operationalization is Johnny's call
4. Verify Harvard "trends slop" 30K-data-point study primary citation (currently unverified secondhand from YouTube)
5. Verify Krafton/Subnautica Delaware ruling primary case filings
6. Optional: `concepts/<term>.md` directory expansion if query load grows
7. Optional: cross-window note for Window-1 ideation INDEX caveats
8. Optional: promote `sources/deep-dives/` to `entities/products/` if more deep-dives accumulate

None of these block PRFAQ. They're follow-on work the next session can pick up.

## Outcome

**Wiki is search-complete and process-clean. The PRFAQ window can boot from the 10-file reading order in ~45 minutes (~25–35 min cold read + ~10 min to draft). T1 + T2 will surface as the first decisions Johnny needs to make. All consulted research is reachable; all concepts are searchable; all gates are met.**
