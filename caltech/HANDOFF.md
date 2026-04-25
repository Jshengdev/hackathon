# Caltech Hackathon — Tactical Execution Pane

You are the **tactical execution Claude** for the Caltech hackathon. Your job is to run hackathon-suite workflows step-by-step. The strategic Hackathon Orchestrator lives in a separate session — the human will bounce back to that session between workflow steps to realign.

## Current Mission

Run the hackathon-suite workflows to lock in idea + PRD tonight. Total budget: ~2 hours.

## Team Composition

- **4 teammates total**
- **3 technical**
- **1 non-technical**
- (User will fill in names + specifics during context-collector workflow)

## Workflow Plan

| # | Workflow | Time Budget | Status |
|---|----------|------------|--------|
| 1 | `bmad:hackathon-suite:workflows:context-collector` | 25 min | TODO |
| 2 | `bmad:hackathon-suite:workflows:idea-generator` | 25 min | TODO |
| 3 | `bmad:hackathon-suite:workflows:win-validator` | 15 min | TODO |
| 4 | `bmad:hackathon-suite:workflows:prd-splitter` | 30 min | TODO |
| 5 | `bmad:hackathon-suite:workflows:pitch-deck-gen` | 25 min | TODO |

After each workflow finishes, the human will summarize results back to the orchestrator pane for a realignment check before kicking off the next one.

## Output Location

Everything writes to `/Users/johnnysheng/hackathon/caltech/`:
- `context/` — track/sponsor/team/constraints/yaps files
- `context.md` — consolidated context
- `idea.md` — selected idea
- `validation.md` — win-validator output
- `prd/` — split branch docs
- `pitch/` — pitch deck

## Workflow Config Defaults (use these)

- `project_name`: `caltech`
- `team_size`: `4`
- `default_duration`: ASK USER (this is a Caltech hackathon — could be 24h, 36h, etc.)
- `output_location`: `/Users/johnnysheng/hackathon/caltech` (NOT the default `hackathon-output` subfolder — write directly here)
- `state_folder`: `/Users/johnnysheng/hackathon/caltech/project-state`
- `pitch_format`: `marp`
- `auto_devpost`: `true`

## Operating Rules

1. **Do NOT skip workflow steps** — read each step file fully, execute in order
2. **Yap mode is sacred** — when the workflow asks for unfiltered input, accept it raw
3. **Hard time caps** — if a workflow is overrunning its budget, ship and move on
4. **Stop at workflow boundaries** — when a workflow finishes, tell the human to switch back to the orchestrator pane before proceeding to the next workflow
5. **Don't re-ideate from scratch** — the team already has "a pretty interesting start." Capture and stress-test it; don't replace it

## Kickoff

Run this first:

```
/bmad:hackathon-suite:workflows:context-collector
```

Let's GO. 🔥
