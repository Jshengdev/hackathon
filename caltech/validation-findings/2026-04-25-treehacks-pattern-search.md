---
file-type: validation-findings
status: research-deliverable (Johnny picks adaptations)
last-verified: 2026-04-25
locked-by: TreeHacks pattern-search agent against past-winner corpus
cross-links:
  - ../yaps/2026-04-25-execution-layer-search/01-high-signal-extracts.md
  - ../prd.md
  - ../narration-script-3min.md
  - ../demo-script.md
---

# TreeHacks pattern search — input + execution layers

> Research agent surveyed the past-winner corpus (TreeHacks 2026 + HackPrinceton + HackHarvard + Caltech ideation doc) for input-layer and execution-layer patterns we can adapt without breaking locked positioning. Returned 5 concrete adaptations + reusability/priority ordering.

## Headline finding

**Johnny's "interactable Wrapped" instinct is validated by past winners.** Specifically the *fill-in / iterative refinement* pattern (execution-layer #2) — exemplars: GreenChain transport-mode toggle, Tribune voice-interview-then-diff, CONSENSUS scenario perturbation. **This is a proven shape, not an invention.**

## Input-layer catalog (9 patterns, ranked for our engine)

| Rank | Pattern | Friction | Privacy | Our fit |
|---|---|---|---|---|
| 🥇 | **Screen-recording feed (current)** | Low | High (self-recorded) | ✅ Demo-perfect; already locked |
| 🥈 | **Browser extension feed-scrape** | Low-med | Med (extension-trust) | ✅ Story-frame for "real product" — Chrome Web Store pattern matches GLASSPANE / Snappier |
| 🥉 | **Widget-triggered recording** | Low | High | ✅ "Friend shows you a Reel at lunch, tap widget, brain heatmap in 10s" — high visceral demo value |
| 4 | **OAuth platform API** | Med | Med | ⚠️ Limited — TikTok/IG don't expose raw video frames; useful for *metadata* enrichment only |
| 5 | **Friend-shared content (paste links)** | Low-med | Med | ✅ Lightweight onboarding for shared analysis sessions |
| 6 | **Saved folder / bookmark export** | Med-high | High (local files) | 🟡 Viable but lacks real-time magic |
| 7 | **Social-proof mirror (group consent)** | Low | Clear (opt-in) | ✅ Adds social dimension to empowerment story |
| 8 | **Topic-list manual entry** | Med | High | ❌ Anti-pattern for our thesis (user-tells-system-what-they-care-about ≠ audit-actual-consumption) |
| 9 | **Continuous background capture** | Very high | Catastrophic | ❌ Reject — surveillance-shaped, contradicts positioning |

**Lock implication:** demo input = screen-recording (current). Story-frame names browser-extension + widget + friend-share as how this scales in production. Anti-patterns explicitly rejected (topic-list, continuous-capture).

## Execution-layer catalog (10 patterns, ranked for our engine)

| Rank | Pattern | Past-winner exemplar | Our fit |
|---|---|---|---|
| 🥇 | **Fill-in / iterative refinement** | GreenChain (sea→air toggle, 55× emission spike); Tribune (voice→diff→re-interview); CONSENSUS (scenario perturbation) | ✅✅✅ THIS IS JOHNNY'S INTERACTABLE-WRAPPED INSTINCT VALIDATED |
| 🥈 | **Generation (system creates new content from your data)** | ChromaChord; Mobius; Snappier | ✅ Generated search prompts for dormant regions = action user can take immediately |
| 🥉 | **Export / share artifacts** | Diffuji (thermal sticker); DOSSIER concept; Tribune diff-as-patch | ✅ Shareable brain card → BeReal-style social moment |
| 4 | **Comparison / before-after toggles** | ARENA; Dispatch; Synovia | ✅ Already partly in BEAT-3 (feed-shape vs. baseline-shape); could extend |
| 5 | **Guided-discovery (dialog)** | Hellocare; Minerva; Jarvis | ✅ The Land card already does this |
| 6 | **Voice / async feedback loop** | WHISPER; Tribune voice | 🟡 Latency overhead; medium priority |
| 7 | **Scheduled / habit-forming loops** | Bloom; Mira | 🟡 Requires user-wants-reminders; better as V2 |
| 8 | **Group brain / multi-user** | (none direct; GLASSBOX concept) | 🟡 High demo risk (requires real-time multi-device) |
| 9 | **Gamified exploration / quest** | Artificial Sandwich Intelligence; Yumi | ❌ Doesn't fit empowerment-over-attention-farming positioning |
| 10 | **Personalized recommendations** | aesthetica; Mira; Voider | ❌ EXPLICITLY REJECT — would make us what we're critiquing |

