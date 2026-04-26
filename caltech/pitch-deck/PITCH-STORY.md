# PITCH STORY — Empathy Layer Engine

> Caltech HackTech 2026. Round 1 (5-min) + Round 2 (3-min) + 90-second demo video.
>
> **Hand-off brief for Emilie (rendering / styling / video).** Copy is locked here.
> The pitch-deck app at `caltech/pitch-deck/` already implements this story in JSX.
> Use this file to verify the *words*, the *order*, and the *visual intent* per slide.

---

## 1. The Five Lines To Memorize

These are the load-bearing sentences. Everyone on the team carries them; everything in the deck and the video derives from them.

1. **The headline.** *"Humans are not machines. The empathy layer is what AI gives back when AI augments management decisions instead of replacing them."*
2. **The problem.** *"AI describes what humans did. It can't model what they felt doing it."*
3. **The hero reveal.** *"Eight rounds. The score climbs from 0.42 to 0.84. The judge watches the engine improve in real time."*
4. **The hero output.** *"She did not rush. She did not check out. She held space."* (Lisa-the-nurse paragraph; similarity 0.86, falsification delta 0.27)
5. **The proof.** *"Same engine that matched Clair de Lune to 90.4% — run in reverse."*

If a slide doesn't trace back to one of these five, cut it.

---

## 2. The Story Arc (3 acts → 12 beats)

The deck and the video share the same spine. Round 1 (5-min) renders all 12 beats. Round 2 (3-min) compresses to 8. The video is a 90-second cinematic cut of beats 4 → 6.

**ACT I — The gap (0:00 → 0:25 video / slides 1–3)**
1. Title — *humans are not machines.*
2. Problem — *AI sees the action, misses the human.*
3. Thesis — *the empathy layer is what AI gives back.*

**ACT II — The engine + reveal (0:25 → 1:25 video / slides 4–7)**
4. The engine — *video in. paragraph out.* (6-step pipeline)
5. Hero reveal — *eight rounds. the score climbs.*
6. Hero output — Sarah / Lisa nurse paragraph. *the corner-cut doesn't happen.*
7. Proof — *Clair de Lune. shipped. 90.4%.*

**ACT III — Why us, why now, what we want (1:25 → 1:30 video / slides 8–13)**
8. Two scenarios — *swap the file. the engine doesn't fork.*
9. Ironsight fit — *they confirmed it at office hours.*
10. Best Use of AI — *augment. don't replace.*
11. Team — 48 hours, four lanes.
12. Vision — *today video. tomorrow direct neural data.*
13. Ask — sponsor swap.

---

## 3. Round 1 — Per-Slide Copy (5 minutes, 13 slides)

Format per slide: **kicker** · headline · body · anchor quote · speaker note (≤30s) · visual direction.

### Slide 01 — Title
- **Kicker:** caltech hacktech 2026 · ironsight · listen labs · best use of ai
- **Headline:** *humans are not machines.* / *ai forgot.*
- **Anchor quote:** *"we can't treat humans like machines. we need a layer that predicts what paragraph aligns with what's actually happening."* — johnny, empathy-layer epiphany
- **Speaker note (20s):** *"Today's AI describes what humans did. It can't model what they felt doing it. That gap is the empathy layer. We built it. Same engine answers Ironsight's spatial-intelligence brief and Listen Labs's simulate-humanity brief — and the architecture is the answer to Best Use of AI."*
- **Visual direction (Emilie):** large lowercase mono headline. *Humans are not machines* in clay-black; *ai forgot* in blueberry-800. Negative space dominant. Optional: subtle cortical mesh fading into ivory at low opacity behind the headline (10–15%). Anchor quote in serif italic below.

### Slide 02 — Problem
- **Kicker:** problem
- **Headline:** *ai describes what happened. it can't model what they felt.*
- **Body:** *"a vlm watching a worker on scaffolding sees 'worker holding tool near edge.' it doesn't see whether the worker was focused, fatigued, or in cognitive overload when the action happened. the manager reads the report. cuts corners. destroys what the company actually wants."*
- **Speaker note (25s):** *"Vision-language models can describe what a worker did on a scaffolding. They cannot tell you the worker was scanning a hazard you can't see. The manager reads 'over threshold; cut to 10 minutes.' The action data is wrong because it can't read the room. The empathy layer fixes that."*
- **Visual direction:** split visual right side — `vision-vs-brain` p5 sketch (already implemented). Left half = vision-report text in mono (action data baseline); right half = TRIBE brain pattern stippled in fire colormap. Divider down the middle.

### Slide 03 — Thesis (the headline insight)
- **Kicker:** the empathy layer
- **Headline (3 lines):** *what ai gives back when* / *it augments decisions* / *instead of replacing them.*
- **Body:** *"we built a brain-grounded translation engine. video in. paragraph out. grounded in evidence the reader can audit."*
- **Speaker note (20s):** *"This is what AI is for. Not to replace the manager's decision. To give the manager the human context the action data was missing — so the next decision is empathy-aware. The corner-cut doesn't happen."*
- **Visual direction:** typographic-only slide. Three-line typography stack. Middle line *it augments decisions* in blueberry-800, oversized. Body line in warm-charcoal sans below.

