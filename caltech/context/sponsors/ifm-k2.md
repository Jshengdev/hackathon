# Sponsor: IFM × Hacktech — Best Use of K2 Think V2

## Official
- **Prize:** reMarkable tablets (~$400/each)
- **Brief:** "Build with one of the most capable open reasoning systems available. K2 Think V2 is a 70B-parameter model purpose-built for reasoning from the ground up — excelling at complex, multi-step problem solving across mathematics, science, coding, logic, and simulation. Expanded context for sustained reasoning over large bodies of information. Fully open end-to-end: pre-training data, post-training recipes, checkpoints, and evaluations all publicly available and independently reproducible."
- **What they look for:**
  - Real, non-trivial use of advanced reasoning in real-world scenarios
  - Creative applications beyond obvious LLM demos
  - K2 Think V2 as a **core part of your product, not a side API call**
- **API access:** Join WhatsApp group → share team leader's email → get key
  - WhatsApp invite: chat.whatsapp.com/KcLSzGS8M3kCXC6NM2bTT4
- **Workshop:** Friday 7:30–9 PM (ANB 104) — overlaps with hacking start, may be worth attending if pursuing

## What They ACTUALLY Want (read between lines)
- **Reasoning-first projects** — math, science, coding, logic, simulation. Not chatbots.
- "Core part of your product" = if you remove K2 the product collapses. They will absolutely test this.
- "**Beyond obvious LLM demos**" — explicit signal to skip RAG-chatbot-over-PDFs. They want creative reasoning use cases: theorem proving, drug discovery, multi-step planning, autonomous research, code synthesis with verification, simulation calibration, etc.
- "Open end-to-end" — they're proud of openness. If you can show you fine-tuned, ablated, or analyzed the model in some way, that's bonus signal.
- 70B is large — assume API rate limits. Plan for batched inference, not latency-sensitive UX.

## How to Win
- Pick a problem where **chain-of-thought matters AND can be verified** (math, code, formal logic, structured planning)
- Show K2 doing something a smaller / cheaper model cannot
- A/B comparison vs. other open models (Llama, Qwen) shows rigor
- "Core part of product" = build a reasoning loop, not a one-shot prompt

## Strategic Fit For Us
- API friction (WhatsApp signup) means **fewer competing entries** — submission-rate edge
- Need to commit early Friday — if we're going for it, sign up at check-in
- Composes well with Ironsite (reasoning over spatial data), Listen Labs (multi-agent reasoning), Cybersecurity (vuln discovery via reasoning)

## Action Items
- [ ] Decide Friday night if K2 is in our stack
- [ ] If yes: leader joins WhatsApp + gets API key Friday before hacking

---

## Live Signal — Opening Ceremony (2026-04-24)

### Who they actually are
- **IFM = Institute of Foundation Models, part of MBZUAI** (Mohamed bin Zayed University of AI), based in **Abu Dhabi**
- Lab presence in **Paris** as well
- **UAE-funded national AI strategy play** — UAE is investing heavily to diversify economy past oil
- Speaker: K(?) — represents IFM
- They state they are "**locally impactful, globally open**" — building open models from a sovereign-AI base

### Their Model Family — More Detail
- **K2 Think V2** is their reasoning model — but they have a broader family:
  - **Arabic LLM** (largest/best Arabic-language model — major flex for them)
  - **Multimodal models** (vision + language)
  - **World modeling** for: art simulation, robotics simulation, spatial simulation
  - Coding/writing capable models
- Key brag: **"360° fully open"** — not just open weights:
  - Open training data
  - Open intermediate checkpoints
  - Open training recipes
  - Open evals + benchmarks
  - Fully reproducible — "if you have compute, you can reproduce everything from the paper"

### Strategic Pivot in Their Pitch
- IFM rep **explicitly echoed Ironside** — said spatial AI / world modeling is "very important, the frontier"
- They frame themselves as building toward **world models for art, robotics, spatial sim**
- **K2 Think V2 reasoning + their world models could compose** — they may favor projects that combine reasoning with their multimodal/spatial work