## Reverse-engineering pattern catalog (Johnny's verbatim thesis validated)

Past winners that explicitly INVERTED a known industry use case:

| Project | Industry use case inverted | What they delivered |
|---|---|---|
| **Tribune** | Policy opacity (council votes invisible to constituents) | Auditable policy diff with constituent-voice citation |
| **GreenChain** | Greenwashing (suppliers hide emissions) | Verifiable emissions per supplier, scored |
| **ShadowGuard** | Hospital data leakage | Real-time PHI redaction + audit trail |
| **Synapse** | Claim laundering (viral claims have no provenance) | Cited-evidence trail per atomic claim |
| **Gallop** | Security theater (SOCs miss intrusions) | Auto-surfaced incident timeline |
| **Edamame** | Siloed knowledge (company context scattered) | Federated always-cited answers |

**Our inversion (Johnny verbatim, this turn):** *"Big platforms use brain models to maximize attention capture. We reverse it to show users which regions of their brain are being harvested, then let them choose whether to fill dormant areas. Output: agency-granting brain inventory."*

**This is structurally identical to Tribune (which won Best Anthropic Human Flourishing) and GreenChain (which won the killer-toggle award).** Both took an industry's hidden mechanism and made it user-auditable. We're proven-shape, not novel.

## What users actually DO with empowerment (from winner corpus)

The strongest cohorts of empowered-users took two actions:
1. **Got a shareable artifact** they kept (Diffuji thermal sticker; Tribune voice-clip)
2. **Took a concrete next action** (changed what they consumed, sent the artifact to a friend, advocated)

The weakest cohort had an "aha" moment but life moved on. **Stats-without-artifact-without-action = forgettable.**

This validates Johnny's instinct that *"Spotify Wrapped is just stats — there should be more that comes out of it."*

## The 5 adaptations on the table

### 🥇 Adaptation 1 — Iterative Brain-Fill ("interactable Wrapped")

**Pattern:** Wrap card shows dormant region → user clicks → system suggests format → user uploads test clip → brain re-encodes (~2-3s) → heatmap updates live → user sees their own agency closing the causal loop.

**Demo change:** BEAT-4 extends from one-shot Land card → multi-step fill-loop. User watches their own brain-fire pattern *change in response to their choice.* This is the *un-blackbox-the-causality* moment.

**Cost:** 6-8h (Jacob: WebSocket re-encode handler + heatmap refresh; Junsoo: TRIBE batch re-encode on K2 Fast Tier)

**Risk:** TRIBE re-encode latency must be ≤3s. Friday smoke test #1 gates this.

**Why this is the high-value pick:** validates Johnny's exact wish + past-winner-proven-shape + makes the empowerment loop *visible in 10 seconds.*

### 🥈 Adaptation 2 — Shareable Brain Card

**Pattern:** Generate a 1:1 aspect-ratio image (Instagram Story shape) showing user's brain-consumption fingerprint. Top 5 activated regions, top 3 dormant, formats consumed/avoided. *"My brain this week — what about yours?"* + shareable link.

**Demo change:** BEAT-4 close → "Share Your Brain" button → generated card. User keeps an artifact. Card seeds viral loop (friend taps link → uploads own feed → gets own card).

**Cost:** 3-4h (Johnny: card template; Jacob: Sharp/Puppeteer rendering)

**Risk:** Low. Implementation is well-trodden.

**Why this is a high-value pick:** lowest cost, gives user takeaway artifact, addresses Johnny's "stats are not enough" critique, doubles as Sideshift viral-mechanic.

### 🥉 Adaptation 3 — Inverted-Brain-Search Prompt Gallery

**Pattern:** Land card surfaces 3-5 *generated search prompts* user can copy-paste into YouTube/TikTok immediately. Format: *"DIY music production"*, *"classical pianist hands close-up"*, *"synthwave ambient mix."* Generated by K2+Opus from dormant region + consumption history.

**Demo change:** Land card from "abstract format suggestion" → "executable search prompts." User's takeaway is *concrete* — they leave with something to search.

**Cost:** 4-5h (Junsoo: K2 prompt template; Jacob: dropdown UX + copy-to-clipboard)

