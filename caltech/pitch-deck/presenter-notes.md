# presenter notes — the empathy layer

Per-slide spoken script + 30-second elevator versions + hostile-judge FAQ ammunition.

Voice anchor: `caltech/pitch-story-v3-next-level.md` (LOCKED lines verbatim).
Master scenario: Sarah-and-Lisa healthcare. Construction footage is the Ironside-pavilion variant; do not mix.
Slide IDs match the `id:` field in `app/round-1/page.tsx` and `app/round-2/page.tsx` so the presenter can navigate by ID under hot lights.

---

## Doctrine — what the presenter holds throughout

> *The pitch tells the story. The demo proves it. The 4-second silence in BEAT-3 is the most important moment in the pitch — do not fill it. The score climbing on screen is more persuasive than any sentence the presenter can speak over it.*
>
> *LOCKED lines are non-negotiable. Read them verbatim, do not paraphrase, do not improve. They are load-bearing because they were drafted to be load-bearing.*
>
> *Forbidden-claim discipline at all times. Never "she felt grief" — always "emotional-processing specialist sustained engagement." Never "clinical." Never sub-second. Never population-norm. The engine enforces these via regex pre-flight; the presenter enforces them with their voice.*
>
> *The arc is: RECOGNITION → INDIGNATION → CURIOSITY → AWE → SURPRISE → PRIDE+COMFORT → CONVICTION. Hit each beat. Resist the urge to compress AWE or rush PRIDE+COMFORT — those are the slides that change a judge's mind.*

---

## ROUND 1 — 5-min deck (13 slides)

The deck reads as the spoken version of the master cut. The 90-second demo plays against slides 4–7 (architecture → score-climb → hero output → proof). Total target: 4:45–5:00.

---

### Slide 1 · `title` — humans are not machines / ai forgot

**On screen:** "humans are not machines. / ai forgot." plus Johnny's anchor quote.

**Spoken (~12s):**
> *"Somewhere right now, a manager is looking at a number. Thirty minutes. Over threshold. And they're about to send a message. They don't know what happened in that room. The action data was right. The decision was wrong. The empathy layer is what closes that gap."*

**Why this slide.** RECOGNITION. Present-tense imminence — the bad decision is happening WHILE the judge watches. The kill-line lands before they've processed the deck.

**Q&A anchor (if hostile):** "We open with a manager because every judge in this room is one. The thesis line — *the action data was right, the decision was wrong* — is the entire pitch in one sentence."

---

### Slide 2 · `hook` — present-tense imminence, the dashboard frozen

**On screen:** dashboard close-up frozen at `Duration: 1,800s · Flag: OVER_THRESHOLD`. Manager's hand hovering over a keyboard. About to type.

**Spoken (~12s):**
> *"Somewhere right now, a manager is looking at a number. Thirty minutes. Over threshold. And they're about to send a message. They don't know what happened in that room."*

**Why this slide.** RECOGNITION continues — but as imminence. The bad decision is happening WHILE the judge watches. We haven't shown the engine; the cost is already arriving.

**Q&A anchor:** "We open with what every judge in this room has actually done. The slide is silent on purpose — the message hasn't been sent yet, and the judge is the one about to send it."

---

### Slide 3 · `stakes` — three industries, one missing layer

**On screen:** three columns. Three industries × three cold pixel-only AI outputs.
Healthcare: `nurse spent 30 min in patient room. exceeded 18 min benchmark. flag.`
Construction: `worker logged 8 min near-edge. cut to 10.`
Consumer: `user spent 2.5h scrolling. recommendation: serve longer videos.`

**Spoken (~25s):**
> *"These aren't different problems. They're the same problem at three layers. AI describes what humans did. It cannot model the cognitive-emotional state underneath the action. Managers read these reports and cut the corners that destroy what their company actually wants — patient experience, customer reviews, employee retention. The corner-cut compounds. **Humans are not machines.**"*

**Why this slide.** INDIGNATION. Three industries in seven seconds tells the judge this is a category, not a feature. Kill-line closes so slide 4 can extend it.

**Q&A anchor:** "VLMs are not failing — they are succeeding at the wrong objective. They report action. We add the missing modality: the cognitive-emotional state that produced the action. Both layers are needed."

---

### Slide 4 · `thesis` — the action data was right. the decision was wrong.

**On screen:** the LOCKED thesis line large + the headline below.

**Spoken (~15s):**
> *"**The action data was right. The decision was wrong. The empathy layer is what closes that gap.**"*

— **beat** —

> *"We built one engine. Video in. Paragraph out. The paragraph is brain-grounded, falsifiable, and never recommends behavior. The manager — or the user themselves — judges. **The empathy layer is what AI gives back when AI augments management decisions instead of replacing them.**"*

**Why this slide.** CURIOSITY. The judge has heard "humans are not machines" once and is now anchored. This slide names the gap *and* names what closes it. The two LOCKED kill-lines land back-to-back.

**Q&A anchor:** "One engine. The same architecture answers Ironsight's spatial-intelligence brief and Listen Labs's simulate-humanity brief. Sponsor lane is configured by the input file, not by forking the engine."

