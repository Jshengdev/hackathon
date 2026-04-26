---
title: "Pitch Story — The Empathy Layer (v2 canonical)"
date: 2026-04-25 evening
purpose: |
  The high-level story for the pitch deck — written for whoever owns slide design.
  Every slide here has: (1) the line on screen, (2) the spoken voiceover, (3) why
  the beat works. Design is intentionally absent. Replace as needed.
status: "v2 — reflects the actually-shipped engine (no live TRIBE; K2 swarm; embedding-proxy falsification)"
companion_docs:
  - caltech/architecture-overview.md (v2)
  - _bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md (v2)
  - caltech/build-plan-locked.md
---

# The Empathy Layer — Pitch Story (v2 canonical)

> **The whole pitch in one line:** *Today's AI tells you WHAT a human did. We built the AI that tells you WHAT IT TOOK.*

---

## The story arc (what the audience feels, in order)

```
RECOGNITION → INDIGNATION → CURIOSITY → AWE → SURPRISE → RELIEF → CONVICTION
   slide 1        slide 2      slide 3   slide 4  slide 5    slide 6   slide 7
```

Every great pitch is a feeling delivered through facts. The facts here are the architecture, the Clair de Lune precedent, the 0.84 similarity number, the falsification delta. The feelings are the ones the audience has every time they've watched a manager cut a corner that destroyed the thing the company actually wanted.

We don't argue. We **show.**

---

## Round 1 — five-minute pitch (the canonical version)

### Slide 1 — RECOGNITION (the hook)
**On screen:** a single 5-second clip. Construction worker on scaffolding tier 3. Camera over his shoulder. He pauses, looks at a beam joint near the edge, places his tool deliberately, steps back. The clip ends. A flat label appears below it:

> `Vision-language model output:` `near-edge violation. flag = NEAR_EDGE. duration over threshold. productivity action recommended: cut to 10 minutes.`

**Voiceover (10 seconds):**
> *"This is what AI sees today. It's not wrong. But it's not what was happening."*

**Why it works.** The judge has watched 50 demos already. The 5-second clip + the cold dashboard label snaps them out of their seat. The line *"It's not wrong. But it's not what was happening"* is a contract — it tells the judge exactly what the next four minutes will deliver.

---

### Slide 2 — INDIGNATION (the stakes)
**On screen:** three columns of cold pixel-only AI output, each labeled with an industry. No emotion in any of them.

| Healthcare | Construction | Consumer |
|---|---|---|
| `nurse spent 30 min in patient room. exceeded 18 min benchmark. flag.` | `worker logged 8 min near-edge. cut to 10.` | `user spent 2.5h scrolling. recommendation: serve longer videos.` |

**Voiceover (25 seconds):**
> *"These aren't different problems. They're the same problem at three layers. AI describes what humans did. It cannot model the cognitive-emotional state underneath the action. Managers read these reports and cut the corners that destroy what their company actually wants — patient experience, customer reviews, employee retention. The corner-cut compounds. We are building the missing layer."*

**Why it works.** Three industries in seven seconds tells the judge this is a category, not a feature. The phrase *"the corner-cut compounds"* is the indignation hook — it's why this matters beyond one nurse on one shift.

**Kill-line on this slide:** *"Humans are not machines."*

---

### Slide 3 — CURIOSITY (the headline + thesis)
**On screen:** the headline, large, alone:

> # Humans are not machines.
> ## The empathy layer is what AI gives back when AI augments management decisions instead of replacing them.

**Voiceover (20 seconds):**
> *"We built the empathy layer. One engine. It takes a video of a human taking actions and writes a paragraph the manager — or the user themselves — can read. The paragraph is brain-grounded, falsifiable, and never recommends behavior. It surfaces what action data alone was missing. The manager judges. Two demo scenarios on the same engine. Construction footage, consumer feeds. Same architecture. Different inputs."*

**Why it works.** The headline is the entire pitch compressed. Repeating it slowly is the moment the judge writes it down. The *"two scenarios on the same engine"* line opens the structural defensibility argument before it's questioned.

---

