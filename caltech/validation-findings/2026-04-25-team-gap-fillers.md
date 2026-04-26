---
file-type: validation-findings
status: synthesis (Socratic — surfacing what's already in the team's existing corpus)
last-verified: 2026-04-25
locked-by: 2026-04-25 team-profile + Johnny-public-corpus reads
cross-links:
  - ../context/team/johnny.md
  - ../context/team/johnny-public-corpus.md
  - ../context/team/jacob.md
  - ../context/team/junsoo.md
  - ../context/team/emilie.md
  - ./2026-04-25-blockers-reclassified-pitch-vs-product.md
  - ../prfaq.md
---

# Team gap-fillers — what's already in the corpus that solves the 9 pitch blockers

> The validation pass surfaced 9 pitch blockers. Reading the team profiles + Johnny's public corpus shows that **most of the answers already exist in the team's prior work, vocabulary, or shipped projects.** This file maps each blocker to the team-corpus material that fills it. Per Socratic protocol — surfaced, not proposed.

## The mega-finding

**Roughly 7 of the 9 blockers have direct fills in the team's existing corpus.** The team has already personally lived or written the answer to most of what the validation pass said was undefended. The PRFAQ is sitting on top of pre-existing intellectual capital that hasn't been activated yet.

## Blocker-by-blocker fills

### Blocker 1 — Persona felt-friction sentence (in 17-year-old voice)

**Owner: Emilie + vocabulary from Johnny's corpus.**

- **Emilie:** 100k+ followers, Stylar AI content at 6M views, Claude Campus Ambassador. She has *literally* run live A/B tests on what 17-year-olds engage with. The friction-sentence test (does a teen recognize themselves?) is what she does for a living.
- **Johnny's vocabulary bank** (`johnny.md` lines 128-149):
  - **"The dimming"** — felt reduction in cognitive effort
  - **"Copilot becomes autopilot"** — invisible intellectual de-skilling
  - **"Cognitive offloading"** — relinquishing thinking to machines without awareness
- **Johnny's Reverse-TRIBE post** (Post 1, `research-context/007`):
  > *"if a headline is engineered to make you angry, the only way to know is to notice your own reaction after it already got you"*

  That sentence is already in user-recognizable voice. Lock or sharpen.

### Blocker 2 — Ironside close reframe (drop "feel emotions" — reverse inference)

**Owner: Junsoo. This is his lane in primary-source form.**

Junsoo's profile (`junsoo.md` lines 53-59) lists his shipped end-to-end pipeline:
- Egocentric video → trajectory extraction → object-of-interaction picking → 3D scene reconstruction → grasp annotation
- Built specifically for *"higher-quality grounded supervision so VLMs can reason about manipulation, affordances, and embodied action rather than just static image-text pairs."*

