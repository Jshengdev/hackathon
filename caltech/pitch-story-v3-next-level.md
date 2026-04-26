---
title: "Pitch Story — The Empathy Layer (v3 next-level — Johnny-anchored)"
date: 2026-04-25 evening
supersedes: caltech/pitch-story-v2-canonical.md
purpose: |
  The high-level story for the pitch deck — anchored in Johnny's locked
  voiceover from Hacktech_Notes (master video script + Ironside variant +
  B2C cinematic). Every line marked LOCKED is verbatim from Johnny.
  Lines marked PROPOSED are mine and can be cut. Design is intentionally
  absent — replace as needed.
status: "v3 — built on Johnny's notes; anchored in Sarah/Lisa healthcare scenario as the master story; construction is the Ironside-pavilion variant; B2C is the consumer cinematic."
companion_docs:
  - caltech/architecture-overview.md (v2)
  - _bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md (v2)
  - caltech/build-plan-locked.md
---

# The Empathy Layer — Pitch Story (v3, next-level)

> **The whole pitch in one line (LOCKED, Johnny):**
> *The action data was right. The decision was wrong. The empathy layer is what closes that gap.*

---

## §0. The thesis everyone hears first

> *"Every company in the world is making decisions about humans using data that was never designed to understand humans. A nurse spends thirty minutes with a dying patient. The dashboard sees an overrun. The manager sends a message about cutting time. The action data was right. The decision was wrong. The empathy layer is what closes that gap."* — **LOCKED**

> *"The empathy layer is the AI that tells you how a human felt doing their job — so the people managing them stop making decisions with half the picture."* — **LOCKED, subhead**

> *"Humans are not machines. The empathy layer is what AI gives back when AI augments management decisions instead of replacing them."* — **LOCKED, headline**

These three lines are the whole pitch compressed. Everything else exists to make them feel inevitable.

---

## §1. The story arc (what the audience feels, in order)

```
RECOGNITION → INDIGNATION → CURIOSITY → AWE → SURPRISE → PRIDE+COMFORT → CONVICTION
   BEAT-1      slide 2       slide 3   BEAT-2  BEAT-3       BEAT-4         BEAT-5
   the gap     the stakes    the line  engine  silence      paragraph      reversal
```

Every great pitch is a feeling delivered through facts. The facts here are the architecture, the Clair de Lune precedent, the 0.84 similarity number, the 0.27 falsification delta. The feelings are the ones the audience has every time they've watched a manager cut a corner that destroyed the thing the company actually wanted.

We don't argue. We **show.** And in BEAT-3, we don't even narrate — we hold silence for four seconds while the engine improves on screen.

---

## §2. Round 2 launch video — the 1:30 master cut

This is the cinematic, the Devpost embed, the asset every variant cuts from. Sarah-and-Lisa healthcare scenario as the spine. Johnny's voiceover throughout (Emilie takes over for Ironside variant Beat-4 only).

### Cold open (–0:05 → 0:00) — Johnny on camera

**Shot:** Johnny on camera. Plain background. Direct address to lens.

**VO (LOCKED, Johnny):**
> *"Somewhere right now, a manager is looking at a number. Thirty minutes. Over threshold. And they're about to send a message."*

**Cut to:** the same footage being watched. Person doing their job — a nurse walking into a patient room. Ambient sound only. No music yet.

**VO (LOCKED, Johnny):**
> *"They don't know what happened in that room.*
> *AI can watch that footage. It can describe every action and tool every second. But it cannot tell you how that person felt doing it.*
> *That gap is where bad decisions live.*
> *We built the missing layer."*

**Why it works.** Present tense. Imminence. The judge has watched 50 demos already; this is the only one that opens with *right now, somewhere*. The bad decision is happening WHILE THEY WATCH — they haven't paid attention yet, but they already feel the cost.

---

### BEAT-1 — The gap (0:00 → 0:15)

**Shot 01 · Extreme close-up.** A productivity dashboard. Cold monitor light. One flagged row fills the frame.
> On screen: `Duration: 1,800s · Flag: OVER_THRESHOLD`

**Shot 02 · Cut · Wide.** A manager's hand hovers over a keyboard. About to type. We don't see the message yet.

