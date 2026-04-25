# Hackathon Suite

**Chaos in, winning project out. Fast.**

Transform chaotic hackathon contexts into winning projects through structured workflows, embedded veteran wisdom, and dual-agent validation.

---

## Overview

The Hackathon Suite is a comprehensive BMAD module designed to guide teams from arrival at a hackathon venue to final submission and demo. It combines:

- **10 specialized workflows** for each phase (context → ideation → planning → build → synthesis)
- **2 validation agents** (Orchestrator for guidance, Judge for adversarial validation)
- **4 embedded frameworks** (Hackathon Sauce, Idea Iceberg, The Gap, Moonshot Prompts)
- **Field-tested strategies** from veteran hackathon winners

### Philosophy

Most teams fail at hackathons because they:
1. Start coding before understanding context
2. Build "cool" projects instead of "HOLY SHIT" projects
3. Miss track-stacking opportunities
4. Ignore what sponsors ACTUALLY want

**This suite fixes all of that.**

---

## Quick Start

### At The Hackathon

**Step 1: Arrive & Gather Context (90 min)**

Use the Field Guide to gather context:
- Opening ceremony insights
- Sponsor table conversations
- Team formation
- Yap mode brain dump

**Step 2: Run Context Collector (15 min)**
```bash
/bmad:hackathon-suite:context-collector
```

**Step 3: Generate Ideas (45 min)**
```bash
/bmad:hackathon-suite:idea-generator
```

**Step 4: Validate with Judge (10 min)**
```bash
/bmad:hackathon-suite:hackathon-judge
```

**Step 5: Build & Win**
Use remaining workflows for pitch deck, team planning, and synthesis.

**OR: Use the Orchestrator**
```bash
/bmad:hackathon-suite:hackathon-orchestrator
```
The Orchestrator will guide you through the entire process like an experienced teammate.

---

## Complete Workflow List

### Phase 1: Context & Ideation (Hours 0-2)

**1. context-collector** — Gather and organize ALL hackathon context
- 7 steps: Welcome → Tracks → Sponsors → Team → Constraints → Yaps → Consolidate
- Transforms chaotic notes into structured context.md
- Identifies track-stacking opportunities
- Extracts sponsor hidden priorities

**2. idea-generator** — Generate moonshot ideas with The Gap filter
- 6 steps: Moonshot → Track Mapping → Gap Filter → Skill Check → Selection → Document
- Produces 15-20 wild ideas
- Filters through "The Gap" ("cool" vs "HOLY SHIT")
- Outputs complete idea.md ready for building

### Phase 2: Planning (Hours 2-3)

**3. pitch-deck-gen** — Generate pitch deck from idea
- Creates presentation slides (Marp/Slidev/Markdown)
- Structured for "submit early, edit later"

**4. team-yap** — Facilitate team discussion
- Captures team brainstorming
- Extracts signal from chaos

**5. win-validator** — Validate idea against judging rubric
- Scores your idea (Impact, Innovation, Technical, Presentation, Track Fit)
- Predicts placement
- Suggests improvements

**6. prd-splitter** — Split idea into parallel development branches
- Creates branch documents for parallel work
- Clear integration points
- Individual demo cases per branch

### Phase 3: Build & Synthesis (Hours 3-8)

**7. close-session** — Persist state when taking breaks
- 5 steps: Capture, Archive, Persist state
- Maintains momentum across context windows

**8. sync-session** — Restore context when resuming
- 3 steps: Load, Analyze, Present briefing
- Gets you back up to speed in 30 seconds

**9. adapter** — Adapt idea when pivoting mid-hackathon
- Reassess constraints
- Adjust idea while preserving core insight

**10. synthesizer** — Merge branches and generate Devpost
- Integrates all parallel work
- Generates Devpost submission draft
- Creates demo script

---

## Agent System

### Hackathon Orchestrator
**Role:** Your experienced teammate

**Personality:** High energy, direct, supportive

**What it does:**
- Guides you through workflow phases
- Manages time and energy
- Prevents common mistakes (overscoping, ignoring tracks)
- Keeps momentum high
- Routes to appropriate workflows

**Use when:**
- You want full guidance through the hackathon
- You're a first-timer
- You want someone managing the big picture

```bash
/bmad:hackathon-suite:hackathon-orchestrator
```