**Why this is medium-value pick:** bridges insight → action; aligns with anti-recommender thesis (it's *format suggestions* + *user-initiated search*, not platform-recommendation).

### 4. Group Brain Visualization

**Pattern:** Multi-friend social-proof — invite friends to share their analyses (not videos, just results). Aggregate dorm/group brain stats.

**Cost:** 8-10h. **Risk:** demo-day reliability (multi-device sync).

**Verdict:** higher cost, higher risk. **Skip for hackathon; hold for V2.**

### 5. PDF Audit Report

**Pattern:** 7-page formal audit (per-region charts, risk flags, recommendations, methodology). User hands it to parent / therapist / educator.

**Cost:** 5-6h. **Risk:** low demo impact (judges don't read PDFs on stage).

**Verdict:** strong for enterprise positioning, weak for demo. **Skip for hackathon; hold for V2.**

## The recommended-pick triage

Per agent's own ranking + our locked constraints:

**MUST-PICK (1 of):** Adaptation 1 — Iterative Brain-Fill. Validates Johnny's instinct, past-winner-proven, transforms BEAT-4 from one-shot to causality-loop.

**HIGH-ROI ADD (1 of):** Adaptation 2 — Shareable Brain Card. Lowest cost, gives user takeaway, doubles as Sideshift viral mechanic.

**OPTIONAL (1 of):** Adaptation 3 — Prompt Gallery. Adds the *executable* layer to the empowerment claim. If time permits.

**Skip:** Group brain (V2), PDF audit (V2).

**Cumulative cost (1+2):** 9-12 person-hours. Within 6-13h headroom we already have.

**Cumulative cost (1+2+3):** 13-17 person-hours. Tight but doable if Junsoo's TRIBE pipeline runs smoothly.

## Critical assumption check

All three picks depend on **TRIBE V2 re-encoding latency ≤3s** for fresh clips. This is the gate. Junsoo's Friday-night smoke test #1 confirms or denies. If latency is higher: pre-cache fallback applies (the user's "fill clip" is hand-curated for the demo input video; demo runs as if live).

## What this changes about the locked spec

If Johnny picks 1+2:

**PRD §3 — Solution architecture:** Output layer description gets updated. Wrapped cards become *interactive* (click → fill → re-encode loop). Plus shareable card output.

**PRD §6 — Sponsor closes:** Sideshift gets stronger (the shareable card IS the consumer viral hook). YC gets stronger (the iterative loop IS the personal-cognitive-infrastructure being built).

**`narration-script-3min.md` — Act 3 BEAT-4:** Currently shows one-shot Land card. Update: show ONE iterative cycle (5s of "click → format suggestion → upload test clip → heatmap shifts"). Tighter, more visceral. Plus close with "share your brain" card visible.

**`demo-script.md`:** Update BEAT-4 with the iterative loop + shareable export. Update I/O contracts for re-encode latency requirements.

**`tasks-by-person/junsoo-tribe-v2.md`:** Add TRIBE re-encode batch latency requirement (≤3s).

**`tasks-by-person/jacob-agent-swarms.md`:** Add WebSocket re-encode handler.

**`tasks-by-person/johnny-orchestration.md`:** Add iterative-loop UI flow + shareable card template.

**`tasks-by-person/emilie-storytelling-research.md`:** Add 1:1 share-card design as deliverable.

## The Socratic question

> **Q (Phase 6.8):** Which adaptations to fold in?
>
> - **A. Adaptation 1 only** (Iterative Brain-Fill) — minimum viable upgrade, ~6-8h. Validates Johnny's instinct directly. BEAT-4 transforms from static-card to causality-loop.
> - **B. Adaptation 1 + 2** (Iterative + Shareable card) — recommended. ~9-12h. User leaves with both *the insight* and *the artifact*. Doubles as Sideshift viral mechanic.
> - **C. Adaptation 1 + 2 + 3** (full triple) — ~13-17h. Most complete user takeaway. Insight + artifact + executable next action. Tight but doable.
> - **D. None — keep current spec** — ship what's locked. Risk: stats-as-output critique unresolved.
>
> **Recommended: B.** Adaptation 1 closes Johnny's stated gap; Adaptation 2 gives the user takeaway artifact AND the Sideshift consumer viral hook AND costs almost nothing extra.
>
> Adaptation 3 is the bonus pick if Junsoo's pipeline finishes early Saturday morning.