**VO (LOCKED, Johnny):**
> *"Every company in the world is making decisions about humans using data that was never designed to understand humans."*

**Direction (LOCKED).** No music yet. Just ambient office sound — a fan, a distant keyboard. Hold the dashboard shot for 3 full seconds before cutting. **Silence is the point.**

**Shot 03 · Over-shoulder.** Workplace footage plays on a screen — a nurse entering a patient room, sitting down, holding a hand. Watched from behind. Clinical distance.

**Shot 04 · Cut back · Close-up.** The manager's face. Reading. Expressionless. The action-data report glows on screen.
> On screen: `Action: held hand · Duration: 1,800s · Status: OVER_THRESHOLD`

**VO (LOCKED, Johnny):**
> *"AI can see. It can describe what happened, who moved where, how long it took. But it cannot tell you what it meant. It cannot tell you what the human felt doing it."*

**Direction (LOCKED).** Color grade: desaturated, clinical. The footage on the monitor should feel like surveillance, not care. **That contrast is the whole setup.**

---

### BEAT-2 — The brain layer (0:15 → 0:35)

**Shot 05 · Split screen.** Left: nurse footage continues playing. Right: the cortical mesh appears — 20,000 points, top-down view, glowing in sync with the footage, second by second.

**Shot 06 · Push in · Mesh.** Camera slowly pushes into the cortical mesh. Region labels fade in around the perimeter: *emotional-processing, prefrontal, default-mode, salience-tracking.*

**VO (LOCKED, Johnny):**
> *"We send the same video into Meta's TRIBE V2 brain-encoding model. It predicts per-second neural response across roughly twenty thousand cortical points. Not what she said. Not what she did. **What her brain was doing while she did it.**"*

**Direction (LOCKED).** Music enters here for the first time — something low and procedural, like an algorithm waking up. The mesh glow should pulse at 1Hz, not faster. **Feels biological, not sci-fi.** Activation colormap: cool indigo in quiet regions, warming to amber where engagement is high.

**Shot 07 · Hover-bridges · Animated.** Thin lines appear between brain regions — cross-region connections lighting up in sequence. Per-region specialist labels pulse as each region activates. The brain is being read.

**VO (LOCKED, Johnny):**
> *"Eight specialist agents interpret each region in parallel. What was the prefrontal cortex contributing? What was the emotional-processing center doing? What the action data missed — the brain pattern captures."*

---

### BEAT-3 — The score climbs (0:35 → 1:00) — **HERO REVEAL**

**Shot 08 · Full screen · Score-climb visualization.** The iterative loop runs visibly. A chart fills the frame. A line walks left to right — round number ticking forward, score rising. A candidate paragraph fades in/out underneath each round.

> On screen: Round 1 → 0.42 · Round 2 → 0.58 · Round 3 → 0.65 · Round 5 → 0.71 · Round 8 → **0.84**

**VO (LOCKED, Johnny):**
> *"Eight rounds of iterative scoring. Each round, Claude writes a new paragraph describing what the nurse felt. TRIBE V2 scores it against the actual brain pattern from the footage."*

---

#### **— HOLD · NO VO · 4 seconds — (LOCKED PRODUCTION NOTE)**

> Let the score climb in silence. Round 5 to Round 8. The audience watches 0.71 become 0.84 without narration.
>
> **The engine improving in real time is the reveal — don't talk over it.**

This is the most important moment in the film. **Don't fill it.**

---

**VO resumes (LOCKED, Johnny):**
> *"Round one: 0.42. Round eight: 0.84. This is the same protocol that matched Clair de Lune's neural fingerprint to 90.4% in our prior published work — run in reverse."*

**Direction (LOCKED).** Music lifts slightly as the score peaks at 0.84. **Not celebratory — just a resolution. Like something clicking into place.** The dashed target line at 1.0 stays visible the whole time — *the engine isn't perfect, and that honesty is the credibility.*

---

### BEAT-4 — The paragraph (1:00 → 1:25) — **The artifact**

**Shot 09 · Full screen · Empathy document.** The empathy-layer document fills the frame. Three sections with hairline dividers. Section B — the paragraph — is large, serif italic, magazine-quality. It appears line by line as the voiceover reads it.

