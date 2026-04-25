---
file-type: vocabulary
status: verified
last-verified: 2026-04-25
supports-decisions: []
cites-sources: []
cross-links:
  - README.md
  - decisions/README.md
  - themes/ai-paradox-invisible-use-cases/README.md
  - themes/ai-paradox-invisible-use-cases/vocabulary.md
  - themes/ai-paradox-invisible-use-cases/live-thread.md
  - findings/lint-2026-04-25.md
  - findings/prd-builder-reading-order-verification.md
  - findings/qa-2026-04-25-research-completeness.md
---

# Wiki content index — every file, one line each

Karpathy `index.md` per pattern in [`themes/ai-paradox-invisible-use-cases/window-2-research-deepening/sources/007-karpathy-llm-wiki-pattern.md`](themes/ai-paradox-invisible-use-cases/window-2-research-deepening/sources/007-karpathy-llm-wiki-pattern.md). The flat catalog of everything that exists. Read this when you want to **browse** the wiki rather than query it.

For lookup-style "I want to know X" → the [navigator skill cheatsheet](../../.claude/skills/llm-wiki-navigator/SKILL.md).
For folder structure → [`README.md`](README.md).
For schemas + protocols → [`../../caltech/RESEARCH-CONSOLIDATION-PROTOCOL.md`](../../caltech/RESEARCH-CONSOLIDATION-PROTOCOL.md).

---

## Top-level wiki entries (the front door)

| File | What it is |
|---|---|
| [`README.md`](README.md) | Folder layout + per-project / per-pattern templates + index of indexes |
| [`index.md`](index.md) | (this file) flat content catalog |

## `decisions/` — the spine (16 numbered + README)

The PRD inherits from here. Every entry locked by Johnny with verifiable trace.

| File | One-line |
|---|---|
| [`decisions/README.md`](decisions/README.md) | Table of all 16 decisions |
| [`decisions/001-tech-first-stack-strategy.md`](decisions/001-tech-first-stack-strategy.md) | Build the stack first, back-fit the problem to maximize sponsored-track coverage |
| [`decisions/002-track-commitments-locked.md`](decisions/002-track-commitments-locked.md) | 3 sponsored CORE (K2 / Ironside / Listen Labs) + 2 main (Best AI / Creativity); Palohouse dropped |
| [`decisions/003-team-role-lanes-locked.md`](decisions/003-team-role-lanes-locked.md) | Johnny=hard innovation; Jacob+Junsoo=execution+agentic; Emilie=packaging |
| [`decisions/004-socratic-protocol-installed.md`](decisions/004-socratic-protocol-installed.md) | Claude reflects, surfaces tensions, never proposes the project idea |
| [`decisions/005-best-use-of-ai-as-hard-target.md`](decisions/005-best-use-of-ai-as-hard-target.md) | "Best Use of AI" track is the hard target; architecture defines what proper AI use looks like |
| [`decisions/006-tribe-v2-as-special-mode.md`](decisions/006-tribe-v2-as-special-mode.md) | TRIBE V2 architectural anchor #1 (special mode) |
| [`decisions/007-agent-swarms-as-coordination-pattern.md`](decisions/007-agent-swarms-as-coordination-pattern.md) | Multi-agent disagreement-as-feature (Actor / Auditor / Mediator) anchor #2 |
| [`decisions/008-k2-think-as-speed-engine.md`](decisions/008-k2-think-as-speed-engine.md) | K2 = backend speed layer ~1,300 tok/s for swarm fan-out (NOT smart reasoning) |
| [`decisions/009-ironside-pipeline-mirror.md`](decisions/009-ironside-pipeline-mirror.md) | Our K2 swarm mirrors Ironside's 3-step pipeline with brain encoding as new modality |
| [`decisions/010-b2c-primary-b2b-overlay-positioning.md`](decisions/010-b2c-primary-b2b-overlay-positioning.md) | B2C-primary, B2B-overlay; one architecture, two surfaces |
| [`decisions/011-demo-over-execution.md`](decisions/011-demo-over-execution.md) | Packaging > engineering depth |
| [`decisions/012-feature-freeze-saturday-8pm.md`](decisions/012-feature-freeze-saturday-8pm.md) | Feature freeze Saturday 8 PM PDT; submit Saturday 11 PM |
| [`decisions/013-prd-built-in-different-instance.md`](decisions/013-prd-built-in-different-instance.md) | PRD built in separate Claude instance after consolidation |
| [`decisions/014-karpathy-llm-wiki-pattern-adopted.md`](decisions/014-karpathy-llm-wiki-pattern-adopted.md) | Wiki structure follows Karpathy three-layer + three-operation pattern |
| [`decisions/015-palohouse-dropped.md`](decisions/015-palohouse-dropped.md) | Palohouse track dropped |
| [`decisions/016-twelve-hour-work-budget-four-people.md`](decisions/016-twelve-hour-work-budget-four-people.md) | Total work budget = ~12h × 4 people = ~48 person-hours |
| [`decisions/017-ironside-report-card-as-junsoo-wrapper.md`](decisions/017-ironside-report-card-as-junsoo-wrapper.md) | Ironside per-action report card runs as a parallel pipeline in `junsoo/report_card/`, not as an orchestrator rewrite |

