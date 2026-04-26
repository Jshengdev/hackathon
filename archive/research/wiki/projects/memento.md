---
file-type: project
status: partial
last-verified: 2026-04-25
supports-decisions:
  - ../decisions/006-tribe-v2-as-special-mode.md
  - ../decisions/009-ironside-pipeline-mirror.md
cites-sources:
  - ../../../caltech/ideation/02-winner-cross-comparison.md
  - https://devpost.com/software/memento-cxntj0
  - https://hacktech2025.devpost.com/project-gallery
cross-links:
  - ../decisions/009-ironside-pipeline-mirror.md
  - ../patterns/spatial-sidecar.md
  - ../patterns/localize-and-zoom.md
  - jarvis.md
  - renaissance-research.md
---

# Memento

> **⚠️ Verification level:** Devpost-only; **no GitHub link found**. Every "needle" below is *claimed*, not verified by code inspection. Per `caltech/ideation/02-winner-cross-comparison.md` line 91, the "200x cheaper" number is unverified pitch language; the temporal-frame-analysis claim is technically coherent but unconfirmed.
>
> **⚠️ Lookalike-risk teardown:** Per `caltech/ideation/INDEX.md`, this project is flagged as a **HIGH lookalike risk** for our HackTech 2026 stack. The teardown below uses *facts only* from the ideation file; recommendation language is stripped per the Socratic protocol (decision 004).

- **Hackathon / event:** HackTech 2025 (Caltech)
- **Year / date:** 2025
- **Prize won:** Best Health Project
- **Sponsor tracks involved:** unverified — Devpost copy doesn't break out sponsor tracks
- **Devpost / press / video / repo:** Devpost only — https://devpost.com/software/memento-cxntj0 ; gallery: https://hacktech2025.devpost.com/project-gallery
- **Local clone:** none — no GitHub URL found

## Pitch (one sentence)

AR-glasses-based companion for dementia patients — a multimodal agent watches what the user is doing through Aria smart glasses, reminds them of self-care tasks, alerts family of issues; pitched at "200× cheaper than traditional caregivers."

## What's actually in the writeup (claimed, unverified)

| Devpost claim | Reality |
|---|---|
| Aria smart glasses as the input device | ⚠️ Claimed — no GitHub to verify hardware integration |
| Multimodal agent watches first-person video | ⚠️ Claimed |
| Real-time verbal redirection (e.g., "you left the stove on") | ⚠️ Claimed |
| Temporal-frame-analysis to overcome first-person action-detection failures | ⚠️ Claimed — technically coherent but unverified |
| Multi-model verification | ⚠️ Claimed |
| Family-alert dashboard | ⚠️ Claimed |
| "200× cheaper than traditional caregivers" | ❌ Aspirational — pitch number, no operational verification |

**Total claim count not verifiable** — write-up only.

## The unique sauce (what made it stand out — per ideation file)

1. **Direct attack on first-person VLM failure modes.** The team named the exact problem Ironside named at the 2026 fireside: *"existing CV models are good at object detection but terrible at first-person action detection."* Memento built temporal frame analysis + multi-model verification specifically to overcome that.
2. **Hardware demo (real glasses) elevated above pure-software entries.** Pattern F from `caltech/ideation/02-winner-cross-comparison.md` (theatrical hardware / wearable moment) — Aria glasses on stage gives the demo physicality.
3. **Sympathetic vertical (dementia care).** Personal-stakes framing universal among judges with aging family.
4. **B2C pricing positioning.** "$50/month app vs. $3.5K–$8K traditional device" follows the sympathetic-underdog pattern (Pattern E).

## Implementation needles (claimed, unverified by code)

- **Aria smart glasses** for egocentric capture (the same hardware lineage Ironside is using on construction sites in 2026).
- **Flutter mobile app + Firestore** for the family dashboard.
- **OpenAI + Llama via Together AI** for inference (multi-model verification claim).
- **Python backend** for orchestration.

No file/function-level details available.

## Capability stack

| Layer | Choice |
|---|---|
| Hardware | Aria smart glasses |
| Mobile app | Flutter |
| Backend | Python |
| LLM (orchestration) | OpenAI |
| LLM (verification, claimed) | Llama via Together AI |
| Database | Firestore |
| Inference | Together AI |

## Why it would win

- **Same first-person-VLM problem space we're targeting** with the AI-paradox stack — but framed around dementia rather than construction. Huge sympathy + clear market.
- **Hardware on stage** — real Aria glasses; demo physicality wins.
- **B2C consumer positioning** with quantified cost-disruption.

## Lookalike-risk score for our HackTech 2026 entry

**🔴 HIGH** — Same hackathon (HackTech), one year prior (2025); same problem space (egocentric first-person video understanding); same architectural wedge (temporal-frame-analysis + multi-model verification, which is structurally close to our Actor/Auditor/Mediator triad with TRIBE V2 as the second modality stream); same demo theatre (hardware on stage, in-room artifact); same general vertical-empathy framing. **A judge who saw Memento in 2025 will pattern-match to it within 30 seconds of our demo.**

## What this project's existence forecloses for our project

- **The "first-person video understanding for vulnerable users" framing as the headline pitch.** Memento already won a Best Health prize on this exact framing; using it again at the same hackathon a year later reads as derivative.
- **Aria glasses as the hardware hook.** The "judges have seen this" effect kills surprise (per `emotional-depth-demo-theatre-canonical.md` §3.3 wow-object failure mode).
- **The dementia-care vertical specifically** — Memento owns that judge mental slot at HackTech.
- **The "200× cheaper than traditional caregivers" cost-disruption framing.** Burned.

## What's still open (per ideation file)

The ideation file flagged two differentiation paths the team can consider:
1. **Differentiate by domain** — construction (Ironside), not dementia.
2. **Differentiate by tech** — TRIBE V2 brain-encoding as the second modality stream, not just temporal-frame-analysis + multi-model verification.

The ideation file recommends "probably both" — the consolidation pass holds this as a *named option*, not a recommendation. Johnny's call per the Socratic protocol.

## Open questions

- Does Memento's actual implementation (no GitHub) match the Devpost narrative? Cannot verify.
- What did the Memento team's 5-minute pitch actually open with? (Watching the Devpost video would resolve this — TODO if it becomes load-bearing.)
- Did Memento attempt any second-modality input beyond raw video? If yes, that narrows our differentiation gap.

## Cross-links

- `caltech/ideation/02-winner-cross-comparison.md` lines 81–95 — full ideation entry.
- `caltech/ideation/02-winner-cross-comparison.md` lines 384–388 — "Top 3 winners we should study most carefully" footer entry.
- `decisions/006-tribe-v2-as-special-mode.md` — the differentiation-by-tech path.
- `decisions/009-ironside-pipeline-mirror.md` — the differentiation-by-domain path (construction, not dementia).
- `patterns/spatial-sidecar.md` + `patterns/localize-and-zoom.md` — first-person-video patterns we could lean on as engineering-over-prompting differentiators.
- `projects/jarvis.md` — sibling project (also egocentric video understanding, also un-verified-by-code).
