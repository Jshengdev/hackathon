# AMY DEMO — Live Narration Script

> **90 seconds · one video · all three personas referenced.**
> First draft built off Johnny's Devpost copy (Msg 17). Use as a speakable script
> for the live walkthrough — narrate while the dashboard runs. Stage directions
> in `[brackets]`, spoken lines in `> quotes`, timing in parens.
>
> **Anchor scenario:** construction footage (most physically legible).
> **Verbal callouts:** Reels (Listen Labs) + design environment (AI Interaction)
> at the close, so all three sponsor briefs land without three demos.

---

## CONTEXT FOR THE PRESENTER

- **Cadence:** 215 wpm pitch-pace gets you ~320 words in 90s with room for stage transitions. The script below is sized for that. Cut Beat 5's AMY interaction (~15s) if you're running long.
- **What's on screen:** Vue 3 dashboard at `/demo`. Cortical mesh center, K2 swarm panels around it, iterative loop drawer on the right, AMY chat below the empathy doc.
- **Hero numbers to land:** **0.42 → 0.84** (the climb), **$0.03 per run**, **90.4%** (Clair de Lune precedent), **20,000 vertices**, **8 specialists in parallel**.
- **The line that does the most work:** "Brain-grounded, not LLM-confabulated."

---

## BEAT 1 — THE WHY (0:00 → 0:10)