## `themes/` — directional anchors

| File | One-line |
|---|---|
| [`themes/README.md`](themes/README.md) | How themes work + per-theme conventions |
| [`themes/ai-paradox-invisible-use-cases/README.md`](themes/ai-paradox-invisible-use-cases/README.md) | The lock document — Johnny's verbatim problem statement + Socratic protocol + theme-vs-hypothesis split |
| [`themes/ai-paradox-invisible-use-cases/live-thread.md`](themes/ai-paradox-invisible-use-cases/live-thread.md) | SOTARE-style append-only directional changelog (every framing shift dated) |
| [`themes/ai-paradox-invisible-use-cases/vocabulary.md`](themes/ai-paradox-invisible-use-cases/vocabulary.md) | ~120 cross-source terms in 6 buckets (failure-mode / architectural-fix / augmentation-and-mind / LLM-wiki-process / demo-and-pitch / persona-and-process) |

### `themes/<slug>/sources/` — raw source pages (verbatim + extracts)

| File | One-line |
|---|---|
| [`sources/001-hak-systems-thinking.md`](themes/ai-paradox-invisible-use-cases/sources/001-hak-systems-thinking.md) | Hak / AgentiveStack on systems thinking + the broken junior pipeline (software craft) |
| [`sources/002-algorithmic-culture-flattening.md`](themes/ai-paradox-invisible-use-cases/sources/002-algorithmic-culture-flattening.md) | Algorithmic culture / Filter World / Death of Personal Style (consumer taste) |
| [`sources/003-trends-slop-and-the-comment-section-in-flesh.md`](themes/ai-paradox-invisible-use-cases/sources/003-trends-slop-and-the-comment-section-in-flesh.md) | Trends slop / Krafton-Subnautica / "AI is the internet comment section taking flesh" (strategic judgment) |

### `themes/<slug>/sources/deep-dives/` — primary-source canonical references

| File | One-line |
|---|---|
| [`sources/deep-dives/tribe-v2-canonical-reference.md`](themes/ai-paradox-invisible-use-cases/sources/deep-dives/tribe-v2-canonical-reference.md) | TRIBE v2 verified facts — CORRECTS source 006 on 3 load-bearing claims |
| [`sources/deep-dives/emotional-depth-demo-theatre-canonical.md`](themes/ai-paradox-invisible-use-cases/sources/deep-dives/emotional-depth-demo-theatre-canonical.md) | 8-emotion taxonomy + 16-mechanic catalog + 90-second demo template |

### `themes/<slug>/window-2-research-deepening/` — archived feedstock from worktree phase

> ⚠️ This folder is post-merge **archived feedstock**. Most signal has graduated to permanent locations (decisions/, vocabulary.md, deep-dives/, projects/, patterns/). Read directly only when chasing T1/T2 provenance or the QA-pass details.

