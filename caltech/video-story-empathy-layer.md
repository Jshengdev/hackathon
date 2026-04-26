---
title: "Video Script v2 — Empathy Layer Engine (Optimized for Ironsight + Listen Labs)"
status: production-ready (replaces caltech/video-story.md for the empathy-layer pivot; old file kept as v1 reference)
created: 2026-04-25
codename: Empathy Layer
prior_version: caltech/video-story.md (v1 — Maya-Reels-primary; pre-empathy-layer pivot)
why_optimized: |
  v1 centered on Maya scrolling Reels (B2C primary). The empathy-layer pivot moves
  B2B (Ironsight + Listen Labs combined) to primary; B2C becomes secondary overlay.
  v1's cinematic Acts 1+4 still ship — Maya remains the relatable persona — but the
  hero output changes from the Land card click to the iterative-loop reveal +
  empathy-layer paragraph. This v2 retunes pacing, voiceover, on-screen text, and
  beat structure to land the new hero deliverable.
budget:
  total_runtime_seconds: 180
  cinematic_act_1_persona_setup: 30
  problem_third_option_act_2: 20
  demo_act_3_engine_running: 110
  payoff_close_act_4: 20
production_quality_target: "really strong good voiceover" (Johnny verbatim) — high-production-value, cinematic
references:
  - ./architecture-overview.md (the engine being filmed)
  - ../_bmad-output/planning-artifacts/ironsight-listenlabs-technical-prd.md (technical spec)
  - ../_bmad-output/planning-artifacts/ironsight-listenlabs-prd.md (strategic positioning)
  - ./demo-script.md (90s on-stage demo script — Act 3 source footage)
  - ./video-story.md (v1 reference — kept for cinematic Acts 1+4 continuity)
  - ./research-context/007-johnny-public-corpus-tribe-posts.md (Clair de Lune precedent)
load_bearing_changes_from_v1:
  - hero_output: "Empathy-layer paragraph + similarity score + falsification delta REPLACES the Land card click as BEAT-4 hero"
  - iterative_loop_reveal: "BEAT-3 SHOWS the iterative-loop running visibly — score climbs Round 1 (0.42) → Round 8 (0.84) — this is the demo's emotional climax"
  - persona_dual_track: "Maya (Gen-Z teen) opens + closes Acts 1+4 (universal-relatable); workplace footage drives Act 3 demo (B2B-primary). Maya as the entry-point everyone recognizes; workplace as the load-bearing pitch"
  - vocabulary_lock: "brainrot / data layer / empathy layer / behavior gap / algorithm breaking out argument — locked across voiceover and on-screen text"
  - pacing_retune: "Act 3 expanded from 100s to 110s to give iterative-loop reveal full ~25s of breathing room"
  - conviction_first_universal_opening: |
      v2.2 update — Act 2.1 NO LONGER names sponsors. The problem statement is delivered
      as a UNIVERSAL human gap that hits B2B (workers being managed by action data) AND
      B2C (users reading their own day-to-day from action data alone). The video must
      CONVINCE the audience the problem is real and shared BEFORE they care about the
      solution. Sponsor names live in the FAQ ammunition deck and Devpost — never in the
      launch video opening.

      The 4-second universal montage at 00:30 shows nurse + worker + retail rep + teen +
      delivery driver — five faces of the same problem. On-screen text crystallizes the
      universal claim: "Today's AI can describe what humans did. It can't see what they
      felt while doing it." The nurse demonstration that follows is the SPECIFIC instance
      that earns the universal claim, not the only instance.

      Act 3.5.B montage closer now explicitly spans B2B AND B2C in the voiceover ("Same
      engine runs across [B2B industries]. Same engine runs on a teenager scrolling her
      own feed at home"). The conviction the opening built gets paid off here — the
      single engine demonstrably crosses the worker/user boundary.
canonical_problem_statement_alignment: |
  This script's framing matches the canonical one-size-fits-all problem statement locked
  across the project:
   - _bmad-output/planning-artifacts/ironsight-listenlabs-prd.md frontmatter +
     "One-Size-Fits-All Problem Statement" body section
   - caltech/architecture-overview.md §1 "The Problem in One Paragraph"
   - caltech/use-cases/two-demo-scenarios.md §0 problem statement field
   - caltech/use-cases/empathy-layer-hero-output.md §1 epiphany distilled
  All four canonical sources name the same gap: AI processes the surface but misses the
  model of the human underneath. The video opening lands that gap as a UNIVERSAL human
  problem — not as a sponsor-brief framing. The universal frame is what makes the
  audience care; the sponsor-brief alignment lives in the FAQ + Devpost where it informs
  judges without diluting the pitch.
forbidden_claim_guardrails_load_bearing:
  - No reverse inference (use observational language: "responded to" / "specialist sustained engagement" / "default-mode dominant")
  - No clinical claims ("workforce-context augmentation, not psychological evaluation")
  - No inflated TRIBE numbers (~20K vertices / ~25 subjects only)
  - No sub-second predictions (1Hz with 5s HRF lag)
  - Within-subject contrast only ("same person, different inputs")
---

# Video Script v2 — Empathy Layer Engine

> **180 seconds. Production-ready. Ships with cinematic Acts 1+4 (Maya as universal-relatable entry persona) + Act 3 demo footage of the engine running on workplace footage (the B2B-primary pitch) + Act 4 close on the empathy-layer hero output.** Read in order: §0 overview → §1 one-page treatment → §2-§5 scene-by-scene shoot script → §6 b-roll list → §7 talent direction → §8 sound design → §9 master shot list → §10 delivery.

---

## §0. What Changed From v1 (read this first if you've already seen v1)

| Element | v1 (Maya-Reels-primary) | v2 (empathy-layer-pivot) |
|---|---|---|
| **Primary demo persona in Act 3** | Maya (Gen-Z teen scrolling Reels) | Workplace scenario (healthcare nurse OR construction worker) — the B2B beneficiary; Maya bookends Acts 1+4 |
| **Hero output (BEAT-4 climax)** | Land card click → suggestion card → "we don't recommend" voiceover | Empathy-layer paragraph reveal + similarity score + falsification delta |
| **BEAT-3 visual reveal** | Within-subject toggle (same brain, different input) | Iterative-loop score climbing Round 1 (0.42) → Round 8 (0.84) IS the visual reveal |
| **Sponsor emphasis** | Listen Labs + Sideshift primary; Ironsight + YC overlay | Ironsight + Listen Labs CORE primary ($8K stack); Sideshift + YC overlay |
| **Total Act 3 runtime** | 100s | 110s (give iterative-loop reveal ~25s of breathing room) |
| **Total Act 4 runtime** | 25s | 20s (tighter close; paragraph reads itself) |
| **Vocabulary** | brainrot / algorithm breaking out argument | + empathy layer / data layer / behavior gap / "humans are not machines" |

**What's preserved from v1:** Acts 1+4 cinematic shoots (Emilie's Friday-evening shoot continues unchanged); Maya as the relatable opener-and-closer persona; Black Mirror tone in Act 1; uplifting-not-triumphant tone in Act 4; Clair de Lune credibility chip; "manipulation only works in the dark" closing tagline.

