---
file-type: source
status: verified
last-verified: 2026-04-25
supports-decisions: []
cites-sources: []
cross-links:
  - ../README.md
  - ../../../index.md
  - ../../../README.md
  - deep-dives/README.md
---

# `themes/ai-paradox-invisible-use-cases/sources/` — raw source pages

Each `NNN-<slug>.md` is a single source ingested into the theme: full verbatim transcript / article body + a key-extracts header + a "how it maps to the theme" section + an "open questions raised" section.

**These are immutable in the Karpathy three-layer model.** The LLM reads from them but never edits them once committed. Synthesis happens in `vocabulary.md`, `live-thread.md`, `decisions/`, `findings/`, `projects/`, `patterns/` — never inside a source file.

## Subfolder

[`deep-dives/`](deep-dives/) — primary-source canonical references (verified facts; supersedes earlier YouTube-transcript sources where they conflict).

## Naming + schema

- `NNN-<slug>.md` — three-digit zero-padded number + lowercase-hyphenated slug. Numbered in ingestion order, never renumbered.
- `file-type: source` in frontmatter.
- Required sections per the protocol: origin (URL / author / date / format) · key extracts (3-5 bullets, load-bearing claims) · vocabulary introduced · how it maps to the theme · what it contradicts / complicates · open questions raised · full content (verbatim).

## Status convention

- `status: in-progress` — YouTube transcript or single-secondary-source. Treat with skepticism.
- `status: partial` — primary source identified but not fully verified.
- `status: verified` — primary-source ingested, claims cross-checked. Use `deep-dives/` for canonical reference docs at this level.

## When to read

- Need a verbatim quote → here
- Need ground-truth on a claim → start here, escalate to `deep-dives/` if YouTube-transcript-only
- Provenance check on a vocabulary term → trace back to the source it was coined in

## When to write

- A new source lands here when ingested per the navigator-skill 7-step ingest flow. Drop the raw content into a new `NNN-<slug>.md` (next available number) before doing any wiki-side updates.

## Index

| File | One-line | Status |
|---|---|---|
| `001-hak-systems-thinking.md` | Hak / AgentiveStack on systems thinking + the broken junior pipeline | in-progress (YouTube transcript) |
| `002-algorithmic-culture-flattening.md` | Algorithmic culture / Filter World / Death of Personal Style | in-progress |
| `003-trends-slop-and-the-comment-section-in-flesh.md` | Trends slop / Krafton-Subnautica / "AI is the internet comment section taking flesh" | in-progress |

> Sources 004-007 currently live in [`../window-2-research-deepening/sources/`](../window-2-research-deepening/sources/) — archived feedstock from the worktree phase. Future-pass: graduate them to this folder and remove window-2 archive (or leave as-is per "consolidation EXTENDS, doesn't overwrite").

> Deep-dives at [`deep-dives/`](deep-dives/): TRIBE v2 canonical reference (corrects source 006 facts) + emotional-depth/demo-theatre canonical reference.