---

### Slide 5 · `architecture` — video in, paragraph out (the engine)

**On screen:** the six-stage pipeline — Qwen3-VL, TRIBE V2, K2 swarm, Claude Opus, iterative loop, falsification check.

**Spoken (~35s):**
> *"Qwen3-VL describes the scene — observational, no emotion claims. Meta's TRIBE V2 brain-encoding model — same model that produced our 90.4% match against the Clair de Lune emotion-center in our prior published work — predicts per-second neural response across roughly twenty thousand cortical points. Cerebras K2 fans out a swarm of region-specialist agents, one per brain region, in parallel. Each one reads what its region was contributing. Claude Opus combines vision and brain-region readings into one paragraph. Then — this is the magic — the same swarm comes back as an evaluator. Each region rates how faithfully the paragraph captured what it was doing. Eight rounds. The score climbs."*

**Why this slide.** AWE. The audience sees that the architecture is real, multi-stage, and earned. The Clair de Lune chip lands inside the architecture story so they understand the methodology *predates* the hackathon. **Action data tells you WHAT they did. The empathy layer tells you WHAT IT TOOK.**

**Q&A anchor:** "TRIBE V2 numbers are canonical: roughly 20,000 cortical vertices on fsaverage5, drawn from roughly 25 deeply-scanned subjects. We never claim 70K voxels or 700 subjects — those are inflated marketing figures we explicitly do not use."

---

### Slide 6 · `swarm-detail` — seven specialists, one paragraph

**On screen:** the cortical mesh with hover-bridges between brain regions. Per-region specialist labels pulse as each region activates. Visual / Somatomotor / Dorsal-Attention / Ventral-Attention / Limbic / Frontoparietal / Default-Mode.

**Spoken (~25s):**
> *"Seven brain regions. Seven K2 specialists. Each one reads its region's per-second activation pattern from the prerendered TRIBE V2 brain-encoded JSON. They run in parallel. Visual attention sees what the eyes are tracking. Threat detection registers cognitive load. Default-mode reads the part of her that's her — quiet or engaged. Salience tracking finds the moments that matter. The K2 moderator combines the seven readings into one paragraph. **What her brain was doing while she did it.**"*

**Why this slide.** AWE deepens. The architecture from slide 5 becomes visceral — the brain isn't a heatmap, it's seven voices that disagree productively. The Yeo7 parcellation lands as legitimate, not stylized.

**Q&A anchor:** "Yeo7 is the canonical seven-network parcellation of the cortex (Yeo et al., 2011). Each specialist has a paper-grounded prompt — see `backend/prompts/{network}.md`. The cross-region readings emerge before the synthesis. K2 at ~2000 tokens per second is what makes seven parallel calls plus moderation fit a consumer-product latency budget."

---

### Slide 7 · `score-climb` — eight rounds, the score climbs (HERO REVEAL)

**On screen:** the score-climb chart. 0.42 → 0.58 → 0.65 → 0.71 → 0.75 → 0.78 → 0.82 → 0.84.

**Spoken (~25s):**
> *"Eight rounds of iterative scoring. Each round, Claude writes a new paragraph describing what the nurse felt. TRIBE V2 scores it against the actual brain pattern from the footage. Round one — generic paragraph, low score. The evaluator swarm tells us which regions we missed. Round by round, the paragraph rewrites itself toward the brain pattern. Round eight, we've stabilized."*

— **HOLD. NO VO. 4 seconds. Let the chart finish climbing.** —

> *"Round one: 0.42. Round eight: 0.84. **This is the same protocol that matched Clair de Lune's neural fingerprint to 90.4% in our prior published work — run in reverse.**"*

**Why this slide.** SURPRISE. The audience watches improvement happen visibly, in silence. The Clair de Lune callback lands in the same breath as 0.84 — "we already shipped this." The 4-second silence is the most important production moment in the entire pitch.

**Q&A anchor:** "The dashed target line at 1.0 is visible the whole time. The engine is not perfect. That honesty is the credibility — we're showing you a process, not a magic trick."

---

### Slide 8 · `proof` — 90.4% (Clair de Lune precedent)

**On screen:** 90.4% in giant numerals + the activation-pulse mesh + Johnny's anchor quote about running the loop in reverse.

**Spoken (~25s):**
> *"Same iterative-scoring loop. Ran forward last spring: sixty seconds of Clair de Lune in, text out, 90.4% match in the emotion region across 20,484 vertices. Eight rounds. Falsified against triumphant music, rain, and aggressive speech. Published, dated, public. **The methodology already shipped.** What you just watched is that same loop run in reverse — video's brain pattern in, paragraph out. We are not inventing a method on the demo stage. We are applying a published one to a problem nobody else has connected it to."*

**Why this slide.** Credibility chip. The judge needs to know the team can do what they just claimed. The Clair de Lune work is the founder-market-fit artifact and the methodology-credibility artifact in the same breath.