---

## §1. One-Page Treatment

A 17-year-old girl scrolls Reels in her bedroom. She says she's tried to think for herself, but the algorithm keeps pulling her back. She's given up. Cut to a wider shot: twenty teenagers in identical posture, identical content beats playing across all twenty screens. Two doors appear. One leads to refusing the platforms and falling behind. The other leads to using them and becoming hollow. A third door materializes. Light spills through it.

Cut to a fast montage. A nurse sits with a patient. A worker pauses on scaffolding. A retail rep listens to a customer mid-shift. A teen looks up from her phone. A delivery driver waits between stops. On-screen, large center text materializes: *"Today's AI can describe what humans did. It can't see what they felt while doing it."* Every day humans do work that no machine can read, and the people above them — the manager, the platform, the system — make decisions on data that's missing the human entirely.

Cut to a hospital. A nurse enters a patient's room. She sits down. She sits there for thirty minutes. Her manager reads the action data and decides to cut visit time to ten minutes per room. The action data is wrong. The patient was processing a terminal diagnosis. The nurse held space. There's no way to put "she held space" into a productivity log. That's the empathy layer. That's what we built.

We use Meta's TRIBE V2 brain-encoding model. Same one that matched Clair de Lune to 90.4 percent in our prior work. It predicts the nurse's per-second brain response across 20,000 cortical points. A swarm of K2 specialists, one per brain region, interprets what each part contributed. Claude Opus writes a candidate paragraph describing what she felt. Then we score that paragraph back through TRIBE V2, compare predicted brain pattern to actual brain pattern, and rewrite. Round 1: 0.42. Round 2: 0.58. Round 3: 0.65. Round 5: 0.71. Round 8: 0.84. The score climbs on screen for twenty-five seconds. The audience watches the engine reach for the human, round by round.

The final paragraph reads: *"She entered the room and her vital-attention signature shifted immediately. The prefrontal sharpness of triage softened into something quieter, more accommodating. For the first twelve minutes her emotional-processing specialist sustained engagement; she was reading the patient's grief, not just monitoring it. She did not rush. She did not check out. She held space."* Brain-pattern similarity 0.84. Same paragraph scored against the same nurse on a routine vitals visit: 0.27. Anchored. Not made up.

Side by side: action-data report on the left, says cut to ten. Empathy-layer document on the right, says she held space. The manager would call this differently. The cut doesn't happen. Cut back to Maya in her bedroom. She looks up from her phone. The third door is open behind her. *"Today it's Reels. In five years it's brain chips. Same trade. Same trap. This isn't another AI tool. It's the first one that gives us back the part of being a person that machines were never supposed to take. Humans are not machines. We just turned the lights on."*

---

## §2. ACT 1 — BLACK MIRROR SETUP (0:00 – 0:30)

**Total runtime: 30 seconds (down from 35s in v1).** Cinematic spine. Maya is the universal-relatable opener — she's the persona EVERYONE knows. Acts 2-3 then pivot to the B2B-primary demo. Act 4 returns to Maya transformed.

**Color register:** cool/desaturated. Sound: low strings + ambient hum. Reference palette: Black Mirror "Nosedive" + Severance + Mr. Robot.

### Scene 1.1 — The opening defeat (0:00 – 0:08)

**Visual.** Slow-motion shot of Maya scrolling Reels. Phone screen is the only light source. Face unreadable. Rim-lit by phone glow.

**Voiceover.** (Maya — intimate, defeated, close-mic, almost under-breath)
> *"I've tried to think for myself. The algorithm pulls me back every time. I gave up."*

**Sound design.** Ambient hum + cello sustained note (ppp) entering at 0:03. Soft electronic pulse synced to thumb-pull at 0:06.

**Camera.** Slow dolly push-in on Maya's face for 4s, then static cut to thumb insert.

### Scene 1.2 — The convergence reveal (0:08 – 0:15)

**Visual.** Hard cuts: Maya → second teen → third teen → wide grid of 20 teens all scrolling identical posture. At 0:13, all 20 phone screens sync to the same content beat (TikTok dance drop or true-crime jump-cut).

**Voiceover.** (Maya continues)
> *"Everyone's thinking the same thing. Your Spotify isn't your music. Your YouTube isn't yours. Your Reels picks itself."*

**Sound design.** Tape-stop / quick reverse SFX at 0:13 (the synced beat moment).

### Scene 1.3 — The structural failure named (0:15 – 0:22)

**Visual.** Quick GFX cuts (≤1s each): stylized "personalization" logos morphing into surveillance icons / data-extraction icons. Then graph overlay: "personalization adoption" climbing vs. "perceived control" flatlining; lines cross at 2018.

**Voiceover.** (Maya, slightly more intellectualized)
> *"They called themselves your taste. They're recommendation algorithms in costume. The genitive is a lie."*

**Sound design.** Strings shift to slow descending pattern. High-frequency uneasy note at 0:20.