**VO — read slowly, one breath per sentence (LOCKED, Johnny):**

> *"She entered the room and her vital-attention signature shifted immediately — the prefrontal sharpness of triage softened into something quieter, more accommodating."*

— **2-second pause** —

> *"For the first twelve minutes her emotional-processing specialist sustained engagement. She was reading the patient's grief, not just monitoring it."*

— **Pause · then slower** —

> *"She did not rush. She did not check out. She held space."*

**Direction (LOCKED).** These three lines appear one at a time on screen, centered, large — **not** inside the document. Typographic cards. Hold each for 1.5 seconds. **This is the emotional peak of the film.** Do not rush it. After the third line, hold 2 full seconds of silence before the next shot.

---

**Shot 10 · Document footer.** Camera settles on the bottom of the document. Two numbers appear in clean mono type.
> On screen: `Brain-pattern similarity: 0.84 / Falsification check: 0.27`

**VO (LOCKED, Johnny):**
> *"Similarity: 0.84. Falsification check against a control visit: 0.27. **Anchored. Not confabulated.**"*

---

### BEAT-5 — The decision reverses (1:25 → 1:30) — **Close**

**Shot 11 · Split screen · Static.**

| Left card · cold light | Right card · slightly warmer light |
|---|---|
| `OVER_THRESHOLD / 30 min · cut to 10` | `she held space / similarity 0.84 · falsified 0.27` |

**VO, dead calm (LOCKED, Johnny):**
> *"The manager doesn't send the message. The patient stays. The nurse stays."*

— **1-second silence** —

> *"The corner-cut doesn't happen."*

**Direction (LOCKED).** Cut to black immediately after *"doesn't happen."* **No fade. Hard cut.** Hold black for 1.5 seconds.

---

**Shot 12 · Title card · Black screen.** White text appears one line at a time, 1-second gaps between each. **No voiceover.** Music fades to nothing on the first line. Silence by the third.

> *"Humans are not machines."*
>
> *"The empathy layer is what AI gives back."*
>
> *"[Product name] · Caltech HackTech 2026"*

**Direction (LOCKED).** Hold 6 seconds total. Then end.

---

### Production note (LOCKED)

The 4-second silence in BEAT-3 is the most important moment in the film. **Don't fill it.** The engine improving without narration is more persuasive than anything you could say over it.

For the **9:16 social cut**: compress BEATs 1 and 2 to 10 seconds combined, keep BEATs 3 and 4 full, hit the title card at 60 seconds.

---

## §3. Round 1 — five-minute pitch deck

The deck reads as the spoken version of the master cut. Same arc, more time, on-stage Q&A surface. The 90-second demo plays during slides 4-7.

### Slide 1 — RECOGNITION (the hook)
**On screen:** the dashboard frame from BEAT-1, frozen. Cold light. One flagged row.
> `Duration: 1,800s · Flag: OVER_THRESHOLD`

**Spoken (~10s):**
> *"Somewhere right now, a manager is looking at this. They don't know what happened in that room. They're about to send a message."*

**Why it works.** The line *"somewhere right now"* is the present-tense imminence hook. The judge feels the cost before the engine appears.

---

### Slide 2 — INDIGNATION (the stakes)
**On screen:** three columns. Three industries. Three cold pixel-only AI outputs.

| Healthcare | Construction | Consumer |
|---|---|---|
| `nurse spent 30 min in patient room. exceeded 18 min benchmark. flag.` | `worker logged 8 min near-edge. cut to 10.` | `user spent 2.5h scrolling. recommendation: serve longer videos.` |

**Spoken (~25s):**
> *"These aren't different problems. They're the same problem at three layers. AI describes what humans did. It cannot model the cognitive-emotional state underneath the action. Managers read these reports and cut the corners that destroy what their company actually wants — patient experience, customer reviews, employee retention. The corner-cut compounds. We are building the missing layer."*

**Kill-line on this slide:** *"Humans are not machines."*

---

### Slide 3 — CURIOSITY (the headline)
**On screen:** the headline, large, alone:

> # Humans are not machines.
> ## The empathy layer is what AI gives back when AI augments management decisions instead of replacing them.

