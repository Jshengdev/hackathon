---
file-type: pattern
status: verified
last-verified: 2026-04-25
supports-decisions:
  - ../decisions/005-best-use-of-ai-as-hard-target.md
  - ../decisions/011-demo-over-execution.md
cites-sources:
  - ../projects/greenchain.md
  - ../projects/jarvis.md
  - ../themes/ai-paradox-invisible-use-cases/sources/003-trends-slop-and-the-comment-section-in-flesh.md
  - ../themes/ai-paradox-invisible-use-cases/sources/deep-dives/emotional-depth-demo-theatre-canonical.md
cross-links:
  - witnessed-dissent.md
  - spatial-sidecar.md
  - ../projects/greenchain.md
  - ../projects/jarvis.md
  - ../projects/renaissance-research.md
---

# Grounded citation

**Every metric, claim, or recommendation in your output points back to a specific source artifact (event ID + timestamp + clip, or named dataset + row + URL). Auditability is the demo feature, not just a compliance feature.**

## When to reach for it

You're producing AI output that a human will act on or defend — safety reports, sourcing decisions, medical summaries, financial recommendations, legal exhibits, incident postmortems. If a judge (or customer) asks "how do you know this?", you need a one-click answer.

## The pattern

Every output unit (a sentence, a number, a row) carries a citation handle:

```
"Near-miss event detected at 14:32:11 — hand within 4cm of blade for 2.1s.
 [event_id: ev_142, t=00:14:32, clip: clips/ev_142.mp4]"

"Manufacturer A: 12.4 tCO2e/$1M. Source: EPA USEEIO v1.3 row #823, NAICS 314110.
 [factor_id: f_1238]"
```

Two implementation halves:

### 1. The data layer carries IDs end-to-end

Don't compute a number, then forget where it came from. Every value in your downstream object retains a pointer to its source:

```python
{
  "manufacturer": "Acme Corp",
  "manufacturing_emissions_tco2e": 12.4,
  "manufacturing_emissions_source": {
    "dataset": "EPA USEEIO v1.3",
    "row_id": 823,
    "naics": "314110",
    "url": "https://www.epa.gov/.../USEEIO_v1.3.csv"
  },
  "transport_tco2e": 3.1,
  "transport_source": {
    "framework": "GLEC",
    "factor_kg_per_tonne_km": 0.011,
    "mode": "sea",
    "distance_km": 8200,
    "port_lookup_id": "p_china_us_west"
  }
}
```

### 2. The render layer surfaces the citation as UI

Inline chips, hover-cards, or click-through to the raw source. Never bury the citation in a footnote.

```tsx
<Metric value={12.4} unit="tCO2e/$1M">
  Manufacturing emissions
  <CitationChip source={mfg.manufacturing_emissions_source}>EPA USEEIO v1.3 #823</CitationChip>
</Metric>
```

For video reports, the citation chip plays the clip at the cited timestamp:

```tsx
<EventClaim>
  Hand within 4cm of blade for 2.1s.
  <ClipChip clipUrl="clips/ev_142.mp4" t={872.3}>14:32:11</ClipChip>
</EventClaim>
```

## Why it works

- **Demolishes "is this real?" doubt** in the demo. Click the chip → see the raw evidence. Judge moves on.
- **Forces engineering rigor.** You can't cite what you didn't compute from a real source. The citation requirement filters out hallucinated numbers at architecture-design time.
- **Trust is compositional.** A report with 30 numbers each cited to 3 sources reads as 90 separately-defensible claims, not "an AI said so." The narrative weight stacks.
- **Free audit log.** Every citation handle is also a pointer for replay, QA, and customer support.

## Real-code citations

- [`projects/greenchain.md`](../projects/greenchain.md) — every emission number is computed from EPA USEEIO + Ember + GLEC + ND-GAIN with named row IDs; the report-generation step is told to "communicate uncertainty without overstating confidence" precisely because the q10/q50/q90 quantile bands are part of the citation handle.
- [`projects/jarvis.md`](../projects/jarvis.md) — claimed: every report claim is cited to event ID + timestamp + clip. The clip reel is the user-facing implementation of the citation.

## Gotchas / failure modes

- **Citations to nothing.** "Source: EPA USEEIO" with no row ID is a fake citation. The handle must resolve to a *specific* artifact.
- **Citation density inflation.** Don't cite every adjective. One citation per material claim.
- **The LLM's job is not to invent citations.** It's to format already-attached citations. If you let the LLM choose what to cite, it hallucinates URLs. Pass citations in as structured input; the prompt is "format this; do not add or remove."
- **Stale URLs.** Snapshot dataset versions and host them yourself if the demo lifetime exceeds the upstream's stability.

## Theme alignment

- **AI paradox / invisible use cases** — grounded citation is the architectural answer to source 003's *"a bad idea that sounds brilliant — that's a $250 million lawsuit."* Every clickable chip is one beat of the un-black-box. Maps directly to the comfort/safety mechanic in `emotional-depth-demo-theatre-canonical.md` §3.4 (the grounded-citation chip).
- Co-pillar with **witnessed dissent** (companion pattern) — citation handles the *output unit* layer; witnessed dissent handles the *process* layer. Both together = the strongest comfort/safety play.

## Anti-theme alignment

- **Citation density inflation** turns the pattern into theatre — every adjective cited, no adjective load-bearing. The judge stops trusting any one citation because they all read as decoration.
- **Citations to nothing** ("Source: EPA USEEIO" with no row ID) is performative grounding — *worse* than no citation, because it borrows trust without backing it.
- **Letting the LLM choose what to cite** hallucinates URLs and inverts the trust the pattern is supposed to install. Citations must be passed in as structured input (cf. `robust-json-from-llms.md`).
- If the demo doesn't *demonstrate* the citation working — judge has to take the chip on faith — the comfort beat is left on the table (cf. `emotional-depth-demo-theatre-canonical.md` §3.4 failure mode).

## Generalizes to

- **Med:** every diagnosis claim cited to a specific imaging slice + DICOM ID + measurement.
- **Legal:** every brief paragraph cited to a specific case + page + paragraph.
- **Finance:** every metric cited to a specific filing + table + row.
- **Eng QA:** every test result cited to a specific git SHA + test ID + log line.
- **Research:** every claim cited to a specific paper + figure + section.

## Cross-links

- [`projects/greenchain.md`](../projects/greenchain.md)
- [`projects/jarvis.md`](../projects/jarvis.md)
- [`projects/renaissance-research.md`](../projects/renaissance-research.md) (sibling pattern at HackTech 2025 — the citations there are perspective-stream chips, not artifact chips, but the trust mechanism is identical)
- [`patterns/spatial-sidecar.md`](spatial-sidecar.md) (the sidecar is where the citation handles get assigned)
- [`patterns/witnessed-dissent.md`](witnessed-dissent.md) (companion pattern — process-layer transparency)
