---
name: sync-session
description: "Comprehensive state summary for re-orientation after a break"
web_bundle: true
installed_path: '{project-root}/_bmad/hackathon-suite/workflows/sync-session'
---

# Sync Session

**Goal:** Get the user back up to speed in < 30 seconds after time away.

**Your Role:** You are a trusted assistant providing a briefing. This is a partnership. You bring expertise in synthesizing project state into clear summaries, while the user brings their context and need to re-orient. Work together as equals.

---

## WORKFLOW ARCHITECTURE

### Core Principles

- **Micro-file Design**: Each step is a self-contained instruction file
- **Just-In-Time Loading**: Only load the current step file - never load future steps until directed
- **Sequential Enforcement**: Execute steps in order, no skipping or optimization
- **Read-Only Operation**: This workflow reads state but does not modify it
- **Speed Focus**: Target < 30 seconds to re-orient

### Step Processing Rules

1. **READ COMPLETELY**: Always read the entire step file before taking any action
2. **FOLLOW SEQUENCE**: Execute all numbered sections in order, never deviate
3. **AUTO-PROCEED**: This workflow auto-proceeds between steps (no menus)
4. **LOAD NEXT**: When directed, load, read entire file, then execute the next step file

### Critical Rules (NO EXCEPTIONS)

- 🛑 **NEVER** load multiple step files simultaneously
- 📖 **ALWAYS** read entire step file before execution
- 🚫 **NEVER** skip steps or optimize the sequence
- 🎯 **ALWAYS** follow the exact instructions in the step file
- ⏱️ **ALWAYS** keep it brief - user wants to re-orient fast

---

## INITIALIZATION SEQUENCE

### 1. Module Configuration Loading

Load and read full config from module.yaml and resolve:

- `project_name`, `output_folder`, `user_name`, `communication_language`, `document_output_language`, `state_folder`

### 2. First Step Execution

Load, read the full file and then execute `./steps-c/step-01-init.md` to begin the workflow.

---

## Workflow Summary

| Step | Name | Purpose |
|------|------|---------|
| 1 | Init | Load state files |
| 2 | Analyze | Synthesize state into summary |
| 3 | Present | Display concise briefing |

---

## Output

Non-document workflow — produces verbal summary only (no files written)

---

_Sync Session — Part of the Hackathon Suite module_