### Recruiting Angle
- Mentioned wanting **top model students** to join their community
- Hinted at hiring/research collaboration potential (less explicit than Listen Labs/Sideshift)

### Strategic Read for Our Thesis
- Sycophancy/AI literacy could plausibly use K2 reasoning to **explain or critique another LLM's response in real time** (multi-step reasoning over a sycophantic answer to surface what's missing)
- "Core part of product" could be: every user content interaction → K2 reasons over what was said vs. what was true
- API friction (WhatsApp signup) means **fewer competing entries** — keep this on the table
- Composes with our thesis IF we make K2 the "anti-sycophancy reasoner" in the stack

---

## UPDATE — K2 is now CORE STACK (post-team-brainstorm Friday night)

### Key spec confirmed in our convo
- **K2 runs at ~1,300 tokens/sec on Cerebras** — claimed ~10× Claude inference speed
- This is the WHY we picked it — speed enables architectures that aren't viable with normal LLMs

### How we're using it
- **K2 as a SWARM engine** — fire many parallel reasoning tasks simultaneously, OR
- **K2 as a long-step decomposition engine** — sequential thousand-step reasoning that wouldn't be tractable at normal inference speed
- Specific job in our stack: take **brain-region activation outputs from TRIBE V2** and run massive parallel reasoning to disambiguate / classify / synthesize
- Could also be used for **document/data decomposition** (rip a big source into many semantic pieces, recombine)

### Risk to flag for win-validator
- **"Why K2 specifically?" must have a real answer.** If our K2 usage looks like "we wanted to enter the K2 track, so we made up a swarm job," IFM judges will sniff it.
- The bar IFM stated: "**core part of your product, not a side API call**" — we need K2 doing work that fundamentally requires its speed advantage
- A/B against a slower model (Claude/Gemini) and show "this approach is only feasible with K2's throughput" = strong evidence

### Action Items
- [ ] **TONIGHT (Friday):** Junu joins WhatsApp, gets API key. Test sample inference call before bed.
- [ ] Spec the swarm job concretely in the PRD — what exactly are the parallel reasoning steps doing
- [ ] Identify what would NOT be feasible without K2-level throughput — build that as our wedge

---

## 🎯 PERSONAL CONVERSATION WITH IFM TEAM (Friday)

### THE PRIORITY THEY REVEALED — IMPACT > TECH
- They will **choose the project with the larger market impact**, even over a project with a deeper / cleverer tech stack
- "Two scenarios where they would choose the one that addressed a larger market over the one that was smaller — no matter how big the tech stack is"
- This means our pitch can NOT be "look at this cool reasoning swarm" — it has to be **"this swarm solves a $X market problem and only K2 makes it feasible"**

### How they want us to use K2
- **Hallucination rate** — argue K2 reasoning reduces hallucination on multi-step tasks vs. one-shot LLMs
- **Speed of inference** — argue K2's throughput is what makes the architecture viable
- Find tasks where **rapid API use is the unlock** — i.e., tasks where you'd want hundreds/thousands of inference calls in a short window, not 1–2 calls

### Implications for our project framing
- The brain-encoding + swarm pipeline already structurally needs many inference calls (one per swarm agent, per frame, per simulation step) — natural fit for K2's throughput argument
- The "non-deterministic guardrails / bias detection via swarm disagreement" angle is also a hallucination-reduction story — **align our pitch to those exact judging criteria**
- **Pick a problem with massive TAM** for the IFM pitch (industrial safety, healthcare imaging, education, content moderation, etc.) — not a niche prosumer toy

### Action Items (refined)
- [ ] In the PRD, explicitly call out:
  - Why K2's speed enables our swarm at all (vs. a slower LLM forcing serial / smaller scale)
  - Why our swarm reduces hallucination vs. a single-LLM call (ensemble / disagreement-based guardrails)
  - The market size of the problem we're solving (target: $1B+ TAM framing)
- [ ] When pitching IFM specifically, lead with **impact** before tech architecture