**Q&A anchor:** "Johnny's published Clair de Lune work — 90.4% match, falsified against control music — IS the methodology this product runs in inverse. The team that proved the forward direction is the team running the reverse. Founder-market-fit and methodology-credibility are the same artifact."

---

### Slide 9 · `hero-output` — she did not rush. she held space.

**On screen:** the empathy-layer document. Sarah-the-nurse / Lisa-the-patient. Vision report on top, magazine-quality serif paragraph in §B, similarity 0.86 / falsification 0.27 in the footer.

**Spoken — read SLOWLY, one breath per sentence (~30s):**

> *"The dashboard flagged the visit as over-threshold. Cut to ten minutes. The empathy-layer document showed otherwise."*

— **beat** —

> *"Her vital-attention signature shifted as she entered the room. The prefrontal sharpness of triage softened into something quieter."*

— **beat** —

> *"For the first twelve minutes her emotional-processing specialist sustained engagement. She was reading the patient's grief, not just monitoring it."*

— **2-second pause** —

> *"**She did not rush. She did not check out. She held space.**"*

— **2-second pause** —

> *"Similarity zero point eight six. Falsification check against a control visit, zero point two seven. **Anchored. Not confabulated.** Same falsification methodology that produced our 90.4% Clair de Lune match. **The corner-cut doesn't happen.**"*

**Why this slide.** PRIDE + COMFORT. This is the emotional peak. The judge stops evaluating a product and watches a decision reverse. Do not rush the three short sentences. The pause after "she held space" is what makes the falsification number land as a relief, not a flex.

**Q&A anchor:** "The paragraph uses observational language only — *emotional-processing specialist sustained engagement,* not *she felt grief.* That is the Poldrack-2006 reverse-inference guardrail, enforced by regex pre-flight in `backend/services/guardrails.py`. The methodology is published, the language discipline is engineered in."

---

### Slide 10 · `falsification` — same nurse, two scenes (within-subject contrast)

**On screen:** two empathy paragraphs side by side. Same nurse, two different visits. Similarity 0.86 vs 0.27. Falsification delta 0.59. Verdict: anchored.

**Spoken (~25s):**
> *"Same nurse. Two scenes. The patient room consultation, similarity zero point eight six. The routine vitals visit, zero point two seven. Falsification delta — fifty-nine points. **The paragraph is anchored to this scene specifically, not generically plausible.** Same logic as our Clair de Lune work falsifying against control music — triumphant music, rain, aggressive speech. The pattern only matched Clair de Lune. **The methodology travels.**"*

**Why this slide.** Rigor argument. Listen Labs explicitly asks for it ("ground in data; measure against something real"). Best Use of AI judges hold the YEA/NAY rubric on this. The within-subject contrast is the most rigorous baseline available to us.

**Q&A anchor:** "Within-subject contrast is the only baseline we use. Same person, different inputs — predicted brain pattern vs measured response. Never population-norm; that's a forbidden claim per Poldrack 2006. We're not comparing one nurse to all nurses; we're comparing this nurse on this scene to this nurse on a different scene. That's what makes the description anchored, not generic."

---

### Slide 11 · `two-scenarios` — swap the file, the engine doesn't fork

**On screen:** two columns. Workplace footage / Manager reads the empathy document. Consumer day / User reads their own day back.

**Spoken (~25s):**
> *"Same engine. Two scenarios. Different beneficiaries. The construction worker on scaffolding. Maya, the Gen-Z teen scrolling Reels. The nurse in the patient room. **Same engine. Different input.** We don't recommend behavior — ever. We surface evidence. The human in the loop judges. That's the YEA rubric of Best Use of AI, enacted in the product itself, not in our pitch deck. **Manipulation only works in the dark. We turned the lights on.**"*

**Why this slide.** Demonstrates lane-fit without forking the narrative. Lets the judge see how this maps to *their* sponsor without the presenter pivoting awkwardly.

**Q&A anchor:** "B2B and B2C are not different products. They are different readers of the same paragraph. The manager reads it about a worker. The user reads it about themselves. The architecture does not care."

---

### Slide 12 · `pavilion-map` — one engine, five sponsor closes

**On screen:** four sponsor swap cards arranged as a grid — Ironside / Listen Labs / Sideshift / YC — each linking to `/sponsor/{name}`. Best Use of AI as the spine running through all four.

**Spoken (~20s):**
> *"One engine. Five sponsor closes. Ironside — primary five thousand dollar target, answered structurally. Listen Labs — three thousand plus interview, the iterative loop IS the simulation. Sideshift — consumer-data agency, the user owns the vault, **know what knows you.** YC — today it's Reels, in five years it's brain chips, same trade, same trap. Best Use of AI runs through all four — surface evidence, the human judges, **manipulation only works in the dark, we turned the lights on.**"*

**Why this slide.** Sponsor-coverage discipline. Demonstrates that multi-track is structurally MECE because the engine is general; the input is the specialization. For Ironside-primary judging, the slide hot-swaps to `/sponsor/ironside` for the verbatim swap-slide.