### Hackathon Judge
**Role:** Adversarial validator

**Personality:** Critical expert, brutally honest

**What it does:**
- Validates ideas against "The Gap"
- Reviews pitches from judge perspective
- Scores using real judging rubric (Impact 30%, Innovation 30%, Technical 20%, Presentation 10%, Track Fit 10%)
- Identifies weaknesses before actual judging
- Pushes "cool" ideas to "HOLY SHIT"

**Use when:**
- You need reality check on your idea
- You want adversarial validation
- You're questioning if your idea is good enough
- You want pitch feedback

```bash
/bmad:hackathon-suite:hackathon-judge
```

**The Two Work Together:**
- Orchestrator keeps energy + momentum
- Judge applies pressure + catches issues

### Librarian
**Role:** Content curator and knowledge manager

**Personality:** Organized, meticulous

**What it does:**
- Manages hackathon wisdom library
- Organizes past winners, track examples, sponsor insights
- Indexes and cross-references content
- Surfaces relevant patterns for current context

**Use when:**
- Adding learnings to the library
- Searching for examples or patterns
- Organizing hackathon knowledge

```bash
/bmad:hackathon-suite:librarian
```

---

## Documentation Intelligence System

**NEW:** Transform dense developer documentation into multi-lens knowledge bases optimized for rapid hackathon learning.

### Doc Transformer (Workflow)

**Purpose:** Transform 50-page API docs into 6 specialized lenses in under 10 minutes.

**How it works:**
1. **Ingest & Analyze** - Load docs, determine processing strategy
2. **Shard** - Break large docs into chunks (if needed)
3. **Parallel Transform** - Spawn 6 agents simultaneously for each lens
4. **Code Testing** - Test snippets, annotate results
5. **Reassemble** - Merge outputs, add cross-references
6. **Index & Store** - Generate indices, store in library

**The 6 Transformation Lenses:**
- 📊 **Capabilities** - What it can do (functions, limits, pricing)
- 🚀 **Creative Applications** - Moonshot project ideas
- ⚡ **Quick Start** - Fastest path to working code
- 🔧 **Code Patterns** - How people use it
- 🎯 **Hackathon Tracks** - Positioning strategies
- ⛔ **Constraints** - What NOT to try (save time)

**Processing modes:**
- **Lens-Parallel** (<100 pages): 6 agents, ~5-10 min
- **Hybrid Shard-Lens** (100+ pages): N × 6 agents, ~10-20 min

**Use when:**
- New sponsor APIs at hackathon
- Exploring unfamiliar tools
- Need to understand capabilities fast
- Want moonshot idea inspiration

```bash
/hackathon-suite:doc-transformer
```

**Example:**
```
Input: Anthropic API docs (127 pages)
Processing: Hybrid mode, 4 shards × 6 lenses = 24 parallel agents
Duration: 12 minutes
Output:
  - capabilities-anthropic-api.md (2,847 words)
  - creative-applications-anthropic-api.md (12 moonshot ideas)
  - quick-start-anthropic-api.md (6 tested examples)
  - code-patterns-anthropic-api.md (15 patterns)
  - hackathon-tracks-anthropic-api.md (8 tracks analyzed)
  - constraints-anthropic-api.md (10 dead ends documented)
```

### Doc Explorer (Agent)

**Purpose:** Interactive partner for exploring transformed docs and discovering unique combinations.

**Personality:** Curious technologist, collaborative peer

**What it does:**
- **Conversational Q&A** - "What can I build with 200K context?"
- **Combination Discovery** - Find feature combos within/across APIs
- **Real-Time Testing** - Execute and validate code patterns
- **Cross-Pollination** - Combine multiple APIs for powerful effects
- **Track Guidance** - Filter suggestions through competition lens
- **Dead-End Prevention** - Stop teams from wasting time

**Operational modes:**
- **Exploration** - Open-ended discovery
- **Track-Focused** - Filter for specific track
- **Comparison** - Compare multiple APIs
- **Deep Dive** - Exhaustive feature exploration

**Use when:**
- Exploring transformed documentation
- Finding unique API combinations
- Testing integration patterns
- Need track-specific positioning
- Want to avoid impossible ideas

```bash
/hackathon-suite:doc-explorer anthropic-api
/hackathon-suite:doc-explorer anthropic-api openai-api --mode=compare
/hackathon-suite:doc-explorer anthropic-api --track=social-impact
```

