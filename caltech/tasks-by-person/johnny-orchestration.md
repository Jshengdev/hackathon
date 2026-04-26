---
file-type: tasks-by-person
status: scaffold (extracted from PRFAQ canvas yap 2026-04-25; not yet a locked PRD slice)
last-verified: 2026-04-25
locked-by: Johnny verbatim PRFAQ canvas yap
cross-links:
  - ../yaps/2026-04-25-prfaq-canvas/01-high-signal-extracts.md
  - ../../research/wiki/decisions/003-team-role-lanes-locked.md
  - ../../research/wiki/decisions/011-demo-over-execution.md
  - ../context/team/johnny.md
---

# Johnny — Orchestration + visualization + 3-parallel-Claude slice

> **Source:** Johnny's verbatim PRFAQ canvas yap, 2026-04-25. Scaffolding only.
>
> Per Decision 003: Johnny = hard innovation. Per the user's standing instruction, Johnny's slice is the one that further fans out into 3 parallel Claude instances under his management.

## What Johnny named will be in your slice

The yap names three load-bearing pieces under your direct ownership:

### 1. The visualization — 3D brain + 3D knowledge graph (two layers, not one)

Johnny verbatim: *"It wouldn't be on with the brain itself but like the content — that this is a brain in the 3d space right, and then there's like a knowledge graph in 3d space that maps to where the brain is located."*

- **Layer A:** the brain in 3D space (cortical surface mesh — likely fsaverage5 since TRIBE outputs to that)
- **Layer B:** the knowledge graph in 3D space, *spatially mapped* to brain regions
- **Interaction:** click a region → see the specialist's reasoning tree for that region. *"The skill tree of what this section was thinking about and that section was thinking about."*
- **Anti-pattern caught:** Johnny explicitly cut "visualizing on the brain itself" — don't paint reasoning onto cortex; render the graph as a separate spatial layer anchored to it.

### 2. The orchestration layer (you direct, three sibling Claudes execute)

The "3 parallel Claude instances" pattern lives here. Per the multi-Claude orchestration scout: tmux is installed; worktree pattern is proven. Recommended shape:

- **This pane** (orchestration parent) coordinates + holds the soft-lock state
- **Three sibling worktrees** in `.worktrees/`, each with its own `.claude/`:
  - `.worktrees/johnny-vis-brain` — 3D brain layer Claude
  - `.worktrees/johnny-vis-graph` — 3D knowledge-graph layer + interaction Claude
  - `.worktrees/johnny-orchestration-glue` — TRIBE→swarm→viz pipeline glue Claude
- Each sibling has the SAME context (PRFAQ, decisions, mock contracts) but DIFFERENT execution scope. They check in at orchestration sync points.

**Decision 013 honoring:** the PRD itself is built in a different Claude instance. This orchestration pane is the *facilitation* pane — PRFAQ + locks + mega-prompt. The three siblings are *execution* panes.

### 3. The architecture defenses (FAQ-section ammunition)

Open questions Johnny owns answers for, because they're architecture-level:

- **Renaissance Research differentiation.** Their N=3 vs. our N (per brain region). Is the difference visible in the first 10 seconds? You answer with a staging choice.
- **T2 — the Auditor's external referent.** TRIBE predicts corpus-mean response. If recommender feeds shaped that distribution, the auditor inherits the bias. **Sentence-level answer needed before pitch.** This is the hardest question in the FAQ.
- **The compare-move scope.** *"Feed it new content, compare the thoughts you had vs. the thoughts you have now"* — IN-demo or V2-only? You decide.
- **Reverse-inference defense.** When a judge asks "are you saying the brain felt X?" — Johnny's answer must be sharp: *no, the specialists infer; TRIBE outputs activation patterns; reverse inference is forbidden.*

## High-signal extracts from the yap (your context)

- *"give it a prompt of a great specialist for that part of the brain"* — your spec for Jacob's per-region prompts
- *"reconstructing how a thought travels across your brain"* — the headline metaphor (provisional)
- *"return human autonomy with the ability to see your thoughts"* — the transformation (provisional)
- *"win every single sponsor track... change the last one or two slides"* — your strategic framing for the pitch deck shape

## Open questions for you to bring back

- **Q-J1.** Lock the headline-level transformation sentence. Press release needs a one-line "what the customer experiences." Johnny names.
- **Q-J2.** Lock or defer the compare-move (SL-4). It changes the demo arc.
- **Q-J3.** Lock the visualization stack: Three.js? React-Three-Fiber? Plotly 3D? (Affects which sibling worktrees you spin up.)
- **Q-J4.** When does the PRFAQ green-light fire? Other lanes are blocked on it.

