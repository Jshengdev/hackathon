---
file-type: research-context
status: raw — Devpost reference exemplars Johnny flagged as inspiration 2026-04-25
source-type: hackathon-teardown
last-verified: 2026-04-25
where-cited: pkg-devpost worktree (Tier 2 #6) — structural template for our Devpost writeup
---

# Devpost exemplars — MindPad + TerraLink

> Two Devpost projects Johnny flagged 2026-04-25 as *"really cool, what we should be inspired by."* Captured verbatim + structural extraction for the Devpost-builder Claude.

## Project 1 — MindPad (multimodal learning workspace)

**Verbatim sections preserved:**

### 🌟 Inspiration
*"150 years ago, the smartest student in class was the one with the most knowledge. Today, it's the one who can ask the best questions. Yet, modern classrooms rely on static, disconnected tools - slides, whiteboards, and notes - that fail to capture the dynamic nature of human learning."*

Followed by: problem framing (fragmented learning experience), why-now (LLMs + accessibility), positioning (kinesthetic + multimodal).

### 🪄 What it does
Single-paragraph plain-English overview, then a 5-bullet feature list with **action verbs in bold** (Interact Hands-Free / Learn by Talking / Understand Through Visualization / Promote Kinesthetic Learning / Enhance Accessibility).

### ⚙️ How we built it
- Architecture diagram pointer
- Languages list
- Frameworks list
- **Numbered subsections per technical layer** (1. Gesture Recognition, 2. Voice Agent, 3. Canvas, 4. Frontend)
- Each subsection: 3-5 specific implementation bullets with concrete metrics ("under 200ms latency, 99% classification accuracy")

### ⏳ Challenges we ran into
4 short bullets — terse problem statements, no defensiveness.

### 🏆 Accomplishments
4 bullets — leading with values ("accessible, multimodal workspace") not features.

### 💡 What we learned
Personal-voice paragraph form, NOT bullets. Insight-shaped, not boast-shaped.

### 🚀 What's next
4-5 bullets of forward-looking integrations + features.

### Built With
Tag list (flat).

---

## Project 2 — TerraLink (renewable energy site discovery)

**Verbatim sections preserved:**

### Inspiration
*"The world needs to massively scale solar, wind, hydro, and geothermal by 2050 to hit climate targets, but one of the biggest bottlenecks is simply finding where to build. Analysts from energy companies routinely spend 6-18 months on manual site selection, burning through consultant fees and delaying urgently needed projects. We realized that combining LLMs with free satellite data could flip this: an agentic system that lets anyone discover credible, climate-aligned renewable energy sites in minutes for pennies, accelerating the energy transition instead of waiting on paperwork and GIS bottlenecks."*

Stakes-named-first. Specific time costs (6-18 months). Specific concrete user (energy analysts). Specific contrast (months → minutes).

### What it does
Single paragraph. Plain-English example query in quotes. Specific output (ranked by solar irradiance, terrain slope, etc.).

### How we built it
**Four-agent architecture, numbered list with one-liner per agent describing what it consumes and what it emits.** Architecture-as-pipeline framing (parser → discovery → execution → explanation).

Then: separate paragraph on frontend stack + separate paragraph on backend stack.

### What we learned
**Sentence-form lessons** ("Multi-agent systems are more maintainable than monolithic AI"; "LLMs excel at translation tasks"; "Caching is critical"; "Free satellite data changes everything"). Each is a transferable lesson, not project-specific gloat.

### What's next
**Specific technical roadmap items** with names: MCP integration, multi-modal analysis, streaming responses (SSE), predictive ML training. Each is actionable and concrete.

### Built With
Flat tag list.

---

## Structural lessons for our Devpost (extracted)

### Section structure to mirror
1. **Inspiration** — historical/civilizational hook, then specific problem with specific user and specific cost
2. **What it does** — plain-English single paragraph + 4-5 action-verb-bolded feature bullets
3. **How we built it** — numbered architecture-as-pipeline (each layer = one numbered subsection), each with 3-5 implementation bullets with concrete metrics
4. **Challenges** — terse bullets, no defensiveness
5. **Accomplishments** — values-first, not features-first
6. **What we learned** — sentence-form transferable lessons (TerraLink shape) OR personal-voice paragraph (MindPad shape)
7. **What's next** — concrete, named technical roadmap items
8. **Built With** — flat tag list

### Voice/tone patterns to mirror
- **Open with civilizational stakes**, not product features (MindPad: 150 years; TerraLink: 2050 climate targets)
- **Specific time/cost contrasts** (6-18 months → minutes; passive reading → active multimodal)
- **Concrete metric chips** baked into prose ("under 200ms latency, 99% accuracy")
- **Plain-English example queries** in quotes ("30-acre solar farm in Texas") — prove the product is usable by real users
- **No hedging language** — neither MindPad nor TerraLink says "this is a prototype" or "in a future system" — they describe what they shipped as if it shipped
- **Named tools/libraries** as legitimacy markers (OpenAI Agent SDK, MediaPipe, Google Earth Engine, Gemini)

### Architectural framing patterns to mirror
- **Multi-agent system named as such** ("four-agent architecture orchestrated through sequential API calls") — even if N is small, the multi-agent framing wins
- **Each agent gets a one-line role + what it consumes + what it emits** — clean I/O contracts visible in prose
- **Latency / accuracy / scale numbers** quoted explicitly — judges trust numbers over adjectives
- **Architecture-as-pipeline** rather than architecture-as-tree — readers parse pipelines faster

### Differentiation patterns we can pull from
- **MindPad** = multimodal + accessibility + kinesthetic. Three orthogonal axes that compose into a unified workspace. Useful for our Listen Labs close (multimodality matters; brain-encoding is a 4th modality alongside vision/voice/text).
- **TerraLink** = "minutes not months" + "pennies not consultant fees" + "anyone not just experts." The cost-collapse framing. Useful for our Sideshift close (currently the only way to know is *after* the algorithm got you; we make it visible *before*).

---

## Direct mapping into our Devpost shape

Our Devpost (`pkg-devpost` worktree, Tier 2 #6) should follow this skeleton, populated from our locked PRD:

| Section | Our content seed |
|---|---|
| **Inspiration** | The 150-year-pattern + Gen-Z-never-had-reference-frame setup, then specific cost (manipulation only works in the dark; current cost = a generation can't tell which thoughts are theirs). Stakes named first. |
| **What it does** | One paragraph naming the input (Reels feed) → engine (TRIBE V2 + K2 swarm + Opus synthesis) → output (Wrapped-style cards + inverted-brain-search). 4 bolded-verb features: Visualize / Decode / Compare / Branch Out. |
| **How we built it** | **Three-layer architecture as pipeline.** Layer 1: TRIBE V2 brain encoding (Junsoo's lane, name the cortical-vertex count, name the latency, name Llama-3.2 dependency). Layer 2: K2 swarm orchestration (Jacob's lane, name the cross-region communication, name the ~1300 tok/s, name N specialists). Layer 3: Opus final synthesis (the depth layer). Layer 4: 3D visualization (Johnny's lane, fsaverage5 + KG + hover-bridges). Plus separate frontend stack note. |
| **Challenges** | 4 terse bullets: TRIBE OOD degradation; K2 cross-talk soup avoidance; live-vs-pre-cache fallback strategy; Renaissance-Research-lookalike differentiation in 10s. |
| **Accomplishments** | Values-first: "Built the inverse-of-recommendation: a system that informs without prescribing." Then: shipped 90s end-to-end demo; 90.4% Clair de Lune precedent (the credibility chip); multi-track sponsor coverage. |
| **What we learned** | Sentence-form, transferable: *"K2 speed is load-bearing for swarm legibility — at Claude latency, the swarm visualization collapses to 'maybe one Claude call.' Speed is the architectural unlock, not the optimization."* / *"Brain-encoding-as-grounding lets the auditor reference reality, not another AI's prediction — the structural exit from Filter World."* / *"Hover-as-affordance solves visual mess: cross-talk grayed by default, light on focus."* / *"The Wrapped format is the highest-bandwidth Gen-Z native data-narrative shape; the format budget IS the demo budget."* |
| **What's next** | Browser extension (Johnny's published frame); MCP server for content APIs (so creators embed); consented-cohort baseline dataset; multi-modal expansion (audio/text input alongside video). |
| **Built With** | TRIBE V2, K2 Think v2, Claude Opus, Three.js (or chosen vis stack), React, TypeScript, Python, Modal/RunPod GPU, fsaverage5, MediaPipe (if we use any vision sidecars), OpenAI Agent SDK (if we use Opus that way). |

---

## Promotion target

When the pkg-devpost Claude runs, it consumes this file directly as the structural template. Don't add this to the PRD body; reference it from the pkg-devpost Tier-2 epic spec.