**Q&A anchor:** "Each pavilion gets its own swap-slide; the master cut is constant. Live in the deck at `/sponsor/{name}` — hot-swappable in seven seconds depending on which pavilion is judging. We're not running four pitches. We're running one pitch with four closes."

---

### Slide 13 · `close` — humans are not machines / the empathy layer is what AI gives back

**On screen:** giant "humans are not machines." + closing line "the empathy layer is what AI gives back."

**Spoken (~20s):**
> *"**Humans are not machines. The empathy layer is what AI gives back when AI augments management decisions instead of replacing them.**"*

— **beat — quiet** —

> *"The action data was right. The decision was wrong. The empathy layer is what closes that gap. That's the whole pitch. Thank you."*

**Why this slide.** CONVICTION. The judge hears the two LOCKED kill-lines back-to-back, with no further architecture talk. The thesis line lands last so it stays in their mouth on the way out.

**Q&A anchor:** "The ask depends on the room. Ironside primary $5K — we structurally answer your brief. Listen Labs $3K plus interview — the iterative loop IS the simulation. Sideshift overlay — the user owns the data. YC stretch — the design pattern before the cognitive interface becomes invisible."

---

## ROUND 2 — 3-min deck (8 slides)

Compressed. Each slide 20–25 seconds spoken. Tracks the v3 §2 master-cut BEAT structure: BEAT-1 is slides 1–2, BEAT-2 is slide 3, BEAT-3 is slide 4, BEAT-4 is slide 5, proof+rubric is slide 6, sponsor swap is slide 7, BEAT-5 close is slide 8.

---

### Slide 1 · `cold-open` (0:00–0:12) — Johnny on camera, the imminence

**On screen:** Johnny on camera. Direct address to lens. Plain background. Then cut to the dashboard frozen at `1,800s · OVER_THRESHOLD`.

**Spoken (~12s):**
> *"Somewhere right now, a manager is looking at a number. Thirty minutes. Over threshold. And they're about to send a message. They don't know what happened in that room. **AI can watch that footage. It can describe every action and tool every second. But it cannot tell you how that person felt doing it. That gap is where bad decisions live. We built the missing layer.**"*

**Why this slide.** RECOGNITION. Present-tense imminence — the bad decision is happening WHILE the judge watches. Johnny on camera before any architecture talk = trust before claims.

**Q&A anchor:** "We open with the moment the decision goes wrong, not with the solution. Most pitches lead with the engine. We make you feel the cost of the gap first."

---

### Slide 2 · `the-gap` (0:12–0:35) — ai sees what they did. it can't see what it took.

**Spoken (~22s):**
> *"A vlm flags a thirty-minute nurse visit as over-threshold. The manager cuts it to ten. The patient was being told they have cancer. **Action data was right. The decision was wrong.** AI describes what humans did. It cannot model the cognitive-emotional state underneath the action. The corner-cut compounds. We built the missing layer."*

**Why this slide.** INDIGNATION. The cancer detail is the load-bearing horror — it makes the dashboard's "OVER_THRESHOLD" obscene without the presenter editorializing.

**Q&A anchor:** "Sarah and Lisa is the master scenario across every variant — healthcare is the cleanest moral surface. Construction is the Ironside-pavilion swap, not a different scenario."

---

### Slide 3 · `brain-layer` (0:35–0:55) — TRIBE V2 + the K2 swarm reads the brain

**Spoken (~25s):**
> *"A brain-grounded empathy layer. Video in. Paragraph out. TRIBE V2 — Meta's brain-encoding model — predicts per-second neural response across twenty thousand cortical points. K2 swarm fans out specialist agents, one per brain region, in parallel. Claude Opus synthesizes one paragraph. Then the iterative-scoring loop from Clair de Lune, run in reverse — eight rounds. Evidence the manager can audit."*

**Why this slide.** AWE — compressed. The architecture lands as a single sentence the judge can repeat. Clair de Lune namechecked once, immediately, as authority.

**Q&A anchor:** "K2 instead of Claude for the swarm because at Claude latency, eight rounds times seven evaluators times scoring would not fit a consumer-product latency budget. K2 runs roughly two thousand tokens per second. The math only works at K2 speed."

---

### Slide 4 · `score-climb` (0:55–1:35) — eight rounds. the score climbs.

**Spoken (~22s, with the silence baked in):**
> *"Each round, Claude writes a new paragraph. TRIBE V2 scores it forward — text in, predicted brain pattern out. Cosine similarity against the actual video's brain pattern."*

— **HOLD. 4 seconds. Let the chart climb in silence.** —

> *"Round one, zero point four two. Round eight, zero point eight four. **The same protocol that matched Clair de Lune to 90.4% — run in reverse.**"*

**Why this slide.** SURPRISE — the hero beat. Under the 3-min cut the silence is even louder because there is no slack anywhere else in the pitch. Hold it.

**Q&A anchor:** "The dashed target line at 1.0 stays visible the whole time. The engine is not perfect. That honesty is the credibility."

---

### Slide 5 · `paragraph` (1:35–2:15) — she did not rush. she held space.