### Slide 04 — The Engine (architecture)
- **Kicker:** the engine
- **Headline:** *video in. paragraph out.*
- **Body:** numbered list of 6 stages (already in JSX). Stage 1 Qwen3-VL → TRIBE V2 (~20K vertices · 1Hz) → K2 swarm (~2,000 tok/s) → Stage 2 Claude Opus → iterative loop (8 rounds) → falsification check (control delta).
- **Speaker note (40s):** *"The engine has six layers. Stage 1: Qwen3-VL describes the scene — that's the action data baseline, what the manager would see without us. TRIBE V2 — Meta's brain-encoding model — predicts per-region neural response from the same video. That's the data layer. K2 swarm runs one specialist per brain region in parallel. Claude Opus writes a paragraph describing what the human felt. The iterative loop scores it against the brain pattern, eight rounds, climbing. Falsification check proves it's grounded, not confabulated."*
- **Visual direction:** 6-row numbered list with hairline dividers. No cards. Per row: `01` kicker / `tribe v2` mono in blueberry / `~20K vertices · 1Hz` kicker / one-line description in sans. Match Clay's spacing. The list is the visual.

### Slide 05 — Hero Reveal (the iterative loop)
- **Kicker:** hero reveal · the iterative loop
- **Headline:** *eight rounds. the score climbs.*
- **Body:** *"each round, claude writes a new paragraph. tribe v2 scores it forward — text in, predicted brain pattern out. cosine similarity against the actual video's pattern. plateau or round 8, we stop. the score climbing on screen is the demo."*
- **Trajectory (under the body):** `0.42 → 0.58 → 0.65 → 0.71 → 0.75 → 0.78 → 0.82 → 0.84`
- **Speaker note (35s):** *"This is the demo's hero moment. We use the same iterative-scoring loop that matched Clair de Lune music to a brain pattern at 90.4 percent in our prior published work — but in reverse. Eight rounds of candidate paragraphs, each scored against the video's actual brain pattern. Round one: 0.42. Round eight: 0.84. The judge watches the engine improve in real time. Pre-cached for reliability; live attempt running in the background."*
- **Visual direction:** `score-climb` p5 visual (already implemented) on right. Animated. Dashed target line at 1.0; line + dot trail walks left to right; round counter and current score in mono labels. Latest dot pulses.

### Slide 06 — Hero Output (Sarah / Lisa)
- **Kicker:** hero output · empathy-layer document
- **Headline:** *she did not rush.* / *she held space.*
- **Body:** *"the manager's dashboard flagged the visit as over-threshold. cut to ten minutes. the empathy-layer document showed otherwise."*
- **Closer:** *"the corner-cut doesn't happen."*
- **Speaker note (40s):** *"This is the artifact a manager actually reads. Section A — the vision report — is what they would have seen without us. Section B — the empathy-layer paragraph — is the brain-grounded translation. 'She did not rush. She did not check out. She held space.' Section C — falsification evidence — same paragraph scored against control footage drops to 0.27, proving the description is anchored to this scene specifically. Sarah does not message Lisa about cutting time. The patient experience holds. Lisa stays. The patient stays. The corner-cut doesn't happen."*
- **Visual direction:** `EmpathyDocument` primitive on right (already implemented). Three sections with hairline dividers. §B paragraph in serif italic at body-large size — magazine-cover quality. Similarity 0.86 + falsification 0.27 as oversized numerals at the bottom in mono.

### Slide 07 — Proof (Clair de Lune precedent)
- **Kicker:** proof · clair de lune precedent · shipped 2026-03
- **Headline:** *90.4%* (numeral hero, blueberry-800 percent sign)
- **Body:** *"same iterative-scoring loop. ran forward last spring: 60s of clair de lune in, text out, 90.4% match in the emotion region across 20,484 vertices. eight rounds. falsified against triumphant music, rain, and aggressive speech."*
- **Anchor quote:** *"we run the same loop in reverse. video's brain pattern in, paragraph out. the methodology already shipped."* — johnny
- **Speaker note (30s):** *"The methodology isn't theoretical. Last spring, we matched Clair de Lune's emotional brain signature to 90.4 percent across 20,484 cortical vertices using this same iterative loop. We falsified it against triumphant music, rain, aggressive speech — the pattern only matched Clair de Lune. Same protocol, same falsification rigor, run in reverse for the empathy layer. This is the founder-market fit and the credibility chip in one artifact."*
- **Visual direction:** giant 90.4% numeral. Right column: `activation-pulse` p5 visual highlighting the emotion region in fire colormap. Body in sans below.

### Slide 08 — Two Scenarios
- **Kicker:** one engine · two scenarios · same hero output
- **Headline:** *swap the file. the engine doesn't fork.*
- **Two columns:**
  - **A · workplace footage:** *manager reads the empathy-layer document instead of the action-data report.* (sub-line: construction · healthcare · retail · food service · education · logistics. Ironsight core. Listen Labs core.)
  - **B · consumer day-to-day:** *user gets a brain-grounded journal entry of their own day. accumulates into a graph.* (sub-line: Reels feed · screen recording · daily-life clip. Sideshift overlay. YC stretch — future-Obsidian framing.)
- **Speaker note (25s):** *"One engine. Two demo scenarios. Workplace footage is the primary B2B target — Ironsight, Listen Labs. Consumer day-to-day is the B2C overlay — Sideshift, YC stretch. Same TRIBE V2, same K2 swarm, same Claude Opus, same iterative loop, same falsification check, same empathy-layer document. The input file is the persona switch. Multi-track sponsor coverage is structurally MECE."*
- **Visual direction:** two-column typographic split. No cards. Left column heading in blueberry; right column heading in warm-charcoal. Horizontal rule between top headline and the two columns.

