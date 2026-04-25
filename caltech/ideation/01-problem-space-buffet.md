# Problem-Space Buffet — Caltech Hacktech 2026

**Agent:** Agent 1 of 4 (Breadth Ideation sweep)
**Date:** 2026-04-25
**Stack (locked):** Listen Labs (theme/human-centric framing) · Ironside (egocentric video / spatial reasoning data layer) · TRIBE V2 (brain-encoding curveball) · K2 Think V2 swarm (transparent decomposition / anti-blackbox compute) · Best Use of AI (the hard target)
**Positioning:** B2C primary, B2B overlay, "AI for the most people, used properly," cognitive/societal sustainability

---

## Methodology

I treated the locked stack as five fixed *primitives* and ran a domain sweep — picking 20 problem domains and forcing 1–2 ideas per domain so coverage stays wide. For each idea I asked:

1. Can a judge SEE the non-blackbox aspect in 5 minutes? (no = drop)
2. Does TRIBE's brain-encoding feel human-natural here, or sci-fi gimmicky? (gimmicky = drop)
3. Does the K2 swarm have a real, legible job? (decoration = drop)
4. Is Ironside's egocentric/spatial data genuinely needed, or could a webcam fake it? (fake = mark as risky)
5. Does the pitch make a judge feel "yes, AI SHOULD be used this way"? (no = drop)

Ideas that survived all five were written up. Ideas that survived 3–4 were kept with a flagged risk.

The "Best Use of AI hook" sentence is structured as **"AI should be used like ___, not like ___"** because the team's pitch frame is *redefining* what proper AI looks like — every idea must take a stance.

## Web sources consulted (top 5)

1. **Common Sense Media — chatbots unsafe for teen mental health support** (chatbots endorsed harmful behaviors in 32% of opportunities; APA formal advisory) — https://www.commonsensemedia.org/press-releases/common-sense-media-finds-major-ai-chatbots-unsafe-for-teen-mental-health-support
2. **Stateline — AI therapy chatbots draw new oversight as suicides raise alarm** (Adam Raine case; 11 states / 20 laws as of May 2025; Illinois + Nevada total bans on AI for behavioral health) — https://stateline.org/2026/01/15/ai-therapy-chatbots-draw-new-oversight-as-suicides-raise-alarm/
3. **a16z — Top 100 Gen AI Consumer Apps March 2026** (Olivia Moore's product census — what's already won the consumer AI shelf) — https://www.a16z.news/p/top-100-gen-ai-consumer-apps-march
4. **arXiv 2510.13928 — "LLMs Can Get Brain Rot!"** (cognitive decay in models from junk data; ARC drops 74.9 → 57.2; RULER 84.4 → 52.3 — direct architectural support for our "swarm-as-cognitive-health-check" framing) — https://arxiv.org/pdf/2510.13928
5. **STAT News — Voice-first chatbots will exacerbate AI's mental health threat (Apr 16 2026)** (current-events anchor for "AI used wrong" headlines our pitch addresses) — https://www.statnews.com/2026/04/16/voice-chatbots-ai-psychosis-mental-health/

Supporting reads also informed framing: Drexel teen-attachment study, EU AI Act August-2026 transparency provisions (€35M penalties), California SB 18 sexualized-companion restrictions effective Jan 1 2026, Nature Machine Intelligence on emotional risks of AI companions.

---

## Competitive landscape (5 consumer AI products our positioning displaces)

- **Character.AI / Replika / Talkie** — companion chatbots, blackbox by design, parent-of-dead-teen testimony in Congressional record. We are explicitly the *opposite* of these.
- **ChatGPT / Gemini / Claude.ai** — general assistants where the user can't see why the model said what it said. We're the "show-me-the-thinking" rebuttal.
- **BeFreed / Khanmigo / Speak** — learning apps that auto-summarize, encouraging cognitive offloading. We propose an inverse pattern: AI that *forces* engagement.
- **Otter / Granola / Rewind** — passive recorders. We're not "record everything," we're "show what your AI noticed and why."
- **Pi (Inflection) — recently shut down enterprise pivot** — proved that "warm friendly AI" without a load-bearing job loses to general chatbots. Our anti-pattern.

---

## Ideas

### Idea 1: Glass-Box Therapy Companion
- **Problem:** Teen mental-health chatbots endorse harmful advice 32% of the time, are blackboxes, and 1-in-8 adolescents already use them — a regulatory wave is in motion (CA SB 18, NY 3-hour reminder law, IL + NV bans).
- **User:** A 16-year-old already using Character.AI, plus their parent (dual-user product).
- **One demo case:** Teen types "I feel like nobody would care if I disappeared." Screen splits: left = the chat reply, right = a live K2 swarm of 12 reasoners debating ("safety override," "validate emotion," "escalate to human," "gently reframe") with brain-region heatmap from TRIBE showing which reply *we* believe activates safer cognitive pathways. Parent's view sees the reasoning trail, redacted of content.
- **B2C angle:** Free, opinionated companion where every response shows *why*. Tagline: "If you can't see how it thinks, you shouldn't trust it with your kid."
- **B2B angle:** White-label for school districts and pediatric tele-health. EU AI Act compliant by construction (transparency built-in; €35M risk avoidance).
- **Stack mapping:** Listen Labs → simulating the family-system response (teen + parent + clinician personas all reading the same thread) | Ironside → optional phone front-camera EYE-CONTACT signal as secondary modality | TRIBE V2 → brain-encoding the candidate replies to detect ones that activate threat/shame circuits in the *reader* | K2 swarm → multi-perspective safety reasoning live-rendered
- **Best Use of AI hook:** "AI should be used like a glass-walled clinician's office, not like an unmoderated Discord DM."
- **Risk / open question:** Brain-encoding a *response text* (not video) — does TRIBE's text branch land cleanly?

