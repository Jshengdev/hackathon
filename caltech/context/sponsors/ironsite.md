# Sponsor: Ironsite × Hacktech

## Official
- **Prize:** $5k (1st), $2k (2nd), $1k (3rd) — all with interviews
- **Brief:** "Pinpoint a key spatial task where current models fail. Create an innovative solution to solve the problem. Demo your technique. API Credits provided."
- **Link:** caltech.ironsite.ai
- **Talk:** Saturday 6–7 PM Fireside (ANB 104) — MUST ATTEND

## What They ACTUALLY Want (read between lines)
- **Spatial reasoning** is their core domain — Ironsite is building infra/models for spatial AI (autonomous systems, robotics, AR/VR, geospatial, 3D scene understanding)
- "**Where current models fail**" — they want **failure-mode discovery first, then fix**. Show that you actually probed model limits with rigor before proposing a solution.
- "Demo your technique" — they want a **method**, not just an end product. A clever architectural insight, novel evaluation, prompt strategy, or fine-tuning trick.
- API credits provided = they want you using their stack. Sign up early.
- Largest cash prize of any sponsor ($5k 1st) + interview = strong career signal

## How to Win
- **Pick a narrow, demonstrable spatial failure mode** — e.g., perspective ambiguity, occluded object reasoning, multi-frame consistency, indoor floor-plan reconstruction from sparse views, ego-motion estimation in degraded conditions
- Build a **before/after comparison**: baseline model fails → our method succeeds → here's the technique
- Use their API as a **first-class tool**, not a side dependency
- Quantify (accuracy %, latency, sample efficiency) — Ironsite is a technical sponsor; numbers persuade

## Strategic Fit For Us
- Requires technical chops in vision/3D/spatial — feasible if our 3 technical people have ML background
- $5k cash + interview is a strong consolation if we don't win the main tracks
- Lower competition than YC (more specialized)

## Action Items
- [ ] Sign up for API credits early (Friday night)
- [ ] Attend Saturday 6 PM fireside — they'll reveal evaluation criteria

---

## Live Signal — Opening Ceremony (2026-04-24)

### Founders Pitched Themselves
- **Ken (CEO):** 11 years in structural concrete, built high-rises in SF, oversaw $300k man-hours and 150k cubic yards of concrete placement. **Domain expert from outside tech.** First time at Caltech.
- **Dani (CTO/Research):** Ex-Google YouTube DeepMind, worked on image/video gen models, went to Edge(?). Pure research background.
- **Started 16 months ago. $13M raised. Just hired employee #31.**

### The Real Problem They're Tackling
- **Construction productivity has DECREASED 30% over the last 50 years**
- Not a people problem — a **DATA problem**: "if you can't measure it, you can't manage it"
- Buildings more complex, schedules compressed, mandate to build more data centers than ever
- Customers named: **Vantage Data Centers, Crusoe Data Centers** (note: **all data center construction** — riding the AI infra boom)

### Their Stack (concrete!)
- Ruggedized **modular AR camera system inside a hard hat** ("smart AR helmet")
- Captures **8–12 hours of egocentric first-person POV video per worker per day**
- AI processes the footage, classifies how time was spent → "fantasy football stats for construction"
- **Currently capturing ~500 hours/day of video** across all sites
- Deploying **300 more devices in next 3 months**

### The Track Brief — Refined
- Dani's framing: innovation comes in **S-curves**. Last big curve = **reasoning/RL**. We're plateauing.
- **Next big curve = SPATIAL INTELLIGENCE** — models understanding the physical world and contextual relationships of objects
- **State-of-the-art VLMs FAIL at:**
  - Object permanence
  - Counting
  - Complex unstructured environments
  - Construction-site-style scenes (changing tools, situations, layouts)
- They're training models on **tens of thousands of hours of egocentric footage**
- The challenge: **"Crack spatial intelligence"**
- **Two acceptable formats:**
  - Innovative product/demo that pushes the frontier
  - **Mini research papers** — hypothesis-driven, prove/disprove something previously unknown

### Founder Wisdom Shared
- "Talk to people NOT from your world" — Ken explicitly said hackers should connect with non-tech domain experts to find real problems
- "You all have incredible skills, but connecting with people like me [construction folks] is super important to building something that solves a real problem in a big market"
- Ironside frames itself as **"the not-so-sexy industry of construction"** — they would respect a Not So Sexy stack

### Office Hours Confirmed
- Around tonight + tomorrow at **5 PM** for office hours
- Around all weekend — go talk to them

### Strategic Read for Our Thesis
- Spatial intelligence is **NOT** on the team's current sycophancy thesis
- **PURSUING IRONSITE = PIVOTING THE PROJECT** away from current direction
- Their offer of "mini research paper" format is interesting — lower-effort entry path
- If we want Ironside, we'd need a totally different idea. Currently looks like a track to consciously SKIP unless we re-ideate.