**Example session:**
```
User: "What can I combine with vision?"

Doc Explorer: "Found 7 combinations using vision:
  1. Vision + tool use → Image analysis with actions
  2. Vision + streaming → Progressive analysis
  3. Vision + prompt caching → Cost-optimized
  4. Vision + ElevenLabs → Describe images with voice
  5. Vision + Replicate → Analyze then generate

  Which interests you?"

User: "Test #1"

Doc Explorer: "Testing vision + tool use..."
  ✅ Works! Student photo → Claude analyzes → calls tools
  This is hackathon-ready. Save as discovery?"
```

**Discovery System:**
- Saves successful explorations to `library/discoveries/`
- Includes tested code, use cases, track positioning
- Searchable via librarian
- Reusable across projects

**Integration with suite:**
- context-collector → Auto-loads sponsor APIs
- idea-generator → Surfaces creative-applications lens
- prd-splitter → References code-patterns

**ROI:**
- Old way: 2+ hours reading docs → unclear on possibilities
- New way: 10 min transform + 20 min explore = 30 min → 5 tested ideas
- **Time saved: 90+ minutes per API**

---

## Embedded Frameworks

### 1. Hackathon Sauce (Veteran Principles)
Seven principles from 10+ hackathon winners:
1. Cool > Complex
2. Demo once = shipped
3. Think furthest, not hardest
4. Direction + Impact > Polish
5. One cohesive story
6. Submit early, edit later
7. Track stacking wins

### 2. Idea Iceberg (Validation Framework)
Five levels of idea validation:
- **Level 1: Context** — Do you understand the tracks?
- **Level 2: Skill** — Can you build it in time?
- **Level 3: Objectivity** — What do judges actually reward?
- **Level 4: The Gap** — Is it "HOLY SHIT" or just "cool"?
- **Level 5: Intuition** — Veteran pattern recognition

### 3. The Gap (Winner Filter)
Distinguishes winning projects from participants:

**"Cool Project" signals:**
- Judge: "Nice implementation"
- Judge gives 3/5, moves to next table

**"HOLY SHIT" signals:**
- Judge leans forward involuntarily
- "Wait, how does that work?"
- 3+ follow-up questions
- Judge mentions you to other judges
- 5/5, potential winner

### 4. Moonshot Prompts (Ideation Techniques)
Techniques for impossible-first thinking:
- Dream Fusion Laboratory
- What If Scenarios
- Provocation Technique
- Cross-Pollination
- Time Shifting

---

## Resources

### Hackathon Field Guide
**Purpose:** What to do, capture, and ask at the hackathon venue

**Contents:**
- Pre-hackathon checklist
- Opening ceremony capture strategy
- The 6 questions to ask at every sponsor table
- Networking strategies
- Information hierarchy
- Common mistakes to avoid
- Emergency shortcuts

**Location:** `resources/hackathon-field-guide.md`

### Quick Reference Checklist
**Purpose:** Printable/phone-ready checklist for venue use

**Contents:**
- Timeline checklist
- Opening ceremony notes template
- Sponsor table question list
- Team formation red flags
- Pre-ideation verification

**Location:** `resources/quick-reference-checklist.md`

### Framework Documents
- `resources/hackathon-winning-guide.md` — Hackathon Sauce principles
- `resources/idea-iceberg-framework.md` — 5-level validation
- `resources/the-gap-signals.md` — How to identify HOLY SHIT moments
- `resources/moonshot-prompts.md` — Ideation techniques

---

## Installation

Install via BMAD CLI (or manually if already copied):

```bash
bmad install
# Select: hackathon-suite
```

**Configuration Variables:**

| Variable | Description | Default |
|----------|-------------|---------|
| project_name | Hackathon project identifier | {directory_name} |
| team_size | Number of team members | 4 |
| default_duration | Hackathon length (hours) | 24 |
| output_location | Where documents are generated | {output_folder}/hackathon-output |
| pitch_format | Slide format (marp/slidev/markdown) | marp |
| auto_devpost | Auto-generate Devpost content | true |
| state_folder | Session state persistence | {project-root}/project-state |
| session_ritual_style | Session ritual visibility | gentle |

