# Junsoo Kim — Profile

> **Name correction:** Earlier brainstorm transcripts captured this teammate as "Junu" — that was a voice-to-text artifact. Formal name is **Junsoo Kim**. Team also calls him "Junsu" colloquially. All three refer to the same person; future captures should use Junsoo or Junsu.

## Identity
- **Name:** Junsoo Kim
- **School / Year:** USC, CS junior (class of '27)
- **Phone:** [not provided]
- **Email:** [not provided]
- **LinkedIn / GitHub:** [not provided in submitted profile]
- **Currently taking:** CSCI 475 (Theory of Computation) — building algorithm-theory foundation
- **Currently researching with:** Icarus Lab (USC) — LLM ↔ classical-planning bridge
- **Came from:** Physics (was a physics major before switching to CS) — formal structure, optimization, problems with first-principles correctness still shape what he's drawn to

---

## Long-Term Goal (load-bearing for understanding what wins matter to him)

**PhD in CS focused on MAPF (multi-agent path-finding) and multi-agent planning algorithms** — the **classical-AI, optimization-flavored side**.

### Target lab
- **IDM Lab — Sven Koenig (USC)**
- Canonical home for serious MAPF research:
  - CBS (Conflict-Based Search) variants
  - Lifelong MAPF
  - Kinematic-constraint planning
  - League of Robot Runners

### He is optimizing for grad school, NOT industry
Deliverables that move the needle for him, in order of weight:
1. **Strong letters of recommendation**
2. **Real research artifact** — paper, poster, or substantial technical writeup
3. **Coherent research statement**
4. **Depth in theoretical coursework**

### Direction of travel
- **Icarus Lab is a stepping stone, not the destination.**
- He's trying to move **toward owning the classical-planner side itself** — *not* the LLM side.
- "The planning side is the side I want to deepen — not the LLM side."

---

## Research Experience

### 1. Multi-agent LLM planning → PDDL (Icarus Lab)
- Built a framework where **two LLM agents cooperate to produce a shared plan**
- System compiles that plan into **PDDL (Planning Domain Definition Language)** code
- PDDL is then executable by a downstream **classical planner** — driving movement and action propagation through the environment
- Sits at the boundary between LLM reasoning and classical AI planning
- The interesting bridge: getting two natural-language reasoners to **converge on a coherent plan**, then compiling into a formal symbolic representation a classical planner / robot can actually run

### 2. Egocentric video → VLM supervision pipeline
End-to-end pipeline from raw first-person video to structured supervision for vision-language models. Components:
- **Trajectory extraction** — tracking camera, hands, body movement through scene over time
- **Object-of-interaction picking** — isolating relevant objects in each clip
- **Scene reconstruction** — recovering 3D structure from video
- **Grasp annotation** — grasp type, contact points, approach direction

**Motivation:** higher-quality grounded supervision so VLMs can reason about **manipulation, affordances, and embodied action** rather than just static image-text pairs.

### 3. Black-box LLM behavioral research
- Fully **black-box setting** — no weights, no gradients, only API-level input/output
- Focus on **the semantic side of model behavior**:
  - How prompts shape what the model "means" and does
  - Probing for consistent behaviors
  - How semantically equivalent prompt variations lead to different outputs
  - Characterizing a model's response surface from the outside
- Methodology: prompt-level interventions, behavioral probing
- **Did not reach publication** — but has solid working knowledge of methodology, relevant literature, and failure modes of black-box approaches

### 4. Agentic LLM systems with knowledge graphs
- **LangChain-style orchestration** for multi-step LLM pipelines and tool-using agents
- **Knowledge graphs as a structured backbone** for grounding LLM reasoning — connecting entities, relations, context in a form the model can query/traverse rather than relying purely on parametric memory
- Exploratory work on **agent trajectory analysis** — how multi-step agents arrive at their outputs

### The through-line he names himself
> "All of this work sits at the intersection of **perception, language, and behavior** — turning raw signal (egocentric video, prompts, agent traces) into something that's either **supervision for a model** or **evidence about a model**, or compiling fuzzy reasoning into **formal structure a system can act on**."

---

## How He Thinks / Works

### What pulls him
- **Learn and optimize** — would rather pick up a new method than polish one he already knows
- Every project he's stuck with has been an excuse to learn a new layer of the stack
- First-principles framing: complexity, optimization, completeness, search, heuristics, baselines
- Formal structure over heuristic vibes

### What he's trying to break
- Can chase novelty for its own sake
- For grad school, the discipline he most needs is **staying in one MAPF-flavored problem long enough to produce a real algorithmic contribution, not just an interesting prototype**

### What bores him fast
- Application-of-existing-tools work
- Full-stack
- CRUD
- Framework-shuffling

---

## Stated Anti-Preferences (HARD)

These are explicit "don't pitch me X" items from his profile:

- ❌ **Application work** — full-stack, CRUD, "build another LangChain agent" specifically named
- ❌ **Fine-tune-a-model work** as the project ceiling
- ❌ Pitches that keep him on the LLM side instead of moving him toward the planning side

---

## Operating Rules When Working With Junsoo

- Default to **algorithm-design and first-principles framing** — complexity, optimization, completeness, search, heuristics, baselines
- Push him on the **MAPF / multi-agent planning lane** when relevant
- Anything in the **IDM Lab orbit** (CBS variants, lifelong MAPF, kinematic-constraint planning, multi-robot coordination) is the deepening direction
- The Icarus Lab LLM-to-PDDL pattern is a **stepping stone**, not the destination — frame work as moving him toward owning the classical-planner side

### His personal win conditions for any project
1. **Strengthens his PhD application** — letters, research artifact, narrative, theoretical depth
2. **Teaches him something he doesn't already know**

---

## Skill Inventory Relevant To Caltech Hackathon Build (factual mapping)

Pure capture — no recommendation about role assignment. Listing where his existing skills/experience overlap with components currently in our architecture.

| Architecture component | Junsoo's existing experience |
|---|---|
| Egocentric video processing (Ironside data) | ✅ Directly — built end-to-end egocentric video → VLM supervision pipeline |
| 3D scene reconstruction | ✅ Directly — scene reconstruction was a stage in his pipeline |
| Trajectory / hand / body tracking | ✅ Directly — trajectory extraction was a stage |
| VLM failure modes (the semantic confusion problem Ironside has) | ✅ Has worked on grounded supervision specifically to fix this kind of issue |
| Multi-agent LLM coordination (the K2 swarm) | ✅ Built two-agent cooperative LLM planning framework |
| LLM → formal/symbolic compilation (PDDL) | ✅ Directly — this is the Icarus Lab work |
| Knowledge graphs grounding LLM reasoning | ✅ Directly — KG-as-backbone for grounding |
| Black-box LLM behavior probing (semantic variation, response surface) | ✅ Directly — relevant to "non-deterministic guardrails" / bias detection in our architecture |
| LangChain-style orchestration | ✅ Has experience |
| Agent trajectory analysis | ✅ Exploratory experience |
| Brain encoding / TRIBE V2 | Not in his profile (Johnny carries this) |
| Classical planner / MAPF | Not currently in our architecture (this is his target deepening direction, separately) |

---

## Open Items For This Hackathon (TBD)

- [ ] Stated lane preference for THIS hackathon (vs. inferred from profile)
- [ ] How he wants this hackathon to feed his PhD-application pipeline (research artifact? technical writeup? letter-of-rec relationship?)
- [ ] Energy / sleep plan / hard time-blocks
- [ ] Phone / email / LinkedIn / GitHub for the team contact list
