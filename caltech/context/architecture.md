# Working System Architecture — DIRECTIONS (not locked)

**Status:** ⚠️ **Tech stack is NOT locked** — these are *current directions* the team is exploring, captured for reference.
**Per Johnny's late-Friday lock-in:** "Our tech stack is not locked right now, it's just kind of like the direction. Put everything as almost like directions."
**What IS locked:** target tracks (see `track-strategy.md`). The specific tech components below may shift after upcoming research into TRIBE V2, Mirofish, hackathon-winning patterns, and reference repos.
**Purpose:** Hold a structural snapshot of current thinking. Will be refined into a real PRD via the BMAD `prd-splitter` workflow after idea-generation.

---

## 🧱 Current Directional Stack (NOT LOCKED — may shift after research)

```
┌─────────────────────────────────────────────────────────────────────┐
│  LAYER 1 — INPUT                                                    │
│                                                                     │
│   Video (Ironside egocentric construction footage as primary;       │
│          generalizable to any video — consumer, sports, YouTube)    │
│                                                                     │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  LAYER 2 — BRAIN ENCODING (TRIBE V2)                                │
│                                                                     │
│   Facebook Research model — predicts which brain regions activate   │
│   in response to the input video.                                   │
│                                                                     │
│   Output: brain-region activation maps (semantic, not pixel)        │
│                                                                     │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               │  (Loop back: feed brain response
                               │   alongside original video into
                               │   the next layer, so we have BOTH
                               │   pixel features AND brain semantics)
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  LAYER 3 — CURATED RESPONSE GENERATION                              │
│                                                                     │
│   Combine (video frames) + (brain activations) → produce a richer   │
│   "interesting curated response" for downstream reasoning.          │
│                                                                     │
│   Open: what exactly the "curated response" looks like —            │
│   could be enriched semantic descriptors, candidate                 │
│   disambiguations, generated calming/evocative imagery, etc.        │
│                                                                     │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  LAYER 4 — SIMULATION / SWARM REASONING                             │
│                                                                     │
│   Reference: Mirofish (open-source repo, swarm-of-agents pattern    │
│              for predicting anything)                               │
│   Engine:    K2 Think V2 (~1,300 tok/s on Cerebras)                 │
│                                                                     │
│   STRUCTURAL TEMPLATE — mirror Ironside's own 3-step pipeline:      │
│     Step A: AUTO-CLASSIFIER — many parallel agents classify what    │
│              they "see" given (frame + brain encoding)              │
│     Step B: NARRATION — agents narrate the action / context they    │
│              perceive (parallel narration reduces single-narrator   │
│              hallucination)                                         │
│     Step C: OBSERVER-AS-JUDGE — meta-agents Q&A the classifier      │
│              and narrator outputs, surface disagreement, resolve    │
│              ambiguity, produce final disambiguated output          │
│                                                                     │
│   Why K2 is the unlock here: each step needs many parallel/         │
│   sequential inference calls. At normal LLM speeds this is          │
│   intractable for live demo. At 1,300 tok/s, the whole 3-step       │
│   chain runs in seconds.                                            │
│                                                                     │
│   Doubles as: the "visualization layer" — the swarm IS the demo;    │
│   you watch it think. Disagreement between agents is itself a       │
│   non-deterministic guardrail signal.                               │
│                                                                     │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  LAYER 5 — OUTPUT (candidates, not locked)                          │
│                                                                     │
│   ▶ Anti-Black-Box / Glass-Box AI                                   │
│       View the full reasoning process; expose what a model is       │
│       "thinking." Demo motif: live un-blackbox visualization.       │
│                                                                     │
│   ▶ Non-Deterministic Guardrails                                    │
│       Guardrails that emerge from swarm-level disagreement, not     │
│       from hardcoded rules. Useful for bias/sycophancy detection.   │
│                                                                     │
│   ▶ Knowledge Graph (KG)                                            │
│       Brain-region clusters ↔ semantic categories ↔ specific        │
│       recognitions ↔ confidence. The unifying data structure.       │
│                                                                     │
│   ▶ Semantic Search                                                 │
│       Search video / data by what the brain "feels" about it,       │
│       not just what's pixel-similar.                                │
│                                                                     │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  LAYER 6 — THEME / NARRATIVE WRAPPER (TBD)                          │
│                                                                     │
│   Candidate framings we're hovering on:                             │
│   • "Augment, don't replace" human intelligence                     │
│   • Ethical / sustainable / non-sycophantic AI                      │
│   • Glass-box AI for high-stakes domains                            │
│   • Brain-grounded multimodal disambiguation                        │
│   • Generational AI literacy                                        │
│                                                                     │
│   The theme is the LAST piece to lock — chosen to maximize          │
│   sponsor track-stack coverage given Layers 1–5.                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🧩 Component Inventory

| Layer | Component | Status | Notes |
|---|---|---|---|
| 1 | Ironside dataset | ⏳ Requested via Discord | ~400 hrs egocentric construction video |
| 1 | Fallback datasets | 💡 Backup plan | YouTube / Ego4D / sports broadcast — in case Ironside delays |
| 2 | TRIBE V2 | ✅ Identified, open source | Untested on industrial footage — RISK |
| 3 | Custom glue layer | 🔧 To build | Combines video frames + brain activations into the swarm input |
| 4 | Mirofish (reference only) | ✅ Identified | Code patterns, not direct dependency |
| 4 | K2 Think V2 API | ⏳ WhatsApp signup sent (Junu) | 1300 tok/s on Cerebras — the speed is the unlock |
| 5 | Knowledge graph viz | 💡 Strong candidate | Knowledge graph + un-blackbox demo |
| 5 | Web dashboard | 💡 Default UI shape | Startup-aesthetic; not cute character animation |
| 5 | Gather.town-style 3D | ⚠️ Tension | Cool for Listen Labs human-society demo; conflicts with "no cute art project" rule |
| 5 | iMessage UX | 🗄️ Pocket option | B2C escape hatch for Sideshift |
| 6 | Pitch deck | 🔜 Drives design | "Pitch deck first, then design" — will iterate Saturday |

---

## ❓ Open Questions To Resolve

### Layer 2 (Brain Encoding)
- Does TRIBE V2 work on industrial / egocentric construction video, or was it trained on consumer media only?
- What's the actual output format (per-frame brain region scores? aggregated maps? embeddings?)
- What's the latency per second-of-video?

### Layer 3 (Curated Response)
- What does "curated response" actually look like as a data structure?
- Is the loop-back (brain encoding → enriched input) one round or iterative?

### Layer 4 (Swarm)
- What's the actual *job* of each swarm agent? (Disambiguation? Bias detection? Guardrail decisions? Multi-perspective interpretation?)
- How many agents in the swarm — what's the right scale to show K2's speed advantage?
- What would be infeasible without K2's throughput? (need a clean answer for IFM judges)

### Layer 5 (Output)
- What does the user see / interact with? (Single biggest open question)
- One unified output, or multiple outputs depending on which sponsor is being pitched?

### Layer 6 (Theme)
- Which framing maximizes track coverage AND feels honest to what we're building?
- Can the same project be pitched 6 different ways without feeling slimy?

---

## 🎯 Tracks This Architecture Covers (Mapped to Layers)

| Sponsor / Track | How this stack hits it |
|---|---|
| **Best Use of AI** (universal) | Universal — entire stack is AI-native |
| **Creativity (main)** | Layer 4 swarm visualization + Layer 5 anti-blackbox = "freaky tech" |
| **IFM K2** | Layer 4 — K2 is core, speed enables otherwise-infeasible swarm |
| **Ironside** | Layer 1 input + Layer 2 novel modality = innovative input source |
| **Listen Labs** | Layer 4 swarm as "society of brain-encoded agents" simulating human cognition |
| **Not So Sexy (?)** | If pitched B2B for industrial / construction / safety domain |
| **Sideshift (?)** | If pitched B2C — personal AI that shows you what AI is "thinking" |
| **YC (?)** | If reframed as "what RescueTime / [pre-2022 YC co] looks like AI-native today" |
| **Palohouse (?)** | If team commits + pitch reads as fundable startup |

---

## 🔁 What To Do With This Doc

This doc holds the **current directional thinking** — NOT a locked stack and NOT a problem statement.

Next steps for the human team:
1. Research phase — TRIBE V2 deep dive, Mirofish deep dive, hackathon-winning intel, reference repos (per Johnny's stated plan)
2. Tie research findings back to the directions above; promote, demote, or replace components
3. Run the `idea-generator` workflow to lock a problem statement (human-driven)
4. Then `prd-splitter` to divide work for the ~12hr × 4-person build window
5. Then build, validate, pitch

For the team's locked track commitments, see [`track-strategy.md`](track-strategy.md).
