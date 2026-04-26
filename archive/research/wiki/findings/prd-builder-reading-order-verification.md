---
file-type: finding
status: verified
last-verified: 2026-04-25
supports-decisions:
  - ../decisions/013-prd-built-in-different-instance.md
cites-sources:
  - ../themes/ai-paradox-invisible-use-cases/README.md
  - ../themes/ai-paradox-invisible-use-cases/vocabulary.md
  - ../decisions/README.md
  - ../decisions/006-tribe-v2-as-special-mode.md
  - ../decisions/007-agent-swarms-as-coordination-pattern.md
  - ../themes/ai-paradox-invisible-use-cases/sources/deep-dives/tribe-v2-canonical-reference.md
  - ../themes/ai-paradox-invisible-use-cases/sources/deep-dives/emotional-depth-demo-theatre-canonical.md
  - ../themes/ai-paradox-invisible-use-cases/window-2-research-deepening/500-elicitation-qa-pass.md
  - ../themes/ai-paradox-invisible-use-cases/window-2-research-deepening/501-party-mode-roundtable.md
  - ../projects/renaissance-research.md
  - ../../../caltech/CONSOLIDATION-REPORT.md
cross-links:
  - lint-2026-04-25.md
---

# PRD-builder reading-order verification — 2026-04-25

Cold-load test of the 10-file reading order defined in `caltech/CONSOLIDATION-REPORT.md`. Hypothesis: a fresh Claude session loading these 10 files in order has every PRFAQ-ready bootstrap context.

## Verdict

**✅ Sufficient.** The 10-file reading order does deliver cold-start PRFAQ readiness in ~25–35 minutes of read time. Two minor caveats noted below.

## Per-file analysis

### 1. `themes/ai-paradox-invisible-use-cases/README.md` (1,573 words)
- **Time-to-read:** ~7 min cold
- **Density:** ✅ tight — Johnny's verbatim problem statement + Socratic protocol + theme-vs-hypothesis split + cross-source vocabulary table + open questions
- **Forward-deps:** none — this is the seed
- **Unique contribution:** the Socratic protocol verbatim quote (binding for everything downstream); the theme-vs-hypothesis distinction; the canonical "open questions for Johnny" list
- **Open questions left:** intentionally — open-questions §6–7 are the hand-off to the hypothesis pass
- **Verdict:** ✅ correct file 1

### 2. `themes/ai-paradox-invisible-use-cases/vocabulary.md` (5,334 words)
- **Time-to-read:** ~10 min cold (terms scannable as table; not narrative)
- **Density:** ✅ ~120 terms in 6 buckets (failure-mode / architectural-fix / augmentation-and-mind / LLM-wiki-process / demo-and-pitch / persona-and-process)
- **Forward-deps:** terms reference sources 001–007; reader doesn't need them yet — vocab self-contained
- **Unique contribution:** every term has source + definition + companion + opposing — instantaneous lookup for any later "what does X mean?" question
- **Open questions left:** none — vocabulary doesn't pose them, just defines
- **Verdict:** ✅ correct file 2

### 3. `decisions/README.md` (595 words)
- **Time-to-read:** ~3 min
- **Density:** ✅ table of 16 decisions, one-line each, with locked-by + status
- **Forward-deps:** points at individual decision files (006/007 in next slot are the load-bearing pair)
- **Unique contribution:** the locked-decision spine in a single table — what is decided vs. open
- **Open questions left:** which individual decisions to drill into
- **Verdict:** ✅ correct file 3

### 4. `decisions/006-tribe-v2-as-special-mode.md` (610 words) + `decisions/007-agent-swarms-as-coordination-pattern.md` (639 words)
- **Time-to-read:** ~5 min combined
- **Density:** ✅ both architectural anchors with full schema (decision / date / locked-by / why / opens / closes / reversibility / trace)
- **Forward-deps:** both reference the deep-dive (file 5) and the QA passes (files 7 + 8) — reader gets payoff in next 4 files
- **Unique contribution:** the WHY behind the two anchors; what each opens vs. closes; reversibility clauses
- **Open questions left:** flagged explicitly — A7 (no external referent for triad) carried forward
- **Verdict:** ✅ correct paired file 4