| File | One-line |
|---|---|
| [`window-2-research-deepening/000-coordination-and-thesis-snapshot.md`](themes/ai-paradox-invisible-use-cases/window-2-research-deepening/000-coordination-and-thesis-snapshot.md) | Window-2 worktree coordination + Johnny's thesis snapshot (B2C + 5-sponsor lens) |
| [`window-2-research-deepening/001-claude-code-research-skills-survey.md`](themes/ai-paradox-invisible-use-cases/window-2-research-deepening/001-claude-code-research-skills-survey.md) | Survey of 8 deep-research skills available to install |
| [`window-2-research-deepening/002-installed-skills-inventory.md`](themes/ai-paradox-invisible-use-cases/window-2-research-deepening/002-installed-skills-inventory.md) | Inventory of 8/8 cloned skills + caveats per skill |
| [`window-2-research-deepening/100-tribe-v2-and-agent-swarms-architectural-anchors.md`](themes/ai-paradox-invisible-use-cases/window-2-research-deepening/100-tribe-v2-and-agent-swarms-architectural-anchors.md) | Architectural-anchor synthesis — captures Johnny's TRIBE+swarms commitment |
| [`window-2-research-deepening/200-llm-wiki-recall-patterns-sotare-and-karpathy.md`](themes/ai-paradox-invisible-use-cases/window-2-research-deepening/200-llm-wiki-recall-patterns-sotare-and-karpathy.md) | SOTARE structural teardown + Karpathy first-principles synthesis (~6.5K words) |
| [`window-2-research-deepening/300-wiki-redesign-blueprint.md`](themes/ai-paradox-invisible-use-cases/window-2-research-deepening/300-wiki-redesign-blueprint.md) | Wiki redesign blueprint (3-layer Karpathy + SOTARE idiom + draft schema) — partially applied |
| [`window-2-research-deepening/400-prd-scaffold.md`](themes/ai-paradox-invisible-use-cases/window-2-research-deepening/400-prd-scaffold.md) | ⛔ PARKED PRD scaffold — preserved as decision-extraction feedstock, NOT extended |
| [`window-2-research-deepening/500-elicitation-qa-pass.md`](themes/ai-paradox-invisible-use-cases/window-2-research-deepening/500-elicitation-qa-pass.md) | **T1 lives here.** Socratic / Red Team / Pre-Mortem / First-Principles attacks |
| [`window-2-research-deepening/501-party-mode-roundtable.md`](themes/ai-paradox-invisible-use-cases/window-2-research-deepening/501-party-mode-roundtable.md) | **T2 lives here.** 6-persona roundtable + 23 open questions |
| [`window-2-research-deepening/sources/004-multi-agent-alignment-actor-auditor-mediator.md`](themes/ai-paradox-invisible-use-cases/window-2-research-deepening/sources/004-multi-agent-alignment-actor-auditor-mediator.md) | Source on actor / auditor / mediator triad + emotivist layer (24-month deadline framing) |
| [`window-2-research-deepening/sources/005-kurzgesagt-the-secret-mind-and-collaborative-inner-universe.md`](themes/ai-paradox-invisible-use-cases/window-2-research-deepening/sources/005-kurzgesagt-the-secret-mind-and-collaborative-inner-universe.md) | Source on collaborative-mind / mind-as-gap (Kurzgesagt video) |
| [`window-2-research-deepening/sources/006-tribe-v2-meta-trimodal-brain-encoder.md`](themes/ai-paradox-invisible-use-cases/window-2-research-deepening/sources/006-tribe-v2-meta-trimodal-brain-encoder.md) | TRIBE v2 source (YouTube transcripts) — superseded by `sources/deep-dives/tribe-v2-canonical-reference.md` for facts |
| [`window-2-research-deepening/sources/007-karpathy-llm-wiki-pattern.md`](themes/ai-paradox-invisible-use-cases/window-2-research-deepening/sources/007-karpathy-llm-wiki-pattern.md) | Karpathy's verbatim LLM Wiki essay — canonical source for the wiki pattern itself |