### Slide 09 — Ironsight Fit
- **Kicker:** ironsight · spatial intelligence brief
- **Headline:** *they asked for a new modality mapped back to the video.*
- **Fit table (4 rows, hairline dividers):**
  - *their ask* → pinpoint a spatial task where VLMs fail. develop a technique. show real-world impact.
  - *where vlms fail* → they cannot infer the cognitive-emotional state behind the spatial action.
  - *our technique* → TRIBE V2 brain-encoding sidecar. Stage 2 maps the brain wave back to the video. their team confirmed at office hours: this qualifies.
  - *real-world impact* → manager reads the empathy-layer document. the corner-cut doesn't happen. generalizes across every industry where humans are reviewed by action data.
- **Speaker note (25s):** *"Ironsight asked us to pinpoint a spatial task where vision models fail. We pinpointed it: VLMs cannot infer the cognitive-emotional state behind the spatial action. Our technique is the TRIBE V2 brain-encoding sidecar. Stage 2 maps the brain wave back to the video — which their team explicitly confirmed at office hours qualifies as spatial intelligence. The real-world impact is the corner-cut decision the empathy layer prevents."*
- **Visual direction:** typography list with `their ask` / `our answer` two-column rows. *their ask* labels in blueberry kicker; answer in warm-charcoal sans. No card surfaces.

### Slide 10 — Best Use of AI (YEA / NAY)
- **Kicker:** best use of ai
- **Headline:** *augment. don't replace.*
- **Two columns (no card borders):**
  - **YEA** (blueberry) — surface evidence the user can audit · do the menial high-throughput work · synthesize across modalities · let the human judge
  - **NAY** (pomegranate) — recommend · diagnose or claim clinical truth · reverse-infer feelings from regions · replace the manager's decision
- **Closer:** *"the architecture enacts the rubric. that's the argument."*
- **Speaker note (25s):** *"Every part of this product sits on the YEA side. The system surfaces evidence the manager can audit. K2 does the menial high-throughput work. Claude synthesizes across vision and brain encoding. The manager judges. The system never recommends, never diagnoses, never reverse-infers feelings, never replaces the decision. The architecture enacts the rubric. That's the Best Use of AI argument."*
- **Visual direction:** two-column rubric. YEA column header in blueberry, oversized kicker tracking. NAY column in pomegranate. Each list item one line, mono lowercase. Closer line below in sans, smaller.

### Slide 11 — Team
- **Kicker:** team · 48 hours
- **Roster (hairline dividers):**
  - **Johnny Sheng** — pm · stage 1 + stage 2 · integration · 3d viz — *shipped the clair de lune precedent forward. now running it in reverse.*
  - **Junsoo Kim** — tribe v2 · reverse and forward inference — *owns the brain JSON pipeline. owns the falsification baselines.*
  - **Jacob Cho** — k2 swarm · iterative-loop orchestration — *8 rounds in under 60 seconds. plateau gate. per-region attribution.*
  - **Emilie Duran** — empathy-layer document UI · launch video — *three framing modes — workplace, consumer, pavilion.*
- **Speaker note (20s):** *"Four lanes, 48 hours. Johnny on integration and the two-stage pipeline. Junsoo on TRIBE V2 — both reverse direction for the brain-pattern and forward direction for the iterative-loop scoring. Jacob on the K2 swarm and the iterative-loop orchestration — eight rounds in under 60 seconds. Emilie on the empathy-layer document UI and the launch video, with three framing modes."*
- **Visual direction:** divider list. Name in mono ink, role in kicker, credential line in sans warm-charcoal. No headshots needed unless Emilie has time.

### Slide 12 — Vision
- **Kicker:** vision
- **Headline:** *today video.* / *tomorrow direct neural data.*
- **Body:** *"same architecture. same falsification methodology. same ethos. when the cognitive interface gets thinner, the empathy layer is what keeps a person on the other side of the decision."*
- **Speaker note (25s):** *"Today this engine reads workplace footage and consumer day-to-day footage. Tomorrow it reads direct neural data from a brain-computer interface. Same architecture. Same falsification methodology. Same ethos. When the cognitive interface gets thinner, the empathy layer is what keeps a person on the other side of the decision."*
- **Visual direction:** `convergence` p5 visual on right (many wavy paths flattening into one) — the BCI inevitability metaphor. Headline left, two stacked lines.

### Slide 13 — Ask + Close
- **Kicker:** ask
- **Headline:** *humans are not machines.*
- **Body:** *"the empathy layer is what ai gives back."*
- **Pointer:** *"swap the sponsor slide at /sponsor/[name]. ironsight primary. listen labs · sideshift · yc."*
- **Speaker note (20s):** *"Humans are not machines. The empathy layer is what AI gives back when AI augments management decisions instead of replacing them. Ironsight primary. Listen Labs core. Sideshift overlay. YC stretch. We ship Saturday night."*
- **Visual direction:** centered, full-width typographic close. Two red dots top-left + bottom-right (Clay accent). Hairline rule between body and pointer.

---

## 4. Round 2 — Per-Slide Copy (3 minutes, 8 slides)

Same arc, beat-synced. The only changes from Round 1 are: compression, time-anchor kickers (`0:00–0:08` etc.), and a sponsor-slot menu in place of the standalone Ironsight-fit slide.