**[Dashboard open. Construction clip thumbnail in the matcher. Don't click yet.]**

> *"Every company in the world is making decisions about humans using data that was never designed to understand humans. A nurse spends 30 minutes with a dying patient — the dashboard sees an overrun. The action was right; the decision was wrong. We built **amy** to close that gap."*

*(~50 words · ~10 sec · slow delivery, one breath per sentence. Let "decision was wrong" land.)*

---

## BEAT 2 — INPUT (0:10 → 0:20)

**[Click `match` on the construction clip. Vision report streams in left panel.]**

> *"This is 40 seconds of construction footage — a worker navigating a platform. **Qwen3-VL** describes what the action-data dashboard would have seen on its own: walked the platform, paused, picked up a tool. Accurate. Flat. Useless for any manager who actually cares."*

*(~40 words · ~10 sec. Vision text scrolling under your voice = good rhythm.)*

---

## BEAT 3 — THE MECHANISM (0:20 → 0:50)

**[Cortical mesh appears center-stage. ~20K vertices begin to light up in sync with the footage.]**

> *"Now the inversion. **Meta's TRIBE V2** brain encoder predicts the cortical response *that brain would have produced* watching this footage — about 20,000 vertices on the fsaverage5 mesh, one second at a time, with the natural 5-second hemodynamic lag baked in. We pre-render this offline so we don't pay GPU cost on stage."*

**[Swarm panels populate around the mesh. Eight specialist labels light up — visual, somatomotor, attention, salience, limbic, prefrontal, default-mode, memory.]**

> *"Then a **K2 Think swarm on Cerebras** — eight specialists, one per cortical region, running in parallel at about 2,000 tokens a second — reads each region. Threat-detection. Memory. Default-mode. Each one reports what it's contributing."*

*(~80 words · ~30 sec · this is the peak technical density beat. Speak deliberately. Let the visualization carry you.)*

---

## BEAT 4 — THE LOOP (0:50 → 1:10) — *the surprise beat*

**[Iterative loop drawer slides in from the right. Score reads 0.42.]**

> *"**Claude Opus** writes a candidate paragraph from the eight readings. TRIBE V2 scores it forward against the actual brain pattern. Eight rounds, plateau exit."*

**[Pause. Watch the score climb on screen. Don't speak over it.]**

> *"0.42… 0.58… 0.71… **0.84**. Eight rounds in under 60 seconds. This is the same iterative loop architecture I shipped on **Clair de Lune** music last spring — **90.4% match across 20,484 vertices**. Same protocol, run in reverse."*

*(~55 words · ~20 sec · the silence during the climb is part of the script. ~4 seconds of nothing-said while the numbers do the work.)*

---

## BEAT 5 — THE OUTPUT + AMY (1:10 → 1:25)

**[Empathy paragraph fades in next to the mesh. AMY chat appears below it.]**

> *"Here's the paragraph. **Brain-grounded, not LLM-confabulated.** Threat-detection sustained at peak for 40 minutes — the worker isn't slow, he's calibrating against an environment the camera couldn't see."*

**[Click an AMY question chip — *"is this shift sustainable?"*]**

> *"And the document is interrogable. *Is this shift sustainable?* The same swarm answers — sustained cortisol elevation, two more hours equals decision-fatigue equivalent to a 12-hour shift in a low-stress role. Extending the shift is negative productivity."*

*(~60 words · ~15 sec · this is where the manager's call CHANGES. Lean into it.)*

---

## BEAT 6 — FALSIFICATION + CLOSE (1:25 → 1:30) — *the receipt*

**[Falsification panel surfaces: main 0.84 vs control 0.27, delta 0.57.]**

> *"Falsification: 0.84 against this scene, 0.27 against a control video. The paragraph belongs to *this* footage, not generically to humans. **Three cents a run.** Same engine handles a Reels feed for simulating Gen-Z autonomy, a lecture-hall environment for design taste — wherever a human's experience needs to become operational data."*

*(~55 words · ~10 sec · land hard. Don't thank anyone yet — let the close ring.)*

---

## TIMING BUDGET

| Beat | Words | Spoken sec | Includes stage |
|---|---:|---:|---:|
| 1 — the why | 50 | 10 | 10 |
| 2 — input | 40 | 10 | 10 |
| 3 — mechanism | 80 | 25 | 30 |
| 4 — the loop | 55 | 16 | 20 (~4s silence) |
| 5 — output + AMY | 60 | 13 | 15 |
| 6 — falsification + close | 55 | 10 | 5 |
| **Total** | **~340** | **~84** | **~90** |

If you're under 90s, hold a 2-second silence on the falsification number. If you're over 90s, **cut Beat 5's AMY interaction** — save the whole click for Q&A demo.

---

## BACK-POCKET LINES (when judges press)

**"How is TRIBE V2 not just confabulating?"**
> The brain pattern is a fixed target — not generated. The score climbs only if the paragraph aligns with the actual pattern. And the control delta is the receipt: if the paragraph were generic, it would score the same against the wrong scene too. 0.27 says it doesn't. It's anchored to *this* scene.

**"What's the cost at scale?"**
> $0.03 per 90-second clip. K2 throughput closes the iterative loop in human time. TRIBE V2 is open-source on HuggingFace under CC-BY-NC-4.0. The falsification scorer runs on a sentence-transformer embedding proxy — CPU only, ~200ms per check. No GPU dependency at inference for the scoring stage.

**"Why three audiences in one engine?"**
> Same architecture, different scenarios. Construction footage gives **Ironsight** a new modality for spatial intelligence — cortical signal layered on the camera. Reels footage gives **Listen Labs** a simulation of how the brain converges to the algorithm — neurons firing, not text personas. A reference video gives the **AI Interaction** track a cosine match for taste — feeling translated to a metric. One binary. Three hires.

**"What's the load-bearing claim — what could falsify this?"**
> If the same paragraph scored equally well against any random scene's brain pattern, we'd be confabulating. The within-subject control is the falsifier. We refused to match aggressive speech, rain, and triumphant music in the original Clair de Lune work. We can rerun the same falsification harness on any scenario you bring.

**"What's NOT working yet — what would you fix first?"**
> Workplace fine-tunes. TRIBE V2's canonical training set is naturalistic video — it doesn't include construction sites or hospital floors. Industry-specific fine-tunes close that gap. Second priority: streaming inference. We run 30-90 second clips today; the architecture extends to streaming windows in real-time.

---

## SAFETY ANSWERS (when something breaks live)

- **TRIBE pre-render fails to load:** Fall back to `backend/prerendered/<clip_id>/activity.json` (already cached). Mesh animation may not sync but the empathy doc still renders.
- **K2 latency spikes mid-loop:** Pre-baked swarm readings load from `swarm_readings.json`. Show the cached score trajectory; mention "running with the cached read."
- **WebSocket drops:** Refresh. The iterative-loop trajectory is at `GET /demo/iterative-trajectory/<clip>`. Pull it via curl in the dev console if needed.
- **AMY answer doesn't return:** The pre-baked answers in `AmyChat.tsx` are deterministic — they always render. If even those break, hard-refresh the page; the chat resets.
- **Last resort:** All assets pre-baked under `caltech/pitch-deck/public/clips/` — open the screen-record fallback in QuickTime, narrate over it.

---

## WHAT TO PRACTICE BEFORE STAGE

1. **The 0.42 → 0.84 silence.** Time yourself counting the climb out loud at home; on stage, count it silently in your head while the screen does the talking. ~4 seconds.
2. **The "three cents a run" beat.** Land it like a punchline, not a footnote. It's the cost-of-entry argument.
3. **The "brain-grounded, not LLM-confabulated" line.** This is the line that does the most work per syllable. Slow it down by ~20%.
4. **The close — the three-persona reference.** Don't list-and-pause; deliver as one breath. *"Same engine handles a Reels feed for simulating Gen-Z autonomy, a lecture-hall environment for design taste — wherever a human's experience needs to become operational data."*
5. **The Clair de Lune chip.** "I shipped this last spring" — first-person ownership. It's your receipt.

---

## THE NUMBERS YOU MUST KNOW COLD

| Number | What it is | Where to drop it |
|---|---|---|
| **20,000** | Cortical vertices predicted per second | Beat 3 |
| **8** | Specialists in the K2 swarm, one per region | Beat 3 |
| **2,000 tok/s** | K2 Think on Cerebras throughput | Beat 3 |
| **8 rounds** | Iterative loop, plateau exit | Beat 4 |
| **0.42 → 0.84** | Score climb hero reveal | Beat 4 |
| **90.4%** | Clair de Lune precedent across 20,484 vertices | Beat 4 |
| **0.84 / 0.27 / 0.57** | Main / control / falsification delta | Beat 6 |
| **$0.03** | Cost per 90-second run | Beat 6 |
| **5-second** | Hemodynamic lag baked into TRIBE V2 prediction | Beat 3 (only if asked) |

---

_First draft. Practice it once, then we tighten any beat that feels long or short._