## `projects/` — per-project teardowns

| File | One-line | Repo verified? |
|---|---|---|
| [`projects/bridge.md`](projects/bridge.md) | HackPrinceton 2026 — language-to-action robotics. Two-stage LLM compile (Gemini → K2 → PyBullet). | ✅ |
| [`projects/greenchain.md`](projects/greenchain.md) | HackPrinceton 2026 — supply-chain emissions comparator. Dedalus swarm + K2 cascade + XGBoost. | ✅ |
| [`projects/jarvis.md`](projects/jarvis.md) | Construction-headcam intelligence (Localize-and-Zoom + spatial sidecar + grounded report + voice agent). | ❌ no repo |
| [`projects/memento.md`](projects/memento.md) | 🔴 HIGH lookalike-risk teardown (HackTech 2025 winner with overlapping shape). | per scrape |
| [`projects/renaissance-research.md`](projects/renaissance-research.md) | 🔴 HIGH lookalike-risk teardown (HackTech 2025 winner with three-perspective stream + grounded citations). | per scrape |
| [`projects/mira.md`](projects/mira.md) | 🔴 TreeHacks 2026 Most Impactful + OpenAI AI Track 1st — Ray-Ban + spatial VLM eldercare. 6 Devpost claims unimplemented in repo. | ✅ partial |
| [`projects/tribune.md`](projects/tribune.md) | 🟠 (8/10) TreeHacks 2026 Anthropic Human Flourishing 1st — civic policy diff w/ cited constituent voices. Audio-clip citations claim is unimplemented (text only). | ✅ partial |
| [`projects/containos.md`](projects/containos.md) | 🟡 (6/10) TreeHacks 2026 OpenAI AI Track 1st — wildfire incident command. Claimed multi-LLM ensemble fires only GPT-4o + Gemini; Claude SDK installed but unused. | ✅ partial |
| [`projects/keryx.md`](projects/keryx.md) | 🟡 TreeHacks 2026 Human Capital Fellowship — drone + VLM navigable world model. Apple Depth Pro shipped but never called by agent path. | ✅ partial |
| [`projects/orchestration-co-of-palo-alto.md`](projects/orchestration-co-of-palo-alto.md) | 🔴 TreeHacks 2026 Interaction Co. (Poke) — Vision Pro AR control room with agents-as-3D-desks. Closest precedent for witnessed-dissent UI. | ✅ verified |
| [`projects/4sight.md`](projects/4sight.md) | 🔴 TreeHacks 2026 Cloudflare Best Use ($250K) — wearable biometrics + egocentric VLM + Cloudflare-edge nudge. Not actually an agent loop — 1-min Worker cron over D1 SQL. | ✅ partial |

> **TreeHacks 2026 top-6 teardowns landed 2026-04-25** as one-repo-per-parallel-agent dispatches (after a single mega-agent attempt stalled on laptop sleep). Each teardown caught at least one Devpost-vs-repo gap that the team can exploit for differentiation. The remaining ~54 winners with public repos are pre-prioritized in [`scrapes/treehacks-2026-winners.md`](scrapes/treehacks-2026-winners.md) — clone on demand if needed.

## `patterns/` — cross-project architectural primitives

| File | One-line |
|---|---|
| [`patterns/two-stage-llm-compile.md`](patterns/two-stage-llm-compile.md) | Generalist LLM drafts in prose; specialist reasoner compiles to constrained DSL; sandbox interpreter runs only the DSL |
| [`patterns/robust-json-from-llms.md`](patterns/robust-json-from-llms.md) | Strict Pydantic + brace-balanced extractor + retry-with-correction loop (~30 LOC) |
| [`patterns/per-item-parallel-llm-evaluation.md`](patterns/per-item-parallel-llm-evaluation.md) | `asyncio.Semaphore`-bounded fan-out per item, not one mega-prompt |
| [`patterns/localize-and-zoom.md`](patterns/localize-and-zoom.md) | Defeat VLM spatial blindness by re-querying on a raw-resolution crop |
| [`patterns/spatial-sidecar.md`](patterns/spatial-sidecar.md) | Cheap perception models → JSON evidence file → LLM reasons over JSON |
| [`patterns/grounded-citation.md`](patterns/grounded-citation.md) | Every output points back to a verifiable source artifact |
| [`patterns/witnessed-dissent.md`](patterns/witnessed-dissent.md) | Multi-agent disagreement IS the un-black-box mechanism (Actor / Auditor / Mediator triad) |
| [`patterns/k2-reasoning-plus-instruct-synthesis.md`](patterns/k2-reasoning-plus-instruct-synthesis.md) | Reasoning model for parallel specialists, fast instruct model for structured-JSON synthesis (split the model by job) |