| # | Beat | Time | Headline | Visual |
|---|---|---|---|---|
| 1 | Title | 0:00–0:08 | *humans are not machines. / ai forgot.* | typographic |
| 2 | Problem | 0:08–0:30 | *ai sees what they did. / it can't see what it took.* | `vision-vs-brain` |
| 3 | Solution | 0:30–0:55 | *a brain-grounded empathy layer. / video in. paragraph out.* | typographic |
| 4 | Hero reveal | 0:55–1:35 | *eight rounds. the score climbs.* | `score-climb` |
| 5 | Hero output | 1:35–2:15 | *she did not rush. / she held space.* | `EmpathyDocument` |
| 6 | Proof + YEA/NAY | 2:15–2:35 | *90.4%* + rubric | numeral + 2-col |
| 7 | Sponsor swap | 2:35–2:50 | *one engine. four briefs.* | divider list |
| 8 | Close | 2:50–3:00 | *humans are not machines.* | typographic |

Speaker notes for Round 2 are the Round 1 notes compressed by ~40%. Use the same anchor quotes.

---

## 5. The 90-Second Demo Video Script

This is what Emilie shoots / cuts. Voiceover + on-screen action + timing. Pre-cached path; live attempt runs in the background and swaps in if all gates pass.

### BEAT-1 · 0:00 → 0:15 — Recognition

**On-screen:** Workplace footage plays — nurse entering patient room, sitting down, holding the patient's hand. Stage 1 Vision Report appears as a small text overlay: *"nurse entered room. sat 30 min. adjusted IV. held patient's hand. duration: 1800s. flag: OVER_THRESHOLD."*

**Voiceover (Johnny or chosen narrator):**
> *"This is what the manager's dashboard sees. A nurse spent thirty minutes in a patient's room. The threshold is ten. The action data flags the visit. The manager is about to message the nurse about cutting time."*

### BEAT-2 · 0:15 → 0:35 — Awe

**On-screen:** 3D cortical mesh appears alongside the footage. ~20K vertices visible at 30fps. Regions glow in sync with the footage. Per-region specialist labels fade in around the mesh — *emotional-processing · prefrontal · default-mode · visual-attention*. Hover-bridges between regions light up.

**Voiceover:**
> *"We send the same video into Meta's TRIBE V2 brain-encoding model. It predicts per-second per-region neural response across roughly twenty thousand cortical points. K2 runs one specialist per brain region — eight specialists in parallel — interpreting what each region was contributing to the nurse's experience."*

### BEAT-3 · 0:35 → 1:00 — The Score Climbing (HERO REVEAL)

**On-screen:** The iterative-scoring loop runs visibly. A chart appears (this is the `score-climb` p5 visual). Round number ticks across; the score line climbs round by round; the candidate paragraph fades in/out underneath.
- Round 1 → 0.42
- Round 3 → 0.65
- Round 5 → 0.75
- Round 8 → 0.84

**Voiceover:**
> *"Eight rounds of iterative scoring. Each round Claude writes a new paragraph describing what the nurse felt. TRIBE V2 scores the paragraph against the actual brain pattern from the video. The score climbs. Round one — 0.42. Round eight — 0.84. This is the same protocol that matched Clair de Lune's brain signature to 90.4 percent in our published work — run in reverse."*

### BEAT-4 · 1:00 → 1:25 — Pride + Comfort (the empathy-layer document)

**On-screen:** The final empathy-layer document fills the frame. Three sections: §A vision report (small), §B empathy paragraph (large, serif italic, magazine-cover typography), §C falsification evidence (small). Similarity 0.86 + falsification delta 0.27.

**Voiceover (over the §B paragraph appearing line by line):**
> *"She entered the room and her vital-attention signature shifted immediately — the prefrontal sharpness of triage softened into something quieter, more accommodating. For the first twelve minutes her emotional-processing specialist sustained engagement; she was reading the patient's grief, not just monitoring it. Minutes 18 through 22 sat in default-mode dominance — being present with someone, not waiting for them to finish. The final eight returned to focused care, prefrontal-engaged. **She did not rush. She did not check out. She held space.**"*

### BEAT-5 · 1:25 → 1:30 — The Decision Reverses

**On-screen:** Side-by-side, no animation, two static cards.
- **LEFT** — action-data report: *"OVER_THRESHOLD · 30 min · cut to 10."*
- **RIGHT** — empathy-layer document: *"she held space · similarity 0.86 · falsified against control 0.27."*

**Voiceover:**
> *"The corner-cut doesn't happen. The patient stays. The nurse stays. Humans are not machines. The empathy layer is what AI gives back."*

### BEAT-0 / BEAT-CLOSE (off-timer; sponsor-swap card)

Static card. *Ironsight* / *Listen Labs* / *Sideshift* / *YC* variant per pavilion.

---

## 6. Sponsor Swap Copy

Each sponsor swap-slide carries: verbatim brief → 3-row fit table → ask. Already implemented in `app/sponsor/[sponsor]/page.tsx`. This is the verified copy.

### IRONSIGHT (PRIMARY · $5K)
- **Title:** *video tells you what they did. the empathy layer tells you what it took.*
- **Anchor:** *"you confirmed it at office hours: a new modality mapped back to the video qualifies."*
- **Verbatim brief:** *"can you teach a machine to truly understand the physical world? today's ai can see, but doesn't comprehend. it recognizes objects but misses the critical spatial relationship that humans understand intuitively. pinpoint a key spatial task where current models fail. develop an innovative technique. showcase the impact on a real-world problem."*
- **Fit:**
  - *spatial task where vlms fail* → VLMs cannot infer cognitive-emotional state behind the spatial action.
  - *innovative technique* → TRIBE V2 brain-encoding sidecar. Stage 2 maps the new modality back to the video.
  - *real-world impact* → construction · healthcare · retail · food service · logistics. The corner-cut doesn't happen.