**Post-Installation:**
- State folder created at configured path
- Output folder ready for generated documents
- All workflows available via `/bmad:hackathon-suite:` prefix

---

## Typical Hackathon Flow

### With Orchestrator (Recommended for First-Timers)

```bash
/bmad:hackathon-suite:hackathon-orchestrator
```

The Orchestrator will guide you through:
1. Context gathering instructions
2. When to run context-collector
3. Ideation with idea-generator
4. Validation with Judge
5. Planning workflows
6. Build phase support
7. Synthesis and submission

### Direct Workflow Execution (Experienced Users)

**Hour 0-2: Gather & Ideate**
```bash
# At hackathon venue, gather context using Field Guide
# Then run:
/bmad:hackathon-suite:context-collector    # 15 min
/bmad:hackathon-suite:idea-generator       # 45 min
/bmad:hackathon-suite:hackathon-judge      # 10 min - validate idea
```

**Hour 2-3: Plan**
```bash
/bmad:hackathon-suite:pitch-deck-gen       # 15 min
/bmad:hackathon-suite:team-yap             # 15 min
/bmad:hackathon-suite:prd-splitter         # 20 min
```

**Hour 3-7: Build**
```bash
# Team codes in parallel branches
# If taking breaks:
/bmad:hackathon-suite:close-session
# When resuming:
/bmad:hackathon-suite:sync-session
# If pivoting:
/bmad:hackathon-suite:adapter
```

**Hour 7-8: Synthesize & Submit**
```bash
/bmad:hackathon-suite:synthesizer          # 30 min
# SUBMIT TO DEVPOST IMMEDIATELY (submit early, edit later)
```

---

## Output Structure

The suite generates organized output in `{output_location}`:

```
hackathon-output/
├── context/
│   ├── tracks/
│   │   └── {track-name}.md
│   ├── sponsors/
│   │   └── {sponsor-name}.md
│   ├── team.md
│   ├── constraints.md
│   ├── yaps/
│   │   └── {timestamp}.md
│   └── context.md (consolidated)
├── ideas/
│   ├── moonshot-ideas.md
│   ├── scored-ideas.md
│   ├── gap-analysis.md
│   ├── feasibility-assessment.md
│   └── selected-idea-summary.md
├── idea.md (THE winning idea)
├── pitch-deck.{format}
├── branches/
│   ├── branch-{A}.md
│   ├── branch-{B}.md
│   └── integration-plan.md
├── devpost-draft.md
└── demo-script.md
```

---

## Production Status

**4 workflows: PRODUCTION QUALITY** (Full guardrails, 21 steps)
- context-collector (7 steps)
- idea-generator (6 steps)
- close-session (5 steps)
- sync-session (3 steps)

**6 workflows: FUNCTIONAL SPECS** (Clear logic, 6 steps)
- pitch-deck-gen through synthesizer

**2 agents: PRODUCTION READY**
- hackathon-orchestrator
- hackathon-judge

**All workflows are functional and ready to use.**

---

## Best Practices

### DO:
- ✅ Use the Field Guide at the venue
- ✅ Gather context BEFORE ideating
- ✅ Run workflows in order
- ✅ Validate with Judge before building
- ✅ Track-stack (submit to multiple tracks)
- ✅ Submit early to Devpost, edit later
- ✅ Demo once = shipped (one working case)

### DON'T:
- ❌ Skip context gathering
- ❌ Start coding immediately
- ❌ Build "cool" when you need "HOLY SHIT"
- ❌ Overscope (3 features when you have 2 hours)
- ❌ Ignore sponsor priorities
- ❌ Skip opening ceremony
- ❌ Submit at the last minute

---

## Common Antipatterns (That This Suite Prevents)

### Antipattern 1: "I'll Figure Out Tracks Later"
**Result:** You build something that doesn't fit any track criteria.
**Prevention:** context-collector forces track analysis up front.

### Antipattern 2: "Cool Tech Stack = Win"
**Result:** You use 3 ML models and blockchain but solve no problem.
**Prevention:** Judge agent catches this immediately.

### Antipattern 3: "Let's Build Everything"
**Result:** 20% complete project that doesn't demo.
**Prevention:** idea-generator's skill-check step validates feasibility.

### Antipattern 4: Vague Impact
**Result:** "This could help millions" with no specifics.
**Prevention:** idea.md template requires concrete examples.

