---
file-type: finding
status: in-progress
last-verified: 2026-04-25
supports-decisions: []
cites-sources:
  - research/wiki/themes/ai-paradox-invisible-use-cases/README.md
  - research/wiki/themes/ai-paradox-invisible-use-cases/sources/001-hak-systems-thinking.md
  - research/wiki/themes/ai-paradox-invisible-use-cases/sources/002-algorithmic-culture-flattening.md
  - research/wiki/themes/ai-paradox-invisible-use-cases/sources/003-trends-slop-and-the-comment-section-in-flesh.md
  - research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/sources/004-multi-agent-alignment-actor-auditor-mediator.md
  - research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/sources/005-kurzgesagt-the-secret-mind-and-collaborative-inner-universe.md
  - research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/sources/006-tribe-v2-meta-trimodal-brain-encoder.md
  - research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/sources/007-karpathy-llm-wiki-pattern.md
  - research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/100-tribe-v2-and-agent-swarms-architectural-anchors.md
  - caltech/RESEARCH-CONSOLIDATION-PROTOCOL.md
cross-links:
  - research/wiki/themes/ai-paradox-invisible-use-cases/README.md
  - research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/100-tribe-v2-and-agent-swarms-architectural-anchors.md
  - research/wiki/themes/ai-paradox-invisible-use-cases/window-2-research-deepening/400-prd-scaffold.md
---

# 500 — BMAD Advanced-Elicitation QA Pass on the Theme + Architectural Anchors

> **Scope.** Four-method elicitation (Socratic, Red Team, Pre-Mortem, First Principles) over the lock document, sources 001–007, and the architectural-anchor synthesis. **Reflects, does not propose.** Per Johnny's Socratic protocol, no idea, hook, demo, hypothesis, or product surface is suggested here. Tensions are surfaced and held, not resolved.
> **Provenance convention.** `[source: <path>:<section-or-line>]` for every quote / attribution. When the existing material has no answer, that is stated explicitly as **"no counter exists in current material."**

---

## Method 1 — Socratic Sharpening (12 questions)

For each load-bearing claim in the theme lock + the architectural-anchor synthesis: claim → strongest sharpening question → why this question matters.

### S1. The "augmented intelligence" framing

- **Claim.** *"Augmented human intelligence should be the way humans actually interact with AI in a sense that it actually creates human ingenuity, spawns the human renaissance, and challenges a lot of previous beliefs."* [source: research/wiki/themes/ai-paradox-invisible-use-cases/README.md:Live thread 2026-04-25 hypothesis frame]
- **Question.** *Augmentation of which faculty, exactly — judgment, taste, memory, attention, decision-making, or self-knowledge — and how would a stranger watching the demo for 90 seconds distinguish "augmented" from "served plausibility-shaped slop with extra steps"?*
- **Why it matters.** Source 003 says the model "takes the smartest people in the room and moves them toward the middle" [source: sources/003-trends-slop-and-the-comment-section-in-flesh.md:Key extracts]. If "augmentation" can't be visually distinguished from mean-regression, the framing folds into the very failure mode it's supposed to fight.

### S2. "Un-black-box" as system property vs. UX feature

- **Claim.** *"Un-black-boxing stops being a UX feature and becomes the system property: the auditor's diff against the actor IS the un-black-boxing."* [source: sources/004-multi-agent-alignment-actor-auditor-mediator.md:How this maps to the theme]
- **Question.** *What does the auditor's diff look like when the actor is right and the auditor finds nothing — i.e., what does the un-black-box surface render in the 80% of cases that aren't a dramatic disagreement?*
- **Why it matters.** A system that only reveals itself when something is wrong is invisible most of the time. The theme is about *invisible* algorithmic erosion [source: README.md:Distilled]; if the un-black-boxing is only visible at fault, it inherits the same invisibility it claims to fix.

### S3. Tribe V2 as "special mode"

- **Claim.** *"Tribe V2 is the first publicly-available system that lets you check the predicted neural response to a piece of content in software, before deployment."* [source: sources/006-tribe-v2-meta-trimodal-brain-encoder.md:How this maps to the theme]
- **Question.** *If the model only "predicts brain reactions to external stimuli, not internal monologue, intention, emotion-from-the-inside"* [source: sources/006:What it explicitly is NOT] — *what claim about a user's experience can the demo legitimately make from a 70K-voxel vector that doesn't require reverse inference, the exact failure mode the source flags?*
- **Why it matters.** The source explicitly invokes Ramsoy's reverse-inference warning; building a UX claim that requires reverse inference is the sharpest known failure mode and the source's own caution.