**Spoken (~25s):**
> *"The dashboard would have cut the visit to ten minutes. The document changes the call."*

— **beat** —

> *"For the first twelve minutes her emotional-processing specialist sustained engagement. She was reading the patient's grief, not just monitoring it."*

— **2-second pause** —

> *"**She did not rush. She did not check out. She held space.**"*

— **beat** —

> *"Similarity 0.86. Falsification check 0.27. **Anchored. Not confabulated. The corner-cut doesn't happen.**"*

**Why this slide.** PRIDE + COMFORT. Compressed but the silences stay. Do not steal time from the pause after "she held space."

**Q&A anchor:** "Falsification 0.27 means the same paragraph scored against a control visit drops sharply. That gap is the falsifier. Without it, the paragraph would be a confabulation. With it, it is grounded."

---

### Slide 6 · `decision-reverses` (2:15–2:35) — split-card / the corner-cut doesn't happen

**On screen:** split screen, two static cards.
**Left** (cold light): `OVER_THRESHOLD / 30 min · cut to 10`
**Right** (slightly warmer): `she held space / similarity 0.84 · falsified 0.27`

**Spoken, dead calm (~20s):**
> *"The manager doesn't send the message. The patient stays. The nurse stays."*

— **1-second silence** —

> *"**The corner-cut doesn't happen.**"*

— **beat** —

> *"That's a decision change, not a feature. Surface evidence. Let the human judge. Don't recommend. **The architecture enacts the YEA rubric — it's not in the pitch deck, it's in the system.**"*

**Why this slide.** CONVICTION beat at 3-min compression. The split-card delivers the inversion as a single visual; the spoken silence after "the patient stays. the nurse stays." is what makes the kill-line land. Best-Use-of-AI rubric is named structurally, not promised.

**Q&A anchor:** "The decision changes because the document changes. Action data alone says cut. The empathy document says hold. The manager — the human in the loop — judges. We never recommend; we surface evidence."

---

### Slide 7 · `two-scenarios` (2:35–2:50) — same engine, two scenarios

**Spoken (~15s — pick the one that fits the room, do not read all four):**

For **Ironsight** (primary): *"You confirmed it at office hours: a new modality mapped back to the video qualifies as spatial intelligence. We add the data layer. The manager reads the empathy document, not just the action log. The corner-cut doesn't happen."*

For **Listen Labs**: *"You asked: simulate humans, then prove it. We grounded the simulation in real brain-response data. The iterative loop IS the simulation. Insight, not stack."*

For **Sideshift**: *"The user owns the data. The user owns the result. The empathy document IS the daily journal. **Know what knows you.**"*

For **YC**: *"Today it's Reels. In five years it's brain chips. We're building the design pattern for human-AI partnership before the cognitive interface becomes invisible."*

**Why this slide.** Sponsor-fit, surgical. The presenter swaps the verbiage; the deck swaps the link.

**Q&A anchor:** "We do not fork the engine per sponsor. We swap the input file and the closing slide. The architecture is invariant."

---

### Slide 8 · `close` (2:50–3:00) — humans are not machines

**Spoken (~10s):**
> *"**Humans are not machines. The empathy layer is what AI gives back.** Johnny, Junsoo, Jacob, Emilie. Thank you."*

**Why this slide.** CONVICTION. Hard stop. Do not embellish. The kill-line carries the room.

**Q&A anchor:** "If they ask one question, it should be 'how do I get this in front of my team.' Direct them to the GitHub and the Devpost; do not pitch a roadmap on the spot."

---

## 30-second elevator versions — for pavilion conversations and Q&A walk-ups

Each of these is one paragraph, ~75–90 words, deliverable in one breath. Voice anchors lift from §6 of v3 (pavilion swap-slides) and §7 (kill-line glossary).

### 1. Generic 30s pitch — for any judge or sponsor walk-up

> *"Every company is making decisions about humans using data that was never designed to understand humans. A nurse spends thirty minutes with a dying patient. The dashboard sees an overrun. The manager cuts the time. The action data was right. The decision was wrong. We built the empathy layer — video in, paragraph out, brain-grounded, falsifiable. Same iterative-scoring loop that produced our 90.4% Clair de Lune match, run in reverse. Eight rounds, score climbs 0.42 to 0.84. Anchored. Not confabulated. Humans are not machines."*

### 2. Ironsight 30s — primary $5K target

> *"Your spatial-intelligence brief asked for a new modality mapped back to the video — and your team confirmed at office hours that brain encoding qualifies. Vision-language models cannot infer the cognitive-emotional state behind a spatial action. We do, by mapping TRIBE V2 brain-wave back to the same egocentric video. The safety manager reads the empathy document instead of just the action log. *Worker near edge, cognitively overloaded, hazard not visually processed* — that's the difference between noise and intervention. For the worker, not the surveiller."*

### 3. Listen Labs 30s — $3K + interview

