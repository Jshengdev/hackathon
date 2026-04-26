# AMY DEMO — Live Product Walkthrough

> **Section-by-section voiceover for the actual dashboard (frontend at `/demo`).**
>
> Walks the 5 stages of the live product: landing → loading → main → iterative-reveal → empathy-document. Each stage gets: what's on screen, what to do, what to say, which tech-stack details to drop, and where the persona-specific moments land.
>
> **This is the LIVE PRODUCT walkthrough — not the pitch deck voiceover.** The deck content is mapped INTO this walkthrough so you only need this one doc on stage with the dashboard open.
>
> Stage indicator (bottom-left of the dashboard) shows which stage you're in. Use the `Next →` button or the natural transitions to advance.

---

## TOTAL BUDGET — ~90-120 seconds

| Stage | Time | What it covers |
|---|---:|---|
| 1 — landing | 5-10s | clip select · framing |
| 2 — loading | 10-25s | the 6-stage pipeline (the explanation goes here) |
| 3 — main | 30-45s | brain + video + click-to-K2 (the awe beat) |
| 4 — iterative-reveal | 15-20s | score climb · Clair de Lune chip |
| 5 — empathy-document | 20-30s | final paragraph + falsification + close |

---

## PRE-DEMO SETUP

- **Backend running:** `cd backend && uvicorn main:app --reload` on port 8000
- **Frontend running:** `cd frontend && npm run dev` on port 5173 (or wherever Vite lands)
- **Pre-baked clips ready:** verify `backend/prerendered/<clip_id>/activity.json` exists for the demo clips you'll show
- **Network on:** OpenRouter + K2 keys live in `backend/.env` — but pre-baked cache should make this resilient
- **Stage indicator visible:** bottom-left should show `LANDING` before you start

---

## STAGE 1 — LANDING (5-10s)

**On screen:** grid of clip thumbnails, each labeled with scenario (construction / reels / lecture-hall / etc).

**What you do:**
- Pick the construction clip as the anchor (most physically legible). Verbal callouts to Reels + lecture-hall at the close cover the other two personas.
- Click the thumbnail → triggers `POST /demo/match` → backend kicks off warmup BackgroundTask.

**Voiceover (~10 sec):**
> *"Every company in the world is making decisions about humans using data that was never designed to understand them. Here's a 40-second clip — a construction worker on a job site. The dashboard would have flagged it 'slow.' Watch what amy does with it."*

**Tech mentions:** none deep yet — just frame the input.

**Persona variants:**
- Ironsight: *"a construction worker on a job site"*
- Listen Labs: *"a Gen-Z user scrolling Instagram Reels"*
- AI Interaction: *"a 90-second clip of a loud lecture hall"*

**Transition:** clip select → loading stage automatically (clipId set, stage advances).

---

## STAGE 2 — LOADING (10-25s) — *the explanation goes here*

**On screen:** progress indicator counting through warmup stages — vision_report, swarm_readings, k2_region_cache, empathy, iterative_trajectory.

**What you do:**
- Stand still. The backend is pre-baking the five Layer-1 JSON files via `BackgroundTask` triggered by `/demo/match`. Should take ~15-25s total.
- This is where you deliver the 6-stage pipeline narrative — the audience has nothing to look at except progress dots, so the voice carries the slot.

**Voiceover (~25 sec):**
> *"While that loads — here's what's happening in the background. Six stages. **Qwen3-VL** describes the action-data baseline: who moved where, how long. Then **Meta's TRIBE V2** brain encoder predicts the cortical response that brain would have produced — about 20,000 vertices on the fsaverage5 mesh, one second at a time. We pre-render this offline so we don't pay GPU cost on stage. Reproducibility, not shortcut. Then a **K2 swarm on Cerebras** fans out — eight specialists in parallel at about 2,000 tokens a second, one per cortical network. Each reads its region's activation. **Claude Opus** writes a candidate paragraph. The same swarm comes back as evaluators, eight rounds, plateau exit. And finally a falsification check against a control video. Total cost: about three cents a run."*