### S4. The 24-month deadline

- **Claim.** *"24 months, that's the window. Personal AI shipping into phones / glasses now is locking in architectures during a window where today's design choices shape what an entire generation thinks is real."* [source: sources/004:Key extracts]
- **Question.** *What evidence outside this single transcript supports the 24-month figure, and what changes in the demo if the actual lock-in window is 8 months or 60?*
- **Why it matters.** The figure currently rests on one unidentified YouTuber commentary [source: sources/004:Format] — `URL: unverified`, `Author: unidentified`. The architectural-anchor synthesis treats it as "the theme has a clock" [source: 100:How this maps to the theme]. A clock without a second source is rhetoric, not evidence.

### S5. Disagreement-as-feature

- **Claim.** *"Disagreement is not a problem. It's not a bug. It's the entire point... it's the friction, the constant checking and disagreeing between the actor and the auditor that actually binds the whole system together."* [source: sources/004:Full transcript]
- **Question.** *In what user-perceptible unit (latency cost, screen real estate, cognitive load) is the friction paid, and at what threshold does the user click "skip the auditor" — i.e., where does the system get demoted into an Actor-only product by user behavior?*
- **Why it matters.** Source 002 documents that users *opt out of opt-out*: *"we are free to choose anything yet the choice we often make is not to have a choice"* [source: sources/002:Key extracts citing Chayka]. A friction-positive product fights consumer gravity from day one.

### S6. The polyphony / "joins your voices" framing

- **Claim.** *"Your secret mind isn't just yours, but a collaborative creation between you and all the human minds that came before."* [source: sources/005:Key extracts]
- **Question.** *If the human mind is already polyphonic, what is the operational difference between "AI joining the polyphony" (additive) and "AI replacing the quietest existing voices first" (substitutive), and which one does Tribe V2 + Actor/Auditor/Mediator architecturally favor by default?*
- **Why it matters.** Source 002 names the failure mode: *"hollowed-out feeling toward ourselves"* when the algorithm crowds out internal voices [source: sources/002:Key extracts]. Adding more synthetic voices to a polyphony already losing volume could *accelerate* the loss the theme claims to fight.

### S7. The five-sponsor satisfaction claim