### Scene 1.4 — The trilemma + third-option tease (0:22 – 0:30)

**Visual.** Two doors materialize. Door 1: silhouette alone, falling behind. Door 2: silhouette filled with corporate logos, hollow eyes. At 0:27: third door materializes between them, bright, light pouring through. NO figure visible inside yet.

**Voiceover.** (Maya, slight uplift — flicker of possibility)
> *"You have two options. Don't use it, fall behind. Use it, give up everything that makes you you. We came to build a third one."*

**Sound design.** Uneasy note resolves at 0:27 to soft uplifting C-major chord. Door-materialize chime/harp pluck.

---

## §3. ACT 2 — THE EMPATHY GAP (0:30 – 0:50)

**Total runtime: 20 seconds.** Transition register — slightly warmer than Act 1, still cinematic. The Guide voice enters here. **CONVICTION-FIRST opening: name the universal human problem (the empathy gap that hits everyone — workers + users + people in their day-to-day lives) before any specific scenario or sponsor framing. The audience needs to BELIEVE the problem is real and shared before they care about the solution.**

### Scene 2.1 — The universal problem named + healthcare demonstration (0:30 – 0:42)

**Visual (00:30 – 00:34, ~4s — the universal-conviction opening).**

Cut from third-door light to a fast montage of human moments where action data fails the human:
- A nurse sitting with a patient (workplace)
- A construction worker pausing on scaffolding (workplace)
- A retail rep mid-conversation with a customer (workplace)
- A teen in their bedroom looking up from their phone (consumer / Maya from Act 1, brief callback)
- A delivery driver in their car between stops (consumer + worker overlap)

Each frame holds for ~0.7s. They share one quality: a human in a moment that requires reading, not just measurement. Below the montage, on-screen text materializes large and centered:

> ***"Today's AI can describe what humans did. It can't see what they felt while doing it."***

Hold the text frame for 1 second.

**Visual (00:34 – 00:42, ~8s — the nurse demonstration anchors the universal claim).**

Hard cut to the clinical environment as the nurse enters a patient room and sits down. We see only the back of the patient's head. She holds the patient's hand. Time-lapse: minutes pass.

**Voiceover.** (Guide voice — calm, conviction register. Speaks slowly. Each sentence carries weight.)
> *"Every day humans do work that no machine can read. A nurse sits with a patient processing a terminal diagnosis. A worker pauses on scaffolding because something feels wrong. Someone scrolls their feed and can't say why they feel hollow afterward. AI today describes what they did. It can't see what they felt while doing it. And the people above them — the manager, the platform, the system — make decisions on the data that's missing the human. That's the gap we're closing. We call it the empathy layer."*