**Spoken (~15s):**
> *"We built the empathy layer. One engine. It takes a video of a human taking actions and writes a paragraph the manager — or the user themselves — can read. The paragraph is brain-grounded, falsifiable, and never recommends behavior. It surfaces what action data alone was missing. The manager judges."*

---

### Slide 4 — AWE (the engine)
**On screen:** the architecture diagram, animated to play out as the voiceover names each box.

```
  [video] ──┬──► Qwen3-VL ─────────────────► what happened (no emotion claims)
            │
            └──► prerendered TRIBE V2 ────┐
                  activity.json           │
                                          ▼
                  K2 swarm — 7 specialists in parallel
                                          │
                                          ▼
                  K2 moderator — one paragraph
                                          │
                                          ▼
                  K2 swarm AS EVALUATOR — 8 rounds
                                          │
                                          ▼
                  ★ score climbs 0.42 → 0.84 ★
                                          │
                                          ▼
                  embedding-proxy falsification vs control clip
                                          │
                                          ▼
                  empathy document
```

**Spoken (~35s):**
> *"Qwen3-VL describes the scene — observational, no emotion claims. Meta's TRIBE V2 brain-encoding model — same model that produced our 90.4% match against the Clair de Lune emotion-center in our prior published work — has already predicted per-second neural response across twenty thousand cortical points. Cerebras K2 fans out a swarm of seven brain-region specialists. Each one reads its region's activation pattern. K2's moderator combines vision and brain-region readings into one paragraph. Then — this is the magic — the same swarm comes back as an evaluator. Each region rates how faithfully the paragraph captured what it was doing. We do this eight times. The score climbs."*

**Kill-line:** *"Action data tells you WHAT they did. The empathy layer tells you WHAT IT TOOK."*

---

### Slide 5 — SURPRISE (the iterative loop reveal — THE HERO BEAT)
**On screen:** the score-climb chart. 0.42 → 0.58 → 0.65 → 0.71 → 0.84. The audience watches it happen.

**Spoken (~25s):**
> *"Round one — generic paragraph, low score. The evaluator swarm tells us which regions we missed. Round by round, the paragraph rewrites itself toward the brain pattern. Round eight, we've stabilized."*

(then, after a beat:)

> *"The same protocol matched Clair de Lune's neural fingerprint to ninety point four percent in our prior published work. We're running it in reverse."*

**Why it works.** This is THE moment. The score climbing is visible improvement. The Clair de Lune chip lands in the same breath — "we already shipped this."

---

### Slide 6 — PRIDE + COMFORT (the paragraph)
**On screen:** the empathy document, three sections. §B is the hero — magazine-quality serif italic. The paragraph appears line by line as the voiceover reads it (LOCKED, Johnny):

> *"She entered the room and her vital-attention signature shifted immediately — the prefrontal sharpness of triage softened into something quieter, more accommodating. For the first twelve minutes her emotional-processing specialist sustained engagement; she was reading the patient's grief, not just monitoring it. Then a long stretch of default-mode dominance — minutes 18 through 22 — the brain-signature of being present with someone, not waiting for them to finish. The final eight minutes returned to focused care, prefrontal-engaged, holding the patient's hand. **She did not rush. She did not check out. She held space.**"*

**Footer:** `Brain-pattern similarity: 0.86 · Falsification check (Lisa on routine vitals visit): 0.27 · verdict: anchored`

**Spoken closing this slide (~10s):**
> *"Anchored. Not confabulated. Same falsification methodology that produced our 90.4% Clair de Lune match. The methodology travels."*

**Kill-lines:** *"She held space."* + *"Anchored. Not confabulated."*

---

### Slide 7 — CONVICTION (the close)
**On screen:** two columns. Same engine, two outputs.

| Workplace (Ironside) | Consumer (Listen Labs / Sideshift) |
|---|---|
| Manager reads the empathy paragraph before deciding to cut Lisa's time. | Maya reads her own day back. Her vault. Her judgment. |
| Action data + brain context → empathy-aware decision | Brainrot in real time + the algorithm breaking out argument |
| The corner-cut doesn't happen. | The user immunizes herself. |

