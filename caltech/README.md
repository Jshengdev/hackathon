# `caltech/` — Demo, pitch deck, planning, story

**Owner:** Johnny Sheng
**Mandate:** ship the demo on Saturday 11 PM. Cinematic acts + voiceover + sponsor swap-slides + dashboard recording + Devpost submit. You're downstream of Jacob's + Junsu's verification — once they sign off that the system works, you make it look like a demo.

---

## What this is

`caltech/` is the project work area: planning, design, story, demo assets, pitch deck. It's the home for everything that isn't `backend/` (Jacob) or `frontend/` (Junsu). When the demo runs, it's `backend/` + `frontend/`. When it sells, it's `caltech/`.

This dir is also where canonical architecture lives: `caltech/architecture-overview.md` (long-form prose) and `caltech/NEW-ARCHITECTURE.md` (single-doc summary) are the source of truth that every Claude instance reads before touching code.

---

## Repo map

```
caltech/
├── README.md                                  ← this file
├── NEW-ARCHITECTURE.md                        ← canonical v2 pipeline summary
├── architecture-overview.md                   ← long-form architecture prose (v2-current)
├── 3-PERSON-PARALLEL-PLAN.md                  ← Jacob/Junsu/Johnny task split
├── prd.md                                     ← legacy PRD (pre-v2; reference only)
├── prd-final.md                                ← legacy PRD final v1 (reference only)
├── prfaq.md                                    ← Working-Backwards PRFAQ (Stage 1)
├── PRD-INPUT-BUNDLE.md                         ← all PRD source material in one bundle
├── PRD-BUILDER-ACTIVATION-PROMPT.md            ← prompt that built the PRD
├── PITCHDECK-BUILDER-ACTIVATION-PROMPT.md      ← prompt for the deck
├── 3-person-build-plan.md                      ← legacy 3-person split (v1; superseded by 3-PERSON-PARALLEL-PLAN.md)
├── demo-script.md                              ← 90-second demo runbook (your reference)
├── narration-script-3min.md                    ← 3-min Round 2 launch video script
├── video-story.md                              ← cinematic acts (1-4) story design
├── video-story-empathy-layer.md                ← extended cinematic narrative
├── emilie-brief.md                             ← packaging + UI brief (older lane assignment)
├── CONSOLIDATION-REPORT.md                     ← research consolidation status
├── RESEARCH-CONSOLIDATION-PROTOCOL.md          ← protocol for fusing research streams
├── pitch-deck/                                 ← Next.js pitch deck (separate project)
│   ├── DESIGN.md                               ← Clay design system (canonical tokens)
│   ├── PITCH-STORY.md
│   ├── README.md
│   ├── package.json
│   ├── app/
│   │   ├── globals.css                         ← canonical CSS tokens
│   │   ├── layout.tsx, page.tsx
│   │   ├── round-1/page.tsx                    ← 5-min pitch deck
│   │   ├── round-2/page.tsx                    ← 3-min launch video deck
│   │   ├── sponsor/[sponsor]/page.tsx          ← per-sponsor variant
│   │   └── components/                         ← Brain, BrainCanvas, Halftone, NavDots, RedDot, SlideKit
│   ├── remotion/                               ← Remotion compositions for video clips
│   └── public/clips/                           ← rendered MP4s
├── use-cases/                                  ← scenario writeups
│   ├── ironside.md
│   ├── listenlabs-sideshift.md
│   ├── two-demo-scenarios.md                   ← clip selection rationale
│   ├── empathy-layer-hero-output.md
│   ├── empathy-layer-prd-simplified.md
│   ├── outsider-advantage-check.md
│   └── yc-partner-stress-test.md
├── yaps/                                       ← Johnny's voice-note dumps (raw thought capture)
│   ├── 2026-04-25-empowerment-synthesis/
│   ├── 2026-04-25-capability-first-pivot/
│   ├── 2026-04-25-execution-layer-search/
│   ├── 2026-04-25-listenlabs-conversation/
│   ├── 2026-04-25-future-angle-bci-superhumanitarian/
│   ├── 2026-04-25-prfaq-canvas/
│   └── 2026-04-25-team-execution-status/        ← latest team-state yap (rawest)
├── research-context/                           ← curated research extracts feeding the PRD
├── tasks-by-person/                            ← legacy v1 lane assignments (superseded by 3-PERSON-PARALLEL-PLAN.md)
├── tier-2-epics/                               ← downstream packaging epics (brand, landing, deck, social, tech-writeup)
└── context/                                    ← team + sponsor context briefs
```

---