**Sound design.** Soft warm pad enters at 0:30 (replaces Act 1's cool ambient hum). Quiet throughout the nurse scene — let the visual hold weight.

**Camera.** Static medium shot of nurse + patient. Hold. The stillness is the point.

### Scene 2.2 — The architecture preview (0:42 – 0:50)

**Visual.** Cut to the 3D cortical mesh appearing in dark space. Initially dark gray, then per-region glow as the camera slowly orbits. ~20K vertices visible — vastness felt as vastness.

**Voiceover.** (Guide voice — confident, summative)
> *"We use Meta's brain-encoding model to read what work does to your brain. A swarm of specialists, one per brain region, translates the signal into language. Claude writes the paragraph that captures what you felt. Then we score it back against the brain pattern itself. Same way we matched Clair de Lune in prior work. Eight rounds. The language gets closer each time."*

**Sound design.** Single synth tone per region activation at 0:45, 0:47, 0:49 (visual cortex, default-mode, language).

---

## §4. ACT 3 — THE ENGINE RUNNING (0:50 – 2:40) — 110 seconds

**Total runtime: 110 seconds.** This is the demo. Real engine output (or pre-cached fallback per Decision 011). The B2B-primary scenario (nurse) drives the visuals; voiceover is the Guide register, observational throughout.

### Scene 3.1 — The vision baseline (0:50 – 1:05)

**Visual.** Split-screen. Left: the nurse-with-patient footage continues playing. Right: Stage 1 (Qwen3-VL via OpenRouter) vision-classification output appears as on-screen text:
- *"Action: nurse entered room"*
- *"Action: sat beside patient"*
- *"Action: adjusted IV"*
- *"Action: held patient's hand"*
- *"Duration: 30:14"*

**Voiceover.** (Guide voice — observational, NOT diagnostic)
> *"This is the action data. What a vision-language model can tell you today. A list of actions. A duration. A person doing things in time."*

**Sound design.** Soft descending synthesizer tone, one per action label appearing. Clinical, almost unsettling — the action data sounds COLD on purpose.

**Source footage.** Pre-cached. Stage 1 output baked Saturday morning.

### Scene 3.2 — The brain layer surfaces (1:05 – 1:25)

**Visual.** The split-screen collapses. Nurse footage moves to corner. The 3D cortical mesh fills the screen. As the timeline scrubs through the visit, the mesh glows in sync — emotional-processing region sustained engagement (minutes 5-12 region pulse), default-mode network dominant (minutes 18-22 sustained glow), prefrontal-engagement returns (minutes 22-30).

Hover-bridges between regions light up as a hand (Emilie's, on-screen demo-style) hovers over emotional-processing. K2 specialist labels appear as semi-transparent white pills near each region — *"emotional-processing specialist," "default-mode specialist," "prefrontal-engagement specialist."* Reasoning fragments flow along the bridges: *"reading patient's grief," "quiet co-presence," "focused care, holding space."*

**Voiceover.** (Guide voice — confident, explanatory)
> *"Now run the same footage through TRIBE V2. Twenty thousand cortical points, per second. Then a swarm of K2 specialists, running in parallel because K2 hits two thousand tokens a second, interprets what each part of the nurse's brain contributed. Action data said 'sat for thirty minutes.' The brain layer says 'emotional processing was engaged. Default mode took over. She was present, not waiting.' You can audit the cross-talk."*

**Sound design.** Soft "connection" pulse SFX on each bridge light-up at 1:12, 1:14, 1:16. Underlying ambient quiet.

**Source footage.** Pre-cached TRIBE inference + K2 swarm output. 30s pre-cached MP4 fallback baked Saturday morning.

### Scene 3.3 — The iterative-loop reveal (1:25 – 1:55) — THE HERO MOMENT

**Visual.** This is the demo's emotional climax. Acts 3.1 and 3.2 set up the data; Act 3.3 shows the engine THINKING.

The 3D cortical mesh remains in the upper-left corner (small). The center of the screen becomes a TEXT CANVAS where candidate empathy paragraphs appear and update across rounds. To the right of the canvas: a fillable score-bar that climbs round-over-round.

- **1:25 — Round 1 appears.** Candidate paragraph fades in (~80 chars visible): *"The nurse spent time with the patient. She was attentive."* Score bar fills to 0.42. Tag: *"Round 1 / 8 — similarity 0.42"*.
- **1:30 — Round 2.** Paragraph rewrites as we watch (the previous text dissolves and the new text materializes character-by-character): *"She entered the room and her attention shifted to the patient's emotional state."* Score bar climbs to 0.58. Tag: *"Round 2 / 8 — similarity 0.58"*.
- **1:35 — Round 3.** *"For the first twelve minutes her emotional-processing remained engaged; she was reading the patient's grief, not monitoring it."* Score: 0.65.
- **1:40 — Round 4.** *"For the first twelve minutes her emotional-processing remained engaged. Then a long stretch of default-mode dominance — the brain-signature of being present with someone."* Score: 0.71.
- **1:45 — Round 5.** *"...the brain-signature of being present with someone, not waiting for them to finish."* Score: 0.76.
- **1:50 — Round 8 (final).** Full paragraph crystallizes: *"She entered the room and her vital-attention signature shifted immediately — the prefrontal sharpness of triage softened into something quieter, more accommodating. For the first twelve minutes her emotional-processing specialist sustained engagement; she was reading the patient's grief, not just monitoring it. Then a long stretch of default-mode dominance — minutes 18 through 22 — the brain-signature of being present with someone, not waiting for them to finish. The final eight minutes returned to focused care, prefrontal-engaged, holding the patient's hand. She did not rush. She did not check out. She held space."* Score bar full at 0.84. Tag: *"Round 8 / 8 — similarity 0.84 — converged"*.

**Voiceover.** (Guide voice — slows down here; let the visual breathe)
> *"This is the same iterative protocol that gave us the 90.4 percent Clair de Lune match. Inverted. We use the brain pattern of the scene to score paragraphs describing what the nurse felt. Eight rounds. The score climbs as the language matches the brain. Watch."*

(Then VO goes silent from 1:35 to 1:50 — let the audience watch the score climb without narration.)

**Sound design.** Each round's score-bar tick is a soft audible pulse (synth tone, ascending pitch with ascending score). Music fades to almost-silence by Round 5 — let the visual reveal land naked. Single bright chime at 1:50 (Round 8 converges).

**Source footage.** Pre-cached round trajectory. K2 + Opus output baked Saturday 8 AM. Live attempt runs in background per pre-cache discipline.

### Scene 3.4 — The falsification check (1:55 – 2:10)

**Visual.** The final paragraph remains on screen. A new score-bar appears beneath it: *"Falsification check — same nurse, routine vitals visit"*. Score bar fills LOW — to 0.27. Side-by-side delta visualization: 0.84 (this scene) vs. 0.27 (control).

**Voiceover.** (Guide voice — calm, summative)
> *"To prove the description isn't generic, we score the same paragraph against control footage. Same nurse, routine vitals visit. Similarity drops to 0.27. The paragraph is anchored to this scene. Not made up. We can prove it."*

**Sound design.** Short pause — let "falsifiable" land. Soft uplifting tone enters after.

### Scene 3.5 — The decision-maker reads (2:10 – 2:40)

**Visual.** Side-by-side document split:
- **LEFT (red border):** *"ACTION DATA REPORT — Nurse, Patient Room 4. Visit duration: 30:14. Threshold: 10:00. STATUS: OVER THRESHOLD. Recommendation: CUT TIME PER ROOM."*
- **RIGHT (warm-tone border):** *"EMPATHY LAYER DOCUMENT — Nurse, Patient Room 4. [Vision Report] [Empathy Layer Paragraph: she held space, full text...] [Falsification Evidence: similarity 0.84; control delta 0.57; ANCHORED]."*

A manager's hand (visible only as cursor) hovers over the LEFT report. Then moves to the RIGHT report. Then the cursor closes the LEFT report and acts on the RIGHT.

**Voiceover.** (Guide voice — the business case crystallizes; lands the universal payoff)
> *"This is the choice the manager actually has now. The action data on the left would have cut nurse-time per room. The company would have lost the patient experience it was trying to optimize for. The empathy layer on the right shows what action data can't: how the nurse held space. The cut doesn't happen. The patient stays in care. The nurse stays. Same engine runs across construction, retail, healthcare, education. Same engine runs on a teenager scrolling her own feed at home, giving her a brain-grounded journal of what her day actually felt like. Anywhere humans do work, anywhere humans do living, that someone above them — or the user themselves — is reading from action data alone. One engine. Different data."*

**Source footage.** Empathy-layer document UI (Emilie's design, 3-section render). Pre-rendered.

---

## §5. ACT 4 — OUTPUT / PAYOFF (2:40 – 3:00) — 20 seconds

**Total runtime: 20 seconds (down from 25s in v1).** Tighter close. Cinematic register returns. Maya bookends.

### Scene 4.1 — The credibility chip + YEA/NAY (2:40 – 2:50)

**Visual.** Quick frame: text card on neutral background.

> *"Clair de Lune precedent: 60 seconds of music in. 90.4% emotion-center match across 20,484 cortical vertices. Eight rounds. Falsified against control music. This works."*

Hold for 4s. Then cut to clean two-column slide:

| YEA — when AI should be used | NAY — when AI should NOT |
|---|---|
| Make invisible visible | Recommend |
| Surface options | Extract |
| Menial scale-work | Replace judgment |
| Synthesize signals | Present as human |

Hold for 4s. (Title at top: *"Best Use of AI"*.)

**Voiceover.** (Guide voice — confident, summative)
> *"The proof this engine works is already shipped. Same iterative-scoring protocol that gave us the 90.4 percent Clair de Lune match. We have an opinion about when AI should be used and when it shouldn't. The empathy layer sits entirely on the should side. AI augments human decisions. It doesn't replace them."*

### Scene 4.2 — Maya transformed + closing tagline (2:50 – 3:00)

**Visual.** Return to Maya from the opening. Same bedroom. Same phone in hand. But she looks UP from the phone now. The third door is open behind her — warm light spilling in. She takes a step toward it.

Brief flash at 2:55 (1s cut): same bedroom but Maya now wearing scrubs at the hospital scene from Act 2 — the visual rhyme that links the personas. She is the user (B2C) AND the worker (B2B). The empathy layer is for everyone.

Tagline appears as lower-third overlay at 2:55: *"Humans are not machines."*

Then secondary tagline at 2:58: *"We just turned the lights on."*

Final 2 seconds: black frame. Product/team/sponsor logos.

**Voiceover.** (Maya's voice returns — transformed; same person; quiet certainty)
> *"This isn't another AI tool. It's the first one that gives us back the part of being a person that machines were never supposed to take. Humans are not machines. We just turned the lights on."*

**Sound design.** Music returns at 2:40 — uplifting chord progression (relief, not triumph). Strings + soft pad. Final 2 seconds: silence + end-card.

---

## §6. B-Roll List (Emilie's shoot priorities)

**Friday afternoon → evening (cinematic Acts 1+4):**

| Shot | Location | Priority | Talent | Notes |
|---|---|---|---|---|
| Maya scrolling, phone-glow rim-lit, slow push-in (Scene 1.1) | Bedroom interior, low light | P0 | Lead (Maya) | 4-second hold + 4-second hand-on-phone insert |
| 20-teen scrolling crowd shot (Scene 1.2) | 5-6 different locations, composite to 20-grid in post | P1 | 5-6 extras | Race/gender/setting variety required |
| Two-doors → three-doors composition (Scene 1.4) | Studio with black backdrop OR fully VFX | P1 | (silhouettes) | VFX-rendered acceptable if budget |
| Maya looking up from phone, third-door light entering (Scene 4.2) | Same bedroom as Scene 1.1 | P0 | Lead (Maya) | Two takes — defeated register, then transformed register |
| Maya stepping toward door (Scene 4.2 close) | Same | P0 | Lead | Final shot — must feel inevitable, not staged |
| Maya in scrubs flash-cut (Scene 4.2) | Hospital-set OR composite | P1 | Lead | 1-second visual rhyme; can be VFX-overlay if scrubs unavailable |

**Saturday morning → afternoon (Act 2 healthcare scene):**

| Shot | Location | Priority | Talent | Notes |
|---|---|---|---|---|
| Nurse entering patient room (Scene 2.1) | Hospital-set OR clean clinical staging at venue | P0 | Nurse + patient (back of head only) | Avoid identifiable patient features; scrubs + IV setup |
| Nurse sitting beside patient, holding hand (Scene 2.1) | Same | P0 | Same | Static medium shot; the stillness is the point |
| Time-lapse of nurse seated (Scene 2.1) | Same | P0 | Same | 8-shot sequence assembled into time-lapse showing minutes passing |

**Saturday morning (Act 3 demo footage from the engine):**

| Asset | Source | Owner |
|---|---|---|
| Stage 1 Qwen3-VL vision report (action labels) for nurse footage | Pre-baked Saturday 8 AM | Johnny (Stage 1 integration) |
| TRIBE V2 brain-pattern JSON for nurse footage | Pre-baked Saturday 8 AM | Junsoo |
| 3D cortical mesh + per-region glow render (Scene 3.2) | Three.js / R3F | Johnny (vis-brain worktree) |
| Hover-bridge animation with reasoning fragments (Scene 3.2) | Three.js / R3F | Johnny (vis-graph worktree) |
| K2 region-specialist swarm output (per-region semantic + edge weights) | Pre-baked Saturday 8 AM | Jacob |
| Iterative-loop round trajectory (8 candidate paragraphs + scores) | Pre-baked Saturday 8 AM | Jacob + Johnny |
| Falsification check (control video brain pattern + delta) | Pre-baked Saturday 8 AM | Junsoo + Jacob |
| Empathy-layer document UI (3-section render) | Figma → After Effects | Emilie |
| Action-data report vs. empathy-layer document side-by-side (Scene 3.5) | Figma → After Effects | Emilie |

**Motion graphics + VFX assets (parallel to other blocks):**

| Asset | Notes |
|---|---|
| Stylized "personalization platform" icons (Scene 1.3) | Trademark-safe substitutes |
| Personalization-vs-control crossing graph (Scene 1.3) | After Effects motion-graphic |
| Two-doors → three-doors with light pour (Scene 1.4) | VFX or render |
| Cortical mesh setup shot (Scene 2.2) | Use real fsaverage5 mesh from TRIBE V2 demo |
| Clair de Lune precedent text card (Scene 4.1) | Static card, number-forward |
| YEA/NAY rubric two-column slide (Scene 4.1) | Static, emphasis on text legibility |
| Tagline lower-third overlays (Scene 4.2) | "Humans are not machines" + "We just turned the lights on" |
| End-card (product name + team + sponsor logos) | Verify all sponsor logos current; include Ironsight + Listen Labs + Sideshift + IFM K2 + Anthropic |

---

## §7. Talent Direction

### Maya — Lead (the universal-relatable persona)

**Casting brief.** Age 17-19, gender flexible, race flexible. Reads as "actual Gen-Z teen" — not a stylized actor. Voice: medium-low register, capable of intimate-defeated AND ownership registers.

**Direction notes:**

- **Scene 1.1 (defeated open):** SOFTLY, almost under-breath. An old wound, not a fresh thought. SLIGHTLY hollow. Not despair — exhaustion.
- **Scene 1.2-1.3:** Gains presence. By "the genitive is a lie" she's intellectualizing — distancing herself from the felt friction by naming it.
- **Scene 1.4 (third-door tease):** Slight uplift. Flicker of possibility.
- **Scene 4.2 (close, transformed):** SAME PERSON. Voice has CONTROL now. Quiet certainty. NOT victory-lap energy. The "we just turned the lights on" line is delivered as fact, not slogan.

### Nurse — Act 2 + Act 3 hero footage

**Casting brief.** Adult, scrubs-wearing, gender flexible, race flexible. Reads as actual nurse (uniform fit, posture). NO speaking lines (this is a wordless visual scene; voiceover is Guide).

**Direction notes:**

- Scene 2.1: Calm, attentive presence. Not rushed. Sit with deliberateness. Hold patient's hand naturally. The stillness is the performance — resist the temptation to "do" something.
- Time-lapse sequence: 8 micro-poses showing time passing without breaking presence.

### Patient — Act 2

**Casting brief.** Any age/gender. Back of head only — no facial identification. Could be any patient.

### Guide — Voiceover (the architecture/explainer voice)

**Casting brief.** Adult, gender flexible. Reads as "explains Notion or Linear or Granola in a launch video — calm, present, in control, not breathless."

**Direction notes:**

- **Act 2.1 (healthcare scenario):** Calm. Present. The "we call it the empathy layer" line is the product naming — land it gently.
- **Act 2.2 (architecture preview):** Confident, summative. Slight pride in the system architecture — not in self.
- **Act 3.1 (vision baseline):** Observational. The action data sounds COLD on purpose. *"A list of actions. A duration. A worker doing things in time."* Read flat.
- **Act 3.2 (brain layer):** Confident, explanatory. "Cross-talk between regions is auditable" lands as a quiet flex.
- **Act 3.3 (iterative loop):** Slow down dramatically. Let the visual breathe. **VO goes SILENT from 1:35 to 1:50** — audience watches score climb without narration.
- **Act 3.4 (falsification):** Calm, summative. *"Brain-grounded. Falsifiable."* — short pause after each word.
- **Act 3.5 (decision-maker reads):** The business-case moment. Read deliberately. *"The corner-cut doesn't happen."* land hard.
- **Act 4.1 (Clair de Lune + YEA/NAY):** Confident. Quiet flex.

---

## §8. Sound Design Spec

**Reference palette:** Black Mirror (Cristobal Tapia de Veer) + Severance (Theodore Shapiro / Mark Mothersbaugh) + Mr. Robot (Mac Quayle) + Apple launch videos (Cliff Martinez-style synth pads).

**Music cue list:**

| Cue | Time | Description |
|---|---|---|
| 1.1 | 0:00–0:08 | Ambient hum + cello sustained ppp from 0:03 |
| 1.2 | 0:08–0:15 | Continuation; tape-stop SFX at 0:13 |
| 1.3 | 0:15–0:22 | Strings shift to descending pattern; high-frequency uneasy note at 0:20 |
| 1.4 | 0:22–0:30 | Uneasy note resolves at 0:27 to soft uplifting C-major; door-materialize chime |
| 2.1 | 0:30–0:42 | Soft warm pad (replaces cool ambient hum); QUIET — let the nurse-with-patient visual hold |
| 2.2 | 0:42–0:50 | Single synth tone per region activation (0:45, 0:47, 0:49) |
| 3.1 | 0:50–1:05 | Soft descending synth tone per action label; clinical, almost unsettling |
| 3.2 | 1:05–1:25 | Connection pulse SFX per bridge light-up (1:12, 1:14, 1:16); underlying ambient quiet |
| 3.3 | 1:25–1:55 | Each round's score-bar tick is an ascending synth tone; music fades by Round 5; silence from 1:35 to 1:50 EXCEPT score-bar ticks; bright chime at 1:50 (convergence) |
| 3.4 | 1:55–2:10 | Pause after "falsifiable"; soft uplifting tone enters |
| 3.5 | 2:10–2:40 | Restrained uplift; let "the corner-cut doesn't happen" land; pad continues underneath |
| 4.1 | 2:40–2:50 | Music returns slightly uplifting (relief register); strings + soft synth pad |
| 4.2 | 2:50–3:00 | Strings build through 2:50-2:55; single bright tone at 2:55 (tagline appears); music drops to silence at 2:58 ("We just turned the lights on"); final 2s silence + end-card |

**SFX:**

| SFX | Time | Description |
|---|---|---|
| Phone-pull pulse | 0:06 | Soft electronic pulse synced to thumb-pull |
| Sync-moment | 0:13 | Tape-stop / quick reverse |
| Logo morphs | 0:16, 0:18, 0:20 | Subtle whoosh per logo morph |
| Door materialize | 0:27 | Soft chime / harp pluck |
| Region activation chimes | 0:45, 0:47, 0:49 | One synth tone per region |
| Action-label chimes | 0:50–1:05 | Descending tone per action |
| Bridge-light pulses | 1:12, 1:14, 1:16 | Connection pulse per bridge |
| Score-bar ticks | 1:25, 1:30, 1:35, 1:40, 1:45, 1:50 | Ascending pitch with ascending score |
| Convergence chime | 1:50 | Bright chime (Round 8 converges) |
| Tagline tone | 2:55 | Single bright tone |

**Mix philosophy:** Voice always primary. Music never fights the VO. SFX accent moments. **The silence from 1:35-1:50 is a deliberate sound-design choice — let the iterative-loop reveal land naked.**

---

## §9. Master Shot List (every shot, timecode, narration)

> Print this and bring to shoot.

### Act 1 — Black Mirror Setup (8 shots, 30s)

| # | TC | Dur | Type | Voiceover | Owner |
|---|---|---|---|---|---|
| SH-1.1.A | 00:00–00:04 | 4s | MS Maya, slow dolly push-in | "I've tried to think for myself." | Emilie + DP |
| SH-1.1.B | 00:04–00:06 | 2s | INSERT thumb-pull on phone | (continues): "The algorithm pulls me back every time." | Emilie + DP |
| SH-1.1.C | 00:06–00:08 | 2s | MS Maya defeat hold | "I gave up." | Emilie + DP |
| SH-1.2.A | 00:08–00:10 | 2s | MS extras × 3 | "Everyone's thinking the same thing." | Emilie |
| SH-1.2.B | 00:10–00:15 | 5s | WS 20-grid composite | "Your Spotify isn't your music. Your YouTube isn't yours. Your Reels picks itself." | Emilie + post-comp |
| SH-1.3 | 00:15–00:22 | 7s | GFX logos + graph | "They called themselves your taste. They're recommendation algorithms in costume. The genitive is a lie." | GFX |
| SH-1.4.A | 00:22–00:27 | 5s | VFX two-door composition | "You have two options. Don't use it, fall behind. Use it, give up everything that makes you you." | GFX/VFX |
| SH-1.4.B | 00:27–00:30 | 3s | VFX third-door materializes | "We came to build a third one." | GFX/VFX |

### Act 2 — Empathy Gap (4 shots, 20s)

| # | TC | Dur | Type | Voiceover | Owner |
|---|---|---|---|---|---|
| SH-2.1.0 | 00:30–00:34 | 4s | Fast montage (5 frames @ ~0.7s each): nurse + patient / worker on scaffolding / retail rep mid-conversation / teen looking up from phone / delivery driver between stops; large center text materializes: *"Today's AI can describe what humans did. It can't see what they felt while doing it."* | "Every day humans do work that no machine can read. A nurse sits with a patient processing a terminal diagnosis. A worker pauses on scaffolding because something feels wrong. Someone scrolls their feed and can't say why they feel hollow afterward. AI today describes what they did. It can't see what they felt while doing it. And the people above them — the manager, the platform, the system — make decisions on the data that's missing the human." | GFX + Emilie |
| SH-2.1.A | 00:34–00:38 | 4s | Hard cut to MS nurse entering patient room (anchor scene that carries the universal claim into a single specific demonstration) | (VO continues from 2.1.0) | Emilie + DP |
| SH-2.1.B | 00:38–00:42 | 4s | Time-lapse of nurse seated, holding patient hand | "That's the gap we're closing. We call it the empathy layer." | Emilie |
| SH-2.2.A | 00:42–00:46 | 4s | RENDER 3D cortical mesh appears, slow rotation | "We use Meta's brain-encoding model to read what work does to your brain. A swarm of specialists, one per brain region, translates the signal into language." | Junsoo + Emilie |
| SH-2.2.B | 00:46–00:50 | 4s | RENDER mesh continues, regions glow | "Claude writes the paragraph that captures what you felt. Then we score it back against the brain pattern itself. Same way we matched Clair de Lune in prior work. Eight rounds. The language gets closer each time." | Junsoo + Emilie |

### Act 3 — The Engine Running (12 shots, 110s)

| # | TC | Dur | Type | Voiceover | Owner |
|---|---|---|---|---|---|
| SH-3.1.A | 00:50–00:58 | 8s | SPLIT-SCREEN nurse + Stage 1 vision report (action labels appearing one by one) | "This is the action data. What a vision-language model can tell you today. A list of actions. A duration. A person doing things in time." | Johnny (Stage 1) + Emilie |
| SH-3.1.B | 00:58–01:05 | 7s | Continued action-label appearance + duration timestamp | (silence; let visual hold) | Same |
| SH-3.2.A | 01:05–01:15 | 10s | Cortical mesh fills screen; per-region glow synced to nurse timeline scrubbing | "Now run the same footage through TRIBE V2. Twenty thousand cortical points, per second." | Junsoo + Johnny + Emilie |
| SH-3.2.B | 01:15–01:25 | 10s | Hover hand appears; bridges light up; specialist labels appear; reasoning fragments flow | "Then a swarm of K2 specialists, running in parallel because K2 hits two thousand tokens a second, interprets what each part of the nurse's brain contributed. Action data said 'sat for thirty minutes.' The brain layer says 'emotional processing was engaged. Default mode took over. She was present, not waiting.' You can audit the cross-talk." | Jacob (K2 swarm) + Johnny |
| SH-3.3.A | 01:25–01:30 | 5s | Round 1 candidate paragraph appears; score bar fills to 0.42 | "This is the same iterative protocol that gave us the 90.4 percent Clair de Lune match. Inverted. We use the brain pattern of the scene to score paragraphs describing what the nurse felt. Eight rounds. The score climbs as the language matches the brain. Watch." | Jacob + Johnny + Emilie |
| SH-3.3.B | 01:30–01:35 | 5s | Round 2 paragraph rewrites; score 0.58 | (silence — let visual breathe) | Same |
| SH-3.3.C | 01:35–01:50 | 15s | Rounds 3-7: paragraph evolves character-by-character; score climbs 0.65 → 0.71 → 0.76 → 0.79 → 0.81 | (silence throughout) | Same |
| SH-3.3.D | 01:50–01:55 | 5s | Round 8 final paragraph crystallizes; score bar full at 0.84; convergence chime | (silence; let convergence land) | Same |
| SH-3.4 | 01:55–02:10 | 15s | Final paragraph holds; falsification score-bar appears beneath at 0.27; side-by-side delta | "To prove the description isn't generic, we score the same paragraph against control footage. Same nurse, routine vitals visit. Similarity drops to 0.27. The paragraph is anchored to this scene. Not made up. We can prove it." | Junsoo + Jacob + Emilie |
| SH-3.5.A | 02:10–02:25 | 15s | Side-by-side documents: action-data report (LEFT, red border) vs. empathy-layer document (RIGHT, warm-tone border); cursor hovers LEFT then RIGHT | "This is the choice the manager actually has now. The action data on the left would have cut nurse-time per room. The company would have lost the patient experience it was trying to optimize for. The empathy layer on the right shows what action data can't: how the nurse held space. The cut doesn't happen. The patient stays in care. The nurse stays." | Emilie |
| SH-3.5.B | 02:25–02:40 | 15s | Cursor closes LEFT report and acts on RIGHT; cut to 5-tile montage spanning B2B + B2C: construction worker / retail rep / kitchen line cook / classroom teacher / Maya in her bedroom (B2C callback) — each with their own empathy-layer document rendered in their persona-appropriate framing | "Same engine runs across construction, retail, healthcare, education. Same engine runs on a teenager scrolling her own feed at home, giving her a brain-grounded journal of what her day actually felt like. Anywhere humans do work, anywhere humans do living, that someone above them — or the user themselves — is reading from action data alone. One engine. Different data." | Emilie + Johnny |

### Act 4 — Output / Payoff (4 shots, 20s)

| # | TC | Dur | Type | Voiceover | Owner |
|---|---|---|---|---|---|
| SH-4.1.A | 02:40–02:46 | 6s | Clair de Lune precedent text card | "The proof this engine works is already shipped. Same iterative-scoring protocol that gave us the 90.4 percent Clair de Lune match." | GFX |
| SH-4.1.B | 02:46–02:50 | 4s | YEA/NAY two-column slide with Best Use of AI title | "We have an opinion about when AI should be used and when it shouldn't. The empathy layer sits entirely on the should side. AI augments human decisions. It doesn't replace them." | GFX |
| SH-4.2.A | 02:50–02:55 | 5s | Maya in bedroom, looking up from phone, third-door light spilling in | "This isn't another AI tool. It's the first one that gives us back the part of being a person that machines were never supposed to take." | Emilie + DP |
| SH-4.2.B | 02:55–02:58 | 3s | Flash to Maya in scrubs (visual rhyme); tagline lower-third "Humans are not machines." | "Humans are not machines." | Emilie + VFX |
| SH-4.2.C | 02:58–03:00 | 2s | Maya stepping toward door; tagline lower-third "We just turned the lights on."; cut to black + end-card | "We just turned the lights on." | Emilie + GFX |

**Total: 28 shots / 180s exact.**

---

## §10. Delivery Checklist (Saturday 11 PM PDT)

- [ ] 16:9 1080p MP4 (primary deliverable — Devpost embed)
- [ ] 16:9 4K MP4 (archive)
- [ ] 9:16 1080p MP4 (social variant)
- [ ] Closed captions SRT
- [ ] All sponsor logos current and trademark-correct (Ironsight + Listen Labs + Sideshift + IFM K2 + Anthropic + YC)
- [ ] Product name finalized and inserted in Acts 2.2 + end-card
- [ ] No reverse-inference language anywhere in VO or on-screen text
- [ ] No inflated TRIBE numbers (~20K vertices / ~25 subjects only — verify by ctrl-F)
- [ ] No sub-second prediction claims
- [ ] Within-subject contrast only throughout Act 3 falsification
- [ ] Empathy-layer paragraph reads as literature-grade prose (no academic / clinical jargon)
- [ ] Total runtime exactly 180 seconds
- [ ] Devpost video field populated
- [ ] Backup of all source footage + project file committed to repo
- [ ] Pre-cache assembly test (Saturday 6 PM) passed: full 90s on pre-recorded only

---

## §11. Self-Audit Table (run Saturday 6 PM with pre-cache assembly test)

| Check | Verdict |
|---|---|
| Total runtime = 180s exact | ⏳ verify in edit |
| Maya opens defeated, closes transformed | ⏳ verify in VO record |
| Empathy-layer name introduced in Act 2 | ⏳ verify VO |
| Action-data baseline shown before brain layer | ⏳ verify Act 3.1 |
| Brain layer surfaces with ~20K vertices visibly rendered | ⏳ verify Act 3.2 |
| Iterative-loop reveal: score climbs Round 1 → Round 8 visible across ~25s | ⏳ verify Act 3.3 |
| VO silence from 1:35–1:50 honored (audience watches score climb without narration) | ⏳ verify mix |
| Falsification check shown with control delta | ⏳ verify Act 3.4 |
| Side-by-side action-vs-empathy decision shown | ⏳ verify Act 3.5 |
| Cross-industry generalization montage (construction / retail / food / education) | ⏳ verify Act 3.5.B |
| Clair de Lune credibility chip cited verbatim | ⏳ verify Act 4.1 |
| YEA/NAY rubric slide displayed | ⏳ verify Act 4.1 |
| "Humans are not machines" tagline appears | ⏳ verify Act 4.2 |
| "We just turned the lights on" closes | ⏳ verify Act 4.2 |
| No reverse-inference language | ⏳ verify final pass |
| No inflated TRIBE numbers | ⏳ verify final pass |

---

## §12. Workflow

- Friday afternoon → evening: Acts 1+4 cinematic shoot (Maya bedroom + door VFX) — Emilie + DP
- Friday evening → Saturday morning: VO recording (Maya + Guide) per §7 talent direction
- Saturday morning: Act 2 hospital scene shoot (nurse + patient) — Emilie
- Saturday morning: Act 3 demo footage rendered (Junsoo + Jacob + Johnny pipeline outputs pre-baked)
- Saturday afternoon → 8 PM: Editing passes 1-5 (rough cut → VO integration → sound design → color grade → final polish)
- Saturday 6 PM: Self-audit per §11 + final wording polish
- Saturday 8 PM: Feature freeze (Decision 012)
- Saturday 8-11 PM: Final color grade + audio mix + delivery per §10
- Saturday 11 PM: Devpost upload + submission

**The video script IS the shoot. Emilie shoots from this file. `pkg-demo-video` Tier-2 Claude orchestrates assembly from this file.**

---

## §13. The Line Worth Memorizing

> **Humans are not machines. We just turned the lights on.**

Every sponsor swap-slide. Every Devpost paragraph. Every pavilion close. Every elevator pitch. This is the line.