**Reframed Ironside close (Junsoo's actual expertise):**
> *"Pixel-only VLMs miss the salience signal — what a human observer's brain attends to. We add that signal as a second modality so your pipeline catches the manipulation moments your VLMs currently miss."*

Junsoo can defend this in Q&A because he literally built the failure mode his pipeline addresses. The sentence is technically defensible AND drops the reverse-inference trap.

### Blocker 3 — Kill-shot framing for headline

**Owner: Johnny. He's already published the headline.**

From `johnny-public-corpus.md` lines 79-82, his Reverse-TRIBE post:
> *"Manipulation only works in the dark. What happens to the internet when the lights come on?"*

Already locked into PRFAQ as the seed. This is the headline candidate that's:
- Public-dated (proof of priority over Renaissance)
- In Johnny's actual voice (consistent with founder corpus)
- Generationally framed (passes Listen Labs specificity)
- Zero corpus-mean phrasing (passes trends-slop test)

Adjacent phrasing in his corpus:
- **"Ingredients list for content"** (Post 2)
- **"Becoming > Consuming"** (his big-arc thesis)
- **"The lights come on"** (browser-extension imagery)

### Blocker 4 — Product name

**Owner: Johnny's vocabulary + Emilie's brand sense.**

Johnny's corpus contains a vocabulary bank of his own coinages (`johnny-public-corpus.md` lines 137-156):
- **Synthetic synesthesia** — already published
- **Emotional fingerprint** — already used
- **Ingredients list for content** — already published
- **Lights on / lights come on** — recurring metaphor
- **Garden** — recurring UI metaphor (Diverge + 20-versions + garden-of-code)
- **Aquarium** — for ambient AI
- **Ideometry / diamonds** — his framework for shapes-over-frameworks

**Anti-pattern locked:** *"No borrowed aesthetics. Our taste. Our sauce."* (`johnny.md` line 91) — confirms the team WILL NOT use "Spotify Wrapped of Your Brain" as the launch name. Original required.

**Candidate seeds (Johnny's vocabulary):** *Lights On, Daylight, Ingredients, Mirror, Untargeted, Brainline, Garden Mode.* Johnny names final; Emilie executes the brand.

### Blocker 5 — 90-second shot-by-shot

**Owner: Emilie. Her core craft.**

Emilie's profile (`emilie.md` lines 32-37, 75-78):
- Acting (PopMart × Vivo commercial)
- Dance (ballet, contemporary, hip-hop) + choreography
- Skits + 100k+ followers + 6M views (Stylar)
- Nova Intelligence: booth design, **launch video**, LinkedIn content
- *"Storytelling instincts from acting, dance, social content creation"*
- *"Reads a room and adapts a pitch"*

Emilie has shipped 90-second-arc content at 6M-view scale. Adapting Johnny's Clair de Lune story (60s music → brain → 90.4% paragraph match) into the demo arc is what she does professionally. **Her craft IS the shot-by-shot.**

**Adapted demo arc seed (Johnny's Clair de Lune structure ported to consumer feed):**
- Beat 1: feed plays
- Beat 2: brain reads
- Beat 3: swarm specialists react region-by-region
- Beat 4: control-stimulus toggle (algorithmic feed pattern vs. non-algorithmic content) — *the falsifiability moment that Clair de Lune already proved works*
- Beat 5: tagline — *"manipulation only works in the dark"*

### Blocker 6 — Q-J6 hand-curated suggestions for inverted-brain-search

**Owner: Johnny's garden metaphor + Junsoo's KG-grounded LLM reasoning.**

- **Johnny's published "20 versions of tomorrow"** post (`johnny-public-corpus.md` lines 114-120):
  > *"You wake up and instead of a to-do list you see a **garden** — and each flower is a different version of the day you're about to step into. Each one distinguishable and unique."*

  **The Land card IS this garden, scoped to brain regions.** Johnny has *already* designed this UI shape for a different product. Same shape, different domain. Click a flower (region) → see the version (content suggestion).

- **Junsoo's KG-grounded LLM reasoning experience** (`junsoo.md` lines 71-74):
  > *"Knowledge graphs as a structured backbone for grounding LLM reasoning — connecting entities, relations, context in a form the model can query/traverse rather than relying purely on parametric memory"*

  Junsoo can structure the per-region archetype lookup as a small KG (region → function → content-type → exemplars) instead of a free-form generation. **Defends Q-J6 against the "stochastic bad suggestion" failure mode** Sally flagged.

### Blocker 7 — Cross-talk demo example (one hand-tuned scenario)

**Owner: Jacob's Nucleus pattern — the working example already exists in another domain.**

Jacob's Nucleus build (`jacob.md` lines 25-28):
- *"Multi-agent orchestration — Fetch.AI uAgents architecture, async specialized agents on a fixed cycle"*
- *"Claude as downstream 'reasoning seal' over agent outputs"*
- *"Real-time data flow — Supabase WebSockets to React UI"*
- *"Domain-scored decision pipelines — NEWS2 severity scoring on a 10-second vitals cycle"*

**This IS the actor/auditor/mediator triad operationalized, already shipped, already won 1st place at SoCal Tech Week 2024.** The pattern: specialized async agents emit scored claims → Claude seals the reasoning → result flows to React UI in real-time. Port the pattern from medical-vitals scoring → brain-region activations.

Junsoo's reinforcement (`junsoo.md` lines 47-50):
- *"Built a framework where two LLM agents cooperate to produce a shared plan"*
- Compiled output to PDDL → executable by classical planner

Junsoo can formally specify what "cross-region communication" means (which is otherwise hand-wavy LLM-talks-to-LLM). Both his Icarus Lab work AND his black-box LLM behavior probing experience let him define the protocol *and* test that the cross-talk actually diverges semantically across regions, not collapses to corpus mean.

### Blocker 8 — Listen Labs concrete viz shape

**Owner: Johnny's already-shipped visualization + Emilie's execution.**

Johnny's Synthetic Synesthesia post (`johnny-public-corpus.md` lines 14-30):
- 20,484 cortical vertices visualized as activation pattern across DMN / emotion / memory / self-reflection
- **Region-by-region match scoring** with color-coded similarity
- Tested against control stimuli (triumphant music, rain, aggressive speech) — *pattern visibly falls apart on controls, holds on Clair de Lune*

**The shape is:** cortical heatmap matching/diverging from a target neural fingerprint, with control-stimuli falsifiability. Johnny has SHIPPED this visualization at 90.4% match fidelity. Listen Labs requires "specific social phenomenon visualization"; the team can ship: *"watch your generation's brain converge on the same content while a non-algorithmic baseline diverges."* The shape is proven; just scaled across users.

Emilie's Nova Intelligence work (`emilie.md` line 24): she's done *"booth design, launch video, LinkedIn content, data sheets — knows how to make technical B2B products feel approachable and visually compelling."* Translation of the cortical-heatmap science → Listen-Labs-judge-friendly viz is her exact lane.

### Blocker 9 — Sideshift reframe (dev-tool angle) or drop

**Owner: Emilie's brand sense + Johnny's "ingredients list" frame.**

Two fills on the table:

**Fill A — Emilie's Stylar AI experience (consumer dev-tool):**
- Stylar AI content at 6M views
- Claude Campus Ambassador (AI for non-technical audiences)
- Founded Perfit (B2B fashion software)

She's shipped the consumer-facing surface for AI dev tools at scale. The Sideshift close as *"the API that creators embed to give their audiences brain-impact transparency"* is structurally Stylar-shaped.

**Fill B — Johnny's "Ingredients list for content" post:**
> *"Granola bars are held to higher standards than intelligent machines. Everything you eat has an ingredients list — and almost nothing you interact with does."* (`johnny-public-corpus.md` lines 86-91)

That IS a dev-tool framing — the API is the labeling layer, content platforms (the developers) integrate it the way food companies integrate FDA labeling. Sideshift's brief = dev-tools-for-creators; the team's API = the transparency layer creators embed.

**Reframed Sideshift close:**
> *"The ingredients-list API for content. Creators embed it; their audiences see what each piece is designed to do to them before they click play."*

This is dev-tool, B2B, and consistent with the published Johnny corpus.

## What this changes for the per-person tasks

Updates needed to the four `tasks-by-person/*.md` files:

### Johnny's task file additions
- Lock **headline phrase** = his own "manipulation only works in the dark"
- Lock **product-name candidate set** from his own vocabulary bank
- The **garden UI metaphor** is the canonical UI shape for the Land card (already in his published work)
- The **"smallest possible circle"** discipline IS the doctrine he locked tonight (pitch-vs-product)
- **Anti-patterns locked from `johnny.md` lines 83-96** apply as design constraints: no scores, no dashboards, no labels-during-process, no borrowed aesthetics

### Junsoo's task file additions
- **Egocentric video pipeline** is Junsoo's prior shipped work — Ironside angle is OWNED by Junsoo, not aspirational
- **PDDL / formal-symbolic compilation** experience → he formally specifies the cross-region communication protocol
- **Black-box LLM behavior probing** experience → he validates the cross-talk doesn't collapse to corpus mean (defends RT-2)
- **Knowledge graphs grounding LLM reasoning** → structures the Q-J6 inverted-brain-search lookup as a KG, not free-form generation
- His PhD-app win-condition: **"strong letter of rec / research artifact"** — frame his hackathon work as a publishable technical writeup on multi-agent + brain-encoding bridges (interest-overlap with Sven Koenig's MAPF lab)

### Jacob's task file additions
- **Nucleus is the working example for the K2 swarm pattern** — port the architecture (specialized async agents on fixed cycle + Claude as reasoning seal + Supabase WebSockets to React) directly
- **Real-time data flow** experience → he owns the live-streaming visualization plumbing
- **Domain-scored decision pipelines** experience → port NEWS2 severity scoring pattern → brain-region activation severity scoring
- His career-relevant filter: *"credible story for AI-adjacent or low-level systems role"* — the K2 swarm + cross-region communication + observability story IS that resume narrative

### Emilie's task file additions
- **Launch video at startup quality** is her core deliverable — she's shipped this at Nova Intelligence
- **Stylar AI 6M-view content track record** → she knows what shareable consumer AI content plays
- **Claude Campus Ambassador (AI for non-technical audiences)** → she translates the demo for sponsor judges who aren't deeply technical
- **Story arc design** → port Johnny's Clair de Lune story structure (60s arc, falsifiability beat, payoff line) into the 90s demo
- **Acting + dance** craft → she choreographs the on-screen interaction and on-camera narration
- The "startup test" quality bar her deliverables are measured against (`emilie.md` lines 130-138)

## What's STILL not filled by the corpus (3 of 9)

Even with the gap-filler mapping, three items still need fresh team work:

1. **The actual press-release headline DRAFT** — vocabulary is there; the specific 1-sentence headline isn't picked.
2. **The 90s shot-by-shot draft itself** — Emilie owns the craft; the script needs to be written.
3. **The product name decision** — candidates are seeded; final pick is Johnny's call.

These are not blocked on more corpus reading — they're blocked on Johnny naming + Emilie executing.

## The doctrine validation

Johnny's pitch-vs-product doctrine is **not new** — it's structurally the same as his published *"smallest possible circle"* discipline (`johnny-public-corpus.md` lines 107-113):

> *"Get crazy ruthlessly focused on the smallest possible unit of shipment that is effective. The thing that really makes the thing slap. Only until you've got confirmation by way of you and other people interacting with this thing — and it's had the ability to bounce off of reality — should you move to the next stage."*

The hackathon scope IS the smallest possible circle for this product. The validation pass already gave the "bounce off reality" signal. The path is clear.
