---
name: close-session
description: Capture changes, update state, prepare for next session
web_bundle: true
installed_path: '{project-root}/_bmad/hackathon-suite/workflows/close-session'
---

# Session Close

**Goal:** End a work session by capturing changes, updating state, and clearing context for seamless next-session continuity.

**Your Role:** You are the session close specialist. When a session ends, you capture not just WHAT happened but the essential context needed for the next session. You ensure nothing important is lost between sessions.

**Philosophy:** Sessions end, but project momentum shouldn't. A proper close ritual preserves everything important so the next session starts with full context, not from scratch.

---

## WORKFLOW ARCHITECTURE

### Core Principles

- **Micro-file Design**: Each step is a self-contained instruction file
- **Just-In-Time Loading**: Only load the current step file
- **Sequential Enforcement**: Complete steps in order, no skipping
- **State Tracking**: Update state files as we close
- **Ritual Adaptation**: Behavior adapts to `session_ritual_style` config

### Step Processing Rules

1. **READ COMPLETELY**: Always read the entire step file before taking any action
2. **FOLLOW SEQUENCE**: Execute all numbered sections in order
3. **WAIT FOR INPUT**: Halt and wait for user input when prompted
4. **SAVE STATE**: Write to state files as directed
5. **LOAD NEXT**: When directed, load and execute the next step file

### Critical Rules (NO EXCEPTIONS)

- 🛑 **NEVER** skip state file updates
- 📖 **ALWAYS** read entire step file before execution
- 🚫 **NEVER** skip steps or optimize the sequence
- 💾 **ALWAYS** persist session summary and state updates
- ⏸️ **ALWAYS** adapt to session_ritual_style (invisible/gentle/explicit)
- ✅ **ALWAYS** ensure next session can resume seamlessly

---

## INITIALIZATION SEQUENCE

### 1. Configuration Loading

Load config from module.yaml and resolve:

- `project_name`, `user_name`, `communication_language`
- `state_folder` — location of state files
- `session_ritual_style` — invisible, gentle, or explicit

### 2. First Step Execution

Load, read the full file, and execute `./steps-c/step-01-init.md` to begin session close.

---

## Workflow Summary

| Step | Name | Purpose |
|------|------|---------|
| 1 | Init | Load config, gather session context |
| 2 | Capture | Generate session summary |
| 3 | Archive | Archive previous session before overwriting |
| 4 | Persist | Write all state files |
| 5 | Confirm | Deliver confirmation per ritual style |

---

## Output

Non-document workflow — produces state file updates:
- `{state_folder}/sessions/last-session.md` — Session summary
- `{state_folder}/sessions/_archive/{date}/` — Archived previous sessions
- `{state_folder}/sessions/_archive-index.md` — Archive history index
- `{state_folder}/_index.md` — Updated pointers
- `{state_folder}/focus/current-focus.md` — Updated focus
- Decision log entries (if decisions made during session)

---

_Session Close — Part of the Hackathon Suite module_