### Idea 2: AI Misinformation Provenance Lens
- **Problem:** A consumer can't tell which clip of a politician is real, AI-edited, or fully synthetic. Existing watermark schemes are publisher-side and broken.
- **User:** A 35-year-old who scrolls news on Instagram during lunch and forwards 2–3 clips a week to family.
- **One demo case:** User pastes a viral 12-sec clip. K2 swarm spawns 30 reasoners — each one a "skeptical journalist" persona checking a different signal (audio compression artifacts, lip-sync drift, contextual claim-vs-record, source chain). TRIBE brain-encoding overlays show which frames trip the brain's "uncanny" response (FFA + amygdala signature). The user sees not "fake/real" but a six-color provenance graph with each agent's reasoning footnoted.
- **B2C angle:** Browser extension + iMessage shortcut. "Show me what to actually believe."
- **B2B angle:** Newsroom desk tool for AP / Reuters / local newsrooms; municipal election-integrity SaaS.
- **Stack mapping:** Listen Labs → simulated "reader population" (12 demographic personas) showing *who* is most likely to be persuaded by this clip | Ironside → spatial/temporal frame consistency checks reusing their pipeline | TRIBE V2 → brain-uncanny detector on synthetic faces | K2 swarm → parallel investigative agents
- **Best Use of AI hook:** "AI should be used like a microscope on other AI, not like another firehose of synthetic content."
- **Risk / open question:** Defamation surface area if we ship a "this is fake" verdict — frame as confidence + reasoning, never binary.

### Idea 3: Dyslexia Reading Co-Pilot
- **Problem:** ~15% of kids have dyslexia. Current AI tutors auto-summarize ("brain-rot" pattern), bypassing the actual neural rewiring those kids need.
- **User:** A 9-year-old in a Title-I elementary school + their teacher (4th grade reading specialist).
- **One demo case:** Kid reads a paragraph aloud into an iPad. TRIBE encodes the text → predicts which brain regions *should* activate for fluent comprehension. K2 swarm runs 20 parallel reading-coach agents, each suggesting a micro-intervention (chunking, phoneme highlight, semantic pre-activation, decodable substitution). Teacher dashboard shows: "Maya's left occipito-temporal region under-activated on multi-syllable words → swarm suggests interventions A/C/E with reasoning chains."
- **B2C angle:** Family subscription, $9/mo, parent gets weekly "neural progress" report.
- **B2B angle:** District-level licensing — IDEA-compliant special-ed reporting auto-generated from glass-box logs.
- **Stack mapping:** Listen Labs → simulated student responses to the same passage across reading-level personas | Ironside → optional iPad-front-camera gaze tracking for fixation patterns | TRIBE V2 → predicted vs. estimated neural activation diff | K2 swarm → micro-intervention generation + ranking
- **Best Use of AI hook:** "AI should be used like a reading coach who shows their work, not like a Cliffs-Notes shortcut."
- **Risk / open question:** Brain-encoding a kid's *reading process* without a real EEG is a model-of-a-model — pitch carefully as "predicted activation" not "measured."

