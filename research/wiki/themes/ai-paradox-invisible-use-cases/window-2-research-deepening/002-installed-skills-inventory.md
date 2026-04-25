# 002 — Installed Skills Inventory

Eight Claude Code skills/plugins were cloned into the worktree's gitignored
skills directory as siblings to the pre-existing `academic-research-skills`.
Each was inspected for a real skill manifest (`SKILL.md`, `plugin.json`,
`marketplace.json`, or equivalent) and a license file.

**Install root:** `/Users/johnnysheng/code/hackathon/.worktrees/caltech-ideation-window-2/.claude/skills/`

**Install method:** `git clone --depth 1 <github-url>` directly into the
skills root for each repo.

**Result:** 8 of 8 cloned successfully. No failures. Two notes on shape:
`gstack` is a sprawling 23-skill workspace (the `/office-hours` and
`/plan-ceo-review` skills the user named are real subdirectories). The
K-Dense `claude-scientific-skills` repo contains 134 individual skill
folders — it does NOT ship explicit "PubMed" / "OpenAlex" / "Semantic
Scholar" subskills under those names; the closest equivalents are
`research-lookup`, `scholar-evaluation`, `open-notebook`, `research-grants`,
and `venue-templates`. Flagging this honestly so the user isn't surprised.

---

## 1. claude-deep-research-skill (199-biotechnologies)

- **GitHub URL:** https://github.com/199-biotechnologies/claude-deep-research-skill
- **Install path:** `/Users/johnnysheng/code/hackathon/.worktrees/caltech-ideation-window-2/.claude/skills/claude-deep-research-skill/`
- **License:** MIT (declared in README; **no LICENSE file in the repo** — minor compliance gap, but README is explicit: "MIT - modify as needed for your workflow")
- **Manifest:** `SKILL.md` at repo root with YAML frontmatter (`name: deep-research`)
- **Summary:** 8-phase deep-research pipeline (Scope -> Plan -> Retrieve -> Triangulate -> Outline Refinement -> Synthesize -> Critique -> Refine -> Package) with four modes (quick/standard/deep/ultradeep), source credibility scoring, multi-provider search via optional `search-cli`, McKinsey-style HTML/PDF report output, and validation loops.
- **Entry point:** `SKILL.md` (auto-loads on natural-language triggers like "deep research", "ultradeep mode", or "research report"). Helper Python scripts live in `scripts/` (e.g. `validate_report.py`, `verify_citations.py`, `research_engine.py`).
- **Install status:** Installed.

## 2. claude-research-skill (altmbr)

- **GitHub URL:** https://github.com/altmbr/claude-research-skill
- **Install path:** `/Users/johnnysheng/code/hackathon/.worktrees/caltech-ideation-window-2/.claude/skills/claude-research-skill/`
- **License:** MIT (Copyright 2026 Bryan Altman, `LICENSE` file present)
- **Manifest:** `SKILL.md` at repo root. Note: the `SKILL.md` is structured as a slash-command body (`# /research — Multi-Agent Research Orchestrator`) and the README's install instructions copy it to `~/.claude/commands/research.md` rather than to the skills dir. So in this current install location it functions as a **skill** that triggers on the `/research` keyword, not literally as a `/research` slash command. To get true slash-command behavior the user should either symlink/copy `SKILL.md` to `~/.claude/commands/research.md` per the README, or call it explicitly via the Skill tool.
- **Summary:** Minimal-viable parallel-agent research orchestrator. Decomposes a question into 2-4 non-overlapping workstreams, presents the plan for approval, launches `general-purpose` subagents in parallel via the Task tool with strict per-search write protocols, monitors them at escalating intervals, and runs a synthesis agent at the end. Single-file skill (~10KB).
- **Entry point:** `SKILL.md`. Designed as `/research <question>`.
- **Install status:** Installed.

## 3. deep-research-plugin (defiect)

- **GitHub URL:** https://github.com/defiect/deep-research-plugin
- **Install path:** `/Users/johnnysheng/code/hackathon/.worktrees/caltech-ideation-window-2/.claude/skills/deep-research-plugin/`
- **License:** MIT (Copyright 2026 Sean Demers, `LICENSE` file present)
- **Manifest:** Full Claude Code plugin layout — `.claude-plugin/plugin.json` declares `agents`, `skills`, `hooks`, `outputStyles`. Four agents (`dr-lead` Opus, `dr-scout` Sonnet, `dr-analyst` Opus, `dr-writer` Opus) under `agents/`. Four sub-skills under `skills/{init,run,report,status}/SKILL.md`. Hooks under `hooks/hooks.json` fire on `TaskCompleted`, `TeammateIdle`, and `PreCompact`, calling `python3 ${CLAUDE_PLUGIN_ROOT}/scripts/dr_audit.py` to enforce evidence-graph quality gates that block agents from marking work complete without required artifacts.
- **Summary:** Multi-agent deep research orchestrator with evidence-graph hooks. Every claim must trace to a source excerpt; key claims need triangulation across multiple sources; conflicts are surfaced rather than hidden; quality gates block unsupported assertions. Produces structured artifacts under `.deep-research/runs/` (sources.jsonl, claims.jsonl, evidence.jsonl, conflicts.md, etc.).
- **Entry point:** Slash commands `/deep-research:init`, `/deep-research:run <topic>`, `/deep-research:status`, `/deep-research:report`. Requires Claude Code v2.1.32+ and Python 3.10+. For full multi-agent parallelism, set `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`.
- **Install status:** Installed.

