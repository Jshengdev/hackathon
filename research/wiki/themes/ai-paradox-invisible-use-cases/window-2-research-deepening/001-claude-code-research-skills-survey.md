# Claude Code Skills & Plugins Survey for Deep Research on a Societal-Issue Theme

**Date:** 2026-04-24
**Author:** Research agent (Window 2)
**Scope:** What to install on top of `Imbad0202/academic-research-skills`, BMAD `bmad-advanced-elicitation` + `bmad-party-mode`, Anthropic's `superpowers` plugin, and the `yc-sv-development-framework` skill so the team can run a serious deep-research workflow on a societal-issue theme during a hackathon. This is a research workflow report, not an idea-generator. Goal: cross-source synthesis, hypothesis stress-testing, and a YC-grade pitch-validation pipeline.

---

## 1. Skills / plugins worth installing

The ecosystem moved fast in 2025–2026; treat this list as opinionated, not exhaustive. Each entry below is a discrete, installable skill or plugin. Where a tool overlaps with something already in scope, the "why it complements" line spells out the marginal value.

### A. Deep-research orchestrators (the core of the stack)

**1. `199-biotechnologies/claude-deep-research-skill`** — 8-phase pipeline (Scope → Plan → Retrieve → Triangulate → Outline Refinement → Synthesize → Critique → Refine → Package) with a `source_evaluator.py` credibility scorer and parallel retrieval of 5–10 concurrent searches. Outputs Markdown + HTML (McKinsey-style) + PDF (WeasyPrint). License: MIT. Install: `git clone https://github.com/199-biotechnologies/claude-deep-research-skill.git ~/.claude/skills/deep-research`. ([repo](https://github.com/199-biotechnologies/claude-deep-research-skill))
*Why it complements:* `academic-research-skills` is publication-shaped (PRISMA, 13-agent academic team, peer-review framing); this one is consultancy-shaped (credibility scoring on web sources, McKinsey-style HTML). Use it when sources are gray-literature, news, NGO reports, or government data — i.e., the dominant evidence type for a societal-issue theme.

**2. `altmbr/claude-research-skill`** — A minimal `/research [question]` slash command that decomposes the question into 2–4 angles, requires user approval, launches parallel sub-agents, monitors them with escalating intervals, kills + relaunches stuck agents with their gathered data preserved, and produces a synthesis with cross-cutting insights, contradictions, and confidence assessments. License: MIT. Install: `cp claude-research-skill/SKILL.md ~/.claude/commands/research.md`. ([repo](https://github.com/altmbr/claude-research-skill))
*Why it complements:* It is the smallest, most surgical multi-agent research orchestrator on the market — useful when you don't want the heavyweight 13-agent academic team, just want to fan out on a sub-question and reconcile contradictions.

**3. `defiect/deep-research-plugin` (DEFIECT)** — Four-agent team (`dr-lead`, `dr-scout`, `dr-analyst`, `dr-writer`), enforces an *evidence graph*: every claim traces to a specific source excerpt; multi-source corroboration is required or claim is explicitly flagged as single-source. Quality gates are enforced by Claude Code hooks (`TaskCompleted`, `TeammateIdle`, `PreCompact`). Requires Claude Code v2.1.32+ and Python 3.10+. License: MIT. Install: `npx claudepluginhub defiect/deep-research-plugin`. ([listing](https://www.claudepluginhub.com/plugins/defiect-deep-research))
*Why it complements:* Strongest "no unsupported assertions" discipline of the three. If the team is going to publish a write-up, run a final pass through this for citation hygiene.

**4. `Weizhena/Deep-Research-skills`** — Two-phase workflow (outline → deep investigation), explicitly human-in-the-loop with `/research-add-items` and `/research-add-fields` commands so you can extend the outline mid-process. Inspired by the RhinoInsight research framework. License: MIT. Install: `git clone https://github.com/Weizhena/deep-research-skills.git` (then `pip install pyyaml`). ([repo](https://github.com/Weizhena/Deep-Research-skills))
*Why it complements:* This is the right tool for a hackathon where the question is going to mutate as you learn. Keeps a human in the loop at every stage rather than going off and burning tokens autonomously.

### B. Multi-agent debate / boardroom

**5. AI Boardroom skill (Steffi Kieffer)** — Eight-persona debate (Dario Amodei, Reid Hoffman, Alex Hormozi, Brené Brown, Paul Graham, Mel Robbins, Seth Godin, Dan Koe). Round 1: each agent forms a YES/NO/CONDITIONAL position independently in isolation. Round 2: each reads all seven other positions and may shift its vote. Outputs a Markdown vote tracker, an interactive HTML with assumption sliders, and a print PDF. Built as a custom skill — instructions are in the Substack post; the skill folder pattern is the standard `~/.claude/skills/<name>/SKILL.md`. Requires Claude Max for the 16 parallel sessions. License: not formally stated, but the build is shared as a tutorial under the author's blog. ([writeup](https://steffikieffer.substack.com/p/how-to-build-an-ai-boardroom-in-claude))
*Why it complements:* This is your Paul-Graham-/-Sam-Altman-style persona critique (PG persona is explicitly in the lineup, Reid Hoffman covers the network/scale lens, Hormozi covers the "would anyone pay for this" lens). BMAD `party-mode` is a roundtable; Boardroom is an opinionated, founder-flavored roundtable with explicit persona files. Run *both* and triangulate.

**6. `nyldn/claude-octopus`** — Cross-model debate runner. Puts up to 8 models (Claude, Codex, Gemini, Perplexity, OpenRouter, Copilot, Qwen, Ollama) on the same task, with a 75% consensus gate and an explicit `/octo:debate` command for "four-way AI debate with consensus." License: MIT. Install: `claude plugin marketplace add https://github.com/nyldn/claude-octopus.git && claude plugin install octo@nyldn-plugins`, then `/octo:setup`. ([repo](https://github.com/nyldn/claude-octopus))
*Why it complements:* `academic-research-skills` already has cross-model verification for citations via Semantic Scholar; Octopus generalises that idea to *reasoning*. If two of four models disagree on the framing of the societal issue, that's signal.

**7. `wshobson/agents`** — 184 specialised sub-agents with an `Agent Teams` plugin and a `hypothesis-driven-debugging` team preset that's explicitly about testing competing theories. License: MIT. Install: `/plugin marketplace add wshobson/agents` then `/plugin install agent-teams@claude-code-workflows`. ([repo](https://github.com/wshobson/agents))
*Why it complements:* Industrial-grade roster; useful as a parts bin for spinning up niche reviewers (security-auditor, architect-review, etc.) when the topic touches a specific domain.

### C. Socratic / hypothesis stress-testing

**8. `Jekudy/grillme-skill`** — Three-wave structured questioning (Wave 1: goals/context/constraints, Wave 2: edge cases/conflicts/dependencies, Wave 3+: contradictions/implicit assumptions/blind spots), with explicit "strategic, systemic, psychological, devil's advocate" lenses and an internal facts/assumptions/risks ledger. License: MIT. Install: `claude marketplace add https://github.com/Jekudy/grillme-skill.git && claude plugin install "grillme@grillme-marketplace"`. ([repo](https://github.com/Jekudy/grillme-skill))
*Why it complements:* BMAD `bmad-advanced-elicitation` includes Socratic and pre-mortem; Grillme is a more aggressive single-purpose interrogator and produces a structured assumption ledger you can carry into the next workflow stage.

**9. `Jeffallan/claude-skills` — "The Fool" skill** — Five-mode reasoning skill (Socratic Questioning, Dialectic Synthesis, Pre-Mortem, Red Team Adversarial, Evidence Audit) inside a 5-step workflow that *steelmans* the user's position before challenging it. License: MIT. Triggers on phrases like "stress test," "poke holes," "red team," "test assumptions." ([SKILL.md](https://github.com/Jeffallan/claude-skills/blob/main/skills/the-fool/SKILL.md))
*Why it complements:* BMAD's elicitation is good but generic. The Fool is the cleanest mode-switcher I found — five distinct attack modes in one skill, plus the steelman-first discipline that prevents the agent from straw-manning the team's hypothesis.

**10. `RoundTable02/socrates-skill`** — Pure Socratic tutor; "the agent never gives a direct answer — even if you ask for one." Five question types: clarifying, probing, connecting, counter, hypothetical. License: MIT. Install: `npx skills add RoundTable02/socrates-skill`. ([repo](https://github.com/RoundTable02/socrates-skill))
*Why it complements:* For solo work where you want to *think out loud* on a societal issue without the agent collapsing the question.

### D. Source-synthesis, fact-checking, citation graphs

**11. `K-Dense-AI/claude-scientific-skills`** — A bundle including Paper Lookup (PubMed, bioRxiv, arXiv, Semantic Scholar, OpenAlex), BGPT Paper Search (extracts methods, sample sizes, quality scores from full texts), Parallel Web (synthesised summaries with citations), Literature Review, Citation Management, Open Notebook (PDFs/videos/audio with 16+ AI providers), Scientific Critical Thinking, Scholar Evaluation, Hypothesis Generation, What-If Oracle, Statistical Analysis. License: MIT (per-skill licenses may vary). Install: `npx skills add K-Dense-AI/scientific-agent-skills`. ([repo](https://github.com/K-Dense-AI/claude-scientific-skills))
*Why it complements:* `academic-research-skills` has PRISMA but doesn't ship a dedicated Semantic Scholar / OpenAlex search wrapper. K-Dense fills that and adds Open Notebook for ingesting heterogeneous source media (interviews, podcasts, government PDFs).

**12. `safishamsi/graphify`** — Turns folders of code, docs, papers, images, or videos into a queryable knowledge graph; extracts citations from PDFs and maps cross-document concept relationships. License: MIT. Install: `uv tool install graphifyy && graphify install` (or `pipx install graphifyy && graphify install`). ([repo](https://github.com/safishamsi/graphify))
*Why it complements:* The closest thing to a "citation graph builder" in the open ecosystem. Caveat: it's primarily code-oriented, with papers as a secondary use; it will *extract* citations and build conceptual edges, but it isn't a dedicated bibliographic tool. Still, it's the strongest open option.

**13. `lyndonkl/claude` — `research-claim-map` skill** — One skill in a 188-skill collection with 27 orchestrating agents. Verifies claims via triangulation, source grading, and confidence calibration. Companion skills include `discovery-interviews-surveys`, `design-of-experiments`, `domain-research-health-science` (PICOT + GRADE), and `ethics-safety-impact` (stakeholder harm + fairness). License: open-source per the README; per-skill attributions vary. Install: `/plugin marketplace add lyndonkl/claude && /plugin install thinking-frameworks-skills`. ([repo](https://github.com/lyndonkl/claude))
*Why it complements:* `research-claim-map` is the exact "fact-checker" primitive missing from the existing stack; `ethics-safety-impact` is directly on-theme for societal issues.

**14. Verify-Content skill (mcpmarket listing, source TBD)** — Audits documents for accuracy: scans factual statements + numerical claims, validates against current data via web search, direct URL fetch, and the **Wayback Machine**, organises references into footnotes or inline citations. ([listing](https://mcpmarket.com/tools/skills/content-verification-fact-checker))
*Why it complements:* Wayback integration is rare and load-bearing for societal research where pages get edited or memory-holed. Treat as a secondary pass over a finished draft.

### E. Persona / pitch-deck / startup validation

**15. `ferdinandobons/startup-skill`** — Four skills: `startup-design` (8-phase strategy, 30+ deliverables), `startup-competitors` (battle cards, pricing comparison, feature matrices from real reviews), `startup-positioning` (April Dunford's framework), `startup-pitch` (10/5/2/1-min pitch versions + email + Q&A prep + scoring rubric + investor roleplay). License: MIT. Install: `npx skills add ferdinandobons/startup-skill`. Token-heavy; Claude Max 5x recommended. ([repo](https://github.com/ferdinandobons/startup-skill))
*Why it complements:* `yc-sv-development-framework` is a *decision* framework; this is the *deliverables* pipeline. They compose well — yc-sv decides "what to build / which slide angle wins"; startup-skill produces the actual artifact.

**16. `garrytan/gstack`** — Garry Tan's actual personal Claude Code setup: 23 commands including `/office-hours` (six forcing questions), `/plan-ceo-review` (4-mode founder strategic challenge), `/plan-eng-review`, `/plan-design-review`, `/plan-devex-review`, `/codex` (cross-model second opinion), and `/retro`. License: MIT. Install: `git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack && cd ~/.claude/skills/gstack && ./setup`. ([repo](https://github.com/garrytan/gstack))
*Why it complements:* `/office-hours` and `/plan-ceo-review` are the closest open-source approximations of a real YC partner reframing your problem. This is your Sam-Altman-style critique surface; Boardroom (#5) handles the Paul-Graham-style.

**17. `coreyhaines31/marketingskills`** — Includes `competitor-profiling` (analyse competitors from URLs), `competitor-alternatives` (comparison/alternative pages), `customer-research` (synthesise customer research), `marketing-psychology` (behavioural science / mental models), `marketing-ideas` (140 SaaS strategies), `launch-strategy`. License: MIT. Install: `npx skills add coreyhaines31/marketingskills`. ([repo](https://github.com/coreyhaines31/marketingskills))
*Why it complements:* Adds a competitive-landscape mapper and a customer-research primitive. Marketing-flavored, but the competitor-profiling skill is a clean URL-in / battle-card-out workflow.

### F. Optional / situational

**18. `affaan-m/everything-claude-code`** — Includes `deep-research`, `search-first`, `exa-search` (neural search via Exa MCP), `market-research` with source attribution, `documentation-lookup` (Context7 MCP), and `eval-harness`. License: MIT. Install: `/plugin marketplace add https://github.com/affaan-m/everything-claude-code && /plugin install everything-claude-code@everything-claude-code`. ([repo](https://github.com/affaan-m/everything-claude-code))
*Why it complements:* The Exa MCP is a meaningful upgrade over default web search for niche / academic queries. Worth installing for `exa-search` alone.

**19. `asklokesh/claudeskill-loki-mode`** — 41 specialised agents in 8 swarms, with 9 automated quality gates (anti-sycophancy, mock detection, etc.). License: BUSL-1.1 (free for personal/internal/academic/non-commercial; converts to Apache-2.0 in 2030). Install: `npm install -g loki-mode && loki doctor && loki start prd.md`. ([repo](https://github.com/asklokesh/claudeskill-loki-mode))
*Why it complements:* Heavyweight. Useful only if you're going to ship a working prototype alongside the research; otherwise overkill. License is *not* MIT — read it before commercial use.

---

## 2. Sources to scrape (high-signal places to monitor)

The ecosystem is churning weekly. Bookmark these:

1. **`anthropics/claude-plugins-official`** — Anthropic's curated directory; "Anthropic Verified" badge denotes plugins that passed an extra quality/safety review. Discoverable in-app via `/plugin > Discover`. ([repo](https://github.com/anthropics/claude-plugins-official))
2. **`anthropics/skills`** — Official source-available skills (PDF, DOCX, XLSX, PPTX, plus the spec and template folders). 124k stars; the spec/template are the canonical references for writing your own skill. ([repo](https://github.com/anthropics/skills))
3. **`hesreallyhim/awesome-claude-code`** — The most maintained "awesome" list for Claude Code; surfaces niche skills (Trail of Bits, K-Dense-AI, agentic workflow patterns). ([repo](https://github.com/hesreallyhim/awesome-claude-code))
4. **`travisvn/awesome-claude-skills`** and `ComposioHQ/awesome-claude-skills`** — Two competing curated lists; together they cover ~95% of new releases. Composio also runs `awesome-claude-plugins`. ([travisvn](https://github.com/travisvn/awesome-claude-skills), [composio-skills](https://github.com/ComposioHQ/awesome-claude-skills), [composio-plugins](https://github.com/ComposioHQ/awesome-claude-plugins))
5. **Anthropic Plugin Directory at `claude.com/plugins`** — Official web catalog. Use it to verify install commands and check whether something has the Verified badge before relying on it. ([directory](https://claude.com/plugins))
6. **`vercel-labs/skills` (the `npx skills` tool)** — The de facto package manager for agent skills as of 2026; install with `npx skills add <owner>/<repo>`, and `skills-lock.json` makes installs reproducible across the team. Worth standardising on. ([repo](https://github.com/vercel-labs/skills))

Honourable mentions for breadth (less curated, more noise): `rohitg00/awesome-claude-code-toolkit`, `alirezarezvani/claude-skills` (232+ skills), and `awesome-skills.com` (~150 skills with a UI).

---

## 3. Recommended combinations for our specific workflow

Three opinionated stacks. Pick one as your spine and borrow from the others.

### Stack A: "Deep-research stack" — cross-source synthesis on a societal-issue theme

Order matters. Each step's output is the next step's input.

1. **`bmad-advanced-elicitation` (Socratic mode)** — *Frame the question.* Before any agent goes off and burns tokens on web search, force the team to articulate what they're actually trying to learn and *why*. 30 minutes, no skipping.
2. **`Weizhena/Deep-Research-skills`** — *Build the outline, get team approval.* Use the human-in-the-loop two-phase model so the outline is shaped by humans before the parallel investigation kicks off.
3. **`altmbr/claude-research-skill` `/research`** — *Fan out.* Decompose into 2–4 angles (e.g., "incumbents," "academic literature," "policy/government data," "lived-experience accounts"), launch parallel agents, let it monitor + recover stuck ones, get back a synthesis with explicit contradictions.
4. **`K-Dense-AI/claude-scientific-skills`** (`paper-lookup`, `parallel-web`, `citation-management`) — *Anchor in primary sources.* Use these to convert the synthesis's web-flavored citations into proper academic ones (PubMed, OpenAlex, Semantic Scholar). This is where you turn a Reddit-and-NGO-flavored draft into something defensible.
5. **`defiect/deep-research-plugin`** — *Final pass for evidence-graph discipline.* Run the draft through DEFIECT so every claim is traced to a source excerpt and single-source claims are explicitly flagged.
6. **`academic-research-skills`** Review → Revise → Finalize phases — *Polish.* Use what's already installed for PRISMA-shaped peer review and the cross-model verification step.

Output: a research dossier with a citation graph, explicit confidence ratings on each claim, and a list of contradictions worth interviewing humans about.

### Stack B: "Socratic-stress-test stack" — sharpen a hypothesis without proposing answers

For when the team has a thesis and wants to know what's wrong with it *before* investing more time.

1. **`Jeffallan/claude-skills` — "The Fool" (Steelman + Mode Select)** — *Strengthen the position first.* The skill restates your thesis in its strongest form, then asks you to pick a challenge mode. This prevents straw-manning your own idea.
2. **`Jekudy/grillme-skill`** — *Three waves of questioning.* Goals/context → edge cases/conflicts → contradictions/blind spots, with the explicit assumptions ledger output. Carry the ledger forward.
3. **AI Boardroom (Steffi Kieffer build)** — *Eight-persona debate with vote shifts.* Round 1 in isolation, Round 2 with cross-reading. The vote tracker tells you which advisors changed their mind and why; that delta is the load-bearing artifact.
4. **`bmad-party-mode`** — *Cross-pollinate with BMAD agents.* Same idea, different persona library. Run a separate party-mode session and compare which concerns show up in *both* (durable) vs. only one (model-specific).
5. **`nyldn/claude-octopus` `/octo:debate`** *(optional, requires extra model API keys)* — *Cross-model sanity check.* If Claude, Gemini, and a local model all converge on the same critique, that's high-confidence signal.

Output: a ranked list of the strongest objections to your thesis, an updated thesis, and a list of empirical questions you'd need to answer to dissolve each objection.

### Stack C: "Pitch-deck-validation stack" — translate a hypothesis into a YC-ready pitch

For when the research is mostly done and the team needs to package it.

1. **`yc-sv-development-framework` (already installed)** — *Decide the angle.* What's the P0 narrative? What's deferred?
2. **`garrytan/gstack` — `/office-hours` then `/plan-ceo-review`** — *Reframe the problem.* Six forcing questions, then a 4-mode strategic challenge (Expansion / Selective Expansion / Hold Scope / Reduction). This is the closest open-source proxy for a real YC office hour. ([repo](https://github.com/garrytan/gstack))
3. **`coreyhaines31/marketingskills` — `competitor-profiling` + `customer-research`** — *Map the landscape.* Battle cards, comparison matrices, and a customer-research synthesis. Quick to run, MIT-licensed.
4. **`ferdinandobons/startup-skill` — `startup-positioning` then `startup-pitch`** — *Produce the artifact.* April Dunford positioning doc, then 10/5/2/1-minute pitch versions + scoring rubric + investor roleplay. ([repo](https://github.com/ferdinandobons/startup-skill))
5. **AI Boardroom (PG / Hormozi / Hoffman personas)** — *Final critique.* Run the finished pitch through Boardroom with the question "Would you invest?" The vote tracker + sliders give you a defensible "yes/no/conditional" with reasoning per persona. Hormozi will pressure-test pricing; PG will hunt for intellectual dishonesty; Hoffman will ask about scale.

Output: a 10-minute pitch deck, a 1-minute elevator, an FAQ, and a defensible founder-grade critique of your own pitch.

---

## 4. Risk flags

Honest take, not marketing copy.

- **Supply-chain risk is real and recent.** In late March 2026, Anthropic accidentally shipped a 59.8 MB source map in `@anthropic-ai/claude-code` v2.1.88 on npm. Attackers immediately spun up fake repos distributing Vidar, GhostSocks, and PureLog Stealer; concurrently a malicious `axios` 1.14.1 / 0.30.4 carrying a RAT was published in the same window. ([Trend Micro](https://www.trendmicro.com/en_us/research/26/d/claude-code-remains-a-lure-what-defenders-should-do.html), [eSecurity Planet](https://www.esecurityplanet.com/artificial-intelligence/claude-code-leak-exposes-ai-supply-chain-threats/)) **Implication:** prefer plugins/skills with the "Anthropic Verified" badge in the official directory, pin versions, read the SKILL.md before installing, and don't blindly run `npx skills add` against unfamiliar repos.
- **"Outperforms OpenAI/Gemini Deep Research" claims are unbenchmarked.** `199-biotechnologies/claude-deep-research-skill` advertises this; there's no published methodology. Treat the claim as marketing; the *pipeline* is still good.
- **Token cost.** `ferdinandobons/startup-skill` explicitly flags Claude Max 5x as recommended; AI Boardroom uses 16 parallel sessions and only fully runs on Max. For a hackathon weekend on a Pro plan, plan to either downgrade (Boardroom can run 2 advisors instead of 8) or budget $$$.
- **Loki Mode license is not MIT.** `asklokesh/claudeskill-loki-mode` ships under BUSL-1.1. Free for personal/internal/academic/non-commercial; commercial use requires reading the license carefully or waiting until the 2030 Apache-2.0 conversion. ([repo](https://github.com/asklokesh/claudeskill-loki-mode))
- **`yc-pitch-deck` distribution is unclear.** Listed on `skills.rest` but the underlying GitHub repo (`guia-matthieu/clawfu-skills`) is hard to verify. Prefer `ferdinandobons/startup-skill` (clear repo, clear license, clear maintainer) until that one's provenance is sorted.
- **`safishamsi/graphify` is code-first, not citation-first.** It will build conceptual edges from PDFs but it is not a dedicated bibliographic graph tool. Don't expect Connected Papers / Inciteful behavior.
- **Most "mcpmarket.com" listings are aggregator pages, not source repos.** Always click through to find the canonical GitHub repo and license before installing. Some of the skills surfaced through that aggregator (e.g., the Verify-Content / fact-checker entry) don't expose a clear maintainer.
- **`alirezarezvani/claude-skills` and `rohitg00/awesome-claude-code-toolkit` are huge but uneven.** The 232+ / 135-agent counts are real but quality varies wildly; treat as a parts bin, not a curated list. For curation, use `hesreallyhim/awesome-claude-code` first.
- **`plinde/claude-plugins` does not actually publish a `socratic-debate` plugin** despite the directory existing in the repo tree. Use `Jeffallan/claude-skills` "The Fool" instead — same idea, actually shipped.
- **Beware over-reliance on persona skills.** Boardroom and party-mode produce convincing-sounding persona output, but it is a 40-line prompt, not Paul Graham. Use as ideation/critique input; don't quote it as authoritative.

---

**Bottom line for the hackathon:** install Stack A as your default, layer Stack B in whenever the team feels overcommitted to a hypothesis, and reach for Stack C only after research is mostly done. The marginal-value installs over what's already there are: `199-biotechnologies/claude-deep-research-skill`, `altmbr/claude-research-skill`, AI Boardroom (built per Kieffer's tutorial), `Jeffallan/claude-skills` "The Fool," `K-Dense-AI/claude-scientific-skills`, and `garrytan/gstack`.

---

**Sources (all citations above are linked inline; canonical list below)**

- [199-biotechnologies/claude-deep-research-skill](https://github.com/199-biotechnologies/claude-deep-research-skill)
- [altmbr/claude-research-skill](https://github.com/altmbr/claude-research-skill)
- [defiect deep-research-plugin (Claude Plugin Hub)](https://www.claudepluginhub.com/plugins/defiect-deep-research)
- [Weizhena/Deep-Research-skills](https://github.com/Weizhena/Deep-Research-skills)
- [How to build an AI boardroom in Claude Code (Kieffer)](https://steffikieffer.substack.com/p/how-to-build-an-ai-boardroom-in-claude)
- [nyldn/claude-octopus](https://github.com/nyldn/claude-octopus)
- [wshobson/agents](https://github.com/wshobson/agents)
- [Jekudy/grillme-skill](https://github.com/Jekudy/grillme-skill)
- [Jeffallan/claude-skills — The Fool](https://github.com/Jeffallan/claude-skills/blob/main/skills/the-fool/SKILL.md)
- [RoundTable02/socrates-skill](https://github.com/RoundTable02/socrates-skill)
- [malkreide/socratic-method-skill](https://github.com/malkreide/socratic-method-skill)
- [K-Dense-AI/claude-scientific-skills](https://github.com/K-Dense-AI/claude-scientific-skills)
- [safishamsi/graphify](https://github.com/safishamsi/graphify)
- [lyndonkl/claude (research-claim-map etc.)](https://github.com/lyndonkl/claude)
- [Verify-Content listing (mcpmarket)](https://mcpmarket.com/tools/skills/content-verification-fact-checker)
- [ferdinandobons/startup-skill](https://github.com/ferdinandobons/startup-skill)
- [garrytan/gstack](https://github.com/garrytan/gstack)
- [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills)
- [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
- [asklokesh/claudeskill-loki-mode](https://github.com/asklokesh/claudeskill-loki-mode)
- [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official)
- [anthropics/skills](https://github.com/anthropics/skills)
- [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code)
- [travisvn/awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills)
- [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills)
- [ComposioHQ/awesome-claude-plugins](https://github.com/ComposioHQ/awesome-claude-plugins)
- [vercel-labs/skills (npx skills)](https://github.com/vercel-labs/skills)
- [Anthropic Plugin Directory](https://claude.com/plugins)
- [Imbad0202/academic-research-skills (already installed)](https://github.com/Imbad0202/academic-research-skills)
- [Trend Micro: Claude Code packaging error lure](https://www.trendmicro.com/en_us/research/26/d/claude-code-remains-a-lure-what-defenders-should-do.html)
- [eSecurity Planet: Claude Code leak supply chain threats](https://www.esecurityplanet.com/artificial-intelligence/claude-code-leak-exposes-ai-supply-chain-threats/)