- **Claim.** *"Each sponsor should be intrigued and in love with what we have."* [source: README.md:Live thread 2026-04-25 hypothesis frame]
- **Question.** *Which single sponsor's "sauce" is intrinsic to the architecture such that removing it makes the architecture incoherent (rather than merely thinner) — and what's the test that distinguishes intrinsic from bolted-on?*
- **Why it matters.** The lock document already names this as Open Question 6 [source: README.md:Open questions]; the anchor synthesis stacks all five sponsors *theoretically* but warns "each integration adds latency and risk" [source: 100:What's NOT yet decided #6]. Stacking without a test for intrinsic-vs.-bolted-on is sponsor cargo-culting.

### S8. The "wow toggle"

- **Claim.** *"GreenChain had sea→air emissions × 55. The TreeHacks 2026 grand-prize winners all had a moment a judge could press. What's ours, given Tribe V2 + swarms?"* [source: 100:What's NOT yet decided #4]
- **Question.** *What is the smallest physical interaction (one button, one toggle, one click) that proves the entire architectural argument in under five seconds — and does Tribe V2's second-scale latency [source: sources/006:Cautions] permit a sub-five-second feel-it moment at all?*
- **Why it matters.** The lock doc names this as Open Question 7 with the exact phrase "demo theatre moment" [source: README.md:Open questions]. fMRI temporal resolution is seconds, not milliseconds; that is a hard physical floor on the wow-toggle.

### S9. The actor / auditor / mediator → demo legibility

- **Claim.** *"Friction is the feature is demoable in 2 minutes — the bet is that watching the auditor disagree with the actor is more compelling than watching the actor be smooth. Need a moment that proves this."* [source: sources/004:Sharpening questions]
- **Question.** *What did the source's own author actually demo to verify this bet, and if the answer is "nothing, this is a thesis on a YouTube transcript" — what is the closest existing shipping product where multi-agent dissent is the user-facing surface, not a backend implementation detail?*
- **Why it matters.** The source is commentary on a research thesis [source: sources/004:Format], not a shipped product. The architectural-anchor synthesis adopts it as a coordination commitment [source: 100:Architectural anchor #2]. Adopting an unshipped pattern as a demoable surface is a research bet, not an engineering decision.

### S10. The Karpathy LLM-wiki pattern as both content and operating manual

- **Claim.** *"This source is double-duty: content for the theme... AND operating manual for our own wiki."* [source: sources/007-karpathy-llm-wiki-pattern.md:How this maps to the theme]
- **Question.** *If the LLM-wiki pattern is the canonical example of "augmented intelligence done right" — invisible bookkeeping, visible curation — does the team's own use of this pattern during build *count* as the demo, or does it disqualify the approach as too meta to land with judges who haven't lived inside Obsidian for six months?*
- **Why it matters.** The source's framing is *"Obsidian is the IDE; the LLM is the programmer; the wiki is the codebase"* [source: sources/007:The interface metaphor] — beautiful for builders, opaque to judges. The theme's deepest claim (un-black-box for the user) sits in tension with the most sympathetic shipped instance of the pattern (un-black-box for builders only).

### S11. Trimodal as "sponsor-stacking by architectural fit"

- **Claim.** *"Trimodal: video + audio + text → Hits 4 of 5 sponsors at the architecture layer."* [source: 100:What "Tribe V2 as the special mode" gives us]
- **Question.** *Is "the architecture happens to use audio, video, and text" the same kind of fit as "the architecture cannot work without Listen Labs voice / Ironside spatial / K2 reasoning" — and if not, which sponsor surfaces are load-bearing and which are decorative?*
- **Why it matters.** Tribe V2 uses Wav2Vec2-BERT, V-JEPA 2, and Llama 3.2 internally [source: sources/006:Architecture]. None of those are sponsor products. "Trimodal" in the architectural-anchor sense is Meta's stack, not the sponsors'. The sponsor-fit claim conflates *modality* with *vendor*.

### S12. "Restoring humanity" as testable outcome

- **Claim.** *"Restore the human half of a human/AI partnership; redefine what a digital Renaissance looks like."* [source: README.md:Distilled]
- **Question.** *What single user-observable change — measurable in the 24 hours of the demo, not over years — would constitute "restoration" rather than "novel demo of an AI feature"?*
- **Why it matters.** The lock doc names this as Open Question 3 [source: README.md:Open questions] and as the theme's standing failure mode (*"without that moment, the theme stays an essay"*). The architectural anchors do not yet answer it.

---

## Method 2 — Red Team (9 attacks, steelmanned)

Each attack is the strongest version of the case against. Each has the strongest counter the existing material offers, or **"no counter exists in current material."**

### R1. *"Tribe V2 won't work for our use case because the model predicts brain reactions to external stimuli, full stop, and any consumer-product copy that says more than that violates the source's own warnings."*

- **Steelman.** Source 006 is unambiguous: *"Does NOT read your private thoughts. Predicts brain reactions to external stimuli, not internal monologue, intention, emotion-from-the-inside"* [source: sources/006:What it explicitly is NOT]. The Ramsoy reverse-inference caution applies. The model is also trained on people watching movies in scanners; *"the real world is messier"* [source: sources/006:Key extracts]. Any UX framing that suggests Tribe V2 reveals what content *means* to a person is reverse inference dressed up.
- **Counter-counter from material.** The architectural-anchor synthesis lists "creator pre-screening their own content" as the explicitly *good* version [source: sources/006:Cautions]. That use case — measure predicted neural-response signature to a piece of content, before publication, by the creator — does not require reverse inference. **Counter exists, but narrows the legitimate surface significantly.**

### R2. *"Agent swarms are theatre because the only published evidence in our corpus is a YouTuber summarizing an unpublished thesis."*

- **Steelman.** Source 004 is `Format: YouTube transcript (commentary on a research thesis)` with `Author: unidentified` and `URL: unverified` [source: sources/004:metadata]. The architectural-anchor synthesis upgrades it to "coordination pattern" [source: 100:Architectural anchor #2]. Anthropic, OpenAI, and DeepMind have all published agent-orchestration work; none of it is cited. The strongest case for "agent swarms" as a theme commitment rests on a single anonymous summary.
- **Counter-counter from material.** Source 004 cites Michael Levin's biology and the US Constitution as templates [source: sources/004:Key extracts]. Both have peer-reviewed literatures the architectural-anchor synthesis can lean on. **Counter exists in material, but it is analogical, not technical.** The actual claim that *agent dissent surfaces* will read as un-black-boxing to a non-technical user has **no counter in current material**.

### R3. *"The 'augmented intelligence' framing is itself trends slop because every sponsor deck and every YC essay since 2023 says it."*

- **Steelman.** Source 003 names this exact failure: AI defaults to *"differentiation, collaboration, long-term thinking, and augmentation"* — preferring "augmentation" is the corpus mean [source: sources/003:Key extracts]. Picking "augmented intelligence" as the framing is, by the source's own definition, picking the trends-slop answer. The theme is fighting the very position it adopts.
- **Counter-counter from material.** **No counter exists in current material.** The lock doc records the framing as Johnny's directional commitment [source: README.md:Live thread 2026-04-25] without addressing source 003's mean-regression critique of that exact word. This is an open contradiction inside the corpus.

### R4. *"The 24-month deadline is fabricated because no source independently corroborates it."*

- **Steelman.** The figure appears once, in source 004's transcript: *"24 months, that's the window"* [source: sources/004:Full transcript], spoken by an unidentified YouTuber. No paper, no analyst report, no second commentator, no industry filing. The architectural-anchor synthesis treats it as a clock [source: 100:How this maps to the theme]. A theme with a fake clock is an essay with anxiety.
- **Counter-counter from material.** Source 006 documents that Tribe V2 (a personal-AI-relevant brain encoder) was published in early 2026 with public weights and an interactive demo, under non-commercial license but with privacy regulation already in flight (UN Special Rapporteur Ana Brian Nougrères on the record) [source: sources/006:Privacy / regulatory context]. The *direction* of urgency is corroborated. The *24-month figure* is not. **Partial counter exists.**

### R5. *"Multi-agent disagreement-as-feature loses to single-agent fluency because every successful consumer LLM product has been single-agent and conversational."*

- **Steelman.** ChatGPT, Claude.ai, Gemini, Pi, Perplexity — all commercially successful at consumer scale, all single-agent at the surface. Source 002 documents that users actively choose *not to choose* [source: sources/002:Filter World citation]. A product whose key UX is "watch two agents argue" is fighting the documented user preference. *"Real curation"* (source 002) is a niche; the mass market chose algorithmic curation precisely because it offloaded effort.
- **Counter-counter from material.** Source 005's polyphony argument: human minds are *already* "filled with voices, ideas, and perspectives from countless others" [source: sources/005:Key extracts]. The bet is that a product that mirrors this structure feels more human, not more demanding. **Counter exists, but it is anthropological, not commercial.** No source in the corpus shows a shipped consumer product where multi-agent dissent is the surface and the product wins.

### R6. *"Restoring humanity is a category that cannot be demoed in 24 hours because the failure modes (Filter World, comprehension debt, hollowed-out feeling) are all multi-year longitudinal harms."*

- **Steelman.** Source 002 describes the harm as accumulated over the entire algorithmic era; source 001 frames comprehension debt as a multi-year career-arc problem; source 005's mind-as-collaborative-creation is a developmental claim. None of these reverse in 24 hours because none of them *appeared* in 24 hours. A demo cannot show "restoration" of a longitudinal loss.
- **Counter-counter from material.** Source 001's "deletion test" and "design-before-you-prompt" are *micro-rituals* the same source claims compound over time [source: sources/001:Four unsexy moves]. A demo could show one of those rituals being performed. **Counter exists, but it is a ritual demo, not a restoration demo** — open question whether judges read those as the same.

### R7. *"The 'sponsor sauce intrinsic to the architecture' claim is unfalsifiable because Tribe V2's modality stack (V-JEPA 2 + Wav2Vec2-BERT + Llama 3.2) doesn't include any sponsor product."*

- **Steelman.** Source 006 names the actual model components [source: sources/006:Architecture]. The architectural-anchor synthesis maps modalities to sponsors (audio→Listen Labs, video→Ironside, text→K2) [source: 100:What "Tribe V2 as the special mode" gives us]. That mapping is a category swap: modality is a property of the input, vendor is a property of who provides the model component. Using audio is not the same as using Listen Labs' audio model. The "4 of 5 sponsors hit" claim is sleight of hand.
- **Counter-counter from material.** **No counter exists in current material.** The synthesis does not distinguish "the architecture happens to use modality X" from "the architecture uses sponsor Y's product to provide modality X." This conflation is unaddressed in any source or synthesis file read.

### R8. *"The Karpathy LLM-wiki pattern is the team's actual product, not the audience's product, and the team is therefore building infrastructure they will demo as a feature — the classic researcher's trap."*

- **Steelman.** Source 007 is explicit: *"You're in charge of sourcing, exploration, and asking the right questions. The LLM does all the grunt work."* [source: sources/007:Division of labor] That's a builder workflow. The architectural-anchor synthesis stacks Tribe V2 + agent swarms + LLM-wiki pattern as architectural commitments. Three architectural commitments, none of which is a user-facing surface, increases the gap between "what the team will be excited to show" and "what a judge will press a button on."
- **Counter-counter from material.** Source 007 lists end-user contexts (personal goals, reading a book, course notes, hobby deep-dives) where the pattern is the user's product, not the builder's [source: sources/007:Full essay]. **Counter exists**, but the architectural-anchor synthesis hasn't picked which of those contexts the demo lives in [source: 100:What's NOT yet decided #1].

### R9. *"The auditor diff is invisible to the human because Tribe V2 outputs a 70,000-voxel vector and the auditor checks against 'rules + external reality' [source 004], and neither is a thing a non-technical demo audience can see."*

- **Steelman.** Source 006's source asks the right question: *"Tribe V2 outputs a 70,000-voxel vector. What's the human-legible artifact downstream? A score? A heatmap? A 'this content will make you feel X' sentence? The visualization is the demo."* [source: sources/006:Sharpening questions] The corpus has identified the question and not answered it. Without an answer, the auditor's diff and Tribe V2's prediction are both vectors. Vectors do not produce wow moments.
- **Counter-counter from material.** Source 006 documents that Tribe V2 visualizes modality contributions as RGB on cortex with "yellow at superior temporal lobe" at known bimodal-processing zones [source: sources/006:What it surfaces about the brain]. The output *can* be rendered as a colored cortex map. **Counter exists technically.** Whether a colored cortex map produces a felt-it moment for a non-neuroscience judge is **uncovered by the corpus.**

---

## Method 3 — Pre-Mortem (7 loss-modes traced to research gaps)

Assume HackTech 2026 demo day went badly. For each loss-mode: walk back to the root cause in the current research stack.

### P1. Loss-mode: *Judges did not understand what the demo was doing.*

- **Trace.** The architectural-anchor file enumerates Tribe V2's properties (70K voxels, 54% explainable variance, scaling-law confirmed) [source: 100:What "Tribe V2 as the special mode" gives us] and the agent-swarm coordination pattern [source: 100:What "agent swarms" gives us]. Neither maps to a 15-second judge-legible sentence.
- **Underlying research gap.** No source in the corpus contains a worked example of "explain Tribe V2 + multi-agent dissent in one breath to a non-technical audience." The comprehension layer between architecture and pitch is unbuilt. Lock doc Open Question 3 [source: README.md:Open questions] still open.

### P2. Loss-mode: *The sponsors did not see their own sauce in the demo.*

- **Trace.** Source 006 names Tribe V2's actual components: V-JEPA 2 + Wav2Vec2-BERT + Llama 3.2 [source: sources/006:Architecture]. None are sponsor products. The architectural-anchor file maps modalities to sponsors via category-swap [source: 100:trimodal table], not via integration.
- **Underlying research gap.** No source documents any sponsor's actual product surface, API, latency profile, or integration cost. The five sponsor inboxes are scaffolded but the lock doc itself notes *"the discovery agent failed mid-run with an Anthropic overload error and needs a re-dispatch"* [source: README.md:Where this connects]. The intrinsic-vs.-bolted-on test (S7) cannot be performed against a corpus that does not contain sponsor product details.

### P3. Loss-mode: *Tribe V2 integration didn't ship in time.*

- **Trace.** Source 006 confirms: model weights + GitHub + interactive demo public, fine-tune in ~1 hour on new subjects [source: sources/006:Key extracts]. Non-commercial license. fMRI-temporal-resolution-bound (seconds-scale). No source documents *the actual installation, dependency, or runtime cost* of Tribe V2 in a hackathon laptop / cloud setup.
- **Underlying research gap.** The corpus contains the *capabilities* of Tribe V2 but no entry on the *engineering reality* — GPU requirements, cold-start time, cost per inference, latency in seconds, whether the public demo is the model itself or a wrapped API. The architectural-anchor synthesis treats "we can actually run it in the worktree" [source: 100:trimodal table] as established. It is not established by any source in the corpus.

### P4. Loss-mode: *The auditor's diff was invisible to the human.*

- **Trace.** Per R9 above. The source explicitly raises *"the visualization is the demo"* [source: sources/006:Sharpening questions] and does not answer it.
- **Underlying research gap.** No source documents an existing UX where multi-agent dissent is rendered legibly to a non-technical user. Source 004 is theory; source 006's RGB cortex map is the closest thing to a visual artifact in the corpus and it is a brain map, not an agent-dissent surface. The visualization layer between the architecture and the user is the corpus's largest hole.

### P5. Loss-mode: *The wow-toggle never landed because Tribe V2's seconds-scale latency made the felt-it moment slow.*

- **Trace.** Source 006: *"fMRI is slow — Tribe V2's predictions are at fMRI's temporal resolution (seconds, not milliseconds). Whatever we build has to be OK with second-scale latency on the brain-prediction layer."* [source: sources/006:Cautions]
- **Underlying research gap.** The architectural-anchor synthesis flags Open Question 4 about the killer toggle [source: 100:What's NOT yet decided #4] but the wow-toggle bound by physics is not addressed. The corpus contains the latency floor and the demo aspiration; it does not contain a worked example of a wow-toggle that survives a multi-second pause.

### P6. Loss-mode: *The architecture argument couldn't be summarized in 15 seconds.*

- **Trace.** The architectural-anchor synthesis stacks Tribe V2 + Actor/Auditor/Mediator + LLM-wiki pattern + sponsor stack (5 of 5) + Socratic protocol + B2C-primary-with-B2B-overlay. Six architectural commitments.
- **Underlying research gap.** No source in the corpus tests a single-sentence pitch against any of these six commitments. Source 003's "comment section in flesh" is the closest to a one-line distillation, and it is a *failure-mode name*, not a *product summary*. The corpus has compression for the disease and no compression for the cure.

### P7. Loss-mode: *A judge asked "what does this restore?" and the team gave a 90-second answer.*

- **Trace.** Lock doc: *"What does 'restored' look like in 24 hours of demo? What can a judge press a button on and feel the return of agency / taste / judgment / culture? Without that moment, the theme stays an essay."* [source: README.md:Open questions #3]
- **Underlying research gap.** Open across all 7 sources. Source 005's "restoring the gap between sensory input and motor output" [source: sources/005:Key extracts] is the closest to a measurable target ("the gap returned") and the corpus does not yet contain a UX rendering of that gap.

---

## Method 4 — First Principles (8 atomic claims)

For each: (a) is it actually first-principle or borrowed surface? (b) what does it depend on? (c) what would have to be true for it to break?

### F1. *"Algorithms are erasing the human half of culture."*

- **(a)** Borrowed surface. Frame originates with Chayka's *Filter World* [source: sources/002:Key extracts] and Mina Lee's *Death of Personal Style* [source: sources/002:Key extracts]. Compounded by source 003's "trends slop" claim.
- **(b)** Depends on the assertion that the pre-algorithmic baseline of "real curation" was meaningfully human, AND that algorithmic curation is qualitatively different (not merely faster).
- **(c)** Breaks if pre-algorithmic taste was already mostly imitative (which a fashion historian could argue) OR if the "algorithmic" step is best modeled as a continuation of MTV/radio/magazine curation rather than a phase change.

### F2. *"Surface confidence of AI output is uncorrelated with underlying validity."*

- **(a)** First-principle (architectural). Reduces to: LLMs are trained on plausibility, not correctness. Source 003: *"presentation product, not a thinking product"* [source: sources/003:Key extracts]. Source 001: *"probabilistic translator, not deterministic compiler"* [source: sources/001:Key extracts].
- **(b)** Depends on the *current* training paradigm (next-token / RLHF / DPO). Independent of any specific product.
- **(c)** Breaks if a future model architecture closes the gap (verifier-augmented decoding, retrieval-grounded reasoning at every token, formally-verified output). The corpus does not contain such an architecture; source 006's Tribe V2 is the closest thing to *measurement* of the gap, not its closure.

### F3. *"Comprehension debt is real and accrues silently."*

- **(a)** First-principle (cognitive-economic). Source 001 derives it from Naur's "Programming as Theory Building" (1985) [source: sources/001:Key extracts] — predates LLMs, is a property of any artifact whose theory is held outside its surface.
- **(b)** Depends on the assertion that maintenance, modification, and deletion of an artifact require its theory, not its shadow.
- **(c)** Breaks if AI agents become reliable enough at re-deriving theory from the shadow on demand that the human never needs to hold it. Source 001 explicitly disputes this is currently true ("a probabilistic translator").

### F4. *"Multi-agent disagreement is the binding force of stable systems."*

- **(a)** Borrowed surface, dressed in two analogies. Source 004 imports it from Levin's biology and the US Constitution [source: sources/004:Key extracts]. Both analogies. Neither is a derivation from agent-system principles.
- **(b)** Depends on (i) the analogies actually transferring (the biology / political-science → AI mapping is asserted, not proven in any cited paper), (ii) "disagreement" being a sufficient binding force without an external referee.
- **(c)** Breaks if agent disagreement in practice produces oscillation rather than stability (a known failure mode in multi-agent literature not cited in the corpus). Also breaks if the mediator becomes the de facto single-agent boss.

### F5. *"Tribe V2 measures what content does to a brain."*

- **(a)** First-principle, narrow form. Source 006 establishes: predicts fMRI activity (54% explainable variance, 70K voxels, zero-shot to new people) in response to *external stimuli* [source: sources/006:Key extracts + What it explicitly is NOT].
- **(b)** Depends on (i) fMRI being a useful proxy for "what content does to a person", (ii) Meta's training distribution (movies in scanners) generalizing to consumer content categories, (iii) Tribe V2 inference being deployable in our environment.
- **(c)** Breaks if reverse inference is required for the use case (Ramsoy warning, source 006). Breaks if our content category is outside the training distribution. Breaks if the engineering reality blocks deployment (gap P3 above).

### F6. *"The human mind is already polyphonic."*

- **(a)** Borrowed surface. Source 005's reframe of evolutionary cognition. Beautifully argued, citation-light.
- **(b)** Depends on the metaphor "voices and perspectives from countless others" describing a real cognitive structure rather than a poetic one.
- **(c)** Breaks if the polyphony is a metaphor for "social influence on belief formation" — in which case "AI joins the polyphony" is just "AI shapes belief," which collapses into source 002's Filter World critique. The same metaphor used to justify the cure is identical to the metaphor used to name the disease.

### F7. *"Demo theatre wins HackTech."*

- **(a)** Borrowed surface from observed pattern. Lock doc cites GreenChain's sea→air toggle, FaceTimeOS's consumer surface, Jarvis's click-to-clip [source: README.md:Open questions]; TreeHacks scrape says *"spatial / vision / VLM-grounded (8) and vertical agent stacks (15) are dominant winning archetypes."*
- **(b)** Depends on judge composition, demo-day dynamics, and the assertion that "wow toggle" is necessary, not just sufficient.
- **(c)** Breaks if a sponsor-criterion-heavy judging rubric outweighs demo theatre — currently unknown because the corpus does not contain HackTech 2026's actual rubric.

### F8. *"The team can build all of this in the hackathon window."*

- **(a)** Aspirational. Not a first principle — an engineering-feasibility claim.
- **(b)** Depends on Tribe V2 deployability (gap P3), agent-swarm framework choice (uncovered), sponsor-API access (gap P2), wiki/Karpathy-pattern overhead (potentially competing with build time).
- **(c)** Breaks under any one of the above. The corpus contains no engineering budget against the architectural commitments.

---

## Open Tensions Surfaced (roll-up)

Each tension lists the contradicting sources and is held, not resolved.

### T1. "Augmentation" is the framing AND the trends-slop default.

- Source 003 names *"augmentation"* as one of the four corpus-mean answers AI gives by default to strategic questions [source: sources/003:Key extracts].
- Lock doc adopts *"Augmented human intelligence"* as Johnny's hypothesis frame [source: README.md:Live thread 2026-04-25].
- **Contradiction.** Picking the trends-slop word as the un-trends-slop framing. No source resolves this.

### T2. The 24-month clock has one source and is treated as established.

- Source 004 (unidentified YouTuber, unverified URL) asserts the 24-month figure [source: sources/004:Format + Full transcript].
- Architectural-anchor synthesis treats it as a clock the theme runs on [source: 100:How this maps to the theme].
- Source 006's regulatory environment (UN Special Rapporteur, US state laws in flight) corroborates the *direction* but not the *figure* [source: sources/006:Privacy / regulatory context].
- **Contradiction.** Single-sourced figure adopted as theme-level urgency.

### T3. "Disagreement is the binding force" vs. "users opt out of opt-out."

- Source 004 / 100 architectural-anchor: disagreement-as-feature, friction is the binding force.
- Source 002 (Chayka via the algorithmic-culture YouTuber): *"we are free to choose anything yet the choice we often make is not to have a choice."*
- **Contradiction.** Theme proposes friction-positive UX into a documented friction-negative consumer preference. No counter in the corpus.

### T4. Tribe V2 modality stack ≠ sponsor stack.

- Source 006: V-JEPA 2 + Wav2Vec2-BERT + Llama 3.2 are Meta's components [source: sources/006:Architecture].
- Anchor synthesis: trimodal "Hits 4 of 5 sponsors at the architecture layer" [source: 100:trimodal table].
- **Contradiction.** Modality (audio/video/text) and vendor (Listen Labs / Ironside / K2) are conflated. The intrinsic-vs.-bolted-on test (Open Question 6 in the lock doc) cannot be performed without resolving this.

### T5. "Restoring humanity" is longitudinal; the demo is 24 hours.

- All three theme-foundation sources (001 comprehension debt, 002 Filter World, 005 polyphony) describe multi-year erosions.
- Lock doc Open Question 3: *"What does 'restored' look like in 24 hours of demo?"* [source: README.md:Open questions]
- **Contradiction.** The disease is longitudinal; the demo budget is hours. No source resolves the time-mismatch.

### T6. The polyphony metaphor cuts both ways.

- Source 005: human mind is already polyphonic; the question is whether AI joins or replaces the existing voices [source: sources/005:Key extracts; sharpening questions].
- Source 002: the algorithm has already done the replacing — *"hollowed-out feeling toward ourselves"* [source: sources/002:Key extracts].
- **Contradiction.** Adding more synthetic voices to a polyphony that is *already losing volume* could accelerate the failure mode the theme claims to fight. Not addressed.

### T7. Wow-toggle vs. fMRI-temporal-resolution floor.

- Lock doc Open Question 7 demands a button-press wow moment.
- Source 006: Tribe V2 latency is fMRI-temporal-resolution, seconds-scale, hard physical floor [source: sources/006:Cautions].
- **Contradiction.** The demo-theatre target and the architectural anchor's latency floor are not yet reconciled.

### T8. Reverse inference is the largest failure mode AND the most natural demo claim.

- Source 006: *"Reverse-inference risk is the largest scientific failure mode... If a region lights up, you cannot reliably infer the felt experience. Don't build a UX claim that requires reverse inference."* [source: sources/006:Cautions]
- The natural demo claim ("this content will make you feel X") is reverse inference.
- **Contradiction.** The most demoable framing is the source's most explicit prohibition.

### T9. Karpathy LLM-wiki: pattern as builder workflow vs. user product.

- Source 007: pattern is for the curator (the builder) [source: sources/007:Division of labor].
- Anchor synthesis: pattern is "double-duty" — both content for the theme and operating manual [source: sources/007:How this maps to the theme].
- **Contradiction.** A pattern designed for the builder's workflow is being considered for the audience's product. The two roles want different things from the wiki. Not yet picked.

### T10. The theme's anchor ("un-black-box") vs. the un-black-boxing of architecture-internals to non-technical judges.

- README.md: theme is *un-black-boxing the algorithm for the user* [source: README.md:Distilled].
- Anchor synthesis (Tribe V2 voxels, Actor/Auditor/Mediator triads, LLM-wiki maintenance) is dense architecture; un-black-boxing *itself* requires explanation to a judge.
- **Contradiction.** The architecture chosen to un-black-box for the user is itself a black box from the outside. The corpus contains no compression of this architecture into a 15-second pitch.

---

## Notes for Johnny (no resolutions, just pointers)

- Tensions T1, T3, T6, T8, T10 are the ones the existing material has **no counter** to. They are open by structural lack of evidence, not by oversight.
- Tensions T2, T4, T7 are open by **single-source thinness** and could be closed (or sharpened further) by adding sources or adding deployment-engineering data, not by reasoning.
- Tensions T5, T9 are open by **product-surface decision** (which the Socratic protocol reserves for Johnny).
- Pre-mortem gaps P1, P2, P3, P4 are the four research holes most likely to translate directly into demo-day loss-modes.
- Every Socratic question (S1–S12) and every Red-Team attack (R1–R9) is pointed at material that already exists in the corpus. No new source was invented to construct any of them.