## 4. claude-scientific-skills (K-Dense-AI)

- **GitHub URL:** https://github.com/K-Dense-AI/claude-scientific-skills
- **Install path:** `/Users/johnnysheng/code/hackathon/.worktrees/caltech-ideation-window-2/.claude/skills/claude-scientific-skills/`
- **License:** MIT (Copyright 2025 K-Dense Inc., `LICENSE.md` present)
- **Manifest:** 134 skill subdirectories under `scientific-skills/`, each with its own `SKILL.md`. No top-level orchestrator manifest — this is a flat library of independently-triggered skills.
- **Summary:** Massive library of research/scientific tooling skills. Includes `research-lookup` (parallel-cli + Parallel Chat API + Perplexity sonar-pro-search router for paper search), `scholar-evaluation`, `open-notebook` (self-hosted NotebookLM alternative), `research-grants`, `venue-templates`, plus 129 others spanning bioinformatics (biopython, scanpy, deepchem, esm, alphafold-adjacent), ML (transformers, torch-geometric, stable-baselines3), data tooling (dask, zarr, xlsx), quantum (cirq, qiskit, qutip), domain-specific scientific writing/slides/visualization, and more.
- **HONESTY NOTE:** The user described this as "PubMed / OpenAlex / Semantic Scholar wrappers + Open Notebook." There is **no** subskill literally named `pubmed`, `openalex`, or `semantic-scholar`. The closest analog is `research-lookup`, which routes queries between parallel-cli (web), Parallel Chat API (deep research), and Perplexity sonar-pro-search (academic). `open-notebook` IS present as named.
- **Entry point:** Each subskill auto-triggers on its description keywords; e.g. `research-lookup` triggers on "look up papers", "find research". Many require API keys (`PARALLEL_API_KEY`, `OPENROUTER_API_KEY`) or external installs (parallel-cli).
- **Install status:** Installed (with naming caveat above).

## 5. claude-skills (Jeffallan) — "The Fool" 5-mode reasoning skill

