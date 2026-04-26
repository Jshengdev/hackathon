---
file-type: research-context-index
status: active
last-verified: 2026-04-25
purpose: Mid-PRFAQ research feedstock — sources cited in conversation that aren't yet in research/wiki/. Scrape later for live-thread / vocabulary / wiki ingestion.
---

# Research-context folder

> **Purpose.** When Claude cites a source mid-conversation (academic paper, sponsor doc, competitor teardown, framework citation) that isn't already in `research/wiki/`, drop a short markdown file here. Just enough to scrape later.

## Naming

`NNN-<short-slug>.md` — three-digit prefix, lowercase slug.

## Schema (minimal)

```yaml
---
file-type: research-context
status: raw | partial | promoted-to-wiki
source-type: framework | academic-paper | hackathon-teardown | sponsor-doc | tool-doc | other
last-verified: YYYY-MM-DD
where-cited: <conversation context — which PRFAQ stage / yap / decision>
---

# Title

**Source:** <URL or canonical citation>

**One-line claim:** <what this source asserts>

**Why we cited it:** <one paragraph — what the source is doing in our argument>

**Verbatim quote(s)** (if any):
> ...

**Promotion target** (if any): which `research/wiki/` file this should fold into when consolidated.
```

## Index

| File | Source type | Where cited | Status |
|---|---|---|---|
| [001-andy-raskin-promised-land](./001-andy-raskin-promised-land.md) | framework | PRFAQ Stage 2 — Hope mechanic | raw |
| [002-donald-miller-storybrand](./002-donald-miller-storybrand.md) | framework | PRFAQ Stage 2 — Recognition mechanic | raw |
| [003-keltner-haidt-approaching-awe](./003-keltner-haidt-approaching-awe.md) | academic-paper | PRFAQ Stage 2 — Awe mechanic | raw |
| [004-spotify-wrapped-as-format](./004-spotify-wrapped-as-format.md) | format-pattern | PRFAQ Stage 2 — locked output shape | raw |
| [005-bereal-as-anti-curation-pattern](./005-bereal-as-anti-curation-pattern.md) | format-pattern | PRFAQ Stage 2 — explored, not locked | raw |
| [006-rescorla-wagner-surprise](./006-rescorla-wagner-surprise.md) | academic-paper | PRFAQ Stage 2 — Surprise mechanic | raw |
| [007-johnny-public-corpus-tribe-posts](./007-johnny-public-corpus-tribe-posts.md) | johnny-public-post | PRFAQ — kill-shot framing + credibility chip + product-name vocab | raw |
| [008-devpost-exemplars-mindpad-terralink](./008-devpost-exemplars-mindpad-terralink.md) | hackathon-teardown | pkg-devpost worktree (Tier 2 #6) — structural template | raw |

## Promotion path

When a research-context file matures (verified, promoted into our argument, or contradicted by primary source):
1. Update its frontmatter `status` to `promoted-to-wiki`
2. Move the relevant claims into the appropriate `research/wiki/` location (themes/sources/, patterns/, projects/)
3. Update this index

Until promotion, these files are **inboxes for citation traceability** only.