## `tools/` — per-tool API + integration + gotchas

| File | One-line |
|---|---|
| [`tools/k2-think.md`](tools/k2-think.md) | K2 Think v2 — MBZUAI reasoning model, OpenAI-compatible chat-completions API, structured-reasoning specialist |

> **Open gap:** TRIBE V2, Listen Labs, Ironside don't yet have dedicated `tools/` entries. TRIBE V2 capabilities live in `themes/.../sources/deep-dives/tribe-v2-canonical-reference.md` (a source-style doc, not tool-style). Listen Labs canonical info at `caltech/context/sponsors/listenlabs.md` (sponsor brief, not tool integration). Ironside: `caltech/context/sponsors/ironsite.md` + `decisions/009-ironside-pipeline-mirror.md`.

## `stacks/` — recurring full-stack combos

> Currently empty. Reserve for combos that ship in 24–36h once we've teardown'd ≥ 2 wins using the same combo.

## `scrapes/` — agent-produced gallery scrapes

| File | One-line |
|---|---|
| [`scrapes/treehacks-2026-winners.md`](scrapes/treehacks-2026-winners.md) | TreeHacks 2026 — 64 winners table with 60 public GH repos, industry breakdown, top-N picks for code teardown |

## `findings/` — query-time synthesis + lint outputs

| File | One-line |
|---|---|
| [`findings/lint-2026-04-25.md`](findings/lint-2026-04-25.md) | Karpathy lint pass — health summary, T1/T2 surface check, broken-link audit, suggested next questions |
| [`findings/prd-builder-reading-order-verification.md`](findings/prd-builder-reading-order-verification.md) | Cold-load test of the 10-file PRD-builder reading order — verdict: ✅ sufficient |
| [`findings/qa-2026-04-25-research-completeness.md`](findings/qa-2026-04-25-research-completeness.md) | Final QA — 25/25 concepts searchable, 51/51 files reachable, 4 orphans patched, process clean |

---

## Files OUTSIDE `research/wiki/` that are part of the knowledge base

The wiki is the synthesized layer. Reference / context / raw / sponsor-clone material lives in parallel trees. The navigator skill cheatsheet ([`.claude/skills/llm-wiki-navigator/SKILL.md`](../../.claude/skills/llm-wiki-navigator/SKILL.md)) covers all of these as lookup rows.

### `caltech/` — event + team + protocol

| File | One-line |
|---|---|
| [`../../caltech/RESEARCH-CONSOLIDATION-PROTOCOL.md`](../../caltech/RESEARCH-CONSOLIDATION-PROTOCOL.md) | The Karpathy gates + Socratic protocol + per-file-type schemas the consolidation agent enforces |
| [`../../caltech/CONSOLIDATION-REPORT.md`](../../caltech/CONSOLIDATION-REPORT.md) | What consolidation ingested, what it dropped, what gaps remain, the PRD-builder reading order |
| [`../../caltech/HANDOFF.md`](../../caltech/HANDOFF.md) | Hand-off note from earlier setup phase |

### `caltech/context/` — event + sponsor + track + team + yap canonical briefs