### Slide 4 — AWE (the engine reveal)
**On screen:** the architecture diagram, but animated to play out as a story over 30 seconds. Each box appears as the voiceover names it:

```
   [video] ──┬──► Qwen3-VL ─────────────────► what physically happened
             │
             └──► prerendered TRIBE V2 ───┐
                  activity.json           │
                                          ▼
                  K2 swarm ── 7 specialists in parallel
                  (visual / somatomotor / dorsal-attention /
                   ventral-attention / limbic / frontoparietal /
                   default-mode)
                                          │
                                          ▼
                  K2 moderator ── one paragraph
                                          │
                                          ▼
                  K2 swarm — AS EVALUATOR — 8 rounds
                                          │
                                          ▼
                  ★ score climbs 0.42 → 0.84 ★
                                          │
                                          ▼
                  embedding-proxy falsification
                  vs control clip
                                          │
                                          ▼
                  empathy document
```

**Voiceover (35 seconds):**
> *"Here's what it does. Qwen3-VL describes the scene — observational, no emotion claims. Meta's TRIBE V2 brain-encoding model — same model that produced our 90.4% match against the Clair de Lune emotion-center in our prior published work — has already predicted per-second per-region neural response across twenty thousand cortical points. Cerebras K2 fans out a swarm of seven brain-region specialists. Each one reads its region's activation pattern and emits its reading. K2's moderator combines vision and brain-region readings into one paragraph. Then — this is the magic — the same swarm comes back as an evaluator. Each region rates how faithfully the paragraph captured what it was doing. We do this eight times. The score climbs."*

**Why it works.** Naming K2 *as the speed engine that makes the iterative loop possible* lands the IFM K2 sponsor close in the architecture itself. The *"same model that produced 90.4% match"* line is the credibility chip — it's the difference between "vibes" and "published work."

**Kill-line on this slide:** *"Action data tells you WHAT they did. The empathy layer tells you WHAT IT TOOK."*

---

### Slide 5 — SURPRISE (the iterative-loop reveal — THE HERO BEAT)
**On screen:** the score bar climbs. Round 1: 0.42. Round 2: 0.58. Round 3: 0.65. Round 5: 0.71. Round 8: **0.84**. Each round, a fragment of the candidate paragraph fades in and out below the bar. By round 8, the full paragraph holds:

> *"She moved through the scaffolding like someone whose attention had already left for the day — except her visual-attention specialist held tight on the lower platform, fixated on a beam joint the action log treated as routine. Her salience-tracking ran high through the entire sequence. This is what scanning a hazard looks like. The 'near-edge' flag the dashboard raised is the same brain pattern as seeing the danger before stepping into it. She did the safe thing. The action log called it the unsafe one."*

**Voiceover (25 seconds):**
> *"Round one — the paragraph is generic, the score is low. The evaluator swarm tells us which regions we missed. Round by round, the paragraph rewrites itself toward the brain pattern. By round eight we've stabilized. The paragraph reads like a human reading another human."*

(then, after a beat, while the final paragraph is held on screen:)

> *"She did the safe thing. The action log called it the unsafe one."*

**Why it works.** This is THE moment. The score climbing is visible improvement; the paragraph going from generic to literary is felt improvement. The repeated final line — *"the action log called it the unsafe one"* — is the inversion the judge will quote afterward.

**Kill-line on this slide:** *"The score climbing is the engine improving in real time."*

---

### Slide 6 — RELIEF (the falsification check)
**On screen:** two paragraphs, side by side. Same nurse, two scenes.

| Patient room (cancer consultation) | Routine vitals visit |
|---|---|
| *"She held space. Twelve minutes of sustained emotional-processing engagement. She was reading the patient's grief, not just monitoring it."* | *"She moved efficiently. Visual attention dominant. Default-mode quiet. Standard procedural focus."* |
| **similarity: 0.84** | **similarity: 0.27** |
| | **falsification delta: 0.57** |
| | **verdict: anchored** |

**Voiceover (20 seconds):**
> *"And here's the proof we're not making this up. Same nurse, different scene. We score the paragraph against the routine-vitals brain pattern. It drops to twenty-seven percent — a delta of fifty-seven points. The paragraph is anchored to this scene specifically, not generically plausible. We falsified our last published work the same way against control music. Triumphant music, rain. The pattern only matched Clair de Lune. The methodology travels."*