### 5. `themes/ai-paradox-invisible-use-cases/sources/deep-dives/tribe-v2-canonical-reference.md` (6,132 words)
- **Time-to-read:** ~12 min (longer; this is the dense reference)
- **Density:** ✅ 10 sections per spec; verbatim primary-source quotes; license/regulatory analysis; the 3 contradictions with source 006 explicitly named
- **Forward-deps:** none (primary-source verified independently)
- **Unique contribution:** corrected TRIBE v2 facts (~20K vertices not 70K; ~25 training subjects not 700; CC BY-NC license); integration paths; risk surface; capabilities matrix (in/out of scope)
- **Open questions left:** §10.5 names them — population-bias from 25 training subjects; commercial-license fight; etc.
- **Verdict:** ✅ correct file 5 — must come AFTER decision 006 so the reader knows why this matters

### 6. `themes/ai-paradox-invisible-use-cases/sources/deep-dives/emotional-depth-demo-theatre-canonical.md` (10,016 words)
- **Time-to-read:** ~18 min cold (longest file — flag for skim-on-pass-1)
- **Density:** ✅ but heavy — 8-emotion taxonomy + 16-mechanic catalog + TreeHacks emotional teardown + 4-act demo arc + 90-second template
- **Forward-deps:** references projects (Memento, Renaissance Research) loaded in file 9
- **Unique contribution:** the demo-mechanics catalog ("the toggle," "the wow object," "the grounded citation chip," "the witnessed dissent," "the 0.3-second mirror"); maps Johnny's verbatim language to specific emotions
- **Open questions left:** the second-by-second template intentionally blank for fill-in after Johnny names the demo
- **Verdict:** ✅ correct file 6 — but the PRD-builder may benefit from skimming sections 1–3 + 5 + 9 first, then drilling into 4 + 7 + 10 on demand

### 7. `themes/.../window-2-research-deepening/500-elicitation-qa-pass.md` (5,453 words)
- **Time-to-read:** ~12 min
- **Density:** ✅ 12 Socratic questions + 9 Red Team attacks + 7 Pre-Mortem loss-modes + 8 First-Principles claims + 10-tension roll-up
- **Forward-deps:** references files 1–6 + party-mode in file 8
- **Unique contribution:** **T1 lives here** (the augmentation-as-trends-slop tension); the structured stress-test against the theme + anchors
- **Open questions left:** 10 named tensions; the team owns whether each becomes a decision or stays open
- **Verdict:** ✅ correct file 7 — must come after files 1–6 so the reader has the corpus the QA attacks

### 8. `themes/.../window-2-research-deepening/501-party-mode-roundtable.md` (3,783 words)
- **Time-to-read:** ~8 min
- **Density:** ✅ 6 personas × 3 statements + 2 cross-persona exchanges + 23 open questions sorted by domain
- **Forward-deps:** references files 1–7
- **Unique contribution:** **T2 lives here** (the no-external-referent / Filter World with extra steps); 23 questions from 6 perspectives
- **Open questions left:** 23 sorted by domain (architectural / sponsor-fit / demo / scope / risk)
- **Verdict:** ✅ correct file 8 — pairs with file 7 (both are QA outputs)

### 9. `projects/renaissance-research.md` (1,277 words)
- **Time-to-read:** ~3 min
- **Density:** ✅ project teardown + lookalike-risk fields (🔴 HIGH)
- **Forward-deps:** none
- **Unique contribution:** what a known winner of similar shape did; what their existence forecloses for our angle
- **Open questions left:** the open question about how Renaissance Research avoided collapsing into corpus mean (T1 reference)
- **Verdict:** ✅ correct file 9

### 10. `caltech/CONSOLIDATION-REPORT.md` (1,420 words)
- **Time-to-read:** ~3 min
- **Density:** ✅ tight — what was ingested, what was intentionally dropped (with reasons), what gaps remain, the reading order itself
- **Forward-deps:** points back into the wiki for follow-up reads
- **Unique contribution:** the meta-view — what the consolidation pass produced + what it chose not to ingest + named gaps
- **Open questions left:** the gaps section names them
- **Verdict:** ✅ correct file 10 — the meta-finish

## Cumulative knowledge check

After reading the 10 files cold, the reader can answer:

