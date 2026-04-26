---
file-type: decision
status: verified
last-verified: 2026-04-25
supports-decisions:
  - 003-team-role-lanes-locked.md
  - 007-agent-swarms-as-coordination-pattern.md
  - 008-k2-think-as-speed-engine.md
  - 009-ironside-pipeline-mirror.md
  - 010-b2c-primary-b2b-overlay-positioning.md
cites-sources:
  - caltech/prd-final.md
  - ../findings/2026-04-25-ironside-report-card-person-a.md
  - ../findings/2026-04-25-ironside-report-card-person-b.md
  - junsoo/papers/prompts/ironside/report_card_synthesis.md
cross-links:
  - 009-ironside-pipeline-mirror.md
  - 010-b2c-primary-b2b-overlay-positioning.md
  - ../patterns/k2-reasoning-plus-instruct-synthesis.md
  - ../patterns/spatial-sidecar.md
  - ../patterns/robust-json-from-llms.md
---

# 017 — Ironside report card runs as a junsoo-side wrapper, not an orchestrator rewrite

## Decision

The Ironside per-action cognitive-state report card (8 specialists + 4 numeric scores + structured JSON) is implemented as a **separate, parallel pipeline inside `junsoo/report_card/`**. The live B2C swarm orchestrator at `_bmad/brain-swarm/backend/services/orchestrator.py` is **not modified**.

Both pipelines consume the same `activity.json` upstream artifact. They diverge after that:

```
activity.json (Contract A from junsoo/aggregate.py)
   │
   ├──► [live swarm — Tech B's lane]
   │       1-pass fan-out → moderator (1-sentence)
   │       Used in BEAT-1/2 of B2C demo
   │
   └──► [report-card pipeline — junsoo's lane]
           action_segments.json (manual) + aggregate_per_action.py
           → 8-specialist fan-out (K2 reasoning model)
           → instruct-model JSON synthesis (Llama-3.3-70B-Instruct / Haiku)
           → ironside_report.json (per-action structured cards)
           Used in BEAT-3/4 of Ironside swap
```

## Date locked

2026-04-25 (Saturday afternoon, pre-feature-freeze).

## Locked by

Junsoo, after gap-analysis showed the live swarm produces unstructured 1-sentence text per network — incompatible with the Ironside doc's spec for `{attention_score, threat_engagement, cognitive_load, decision_quality, archetype_state, supporting_specialist_evidence}` per-action JSON. Two paths were considered:

- **Path A** — keep swarm as-is, swap input video; demo BEAT-2 shows generic Yeo7 names over construction footage.
- **Path B** — extend swarm to match Ironside doc; substantial swarm rewrite.

Path B chosen, but implemented **as a parallel junsoo-side pipeline** rather than a modification of `orchestrator.py`. This is the load-bearing nuance.

## Why

Three reasons compound:

**1. Lane discipline (Decision 003).** The orchestrator is Tech B's lane. Junsoo extending it would step on parallel work and risk breaking the live B2C demo mid-rebuild. The wrapper-side approach keeps both lanes shippable.

**2. K2 Think token-budget regression already documented (Decision 008).** `orchestrator.py:26-32` documents that K2 Think (reasoning model) burns its entire token budget reasoning through a structured-JSON rubric, returning truncated output. The team simplified to one-sentence inline prompts to fix the live demo. Re-introducing JSON in the live orchestrator would re-create the bug. The junsoo wrapper sidesteps this by using a **fast instruct model** (Llama-3.3-70B-Instruct on Cerebras / Anthropic Haiku fallback) for the synthesis step, while keeping K2 Think for the specialist reasoning step. See [`patterns/k2-reasoning-plus-instruct-synthesis.md`](../patterns/k2-reasoning-plus-instruct-synthesis.md).

**3. Demo derisk.** The live B2C swarm depends on real-time K2 latency at demo time. The Ironside artifact is **pre-rendered** offline before the demo (per the pre-render workflow at `junsoo/colab_prerender.ipynb`). Two pipelines with different reliability profiles serve different demo beats: live for B2C "Reels brain", canned for Ironside swap. If either fails on stage, the other still ships.

## What this opens

- The 8 Ironside specialists are **functional re-groupings** of the existing 7 Yeo7 networks (`visual_attention` = visual + dorsal_attention; `threat_detection` = limbic + ventral_attention with stimulus context; `stress_response` = limbic HIGH + frontoparietal LOW dysregulation signature; etc.). TRIBE V2 output schema does not change. See `junsoo/papers/prompts/ironside/*.md` for the composite definitions.
- Two-person parallel build is unblocked: Person A owns prompts + aggregator + smoke; Person B owns synthesis + integration. Hand-off contract is `per_action_activations.json` (locked schema in [`findings/2026-04-25-ironside-report-card-person-a.md`](../findings/2026-04-25-ironside-report-card-person-a.md)).
- A reusable pattern emerges (filed at [`patterns/k2-reasoning-plus-instruct-synthesis.md`](../patterns/k2-reasoning-plus-instruct-synthesis.md)): pair a reasoning model with a fast instruct model when the same flow needs both deliberation AND structured output.

## What this closes

- Path-A "swap input only, keep 7-network labels" is dropped — judges from Ironside reading the planning doc and seeing only generic Yeo7 names in the demo would surface the gap. The 8-specialist framing is now backed by real artifacts (the report card JSONs) at demo time.
- 2-pass cross-talk is dropped from MVP scope — composite specialists + good synthesis prompt produce sufficient depth without doubling K2 calls per frame. Logged as a stretch goal in [`findings/2026-04-25-ironside-report-card-person-b.md`](../findings/2026-04-25-ironside-report-card-person-b.md).

## Reversibility

**Reversible until feature-freeze (Decision 012).** The pipeline lives at `junsoo/report_card/` and can be deleted without touching the live B2C swarm. If the within-subject contrast on real construction footage doesn't pop after pre-render, fall back to Path A — the demo BEAT-2 visualization still works against the existing orchestrator.

After feature-freeze: locked. Rolling back removes the Ironside swap-MP4 demo beat; the team would need to verbally pitch the report-card framing instead.

## Implications for the demo

- **BEAT-3 (within-subject toggle) and BEAT-4 (per-action report card)** become the load-bearing Ironside-judge moments. Both use pre-rendered `ironside_report.json` artifacts; neither depends on live GPU or live K2 at demo time.
- **BEAT-5 close** ("same engine, different input modality, same ethos") is now defensible because the Ironside artifact is structurally distinct from the B2C artifact — same upstream `activity.json`, different downstream pipeline producing track-specific outputs.
- The "for the worker, not the surveiller" framing is preserved in the synthesis prompt's forbidden-claim guardrails (no reverse inference, no clinical claims, within-subject only).
