# PITCH STORY — Empathy Layer Engine (v3-aligned)

> Caltech HackTech 2026. Round 1 (5-min, 13 slides) + Round 2 (3-min, 8 slides) + 90-second on-stage demo.
>
> **Hand-off brief for Emilie (rendering / styling / video).** Copy is locked here.
> The pitch-deck app at `caltech/pitch-deck/` already implements this story in JSX.
> Use this file to verify the *words*, the *order*, and the *visual intent* per slide.
>
> **Source of truth:** `caltech/pitch-story-v3-next-level.md` (Johnny-anchored). Every line marked LOCKED in v3 is verbatim Johnny and must be quoted verbatim. Lines marked PROPOSED can be cut. This brief mirrors v3 — every kill-line, every voiceover beat, every production note traces back there.

---

## 1. The Five Lines To Memorize

The load-bearing sentences. Everyone on the team carries them; everything in the deck and the video derives from them. Pulled from v3 §0 thesis, v3 §11 single-most-important-sentence, and the headline kill-lines from v3 §7.

1. **The whole pitch (LOCKED, Johnny — v3 §11):**
   > *"The action data was right. The decision was wrong. The empathy layer is what closes that gap."*

2. **The headline (LOCKED, Johnny — v3 §0):**
   > *"Humans are not machines. The empathy layer is what AI gives back when AI augments management decisions instead of replacing them."*

3. **The thesis (LOCKED, Johnny — v3 §0):**
   > *"Every company in the world is making decisions about humans using data that was never designed to understand humans. A nurse spends thirty minutes with a dying patient. The dashboard sees an overrun. The manager sends a message about cutting time. The action data was right. The decision was wrong. The empathy layer is what closes that gap."*

4. **The hero output (LOCKED, Johnny — v3 §3 Slide 6 + BEAT-4):** Sarah / Lisa nurse paragraph — magazine-cover serif italic, anchored:
   > *"She entered the room and her vital-attention signature shifted immediately — the prefrontal sharpness of triage softened into something quieter, more accommodating. For the first twelve minutes her emotional-processing specialist sustained engagement; she was reading the patient's grief, not just monitoring it. Then a long stretch of default-mode dominance — minutes 18 through 22 — the brain-signature of being present with someone, not waiting for them to finish. The final eight minutes returned to focused care, prefrontal-engaged, holding the patient's hand. **She did not rush. She did not check out. She held space.**"*
   > Footer: `Brain-pattern similarity: 0.86 · Falsification check (Lisa on routine vitals visit): 0.27 · verdict: anchored`

5. **The proof (LOCKED, Johnny — v3 §3 Slide 5):**
   > *"The same protocol that matched Clair de Lune's neural fingerprint to 90.4% in our prior published work — run in reverse."*

If a slide doesn't trace back to one of these five, cut it.

---

## 2. The Story Arc (v3 §1 verbatim)

The deck and the video share the same spine. Round 1 (13 slides) renders all seven beats with breathing room. Round 2 (8 slides) compresses to the master-cut beats. The video is the 90-second cinematic.

```
RECOGNITION → INDIGNATION → CURIOSITY → AWE → SURPRISE → PRIDE+COMFORT → CONVICTION
   BEAT-1      slide 2       slide 3   BEAT-2  BEAT-3       BEAT-4         BEAT-5
   the gap     the stakes    the line  engine  silence      paragraph      reversal
```

(LOCKED, v3 §1)

> *"Every great pitch is a feeling delivered through facts. The facts here are the architecture, the Clair de Lune precedent, the 0.84 similarity number, the 0.27 falsification delta. The feelings are the ones the audience has every time they've watched a manager cut a corner that destroyed the thing the company actually wanted. We don't argue. We **show.** And in BEAT-3, we don't even narrate — we hold silence for four seconds while the engine improves on screen."*

---

## 3. Round 1 — 13-Slide Deck (5 minutes)

Mirrors v3 §3 slide-by-slide and expands the gaps to match the existing `app/round-1/page.tsx`. The 90-second demo plays during slides 5–8. Format per slide: **kicker** · headline · body · anchor quote · speaker note (~time) · visual direction.

### Slide 01 — Title (RECOGNITION pre-roll)

- **Kicker:** caltech hacktech 2026 · ironside · listen labs · best use of ai
- **Headline (LOCKED, Johnny — v3 §0):** *Humans are not machines.* / *The empathy layer is what AI gives back when AI augments management decisions instead of replacing them.*
- **Anchor quote (LOCKED, v3 §11):** *"The action data was right. The decision was wrong. The empathy layer is what closes that gap."*
- **Speaker note (~10s):** Hold the title. Read the action-data / decision line slow. Then cut to Slide 2 without narrating the transition.
- **Visual direction (Emilie):** large lowercase mono headline. *Humans are not machines* in clay-black; second line in blueberry-800. Negative space dominant. Subtle cortical mesh fading into ivory at low opacity behind the headline (10–15%). Anchor quote in serif italic centered below. Two red dots, top-left + bottom-right (Clay accent).