### Idea 4: Site Safety Pre-Mortem (Ironside-native)
- **Problem:** Construction productivity has fallen 30% in 50 years and the leading indicator of incidents is "near-misses no one logs." Ironside captures the video; nobody runs glass-box safety reasoning on it.
- **User:** Site superintendent on a Vantage data-center build.
- **One demo case:** Worker walks past a strut with no fall-arrest tie. Their helmet feed runs through TRIBE → flags "high-threat brain region activation pattern" (we encode what *the worker's brain* would have noticed if attentive). K2 swarm of 8 agents argues whether this is hazard-A vs. hazard-B vs. fatigue-driven ambiguity. Final output: a 6-second video clip with the brain-attention overlay, reasoning trail, and a "what a fresh observer would have caught" annotation. Super gets it on Slack within 60s.
- **B2C angle:** Stretch — solo builders / DIYers can install a hard-hat cam app for $29/mo home-reno safety.
- **B2B angle:** Direct sale to GCs (Ironside's existing customers); insurance-linked premium discount.
- **Stack mapping:** Listen Labs → simulated incident-witness population (would 80% of supers flag this? 30%?) | Ironside → primary data + spatial output | TRIBE V2 → predicted-attention overlay (where *should* a careful brain look?) | K2 swarm → mirror Ironside's auto-classifier → narrator → judge but with brain-attention as 2nd modality
- **Best Use of AI hook:** "AI should be used like a senior foreman riding shotgun, not like a CCTV that just records the lawsuit."
- **Risk / open question:** This is the "obvious Ironside idea" — risks being indistinguishable from what other teams will pitch.

### Idea 5: Post-Stroke Visual Rehab Buddy
- **Problem:** ~800k US strokes per year; visual neglect (hemispatial neglect) affects ~30% acutely and goes under-treated because therapists can't watch a patient's gaze 24/7 at home.
- **User:** A 71-year-old stroke survivor at home + their tele-rehab OT.
- **One demo case:** Patient wears a $20 phone-on-the-fridge or simple webcam. Walks around the kitchen. TRIBE encodes their visual scene, predicting what a healthy brain would attend to vs. what their *currently-impaired* brain likely attends to. K2 swarm runs 10 OT agents proposing micro-exercises. Dashboard shows the OT a heatmap: "Mr. Chen's right-side neglect appears to be improving in the kitchen but worsening in the hallway."
- **B2C angle:** Family-purchased rehab subscription, Medicare reimbursable through tele-rehab CPT codes.
- **B2B angle:** Hospital-system rehab departments; AHA / partner with stroke-recovery nonprofits.
- **Stack mapping:** Listen Labs → simulated population of stroke survivors at varying recovery stages (gives baselines) | Ironside → egocentric phone/webcam video | TRIBE V2 → healthy-vs-impaired attention deltas | K2 swarm → OT-agent intervention planning with reasoning trail visible to clinician
- **Best Use of AI hook:** "AI should be used like an OT who can be in the kitchen at 2 PM, not like a billable telehealth appointment three weeks out."
- **Risk / open question:** Real clinical claims need IRB; pitch as "research-stage assistive" not diagnostic.

### Idea 6: AI Literacy School Bus
- **Problem:** Teachers are watching kids submit AI-written work and don't know whether to praise process, punish output, or reorient. There's no shared vocabulary for "good AI use" vs "cognitive offloading."
- **User:** A high-school English teacher with 130 students.
- **One demo case:** Kid pastes their essay + their ChatGPT prompts. K2 swarm of 6 "graders" (each a different pedagogical philosophy) debates: was this *thinking with* AI or *thinking via* AI? TRIBE encodes the essay → shows which sections likely activate the kid's *own* semantic networks (high engagement) vs. which read like neural-style transfer from a model. Teacher gets a glass-box rubric: "Engagement depth: high in §1, low in §3. Prompt sophistication: improving. Cognitive offload index: 0.34."
- **B2C angle:** Free for students — they get the same view their teacher gets, learn to self-audit.
- **B2B angle:** District licensing; ETS / College Board accreditation pitch for "AI-literate writing portfolio."
- **Stack mapping:** Listen Labs → simulated student-population baseline ("how would 100 ninth-graders write this?") | Ironside → optional screen-recording for prompt-trail context | TRIBE V2 → text-engagement encoding (kid's brain-style fingerprint vs. model-style) | K2 swarm → multi-pedagogy grading committee
- **Best Use of AI hook:** "AI should be used like a writing coach who watches you draft, not like a ghostwriter you hide."
- **Risk / open question:** "Brain-style fingerprint" is a stretch claim — better framed as stylistic-engagement signal; needs careful pitch wording.

### Idea 7: Caregiver Memory Mirror (Dementia)
- **Problem:** 6M Americans have Alzheimer's; family caregivers are exhausted and can't tell what their loved one *actually saw and understood* during a visit.
- **User:** A 52-year-old daughter caring for her 79-year-old father with moderate dementia.
- **One demo case:** Dad wears a button-cam at lunch with grandkids. After the visit, daughter opens the app: a 90-second "experience replay" shows the lunch with TRIBE-predicted brain-activation overlays — green where face-recognition fired, red where it didn't, gold where emotional/reward circuits activated. K2 swarm of 5 geriatric specialists narrates: "He didn't recognize Emma's face but lit up at her laugh — try voice-led greetings."
- **B2C angle:** Family caregiver subscription with weekly review; gentle, never alarming.
- **B2B angle:** Memory-care facilities; integration with AHCA reporting; insurance-funded under chronic-care management codes.
- **Stack mapping:** Listen Labs → simulated cognitive-state populations (mild → severe) for calibration | Ironside → button-cam egocentric video | TRIBE V2 → recognition / reward activation overlays | K2 swarm → care-suggestion narration with empathy guardrails
- **Best Use of AI hook:** "AI should be used like a notebook the caregiver can flip back through, not like surveillance of a sick person."
- **Risk / open question:** Privacy/dignity surface — needs explicit elder-consent flow as part of the demo.

### Idea 8: Kid-Screentime Translator
- **Problem:** Parents see "1h 47m on TikTok" — they don't see *what their kid actually saw*. Parental controls are blunt; existing screentime tools are punitive timers, not understanding.
- **User:** A 38-year-old parent of a 10-year-old + the 10-year-old.
- **One demo case:** Phone-side screen recording for 5 minutes (consent-built-in, kid sees the recording light). TRIBE brain-encodes each video → which clips activated reward / fear / disgust / wonder circuits. K2 swarm of 8 child-development agents writes a 1-paragraph debrief in age-appropriate language: "Maya saw 12 clips; 3 spiked anxiety, 1 was about a school shooting, 5 were funny dogs. Suggested family talk: the shooting clip."
- **B2C angle:** Free family tier with $5/mo premium; positioned as *with* the kid not *on* the kid.
- **B2B angle:** Pediatricians prescribe it; school counselors use weekly snapshots.
- **Stack mapping:** Listen Labs → simulated child-cohort response baselines (what activates an avg 10-year-old?) | Ironside → on-screen video as the egocentric stream | TRIBE V2 → brain-activation overlay on the clips | K2 swarm → child-dev interpretation committee
- **Best Use of AI hook:** "AI should be used like a kitchen-table conversation starter, not like spyware on a kid."
- **Risk / open question:** Capture-side legality (especially under-13 / COPPA) — must be on-device + parent-consented.

### Idea 9: Civic Hearing Watch-Party Engine
- **Problem:** City council / school-board meetings are public and unwatched. Local journalism is gutted. Misinformation about local-gov votes spreads instantly.
- **User:** A 41-year-old PTA member who cares about a school-board vote but can't watch the 3-hour livestream.
- **One demo case:** Live-stream of a council meeting comes in. K2 swarm of 6 personas (newspaper reporter, parent, business owner, ACLU lawyer, opposition staffer, neutral analyst) all listen in parallel and post real-time annotations. TRIBE encodes the audio/video — flags moments where speakers' framing likely triggers different emotional/political brain regions in different listener cohorts. Final output: a 4-minute "watch-party" replay where the user picks which persona to follow.
- **B2C angle:** Free at the city level, donation-supported; "Patch.com but the AI shows its work."
- **B2B angle:** Local newsrooms; civic-tech orgs (Code for America); state-league-of-cities subscription.
- **Stack mapping:** Listen Labs → multi-persona deliberation simulation (textbook fit) | Ironside → meeting-room camera feeds (re-purposed as "egocentric-of-the-public") | TRIBE V2 → emotional/persuasion-signal encoding on speakers | K2 swarm → real-time multi-perspective annotation
- **Best Use of AI hook:** "AI should be used like a civic translator the whole town can audit, not like a partisan summarizer."
- **Risk / open question:** Persona neutrality is a hard pitch — every persona's "reasoning trail" must be visible or trust collapses.

### Idea 10: Glass-Box Court-Filing Reader
- **Problem:** 75% of US civil cases have at least one self-represented litigant who can't afford a lawyer. Existing legal LLMs (Harvey, CoCounsel) are blackbox enterprise tools.
- **User:** A renter being evicted who has 5 days to respond to a court filing.
- **One demo case:** User photographs the filing. K2 swarm of 4 agents (tenant attorney, pro-landlord attorney, paralegal, judge persona) all read it. TRIBE encodes the legalese — shows which sentences likely cause comprehension failure / fear-spike in a layperson reader. Output: plain-English version + the swarm's disagreement points highlighted ("the landlord's attorney would argue X but the judge persona thinks Y is stronger"). Every claim links back to the source paragraph.
- **B2C angle:** Free for self-rep litigants; fund via legal-aid grants + public-interest funders.
- **B2B angle:** Legal aid orgs; bar associations; access-to-justice tech grants.
- **Stack mapping:** Listen Labs → simulated judge / opposing-counsel dispositions | Ironside → optional document scanner (egocentric photo capture pipeline) | TRIBE V2 → comprehension-difficulty encoding on legal language | K2 swarm → multi-role legal reasoning
- **Best Use of AI hook:** "AI should be used like a free legal aid clinic that explains itself, not like an LLM that hallucinates a fake case citation in your motion."
- **Risk / open question:** UPL (unauthorized practice of law) line — frame as comprehension aid, never advice.

### Idea 11: Glass-Box Personal Finance Auditor
- **Problem:** Robo-advisors and AI budgeting apps make blackbox decisions about people's money. The user can't tell when an AI suggestion is influenced by referral economics.
- **User:** A 28-year-old with $4k credit-card debt + $9k savings looking at a "consolidate this loan" suggestion.
- **One demo case:** User screenshots a Mint / Rocket Money / Cred Karma "personalized recommendation." K2 swarm of 5 personas (CFP, behavioral economist, debt-collector defender, frugal grandma, hustle-culture influencer) all roast the suggestion. TRIBE encodes the suggestion's framing — flags loss-aversion / FOMO / urgency triggers. Final output: "Your app suggested X. Here's what each persona says, here's what triggers it pulls. Decide for yourself."
- **B2C angle:** $5/mo personal AI ombudsman; viral via TikTok screenshot-roast format.
- **B2B angle:** State AG offices buying licenses for consumer-protection investigations.
- **Stack mapping:** Listen Labs → multi-persona financial-literacy simulation | Ironside → optional screen-recording on financial apps | TRIBE V2 → behavioral-trigger encoding on UI copy | K2 swarm → multi-persona financial critique
- **Best Use of AI hook:** "AI should be used like a fiduciary committee in your pocket, not like a salesman with a referral link."
- **Risk / open question:** Brittle if financial-services APIs lock us out — make it screenshot-based, not API-coupled.

### Idea 12: ASL & Sign-Language Two-Way Bridge
- **Problem:** ~70M Deaf signers globally, ASL has ~500k US speakers. Live captioning misses signed nuance; existing translation apps are pixel-only and hilariously wrong on classifiers / emotional tone.
- **User:** A Deaf undergrad in a hearing classroom + the hearing prof.
- **One demo case:** Phone on the table watches the lecture. ASL student signs a question. TRIBE encodes the visual signing — predicts which conceptual / emotional brain regions activate (signing has known specialized neural signatures). K2 swarm of 6 translation agents proposes alternative English renderings — student picks which best matches their intent. Reverse direction: prof's spoken answer goes back through swarm → ASL gloss + emotion tags.
- **B2C angle:** Free student tier + family premium.
- **B2B angle:** University accessibility offices; state ADA-compliance budgets.
- **Stack mapping:** Listen Labs → simulated translator-disagreement modeling | Ironside → table-cam egocentric of the signer | TRIBE V2 → sign-language neural-signature encoding | K2 swarm → multi-translation disambiguation
- **Best Use of AI hook:** "AI should be used like a Deaf interpreter who can show you their reasoning, not like an autocaption that mistranslates a slur."
- **Risk / open question:** Deaf-community sensitivity — hearing-team product will be rightly skeptical-received; needs a Deaf advisor on the framing.

### Idea 13: Live-Performance Conductor for Indie Musicians
- **Problem:** Solo performers playing to crowds can't *feel the room* — they can't tell which moment landed and which lost the audience. Spotify analytics don't help live.
- **User:** An indie singer-songwriter playing a 60-person room in Echo Park.
- **One demo case:** A wide-shot phone watches the audience during sound-check + first three songs. TRIBE encodes the audience's micro-expressions and predicts collective brain-state (engagement / boredom / wonder / talking-to-friend). K2 swarm of 4 agents (booker, fellow musician, venue owner, archetypal fan) evaluates each song's audience-arc. Between sets, performer gets a phone notification: "Song 3 → big drop at minute 2; suggest cutting bridge or re-sequencing set order: 4 → 7 → 5."
- **B2C angle:** $15/mo for working musicians; freemium tier.
- **B2B angle:** Venues, festivals, booking agencies, A&R reps.
- **Stack mapping:** Listen Labs → audience-as-society simulation; the very pitch of "listening" | Ironside → wide-angle egocentric-of-stage video | TRIBE V2 → crowd brain-state estimation | K2 swarm → multi-perspective set-coaching
- **Best Use of AI hook:** "AI should be used like a soundcheck partner who can read the room, not like an algorithm that tells you what to play."
- **Risk / open question:** Brain-encoding *audiences* (not the performer) is the inverse of TRIBE's typical mode — needs validation.

### Idea 14: Glass-Box Therapy Notes for Real Therapists
- **Problem:** Real licensed therapists are drowning in documentation. AI scribes (Eleos, Blueprint) are blackbox — therapists can't trust them with high-stakes session notes.
- **User:** An LMFT in solo private practice.
- **One demo case:** Therapist consents → records session. After session, a K2 swarm of 4 clinical roles (CBT therapist, IFS therapist, supervisor, billing/insurance auditor) drafts notes IN PARALLEL with citations to the audio timestamp. TRIBE encodes the patient's spoken affect to flag emotional-state shifts. Therapist sees the disagreement: "the supervisor flags suicidal ideation at 23:14, billing tags this as a 90837. Confirm?" Every claim is one click → audio.
- **B2C angle:** N/A (B2B-only).
- **B2B angle:** Solo & group practices; tele-mental-health platforms.
- **Stack mapping:** Listen Labs → simulated supervisor / second-opinion personas | Ironside → optional in-room camera (gaze, posture as 2nd modality) | TRIBE V2 → patient-affect estimation | K2 swarm → multi-role note drafting with audit trail
- **Best Use of AI hook:** "AI should be used like a supervisor's second pair of ears, not like an opaque scribe that puts your license on the line."
- **Risk / open question:** This is the *only* pure-B2B idea — if we go here, the B2C overlay needs to come from a "patient view" sub-feature.

### Idea 15: Hospice & End-of-Life Companion (Family-Side)
- **Problem:** Families navigating a dying parent are flooded with overwhelming medical info and emotional reactivity; they need a calm, transparent guide that doesn't manipulate them.
- **User:** A 47-year-old daughter making decisions for a hospice-eligible father.
- **One demo case:** Daughter records (with consent) the family meeting with the medical team. K2 swarm of 5 personas (palliative-care MD, social worker, chaplain, financial advisor, the father's own values-as-stated) reflects what was discussed. TRIBE encodes the family members' spoken/visual affect to gently surface "your sister was emotionally overwhelmed in minute 14 — that's the moment the DNR was discussed." Output: a calm, structured summary + a "questions to ask next time" list.
- **B2C angle:** Hospice-network bundled subscription; bereavement-support partners.
- **B2B angle:** Hospice orgs, home-health agencies, faith-based hospital systems.
- **Stack mapping:** Listen Labs → simulated family-system dynamics | Ironside → meeting-room video | TRIBE V2 → family-member affect over time | K2 swarm → multi-discipline guidance
- **Best Use of AI hook:** "AI should be used like a hand on the shoulder during the hardest week of your life, not like another notification."
- **Risk / open question:** Sacred user moment — requires extreme care; not a typical hackathon demo. Could be the moral high-ground play.

### Idea 16: First-Responder Decision Co-Pilot
- **Problem:** EMTs at a scene have 60 seconds to triage. Body-cam footage + scene chaos overload working memory. Glass-box reasoning could help — black-box AI in this context would be disastrous.
- **User:** An EMT on a multi-victim car-crash call.
- **One demo case:** Body-cam streams. TRIBE encodes the visual scene → predicts where a *senior* EMT's attention would go vs. where the rookie's likely went. K2 swarm of 4 senior-EMT-persona agents proposes triage order + reasoning. Audio in earpiece: "Patient B has airway-compromise signs you may have missed at 0:14 — watch the chest." Every recommendation is paired with a one-sentence reason and a back-link to the frame.
- **B2C angle:** Volunteer fire / first-aid-trained civilians (CERT teams).
- **B2B angle:** Fire/EMS agencies, military medics, NGO disaster-response.
- **Stack mapping:** Listen Labs → simulated population of EMT decision-styles for calibration | Ironside → primary egocentric video | TRIBE V2 → expert-attention prediction | K2 swarm → triage decision support with visible reasoning
- **Best Use of AI hook:** "AI should be used like a senior partner whispering in your ear, not like a black-box algorithm that decides who lives."
- **Risk / open question:** Liability minefield — pitch as decision-support, never decision-maker.

### Idea 17: Privacy-Advocate Surveillance Auditor
- **Problem:** Cities are deploying AI surveillance (Flock, gunshot detection, facial recognition) faster than oversight boards can review. Activists need a tool to audit these systems.
- **User:** An ACLU staffer + a city council oversight committee member.
- **One demo case:** User uploads a city RFP for "AI-powered safety platform." K2 swarm of 5 personas (police chief, ACLU lawyer, vendor sales rep, affected resident, technologist) interrogates the document. TRIBE encodes the language → flags euphemism / risk-minimization / authority-appeal patterns. Output: an annotated PDF + a public report-card the council can share. Vendor tactics get exposed inline.
- **B2C angle:** Free for residents to audit their own city's procurement.
- **B2B angle:** ACLU affiliates, EFF, civic-tech orgs; gov-watchdog SaaS.
- **Stack mapping:** Listen Labs → multi-stakeholder deliberation simulation | Ironside → optional video of public hearings | TRIBE V2 → rhetorical-frame detection on procurement language | K2 swarm → multi-perspective audit
- **Best Use of AI hook:** "AI should be used like a flashlight on AI surveillance, not like another camera on the public."
- **Risk / open question:** Self-referential / inside-baseball feel — harder to land emotionally in a 5-min demo.

### Idea 18: Couples & Conflict De-Escalator
- **Problem:** Couples-therapy is expensive and slow to access. Existing relationship apps (Lasting, Paired) are blackbox advice generators that can subtly take sides.
- **User:** A couple (early 30s) in a recurring fight about finances.
- **One demo case:** Both partners (consent-built-in) record themselves separately giving their side, 90 seconds each. K2 swarm of 4 personas (Gottman-trained therapist, IFS-trained therapist, financial counselor, "fair friend") summarizes each side back to the other in non-inflammatory language. TRIBE encodes both speakers' affect to surface where each felt unheard. Final view: a side-by-side "what each partner actually wanted" overlay with reasoning visible.
- **B2C angle:** $12/mo couple subscription; positioned as "homework between sessions" not therapy replacement.
- **B2B angle:** EAPs (employer wellness benefits); marriage counselors.
- **Stack mapping:** Listen Labs → couple-as-2-person society sim | Ironside → optional facing-camera for both partners | TRIBE V2 → mutual-affect mapping | K2 swarm → multi-modality therapeutic reframe
- **Best Use of AI hook:** "AI should be used like a referee both spouses can audit, not like a relationship guru with a hidden bias."
- **Risk / open question:** Domestic-violence safety surface — must explicitly route DV signals to human resources, glass-box the routing rule.

### Idea 19: Hometown Athletics Coaching for Kids
- **Problem:** Youth sports overemphasizes results; parents and coaches lack tools to see if a kid is *learning* or just *performing*. AI sports analytics today is pro/college only and blackbox.
- **User:** A youth soccer coach for a U-12 rec team + the parents.
- **One demo case:** Game-day phone-on-tripod video. TRIBE encodes the game footage → predicts which moments engaged each kid's *decision-making* circuits vs. just motor execution. K2 swarm of 3 personas (positional coach, child-dev psychologist, fellow parent) outputs a postgame note per kid: "Lily — 3 great defensive reads at 12', 28', 44'; her decision-making is ahead of her foot speed." Reasoning visible.
- **B2C angle:** Free for coaches; $4/mo per family for parent reports.
- **B2B angle:** Youth-sports leagues, school districts, US Soccer Foundation.
- **Stack mapping:** Listen Labs → multi-stakeholder youth-sports persona sim | Ironside → sideline egocentric video | TRIBE V2 → decision-vs-execution attention split | K2 swarm → multi-perspective per-kid postgame
- **Best Use of AI hook:** "AI should be used like a developmental coach who sees each kid's growth, not like a scout who only counts goals."
- **Risk / open question:** Adjacent products exist (Trace, Veo) — differentiation is glass-box + per-kid framing.

### Idea 20: Faith-Community Sermon & Scripture Companion
- **Problem:** Pastors and study leaders are increasingly using LLMs to draft sermons; congregations have no way to know what's been AI-generated, what's interpreted, what's source-text.
- **User:** A pastor preparing a Sunday sermon + the congregation reading along.
- **One demo case:** Pastor uses the tool to draft. K2 swarm of 4 personas (church historian, reformed-theology scholar, liberation-theology scholar, congregant-everyday-person) interrogates each paragraph. TRIBE encodes the language → flags rhetorical patterns that could trigger out-group / in-group brain responses (us-vs-them framing). Pastor ships sermon WITH a public "reasoning trail" footnoted with sources. Congregants can tap any line to see the swarm's debate.
- **B2C angle:** Free for clergy; congregation-side reader app freemium.
- **B2B angle:** Denominational publishing houses; seminary tools.
- **Stack mapping:** Listen Labs → multi-tradition theological-perspective sim (textbook fit) | Ironside → optional video of delivery for emphasis-tracking | TRIBE V2 → rhetorical-trigger detection | K2 swarm → multi-tradition theological auditing
- **Best Use of AI hook:** "AI should be used like a study-circle of theologians who all show their reasoning, not like a ghost-writer in the pulpit."
- **Risk / open question:** Cross-faith neutrality is hard; could position as "tradition-aware" not "tradition-neutral."

### Idea 21: Renewable-Project Community Brief
- **Problem:** Solar farms, wind projects, transmission lines — opposed locally because community comms are blackbox PR. Real climate work depends on local consent that informed-deliberation tools don't provide.
- **User:** A rural homeowner near a proposed transmission line + the project developer.
- **One demo case:** Homeowner uploads the developer's 200-page environmental review. K2 swarm of 5 personas (project engineer, homeowner, ecologist, county zoning officer, indigenous-land advocate) reads it. TRIBE encodes the language → flags omitted concerns vs. addressed ones. Output: a personalized 1-pager + a public "what each stakeholder would care about" map. Developer gets the same view from the resident's side.
- **B2C angle:** Free for residents during NEPA / public comment windows.
- **B2B angle:** Renewable developers wanting better community engagement; state energy offices.
- **Stack mapping:** Listen Labs → multi-stakeholder community-deliberation sim | Ironside → optional drone footage for spatial framing | TRIBE V2 → omission-vs-addressing detection on policy language | K2 swarm → multi-stakeholder NEPA reasoning
- **Best Use of AI hook:** "AI should be used like a town-hall translator both sides can audit, not like a PR firm hiding the trade-offs."
- **Risk / open question:** Neutrality across "developer" and "resident" personas requires careful UX.

### Idea 22: Cognitive-Sustainability Coach for Knowledge Workers
- **Problem:** Knowledge workers are over-relying on LLMs ("brain rot" — see arXiv 2510.13928); they can't tell when they've stopped thinking and started copy-pasting.
- **User:** A 27-year-old PM at a tech company who uses ChatGPT every 8 minutes.
- **One demo case:** Browser extension watches their writing day (consent-built-in). At the end, K2 swarm of 4 personas (cognitive scientist, senior PM, the user's "best self," the user's "tired self") replays the day: "You drafted 11 things; on 8 of them, you copy-pasted within 30 seconds of the first AI response — those 8 felt the same to your prefrontal cortex as scrolling Twitter (per TRIBE estimates). On the 3 you iterated, you actually engaged." Suggested next-day micro-interventions visible with reasoning.
- **B2C angle:** $9/mo personal cognitive-sustainability subscription.
- **B2B angle:** Enterprise wellness programs; companies positioning AI rollouts responsibly.
- **Stack mapping:** Listen Labs → simulated worker-population cognitive-engagement baselines | Ironside → desktop screen-recording as the egocentric stream | TRIBE V2 → engagement-vs-disengagement neural pattern estimate | K2 swarm → multi-perspective day-replay
- **Best Use of AI hook:** "AI should be used like a personal trainer who tells you to do the rep yourself, not like an autopilot that does the work for you."
- **Risk / open question:** This is the *most* on-thesis idea for our cognitive-sustainability framing — risks being preachy unless the demo is delightful.

### Idea 23: Glass-Box Podcast & Content Auditor
- **Problem:** Long-form podcasts (3-hour Joe Rogan, etc.) shape political views with zero fact-check infrastructure. AI content-moderation is blackbox + always too-late.
- **User:** A 33-year-old listener who wants to hear contrarian voices but doesn't want to be quietly radicalized.
- **One demo case:** User pastes a podcast link. K2 swarm of 5 personas (subject-matter expert, journalist, opposing-viewpoint advocate, fact-checker, "your friend who fell down the rabbit hole") all listen. TRIBE encodes the audio → flags moments of high persuasive-affect engineering. Output: a chapter-by-chapter "what was claimed, what's true, what's spin" map with reasoning trail. Listener can opt-in to live in-ear "second opinion" overlay.
- **B2C angle:** $7/mo media-literacy subscription; viral via shareable annotated clips.
- **B2B angle:** News orgs, academic institutions, public-broadcasting partnerships.
- **Stack mapping:** Listen Labs → multi-persona listener simulation | Ironside → audio-as-temporal stream | TRIBE V2 → persuasion-affect detection on speech | K2 swarm → multi-perspective podcast critique
- **Best Use of AI hook:** "AI should be used like a media-literacy class running in your earbuds, not like an algorithm that picks your next podcast."
- **Risk / open question:** Free-speech optics — must be opt-in, never default-on.

### Idea 24: Game-Stream Mental-State Coach
- **Problem:** Esports + game streamers face high burnout / tilt / parasocial pressure. Existing wellness apps don't understand a 14-hour Twitch grind.
- **User:** A Twitch streamer with 5k followers playing competitive games 8 hrs/day.
- **One demo case:** Streamer's webcam + game-screen feed. TRIBE encodes both → estimates streamer's brain-state (focus / tilt / fatigue / dissociation). K2 swarm of 4 personas (sports psychologist, fellow streamer, the streamer's "future self," gameplay coach) gives gentle in-stream nudges (visible to streamer only): "You've been in tilt for 23 minutes — your last 4 deaths were repeat patterns. 5-min break recommended. Reasoning: ↓"
- **B2C angle:** Free for streamers; $12/mo for analytics history.
- **B2B angle:** Esports orgs, gaming companies, university esports programs.
- **Stack mapping:** Listen Labs → simulated viewer-population reaction baselines | Ironside → webcam + screen as dual egocentric streams | TRIBE V2 → streamer brain-state estimation | K2 swarm → multi-perspective coaching
- **Best Use of AI hook:** "AI should be used like a coach in your headset who cares about you, not like a chat-mod who only cares about engagement."
- **Risk / open question:** Streamers are wary of "AI watching them" — consent + visible-reasoning loop must be the headline feature.

### Idea 25: Compliance Co-Pilot for Small Business
- **Problem:** Small-business owners face an avalanche of regulations (OSHA, ADA, state tax, local zoning, EU AI Act if they touch ML) and existing compliance SaaS is enterprise-priced + blackbox.
- **User:** A 4-employee restaurant owner navigating a county health-code letter.
- **One demo case:** Owner photographs the letter. K2 swarm of 4 personas (small-business attorney, county inspector, fellow restaurateur, sympathetic CPA) reads it. TRIBE encodes the language → flags fear-trigger phrases vs. actual obligations. Output: 3-step action list with deadlines, plus a glass-box "what each persona thinks" panel. Owner can drill into any sentence.
- **B2C angle:** Self-employed solopreneurs, contractors, food-truck operators.
- **B2B angle:** SMB-focused vertical SaaS partnerships; chambers of commerce; SCORE.
- **Stack mapping:** Listen Labs → simulated stakeholder personas around a compliance event | Ironside → document-photo capture pipeline | TRIBE V2 → fear-trigger encoding on bureaucratic language | K2 swarm → multi-role compliance reasoning
- **Best Use of AI hook:** "AI should be used like a CPA who explains the form, not like a doom-loop chatbot that hallucinates penalties."
- **Risk / open question:** UPL / unauthorized-practice line again — reasoning aid, not advice.

### Idea 26: Dating-App Conversation Reality Check
- **Problem:** Dating apps now use AI to write messages; people are increasingly catfished by AI-generated personas. Trust is collapsing.
- **User:** A 31-year-old dating-app user who's tired of bot vibes.
- **One demo case:** User pastes a few message exchanges (consensual; fully on-device). K2 swarm of 5 personas (LLM detection expert, dating coach, FBI romance-scam unit, fellow user, the user's "wise friend") reads them. TRIBE encodes the message style → flags AI-fingerprint patterns + emotional-engineering tropes. Output: "76% confidence this is AI-assisted; 12% chance romance-scam pattern; here's why — every claim with reasoning."
- **B2C angle:** $4/mo subscription, viral via TikTok screenshot reaction format.
- **B2B angle:** Dating platforms could license the safety layer; AG offices for fraud prevention.
- **Stack mapping:** Listen Labs → simulated user-vulnerability profiles | Ironside → optional screen-record context | TRIBE V2 → text-style fingerprinting | K2 swarm → multi-perspective authenticity check
- **Best Use of AI hook:** "AI should be used like a friend reading the texts over your shoulder, not like a scammer ghostwriting both sides of a romance."
- **Risk / open question:** Privacy of conversation partners — must process on-device only.

### Idea 27: Studio Co-Pilot for Visual Artists
- **Problem:** Generative-AI image tools (Midjourney, Sora) feel like they replace artistic process, not augment it. Working artists feel both threatened and tempted, with no middle path.
- **User:** A 29-year-old freelance illustrator working on a children's-book commission.
- **One demo case:** Artist sketches on iPad. TRIBE encodes their *sketch-in-progress* → flags moments where the visual aligns with what evokes target emotional brain regions (wonder, comfort) in a 5-year-old reader population. K2 swarm of 4 personas (art director, child-development reader, fellow illustrator, the artist's own "voice") gives reasoning-visible feedback: "Spread 7 — the swarm split: 3 think too scary for ages 4-6, 1 disagrees. Brain-encoding suggests amygdala activation higher than your other spreads."
- **B2C angle:** $19/mo for working artists; freemium for hobbyists.
- **B2B angle:** Publishers, ad agencies, animation studios.
- **Stack mapping:** Listen Labs → simulated reader-population responses | Ironside → over-the-shoulder iPad capture | TRIBE V2 → audience-emotion estimate from artwork | K2 swarm → multi-role critique with visible reasoning
- **Best Use of AI hook:** "AI should be used like an art director with a window into the reader's mind, not like a Midjourney prompt that replaces the artist."
- **Risk / open question:** Artist community (rightly) wary of any AI in their workflow — consent + augmentation framing must be airtight.

### Idea 28: Citizen-Science Bird & Nature Annotator
- **Problem:** Citizen-science apps (Merlin, iNaturalist) are great for species ID but blackbox; users learn the *answer* without learning *how to see*.
- **User:** A retiree birder + a curious 11-year-old getting into birds.
- **One demo case:** Phone records 20 sec of a bird in a tree. K2 swarm of 4 personas (Cornell ornithologist, master birder, beginner birder, illustrator) all describe what they see. TRIBE encodes the visual → predicts which features a *trained* birder's brain attends to vs. a beginner. User sees: "Merlin says Western Tanager; here's why — the swarm focused on the wing-bar pattern at 0:08, the rump color at 0:14. Try noticing those next time."
- **B2C angle:** Freemium; partners with Audubon, Cornell Lab.
- **B2B angle:** National parks, school field-trip programs.
- **Stack mapping:** Listen Labs → simulated naturalist-skill-level observer sim | Ironside → handheld phone egocentric video | TRIBE V2 → expert-vs-novice attention prediction | K2 swarm → multi-skill-level explanation
- **Best Use of AI hook:** "AI should be used like a master naturalist teaching you to see, not like Shazam-for-birds that gives you a label and walks away."
- **Risk / open question:** Soft demo — needs to FEEL wonderful, not academic.

### Idea 29: Glass-Box Reading Log for Adult Self-Education
- **Problem:** Adults read books to learn but increasingly use AI to summarize ("brain rot"). Lifelong learners need an inverse: AI that increases engagement depth, not replaces it.
- **User:** A 41-year-old non-fiction reader trying to actually internalize hard books.
- **One demo case:** User photographs a page or hits a Kindle highlight. Instead of summarizing, K2 swarm of 4 personas (skeptic, true-believer, historical context expert, the user's *prior* notes) ASK questions back: "You've highlighted 3 things by this author; you previously underlined a contradicting claim by [other author] in 2024 — how do you reconcile?" TRIBE encodes the reading-engagement state to nudge re-reading vs. proceeding.
- **B2C angle:** $7/mo; positioned as anti-Blinkist.
- **B2B angle:** Libraries, adult-ed programs, MBA / continuing-ed providers.
- **Stack mapping:** Listen Labs → simulated reader-archetype responses | Ironside → optional camera on the open book | TRIBE V2 → reading-engagement signal | K2 swarm → multi-perspective Socratic prompts
- **Best Use of AI hook:** "AI should be used like a study group that asks better questions, not like a Cliffs-Notes app that does the reading for you."
- **Risk / open question:** Easy to accidentally feel like Anki or Roam — differentiation is the swarm + brain-engagement signal.

### Idea 30: Professional Chef's Glass-Box Recipe Reasoner
- **Problem:** Restaurant kitchens are increasingly using AI for menu R&D and cost optimization; chefs feel their craft is being flattened by blackbox dietary / cost / "trend" optimization.
- **User:** Chef-owner of a 30-seat neighborhood restaurant.
- **One demo case:** Chef snaps a photo of a draft menu. K2 swarm of 5 personas (line cook, food critic, ingredient-cost analyst, regular customer, dietitian) critiques. TRIBE encodes a *visualization* of each dish to estimate diner-perception (comfort / surprise / craving). Chef sees: "Persona disagreement on dish 4 — the line cook says it's a labor nightmare at brunch, the critic loves it. Reasoning visible." Chef makes call.
- **B2C angle:** $29/mo for solo chefs; freemium for home cooks.
- **B2B angle:** Restaurant groups, hospitality schools, culinary R&D consultancies.
- **Stack mapping:** Listen Labs → multi-persona-customer simulation | Ironside → optional kitchen-cam egocentric stream | TRIBE V2 → dish-perception emotion estimate | K2 swarm → multi-role menu critique
- **Best Use of AI hook:** "AI should be used like a sous-chef who explains every suggestion, not like an algorithm that flattens your menu into chain-restaurant slop."
- **Risk / open question:** Niche persona — strong if we hit it well, weak if we feel "we made a foodie demo."

---

## Diversity Audit

| Domain | Ideas | Notes |
|---|---|---|
| Healthcare / mental health | 1, 5, 7, 14, 15 | Hit hard — mental-health is the strongest current-events anchor |
| Education / learning | 3, 6, 29 | Kids (Idea 3), teens (6), adults (29) |
| Civic / journalism / misinformation | 2, 9, 17, 21, 23 | Strong — multi-perspective swarm is uniquely good for this |
| Creative tools | 13, 27, 30 | Music (13), illustration (27), culinary (30) — covers performing/visual/applied arts |
| Accessibility | 5, 12 | Stroke rehab + ASL — both reuse Ironside's primary modality genuinely |
| Workplace / productivity | 22 | One strong idea; cognitive-sustainability for knowledge workers |
| Industrial safety / blue collar | 4 | One Ironside-native idea (per instruction not to cluster) |
| Family / relationships / care work | 7, 8, 18 | Dementia, screentime, couples — three different life stages |
| Religion / spirituality / philosophy | 20 | One — sermon companion; under-explored white space |
| Legal / compliance / contracts | 10, 25 | Self-rep litigant + SMB compliance |
| Finance / personal economics | 11 | One — personal-finance auditor; could double up if slot opens |
| Climate / sustainability (literal) | 21 | Renewable-project community-brief; intentionally not the only "climate" framing because brief said cognitive sustainability is the main angle |
| Sports / fitness / coaching | 19, 24 | Youth soccer + Twitch streamer (esports as fitness-adjacent) |
| Gaming / entertainment | 24 | Stream-coach idea doubles as gaming |
| Elder care / dementia / memory | 7 | Dementia-caregiver companion |
| Children's screen time / development | 8 | Screentime translator |
| Social media moderation / wellbeing | 23, 26 | Podcast auditor + dating-app reality check |
| Therapy / counseling | 1, 14, 18 | Three angles: teen-companion (B2C), therapist-tool (B2B), couples (B2C) |
| Civic safety / first response | 16 | EMT decision co-pilot |
| Mass surveillance / privacy advocacy | 17 | Surveillance auditor |
| Philosophy / wonder (citizen science) | 28 | Bird/nature annotator — covers "delight" axis |

**Domains intentionally light or skipped:**
- **Pure climate (carbon, energy modeling):** brief was explicit — *cognitive* sustainability, not *climate* sustainability. Idea 21 covers community-deliberation around climate projects, which is the honest fit.
- **Pure cybersecurity:** track was dropped (per `track-strategy.md`); no reason to ideate into it.
- **Pure construction:** capped at 1 idea per instruction (Idea 4) — Ironside slot used genuinely without cannibalizing other domains.
- **Hardware-dependent ideas (XR/VR specific, EEG specific, robotics):** brief said "no hardware we don't have."

---

## Top 5 ideas I find most promising (and why) — 200 words

1. **Idea 1 — Glass-Box Therapy Companion.** Hardest-target track win. Adam Raine + 32% harmful-response stat = a *real* current-events anchor judges have read this week. Demo is 5-second devastating: split-screen of opaque chatbot vs. our reasoning trail. Hits Best Use of AI dead-center: redefining what proper consumer AI means.
2. **Idea 22 — Cognitive-Sustainability Coach.** The most on-thesis idea for our "AI sustainability for the next generation" wrapper. Browser extension is buildable in 36 hrs. Direct line to the "brain rot" arXiv paper Olivia/judges have likely seen.
3. **Idea 9 — Civic Hearing Watch-Party.** Best Listen Labs fit (multi-persona deliberation is the literal brief). B2C + B2B work cleanly. Visceral demo: real local-government livestream live-annotated by 6 personas.
4. **Idea 4 — Site Safety Pre-Mortem.** The Ironside-native fallback if data lands well. Their judges will *recognize* the architecture (it mirrors their own pipeline). Risk: it's the obvious idea every Ironside-targeting team will ship — so we'd need to win on the brain-attention layer.
5. **Idea 8 — Kid-Screentime Translator.** B2C fundability story is strongest here (every parent buys it). Hits Sideshift + Best AI cleanly. Differentiator: *with* the kid, not *on* the kid — the trust-architecture is the product.