- **GitHub URL:** https://github.com/Jeffallan/claude-skills
- **Install path:** `/Users/johnnysheng/code/hackathon/.worktrees/caltech-ideation-window-2/.claude/skills/claude-skills/`
- **License:** MIT (Copyright 2025, `LICENSE` present)
- **Manifest:** 66-skill marketplace plugin. The specific skill the user wants is `skills/the-fool/SKILL.md`. Plugin marketplace install path is `/plugin marketplace add jeffallan/claude-skills` then `/plugin install fullstack-dev-skills@jeffallan`.
- **Summary:** "The Fool" is a 5-mode structured critical-reasoning skill: Socratic / Dialectic / Pre-Mortem / Red Team / Evidence Audit. Workflow: Identify (steelman the user's position) -> Select (mode via `AskUserQuestion`) -> Challenge (load mode-specific reference) -> Engage (3-5 strongest challenges) -> Synthesize (offer second-pass with different mode). Sits inside a much larger 66-skill bundle covering languages/frameworks/devops/security/etc, but the-fool is the one the user asked for.
- **Entry point:** `skills/the-fool/SKILL.md`. Auto-triggers on phrases like "play the fool", "devil's advocate", "challenge this", "stress test", "poke holes", "what could go wrong", "red team", "pre-mortem", "test my assumptions". Other skills in the bundle (66 total) trigger on their own keywords.
- **Install status:** Installed.

## 6. grillme-skill (Jekudy)

- **GitHub URL:** https://github.com/Jekudy/grillme-skill
- **Install path:** `/Users/johnnysheng/code/hackathon/.worktrees/caltech-ideation-window-2/.claude/skills/grillme-skill/`
- **License:** MIT (Copyright 2026, `LICENSE` present at repo root)
- **Manifest:** `.claude-plugin/marketplace.json` (declares the `grillme` plugin), `plugin.json` at root, and the actual skill body at `skills/grillme/SKILL.md`. SKILL.md frontmatter is in Russian + English (description includes both languages' trigger phrases).
- **Summary:** Socratic 3-wave structured-questioning protocol. Wave 1 (3-5 questions): goals/context/constraints. Wave 2 (2-4 questions): edge cases/conflicts/dependencies. Wave 3+ (1-3 questions): contradictions/implicit assumptions/blind spots. Between waves, produces a summary with facts, verified vs unverified assumptions, and risks-converted-to-questions. Output is a portable assumption ledger.
- **Entry point:** `/grillme` slash command, OR triggers on "grill me", "задавай вопросы", "допроси меня", "интервью", "расспроси меня". Official install via `claude marketplace add https://github.com/Jekudy/grillme-skill.git` then `claude plugin install "grillme@grillme-marketplace"` — but a plain `git clone` into the skills dir (what we did) also works for direct skill invocation.
- **Install status:** Installed.

## 7. gstack (garrytan)

- **GitHub URL:** https://github.com/garrytan/gstack
- **Install path:** `/Users/johnnysheng/code/hackathon/.worktrees/caltech-ideation-window-2/.claude/skills/gstack/`
- **License:** MIT (Copyright 2026 Garry Tan, `LICENSE` present)
- **Manifest:** Sprawling repo with 23+ skills as top-level subdirectories, each with `SKILL.md` (most have a `SKILL.md.tmpl` they generate from). The two skills the user asked for both exist: `office-hours/SKILL.md` and `plan-ceo-review/SKILL.md`. The README's intended install is `git clone ... ~/.claude/skills/gstack && cd ~/.claude/skills/gstack && ./setup` — we did the clone but NOT the setup (per the user's "don't run anything" instruction). The setup script builds Bun binaries (`browse`, `design`) and creates symlinks; without it, the slash commands may not be wired. The skill `SKILL.md` files themselves are still readable and the underlying behavior is invokable via the Skill tool.
- **Summary:** Garry Tan's (YC president) personal "virtual engineering team" — 23 skills + 8 power tools turning Claude Code into a multi-role org. `/office-hours` is the closest open-source proxy for a real YC office hour: a two-mode skill (Startup mode runs 6 forcing questions about demand reality, status quo, desperate specificity, narrowest wedge, observation, future-fit; Builder mode does design-thinking brainstorming for side projects/hackathons/learning). `/plan-ceo-review` is a 4-mode plan reviewer (SCOPE EXPANSION / SELECTIVE EXPANSION / HOLD SCOPE / SCOPE REDUCTION) that pushes for the "10-star product" and challenges premises.
- **Entry point:** `/office-hours`, `/plan-ceo-review`, plus `/plan-eng-review`, `/plan-design-review`, `/design-consultation`, `/design-shotgun`, `/design-html`, `/review`, `/ship`, `/land-and-deploy`, `/canary`, `/benchmark`, `/browse`, `/qa`, `/qa-only`, `/design-review`, `/setup-browser-cookies`, `/setup-deploy`, `/setup-gbrain`, `/retro`, `/investigate`, `/document-release`, `/codex`, `/cso`, `/autoplan`, `/plan-devex-review`, `/devex-review`, `/careful`, `/freeze`, `/guard`, `/unfreeze`, `/gstack-upgrade`, `/learn`. **WARNING:** Full slash-command wiring requires running `./setup` from inside `gstack/`, which the user told us not to do. Skills are still loadable via the Skill tool against the SKILL.md files.
- **Install status:** Installed (cloned only — setup script NOT run, per user instruction; some slash commands may not be registered globally until then).

## 8. startup-skill (ferdinandobons)

- **GitHub URL:** https://github.com/ferdinandobons/startup-skill
- **Install path:** `/Users/johnnysheng/code/hackathon/.worktrees/caltech-ideation-window-2/.claude/skills/startup-skill/`
- **License:** MIT (Copyright 2026 Ferdinando Bons, `LICENSE` present)
- **Manifest:** `.claude-plugin/marketplace.json` declares the `startup` plugin. Four sub-skills as sibling directories: `startup-design/`, `startup-competitors/`, `startup-positioning/`, `startup-pitch/`, each with a `SKILL.md` and a `references/` folder of progressively-loaded deep content.
- **Summary:** Strategy-consultancy-grade startup analysis. `startup-positioning` implements April Dunford's 5+1 component framework (competitive alternatives, unique attributes, value, target market, market category, trends) with a 2-wave parallel-agent research process. `startup-pitch` produces multi-length pitch artifacts: 10-min full, 5-min, 2-min verbal, 1-min elevator (formal + casual), investor cold email, Q&A appendix, scoring rubric. Includes investor roleplay practice. `startup-design` is the full 8-phase end-to-end strategy run; `startup-competitors` mines competitive battle cards.
- **Entry point:** `/startup:startup-design`, `/startup:startup-competitors`, `/startup:startup-positioning`, `/startup:startup-pitch`. Also auto-triggers on natural-language descriptions ("I want to build a SaaS for...", "How should we position...", "Prepare my pitch — I'm raising..."). Official marketplace install: `claude plugin marketplace add ferdinandobons/startup-skill && claude plugin install startup@startup-skill`. Direct git-clone install (what we did) means slash-command namespace `startup:` may not be registered without going through the marketplace install path; skills are still invokable via the Skill tool against the SKILL.md files.
- **Install status:** Installed.

---

## How to Invoke — Cheatsheet

All 8 skills can be invoked at least three ways:

1. **Skill tool / natural-language trigger** — say one of the skill's trigger
   phrases in a Claude Code session. Claude's harness scans the
   `.claude/skills/` tree for matching `SKILL.md` descriptions and loads
   the body. This works for all 8 immediately, no further setup needed.
2. **Slash command** — only works if the skill is registered as a command.
   For most of these that requires either the official marketplace install
   path (gstack, startup-skill, deep-research-plugin, grillme-skill) or
   manually copying SKILL.md to `~/.claude/commands/`.
3. **Direct Skill tool call** — `Skill { skill: "<name>" }` from inside
   another agent.

| Skill | Primary trigger | Slash command | Notes |
|---|---|---|---|
| claude-deep-research-skill | "deep research on X" / "ultradeep mode" | none defined | Auto-loads on phrases. Optional `search-cli` brew install for multi-provider search. |
| claude-research-skill | "/research <question>" | `/research` if SKILL.md is copied to `~/.claude/commands/research.md` | Per README, intended install is to commands dir, not skills dir. Currently in skills dir, so triggers as a skill on the keyword `research`. |
| deep-research-plugin | `/deep-research:run <topic>` | `/deep-research:init`, `/deep-research:run`, `/deep-research:status`, `/deep-research:report` | Full plugin with hooks. Needs Claude Code v2.1.32+, Python 3.10+, optionally `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`. |
| claude-scientific-skills | natural-language per subskill (e.g. "look up the literature on X" -> research-lookup) | none — flat library | 134 individual skills; some (research-lookup, open-notebook) need API keys. |
| claude-skills (the-fool) | "play the fool", "devil's advocate", "red team", "pre-mortem", "stress test", "poke holes" | via `/plugin install fullstack-dev-skills@jeffallan` (66-skill bundle) | the-fool is one of 66 skills in this repo; the others auto-trigger on their own keywords. |
| grillme-skill | "/grillme" / "grill me" / "grillme" / Russian variants | `/grillme` after `claude plugin install grillme@grillme-marketplace`; or via Skill tool directly | Bilingual (Russian/English) trigger set. |
| gstack | "/office-hours" / "/plan-ceo-review" / etc. | 23+ slash commands (see entry #7) — but require running `./setup` inside `gstack/` first | Setup not run per user instruction. SKILL.md bodies are still readable and can be invoked via Skill tool against the file paths directly. |
| startup-skill | natural-language ("How should we position...", "Prepare my pitch") | `/startup:startup-design`, `/startup:startup-competitors`, `/startup:startup-positioning`, `/startup:startup-pitch` after marketplace install | Direct clone (current state) means namespace `startup:` may not be registered as a slash command. |

---

## Honest caveats

- **claude-deep-research-skill ships no LICENSE file** despite README claiming MIT. Low risk (README is unambiguous) but worth noting for compliance-conscious users.
- **claude-research-skill** is structurally a slash-command body, not a skill manifest. README-recommended install is `~/.claude/commands/research.md`. In the current location it triggers on the literal keyword `research` rather than registering as `/research`.
- **claude-scientific-skills does NOT contain literal `pubmed`, `openalex`, or `semantic-scholar` subskills.** It contains `research-lookup` (multi-backend academic search router via parallel-cli + Parallel Chat API + Perplexity sonar-pro-search) and `open-notebook` (self-hosted NotebookLM). The user's framing was directionally right but specifically wrong on subskill names.
- **gstack `./setup` was NOT run** per the user's "don't run anything" rule. Slash commands like `/office-hours` and `/plan-ceo-review` may not be registered globally; SKILL.md bodies are accessible via direct Skill tool invocation against file paths.
- **startup-skill** marketplace registration also not run; slash-command namespace `startup:` may not work without it. SKILL.md files remain directly invokable.
- **deep-research-plugin** quality-gate hooks call `python3 ${CLAUDE_PLUGIN_ROOT}/scripts/dr_audit.py`. This script exists in the cloned tree but the hook system only fires when the plugin is properly registered with Claude Code (typically via `claude --plugin-dir`).

All 8 are real Claude Code skills/plugins with valid manifests. None failed.