**Tech mentions (front-load here, you have the audience's ears):**
- **Qwen3-VL** via OpenRouter — `qwen/qwen3-vl-235b-a22b-instruct`, vision baseline only, no emotion claims
- **TRIBE V2** by Meta FAIR — ~20,000 cortical vertices on fsaverage5 mesh, 1Hz prediction, 5-second hemodynamic lag baked in, trained on ~25 subjects, open-source on HuggingFace under CC-BY-NC-4.0
- **Pre-rendered offline** — `backend/prerendered/<clip_id>/activity.json` is the canonical brain artifact
- **K2 Think on Cerebras** — ~2,000 tok/s, OpenAI-compatible chat completions, 8 parallel specialists
- **Claude Opus 4.7** writes the paragraph (per Devpost copy)
- **K2-as-evaluator iterative loop** — 8 rounds, plateau exit, per-region attribution preserved
- **Embedding-proxy falsifier** — sentence-transformer (`all-MiniLM-L6-v2`) → 7-dim Yeo7 projection W, CPU-only, ≤200ms per check
- **Total cost:** ~$0.03 per 90-second run

**Transition:** loading completes → fires `done` event with `vision` + `activity` payload → main stage.

---

## STAGE 3 — MAIN (30-45s) — *the awe beat*

**On screen:** split-screen.
- **LEFT half:** 3D cortical brain (Three.js, ~20K vertices on fsaverage5). Hint overlay top-right: *"click any of the 7 regions to ask K2"*
- **RIGHT half:** the source video with play/pause + scrubber + duration. As the video plays, brain regions light up in sync (1Hz refresh from `activity.json`).
- Bottom: video bar, scrubber, optional stimulus tag.

**What you do:**
1. Click `▶ Play clip`. Brain starts pulsing in sync with the footage.
2. Pause briefly, let the audience absorb the brain firing.
3. Click a brain region (recommend: the salience or threat-detection lobe for construction) → opens `RegionPopup` with K2 specialist response + confidence + citation. Backend call: `POST /demo/k2-region`.
4. Read the popup line aloud. This is the "K2 specialist talking" moment.

**Voiceover (~40 sec):**
> *"This is the brain. About 20,000 cortical points on the fsaverage5 mesh, predicted second by second by TRIBE V2 from the same video frames you're watching on the right. Watch what lights up as the worker walks the platform."*
>
> **[Let the brain animate for ~5 sec while video plays.]**
>
> *"Each cluster is one of the seven Yeo cortical networks — visual, somatomotor, dorsal-attention, ventral-attention which is salience, limbic which is emotional-processing, frontoparietal which is prefrontal control, and default-mode. We assigned one K2 specialist per network. Click any region…"*
>
> **[Click a region — say, the threat-detection / salience cluster.]**
>
> *"…and that specialist tells you what its region was contributing. Threat-detection sustained at peak, attention narrowed — the worker isn't slow, he's calibrating against an environment the camera can't see. Eight specialists, running in parallel, each one accountable to its own piece of the brain."*

**Tech mentions:**
- BrainScene renders all ~20K vertices in real-time at 30fps using Three.js
- Region click triggers `POST /demo/k2-region` — backend pulls the cached K2 specialist reading for that region from `swarm_readings.json`
- The 7 Yeo7 networks named in order
- K2 chosen for low hallucination rate — load-bearing because a hallucinating specialist is a specialist that lies about a brain region
- JSON activation values from TRIBE V2 → mapped through neuroscience-paper-grounded Python middleware → semantic readings the swarm can reason over

**Persona variants:**
- Ironsight: lean on the **threat-detection + memory networks** (the worker reading hazard signals)
- Listen Labs: click **default-mode** (the convergence-into-cohort moment)
- AI Interaction: click **frontoparietal** (the prefrontal disengagement in the lecture clip)

**Transition:** click `Next →` button (top-right) → fires `next` event → iterative-reveal stage.

---

## STAGE 4 — ITERATIVE REVEAL (15-20s) — *the surprise beat · 4-second silence*

**On screen:** iterative loop animation — round-by-round score climbing, candidate paragraphs being rewritten in place. RoundScoreBar visualizes the climb.

**What you do:**
- Watch. Don't speak over the climb. **The 4-second silence is the script.**

**Voiceover (~20 sec — INCLUDES 4 SECONDS OF SILENCE):**
> *"Here's the surprise. Each round, Claude Opus writes a new candidate paragraph. TRIBE V2 scores it forward against the actual brain pattern from the footage. Eight rounds, plateau exit."*
>
> **[Pause. Watch the score climb on screen. ~4 seconds.]**
>
> *"0.42, 0.58, 0.71, 0.84. Eight rounds in under 60 seconds. The same iterative loop architecture I shipped on Clair de Lune music last spring — 90.4 percent match across 20,484 vertices in the emotion center. Same protocol, run in reverse."*

**Tech mentions:**
- 8 rounds of iterative scoring with plateau exit
- Claude Opus 4.7 writes each candidate; TRIBE V2 scores forward against actual brain pattern
- Trajectory data lives at `GET /demo/iterative-trajectory/<clip>`
- **Clair de Lune precedent** — forward-direction match: 90.4% across 20,484 vertices in emotion center, refused aggressive speech / rain / triumphant music (shipped 2026-03)

**Persona variants:** none — score climb is universal across personas.

**Transition:** reveal animation completes → fires `reveal-done` event → empathy-document stage.

---

## STAGE 5 — EMPATHY DOCUMENT (20-30s) — *the output + falsification + close*

**On screen:** the final document — three sections:
- **§A Vision Report** — what the action-data dashboard would have seen on its own (the baseline)
- **§B Empathy Layer** — the brain-grounded paragraph + brain-pattern similarity score (e.g. 0.84)
- **§C Falsification Evidence** — verdict line, expandable per-region attribution table, expandable round-by-round trajectory

**What you do:**
1. Point at §A — "this is the dashboard on its own — useless"
2. Point at §B — read the paragraph aloud (or paraphrase). Land the similarity number.
3. Point at §C — the falsification verdict. Expand the attribution table briefly if you have time.

**Voiceover (~30 sec):**
> *"Here's what the manager reads instead of the dashboard. §A is the action-data baseline — 'walked the platform, paused, picked up a tool.' Flat. Useless. §B is the empathy layer paragraph — 'threat-detection sustained at peak for forty minutes; the worker isn't slow, he's calibrating against an environment the camera couldn't see.' Brain-pattern similarity: 0.84."*
>
> **[Point at §C falsification block.]**
>
> *"And §C is the falsifier. Same paragraph scored against a control scene — 0.27. A delta of 57 points. The paragraph belongs to THIS scene specifically, not generically to humans. Cosine distance doesn't lie. **Three cents a run.** Same engine handles a Reels feed for simulating Gen-Z autonomy, a lecture-hall environment for design taste — wherever a human's experience needs to become operational data."*

**Tech mentions:**
- §A pulled from Qwen3-VL output — `vision_report.scene_summary` + `vision_report.actions[]`
- §B paragraph pulled from `/demo/empathy/<clip>` — final winning paragraph after the 8-round loop
- §C falsification pulled from `/demo/falsification/<clip>` — main score, control score, delta, verdict, per-region attribution
- **Falsification math:** sentence-transformer `all-MiniLM-L6-v2` → 7-dim Yeo7 projection W → cosine similarity vs activity target + control delta
- Within-subject contrast only — no population norms
- Per-region attribution = each Yeo7 network reports its candidate-vs-target match score with a justification line

**Persona variants:**
- Ironsight close: *"Same engine handles a Reels feed for simulating Gen-Z autonomy, a lecture-hall environment for design taste."*
- Listen Labs close: *"Same engine handles construction footage for spatial-intelligence on the worksite, a lecture-hall environment for design taste."*
- AI Interaction close: *"Same engine handles construction footage for spatial-intel, a Reels feed for cognitive simulation."*

(Always reference the OTHER two personas at the close — this is how the live demo lands all three problems in one run.)

---

## TIMING BUDGET CHEAT-SHEET

| Stage | Voiceover | Hero number to land | Stage transition |
|---|---|---|---|
| 1 — landing | "Every company is making decisions about humans using data that was never designed to understand them." | (none) | click clip → auto |
| 2 — loading | the 6-stage pipeline narrative | $0.03/run | auto when warmup done |
| 3 — main | "About 20,000 cortical points predicted second by second" + click region | (the click is the moment) | click `Next →` |
| 4 — iterative | "0.42, 0.58, 0.71, 0.84… 90.4% on Clair de Lune" | 0.42 → 0.84 + 90.4% | auto on reveal complete |
| 5 — empathy doc | "Three cents a run. Same engine handles…" | 0.84 / 0.27 / 0.57 delta | (end) |

---

## BACK-POCKET LINES (when judges press)

**"How is TRIBE V2 not just confabulating?"**
> The brain pattern is a fixed target — not generated. The score climbs only if the paragraph aligns with the actual pattern. The control delta is the receipt: if the paragraph were generic, it would score the same against the wrong scene too. 0.27 says it doesn't.

**"What's the cost at scale?"**
> $0.03 per 90-second clip. K2 throughput closes the iterative loop in human time. TRIBE V2 is open-source on HuggingFace under CC-BY-NC-4.0. The falsification scorer runs on a sentence-transformer embedding proxy — CPU only, ~200ms per check. No GPU dependency at inference for the scoring stage.

**"Why three audiences in one engine?"**
> Same architecture, different scenarios. Construction footage gives **Ironsight** a new modality for spatial intelligence — cortical signal layered on the camera. Reels footage gives **Listen Labs** a simulation of how the brain converges to the algorithm — neurons firing, not text personas. A reference video gives the **AI Interaction** track a cosine match for taste — feeling translated to a metric. One binary. Three hires.

**"What's NOT working yet — what would you fix first?"**
> Workplace fine-tunes. TRIBE V2's canonical training set is naturalistic video — it doesn't include construction sites or hospital floors. Industry-specific fine-tunes close that gap. Second priority: streaming inference. We run 30-90 second clips today; the architecture extends to streaming windows in real-time.

**"Show me a region click."**
> Go back to the main stage (browser back or refresh + reselect clip). Click a different region than you did the first time. The popup shows the K2 specialist's reading for that network with confidence + citation.

---

## SAFETY ANSWERS (when something breaks live)

| Failure | Recovery |
|---|---|
| Backend `/demo/match` returns 500 | Check `backend/.env` for K2_API_KEY + VISION_API_KEY. Restart `uvicorn main:app --reload`. The pre-baked artifacts in `backend/prerendered/<clip_id>/` should still load. |
| TRIBE pre-render missing | Fall back to a clip you know is pre-rendered. List available: `ls backend/prerendered/`. |
| K2 latency spikes mid-loop | Pre-baked iterative trajectory loads from `backend/prerendered/<clip_id>/iterative_trajectory.json`. Show the cached climb; mention "running with the cached read." |
| WebSocket drops | Refresh the page. The `iterative-reveal` stage will re-pull from `GET /demo/iterative-trajectory/<clip>` on mount. |
| Region click does nothing | The K2 region call may have timed out. Click another region. The popup shows pre-baked readings from `k2_region_cache.json`. |
| Whole demo broken | Last resort: open the screen-record fallback in QuickTime, narrate over it. The voiceover script above still works frame-by-frame against the recording. |

---

## NUMBERS YOU MUST KNOW COLD

| Number | What it is | Drop in stage |
|---|---|---|
| **20,000** | Cortical vertices predicted per second | Stage 2 (loading), Stage 3 (main) |
| **fsaverage5** | The brain mesh standard | Stage 2 (only if asked) |
| **1 Hz** | TRIBE V2 prediction rate | Stage 2 |
| **5 sec** | Hemodynamic lag baked into prediction | Stage 2 (only if asked) |
| **~25** | TRIBE V2 training subjects | (only if asked) |
| **8** | K2 specialists in parallel | Stage 2, Stage 3 |
| **2,000 tok/s** | K2 Think on Cerebras throughput | Stage 2 |
| **8 rounds** | Iterative loop length | Stage 2, Stage 4 |
| **0.42 → 0.84** | Score climb hero reveal | Stage 4 |
| **90.4%** | Clair de Lune precedent across 20,484 vertices | Stage 4 |
| **0.84 / 0.27 / 0.57** | Hero / control / falsification delta | Stage 5 |
| **$0.03** | Cost per 90-second run | Stage 2 + Stage 5 close |

---

## WHAT TO PRACTICE BEFORE STAGE

1. **The Stage 2 narrative arc.** This is the densest minute of voiceover. Practice it cold so you don't trip on the model names or the stack picks. The audience is staring at a progress bar — your voice IS the slide.
2. **The region click on Stage 3.** Pick which region you'll click. Click it the same way every time. Read the popup line aloud naturally.
3. **The Stage 4 silence.** Practice counting to 4 silently while the score climbs. The silence is the script.
4. **The "three cents a run" punchline.** Land it like a closer, not a footnote.
5. **The three-persona close on Stage 5.** Memorize the sentence — *"Same engine handles X, Y — wherever a human's experience needs to become operational data."* — three persona variants.

---

_First draft of the live product walkthrough. Run it once with the dashboard open. Tell me which stage feels long, which transitions are awkward, and which back-pocket lines you want sharper._