**Why it works.** Falsification is the rigor argument. Listen Labs explicitly asks for it. Best Use of AI judges hold the YEA/NAY rubric on this. The *"the methodology travels"* line ports the Clair de Lune chip onto this work.

**Kill-line on this slide:** *"Same logic. Different audit. The paragraph is anchored or it is not."*

---

### Slide 7 — CONVICTION (the vision close)
**On screen:** two columns. Same engine, two outputs.

| Workplace (Ironside) | Consumer (Listen Labs / Sideshift) |
|---|---|
| Manager reads the empathy paragraph before deciding to cut the nurse's time. | Maya reads her own day back. Her vault. Her judgment. |
| Action data + brain context → empathy-aware decision | Brainrot in real time + the algorithm breaking out argument |
| The corner-cut doesn't happen. | The user immunizes herself. |

**Voiceover (25 seconds):**
> *"Same engine. Two demo scenarios. Different beneficiaries. The construction worker on scaffolding. Maya, the Gen-Z teen scrolling reels. Same architecture, swap the input file. We don't recommend behavior — ever. We surface evidence. The human in the loop judges. That's the YEA rubric of Best Use of AI, enacted in the product itself, not in our pitch deck. Manipulation only works in the dark. We turn the lights on. Humans are not machines. The empathy layer is what AI gives back when AI augments management decisions instead of replacing them."*

**Why it works.** The structural answer to "you can't do everything in 36 hours" is *one engine, two scenarios*. The closing repeats the headline so the judge writes it down a second time.

**Kill-lines on this slide:** *"Manipulation only works in the dark. We turn the lights on."* + the headline (verbatim).

---

## The 90-second on-stage demo (BEAT-1 → BEAT-5)

The Round 1 slides above are the deck. The 90-second demo is the SHOW — projected next to the pitch, played at the same time the voiceover is happening. Five beats:

| Beat | Time | What plays | Emotional beat |
|---|---|---|---|
| **BEAT-1** | 0:00–0:15 | Workplace footage + Stage 1 vision report side by side | Recognition |
| **BEAT-2** | 0:15–0:35 | Brain mesh glows; K2 swarm readings appear region-by-region | Awe |
| **BEAT-3** | 0:35–1:00 | Score climbs 0.42 → 0.84. Candidate paragraph fades in/out per round. **THE HERO REVEAL** | Surprise |
| **BEAT-4** | 1:00–1:25 | Final paragraph holds. Voiceover reads it. Similarity 0.84 + falsification delta displayed | Pride + Comfort |
| **BEAT-5** | 1:25–1:30 | Side-by-side: "cut to 10 min" dashboard vs. empathy document. The decision-maker would call this differently | Conviction |

Demo runs from pre-cached assets (the Saturday 8 AM bake). Live attempt runs in the background; if it lands cleanly, swap in. Honest framing throughout — *"we're showing you a speed-run of the process while running one in the background."*

---

## Pavilion variants (BEAT-5 swap-slides)

Same 90s + same Round 1 deck, different closing slide per pavilion. Each is a 7-second swap.

### Ironside pavilion — primary $5K target
> *"You confirmed it at office hours: a new modality mapped back to the video qualifies. Vision-language models cannot infer the cognitive-emotional state behind the spatial action. We add the data layer. The manager reads the empathy document, not just the action log. The corner-cut doesn't happen."*

### Listen Labs pavilion — $3K + interview
> *"You asked: simulate humans, then prove it. Most teams answer with text-grounded agent sims. We grounded the simulation in real brain-response data. The iterative loop IS the simulation — eight rounds of brain-pattern scoring. We rank arguments by which brain-region specialists they swing. We falsify the engine using the same within-subject contrast methodology that produced our 90.4% Clair de Lune match. The insight is brain-grounding. The stack is the demo. We care about the same thing you do."*

### Sideshift pavilion — B2C overlay
> *"The user owns the data. The user owns the result. The system never persists beyond session unless they choose. The empathy document IS the daily journal — it accumulates into a knowledge graph the user owns. Brain Card export is the share surface. Consumer-data agency, made literal."*