---

## UPDATE — Ironside is now PRIMARY (post-team-brainstorm Friday night)

The team has pivoted to a tech-first multi-track stack with **Ironside as a primary target** (see `yaps/2026-04-24-strategy-pivot-tech-first-stack.md`).

### Our planned approach
- **Use Ironside's egocentric construction video data** (~400 hours, request via Discord)
- **Add TRIBE V2 (Facebook Research brain-encoding model)** as a *novel input source* — it predicts which brain regions activate in response to images/video, providing a "semantic" signal that pure VLMs lack
- **Use K2 Think V2's fast inference** to run swarms of disambiguation tasks on the brain-region outputs
- **Hypothesis:** Brain-region activation can disambiguate visually similar objects (screwdriver vs. hammer) by using semantic categorization that exists in the brain but not in pixel-space VLMs

### Ironside Pain Points We're Solving
- Their current pipeline: Gemini Q&A narrator (observer asks "what tool? what action?")
- Failure mode: tools look too similar visually → VLM regurgitation, not understanding
- Our wedge: brain-encoding gives semantic clustering ("tools" → "work tools" vs "culinary tools") that resolves visual ambiguity

### Open Questions to Validate at Saturday 6 PM Fireside
- [ ] Does TRIBE V2 even work on construction-style egocentric video?
- [ ] What does Ironside actually mean by "spatial visualization" output requirement?
- [ ] Is "novel input modality + better disambiguation" enough to win, or do we need 3D scene reconstruction?
- [ ] Get clarity on data access flow via Discord — when can we have data in hand?

### Risks
- TRIBE V2 was trained on consumer media (likely YouTube-style content) — may produce noise on industrial footage
- Ironside scoring rubric may weight 3D spatial output heavily; our pipeline produces semantic-disambiguation, not 3D scene
- "Mini research paper" format may be a better fit than product demo if the disambiguation result is interesting but not user-facing

### Data Access Action
- [ ] Junu requests Ironside dataset via Discord ASAP Friday night
- [ ] Have a fallback dataset (consumer YouTube, Ego4D, sports broadcast) in case Ironside data delivery is delayed

---

## 🎯 PERSONAL CONVERSATION WITH IRONSIDE TEAM (Friday)

### Their reaction to our pitch
- **They thought the brain-visualization angle was "really interesting"** — direct signal of fit
- They are explicitly looking for **spatial things**, not just any innovative input

### Their internal pipeline (revealed)
Ironside currently runs a **3-step processing chain** on the egocentric video. This is gold — we can mirror this structure with our agent swarm.

| Step | What it does | Why it works |
|---|---|---|
| **1. Auto-classifier** | Auto-classifies what's in frame | Adds structure on top of raw pixels |
| **2. Narration** | Narrates what's happening (action descriptors) | Adds temporal/causal context the classifier misses |
| **3. Observer LM as Judge** | Q&A flow — asks clarifying questions about details, pieces them together at the end | Resolves ambiguities the first two steps surface |

### A failed experiment they ran (DO NOT REPEAT)
- They tried **augmenting the hands themselves** (highlighting them in the video) → made performance **WORSE**
- Lesson: visual augmentation of the subject can confuse the model. Augmentation should add *new modality*, not modify existing pixels.

### Their suggested direction (from us asking)
- They mentioned **using a camera ALONGSIDE the video** — a second sensor stream provides the spatial reasoning the model was missing
- Adding a *parallel data stream* about what's happening dramatically improves classification
- **Our hypothesis maps directly:** brain-encoding output is the "second stream" — gives the model semantic context that pixel-only video lacks

### What this means for our build
- Our K2 swarm should **structurally mirror** Ironside's 3-step process:
  - Brain-encoding extracts (Step 1: classify)
  - Swarm narrates / interprets in parallel (Step 2: narrate)
  - Swarm-as-judge resolves disagreement / clarifies (Step 3: observer LM)
- This makes our pitch land harder: "we built what you're already trying to build, but with a novel second input modality"

### New idea threads (from convo)
- **Allowing machines to "dream"** — using brain encodings to give models internal phenomenological state
- **Giving machines emotions** — same hook, different framing
- These are evocative pitch hooks (not literal architecture changes)

### Action items
- [ ] Build the 3-step swarm to MIRROR their pipeline (with brain encoding as the secret sauce)
- [ ] In the demo, explicitly show the side-by-side: their pipeline vs. our pipeline-with-brain-encoding
- [ ] Have a quantitative slide: disambiguation accuracy delta with brain encoding vs. without