> *"You asked: simulate humans, then prove it. Most teams answer with text-grounded agent sims. We grounded the simulation in real brain-response data — TRIBE V2 predicts per-second neural response across twenty thousand cortical points. The iterative loop IS the simulation: eight rounds of brain-pattern scoring across seven specialists. We rank arguments by which brain-region specialists they swing. We falsify with the same within-subject contrast that produced our 90.4% Clair de Lune match. Insight, not stack. Brain-grounding is the insight."*

### 4. Sideshift 30s — B2C overlay

> *"Same engine, consumer side. Maya scrolls Reels for ninety seconds. We read what the feed did to her brain — emotional-processing engaged in the small repetitive way anger wears when it's served instead of arrived at. Her default-mode network — the part of her that's *her* — sat quiet. *She wasn't watching. She was being watched-at.* The user owns the data, owns the document, owns the export. The empathy paragraph IS the daily journal. Know what knows you."*

### 5. YC 30s — stretch

> *"Today it's Reels. In five years it's brain chips. Same trade. Same trap. We're building the design pattern for human-AI partnership before the cognitive interface becomes invisible to me. Local-first by design — the user owns the brain-grounded paragraph and the falsification check. The TAM is the smartphone-to-BCI transition. We're the first product you use ON the algorithm instead of being used BY it. Manipulation only works in the dark. We turned the lights on."*

---

## Hostile-judge FAQ ammunition

Q-INT-1 through Q-INT-10. Each answer anchors in a v3 LOCKED line where possible. Practice cold. Deliver slow. Do not hedge.

### Q-INT-1 — "Is this real or is it a mock?"

Anchor: §9 honesty paragraph, verbatim.

> *"Here's what's real and what's stand-in. The brain pattern — TRIBE V2 reverse — was generated offline before the build. We're not running it live; we're not pretending to. The iterative-loop scoring uses K2 specialists evaluating the paragraph against each region's reading — semantic, falsifiable, real. The cosine-similarity number you see in §C uses a sentence-embedding proxy fit from hand-paired text-activation examples. It's a stand-in for live TRIBE forward inference, which is the production path. The falsification logic — main vs. control, cosine delta — is identical to the methodology that produced our 90.4% Clair de Lune match in published work. We're not lying about results. We're showing you a speed-run of the process while running one in the background."*

### Q-INT-2 — "What are the actual TRIBE numbers?"

> *"Canonical numbers, per technical PRD §4.4: roughly twenty thousand cortical vertices on fsaverage5, drawn from roughly twenty-five deeply-scanned subjects in Meta's Algonauts release. We never claim seventy thousand voxels or seven hundred subjects — those are inflated marketing figures we explicitly do not use. Our forbidden-claim list pins the canonical numbers in writing."*

### Q-INT-3 — "Why K2 and not just Claude for everything?"

> *"At Claude latency, eight rounds times seven evaluators times scoring per round does not fit a consumer-product latency budget. K2 runs about two thousand tokens per second — the iterative loop only works at that speed. Claude Opus does the synthesis step where prose quality matters more than throughput. K2 swarms the parallel evaluator step where throughput matters more than prose. The split is engineered, not aesthetic."*

### Q-INT-4 — "How do you know the paragraph isn't confabulated?"

> *"The similarity score IS the falsifier. We score the winning paragraph against a control video — different person, different context, same engine. The drop is the proof. In the demo: similarity zero point eight six on the actual visit, zero point two seven against the control. That delta is what *anchored, not confabulated* means. Same falsification methodology as our 90.4% Clair de Lune work, where we falsified against triumphant music, rain, and aggressive speech."*

### Q-INT-5 — "Isn't reverse inference scientifically invalid?"

> *"Yes — Poldrack 2006. Activating a region does not mean the subject experienced the function the region is named for. We never claim that. We use observational language only — *emotional-processing specialist sustained engagement,* not *she felt grief.* The forbidden-claim list is enforced by regex pre-flight in `backend/services/guardrails.py`. Banned phrases are rejected before the document is finalized. Reverse inference is the failure mode we engineer against, not toward."*

### Q-INT-6 — "What about the 70K voxels / 700 subjects you may have seen elsewhere?"

> *"Those are inflated marketing numbers from third-party coverage. Canonical TRIBE V2 release: roughly twenty thousand cortical vertices on fsaverage5, roughly twenty-five deeply-scanned subjects. We pin the smaller, accurate figure in every artifact and refuse the inflated one. The forbidden-claim discipline is not just about reverse inference — it covers every number we cite."*

### Q-INT-7 — "How does this scale beyond the demo?"

> *"Live TRIBE forward inference is the production path. The embedding-similarity proxy is the demo-day stand-in for that forward call — fit from hand-paired text-activation examples, identical falsification logic, faster to render under stage lights. Scaling to live is a swap of the inference call, not a re-architecting. The iterative-loop, the swarm, the falsification check, the document — none of that changes."*

### Q-INT-8 — "Who is this actually for?"

> *"The manager, B2B. The user, B2C. The engine is one. Same architecture, swap the input file. The manager reads the empathy document about a worker before deciding to cut a corner. The user reads the empathy document about themselves at the end of a Reels session. **Same engine. Different input.** The architecture does not care who the reader is."*