### Antipattern 5: No Demo Moment
**Result:** Slides explaining architecture, no "whoa" moment.
**Prevention:** idea.md forces you to define "The One Demo Case".

---

## Success Metrics

**After using this suite, you should have:**

- ✅ Complete understanding of all tracks and sponsor priorities
- ✅ An idea that crosses The Gap (not just "cool")
- ✅ Track-stacking strategy (2-3 tracks identified)
- ✅ Realistic build plan that fits time constraints
- ✅ One concrete demo case (not "show how it works")
- ✅ Pitch deck ready for editing
- ✅ Devpost draft ready for submission
- ✅ Confidence you're building the right thing

**You'll know it's working when:**
- Sponsors remember your team when you visit tables during the hack
- You submit to Devpost 2+ hours before deadline
- Your demo makes judges lean forward
- You place top 3 in at least one track

---

## Troubleshooting

### "I don't have 90 minutes for context gathering"

Use the Emergency 15-Minute Context Gathering (in Field Guide):
1. Read Devpost (5 min)
2. Visit top 3 sponsor tables (7 min)
3. Quick team yap (3 min)

**But honestly:** Those 90 minutes are your best investment.

### "The Judge agent says my idea isn't good enough"

**Good.** That's its job. It caught the problem NOW instead of after you built it.

Options:
1. Iterate on the idea (use adapter workflow)
2. Run idea-generator again for more options
3. Ask Judge specifically what would push it over The Gap

### "We're pivoting mid-hackathon"

Run the adapter workflow:
```bash
/bmad:hackathon-suite:adapter
```

It will help you reassess constraints and adjust the idea while preserving core insights.

### "Context-collector asks too many questions"

It's supposed to be thorough. Each piece of context feeds into idea generation.

If you're truly time-crunched, you can skip steps, but you'll lose the track-stacking analysis and sponsor priority insights.

---

## Module Philosophy

### The Hackathon Reality

**Most teams fail because:**
1. They start coding before understanding what judges want
2. They build incrementally instead of moonshot-first
3. They don't know "The Gap" exists
4. They scope to "everything" not "one demo case"
5. They submit at 11:59pm in a panic

**This suite embodies:**
1. **Context before code** — Understand before building
2. **Moonshot then constrain** — Think big, then make feasible
3. **The Gap as filter** — "HOLY SHIT" or nothing
4. **Ruthless scoping** — Demo once = shipped
5. **Submit early, edit later** — Remove submission panic

### The Winning Pattern

```
Chaotic venue → context-collector → Structured context
                                   ↓
Structured context → idea-generator → Moonshot ideas
                                   ↓
Moonshot ideas → The Gap filter → HOLY SHIT idea
                                   ↓
HOLY SHIT idea → hackathon-judge → Validated winner
                                   ↓
Validated winner → prd-splitter → Parallel branches
                                   ↓
Parallel branches → synthesizer → Devpost + Demo
                                   ↓
                                  WIN 🏆
```

---

## Real Talk

This suite was built by analyzing patterns from 10+ hackathon wins. Every workflow, every question in the Field Guide, every validation check — it's all based on what ACTUALLY works.

**You don't need to be the best coder to win.**
**You need to:**
- Understand context deeply
- Build something that crosses The Gap
- Demo it compellingly
- Hit multiple tracks

**This suite gives you the system to do all of that.**

---

## Contributing & Feedback

Found this useful? Have suggestions?

**What would make this better:**
- More ideation techniques in moonshot-prompts.md
- Additional track-stacking heuristics
- Past winner case studies
- Integration with actual Devpost API
- Voice input for yap mode
- Hardware inventory prompts

**This is v1.0** — Battle-tested patterns packaged for your win.

---

## Quick Reference

**Starting out?**
```bash
/bmad:hackathon-suite:hackathon-orchestrator
```

**Know what you're doing?**
```bash
/bmad:hackathon-suite:context-collector  # First
/bmad:hackathon-suite:idea-generator     # Second
/bmad:hackathon-suite:hackathon-judge    # Third
```

**Need validation?**
```bash
/bmad:hackathon-suite:hackathon-judge
```

**Taking a break?**
```bash
/bmad:hackathon-suite:close-session
```

---

**Built with BMAD • Designed for Winners • Tested in the Arena**

Go win your hackathon. 🏆