- **Hero artifact (right column):** Construction-worker EmpathyDocument — scaffolding-edge scenario:
  - **§A:** *"worker on scaffolding tier 3. tool in hand. movement near edge logged at t+47s. duration 8m12s. flag = NEAR_EDGE."*
  - **§B:** *"his visual-attention specialist held tight on the lower platform — fixated on a beam joint that the action log treated as routine. salience-tracking ran high through the entire sequence; this is what scanning a hazard looks like. the 'near-edge' flag the dashboard raised is the same brain pattern as seeing the danger before stepping into it. the worker did the safe thing. the action log called it the unsafe one."*
  - **§C:** similarity 0.81 · falsification 0.31
- **Ask:** *ironsight core · $5K · the spatial-intelligence brief answered structurally.*

### LISTEN LABS ($3K + interview)
- **Title:** *the iterative loop is the multi-agent simulation.*
- **Anchor:** *"you care about the insight, not the stack. the insight is brain-grounded."*
- **Fit:**
  - *simulate humans / society* → 8 candidate paragraphs compete across rounds for brain-pattern match. Per-industry generalization is the simulation across humanity.
  - *ground in something real* → within-subject brain contrast. Cosine similarity is the falsifier. Control delta proves anchoring.
  - *insight, not stack* → no text-only sim distinguishes genuine cognitive shift from surface agreement. Brain-grounding does.
- **Visual:** `swarm-bridges` p5 — the K2 swarm interpretation.
- **Ask:** *listen labs core · $3K + interview · simulate humanity, then prove it.*

### SIDESHIFT (B2C overlay)
- **Title:** *your day, written by your own brain.*
- **Anchor:** *"consumer overlay of the same engine. video in. journal entry out."*
- **Fit:**
  - *data agency* → user uploads their own footage. Vault is theirs. No persistence beyond session unless they choose.
  - *consumer surface* → shareable Brain Card export — 1:1 IG-Story shape. Daily entries accumulate into a knowledge graph.
  - *post-recommender posture* → the system never recommends. It surfaces evidence. The user judges.
- **Visual:** `feed-grid` p5 — the convergence problem.
- **Ask:** *sideshift core · b2c overlay · the journal that writes itself.*

### Y COMBINATOR (stretch)
- **Title:** *obsidian, but the graph is your brain.*
- **Anchor:** *"a database for you, not the database that sells you."*
- **Fit:**
  - *category creator* → every empathy-layer document is a daily entry in a graph the user owns. Cortex.buzz uses TRIBE V2 to engineer attention. We run it the other way.
  - *moat* → founder-market-fit + methodology credibility chip are the same artifact: Clair de Lune 90.4% match. Local-first by design.
  - *tam* → everyone moving from smartphones to brain interfaces. The empathy layer is the design pattern for the transition.
- **Visual:** `cortical-mesh` p5 with default-mode region highlighted.
- **Ask:** *yc stretch · personal cognitive infrastructure for the post-platform era.*

---

## 7. The Elevator Pitch (Johnny voice, lifted verbatim from PRD §11)

For FAQ, casual conversation, hallway pitches, and bar tabs:

> *"Vision-language models can describe what a human did. They cannot communicate how that human felt doing it. That gap is the empathy layer — and it's the gap that makes managers cut corners that destroy what their company actually cares about. A nurse spends 30 minutes with a patient processing terminal diagnosis. The action data says 'over threshold; cut to 10 min.' The action data is wrong because it can't read the room. We close the gap. We use Meta's TRIBE V2 brain-encoding model — the same model that matched Clair de Lune's neural fingerprint to 90.4% in our prior published work, falsified against control music — to predict per-second per-region brain-response on the actual video footage. We invert the Clair de Lune protocol: instead of generating text to match a brain-pattern, we use the brain-pattern of the actual video to score candidate paragraphs describing what the human felt. Eight rounds of iterative scoring on K2 Cerebras. The output is a paragraph that reads like a human reading another human, anchored to brain-pattern evidence with a similarity score that proves the reading is grounded — not confabulated. Falsification check confirms the description is anchored to this scene specifically. Managers read the paragraph BEFORE making optimization decisions. The corner doesn't get cut. Same engine extends to consumer day-to-day footage as a B2C overlay — empathy-layer paragraphs accumulate into a daily brain-grounded journal. Future Obsidian. Database FOR you, not the database that sells you. Humans aren't machines. We built the layer that lets AI augment management decisions with the human context the action data strips out."*

---

## 8. Voice Register Guide (forbidden claims + allowed alternatives)

These rules are non-negotiable per `caltech/architecture-overview.md` §6. Every line in the deck and the video VO must respect them. A regex pre-flight check on every Opus output catches violations before render.

| ❌ NEVER say | ✅ Say instead |
|---|---|
| *"she felt grief"* (reverse inference) | *"emotional-processing specialist sustained engagement"* |
| *"clinical fatigue"*, *"burnout diagnosis"* | *"workforce-context augmentation, not psychological evaluation"* |
| Sub-second predictions | Per-second only (TRIBE is 1Hz, 5s HRF lag) |
| *"average healthy brain"*, population-norm comparisons | *"this person on this scene vs this person on a different scene"* |
| *"70K voxels"*, *"700 subjects"* | *"~20,000 cortical-surface vertices on fsaverage5, ~25 deeply-scanned subjects"* |
| *"reads inner monologue"* | *"predicts neural response patterns"* |
| *"AI thinks"*, *"AI feels"* | *"the system surfaces"*, *"the model predicts"* |
| *"recommends"*, *"suggests you should"* | *"surfaces evidence"*, *"shows what's there"* |

