---
file-type: validation-findings
status: research-deliverable (capability-first methodology)
last-verified: 2026-04-25
locked-by: Two parallel deep-research agents — TRIBE V2 capabilities + Agent swarm capabilities
cross-links:
  - ../yaps/2026-04-25-capability-first-pivot/01-high-signal-extracts.md
  - ../prd.md
  - ./2026-04-25-treehacks-pattern-search.md
---

# Capability inventory summary — TRIBE V2 + Agent swarms

> Per Johnny verbatim 2026-04-25: *"start with what the tribe thing normally does and then describe what it can do and figure out what one of the can-dos can turn into something that we wanted to do."* Two deep-research agents returned 4,000 words combined. This file is the synthesized actionable digest.

## TRIBE V2 — capability surface (12 primitives, 7 compositions, 8 candidates)

### Verified primitives (atomic operations)
1. **Forward prediction** — video[N s] → cortical-activation[N s × 20K vertices]
2. **Unimodal ablation** — drop video/audio/text → measure per-modality contribution
3. **Functional-network localization** — ICA decomposition → 7 canonical networks (DMN, FPN, language, visual, motor, etc.)
4. **Region-pair comparison** — content A vs. content B → cosine-sim per region
5. **Target-pattern matching (reverse-search)** — Johnny's Clair de Lune work; 90.4% emotion-center match via iterative scoring
6. **Zero-shot subject generalization** — group r ≈ 0.4; fine-tune 1h fMRI → r → 0.8-1.6
7. **Cross-language transfer** — 143 languages via Wav2Vec-BERT
8. **Temporal-response trajectory** — second-by-second region evolution
9. **OOD similarity scoring** — flag novel content types (cartoons, silent film score 0.32 → 0.17)
10. **Activation-intensity quantization** — z-score per region
11. **Network-state classification** — DMN-ON/OFF, attention-locked, memory-encoding
12. **Feature-attribution (proposed extension)** — gradient backprop to identify which stimulus features drive which regions

### KEY DISCOVERY: Cortex.buzz exists

A commercial product (cortex.buzz) is built on TRIBE V2 and offers content-audit-as-a-service. **License status unverified** — likely violating CC BY-NC 4.0. **Implication for our pitch:** Cortex.buzz is the *attention-engineering* application of TRIBE V2 already deployed; we INVERT it. Strengthens the *"big tech uses brain models for X; we use the same model for not-X"* thesis with a specific named comparable.

### TRIBE candidates ranked by Johnny's empowerment positioning

| # | Candidate | Empowerment fit | Demo feasibility (90s) | Coverage |
|---|---|---|---|---|
| 1 | **Brain-response transparency browser extension** | ✅✅✅ | ✅ (90s loop: feed → 3 headlines → flags) | Sideshift + LL + Best AI |
| 2 | **Creator content-audit dashboard** (open-source Cortex.buzz) | ✅ | ✅ | Sideshift + Creativity |
| 3 | **Comparative neural-response benchmarking** (A/B without users) | ✅ | ✅ (best fit per agent) | LL + IFM + Best AI |
| 4 | **Synthetic synesthesia (productized)** | ✅ Johnny demoed | ⚠️ latency-heavy | Creativity + Best AI |
| 5 | Neuromarketing compliance audit | 🟡 | ❌ low demo impact | Best AI |
| 6 | Neural-attention-budget planner | ✅ | ✅ | Sideshift |
| 7 | Emotional-fingerprint dashboard (creators) | ✅ | ✅ | Creativity + Sideshift |
| 8 | Content-provenance transparency | ✅ | ❌ low wow-factor | Best AI |

## Agent swarm — capability surface (12 primitives, 8 compositions, 5 candidates)

