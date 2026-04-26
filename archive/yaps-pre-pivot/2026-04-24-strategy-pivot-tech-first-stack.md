# YAP: Strategy Pivot — Tech-First Multi-Track Stack

**Source:** Team brainstorm walking back from opening ceremony, late Friday 2026-04-24
**Status:** STRATEGIC SHIFT from earlier "sycophancy thesis"
**Supersedes (in part):** `2026-04-24-opening-team-direction.md` — that file captured the *narrative wrapper*; this file captures the *actual building plan*

---

## 🚨 THE STRATEGIC INVERSION

> "We're doing the complete opposite of what everybody should do — designing something for a problem. We're starting with our tech stack first. Number one reason: we want to do every single sponsored track. The only realistic way to do that is start with what they all ask for, then find a problem to fit."

**Plain language:** This is a **deliberate, conscious tech-first strategy**, not laziness. The team has decided that maximizing sponsored-track coverage requires starting from the intersection of what each sponsor demands, and back-fitting a problem statement into that intersection.

This is risky (judges value impact + problem-fit over clever tech) BUT consciously chosen with eyes open. Mitigation: wrap it all in a strong "augment-not-replace humans" narrative.

---

## 🧱 THE STACK (Building Blocks)

### 1. TRIBE V2 — the novel data source
- **What it is:** Open-source brain-encoding model from Facebook Research
- **What it does:** Input image/video → predicts which regions of a human brain would activate in response (semantic brain mapping)
- **Why it's interesting:** Generates an entirely new modality of "data about the data" — the simulated neural-semantic response to content
- **Used for:** Adding a *novel input source* on top of standard VLM pipelines
- **Verify:** Whether it accepts video natively or just images; latency; output format
- **Concern flagged:** "Was that the study where they were looking how to brain people stay on the gross for longer?" — there may be ethical history with this model lineage. **Need to validate sourcing + framing for the pitch** so we don't accidentally evoke addiction/manipulation tech.

### 2. K2 Think V2 (IFM) — the swarm engine
- **Why we picked it:** Cerebras-backed, **~1,300 tokens/sec inference** — claimed ~10× Claude speed
- **Use case:** Run "swarms" — many parallel reasoning steps OR sequential thousand-step decomposition very fast
- **NOT necessarily about personas/agents** — also valid for: ripping a big document into many pieces, reassembling, re-decomposing
- **Conceptual role in stack:** Take the rich brain-region output from TRIBE V2 and run massive parallel semantic reasoning to disambiguate / synthesize / classify
- **API path:** WhatsApp signup → Junu/team to grab keys ASAP