| Subfolder | What's there |
|---|---|
| `caltech/context/event.md` | Event details (date, format, sponsors) |
| `caltech/context/architecture.md` | Team's own architecture context doc |
| `caltech/context/constraints.md` | Time / sponsor / scope constraints |
| `caltech/context/track-strategy.md` | Track-strategy summary across all considered + committed tracks |
| `caltech/context/team.md` + `team/{johnny,jacob,emilie,junsoo}.md` + `johnny-public-corpus.md` | Team overview + per-person profile + lane assignment (per decision 003) |
| `caltech/context/sponsors/{ifm-k2,ironsite,listenlabs,palohouse,sideshift,yc,mlh-mini-challenges}.md` | Per-sponsor canonical brief (these are AUTHORITATIVE — `research/sponsors/` are inboxes only) |
| `caltech/context/tracks/{best-use-of-ai,creativity,cybersecurity-safety,not-so-sexy}.md` | Per-track brief (best-use-of-ai is hard target per decision 005; creativity is curveball via TRIBE v2 per decision 006; others are also-considered) |
| `caltech/context/yaps/2026-04-24-{opening-team-direction,judge-conversations-and-emerging-themes,strategy-pivot-tech-first-stack}.md` | Chronological yap notes from team conversations |

### `caltech/ideation/` — other-window ideation sweep (with Socratic-protocol caveats)

| File | One-line |
|---|---|
| `caltech/ideation/INDEX.md` | **Read first.** Flags which sections of the 4 sweep files are Socratic-protocol violations (rankings, recommendations) and must be ignored. |
| `caltech/ideation/01-problem-space-buffet.md` | Problem-space exploration |
| `caltech/ideation/02-winner-cross-comparison.md` | Past-winner cross-comparison (source for Memento + Renaissance Research lookalike teardowns) |
| `caltech/ideation/03-pitch-hooks.md` | Pitch-hook variants — read through INDEX caveats |
| `caltech/ideation/04-front-facing-concepts.md` | Front-facing concept variants — read through INDEX caveats |

### `research/sponsors/` — sponsor inboxes (NOT canonical — see `caltech/context/sponsors/` instead)

| Path | What's there |
|---|---|
| `research/sponsors/README.md` | Workflow for sponsor research |
| `research/sponsors/{ironsight,k2-think,listen-labs}/SOURCES.md` | Empty inbox templates from the setup phase |
| `research/sponsors/k2-think/analysis/{bridge,greenchain}.md` | Pointer files linking to `research/wiki/projects/` canonical entries |
| `research/sponsors/k2-think/clones/{bridge,greenchain}/` | The two cloned hackathon-winning repos (gitignored from outer commit; live on disk) |

### `.claude/skills/` — installed Claude Code skills

| Skill | What it does |
|---|---|
| [`.claude/skills/llm-wiki-navigator/SKILL.md`](../../.claude/skills/llm-wiki-navigator/SKILL.md) | This wiki's operating manual — auto-triggers on PRFAQ / wiki-query / "what's locked?" prompts |
| [`.claude/skills/ship-velocity/SKILL.md`](../../.claude/skills/ship-velocity/SKILL.md) | Solo-ship discipline adapted for 4-person hackathon team |
| `.claude/skills/academic-research-skills/` | Imbad0202 ARS — 13-agent research team, Socratic guided mode, PRISMA |
| `.claude/skills/bmad-*` | ~52 BMAD skills (advanced-elicitation, party-mode, distillator, index-docs, shard-doc, create-prd, edit-prd, validate-prd, prfaq, product-brief, domain-research, technical-research, market-research, etc.) |

---

## How to extend this index

When a new file lands in the wiki:

1. Add a row to the appropriate section above with file path + one-line description.
2. If the file is a new file-type we haven't catalogued before, add a new section.
3. If the file is part of a planned-but-deferred expansion (e.g. `concepts/`, `entities/`), note it in the "Open gap" line of the parent section.
4. Append a one-line ingest entry to [`themes/<slug>/live-thread.md`](themes/ai-paradox-invisible-use-cases/live-thread.md) per Karpathy's log convention.

This index is **maintained**, not generated. If a file exists that's not listed here, that's an index drift and the next lint pass will surface it.
