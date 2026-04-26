---
file-type: decision
status: verified
last-verified: 2026-04-25
supports-decisions: []
cites-sources: []
cross-links:
  - ../README.md
  - ../themes/ai-paradox-invisible-use-cases/README.md
---

# Decisions index

Numbered, append-only log of load-bearing decisions Johnny / the team has locked.
Each `NNN-<slug>.md` follows the schema in `caltech/RESEARCH-CONSOLIDATION-PROTOCOL.md` §"Decision".

A decision lives here ONLY when it has:
1. A specific source (yap, sponsor convo, theme README live-thread, Johnny verbatim, sponsor brief).
2. A date locked.
3. A "what this opens / closes" pair.
4. A reversibility clause.

Decisions pulled from `caltech/context/yaps/`, `caltech/context/sponsors/`, `caltech/context/team*.md`, `caltech/context/track-strategy.md`, `caltech/context/architecture.md`, the theme README live-thread, the `/ship-velocity` skill, and Johnny's verbatim directives in window-2 research-deepening files.

| # | Slug | One-line | Locked by | Status |
|---|---|---|---|---|
| 001 | [tech-first-stack-strategy](001-tech-first-stack-strategy.md) | Build the stack first, back-fit the problem to maximize sponsored-track coverage | Johnny + team Friday brainstorm | locked |
| 002 | [track-commitments-locked](002-track-commitments-locked.md) | 3 sponsored CORE (K2/Ironside/Listen Labs) + 2 main (Best AI, Creativity); Palohouse dropped; YC + Sideshift back-propagated | Johnny late-Friday lock | locked |
| 003 | [team-role-lanes-locked](003-team-role-lanes-locked.md) | Johnny=hard innovation; Jacob+Junsoo=execution + agentic orchestration; Emilie=entire packaging | Johnny 2026-04-25 verbatim | locked |
| 004 | [socratic-protocol-installed](004-socratic-protocol-installed.md) | Claude reflects, sharpens, surfaces tensions — never proposes the idea, hook, demo, or product | Johnny 2026-04-25, theme README | locked |
| 005 | [best-use-of-ai-as-hard-target](005-best-use-of-ai-as-hard-target.md) | "Best Use of AI" track is the hard target; the architecture defines what proper AI use looks like | Johnny verbatim, hypothesis frame 2026-04-25 | locked |
| 006 | [tribe-v2-as-special-mode](006-tribe-v2-as-special-mode.md) | TRIBE V2 is the architectural anchor #1 (special mode); we use it because Johnny has hands-on experience and it's a freaky-tech curveball | Johnny 2026-04-25, window-2 100-anchor file | locked |
| 007 | [agent-swarms-as-coordination-pattern](007-agent-swarms-as-coordination-pattern.md) | Multi-agent disagreement-as-feature (Actor / Auditor / Mediator triad) is the architectural anchor #2 | Johnny 2026-04-25, source 004 + window-2 100 | locked |
| 008 | [k2-think-as-speed-engine](008-k2-think-as-speed-engine.md) | K2 = backend speed layer (~1,300 tok/s) for swarm fan-out; not "smart reasoning" — quick menial tasks at scale | Johnny late-Friday + IFM live signal 2026-04-24 | locked |
| 009 | [ironside-pipeline-mirror](009-ironside-pipeline-mirror.md) | Our K2 swarm structurally mirrors Ironside's 3-step pipeline (Auto-Classifier → Narration → Observer-as-Judge), with brain encoding as the new modality | Ironside personal convo Friday | locked |
| 010 | [b2c-primary-b2b-overlay-positioning](010-b2c-primary-b2b-overlay-positioning.md) | Positioning is B2C-primary with B2B-overlay; one architecture, two surfaces, one honest problem statement | Johnny 2026-04-25 hypothesis frame | locked |
| 011 | [demo-over-execution](011-demo-over-execution.md) | "Execution doesn't matter as much as the visualization of all the things that are happening" — packaging > engineering depth | Johnny verbatim, parked PRD scaffold §"design principle" | locked |
| 012 | [feature-freeze-saturday-8pm](012-feature-freeze-saturday-8pm.md) | Feature freeze Saturday 8 PM PDT; submit Saturday 11 PM (10h buffer before 9 AM Sunday Devpost deadline) | /ship-velocity skill principle 10 | locked |
| 013 | [prd-built-in-different-instance](013-prd-built-in-different-instance.md) | PRD is built in a separate Claude instance after consolidation; this window's job is wiki indexing + decision-locking via PRFAQ pattern | Johnny verbatim, parked PRD file 400 | locked |
| 014 | [karpathy-llm-wiki-pattern-adopted](014-karpathy-llm-wiki-pattern-adopted.md) | Wiki structure follows Karpathy's three-layer (raw / wiki / schema) + three-operation (ingest / query / lint) pattern | Johnny authorized, source 007 + window-2 200/300 | locked |
| 015 | [palohouse-dropped](015-palohouse-dropped.md) | Palohouse track is dropped — "we don't want that trash" | Johnny late-Friday lock | locked |
| 016 | [twelve-hour-work-budget-four-people](016-twelve-hour-work-budget-four-people.md) | Total work budget = ~12 hours × 4 people = ~48 person-hours; PRD slices fit ~3-4 person-hour buckets | Johnny late-Friday lock | locked |
| 017 | [ironside-report-card-as-junsoo-wrapper](017-ironside-report-card-as-junsoo-wrapper.md) | Ironside per-action report card runs as a parallel pipeline in `junsoo/report_card/` — does not modify the live B2C orchestrator (lane discipline + dodges K2 Think token-budget bug) | Junsoo 2026-04-25 pre-feature-freeze | locked |
