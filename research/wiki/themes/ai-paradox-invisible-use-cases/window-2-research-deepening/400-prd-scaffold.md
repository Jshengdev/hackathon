# 400 — PRD scaffold (HackTech 2026)

> ## ⛔ PARKED — DO NOT CONTINUE HERE
> **Per Johnny's directive 2026-04-25:** *"Try not to do any of the PRD related tasks... do not do anything regarding the PRD. Your only job here is to consolidate research into the LM wiki and define what it's capable of by creating strong indexes and also the structure. We're basically going to do a PRFAQ, where we can primarily scaffold all of and solve lock most of our decisions and then we'll create a PRD in a completely different instance of cloud that won't be related to this."*
>
> This file is preserved as feedstock for the consolidation agent (it surfaces what kind of slots a PRD will eventually need to fill, which informs decision-extraction). It is **NOT to be extended** in this session or this window. The actual PRD lives in a different Claude instance, after the PRFAQ work locks the decisions.
>
> Pre-PRD work happens via the **PRFAQ** approach — scaffold + decision-locking — which the consolidation agent's `decisions/` folder + `vocabulary.md` outputs feed into.

---

> **(Original scaffold below preserved for context — do not edit.)**

> **Status:** scaffold only. Most slots are intentionally blank — the project IDEA is Johnny's to articulate (Socratic rule). The structure, the slot definitions, the demo-philosophy framing, the sponsor-mapping skeleton, and the build-plan template are pre-loaded so that *the moment Johnny names the idea*, the PRD writes itself off the wiki.

> **Where this lives after migration:** `research/wiki/prd/current-prd.md` (this file becomes that file).

> **The one design principle that overrides everything else:** **Execution < packaging.** Johnny's directive — *"execution doesn't matter as much as the visualization of all the things that are happening and the result of that."* Every section below is scored against: does this make the demo-day human-in-front-of-us *feel* the thing?

---

## 0. Hook (the 15-second pitch)

*[TBD — Johnny names. Format: one sentence anyone in the room can repeat after hearing once.]*