### YC pavilion — stretch
> *"Obsidian, but the graph is your brain. Every empathy document is a daily entry in a graph the user owns. Local-first by design. The TAM is the smartphone-to-BCI transition — the empathy layer is the design pattern for that decade. Cortex.buzz uses TRIBE V2 to engineer attention. We run it the other way."*

### Best Use of AI judging
> *"Surface options. User judges. We never recommend. The product enacts the YEA rubric in its architecture, not in its pitch deck. Manipulation only works in the dark. We turn the lights on."*

---

## Kill-line glossary (the lines we want repeated verbatim)

These are the lines we want a judge to type into Slack five minutes after the pitch. Use them — and only them — verbatim throughout slides, voiceover, swap-slides, Devpost, FAQ, demo narration.

| Kill-line | Where it lives |
|---|---|
| **"Humans are not machines."** | Slide 2 + Slide 7 close |
| **"The empathy layer is what AI gives back when AI augments management decisions instead of replacing them."** | Slide 3 headline + Slide 7 close (repeated verbatim) |
| **"Action data tells you WHAT they did. The empathy layer tells you WHAT IT TOOK."** | Slide 4 (architecture reveal) |
| **"The score climbing is the engine improving in real time."** | Slide 5 / BEAT-3 hero reveal |
| **"She did the safe thing. The action log called it the unsafe one."** | Slide 5 final paragraph (the inversion) |
| **"Same logic. Different audit. The paragraph is anchored or it is not."** | Slide 6 falsification |
| **"Manipulation only works in the dark. We turn the lights on."** | Slide 7 / Sideshift + Best AI close |
| **"Same engine. Different beneficiaries."** | Slide 7 + every pavilion swap |
| **"We don't recommend behavior. We surface evidence."** | Slide 7 + Best AI swap |
| **"90.4% match against the Clair de Lune emotion-center."** | Slide 4 (credibility chip — every variant) |

---

## What we are NOT saying (the discipline)

These are the failure modes the pitch must avoid. The forbidden-claim list from `_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md` §5 is non-negotiable:

- Never *"she felt grief."* Reverse inference is scientifically invalid (Poldrack 2006). Always *"emotional-processing specialist sustained engagement."*
- Never *"clinical fatigue."* Allowed: *"workforce-context augmentation, not psychological evaluation."*
- Never sub-second predictions. TRIBE is 1Hz with 5s HRF lag.
- Never *"average healthy brain."* Within-subject contrast only.
- Never inflated TRIBE numbers. ~20K vertices / ~25 subjects only.
- Never *"reads inner monologue."* Reverse-inference variant. Always *"predicts neural response patterns."*

Every empathy paragraph the engine outputs passes a regex pre-flight check before rendering (`backend/services/guardrails.py`). The pitch follows the same rule.

---

## The honesty paragraph (the one we say if a judge presses on rigor)

> *"Here's what's real and what's stand-in. The brain pattern — TRIBE V2 reverse — was generated offline before the build. We're not running it live; we're not pretending to. The iterative-loop scoring uses K2 specialists evaluating the paragraph against each region's reading — semantic, falsifiable, real. The cosine-similarity number you see in §C uses a sentence-embedding proxy fit from hand-paired text-activation examples. It's a stand-in for live TRIBE forward inference, which is the production path. The falsification logic — main vs. control, cosine delta — that's identical to the methodology that produced our 90.4% Clair de Lune match in published work. We're not lying about results. We're showing you a speed-run of the process while running one in the background. Live attempt is in the loop; the pre-cache is the demo if live doesn't land."*

This paragraph defuses the load-bearing rigor question without breaking trust. It's the move that turns "is this real?" from a closing question into an opening question we already answered.

---

## The single most important sentence

If the judge remembers exactly one thing from the pitch, this is what we want it to be:

> # *Today's AI tells you WHAT a human did. We built the AI that tells you WHAT IT TOOK.*

Everything else — the architecture, the score-climbing, the falsification delta, the two scenarios — is in service of making that sentence true.