### Verified primitives
1. Single-item × N-archetype-parallel-evaluation (per-item parallel — GreenChain pattern)
2. Single-claim × actor-auditor-mediator-triad (witnessed dissent)
3. Structured-data + label-schema → parallel-classify (with confidence)
4. N-agents × shared-workspace → war-game (PolicySim, AgentSociety, ContainOS)
5. Prose-intent × generalist-LLM × specialist-LLM → two-stage compile (BRIDGE)
6. Claim × red-team-roster → adversarial debate (RedDebate, aimogus)
7. Profile-schema × N → synthetic-population generation (MATRIX, SynthAgent, Listen Labs)
8. Intermediate-reasoning × chain-depth → sequential decomposition (Sentinel 3000+ turns)
9. Behavioral prediction (predicting agent's next state)
10. Consensus-finding / deliberation (mediator arbitration)
11. Declassification (labels removed when auditor evidence contradicts actor)
12. Federation across sites/users (Edamame, Monolith)

### Cross-product with TRIBE V2 — the load-bearing payoff

The swarm's value-add over raw brain data:
- Brain pattern + N-archetype specialists → **semantic interpretation per region**
- Brain pattern × N candidate generations + iterative loop → **reverse-search content matching pattern**
- Brain pattern + war-game → *"what would happen if Meta deployed this content to 1M users like this?"*
- Brain pattern + classification → **label-the-feed by primary cognitive impact**
- Brain pattern + synthesized profiles → **predicted population brain response**
- Brain pattern + auditor challenge → *"is this content INTENDED to manipulate this brain state?"*
- Multi-site federation → universal-vs-site-specific patterns
- Brain + mediator arbitration → resolve user's stated-preference vs. brain-response disagreement (sycophancy detection)

### Swarm candidates ranked by sponsor-track coverage

| # | Candidate | Empowerment-aligned? | Coverage | Note |
|---|---|---|---|---|
| 1 | OR-Federate (surgical safety) | ❌ DIFFERENT product | 4/5 | Wrong direction — kills locked positioning |
| 2 | EchoFront (compliance audit) | ❌ DIFFERENT product | 3.5/5 | Wrong direction |
| 3 | Containment-Mesh (wildfire ops) | ❌ DIFFERENT product | 5/5 | Wrong direction — fire-ops is not Gen-Z empowerment |
| 4 | GridSentinel (utility inspection) | ❌ DIFFERENT product | 4/5 | Wrong direction |
| 5 | **SynthDebate-on-Brain** | ✅ ALIGNED | 5/5 | **The only candidate that preserves the locked positioning + maximizes track coverage** |

### CRITICAL FILTER: empowerment-positioning lock

The swarm-research agent surfaced 4 high-coverage candidates that are NOT the locked product (OR safety, compliance, fire-ops, utility inspection). These are *valid swarm uses* but they ARE a different product from the Gen-Z empowerment Reels-feed app the team has locked.

**Only candidate that survives both filters (capability-grounded AND empowerment-aligned):**

### SynthDebate-on-Brain — the synthesis pick

**Primitive chain:** brain encoding (TRIBE) + witnessed dissent (actor/auditor/mediator) + behavioral prediction + war-game on synthetic profiles.

**How it works:**
1. User views political/algorithmic content. TRIBE V2 encodes brain response.
2. K2 interprets: *"this content triggers emotion with low critical engagement."*
3. Swarm sim: 100 synthetic agents whose brain-response profiles match this user.
4. War-game: those 100 agents see the same content; debate it over 5 rounds.
5. Output: opinion-stability metric, argument-effectiveness ranking, susceptibility-to-disagreement signal.

**Why it's the synthesis pick:**
- ✅ Explicit Listen Labs fit (multi-agent opinion dynamics — their stated track brief)
- ✅ TRIBE V2 load-bearing (brain grounding for the swarm)
- ✅ K2 load-bearing (100 agents × 5 rounds = 100K tokens; only K2 fits in 90s)
- ✅ Best Use of AI (literacy on AI-driven opinion shifts; YEA/NAY-aligned)
- ✅ Sideshift fit (consumer surface — *"see how susceptible YOUR brain is"*)
- ✅ Creativity (novel: brain-grounded opinion sim)
- ✅ Empowerment positioning (user sees their own susceptibility and chooses)

## How this maps to the locked architecture

**SynthDebate-on-Brain is NOT a replacement for the locked product.** It's an *added execution layer* that uses the same TRIBE+K2 engine. The locked Wrapped output + inverted-brain-search Land card stays. SynthDebate-on-Brain becomes the **post-Wrapped takeaway artifact** Johnny was searching for in the prior turn:

After the Wrapped cards display the user's brain pattern, the system runs a 5-round opinion-debate sim using 100 synthetic agents matching their brain-response archetype. Output: *"Your brain shows susceptibility-to-disagreement of X. Here's how 100 brains like yours debated this content. Here's the argument that flipped 60%."*

This is the **iterative-Wrapped Johnny instinctively reached for** — not by re-feeding new content, but by simulating a population reaction *to the same content* and showing the user where they sit in that population.

## Synthesis verdict

| Adaptation candidate | Validated? | Recommended? |
|---|---|---|
| Adaptation 1 — Iterative Brain-Fill (prior turn) | ✅ valid | ✅ medium-priority pick |
| Adaptation 2 — Shareable Brain Card (prior turn) | ✅ valid | ✅ low-cost-high-payoff pick |
| Adaptation 3 — Prompt Gallery (prior turn) | ✅ valid | ✅ optional |
| **SynthDebate-on-Brain (THIS turn)** | ✅ valid | ✅✅ **the highest-coverage pick** — replaces "more iteration" with "predicted population dynamics" — Listen Labs explicit fit |
| Containment-Mesh / GridSentinel / OR-Federate | ❌ wrong product | ❌ skip |

**Recommended pick: Adaptation 2 (Shareable Brain Card) + SynthDebate-on-Brain.**
- Cost: 3-4h (card) + 4-5h (debate sim) = 7-9h. Within budget.
- Coverage: maximum across all sponsor tracks.
- Demo flow: Wrapped cards → Land card → SynthDebate sim ("here's how 100 brains like yours argue about this") → shareable export.

## What this changes about the locked spec (if Johnny picks SynthDebate)

**Demo BEAT-4 extension:** instead of Land card being the final hero, add a 10-15s SynthDebate beat showing the user how susceptible their brain-archetype is to opinion-shift on the content they just consumed.

**Sponsor closes:** Listen Labs swap slide gets dramatically stronger — the SynthDebate sim IS the explicit answer to their "simulate how people argue, change minds, get influenced" brief.

**PRD §3 architecture diagram:** add the SynthDebate layer downstream of K2 swarm + Opus synthesis.

**FAQ Q-INT-7 (K2-could-be-Claude):** dramatically defended — at Claude latency, 100 agents × 5 rounds doesn't fit in 90s. K2 is structurally required.