## Locked rules (for the demo)

1. **TRIBE V2 is pre-rendered, NEVER live.** Every demo clip needs `backend/prerendered/<clip_id>/activity.json`. Mp4 + activity.json + scenario.json (minimum). Vision + swarm + empathy + falsification are pre-baked Saturday 8 AM (Dev C task C.7).

2. **No silent-stub fallbacks.** When a stage fails on stage, the frontend renders "REAL DATA MISSING" red — NOT a fluent stub. This is honesty discipline; judges will catch a happy-stub demo.

3. **Pre-cache freeze Saturday 8 AM.** From that point on, demo runs from disk only. No live API calls during the actual demo (those are the live-attempt path, gated to the warm cache).

4. **Forbidden claims (PRD §5).** No reverse inference ("she felt grief"), no clinical claims, no sub-second predictions, no population-norm comparisons, no inflated TRIBE numbers. The empathy paragraph stays observational + brain-pattern-grounded.

5. **Design system = Clay** (`caltech/pitch-deck/DESIGN.md`). Blueberry navy `#01418d` (accent), pomegranate `#fc7981` (failure), warm cream `#faf9f7` (slide bg, NOT app bg). Roobert + Space Mono fonts.

---

## Demo flow (90 seconds, on stage)

Per `caltech/demo-script.md` (BEAT-0 → BEAT-5):

1. **BEAT-0 (10s)** — sponsor swap-slide intro (Ironsight / Listen Labs / Sideshift / YC variant)
2. **BEAT-1 (15s)** — clip upload → Loading → Dashboard reveal
3. **BEAT-2 (20s)** — brain hover; click 2-3 regions → RegionPopup with K2 readings + paper citations
4. **BEAT-3 (25s)** — iterative loop reveal: round-by-round score climbs (0.42 → 0.84) with paragraph excerpts
5. **BEAT-4 (15s)** — falsification delta reveal: `0.84 vs 0.27 → ANCHORED` (NOT `0.84 vs 0.84 → generic_plausible` — that's the bug Jacob's R1 fixes)
6. **BEAT-5 (5s)** — sponsor swap-slide close + closing line

---

## Demo clips

Currently 4 clips registered:
- `30s_ironsite` — workplace · construction (primary live demo)
- `30s_twitter` — consumer · feed scroll (secondary; Listen Labs lane)
- `30s_ironsite2` — workplace variant 2 (mp4 not yet dropped; could be falsification control per A1-deepdive Option (i))
- `30s_ironsite3` — workplace variant 3 (mp4 not yet dropped; reserve)

You decide which clips run on stage in JS.3 (per `3-PERSON-PARALLEL-PLAN.md` §5). Recommended: `30s_ironsite` primary + `30s_ironsite2` as the falsification control (same construction domain, different scene → solid within-subject contrast).

---

## Verification gates (you read these before shipping)

Johnny depends on Jacob's + Junsu's verification reports:

| Read this | Before this | Demo can ship if |
|---|---|---|
| `refactor/audits/V-jacob-backend.md` | shooting cinematic acts | All 16 J.* entries written; 0 P0 broken; `/demo/empathy/30s_ironsite` returns full real document |
| `refactor/audits/V-junsu-frontend.md` | recording dashboard footage | All 15 U.* entries written; 0 P0 broken; manual drive-through shows real data at every stage |
| `refactor/audits/B*-verification.md` × 9 | Devpost submit | All B-pass shards report `ALL_CLOSED` |

If any gate fails, escalate to the dev who owns the lane.

---

## Johnny's task list (14 tasks, JS.1 → JS.14)

Full table in `caltech/3-PERSON-PARALLEL-PLAN.md` §5. Highlights:

| # | Task | Output | Dep |
|---|---|---|---|
| JS.5 | Sponsor swap-slides (Ironsight / Listen Labs / Sideshift / YC) | 4 PDFs in `caltech/pitch-deck/sponsor/` | none — start now |
| JS.11 | FAQ ammunition deck (Q1-Q5 + Q-INT-1..15) | `caltech/faq-ammunition.md` | none — start now |
| JS.6 | Cinematic Acts 1+4 shoot | `caltech/cinematic/acts-1-and-4.mp4` | none |
| JS.7 | Voiceover (Maya + Guide registers) | `caltech/voiceover/{maya,guide}.wav` | none |
| JS.3 | Demo clip selection | `caltech/demo-clip-selection.md` | JS.1 + JS.2 (verification gates) |
| JS.8 | 3-min Round 2 launch video assembly | `caltech/launch-video.mp4` | JS.6 + JS.7 + Junsu dashboard ready |
| JS.9 | Pitch deck Round 1 + Round 2 final | `caltech/pitch-deck/app/{round-1,round-2}/page.tsx` | R-DOCS merged ✅ |
| JS.10 | Devpost write-up | `caltech/devpost.md` | JS.8 + JS.9 |
| JS.12 | Pre-cache assembly test (Sat 6 PM) | `caltech/pre-cache-test.md` | C.7 (Dev C cache pre-bake) |
| JS.13 | Dress rehearsal — 3 Gen-Z teens | `caltech/dress-rehearsal-notes.md` | JS.8 |
| JS.14 | Devpost submit (Sat 11 PM) | submission URL captured | all other JS tasks |