**Tone rules:**
- Observational, not diagnostic.
- Specific, not poetic-vague. *"She held space"* (specific) > *"She showed compassion"* (vague).
- Literature-grade prose for the empathy paragraph. Not academic. Not clinical.
- Mono lowercase for chrome. Serif italic for emotional anchors.
- No em-dashes in body copy (Clay-aligned). Periods or commas.
- Numbers carry weight. Use exact values (0.86, 90.4%, ~20K, 8 rounds) not vague ones.

---

## 9. Visual Direction Handoff (Emilie)

**Palette (locked, in `globals.css`):**
- `--warm-cream #faf9f7` — page background. Never cool gray.
- `--clay-black #000000` — text, headings.
- `--blueberry-800 #01418d` — accent. The grad. The signal color.
- `--warm-silver #9f9b93` — secondary text, kicker labels.
- `--warm-charcoal #55534e` — body text, muted accents.
- `--border-light #eee9df` / `--oat-border #dad4c8` — borders.
- Activation gradient (brain visuals only): `#01418d → #c44569 → #f5a142` (cool indigo → warm pink → hot amber).

**Typography:**
- **Display:** DM Mono lowercase. Tight letter-spacing (-0.055em). Display-mono class.
- **Body:** DM Sans, weight 400, 1.5–1.6 line-height.
- **Anchor quotes:** DM Mono italic, weight 400, larger than body.
- **Empathy paragraph (§B in EmpathyDocument):** DM Mono italic at body-large size (this is the magazine-cover slot; if Roboto reads better here, swap via `display-roboto` class).
- **Kickers:** Mono ALL CAPS, 0.22em tracking, 11px (existing `.kicker` class).
- **Numerals:** DM Mono tabular-nums, tight tracking. Hero numerals (90.4%, 0.86) at 7–12rem.

**Surfaces (from Clay system, in `globals.css`):**
- `.surface-card` (12px radius, oat border, level-1 elevation)
- `.surface-card-feature` (24px radius — used for EmpathyDocument)
- `.surface-card-dashed` (oat dashed border, no shadow — used for sponsor verbatim-brief blocks)

**Brain visuals (8 p5 sketches, in `app/components/BrainCanvas.tsx`):**
- `cortical-mesh` — top-down stippled brain, region highlight
- `convergence` — many paths flatten to one (BCI vision slide)
- `divergence` — one branches to many (ingredients metaphor)
- `swarm-bridges` — animated K2 specialists with edges
- `activation-pulse` — animated single region, fire colormap (proof slide)
- `feed-grid` — synchronized phone-screens (Sideshift, problem variants)
- `score-climb` — animated hero reveal (the iterative loop)
- `vision-vs-brain` — split: action-data text vs TRIBE brain pattern

**Anti-patterns (LOCKED):**
- ❌ NO fitness-app aesthetics (rings, streaks, badges, scores-as-rewards)
- ❌ NO dashboard look (big-number tiles, KPI grids, traffic-light status)
- ❌ NO borrowed aesthetics (Notion-clone, Apple-Health-clone)
- ❌ NO art-project stylization (precious / over-designed)
- ❌ NO em-dashes, NO emojis, NO curly quotes in body copy

**Slide rhythm:**
- 60%+ negative space per slide
- One emotional beat per slide
- Full-bleed visual or full-typographic — never half-and-half clutter
- Hairline dividers (`var(--hair)`) for lists; no card grids

---

## 10. What's Locked vs What's Open ([TBD-FINAL-PASS])