### Q-INT-9 — "Why won't this become surveillance?"

> *"The product enacts the YEA rubric — surfaces evidence, never recommends, the user or manager always judges. There is no behavior recommendation in the document, ever. The forbidden-claim list rejects any sentence that crosses into prescription. **Manipulation only works in the dark. We turned the lights on.** The architecture is the answer to the surveillance question, not a sentence in our pitch deck."*

### Q-INT-10 — "Why is this the right team?"

> *"Johnny's published Clair de Lune work — 90.4% match against the emotion-center, falsified against triumphant music, rain, and aggressive speech — IS the methodology this product runs in inverse. The same person who shipped the forward direction is running the reverse. Founder-market-fit and methodology-credibility are the same artifact. Junsoo owns the brain JSON pipeline and the falsification baselines. Jacob orchestrates the K2 swarm. Emilie owns the document UI and launch video. Forty-eight hours."*

---

## Stage operations — the things only the presenter knows

These are the operational beats that do not appear in the deck but determine whether the deck lands.

### Transitions between slides (Round 1)

The deck does not auto-advance. The presenter clicks. Use these one-line bridges so each click feels earned, not procedural.

- **Slide 1 → 2.** *"That message is going to land in three industries today."* (Sets up the three-column problem frame.)
- **Slide 2 → 3.** *"So what is the missing layer."* (Question, no question mark — declarative.)
- **Slide 3 → 4.** *"Here is how it works, end to end."* (Architecture grounds the headline.)
- **Slide 4 → 5.** *"And here is the moment that matters."* (Cues the hero reveal. Slow down.)
- **Slide 5 → 6.** *"This is the paragraph it produced."* (Hand off to the document. No editorial.)
- **Slide 6 → 7.** *"Why should you trust the paragraph."* (Question form again — sets up Clair de Lune.)
- **Slide 7 → 8.** *"Same engine. Different input."* (LOCKED line. Use as transition AND as the slide-8 anchor.)
- **Slide 8 → 9.** *"For the room we're in — Ironsight."* (Sponsor pivot.)
- **Slide 9 → 10.** *"And the rubric the architecture enacts."* (Best-Use-of-AI lane.)
- **Slide 10 → 11.** *"Built in forty-eight hours by these four."* (Team grounds the claim.)
- **Slide 11 → 12.** *"The architecture is modality-agnostic — which means."* (Vision opens.)
- **Slide 12 → 13.** *"And the close."* (Two words. Then go quiet.)

### Transitions between slides (Round 2)

Tighter — the cuts should feel like a film, not a deck.

- **Slide 1 → 2.** *"Here is the gap."*
- **Slide 2 → 3.** *"Here is what closes it."*
- **Slide 3 → 4.** *"Here it is, running."*
- **Slide 4 → 5.** *"And here is what it produced."*
- **Slide 5 → 6.** *"Why this is real."*
- **Slide 6 → 7.** *"For the room we are in."*
- **Slide 7 → 8.** *"And the close."*

### What to do if the demo crashes mid-pitch

The 90-second demo plays against slides 4–7 in Round 1, slide 4 in Round 2. If it dies:

1. Do not apologize. Do not narrate the crash. Continue speaking the script as if the demo were running.
2. The placeholder MP4 is loaded on a parallel keystroke (presenter remote button 3). Trigger it; keep going.
3. The score-climb chart is statically renderable from `BrainBlock variant="score-climb"`. The deck will hold it on screen even if the live engine has stopped.
4. Defer to the empathy document on slide 6 — it is text, it cannot fail. If everything else is broken, the document is the demo.

### What to do if the demo runs slower than expected

The hero reveal is the score climb. If TRIBE inference lags:

1. Stretch BEAT-1 (problem) and BEAT-2 (architecture) — there is naturally more spoken material than visual material in those slides.
2. When the chart catches up, return to the LOCKED 4-second silence. Do not skip the silence — the silence is the reveal.
3. Never narrate over the silence to fill time. If the chart is still climbing, watch it climb with the audience.

### What to do if a judge interrupts

This is the most common failure mode. Three rules:

1. Answer the question. Do not redirect to the slide. Hostile judges interpret "let me get to that on slide 7" as evasion.
2. Use the Q&A anchor for the slide they interrupted on. Each slide has one. They are designed to satisfy the question and return to the arc.
3. If the question is one of Q-INT-1 through Q-INT-10, deliver the rehearsed answer verbatim. Do not paraphrase under stress.

### How to read the room before the pitch

Identify which sponsor's judges are in the room before slide 7 (the sponsor-slot in Round 2; the closing variant in Round 1).

- Ironside lanyard or hi-vis branding → primary lane, $5K target.
- Listen Labs lanyard → emphasize the iterative-loop-IS-the-simulation framing.
- Sideshift lanyard → emphasize the consumer overlay and "user owns the data."
- YC partner badge → emphasize the BCI-transition TAM and "design pattern before the cognitive interface becomes invisible."
- Best-Use-of-AI judging panel → emphasize slide 10 YEA/NAY rubric; the architecture-enacts-the-rubric line is the closer.

