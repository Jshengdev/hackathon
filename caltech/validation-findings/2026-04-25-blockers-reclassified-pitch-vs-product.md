---
file-type: validation-findings
status: reclassification
last-verified: 2026-04-25
locked-by: Johnny verbatim — pitch-vs-product doctrine 2026-04-25
cross-links:
  - ./2026-04-25-phase-2-party-mode-pass-1.md
  - ../prfaq.md
---

# Blockers reclassified — pitch-vs-product doctrine

> Johnny's lock 2026-04-25: *"The blockage here should only be for the sake of pitching it and not for the actual idea of the product."* The validation pass surfaced 11 must-resolve items. Filtering them through the doctrine changes most of them.

## Reclassification rules

- **PITCH BLOCKER** = the demo / story / pitch-tag fails without it. The judge can't be told the story.
- **PRODUCT BLOCKER (parked)** = the actual product would fail without it. Held for post-hackathon. *Not blocking the pitch.*
- **STORY-AMMUNITION** = an answer needed for FAQ defense if a judge asks. Doesn't block the demo running, but blocks Q&A handling.

## The 11 must-resolve items, reclassified

| # | Item | Old class | New class | Why |
|---|---|---|---|---|
| 1 | Persona felt-friction sentence | BLOCKER | **PITCH BLOCKER** | The press release IS pitch surface. Still required. |
| 2 | Land-card reverse-inference reframe | BLOCKER | **STORY-AMMUNITION** | Demo runs fine. Only matters when judge asks Poldrack question. Pre-script the answer (option b: "yes, content discovery is inverse inference; not clinical claim"). |
| 3 | Ironside close reframe ("feel emotions") | BLOCKER | **PITCH BLOCKER** | The pitch line itself is wrong. Rewrite required — costs nothing. |
| 4 | Kill-shot framing explicit (TRIBE protagonist + swarm chorus) | BLOCKER | **PITCH BLOCKER** | Headline / press-release framing. Required. |
| 5 | Product name (not "Spotify Wrapped of Your Brain") | BLOCKER | **PITCH BLOCKER** | Original product name needed. Required. |
| 6 | T2 stance | BLOCKER | **STORY-AMMUNITION** | Doesn't block demo. Pre-script the FAQ answer: *"We make Filter World visible; we don't claim to solve it."* |
| 7 | 90-second shot-by-shot | BLOCKER | **PITCH BLOCKER** | THE central deliverable of this pane per Johnny's new doctrine. Highest priority. |
| 8 | Q-J6 inverted-brain-search implementation | BLOCKER | **PITCH BLOCKER (light)** | Pre-cache 3-5 hand-curated suggestions for the demo input video. Don't build a real reverse-lookup engine. |
| 9 | Cross-talk worked example | BLOCKER | **PITCH BLOCKER (snippet)** | Need ONE example where actor/auditor/mediator divergent outputs are visible — for the demo only, hand-tuned, deterministic. |
| 10 | Listen Labs concrete viz shape | BLOCKER | **PITCH BLOCKER** | The Listen Labs sponsor close needs ONE visible shape proving "convergence of society." Hand-mock acceptable. |
| 11 | Sideshift fit decision | BLOCKER | **PITCH BLOCKER** | Reframe close or drop track. One-line decision. |

### What dropped from blocker to parked

- **Cohort-comparison data pipeline** (RT-6) — was: "where's the dataset?" Now: hand-tune percentiles for the demo input video; story sells the concept.
- **K2-could-be-Claude legibility test** (RT-7) — was: "show toggle." Now: K2 close in pitch deck *says* the speed is load-bearing; demo doesn't have to prove it.
- **Specialist role-play challenge** (RT-8) — was: "show experiment." Now: hand-tune 3-5 differentiated specialist outputs for the demo input; tells the story.
- **Cohort dataset for Card 3** (Mary M3 / Sally) — was: "build it or drop it." Now: pre-generate 10-profile mock cohort, real percentiles vs mock — looks real, defensible as demo.
- **K2 swarm distinguishability per region** (Pre-mortem #6) — was: "outputs must differ meaningfully." Now: hand-tune for demo input.
- **Demo determinism** (Pre-mortem #9) — was: "set temp=0, lock seeds." Now: pre-record the demo output for the specific input video; play back live-styled.
- **Renaissance differentiation** — was: "explicit verbal differentiator within 60s." Now: pitch *story* leads with TRIBE-as-protagonist framing in the press release; demo opens on real brain firing on screen — the visual signature differs from Renaissance's three-text-columns from frame 1.

### What stays as PITCH BLOCKER (the new must-resolve)

The reduced list, all in service of pitch + story + demo snippet:

1. **Persona felt-friction sentence** (17-year-old voice)
2. **Ironside close reframe** (drop "feel emotions")
3. **Kill-shot framing explicit** in headline
4. **Product name**
5. **90-second shot-by-shot** — the spine of all pitch outputs
6. **Q-J6 hand-curated demo suggestions** (pick a/b/c, hand-tune for demo input)
7. **Cross-talk demo example** (one hand-tuned scenario)
8. **Listen Labs viz shape** (one mockup-able shape)
9. **Sideshift reframe or drop**

### What stays as STORY-AMMUNITION (FAQ scripts, not demo blockers)

These get pre-scripted FAQ answers for Q&A defense. Don't block demo execution.

- T2 corpus-bias stance
- Reverse-inference Land card defense
- TRIBE 70K vs 20K (already defended — never inflate on stage)
- License (CC BY-NC) — *"research-stage; commercial path TBD"*
- "Spotify Wrapped" trademark — *"format reference; product name is [X]"*
- Cohort data source — *"demo uses TRIBE-predicted aggregate over a representative content sample; production would scale with consented user data"*
- Sponsor specificity (each sponsor's deeper integration question) — pre-script per-sponsor

## What this enables (the real value)

Under the new doctrine:
- **Phase 2 validation** is effectively COMPLETE. Pitch blockers are 9 small items, not 11 architectural fights.
- **Phase 4 advanced-elicitation** can be SKIPPED for now. Validation already surfaced all the meaningful attacks; advanced-elicitation would re-surface the same set in different language. Re-run only if a new lock surfaces something brand-new.
- **The PRD slots into the demo's box-shape** — engineering doesn't decide what the product is; the demo decides, and engineering fills the boxes.
- **Path to fastest PRD:** lock the 9 pitch blockers in one rapid yap pass → write the 90s shot-by-shot → that becomes the PRD's Section 1 → per-person epics inherit their boxes from the demo beats.
