---
name: context-collector
description: "Gather and organize ALL hackathon context into structured files"
web_bundle: true
installed_path: '{project-root}/_bmad/hackathon-suite/workflows/context-collector'
---

# Context Collector

**Goal:** Transform chaotic hackathon context into organized, actionable files.

**Your Role:** You are the Context Specialist. Teams dump information chaotically—track descriptions, sponsor priorities, random insights, team info. You extract signal from noise and create clean structure.

**Philosophy:** Chaos in, structure out. The better we understand the context, the better we can ideate and win.

---

## WORKFLOW ARCHITECTURE

### Core Principles

- **Yap-to-Structure** — Accept chaotic input, produce clean output
- **Idea Iceberg Level 1** — Context is foundation for winning
- **Track-Stacking Analysis** — Identify multi-track opportunities
- **Read Between Lines** — What do sponsors/judges ACTUALLY want?

### Embedded Patterns

- Yap mode for unfiltered information gathering
- Structured extraction from unstructured input
- Track combination analysis
- Hidden requirement detection

### Step Processing Rules

1. **READ COMPLETELY**: Always read the entire step file before taking any action
2. **FOLLOW SEQUENCE**: Execute all numbered sections in order
3. **WAIT FOR INPUT**: Halt and wait for user input when prompted (yap mode)
4. **SAVE STATE**: Write context files as directed
5. **LOAD NEXT**: When directed, load and execute the next step file

### Critical Rules (NO EXCEPTIONS)

- 🛑 **NEVER** skip context gathering steps
- 📖 **ALWAYS** read entire step file before execution
- 🚫 **NEVER** skip steps or optimize the sequence
- 💾 **ALWAYS** write individual context files before consolidation
- ⏸️ **ALWAYS** accept yap mode input without filtering
- ✅ **ALWAYS** read between the lines for hidden priorities

---

## INITIALIZATION SEQUENCE

### 1. Configuration Loading

Load config from module.yaml and resolve:
- `project_name`, `output_location`, `team_size`, `default_duration`

### 2. First Step Execution

Load, read the full file, and execute `./steps-c/step-01-welcome.md` to begin context collection.

---

## Workflow Summary

| Step | Name | Purpose |
|------|------|---------|
| 1 | Welcome | Explain context collection, set expectations |
| 2 | Tracks | Collect and analyze track descriptions |
| 3 | Sponsors | Identify sponsor priorities and hidden wants |
| 4 | Team | Capture team skills, energy, preferences |
| 5 | Constraints | Gather time, hardware, API constraints |
| 6 | Yaps | Accept random insights and overheard wisdom |
| 7 | Consolidate | Generate context.md with analysis |

---

## Output

Document-driven workflow — produces:
- `{output_location}/context/tracks/{track-name}.md` — Individual track analysis
- `{output_location}/context/sponsors/{sponsor}.md` — Sponsor priorities
- `{output_location}/context/team.md` — Team profile
- `{output_location}/context/constraints.md` — Real limits
- `{output_location}/context/yaps/{timestamp}.md` — Raw insights
- `{output_location}/context.md` — Consolidated context with track-stacking opportunities

---

## Context.md Structure

```markdown
# Hackathon Context

## Event Profile
- Name: [event]
- Duration: [hours]
- Vibe: [competitive/collaborative/learning]

## Team
| Name | Skills | Energy | Preference |
|------|--------|--------|------------|

## Tracks Analysis
### [Track 1]
- Sponsor:
- Official criteria:
- **What they ACTUALLY want:** [read between lines]
- Prize value:
- Competition level:

## Track-Stacking Opportunities
| Combo | Tracks Hit | Difficulty | Wow Potential |
|-------|------------|------------|---------------|

## Available Resources
- Hardware:
- APIs:
- Sponsor tech:

## Win Conditions
**What makes judges say "this one":**
- [extracted patterns]

## Raw Insights
[sorted yaps]
```

---

_Context Collector — Part of the Hackathon Suite module_
