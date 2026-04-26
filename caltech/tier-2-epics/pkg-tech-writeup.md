---
file-type: tier-2-epic
status: spec — fresh-Claude-spawn-ready
worktree: .worktrees/pkg-tech-writeup
owner: Junsoo + tech-writeup Claude
duration_estimate: 3-4 person-hours (Saturday afternoon, in parallel with build)
last-verified: 2026-04-25
purpose: Junsoo's PhD-application research artifact (per his stated win-conditions in junsoo.md)
---

# Tier-2 Epic — Technical Writeup (Publishable Spec)

## Mission

A short-form publishable technical writeup — paper-grade, citation-worthy — that becomes Junsoo's hackathon-derived research artifact for grad-school applications. Per `team/junsoo.md`: *"Strong letters of rec, real research artifact, coherent research statement, depth in theoretical coursework."* This artifact serves the artifact slot.

## INPUT

1. `caltech/tasks-by-person/junsoo-tribe-v2.md` (your task scope — read fully)
2. `caltech/prd.md` §3 (architecture)
3. `caltech/research-context/007-johnny-public-corpus-tribe-posts.md` (Johnny's prior TRIBE work — cite as related work)
4. `caltech/research-context/006-rescorla-wagner-surprise.md` + `003-keltner-haidt-approaching-awe.md` (academic sources cited in our work)
5. `research/wiki/themes/ai-paradox-invisible-use-cases/sources/deep-dives/tribe-v2-canonical-reference.md`
6. `research/wiki/decisions/006-tribe-v2-as-special-mode.md` + `007-agent-swarms-as-coordination-pattern.md`

## STRUCTURE (paper-shape)

### Abstract (200 words)
Problem: algorithmic recommender systems shape neural response patterns invisibly at population scale. Approach: cross-region multi-agent LLM coordination over TRIBE V2 brain-encoding predictions to surface the cognitive-content relationship in a user-controllable interface. Contribution: protocol specification for cross-region semantic handoffs + empirical validation that cross-talk produces semantically distinct outputs across regions.

### 1. Introduction
- The algorithmic-shaping problem at population scale
- Why brain encoding (TRIBE V2) provides a non-platform-derived audit signal
- The contribution: a multi-agent coordination protocol where each agent corresponds to a cortical region, with cross-region message-passing producing interpretable per-region semantic claims

### 2. Related Work
- Brain encoding models: TRIBE V2 (Meta FAIR ICLR 2026), prior fMRI-based encoders
- Multi-agent LLM coordination: Renaissance Research debate triad, ContainOS validator pattern, Junsoo's prior LLM ↔ PDDL bridge work
- Black-box LLM behavior probing methodology (Junsoo's prior research thread)
- Reverse-inference critiques (Poldrack 2006) — establish what we DO and DO NOT claim

### 3. Method
- 3.1 Input pipeline (video → TRIBE V2 → per-region activation JSON)
- 3.2 Cortical parcellation choice (atlas: Glasser 360 / Yeo-7 / chosen)
- 3.3 Cross-region communication protocol (formal):
  - Round 1: each region-specialist outputs initial hypothesis given activation pattern + content context
  - Round 2: each specialist re-evaluates given peer outputs (cross-talk)
  - Aggregator: weighted synthesis where weight = activation magnitude × cross-region influence
- 3.4 Validation methodology (black-box probing):
  - Semantic distinctness measurement across region outputs
  - Comparative baseline: single-LLM-call vs. swarm with cross-talk
  - Within-subject contrast vs. between-subject confound (T2 audit)

### 4. Results (small-N empirical)
- 4.1 Cross-talk produces semantically distinct outputs (measured by embedding distance)
- 4.2 Within-subject contrast: same brain on algorithmic-feed vs. hand-curated content shows visibly different activation patterns (precedent: Johnny's Synthetic Synesthesia work — 90.4% emotion-center match, falsified against controls)
- 4.3 Latency profile (TRIBE inference + K2 swarm fan-out + visualization render): demo runs in 90s on consumer GPU

### 5. Discussion
- 5.1 Limitations: TRIBE OOD degradation on non-mainstream content (0.32 → 0.17 score)
- 5.2 Reverse-inference scope: we claim activation-pattern observation, not felt-emotion decoding
- 5.3 The Filter-World tension (T2): our within-subject contrast methodology avoids population-norm comparisons; the audit grounding is the user's own brain across diverse inputs
- 5.4 Future work: federated multi-subject deployment with consented cohort baselines; neurodiversity-aware contrast methodology; on-device inference path

### 6. Conclusion
The contribution is a coordination protocol that bridges multi-agent LLM systems with whole-cortex brain-encoding predictions to surface algorithmic shaping at the cognitive-pattern level. This provides a research-grade methodology for the empowerment-over-extraction direction in human-AI interaction design.

### References
- Meta FAIR ICLR 2026 (TRIBE V2)
- Poldrack 2006 (reverse inference)
- Keltner & Haidt 2003 (awe / cortical-vertex visualization framing)
- Rescorla-Wagner / surprise literature (PMC3858647)
- Renaissance Research HackTech 2025 (multi-LLM debate)
- Donella Meadows leverage-points
- Karpathy LLM-wiki pattern (research methodology)

### Appendix A — Cross-region protocol pseudocode
### Appendix B — Per-region specialist prompt templates
### Appendix C — Empirical results data tables

## OUTPUT FORMAT

```
.worktrees/pkg-tech-writeup/
├── paper.md (Markdown source — convert to LaTeX or PDF for submission)
├── paper.pdf (compiled)
├── figures/
│   ├── architecture-diagram.png
│   ├── cross-talk-flow.png
│   └── results-table.png
├── code-snippets/
│   ├── cross-region-protocol.py
│   └── black-box-probing.py
├── references.bib
└── README.md (Junsoo's notes — what to extend post-hackathon)
```

## SUCCESS CRITERIA

- 2,500-4,000 words (workshop-paper length, not full conference)
- Citation-grade references with verified URLs
- Cross-region protocol formally specified (Junsoo's PDDL/Icarus Lab background applies)
- Empirical results section even if N is small — methodology is the artifact
- Reads as a Junsoo-authored paper, suitable to attach to a PhD application

## ROLE FOR LETTERS-OF-REC

Per `junsoo.md`, Junsoo's PhD target is Sven Koenig's IDM Lab (MAPF / multi-agent path-finding at USC). The cross-region coordination protocol has direct interest-overlap. **If this writeup gets cited (even informally) by Sven's lab or its orbit, it becomes letter-of-rec material.** Frame the contribution accordingly.

## DEPENDENCIES

- INPUT: actual K2 swarm cross-region results (Saturday afternoon when Jacob's pipeline runs)
- INPUT: TRIBE V2 latency + accuracy numbers from Junsoo's pipeline
- TIMING: parallel with build; can write Sections 1, 2, 3 from spec; fill Section 4 (results) Saturday evening
- DEADLINE: Saturday 11 PM (with Devpost) — but post-hackathon polish is acceptable for the PhD-app version