---

## Audit reports relevant to demo + deck

- `refactor/audits/A5-prd-alignment-master.md` — sponsor pitch alignment per track + use-case differentiation between clips
- `refactor/audits/A8-brain-dashboard-redesign.md` — dashboard target (what Junsu's R8 will build for you to film)
- `refactor/audits/A9-doc-audit-and-cleanup.md` §2 — deprecation catalog (which `caltech/` docs are stale; might affect pitch-deck source material)
- `caltech/pitch-deck/DESIGN.md` — your design language (Clay tokens, Roobert + Space Mono, hover micro-animations)
- `caltech/yaps/2026-04-25-team-execution-status/00-raw-yap.md` — your latest team-state yap (read this first)

---

## Sponsor track checklist

| Sponsor | Pitch | Deliverable variant |
|---|---|---|
| **Ironsight CORE** ($5K) | The K2 swarm gives the video information it didn't have before (per-region cognitive context behind the action) | sponsor swap-slide + clip = `30s_ironsite` |
| **Listen Labs CORE** | Same engine, modular Opus framing per persona — workplace / consumer / pavilion | sponsor swap-slide + clip = `30s_twitter` |
| **Sideshift CORE** | Empathy layer = the substrate Sideshift's vault grows on | sponsor swap-slide |
| **IFM K2 CORE** | K2 plays 3 load-bearing roles on one surface — specialists + moderator + evaluators. NOT a side API call. | sponsor swap-slide; the architecture itself is the pitch |
| **Best Use of AI HARD TARGET** | YEA/NAY rubric is the closing slide; the product enacts the rubric | closing slide |
| **YC stretch** | Future-Obsidian framing for the consumer scenario | sponsor swap-slide |
| **Creativity** | The architecture's three-roles-on-one-surface novelty | woven into JS.10 Devpost |

---

## Common ops

```bash
# Where the rendered demo lives
ls caltech/pitch-deck/public/clips/

# Rebuild pitch-deck (Next.js)
cd caltech/pitch-deck && npm run dev    # localhost:3001 (separate from frontend :3000)
cd caltech/pitch-deck && npm run build  # production build

# Render Remotion compositions to MP4
cd caltech/pitch-deck && npm run render  # check package.json for exact script

# Check that demo clip is fully cached (your gate before recording)
ls backend/prerendered/30s_ironsite/
# expected files: 30s_ironsite.mp4, activity.json, scenario.json,
#                 vision_report.json, swarm_readings.json, k2_region_cache.json,
#                 empathy.json, falsification.json

# Eyeball the Empathy Document for a clip (your "is this the demo paragraph" check)
curl -s http://localhost:8000/demo/empathy/30s_ironsite | jq '.best_paragraph'
```

---

## Hand-off contracts

**From Jacob:** the V-jacob-backend.md report is your gate. Read it before shooting cinematic acts.

**From Junsu:** the V-junsu-frontend.md report is your gate. Read it before recording dashboard footage. Also: Junsu's R8 dashboard rebuild is the visual surface for your launch video — coordinate timing.

**To both Jacob + Junsu:** if you spot a demo-day risk in their domain (e.g. "the falsification number looked weird at 0.27"), file an ask in `refactor/audits/JS-asks.md` — they pick up.

---

## What this README does NOT cover

- Backend internals → see `backend/README.md`
- Frontend internals → see `frontend/README.md`
- Architecture rationale → `caltech/architecture-overview.md` (long-form)
- Pipeline single-doc → `caltech/NEW-ARCHITECTURE.md`
- The exact PRD requirements → `_bmad-output/planning-artifacts/ironsight-listenlabs-{technical-prd,prd}.md` (v2.1, post-R-DOCS)

If anything's ambiguous: read those + `refactor/CONSTRAINTS.md`. If still ambiguous, escalate to the orchestrator.