If the room is mixed, default to Ironside primary and reference the others in slide 8 (two-scenarios).

---

## Pavilion conversation flow — the 5-minute walk-up

Pavilion conversations are not pitches. They are interviews. The judge or sponsor wants to probe; the presenter wants to land one kill-line and one credibility chip per minute. Target structure:

- **Minute 1.** Open with the generic 30s pitch. Do not customize yet — wait for them to tell you what they care about.
- **Minute 2.** Ask one question: *"What problem brings you to this pavilion?"* Their answer determines which 30s variant lands next.
- **Minute 3.** Deliver the matching 30s variant (Ironsight / Listen Labs / Sideshift / YC). End with the kill-line for that lane.
- **Minute 4.** Show the empathy document on the laptop — the printed paragraph, the falsification number. Let them read it. Stay quiet.
- **Minute 5.** Close with the methodology chip: *"Same loop that produced our 90.4% Clair de Lune match, run in reverse."* Then offer the GitHub link or the Devpost.

Do not pitch a roadmap. Do not list features. The whole point of the empathy layer is that one paragraph carries more information than ten bullet points — let the architecture of the pitch enact the architecture of the product.

---

## Voice and delivery — the things drama school teaches

These are not stylistic preferences. They are load-bearing.

### Pace

- Slide 1: medium. The opening sentence should feel inevitable, not rushed. ~150 words/minute.
- Slide 2: faster. Indignation has tempo. ~170 wpm.
- Slide 3: slow. The headline lands once. ~120 wpm.
- Slide 4: medium-fast. Architecture is dense; do not linger. ~180 wpm.
- Slide 5: medium, with the 4-second silence cut in. The silence is part of the pace.
- Slide 6: SLOW. The paragraph lines need air. ~110 wpm with two 2-second pauses.
- Slide 7: medium. Credibility lands without flourish. ~150 wpm.
- Slides 8–12: medium. ~150 wpm.
- Slide 13: slow. The kill-lines need to ring. ~110 wpm.

### Pitch (voice register)

- Drop the voice on every kill-line. Up-talk reads as uncertainty; the LOCKED lines need bottom-of-the-chest weight.
- Especially: *"she held space"* drops a full step. *"the corner-cut doesn't happen"* drops a full step.
- *"Humans are not machines"* is the only line in the pitch that the presenter delivers with eye contact directly into a judge's face. Pick one in the front row at slide 1; return to that judge at slide 13.

### Silence

The pitch has three load-bearing silences:

1. **Slide 5, 4 seconds, between *"plateau or 8 rounds, we stop"* and *"Round one: 0.42."*** This is the hero reveal. The chart climbs without narration. Rehearse the count cold — four seconds feels like an eternity on stage; it is not.
2. **Slide 6, 2 seconds after *"she held space."*** The paragraph lands. Do not move to the next sentence until the room has finished the silent breath.
3. **Slide 13, 1 second between the two LOCKED kill-lines.** The thesis line lands last; it lands cleaner with one beat of air before it.

If the presenter rehearses anything in the 24 hours before stage, rehearse the silences.

---

## Cross-references

- `caltech/pitch-story-v3-next-level.md` — voice canon, LOCKED lines, kill-line glossary §7
- `caltech/pitch-deck/PITCH-STORY.md` — handoff brief (parallel agent maintains)
- `caltech/pitch-deck/app/round-1/page.tsx` — Round 1 slide IDs and on-screen content
- `caltech/pitch-deck/app/round-2/page.tsx` — Round 2 slide IDs and on-screen content
- `caltech/architecture-overview.md` — engine architecture, forbidden-claim list §6
- `_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md` §4.4 — canonical TRIBE numbers
- `_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md` §5 — forbidden-claim discipline
- `caltech/research-context/007-johnny-public-corpus-tribe-posts.md` — Clair de Lune precedent

---

## Final-pass checklist (Saturday 6 PM lock)

- [ ] LOCKED kill-lines verified verbatim against v3 §7 glossary across all 21 slides
- [ ] Slide IDs verified against `app/round-1/page.tsx` and `app/round-2/page.tsx` (no drift)
- [ ] Forbidden-claim sweep — no "she felt grief," no "clinical," no sub-second, no population-norm
- [ ] Sarah/Lisa healthcare scenario load-bearing in master cut; construction reserved for Ironside swap
- [ ] BEAT-3 4-second silence rehearsed cold (rehearse it; do not improvise it)
- [ ] §9 honesty paragraph rehearsed cold for Q-INT-1
- [ ] Sponsor-slot 7 sentence rehearsed for all four pavilions
- [ ] Stage timing — Round 1 lands 4:45–5:00; Round 2 lands 2:55–3:00
- [ ] Transition lines memorized for both rounds
- [ ] Demo-crash recovery rehearsed (placeholder MP4 keystroke verified)
- [ ] Pavilion 5-minute walk-up flow practiced cold for all four sponsors
- [ ] All three load-bearing silences rehearsed with a stopwatch