### 3. Ironside dataset — the testbed
- **Their data:** ~400 hours of egocentric first-person construction-worker video
- **Their current pipeline:** Ask Gemini "what tool is being used?" → "what action?" — chained Q&A narrator
- **Where they fail:** VLMs confuse visually-similar tools (screwdriver vs. hammer) because LLMs "can't see — they regurgitate; the tool looks too similar"
- **Our innovation thesis:** Add brain-region semantic activation (TRIBE V2) as a NEW input signal — the brain "categorizes" tools differently than vision models, giving disambiguation that pure pixel features can't
- **How to access:** Request via Discord (Junu confirmed there's a request flow)

### 4. Listen Labs — the narrative tie-in
- **Theme:** "Simulate humanity / simulate human brain function"
- **Our connection:** TRIBE V2 literally simulates human brain response — direct fit
- **Refinement gap:** Need to attend their **Sat 11 AM talk** before locking exact angle
- **Possible angle:** Use brain-region simulation to model how different humans cognitively process the same content differently — group simulation of cognitive diversity

### 5. Best AI (universal) — automatic stack
- Every project gets the AI rubric
- Our thesis is AI-native by construction

---

## 🎯 EXPLICIT TRACK TARGETING

| Track | Going for? | How we hit it |
|---|---|---|
| Best Use of AI | ✅ YES | Universal — covered by stack |
| **Creativity (main)** | ✅ YES — primary | "We gotta be freaky with our tech" — TRIBE+K2 swarm is novel-as-hell |
| Cybersecurity | ❌ NO | Explicitly dropped: "Oh shoot, never mind, we don't do that" |
| Not So Sexy | ⚠️ MAYBE | "I actually think we can do that" — construction = boring + Ironside is NSS-aligned |
| Listen Labs | ✅ YES | Brain simulation = human simulation |
| **Ironside** | ✅ YES — primary | Use their data + add TRIBE as new input source |
| **IFM K2** | ✅ YES — primary | Core stack component |
| YC | 💭 Open | Not discussed in convo but worth back-fitting |
| Sideshift | 💭 Maybe | "Make this somehow B2C and we get to apply for another channel" — afterthought |
| Palohouse | 💭 Open | Not discussed |

**Reading between lines:** The team is going for **6+ tracks** with one project. This is their explicit goal.

---

## 🏗️ THE CORE LOOP (sketched architecture)

```
Ironside egocentric video
        ↓
   TRIBE V2 (brain encoding)
        ↓
   Brain-region activation maps (semantic, not pixel)
        ↓
   K2 swarm (fast parallel reasoning over activations)
        ↓
   Disambiguated semantic understanding
        ↓
   ??? (USER-FACING OUTPUT — STILL UNDECIDED)
```

**The unknown:** What does the user actually see/use?

Options floated:
- Web dashboard / knowledge graph viz
- 3D scene render with semantic overlays (Ironside's spatial output preference)
- Gather-style 3D world with characters in different "brain regions" (rejected as too cute/art-project)
- iMessage interface (rejected for now, kept as B2C escape hatch)

**Design constraint that emerged:** "Output must look like a STARTUP product, not an art project" — knowledge graphs OK, cute character anims NO. Ethos: problem→solution, professional branding.

---

## 📖 THE NARRATIVE WRAPPER

The pitch story locks like this:
> "Humanity has X. AI has X. We don't replace human creativity / ethics / judgment — we augment human intelligence by combining different sources of information. **Everything always runs through a human end.**"

Frames the project as:
- **Un-blackboxing AI** (showing what the AI is "thinking" via brain simulation)
- **Augmenting human intelligence** (giving humans tools to understand AI processes)
- **Sustainable / ethical AI** (the original sycophancy thesis lives here as wrapper, not architecture)

This narrative wraps the tech-first stack in a problem-first story for judges.

---

## 👥 ROLE ASSIGNMENTS (emerging)

- **Emily Duran** — design lead, non-technical teammate, Framer + visualization mockups (start tonight)
- **Junu** — vision model / spatial AI / Ironside coordination (he did "LLM black box research"); has the deep ML/research grounding
- **Jacob** — quick visualization demos / front-end dev
- **Johnny (you)** — context engineering, AI model harnesses, hackathon orchestrator tooling, PRD generation, infra glue, UX layer thinking; previously built iMessage conversational AI + 3JS Lava Lab world

---

## 🗓️ EXECUTION TIMELINE (per the convo)

### Tonight (Friday, before bed)
1. **Run the Hackathon Orchestrator workflows** (you mentioned context-collector, idea-generator, validate, prd-splitter, pitch-deck — exactly the tooling we're inside right now)
2. **Generate the PRD** — output of tonight is a "2000-line PRD" via Claude → that becomes "the end product no matter what" — the contract that defines tomorrow's work
3. Process: Socratic seminar with the team → train Claude context per teammate (their unique perspectives, problems they've solved, principles they care about) → feed into PRD generation
4. Emily can start design/Framer in parallel
5. Get K2 / TRIBE / Ironside API access locked

### Saturday Morning
- **11 AM — Listen Labs talk** (Johnny + Emily attending) — refine humanity-simulation angle after this

### Saturday Day
- Mockups finalized
- Build phase
- Attend YC talk 4 PM (worth the 1-on-1 partner ideation regardless)
- Attend Ironside fireside 6 PM (mandatory if going for them)

### Sunday Morning
- Final polish
- Ship by 9 AM
- Round 1 demo

---

## ⚠️ THINGS THE TEAM CONSCIOUSLY DOESN'T KNOW YET

1. **The exact problem statement** — they're betting the PRD generation will surface it
2. **The user-facing artifact** — dashboard? app? something else?
3. **The Ironside spatial-output story** — input side covered, output side admitted as "lowkey stretching it"
4. **Whether TRIBE V2 actually works on Ironside-style egocentric construction footage** (untested!)
5. **What "brain-region semantic" actually returns** — they haven't run it; could be useless data
6. **Whether the K2 swarm has a meaningful job to do** with the brain-region outputs — risk of "K2 is here because we wanted K2"

---

## 💡 ORCHESTRATOR NOTES (for me + future workflows)

- **Idea-generator should NOT replace this stack** — it should refine the PROBLEM STATEMENT to fit it
- **Win-validator should stress-test the K2 swarm "job"** — does it have real work to do? Or is it tacked on?
- **Win-validator should also stress-test the Ironside spatial-output gap** — without a clear spatial output story, Ironside score is at risk
- **PRD should explicitly carry a "if TRIBE returns junk on construction video" fallback** — substitute another video domain (consumer videos, YouTube, sports) and pivot the Ironside angle
- **The "humanity / un-blackbox / augment-not-replace" narrative is the unifying glue** — anchor every track pitch to this
- **Sideshift + YC + Palohouse are still open** — should be evaluated in idea-generator as bonus stack-ons, not primary

---

## 🔧 REFINEMENTS FROM 2ND BRAINSTORM CHUNK

### Mirofish ≠ TRIBE V2 — they are separate components

| Component | What it is | Role in stack |
|---|---|---|
| **TRIBE V2** | Facebook Research **brain-encoding model** — predicts brain regions activated by image/video/text | The DATA LAYER — generates new modality of "brain semantics" |
| **Mirofish** | Open-source repo for **spawning swarms of agents to predict anything** | Code reference / pattern source for our K2 swarm orchestration |
| **K2 Think V2** | Fast (1300 tok/s) reasoning model | The COMPUTE LAYER — runs the swarm |

We'll *reference* Mirofish's swarm patterns but probably build natively. The team specifically said: "less of agents and more just like use K2's super fast inference to do thousand sequential steps really quickly."

### Architectural insight — the system is GENERAL-PURPOSE
> "The project itself could be made for any video in particular — but then we could apply for Ironside's track by just using their data."

This means:
- Core stack = general video → brain-encoding → swarm-disambiguation pipeline
- **Ironside is one application** (construction footage) — chosen for the prize and the dataset
- Same architecture pivots to: **Sideshift consumer video** (TikTok/YouTube), **Listen Labs human simulation** (group brain-encoded agents), even **B2C personal use**
- This is the multi-track magic — one architecture, multiple framings

### New idea direction: brain-feedback IMAGE GENERATION
Floated by team (worth keeping):
- TRIBE V2 tells us what brain regions activate
- Use that to **generate "calming" images** ("let's go here, this makes us feel safe")
- Feed images back into Ironside's pipeline to improve disambiguation
- Could become "human society" angle for Listen Labs: agents fleeing "dangerous brain-region" stimuli, gathering around "safe" stimuli

### Front-end exploration: Gather.town-style
- "Stupid little front end where it's a bunch of these agents talking to each other"
- 3D world (gather.town reference) where each agent represents a brain-region cluster
- Visual: agents grouping around "dangerous" brain stimuli, fleeing them, etc.
- ⚠️ TENSION with earlier "no cute character animation, must look startup-professional" rule — needs reconciliation. Possible split: Gather-style for Listen Labs/"human society" demo; clean knowledge-graph dashboard for Ironside/general pitch.

### "Non-deterministic guardrails" angle — brings sycophancy thesis back in
> "Non-deterministic guardrails could be interesting to explore — let's say our problem was preventing biases in certain things, which is why we have to simulate so many encodings or decoding processes with K2."

This **reconciles tonight's tech-first stack with this morning's sycophancy thesis**:
- Use K2 swarm to simulate many different decodings/interpretations of the same content
- Compare results across the swarm to detect bias / sycophancy / blind spots
- "Non-deterministic guardrails" = guardrails that come from ensemble disagreement, not hardcoded rules
- This gives us a SECOND framing axis that pulls in the AI Safety / sycophancy story without abandoning the brain-encoding stack

### Junu's semantic disambiguation insight (technical detail)
The way humans disambiguate "screwdriver":
1. Brain first classifies as **TOOL** (broad category)
2. Then **WORK TOOL** vs. **CULINARY TOOL** (subcategory)
3. Then specific instance

VLMs jump straight to instance recognition based on pixel similarity — that's why screwdriver/hammer collide. **Brain encoding gives us the hierarchical semantic clustering for free.** This is the actual technical wedge against Ironside's Gemini-narrator pipeline.

### "Un-blackbox" demo motif — locked
- The K2 swarm running live = visible "thinking" of the AI
- Knowledge graph: brain region ↔ semantic categories ↔ specific recognitions ↔ confidence
- Show this as *the demo itself* — viewers see the AI's reasoning process exposed
- Tagline candidate: "Anti-blackbox" / "Glass-box AI"

### Status as of late Friday
- ✅ K2 WhatsApp message sent (Junu) — waiting for API key
- ⏳ Ironside dataset request — needs to go through Discord ASAP
- 🔧 PRD generation tonight via hackathon orchestrator (this is what we're inside right now)
- 🎨 Emily starts Framer mockups tonight (independent of PRD outcome — she can refine on Saturday)
- 📅 Listen Labs talk Sat 11 AM (Johnny + Emily) → re-anchor humanity-simulation angle after

### Pitch process insight
> "For design-wise, I think always starting with the pitch deck so that lines division better."

**Pitch deck drives design**, not the other way around. Once PRD locks problem statement, pitch deck outline → Emily's visual direction → Jacob's quick demo iterations. Reverse of typical "design then pitch" flow.

### Johnny's reusable assets (could speed up tomorrow)
- 3JS interactive world from Lava Lab (dashboard loading screen) — possible base for visualization
- iMessage conversational AI — kept as B2C UX escape hatch (strong "no app install needed" pitch for Sideshift)
- Photon-based interaction patterns
- Hackathon orchestrator workflow suite (BMAD) — actively driving our process

### Competitive read from team
- "Not that many competitors" — team's confidence is **high**
- Many sponsored prizes have low cash but high optionality (interviews, hardware, etc.)
- **Ironside is the cash money prize** ($5k 1st) — this is the financial anchor
- Sideshift is the B2C escape hatch if K2/TRIBE/Ironside synthesis lands