**(f) What's locked?** ✅ — all 16 decisions reproducible from `decisions/README.md` table; the bonded pair 006+007 in detail.

**(g) What does the Socratic protocol allow / forbid?** ✅ — verbatim from theme README. Allows: wiki structure, lint, navigator, sponsor research, source ingestion. Forbids: project idea / hypothesis / hook / demo / product surface — all of which Johnny names; Claude reflects.

**(h) What are the two open tensions T1 and T2?** ✅ — T1 lives in 500; T2 in 501; both flagged in deep-dive (file 5) and witnessed-dissent pattern (linked from decisions 006/007).

**(i) What is TRIBE v2 actually (corrected facts)?** ✅ — ~20K cortical-surface vertices on `fsaverage5` (NOT 70K voxels); ~25 deeply-scanned training subjects (720+ in evaluation universe; NOT trained on 700); 1 Hz temporal resolution; CC BY-NC-4.0 license with no commercial pathway; ICLR 2026; Algonauts 2025 v1 winner; Jean-Rémi King lead. What it can: predict cortex-wide fMRI response to video/audio/text. What it can't: read inner monologue, reverse-inference felt experience, operate sub-second.

**(j) Demo-emotion taxonomy + 5+ mechanics?** ✅ — 8 emotions (awe / surprise / recognition / hope / anger / comfort-safety / pride / disgust); 16 mechanics including the toggle, the wow object, the grounded citation chip, the witnessed dissent, the 0.3-second mirror, the cited testimony, the kill, the killer object.

**(k) Which past hackathon winners are HIGH lookalike risks?** ✅ — Memento + Renaissance Research, both flagged 🔴 in `projects/`. File 9 covers Renaissance Research in detail; Memento not in reading order but cross-referenced.

**(l) Could the team start a PRFAQ in 30 minutes?** ✅ — yes. The PRFAQ Q's are pre-loaded by the open-questions in theme README §6–7 + the 10 tensions in 500 + the 23 questions in 501. The PRD-builder's first move is to surface T1 + T2 to Johnny and ask for the framing call; everything downstream is unblocked.

## Time-to-PRFAQ-readiness estimate

**~25–35 minutes** of cold read time across the 10 files (lighter on file 6 if PRD-builder skims 1–3 + 5 + 9 first).

After read: ~10 minutes to draft the first PRFAQ Q ("What is the product?") informed by the bootstrap. Total ~45 minutes from zero to first PRFAQ paragraph.

## Forward-dependency map

```
file 1 (theme README)        — seed; no deps
   ↓
file 2 (vocabulary)          — independent reference
   ↓
file 3 (decisions README)    — points at 4
   ↓
file 4 (decisions 006+007)   — references 5 (deep-dive) + 7 + 8 (QA)
   ↓
file 5 (TRIBE v2 deep-dive)  — independent primary-source verification
   ↓
file 6 (emotional-depth)     — references 9 (projects) + scrape
   ↓
file 7 (elicitation QA)      — attacks 1–6
   ↓
file 8 (party-mode)          — attacks 1–7
   ↓
file 9 (renaissance-research) — independent project teardown
   ↓
file 10 (consolidation report) — meta-view of everything above
```

No forward dependencies broken. Reading in order works.

## Recommended additions / removals

**Conservative:** the 10-file budget is right. No additions necessary for PRFAQ-readiness.

**Optional adds** (only if the PRD-builder asks for them after the cold load):
- `projects/memento.md` — the OTHER 🔴 HIGH lookalike. File 9 covers Renaissance Research; Memento is the second-order dive.
- `patterns/witnessed-dissent.md` — the architectural primitive that makes T2's "external referent" question concrete. PRD-builder will want this when designing the architecture story.
- `caltech/context/sponsors/{ifm-k2,ironsite,listenlabs}.md` — the canonical sponsor briefs. Useful when PRD-builder writes the sponsor-mapping section.

These are second-pass reads, not bootstrap reads.

## Verdict

**✅ Reading order is sufficient. PRFAQ work can start in a fresh Claude instance loading these 10 files in order. T1 + T2 will surface as the first decisions Johnny needs to make.**

Single biggest gap: none structural. The next-action burden is on Johnny (resolve or accept T1 + T2; or operationalize TRIBE v2 as the T2 external referent), not on the wiki.