### Slide 02 — RECOGNITION (the hook · v3 §3 Slide 1)

- **Kicker:** somewhere right now
- **Headline:** the dashboard sees the overrun
- **On screen:** the BEAT-1 dashboard frame, frozen. Cold light. One flagged row.
  > `Duration: 1,800s · Flag: OVER_THRESHOLD`
- **Spoken (~10s, LOCKED, Johnny — v3 §3 Slide 1):** *"Somewhere right now, a manager is looking at this. They don't know what happened in that room. They're about to send a message."*
- **Why it works (v3 §3):** the line *"somewhere right now"* is the present-tense imminence hook. The judge feels the cost before the engine appears.
- **Visual direction:** full-bleed dashboard frame. No card chrome. Cold-monitor desaturated grade. Flagged row centered, large mono. Surveillance feel, not care.

### Slide 03 — INDIGNATION (the stakes · v3 §3 Slide 2)

- **Kicker:** the gap
- **Headline (LOCKED, Johnny — v3 BEAT-1):** *AI can see. It can describe what happened. But it cannot tell you what it meant.*
- **On screen:** three columns. Three industries. Three cold pixel-only AI outputs.

| Healthcare | Construction | Consumer |
|---|---|---|
| `nurse spent 30 min in patient room. exceeded 18 min benchmark. flag.` | `worker logged 8 min near-edge. cut to 10.` | `user spent 2.5h scrolling. recommendation: serve longer videos.` |

- **Spoken (~25s, LOCKED, Johnny — v3 §3 Slide 2):** *"These aren't different problems. They're the same problem at three layers. AI describes what humans did. It cannot model the cognitive-emotional state underneath the action. Managers read these reports and cut the corners that destroy what their company actually wants — patient experience, customer reviews, employee retention. The corner-cut compounds. We are building the missing layer."*
- **Kill-line on this slide (LOCKED):** *"Humans are not machines."*
- **Visual direction:** three-column typographic split. No card grid. Hairline dividers between columns. Mono lowercase rows. The healthcare row sits left and primary; construction and consumer trail. Color: clinical desaturated.

### Slide 04 — CURIOSITY (the thesis headline · v3 §3 Slide 3)

- **Kicker:** the empathy layer
- **Headline (LOCKED, Johnny — v3 §0):**
  > # Humans are not machines.
  > ## The empathy layer is what AI gives back when AI augments management decisions instead of replacing them.
- **Spoken (~15s, LOCKED, Johnny — v3 §3 Slide 3):** *"We built the empathy layer. One engine. It takes a video of a human taking actions and writes a paragraph the manager — or the user themselves — can read. The paragraph is brain-grounded, falsifiable, and never recommends behavior. It surfaces what action data alone was missing. The manager judges."*
- **Visual direction:** typographic-only slide. Three-line typography stack. Middle line *the empathy layer is what AI gives back* in blueberry-800, oversized. Body line in warm-charcoal sans below. No image. No card. Negative space carries the weight.

### Slide 05 — The Proof (Clair de Lune precedent — credibility chip)