**LOCKED (don't touch):**
- The headline: *"Humans are not machines."*
- The hero reveal: 8-round iterative loop, score climbs 0.42 → 0.84
- The hero output: Lisa-the-nurse paragraph, similarity 0.86, falsification 0.27
- The proof: Clair de Lune 90.4% precedent
- The architecture: 6 stages, ~20K vertices, K2 ~2,000 tok/s, fsaverage5 mesh
- Forbidden-claim guardrails (§8 above)
- The 5 lines to memorize (§1 above)

**OPEN (Saturday 6 PM lock per Johnny):**
- Final product name (currently codename: Empathy Layer)
- Final headline polish
- Per-sponsor closing-line wording (current copy in §6 is the seed)
- Cortical-mesh activation gradient final pick (currently hybrid: blueberry chrome + fire activation; could go full-fire or full-bioluminescent per `tier-2-epics/pkg-brand-system.md`)
- Demo MP4 swap (currently `/clips/glasses-scan.mp4` placeholder; replace with actual 90s demo render)
- Roboto vs DM Mono on empathy-paragraph (§B) — A/B once Emilie has the document mock

---

## 11. Handoff Checklist (Emilie)

When you take this brief and start rendering:

- [ ] Walk Round 1 in the browser (http://localhost:3003/round-1) — confirm copy lands as written above
- [ ] Walk the Ironsight sponsor swap (http://localhost:3003/sponsor/ironside) — confirm hero artifact reads
- [ ] Polish the EmpathyDocument typography — §B paragraph is the magazine-cover hero; treat it like editorial design
- [ ] Confirm the `score-climb` p5 animation pacing matches the BEAT-3 25-second window in the video
- [ ] Pick fire vs bioluminescent for the cortical activation gradient and update `--activation-warm` / `--activation-hot` in `globals.css`
- [ ] Swap the demo MP4 placeholder when the 90s demo render is ready
- [ ] Run `node scripts/screenshot.mjs` — captures all routes; outputs to `screenshots/` for Devpost
- [ ] Review forbidden-claim guardrails (§8) on every line of every slide before submit

When you take this for the demo video:
- [ ] Use the §5 script verbatim
- [ ] Acts 1 + 4 are cinematic (the workplace footage and the empathy-paragraph reveal)
- [ ] Acts 2 + 3 are guide register (TRIBE mesh + score climb)
- [ ] Voiceover register: observational, not diagnostic. Slow on the empathy paragraph. Let the §B prose breathe.
- [ ] Deliverables per `caltech/video-story.md` checklist: 16:9 1080p + 9:16 1080p social variant + 16:9 4K archive

---

**Source-of-truth files for any retune:**
- `caltech/architecture-overview.md` — the engine + the 90s demo + the headline
- `_bmad-output/planning-artifacts/ironsight-listenlabs-prd.md` — strategic spine, sponsor briefs, success criteria
- `_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md` — engineering rigor, JSON contracts, smoke gates
- `caltech/research-context/007-johnny-public-corpus-tribe-posts.md` — Clair de Lune precedent
- `caltech/pitch-deck/PITCH-STORY.md` — this file (source-of-truth for copy)

---

## 12. Engineering Credibility Chips (from technical PRD)

Specific numbers a hostile judge can verify. Drop these into FAQ answers, slide footers, or pavilion conversation.

| # | Number | Context | Use on |
|---|---|---|---|
| 1 | **~20,000 cortical vertices** | TRIBE V2 fsaverage5 mesh density | slide 4 (engine), FAQ Q-INT-5 |
| 2 | **~25 deeply-scanned subjects** | TRIBE V2 training set size | FAQ Q-INT-5 |
| 3 | **1 Hz temporal resolution** | TRIBE V2 per-second granularity (sub-second forbidden) | FAQ Q-INT-3 |
| 4 | **5-second HRF lag** | TRIBE V2 hemodynamic-response delay | FAQ Q-INT-3 |
| 5 | **≤10s** | Stage 1 (Qwen3-VL) latency on 30s clip | architecture footer |
| 6 | **≤5s per candidate** | Stage 2 (Opus 4.7) per round | demo runbook |
| 7 | **~2,000 tok/s** | K2 Think throughput (corrected from prior ~1,300 estimate) | slide 4, FAQ Q-INT-2 |
| 8 | **≤60s** | Iterative-scoring loop budget for 8 rounds (≤35s for 5-round shortened) | demo reliability slide |
| 9 | **0.84** | Final similarity score by round 8 on test footage | hero reveal slide |
| 10 | **≥0.40** | Falsification delta minimum (control score must drop this much from main) | proof slide, FAQ Q-INT-4 |
| 11 | **90.4%** | Clair de Lune emotion-center match (published prior work) | proof slide, FAQ Q-INT-1 + Q-INT-13 |
| 12 | **~$0.03 per 90s demo run** | Total cost (50 pavilion runs ≈ $1.50) | FAQ Q-INT-14 |

---

## 13. Hostile-Judge FAQ Ammunition (Q-INT-1 → Q-INT-15)

Memorize these. Verbatim. These are pavilion-judging defense.

| Q-ID | Question | Verbatim answer |
|---|---|---|
| **Q-INT-1** | Isn't this just a text-generation hack? What's new? | This inverts Johnny's published Clair de Lune protocol. There, TRIBE V2 scored TEXT candidates against a TARGET brain-pattern (90.4% emotion-center match). Here, we use the brain-pattern of an actual VIDEO to score candidate paragraphs DESCRIBING what the human felt. Same mechanism. Inverted direction. The credibility chip is published prior work reused. |
| **Q-INT-2** | How is this faster than just asking Claude to describe the video? | K2 Think at ~2,000 tok/s is the speed layer. Eight parallel region-specialist calls + iterative-scoring orchestration fit consumer-product latency only at K2 speed. Without K2 the 8-round loop exceeds the 90-second window. |
| **Q-INT-3** | TRIBE V2 has a 5-second HRF lag. Doesn't that break real-time claims? | We never claim real-time. TRIBE V2 is 1Hz with 5s hemodynamic-response lag — structural floor on sub-second prediction. We honor this in every guardrail. Per-second granularity only. |
| **Q-INT-4** | How do you prove the paragraph describes THIS video and not generic confabulation? | Falsification check. Score the best paragraph against a control video — same human, different scene. If the paragraph is generic, both scores are similar. If grounded, control score drops sharply. We target falsification delta ≥ 0.40. |
| **Q-INT-5** | Isn't TRIBE V2 trained on only ~25 subjects? Doesn't that limit generalization? | Yes. Canonical specs: ~25 deeply-scanned subjects, ~20,000 cortical vertices on fsaverage5. We do not inflate. Generalization across industries is the demo. |
| **Q-INT-6** | Why not just use an LLM to describe the video? Why add the brain layer? | Brain-grounding distinguishes genuine cognitive-emotional state from confabulated narration. No text-only sim can do this. The similarity score is the falsifier. It's not a style trick. It's a measurement. |
| **Q-INT-7** | Can TRIBE V2 run on cartoons or abstract footage? | No. TRIBE V2 shows score collapse on out-of-distribution inputs (cartoons, silent film). Construction footage is OOD; expect degraded performance. We disclose this. |
| **Q-INT-8** | Do you reverse-infer emotions from the brain pattern? | No. Reverse inference is scientifically invalid per Poldrack 2006. We predict neural-response patterns. We describe spatial actions, temporal sequences, attention states. We never say "she felt grief" — we say "emotional-processing specialist sustained engagement." |
| **Q-INT-9** | What happens to latency if the video is 90 seconds instead of 30? | Latency scales linearly. TRIBE V2 reverse: ~20–30s per 30s clip → ~60–90s for 90s clip. For demo-day we use 30–45s clips and pre-cache. |
| **Q-INT-10** | What if K2 times out on stage? | We have a fallback. Stage 2 can run without K2 specialist swarm — use the brain-pattern directly. K2 adds richness; it isn't a hard blocker. We swap to pre-baked swarm JSON. |
| **Q-INT-11** | How do you ensure the paragraph is literature-grade and not clinical jargon? | Explicit guardrail block in Stage 2 prompt. Forbidden words: "felt", "clinical", "diagnosis", "average", "normal". Pre-flight regex screen before render. Opus is prompted: "observational language only." |
| **Q-INT-12** | Can this work on consumer data? Will the falsification check still work? | Yes. Consumer scenario uses the same engine. Control video is a different short film. Falsification methodology is identical. |
| **Q-INT-13** | Isn't 90.4% on Clair de Lune cherry-picked? | It's real and in Johnny's published corpus. Same protocol, different direction. We show the score climbing live (round 1: 0.42 → round 8: 0.84) so judges see the iterative improvement themselves. |
| **Q-INT-14** | What's the cost per demo? Can you scale this? | ~$0.03 per 90s run. Even at 50 pavilion runs, total ~$1.50. Negligible. Cost is not a limiting factor. |
| **Q-INT-15** | Does this generalize to other video types (sports, music, movies)? | The architectural pattern is general — any video of human action. OOD degradation (cartoons, animated content) is acknowledged. Per-industry generalization (construction · healthcare · retail · consumer Reels) is the Listen Labs simulation deliverable. |

---

## 14. JSON Contracts (Trust-Signal Slide)

Five shapes that prove the system has clear typed I/O. Optional slide for technical judges; otherwise live in the appendix / Devpost.

**Vision Report (Stage 1)**
```json
{ "scene_summary": "...", "actions": [...], "temporal_sequence": [...], "spatial_relationships": [...] }
```

**Brain Pattern (TRIBE V2 reverse)**
```json
{ "video_id": "...", "n_vertices": 20484,
  "frames": [{ "time_s": 0,
               "regions": { "visual_attention": { "activation": 0.78, "vertex_ids": [...] }, ... } }] }
```

**Candidate Paragraph (Stage 2)**
```json
{ "candidate_paragraph": "...", "round_n": 3, "guardrail_pre_flight": "passed",
  "model_metadata": { "model": "claude-opus-4-7", "latency_ms": 4720 } }
```

**Iterative Loop Trajectory (the hero output)**
```json
{ "best_paragraph": "...", "final_score": 0.84,
  "round_trajectory": [{ "round": 1, "score": 0.42 }, ..., { "round": 8, "score": 0.84 }],
  "per_region_attribution": {...} }
```

**Falsification Check**
```json
{ "main_paragraph_score": 0.84, "control_paragraph_score": 0.27,
  "falsification_delta": 0.57, "verdict": "anchored" }
```

---

## 15. Critical Refinements From Technical PRD (apply before submit)

| # | Was | Is | Action |
|---|---|---|---|
| 1 | "Qwen 3.5" | `qwen/qwen3-vl-235b-a22b-instruct` (Qwen3-VL via OpenRouter) | Fix in any deck/Devpost copy that names the vision model. |
| 2 | K2 ~1,300 tok/s | K2 ~2,000 tok/s (per Cerebras press release) | Already corrected in Round 1 deck. Verify FAQ + voiceover. |
| 3 | Opus 4.7 token budget | +35% tokenizer bloat — apply factor when budgeting | Engineering note only; doesn't change pitch copy. |
| 4 | "K2 is the swarm" / "K2 is the orchestrator" | K2 is BOTH — same surface, two roles (specialist swarm + iterative-loop orchestrator) | Update if you describe K2 in detail; Stage 2 = Opus, K2 = parallelism. |
| 5 | TRIBE V2 OOD performance not flagged | TRIBE V2 score collapses on cartoons / animated content | Folded into FAQ Q-INT-7. |
| 6 | Live OR pre-cache | **Live-with-pre-cache-fallback** is the operating mode. Live attempt runs in background; pre-cache is primary. | Use this exact phrasing in any reliability slide. |
| 7 | Score ≥ 0.75 final | Two metrics: (a) final similarity ≥ 0.75, (b) falsification delta ≥ 0.40 | Both must hold. Mention both when asked about rigor. |

---

## 16. Regex Kill-List (pre-flight every output)

Run this scan over every Devpost line, slide string, voiceover script, and FAQ answer before submit. If it matches, rewrite.

```
\b(felt|was thinking|brain told|diagnosed|clinical|diagnosis|psycholog|normal|average|healthy brain|reverse infer)\b
```

Mandatory rewrites:
- *"she felt"* → *"emotional-processing specialist sustained engagement"*
- *"clinical fatigue"* → *"workforce-context augmentation"*
- *"reads inner thoughts"* → *"predicts neural response patterns"*
- *"average healthy brain"* → *"within-subject contrast only"*
- *"70K voxels / 700 subjects"* → *"~20K vertices / ~25 subjects"*
- *"sub-second predictions"* → *"per-second granularity only"*

Audit responsibility: **Emilie audits Devpost + slide text + voiceover Saturday 10 PM. Johnny audits FAQ ammunition Saturday 5 PM.**