**Templates that have won at peer hackathons** (for shape reference, not to copy):
- `"<vivid action> + <surprising outcome> in <time>."` — *"You parachute onto an island naked and beat strangers with a frying pan."* (PUBG one-liner the trends-slop-source uses)
- `"Take <familiar surface> and use it to <do X for Y>."` — FaceTimeOS (Cal Hacks 12 grand prize): *"FaceTime your Mac, get screenshots back via iMessage."*
- `"<Job nobody wants to do> done by <surprising agent>."` — Project Lend (Anthropic Human Flourishing 1st): *"Autonomous food bank — AI + robotics actually delivered 50+ lbs of food during the hackathon."*
- `"<Cited source> proves <surprising claim>; we built the tool that <does the inverse>."` — *(maps to Johnny's anti-slop frame)*

---

## 1. Problem (why this matters; why now)

### The invisible cost
Three sources triangulate one engine: surface confidence decoupled from underlying validity, and the interface designed to hide the decoupling.

| Domain | Invisible cost |
|---|---|
| Software craft | Comprehension debt — *"the code is the shadow; the program lives in the head"* (Hak / Naur 1985) |
| Consumer culture | Filter World — *"How do you know what you like or who you are if an algorithm has always told you?"* (Chayka, source 002) |
| Strategic judgment | Trends slop — *"AI is the internet comment section taking flesh"* (Harvard 30K-data-point study, source 003) |

### The 24-month clock
*"The biggest tech companies on the planet are shipping personal AIs, and the way they're being built is getting locked in"* (source 004). Personal AI form-factors (Ray-Ban Meta, AirPods, Vision Pro) are deciding what an entire generation thinks is real. *Window of intervention is 2 years.*

### Why now (HackTech 2026 specifically)
April 24–26, 2026. $66.4K prize pool. Sponsor stack lines up to support the un-black-boxing direction (K2 Think reasoning + Listen Labs voice + Ironside spatial + Tribe V2 brain-prediction available open-source under non-commercial license + ICLR 2026).

---

## 2. Vision (the impact statement)

> **Johnny's anchor (verbatim):** *"Restoring humanity in an age of AI and redefining what the renaissance looks like — so that it can truly be a world where the two can work: technology and human ingenuity. One that can still create and design culture, whereas one can help with the productivity. Trying to find that balance where we un-black-box some sort of technology and we do some sort of stimulation of some Socratic version."*

> **Hypothesis frame (verbatim):** *"Best Use of AI = redefining what proper AI use looks like in an unregulated, scary AI world. AI for the most people, used properly, ethically, sustainably — non-blackboxed so people can trust it."*

**Positioning:** B2C-primary, B2B-overlay.

**Frame:** not an ethics pitch — an **impact** + **competitive-positioning** pitch. The slop-producers can't enter this market without contradicting themselves.

---

## 3. Solution shape (the architectural anchors)

> Two anchors are committed; the user-facing surface is TBD.

### Anchor 1 — **Tribe V2** as the special mode
- Meta's trimodal brain encoder (V-JEPA 2 + Wav2Vec2-BERT + Llama 3.2 → transformer → 70K-voxel fMRI prediction). Public weights, ICLR 2026, non-commercial license, scaling-law confirmed.
- Gives us *measurement* — we can predict how content lands in a brain *before* it ships. The literal inverse of trends slop.
- See [`sources/006-tribe-v2-meta-trimodal-brain-encoder.md`](sources/006-tribe-v2-meta-trimodal-brain-encoder.md).

### Anchor 2 — **Agent swarms** as the coordination pattern
- Actor / Auditor / Mediator triad (source 004). Disagreement IS the binding force, not a bug.
- Auditor's diff against Actor's claim IS the un-black-boxing — the user *sees* the system reasoning with itself.
- See [`sources/004-multi-agent-alignment-actor-auditor-mediator.md`](sources/004-multi-agent-alignment-actor-auditor-mediator.md).

### Substrate — **Human mind is already a polyphony** (source 005)
- Whatever we build joins the polyphony. The augmentation isn't a new oracle; it's *one more voice* with its reasoning legible.
- See [`sources/005-kurzgesagt-the-secret-mind-and-collaborative-inner-universe.md`](sources/005-kurzgesagt-the-secret-mind-and-collaborative-inner-universe.md).

### What's NOT decided (load-bearing forks for Johnny)
1. Where does the user encounter the system? (Browser ext / app / wearable / OS-layer / creator tool)
2. Whose brain is being predicted? (User's own / demographic / target-audience)
3. What happens when Auditor disagrees with Actor? (Block / annotate / dual-display / user-vote)
4. B2C surface vs. B2B surface — which is the hero for the demo?
5. Sponsor stacking order — which 3 of the 5 are non-negotiable?

---

## 4. Demo scenario *(the most important section)*

> **The hackathon's Pareto principle: 80% of judging weight is on the demo moment. This file owns the storyboard.**

### The 4-act demo template

Each winning HackTech 2026-class project we've teardown'd follows a 4-act shape; ours should too.

**Act 1 — Hook (0:00 – 0:15).** Judge sees the wow-toggle. Single sentence, single action. *(GreenChain: sea→air toggle, emissions × 55. FaceTimeOS: literally FaceTime'd your Mac. Mira: said something to Ray-Bans, dashboard updated.)*

**Act 2 — Body (0:15 – 1:00).** Judge realizes how it works. The "oh, it's actually doing X+Y+Z together" moment. Capability stack visible. Anti-trends-slop discipline shows here.

**Act 3 — Surprise (1:00 – 1:30).** The thing they didn't see coming. *(GreenChain: write plain English to swap a supplier. Mira: caregiver dashboard updates in real-time. Tribune: every diff cites a constituent voice clip.)*

**Act 4 — Land (1:30 – 2:00).** The 1-line takeaway and call to action. Why anyone in the room cares.

### Slot — the wow-toggle
*[TBD — Johnny names. The single press / utterance / gesture that triggers Act 1. Without this, no demo. Without this, no PRD.]*

### Slot — the visualization
*Per Johnny's directive: "execution doesn't matter as much as the visualization." This slot is the answer to "what does the judge see on screen at every moment." Storyboard frame-by-frame here once Johnny names the wow-toggle.*

### Slot — the "did it really do that?" proof
*Per the grounded-citation pattern: the judge should be able to click any claim and see the evidence. What's clickable in the demo? Where does each claim cite back to?*

---

## 5. Sponsor mapping (one honest problem statement, 5 lenses)

| Sponsor | The hook this design offers them | Where in the architecture they live |
|---|---|---|
| **K2 Think** | Societal impact + uniqueness — K2 as the audit-grade reasoning engine that makes the un-black-boxing operational | Auditor agent (per source 004 triad); the reasoning that surfaces the Actor's hidden assumptions |
| **Ironside** *(verify spelling vs. "Ironsight")* | Innovative spatial-computing solution — make the invisible visible literally, in 3D / spatial UX | Visualization layer for the agent disagreement; spatial render of the polyphony |
| **Listen Labs** | Human-layer problem — voice / listening is the most human interaction channel | Actor surface (the user-facing voice); maybe also the *intake* of the user's own voice as a counter-source |
| **Best Use of AI** *(track-level)* | Redefining proper use, ethics, sustainability — the thesis itself | The architecture as a whole. Specifically: Tribe V2 + agent swarms = measurement + transparency = what proper use looks like |
| **Creativity** *(track-level)* | Freaky tech — Tribe V2 as the curveball | Tribe V2 prediction as the special mode; "we measured the brain response to AI slop and built the tool to detect it" |

### What Johnny said about this
*"One honest problem statement that rings true to all 5 sponsors."* Translation: the sponsor mapping is not 5 separately-pitched features; it's one architecture where each sponsor sees their thing as load-bearing.

---

## 6. Tech stack

> Building blocks indexed in the wiki; pull as needed.

### Frontier capability layer
- **Reasoning specialist:** K2 Think v2 (`MBZUAI-IFM/K2-Think-v2`) — see [`tools/k2-think.md`](../../../tools/k2-think.md)
- **Agent runner:** Claude Agent SDK + Modal sandboxes (per Mobius / Project Lend / FaceTimeOS pattern from TreeHacks scrape)
- **Brain-response prediction:** Tribe V2 (Meta, ICLR 2026, public weights non-commercial)
- **Voice in/out:** ElevenLabs / Vapi / Cartesia / OpenAI Realtime (Listen Labs surface)
- **Vision-language:** Gemini / Claude vision / Grounding DINO / SAM / Grounded SAM 2
- **Spatial / 3D:** Three.js / Mapbox / Apple Vision Pro / Ray-Ban Meta (Ironside hook)
- **Browser-use:** Browserbase / Stagehand
- **Search / retrieval:** Brave Search MCP / Perplexity Sonar / Elasticsearch + JINA + RRF

### Web/app stack defaults (ship-in-36h)
- Frontend: Next.js 16 + React 19 + Tailwind + shadcn/ui
- Backend: FastAPI + Pydantic v2 + SQLite (or Convex / Supabase)
- Realtime: SSE + WebSockets
- Deploy: Vercel (frontend) + Modal (Python services)

### Patterns we've already extracted (in wiki/patterns/)
- Two-stage LLM compile, robust JSON from LLMs, per-item parallel evaluation, Localize-and-Zoom, spatial sidecar, grounded citation. All cited in BRIDGE / GreenChain / Jarvis teardowns.

---

## 7. Build plan (hour-by-hour)

> Template — fill once Johnny names the wow-toggle.

**HackTech 2026 timeline (date today: 2026-04-25, day 2 of 3).**

| Time | Task | Owner | Done-when |
|---|---|---|---|
| Day 1 hour 0–4 | Idea lock + repo bootstrap | All | PRD §0 + §4 wow-toggle filled |
| Day 1 hour 4–12 | Build Act 2 capability stack | Eng | Capability stack runs end-to-end on demo input |
| Day 1 hour 12–18 | Hook + visualization layer | Frontend + design | Act 1 hook is *visible* (the toggle exists) |
| Day 2 hour 0–6 | Auditor / disagreement surface | Eng | Auditor visibly diffs Actor in real time |
| Day 2 hour 6–12 | Sponsor-stacking integration polish | Eng | All committed sponsor APIs wired |
| Day 2 hour 12–18 | Act 3 surprise wired + Act 4 land slide | All | Demo runs end-to-end in ≤ 2 min from cold |
| Day 3 hour 0–4 | Demo rehearsals (≥10 dry-runs) | Demo lead | Time-to-Act-1-hook < 15s every run |
| Day 3 hour 4–6 | Sponsor 1-liners memorized; pitches printed | Pitch lead | Each sponsor's hook can be delivered without notes |
| Day 3 hour 6–8 | Backup demo recorded (in case wifi dies) | All | mp4 lives on phone + laptop |
| Day 3 — Demo | Showtime | All | Top-3 placement OR top-sponsor track |

---

## 8. Why we win (judges' decision criteria → our advantages)

| Judge criterion (from HackTech 2026 prompt) | Our answer |
|---|---|
| Technical difficulty | Tribe V2 integration + agent-swarm coordination + multi-modal stack |
| Creativity | Tribe V2 as a special mode is genuinely uncopied at TreeHacks 2026 (verified — none of the 64 winners used it) |
| Impact | Restoring humanity / 24-month-clock framing |
| Execution | Demo-rehearsed; auditable in real time |
| **Sponsor fit (per-track)** | One architecture, 5 sponsor hooks, no Frankenstein |
| Anti-criteria (judges hate) | We are NOT a chatbot wrapper, NOT a generic "AI for X", NOT trends slop in product form |

---

## 9. Risks + mitigations

| Risk | Mitigation |
|---|---|
| Tribe V2 integration takes longer than expected (large model, non-trivial setup) | Smoke-test the inference path on day 1 hour 0–4. If can't get it running in 4h, fall back to "we wired the prediction-output schema; full inference is engineering work" — keep the architecture story intact |
| Latency stacking (5 sponsor APIs in one request path) | Async fan-out + semaphore (per `patterns/per-item-parallel-llm-evaluation.md`). Pre-cache demo scenarios |
| Demo wifi dies | Pre-recorded backup mp4. Local-only fallback path for the hook |
| Auditor / Actor disagreement is boring to watch | This is a real risk. Visualization needs to be *theatrical* — the disagreement IS the show. Storyboard early |
| Sponsor reps skeptical of "anti-AI" framing | Reframe per Johnny's pitch: not anti-AI, anti-AI-misuse. *"We're showing what proper AI use looks like."* |
| Idea drift mid-build | The Socratic-locked theme prevents this; PRD §0 + §4 are immutable once locked |

---

## 10. Team

*[TBD — fill]*

---

## 11. Appendix — sources cited

- [`sources/001-hak-systems-thinking.md`](sources/001-hak-systems-thinking.md)
- [`sources/002-algorithmic-culture-flattening.md`](sources/002-algorithmic-culture-flattening.md)
- [`sources/003-trends-slop-and-the-comment-section-in-flesh.md`](sources/003-trends-slop-and-the-comment-section-in-flesh.md)
- [`sources/004-multi-agent-alignment-actor-auditor-mediator.md`](sources/004-multi-agent-alignment-actor-auditor-mediator.md)
- [`sources/005-kurzgesagt-the-secret-mind-and-collaborative-inner-universe.md`](sources/005-kurzgesagt-the-secret-mind-and-collaborative-inner-universe.md)
- [`sources/006-tribe-v2-meta-trimodal-brain-encoder.md`](sources/006-tribe-v2-meta-trimodal-brain-encoder.md)
- [`sources/007-karpathy-llm-wiki-pattern.md`](sources/007-karpathy-llm-wiki-pattern.md)
- [`100-tribe-v2-and-agent-swarms-architectural-anchors.md`](100-tribe-v2-and-agent-swarms-architectural-anchors.md)
- TreeHacks 2026 winners scrape: `../../../scrapes/treehacks-2026-winners.md`
- Theme lock document: `../README.md`