- **Kicker:** proof · clair de lune precedent · shipped 2026-03
- **Headline:** *90.4%* (numeral hero, blueberry-800 percent sign)
- **Body:** *"same iterative-scoring loop. ran forward last spring: 60s of clair de lune in, text out, 90.4% match in the emotion region across 20,484 cortical vertices. eight rounds. falsified against triumphant music, rain, and aggressive speech."*
- **Anchor quote (LOCKED, v3 §3 Slide 5):** *"The same protocol matched Clair de Lune's neural fingerprint to 90.4% in our prior published work. We're running it in reverse."*
- **Speaker note (~30s):** *"The methodology isn't theoretical. Last spring, we matched Clair de Lune's emotional brain signature to 90.4 percent across 20,484 cortical vertices using this same iterative loop. We falsified it against triumphant music, rain, aggressive speech — the pattern only matched Clair de Lune. Same protocol, same falsification rigor, run in reverse for the empathy layer. This is the founder-market fit and the credibility chip in one artifact."*
- **Kill-line (LOCKED, v3 §7 #18):** *"90.4% match against the Clair de Lune emotion-center."*
- **Visual direction:** giant 90.4% numeral, blueberry-800 percent. Right column: `activation-pulse` p5 visual highlighting the emotion region in cool-indigo → amber colormap. Body in sans below. Footer: `published 2026-03 · ~20,484 cortical vertices · TRIBE V2`.

### Slide 06 — AWE (the engine — architecture reveal · part 1, v3 §3 Slide 4)

- **Kicker:** the engine · part 1
- **Headline (LOCKED, Johnny — v3 §3 Slide 4):** *Action data tells you WHAT they did. The empathy layer tells you WHAT IT TOOK.*
- **On screen:** the architecture diagram, animated to play out as the voiceover names each box.

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
                                          ▼
                  ... continues on next slide
```

- **Spoken (~20s, first half of v3 §3 Slide 4):** *"Qwen3-VL describes the scene — observational, no emotion claims. Meta's TRIBE V2 brain-encoding model — same model that produced our 90.4% match against the Clair de Lune emotion-center in our prior published work — has already predicted per-second neural response across twenty thousand cortical points. Cerebras K2 fans out a swarm of seven brain-region specialists. Each one reads its region's activation pattern. K2's moderator combines vision and brain-region readings into one paragraph."*
- **Kill-line (LOCKED, v3 §7 #5):** *"What her brain was doing while she did it."*
- **Visual direction:** architecture diagram, top-down. Boxes connected by hairline arrows. Activation colormap cool indigo → amber. Mesh pulse 1Hz. Region labels around the perimeter — *emotional-processing, prefrontal, default-mode, salience-tracking*.

### Slide 07 — AWE (the engine — iterative-loop reveal · part 2)

- **Kicker:** the engine · part 2 · the iterative loop
- **Headline:** *The same swarm comes back as an evaluator.*
- **On screen:** the second half of the architecture diagram.

```
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

- **Spoken (~15s, second half of v3 §3 Slide 4):** *"Then — this is the magic — the same swarm comes back as an evaluator. Each region rates how faithfully the paragraph captured what it was doing. We do this eight times. The score climbs."*
- **Visual direction:** second half of the architecture diagram. The "★ score climbs ★" tier visually distinct — slight blueberry glow. Falsification box and empathy document sit below as the resolution.

### Slide 08 — SURPRISE (the iterative loop — HERO BEAT · v3 §3 Slide 5)

- **Kicker:** hero reveal · the iterative loop
- **Headline (LOCKED, Johnny — v3 §3 Slide 5):** *Eight rounds. The score climbs.*
- **On screen:** the score-climb chart. 0.42 → 0.58 → 0.65 → 0.71 → 0.84. The audience watches it happen.
- **Trajectory (under the body):** `0.42 → 0.58 → 0.65 → 0.71 → 0.75 → 0.78 → 0.82 → 0.84`
- **Spoken (~25s, LOCKED, Johnny — v3 §3 Slide 5):** *"Round one — generic paragraph, low score. The evaluator swarm tells us which regions we missed. Round by round, the paragraph rewrites itself toward the brain pattern. Round eight, we've stabilized."* (then, after a beat:) *"The same protocol matched Clair de Lune's neural fingerprint to ninety point four percent in our prior published work. We're running it in reverse."*
- **Why it works (v3 §3 Slide 5):** This is THE moment. The score climbing is visible improvement. The Clair de Lune chip lands in the same breath — *"we already shipped this."*
- **Visual direction:** `score-climb` p5 visual on right. Animated. Dashed target line at 1.0 stays visible the whole time — *the engine isn't perfect, and that honesty is the credibility.* Line + dot trail walks left to right. Round counter and current score in mono labels. Latest dot pulses. **(LOCKED) Music lifts slightly as the score peaks at 0.84. Not celebratory — just resolution.**

### Slide 09 — PRIDE + COMFORT (the paragraph · v3 §3 Slide 6)

- **Kicker:** hero output · empathy-layer document
- **Headline (LOCKED, Johnny — v3 BEAT-4 + Slide 6):** *She did not rush.* / *She did not check out.* / *She held space.*
- **On screen:** the empathy document, three sections. §B is the hero — magazine-quality serif italic. The paragraph appears line by line as the voiceover reads it (LOCKED, Johnny — v3 §3 Slide 6):

> *"She entered the room and her vital-attention signature shifted immediately — the prefrontal sharpness of triage softened into something quieter, more accommodating. For the first twelve minutes her emotional-processing specialist sustained engagement; she was reading the patient's grief, not just monitoring it. Then a long stretch of default-mode dominance — minutes 18 through 22 — the brain-signature of being present with someone, not waiting for them to finish. The final eight minutes returned to focused care, prefrontal-engaged, holding the patient's hand. **She did not rush. She did not check out. She held space.**"*

- **Footer (LOCKED, v3 §3 Slide 6):** `Brain-pattern similarity: 0.86 · Falsification check (Lisa on routine vitals visit): 0.27 · verdict: anchored`
- **Spoken closing this slide (~10s, LOCKED, Johnny — v3 §3 Slide 6):** *"Anchored. Not confabulated. Same falsification methodology that produced our 90.4% Clair de Lune match. The methodology travels."*
- **Kill-lines (LOCKED, v3 §7 #6 + #7):** *"She held space."* + *"Anchored. Not confabulated."*
- **Visual direction:** `EmpathyDocument` primitive on right (already implemented). Three sections with hairline dividers. §B paragraph in serif italic at body-large size — magazine-cover quality. Similarity 0.86 + falsification 0.27 as oversized numerals at the bottom in mono. **(LOCKED) Three closer lines appear one at a time on screen, centered, large — NOT inside the document. Typographic cards. Hold each for 1.5 seconds. After the third line, hold 2 full seconds of silence before the next slide.**

### Slide 10 — Two Scenarios (one engine, two outputs)

- **Kicker:** one engine · same architecture
- **Headline (LOCKED, v3 §7 #19):** *Same engine. Different input.*
- **Two columns:**

| Workplace (Ironside) | Consumer (Listen Labs / Sideshift) |
|---|---|
| Manager reads the empathy paragraph before deciding to cut Lisa's time. | Maya reads her own day back. Her vault. Her judgment. |
| Action data + brain context → empathy-aware decision | Brainrot in real time + the algorithm breaking out argument |
| The corner-cut doesn't happen. | The user immunizes herself. |

- **Spoken (~25s, LOCKED, Johnny — v3 §3 Slide 7):** *"Same engine. Two demo scenarios. Different beneficiaries. The construction worker on scaffolding. Maya, the Gen-Z teen scrolling Reels. Same architecture, swap the input file. We don't recommend behavior — ever. We surface evidence. The human in the loop judges. That's the YEA rubric of Best Use of AI, enacted in the product itself, not in our pitch deck."*
- **Kill-line (LOCKED, v3 §7 #14):** *"Manipulation only works in the dark. We turned the lights on."*
- **Visual direction:** two-column typographic split. No cards. Left column heading in blueberry; right column heading in warm-charcoal. Horizontal rule between top headline and the two columns.

### Slide 11 — CONVICTION (the close · v3 §3 Slide 7 close)

- **Kicker:** the corner-cut doesn't happen
- **Headline (LOCKED, Johnny — v3 BEAT-5):** *The manager doesn't send the message. The patient stays. The nurse stays.*
- **Body (LOCKED, Johnny — v3 BEAT-5):** *"The corner-cut doesn't happen."*
- **Spoken (~25s, LOCKED, Johnny — v3 §3 Slide 7):** *"Manipulation only works in the dark. We turned the lights on."* (beat — then quiet:) *"Humans are not machines. The empathy layer is what AI gives back when AI augments management decisions instead of replacing them."*
- **Kill-lines (LOCKED, v3 §7 #8 + #14 + #1):** *"The corner-cut doesn't happen."* / *"Manipulation only works in the dark. We turned the lights on."* / *"Humans are not machines."*
- **Visual direction:** split-screen static. Left card · cold light: `OVER_THRESHOLD / 30 min · cut to 10`. Right card · slightly warmer light: `she held space / similarity 0.86 · falsified 0.27`. Below, centered headline in blueberry-800.

### Slide 12 — Pavilion Coverage (the closer)

- **Kicker:** pavilion coverage · structurally MECE
- **Headline:** *one engine · five briefs · same hero output*
- **Pavilion list (hairline dividers, no card grid):**
  - **Ironside (primary · $5K)** — *"For the worker — not the surveiller."* (LOCKED, v3 §7 #9)
  - **Listen Labs ($3K + interview)** — *"Insight, not stack. Brain-grounding is the insight."* (LOCKED, v3 §6)
  - **Sideshift (B2C overlay)** — *"Know what knows you."* (LOCKED, v3 §7 #17)
  - **YC (stretch)** — *"The first product you use ON the algorithm instead of being used BY it."* (LOCKED, v3 §6)
  - **Best Use of AI** — *"Manipulation only works in the dark. We turned the lights on."* (LOCKED, v3 §7 #14)
- **Speaker note (~15s):** *"One engine. Five briefs. Ironside primary. Listen Labs core. Sideshift overlay. YC stretch. Best Use of AI throughout. Same architecture, swap the closing slide. We ship Saturday night."*
- **Visual direction:** divider list. Pavilion name in blueberry kicker; closing kill-line in serif italic. No headshots, no logos — text-only. Five rows.

### Slide 13 — Final Title Card

- **Kicker:** —
- **Headline (LOCKED, Johnny — v3 BEAT-5 title card):**
  > *Humans are not machines.*
  >
  > *The empathy layer is what AI gives back.*
  >
  > *[Product name] · Caltech HackTech 2026*
- **Visual direction (LOCKED, v3 §8):** Black screen. White text appears one line at a time, 1-second gaps between each. **No voiceover.** Music fades to nothing on the first line. Silence by the third. Hold 6 seconds total. Then end.

---

## 4. Round 2 — 8-Slide Deck (3 minutes)

Compresses Round 1 to 8 slides. Cold-open Johnny on camera + 5 BEAT-style slides + scenarios slide + title-card close. Matches v3 §2 master-cut beats.

| # | Beat | Time | Slide | Headline / Anchor | Visual |
|---|---|---|---|---|---|
| 1 | Cold open — Johnny on camera | 0:00–0:15 | *Somewhere right now, a manager is looking at a number.* (LOCKED, v3 §2 cold open) | Johnny on camera, plain background, direct address. Cut to nurse footage at end. |
| 2 | BEAT-1 — the gap | 0:15–0:30 | *Every company in the world is making decisions about humans using data that was never designed to understand humans.* (LOCKED) | Dashboard frame · `Duration: 1,800s · Flag: OVER_THRESHOLD`. Cold-monitor grade. Silence. |
| 3 | BEAT-2 — the brain layer | 0:30–0:55 | *We send the same video into Meta's TRIBE V2. ~20K cortical points. What her brain was doing while she did it.* (LOCKED) | Split-screen: nurse footage left, cortical mesh right. Mesh pulses at 1Hz. Music enters here. |
| 4 | BEAT-3 — the score climbs (HERO) | 0:55–1:35 | *Eight rounds. 0.42 → 0.84.* Includes the **4-second silence**. Then *"The same protocol that matched Clair de Lune to 90.4% — run in reverse."* (LOCKED) | `score-climb` p5 visual. Dashed target line at 1.0. Music lift on peak. |
| 5 | BEAT-4 — the paragraph | 1:35–2:15 | *She did not rush. She did not check out. She held space.* (LOCKED) Footer: `0.86 / 0.27 · anchored. not confabulated.` | EmpathyDocument. §B serif italic. Three closer lines as typographic cards. |
| 6 | BEAT-5 — the decision reverses | 2:15–2:30 | *The manager doesn't send the message. The patient stays. The nurse stays. The corner-cut doesn't happen.* (LOCKED) | Split-screen static. Left cold, right warm. Then hard cut to black. |
| 7 | Scenarios | 2:30–2:50 | *Same engine. Different input.* (LOCKED) Workplace + Consumer columns. | Two-column typographic split. |
| 8 | Title-card close | 2:50–3:00 | *Humans are not machines.* / *The empathy layer is what AI gives back.* / *[Product name] · Caltech HackTech 2026* (LOCKED, v3 §2 title card) | Black screen. Three lines, 1-second gaps. No VO. Music fades to nothing on line 1. |

Speaker notes for Round 2 are the v3 §2 master-cut beats compressed by ~40%. Use the same anchor quotes verbatim.

---

## 5. The 90-Second On-Stage Demo (v3 §2 verbatim)

This is the cinematic, the Devpost embed, the asset every variant cuts from. Sarah-and-Lisa healthcare scenario as the spine. Johnny's voiceover throughout.

### Cold open (–0:05 → 0:00) — Johnny on camera

**Shot:** Johnny on camera. Plain background. Direct address to lens.

**VO (LOCKED, Johnny):**
> *"Somewhere right now, a manager is looking at a number. Thirty minutes. Over threshold. And they're about to send a message."*

**Cut to:** the same footage being watched. Person doing their job — a nurse walking into a patient room. Ambient sound only. No music yet.

**VO (LOCKED, Johnny):**
> *"They don't know what happened in that room. AI can watch that footage. It can describe every action and tool every second. But it cannot tell you how that person felt doing it. That gap is where bad decisions live. We built the missing layer."*

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

### BEAT-2 — The brain layer (0:15 → 0:35)

**Shot 05 · Split screen.** Left: nurse footage continues playing. Right: the cortical mesh appears — 20,000 points, top-down view, glowing in sync with the footage, second by second.

**Shot 06 · Push in · Mesh.** Camera slowly pushes into the cortical mesh. Region labels fade in around the perimeter: *emotional-processing, prefrontal, default-mode, salience-tracking.*

**VO (LOCKED, Johnny):**
> *"We send the same video into Meta's TRIBE V2 brain-encoding model. It predicts per-second neural response across roughly twenty thousand cortical points. Not what she said. Not what she did. **What her brain was doing while she did it.**"*

**Direction (LOCKED).** Music enters here for the first time — something low and procedural, like an algorithm waking up. The mesh glow should pulse at 1Hz, not faster. **Feels biological, not sci-fi.** Activation colormap: cool indigo in quiet regions, warming to amber where engagement is high.

**Shot 07 · Hover-bridges · Animated.** Thin lines appear between brain regions — cross-region connections lighting up in sequence. Per-region specialist labels pulse as each region activates. The brain is being read.

**VO (LOCKED, Johnny):**
> *"Eight specialist agents interpret each region in parallel. What was the prefrontal cortex contributing? What was the emotional-processing center doing? What the action data missed — the brain pattern captures."*

### BEAT-3 — The score climbs (0:35 → 1:00) — **HERO REVEAL**

**Shot 08 · Full screen · Score-climb visualization.** The iterative loop runs visibly. A chart fills the frame. A line walks left to right — round number ticking forward, score rising. A candidate paragraph fades in/out underneath each round.

> On screen: Round 1 → 0.42 · Round 2 → 0.58 · Round 3 → 0.65 · Round 5 → 0.71 · Round 8 → **0.84**

**VO (LOCKED, Johnny):**
> *"Eight rounds of iterative scoring. Each round, Claude writes a new paragraph describing what the nurse felt. TRIBE V2 scores it against the actual brain pattern from the footage."*

#### **— HOLD · NO VO · 4 seconds — (LOCKED PRODUCTION NOTE)**

> Let the score climb in silence. Round 5 to Round 8. The audience watches 0.71 become 0.84 without narration.
>
> **The engine improving in real time is the reveal — don't talk over it.**

This is the most important moment in the film. **Don't fill it.**

**VO resumes (LOCKED, Johnny):**
> *"Round one: 0.42. Round eight: 0.84. This is the same protocol that matched Clair de Lune's neural fingerprint to 90.4% in our prior published work — run in reverse."*

**Direction (LOCKED).** Music lifts slightly as the score peaks at 0.84. **Not celebratory — just a resolution. Like something clicking into place.** The dashed target line at 1.0 stays visible the whole time — *the engine isn't perfect, and that honesty is the credibility.*

### BEAT-4 — The paragraph (1:00 → 1:25) — **The artifact**

**Shot 09 · Full screen · Empathy document.** The empathy-layer document fills the frame. Three sections with hairline dividers. Section B — the paragraph — is large, serif italic, magazine-quality. It appears line by line as the voiceover reads it.

**VO — read slowly, one breath per sentence (LOCKED, Johnny):**

> *"She entered the room and her vital-attention signature shifted immediately — the prefrontal sharpness of triage softened into something quieter, more accommodating."*

— **2-second pause** —

> *"For the first twelve minutes her emotional-processing specialist sustained engagement. She was reading the patient's grief, not just monitoring it."*

— **Pause · then slower** —

> *"She did not rush. She did not check out. She held space."*

**Direction (LOCKED).** These three lines appear one at a time on screen, centered, large — **not** inside the document. Typographic cards. Hold each for 1.5 seconds. **This is the emotional peak of the film.** Do not rush it. After the third line, hold 2 full seconds of silence before the next shot.

**Shot 10 · Document footer.** Camera settles on the bottom of the document. Two numbers appear in clean mono type.
> On screen: `Brain-pattern similarity: 0.84 / Falsification check: 0.27`

**VO (LOCKED, Johnny):**
> *"Similarity: 0.84. Falsification check against a control visit: 0.27. **Anchored. Not confabulated.**"*

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

**Shot 12 · Title card · Black screen.** White text appears one line at a time, 1-second gaps between each. **No voiceover.** Music fades to nothing on the first line. Silence by the third.

> *"Humans are not machines."*
>
> *"The empathy layer is what AI gives back."*
>
> *"[Product name] · Caltech HackTech 2026"*

**Direction (LOCKED).** Hold 6 seconds total. Then end.

### Production note (LOCKED, v3 §2)

The 4-second silence in BEAT-3 is the most important moment in the film. **Don't fill it.** The engine improving without narration is more persuasive than anything you could say over it.

For the **9:16 social cut**: compress BEATs 1 and 2 to 10 seconds combined, keep BEATs 3 and 4 full, hit the title card at 60 seconds.

---

## 6. Variant A — Ironside Speaker-Split (1:30, v3 §4 verbatim)

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

## 7. Variant B — B2C Cinematic 3:14, "Know what knows you" (v3 §5 verbatim)

Longer cut. Cinematic, not technical. Built for the Sideshift / YC pavilion + the social-share surface. **Tagline (LOCKED): Know what knows you.**

### Shot 01 — The eye (0:00)
**Direction:** Silence. Then, barely audible.
**VO (LOCKED):** *"You didn't choose this."*

### Shot 02 — The montage (0:05)
**Direction:** Beat. Let the images breathe. Four people. Four cities. Same Reels feed playing on each phone. Same scroll speed. Intercut.
**VO (LOCKED):** *"4 people. 4 cities. 4 lives. The same feed. The same songs. The same conclusions."*

### Shot 03 — Split-screen phones (0:18)
**VO (LOCKED):** *"Your taste isn't yours anymore. It's a prediction. **A pattern they already knew about you before you did.**"*

### Shot 04 — The mirror (0:32)
**Direction:** Slower now. Almost a whisper.
**VO (LOCKED):** *"When did you last choose something for yourself?"*

### Shot 05 — Person A (0:45)
**VO (LOCKED):** *"You could opt out. Stay offline. Stay slow. Stay behind. Hold onto who you are while the world moves without you."*

### Shot 06 — Person B (1:05)
**VO (LOCKED):** *"Or you could give it all away. Every search. Every song. Every 3am thought you typed into a box thinking no one was listening. **They were listening. And they sold what they heard.**"*

### Shot 07 — The intercut (1:25)
**Direction:** Faster. Urgent.
**VO (LOCKED):** *"Resist — and lose. Comply — and disappear. **That's the deal they never told you about.**"*

— **One second of silence.** —

**VO (LOCKED):** *"But that's not the only deal."*

### Shot 08 — The warm room (1:52)
**VO (LOCKED):** *"What if you could see it? Everything it knows about you — laid out like a map. Yours to read. Yours to correct. Yours to decide what happens with."*

### Shot 09 — The UI (2:10)
**VO (LOCKED):** *"Not a product built from your data. **A mirror built by you.** You feed it. You shape it. It works for you and only you."*

### Shot 10 — Second montage (2:35)
**Direction:** The same 4 people. But now, 4 different screens. 4 different worlds.
**VO (LOCKED):** *"The same 4 people. But now, 4 different screens. 4 different worlds. **This is what it looks like when you stay in the room and still stay yourself.**"*

### Shot 11 — Title card (3:00)
**VO (LOCKED):** *"You are not a data point. You are not a product or an algorithm's conclusion."*

### Shot 12 — Logo (3:14)
**VO (LOCKED, Johnny):** *"Today it's Reels. In five years it's brain chips. Same trade. Same trap. We're building the design pattern for human-AI partnership before the cognitive interface becomes invisible to me. This is the first product I get to use ON the algorithm instead of being used by it. **Manipulation only works in the dark. I just turned the lights on.**"*

**Tagline (LOCKED):** *Know what knows you.*

### Maya's empathy paragraph (the consumer artifact)
For pavilion conversations + Devpost embed, here is the brain-grounded paragraph the engine generates for Maya's 90s Reels feed:

> *"Her amygdala ignited in the small repetitive way that anger wears when it's been served instead of arrived at. There was no surprise in her threat-detection — these were familiar shapes, content her brain had already learned to recognize and respond to without choosing. Her default-mode network — the part of her that's her — sat quiet, not engaged with the feed but not free of it either. **She wasn't watching. She was being watched-at.**"* (LOCKED)

**Similarity: 0.79. Falsification check (vs. her brain on a curated short film): 0.24. Anchored.**

**Kill-line (LOCKED):** *"She wasn't watching. She was being watched-at."*

---

## 8. Pavilion Swap-Slides (v3 §6 verbatim)

Same 1:30 master cut. Different closing slide per pavilion. Pre-rendered, swap in at BEAT-5 close depending on which pavilion is judging. 7-second swap.

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

## 9. Kill-Line Glossary (v3 §7 verbatim — the lines we want quoted verbatim)

These are the lines we want a judge to type into Slack five minutes after the pitch. Use them verbatim everywhere — slides, voiceover, swap-slides, Devpost, FAQ, social cuts. The pitch-deck JSX uses exactly these strings.

| # | Kill-line | Origin | Where it lives | Status |
|---|---|---|---|---|
| 1 | **"Humans are not machines."** | Johnny | Slide 4, Slide 11, master title card | LOCKED |
| 2 | **"The empathy layer is what AI gives back when AI augments management decisions instead of replacing them."** | Johnny | Slide 1, Slide 4 headline, Slide 11 close | LOCKED |
| 3 | **"The action data was right. The decision was wrong."** | Johnny | Slide 1 anchor quote, thesis paragraph | LOCKED |
| 4 | **"AI can see. It can describe what happened. But it cannot tell you what it meant."** | Johnny | BEAT-1 voiceover, Slide 3 | LOCKED |
| 5 | **"What her brain was doing while she did it."** | Johnny | BEAT-2 voiceover, Slide 6 | LOCKED |
| 6 | **"She did not rush. She did not check out. She held space."** | Johnny | BEAT-4 typographic peak, Slide 9 | LOCKED |
| 7 | **"Anchored. Not confabulated."** | Johnny | BEAT-4 footer, Slide 9 | LOCKED |
| 8 | **"The corner-cut doesn't happen."** | Johnny | BEAT-5, Slide 11 | LOCKED |
| 9 | **"For the worker — not the surveiller."** | Johnny | Ironside variant close, Slide 12 | LOCKED |
| 10 | **"That gap — that's the signal."** | Johnny | Ironside BEAT-2 | LOCKED |
| 11 | **"We didn't label these. The regions did."** | Johnny | Ironside BEAT-3 | LOCKED |
| 12 | **"The difference between noise and intervention."** | Emilie | Ironside BEAT-4 | LOCKED |
| 13 | **"She wasn't watching. She was being watched-at."** | Maya empathy paragraph | B2C empathy artifact | LOCKED |
| 14 | **"Manipulation only works in the dark. We turned the lights on."** | Johnny | Slide 10, Slide 11, B2C close, Best AI swap | LOCKED |
| 15 | **"A pattern they already knew about you before you did."** | B2C cinematic | B2C Shot 03 | LOCKED |
| 16 | **"A mirror built by you."** | B2C cinematic | B2C Shot 09 | LOCKED |
| 17 | **"Know what knows you."** | B2C tagline | B2C close, social cut, Sideshift swap | LOCKED |
| 18 | **"90.4% match against the Clair de Lune emotion-center."** | Credibility chip | Slide 5, Slide 6, BEAT-3, every variant | LOCKED |
| 19 | **"Same engine. Different input."** | Cross-variant | Slide 10, every pavilion swap | LOCKED |
| 20 | **"That contrast is the whole setup."** | Production note | BEAT-1 color-grade direction | LOCKED |

If a slide draft uses a paraphrase of any of these lines, replace with the verbatim string. The JSX deck pulls these as constants.

---

## 10. Production Direction (v3 §8 verbatim — the craft layer)

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

## 11. Forbidden-Claim Discipline (v3 §10 verbatim)

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

## 12. The Honesty Paragraph (v3 §9 verbatim)

Practiced, ready, deployed verbatim if a judge presses on rigor. This paragraph defuses *"is this real?"* without breaking trust.

> *"Here's what's real and what's stand-in. The brain pattern — TRIBE V2 reverse — was generated offline before the build. We're not running it live; we're not pretending to. The iterative-loop scoring uses K2 specialists evaluating the paragraph against each region's reading — semantic, falsifiable, real. The cosine-similarity number you see in §C uses a sentence-embedding proxy fit from hand-paired text-activation examples. It's a stand-in for live TRIBE forward inference, which is the production path. The falsification logic — main vs. control, cosine delta — is identical to the methodology that produced our 90.4% Clair de Lune match in published work. We're not lying about results. We're showing you a speed-run of the process while running one in the background."*

Practice it cold. Deliver it slow. Don't hedge.

---

## 13. Cross-References

- `caltech/pitch-story-v3-next-level.md` — **canonical source of truth.** Every LOCKED line in this brief is verbatim from there.
- `caltech/architecture-overview.md` (v2) — the engine, technical
- `_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md` (v2) — engineering spec
- `_bmad-output/planning-artifacts/ironsight-listenlabs-prd.md` — strategic PRD, sponsor brief verbatim, success criteria
- `caltech/build-plan-locked.md` — v2 build plan, file-level lane assignments
- `caltech/use-cases/two-demo-scenarios.md` — canonical scenario contract
- `caltech/use-cases/listenlabs-sideshift.md` — B2C deep dive
- `caltech/use-cases/ironside.md` — workplace deep dive
- `caltech/research-context/007-johnny-public-corpus-tribe-posts.md` — Clair de Lune precedent
- `Hacktech_Notes.pdf` — Johnny's voiceover scripts, locked source for all v3 LOCKED lines

---

**Source-of-truth files for any retune:**
- `caltech/pitch-story-v3-next-level.md` — this brief mirrors v3
- `caltech/pitch-deck/PITCH-STORY.md` — this file (designer's brief)
- `caltech/pitch-deck/app/round-1/page.tsx` — JSX implementation, 13 slides
- `caltech/pitch-deck/app/round-2/page.tsx` — JSX implementation, 8 slides