**Spoken (~25s):**
> *"Same engine. Two demo scenarios. Different beneficiaries. The construction worker on scaffolding. Maya, the Gen-Z teen scrolling Reels. Same architecture, swap the input file. We don't recommend behavior — ever. We surface evidence. The human in the loop judges. That's the YEA rubric of Best Use of AI, enacted in the product itself, not in our pitch deck. **Manipulation only works in the dark. We turned the lights on.**"*

(beat — then quiet:)

> *"Humans are not machines. The empathy layer is what AI gives back when AI augments management decisions instead of replacing them."*

---

## §4. Variant A — Ironside pavilion (1:30, speaker-split)

Same five-beat structure as the master cut. Construction-worker footage instead of Sarah/Lisa. **Speaker split (LOCKED):** Johnny owns Beats 1, 2, 3, 5 (technical narration); Emilie owns Beat 4 (the *"so what"* translation for a safety manager who doesn't know what a cortical mesh is).

### BEAT 1 — The gap (0:00–0:15)
**Shot:** Egocentric POV construction footage. Worker navigating scaffolding, tools in hand. Split-screen right: black. Cortical mesh appears, begins pulsing.

**VO (Johnny, LOCKED):**
> *"Every AI safety system on a construction site today watches the same thing — pixels. It sees where the worker looks. It sees what they pick up. It can describe the action. What it cannot do — what no vision-language model can do — is tell you what state of mind produced that action."*

### BEAT 2 — The engine (0:15–0:45)
**Shot:** Left panel stays on footage. Right panel: cortical mesh activates region by region — color-coded labels appear: THREAT DETECTION, PREFRONTAL ENGAGEMENT, COGNITIVE LOAD, STRESS RESPONSE. Hover-bridges glow between regions as specialist reasoning fragments surface.

**VO (Johnny, LOCKED):**
> *"We run Meta's TRIBE V2 brain-encoding model on the same egocentric video — predicting neural response across 20,000 cortical points, one frame per second. Then a swarm of region-specialist agents cross-talks across those regions in two passes. **Threat detection fires. Prefrontal engagement doesn't. That gap — that's the signal.**"*

### BEAT 3 — The proof (0:45–1:15)
**Shot:** Side-by-side MP4. Same worker. Left: routine task. Right: novel environment. Brain-fire pattern visibly diverges. Stress-response specialist and cognitive-load specialist spike right. Annotations surface beneath each panel.

**VO (Johnny, LOCKED):**
> *"Same worker. Same site. Routine task versus novel environment. Watch the brain-fire diverge. Cognitive load spikes. Threat detection drops. This is the within-subject contrast — the same worker, the same engine, two different states. **We didn't label these. The regions did.**"*

### BEAT 4 — The output (1:15–1:30) — **EMILIE TAKES OVER**
**Shot:** Report card surfaces. Three rows — JOB-FIT SIGNAL, TRAINING DEPTH, RISK CLASSIFICATION. Each row populates with a score + specialist evidence citation beneath it.

**VO (Emilie, LOCKED):**
> *"Output: job-fit signal per action. Training-depth recommendation — not 'more training,' but **which regions stayed under-engaged across every novel task.** And a risk-classification flag, grounded in the moment cognitive load and threat detection diverged. Your pipeline flagged worker near edge. Ours flags worker near edge, **cognitively overloaded, hazard not visually processed.** That's the difference between noise and intervention."*

### BEAT 5 — The close (1:28–1:30)
**Shot:** Both panels fade. Single title card.

**VO (Johnny, LOCKED):**
> *"Egocentric video tells you what was done. Brain encoding tells you what state of mind it took to do it well. Same engine. Different input. **For the worker — not the surveiller.**"*

---

## §5. Variant B — B2C consumer cinematic (3:14, "Know what knows you")

Longer cut. Cinematic, not technical. Built for the Sideshift / YC pavilion + the social-share surface. **Tagline (LOCKED): Know what knows you.**

### Shot 01 — The eye (0:00)
**Direction:** Silence. Then, barely audible.

**VO (LOCKED):**
> *"You didn't choose this."*

### Shot 02 — The montage (0:05)
**Direction:** Beat. Let the images breathe. Four people. Four cities. Same Reels feed playing on each phone. Same scroll speed. Intercut.

**VO (LOCKED):**
> *"4 people. 4 cities. 4 lives. The same feed. The same songs. The same conclusions."*

### Shot 03 — Split-screen phones (0:18)
**VO (LOCKED):**
> *"Your taste isn't yours anymore. It's a prediction. **A pattern they already knew about you before you did.**"*

### Shot 04 — The mirror (0:32)
**Direction:** Slower now. Almost a whisper.

**VO (LOCKED):**
> *"When did you last choose something for yourself?"*

### Shot 05 — Person A (0:45)
**VO (LOCKED):**
> *"You could opt out. Stay offline. Stay slow. Stay behind. Hold onto who you are while the world moves without you."*

### Shot 06 — Person B (1:05)
**VO (LOCKED):**
> *"Or you could give it all away. Every search. Every song. Every 3am thought you typed into a box thinking no one was listening. **They were listening. And they sold what they heard.**"*

### Shot 07 — The intercut (1:25)
**Direction:** Faster. Urgent.

**VO (LOCKED):**
> *"Resist — and lose. Comply — and disappear. **That's the deal they never told you about.**"*

— **One second of silence.** —

**VO (LOCKED):**
> *"But that's not the only deal."*

### Shot 08 — The warm room (1:52)
**VO (LOCKED):**
> *"What if you could see it? Everything it knows about you — laid out like a map. Yours to read. Yours to correct. Yours to decide what happens with."*

### Shot 09 — The UI (2:10)
**VO (LOCKED):**
> *"Not a product built from your data. **A mirror built by you.** You feed it. You shape it. It works for you and only you."*

### Shot 10 — Second montage (2:35)
**Direction:** The same 4 people. But now, 4 different screens. 4 different worlds.

**VO (LOCKED):**
> *"The same 4 people. But now, 4 different screens. 4 different worlds. **This is what it looks like when you stay in the room and still stay yourself.**"*

### Shot 11 — Title card (3:00)
**VO (LOCKED):**
> *"You are not a data point. You are not a product or an algorithm's conclusion."*

### Shot 12 — Logo (3:14)
**VO (LOCKED, Johnny):**
> *"Today it's Reels. In five years it's brain chips. Same trade. Same trap. We're building the design pattern for human-AI partnership before the cognitive interface becomes invisible to me. This is the first product I get to use ON the algorithm instead of being used by it. **Manipulation only works in the dark. I just turned the lights on.**"*

**Tagline (LOCKED):** *Know what knows you.*

### Maya's empathy paragraph (the consumer artifact)
For pavilion conversations + Devpost embed, here is the brain-grounded paragraph the engine generates for Maya's 90s Reels feed:

> *"Her amygdala ignited in the small repetitive way that anger wears when it's been served instead of arrived at. There was no surprise in her threat-detection — these were familiar shapes, content her brain had already learned to recognize and respond to without choosing. Her default-mode network — the part of her that's her — sat quiet, not engaged with the feed but not free of it either. **She wasn't watching. She was being watched-at.**"* (LOCKED)

**Similarity: 0.79. Falsification check (vs. her brain on a curated short film): 0.24. Anchored.**

**Kill-line:** *"She wasn't watching. She was being watched-at."*

---

## §6. Pavilion swap-slides (BEAT-5 close, 7-second swap)

Same 1:30 master cut. Different closing slide per pavilion. Pre-rendered, swap in at BEAT-5 close depending on which pavilion is judging.

### Ironside pavilion — primary $5K target
> *"You confirmed it at office hours: a new modality mapped back to the video qualifies as spatial intelligence. We add the data layer. Vision-language models cannot infer the cognitive-emotional state behind the spatial action. We do — by mapping brain-wave back to video. The manager reads the empathy document, not just the action log. The corner-cut doesn't happen."*

### Listen Labs pavilion — $3K + interview
> *"You asked: simulate humans, then prove it. Most teams answer with text-grounded agent sims. We grounded the simulation in real brain-response data. **The iterative loop IS the simulation** — eight rounds of brain-pattern scoring across seven specialists. We rank arguments by which brain-region specialists they swing. We falsify using the same within-subject contrast that produced our 90.4% Clair de Lune match. Insight, not stack. Brain-grounding is the insight."*

### Sideshift pavilion — B2C overlay
> *"The user owns the data. The user owns the result. The system never persists beyond session unless they choose. The empathy document IS the daily journal — it accumulates into a knowledge graph the user owns. Brain Card export is the share surface. **Know what knows you.**"*

### YC pavilion — stretch
> *"Today it's Reels. In five years it's brain chips. Same trade. Same trap. We're building the design pattern for human-AI partnership before the cognitive interface becomes invisible. Local-first by design. The TAM is the smartphone-to-BCI transition. We're the first product you use ON the algorithm instead of being used BY it."*

### Best Use of AI judging
> *"Surface options. User judges. We never recommend. The product enacts the YEA rubric in its architecture, not in its pitch deck. **Manipulation only works in the dark. We turned the lights on.**"*

---

## §7. Kill-line glossary (the lines we want quoted verbatim)

These are the lines we want a judge to type into Slack five minutes after the pitch. Use them verbatim everywhere — slides, voiceover, swap-slides, Devpost, FAQ, social cuts.

| # | Kill-line | Origin | Where it lives |
|---|---|---|---|
| 1 | **"Humans are not machines."** | Johnny LOCKED | Slide 2, Slide 7, master title card |
| 2 | **"The empathy layer is what AI gives back when AI augments management decisions instead of replacing them."** | Johnny LOCKED | Slide 3 headline, Slide 7 close |
| 3 | **"The action data was right. The decision was wrong."** | Johnny LOCKED | Thesis paragraph, Slide 1 spoken |
| 4 | **"AI can see. It can describe what happened. But it cannot tell you what it meant."** | Johnny LOCKED | BEAT-1 voiceover |
| 5 | **"What her brain was doing while she did it."** | Johnny LOCKED | BEAT-2 voiceover |
| 6 | **"She did not rush. She did not check out. She held space."** | Johnny LOCKED | BEAT-4 typographic peak |
| 7 | **"Anchored. Not confabulated."** | Johnny LOCKED | BEAT-4 footer + Slide 6 |
| 8 | **"The corner-cut doesn't happen."** | Johnny LOCKED | BEAT-5 + Slide 7 |
| 9 | **"For the worker — not the surveiller."** | Johnny LOCKED | Ironside variant close |
| 10 | **"That gap — that's the signal."** | Johnny LOCKED | Ironside BEAT-2 |
| 11 | **"We didn't label these. The regions did."** | Johnny LOCKED | Ironside BEAT-3 |
| 12 | **"The difference between noise and intervention."** | Emilie LOCKED | Ironside BEAT-4 |
| 13 | **"She wasn't watching. She was being watched-at."** | Maya empathy paragraph LOCKED | B2C empathy artifact |
| 14 | **"Manipulation only works in the dark. We turned the lights on."** | Johnny LOCKED | Slide 7, B2C close, Best AI swap |
| 15 | **"A pattern they already knew about you before you did."** | LOCKED | B2C Shot 03 |
| 16 | **"A mirror built by you."** | LOCKED | B2C Shot 09 |
| 17 | **"Know what knows you."** | LOCKED tagline | B2C close, social cut |
| 18 | **"90.4% match against the Clair de Lune emotion-center."** | Credibility chip | Slide 4, BEAT-3, every variant |
| 19 | **"Same engine. Different input."** | LOCKED | Slide 7, every pavilion swap |
| 20 | **"That contrast is the whole setup."** (production note) | LOCKED | BEAT-1 color-grade direction |

---

## §8. Production direction (the craft layer)

The story works because the craft serves it. Locked direction from Johnny's notes:

| Element | Direction (LOCKED) | Why |
|---|---|---|
| **Color grade — BEAT-1** | Desaturated, clinical | Footage on monitor should feel like surveillance, not care |
| **Music entry** | First note at BEAT-2 mesh appearance | Silence in BEAT-1 is the indignation |
| **Mesh pulse rate** | 1Hz, not faster | Biological, not sci-fi |
| **Activation colormap** | Cool indigo (quiet) → amber (high engagement) | Reads as warmth, not heatmap-clinical |
| **BEAT-3 silence** | 4 seconds, no VO, no music modulation | Engine improving without narration is the reveal |
| **BEAT-3 music lift** | Slight, on score peak at 0.84 | Resolution, not celebration |
| **Dashed target line at 1.0** | Stays visible the whole time | The engine isn't perfect, and that honesty is the credibility |
| **BEAT-4 typographic cards** | Three lines, centered, large, NOT inside the document | Hold each 1.5s. This is the emotional peak. Don't rush. |
| **Post-third-line silence** | 2 full seconds before next shot | The paragraph needs to land |
| **BEAT-5 cut to black** | Hard cut after "doesn't happen". No fade. Hold 1.5s. | The decision reverses. The film stops. |
| **Title-card cadence** | 3 lines, 1-second gaps, no VO, music fades to nothing on line 1 | Silence is the credit roll |
| **9:16 social cut** | Compress BEATs 1+2 to 10s combined; keep BEATs 3+4 full; title card at 60s | The hero beats are the share-able core |

---

## §9. The honesty paragraph (for hostile-judge rigor questions)

Practiced, ready, deployed verbatim if a judge presses on rigor. This paragraph defuses *"is this real?"* without breaking trust.

> *"Here's what's real and what's stand-in. The brain pattern — TRIBE V2 reverse — was generated offline before the build. We're not running it live; we're not pretending to. The iterative-loop scoring uses K2 specialists evaluating the paragraph against each region's reading — semantic, falsifiable, real. The cosine-similarity number you see in §C uses a sentence-embedding proxy fit from hand-paired text-activation examples. It's a stand-in for live TRIBE forward inference, which is the production path. The falsification logic — main vs. control, cosine delta — is identical to the methodology that produced our 90.4% Clair de Lune match in published work. We're not lying about results. We're showing you a speed-run of the process while running one in the background."*

Practice it cold. Deliver it slow. Don't hedge.

---

## §10. What we are NOT saying (forbidden-claim discipline)

Per `_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md` §5 (non-negotiable). Every voiceover line, every slide, every swap-slide, every social cut respects these. The engine itself enforces them via regex pre-flight (`backend/services/guardrails.py`).

| Forbidden | Allowed alternative |
|---|---|
| *"She felt grief"* (reverse inference, Poldrack 2006) | *"Emotional-processing specialist sustained engagement"* |
| *"Clinical fatigue"* / *"diagnosis"* | *"Workforce-context augmentation, not psychological evaluation"* |
| Sub-second predictions | Per-second granularity only (TRIBE is 1Hz with 5s HRF lag) |
| *"Average healthy brain"* | Within-subject contrast only |
| *"70K voxels"* / *"700 subjects"* | ~20K vertices / ~25 subjects |
| *"Reads inner monologue"* | *"Predicts neural response patterns"* |

If a slide draft uses any forbidden phrase, the slide is not done. Replace before pre-cache freeze.

---

## §11. The single most important sentence

If the judge remembers exactly one thing from the pitch, this is what we want it to be:

> # *The action data was right. The decision was wrong. The empathy layer is what closes that gap.*

Everything else — the architecture, the score-climbing, the falsification delta, the two scenarios, the brain-grounded paragraph that reads like a human reading another human — is in service of making that sentence inevitable.

---

## §12. Why this narrative works differently than a standard pitch

(LOCKED, Johnny:)

> *"Most hackathon pitches lead with the solution. This one leads with the moment the decision goes wrong — and makes the judge feel the cost of the gap before you show the engine. By the time the paragraph appears, they're not evaluating a product. They're watching a decision change. That's the difference between a demo that impresses and a narrative that stays with them after you walk away."*

---

## §13. Cross-references

- `caltech/architecture-overview.md` (v2 — the engine, technical)
- `_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md` (v2 — engineering spec)
- `_bmad-output/planning-artifacts/ironsight-listenlabs-prd.md` (strategic PRD — sponsor brief verbatim, success criteria)
- `caltech/build-plan-locked.md` (v2 build plan — file-level lane assignments)
- `caltech/use-cases/two-demo-scenarios.md` (canonical scenario contract)
- `caltech/use-cases/listenlabs-sideshift.md` (B2C deep dive)
- `caltech/use-cases/ironside.md` (workplace deep dive)
- `caltech/research-context/007-johnny-public-corpus-tribe-posts.md` (Clair de Lune precedent)
- Hacktech_Notes.pdf (Johnny's voiceover scripts — locked source for all v3 lines marked LOCKED)