## What's NOT in your slice

- TRIBE pipeline implementation (Junsoo)
- K2 swarm orchestration (Jacob)
- Pitch deck + storytelling polish + sponsor closes (Emilie)
- Devpost / launch video (Emilie)

## Three-parallel-Claude command shape (when the time comes)

```bash
# from the main repo at /Users/johnnysheng/code/hackathon
git worktree add .worktrees/johnny-vis-brain
git worktree add .worktrees/johnny-vis-graph
git worktree add .worktrees/johnny-orchestration-glue

# in three tmux windows:
tmux new-window -n vis-brain       'cd .worktrees/johnny-vis-brain && claude'
tmux new-window -n vis-graph       'cd .worktrees/johnny-vis-graph && claude'
tmux new-window -n orch-glue       'cd .worktrees/johnny-orchestration-glue && claude'
```

Each sibling gets a focused mega-prompt drop with shared PRFAQ context + lane-specific scope. Sync to this orchestration pane at integration checkpoints.

## What you are NOT cleared to do until you finish locking the PRFAQ

You're the only one who CAN unblock the team. Until soft-locks SL-1 through SL-5 are firmed up and the Renaissance differentiation is named, every other lane is parked on prep-only work. Priority order:

1. Answer Q-J1 (headline transformation)
2. Decide Q-J2 (compare-move in or out)
3. Run a quick Phase 2 party-mode pass on the locked frame
4. Fire the mega-prompt → spawn the three siblings

## NEW — your published corpus is doing the heavy lifting (2026-04-25 sync)

Per the gap-filler analysis (`caltech/validation-findings/2026-04-25-team-gap-fillers.md`), your **already-public-dated work fills the heaviest pitch blockers** without writing anything new. Specifically:

### Headline phrase — already published
> *"Manipulation only works in the dark. What happens to the internet when the lights come on?"* (Reverse-TRIBE post)

This is the press-release headline candidate. Public-dated, in your voice, structurally non-overlapping with Renaissance, generationally framed.

### The Land card UI shape — already published
Your *"20 versions of tomorrow"* post: *"You wake up and instead of a to-do list you see a garden — each flower is a different version of the day you're about to step into."*

The inverted-brain-search Land card IS this garden, scoped to brain regions. **Port the UI metaphor; don't reinvent.**

### The credibility chip — already published
Synthetic Synesthesia (90.4% Clair de Lune emotion-center match across 20,484 cortical vertices, falsified against control stimuli, 8 iterative-loop rounds with Claude). This is the SHIPPED proof that the brain-encoding-as-grounding methodology works at fidelity. Use it in the pitch as the *founder demonstration* moment — not part of the demo, but part of the *credibility setup*.

### The "two directions of TRIBE" framing — already published
Forward = weaponize. Reverse = un-blackbox. The hackathon project is the reverse direction. FAQ ammunition for any judge who asks the dual-use question.

### The product-name candidate set — already in your vocabulary
*Lights On / Daylight / Ingredients / Mirror / Garden Mode / Untargeted / Brainline.* Pick from your own coinages; consistent with your brand.

### Anti-patterns locked from `johnny.md` are design constraints
*"No scores, no dashboards, no labels-during-process, no borrowed aesthetics, no prescription, no rewarding noise."* These are pre-existing rules you've published; the team designs against them, not against generic best-practice.

### The doctrine you locked tonight is your existing discipline
*"Pitch-vs-product"* / *"smallest possible circle"* — same shape. You've already published this discipline; this hackathon is operationalizing it.

## Your unfair advantages (Victor's audit)

Per the Victor party-mode audit, you have unfair advantages on:
1. **TRIBE methodology** (Synthetic Synesthesia + DMN floor/bounce experiments) — only ~30% showing up in PRFAQ. **Lift more.**
2. **K2-swarm-as-automation-of-your-iterative-loop** (your 8-round Clair de Lune scoring is what K2 automates) — ~60% showing up. **Lift more.**
3. **Garden / ideometry / shapes-over-frameworks** vocabulary — ~70% showing up. **Lift more.**
4. **Reverse-TRIBE / un-blackboxing thesis** — ~95% showing up. **Locked.**
5. **Smallest possible circle discipline** — ~75% showing up. Locked tonight.

The 25-30% you're leaving on the table is the methodology specificity — the iterative-loop Clair de Lune work proves the pipeline works *before the team writes any new code.* Use it in the pitch deck and the press release as primary-source evidence.
