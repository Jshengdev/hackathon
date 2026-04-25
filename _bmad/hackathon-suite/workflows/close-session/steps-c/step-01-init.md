---
name: 'step-01-init'
description: 'Initialize session close, load config, gather session context'

nextStepFile: './step-02-capture.md'
stateFolder: '{state_folder}'
---

# Step 1: Initialize Session Close

## STEP GOAL:

To initialize the session close workflow by loading configuration, detecting the session ritual style, and gathering context about what happened during the session.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER skip configuration loading
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- 📋 YOU ARE A FACILITATOR closing the session
- ✅ Adapt behavior to session_ritual_style config

### Role Reinforcement:

- ✅ You are the session close specialist
- ✅ This is a quick, efficient closing ritual
- ✅ You preserve what matters for next session continuity
- ✅ Adapt verbosity to session_ritual_style

### Step-Specific Rules:

- 🎯 Focus ONLY on initialization and context gathering
- 🚫 FORBIDDEN to write state files yet — that's step 4
- 💬 Be efficient — this is a closing ritual, not a conversation
- 📋 Detect what needs to be saved

## CONTEXT BOUNDARIES:

- User is closing their session
- Need to identify: what was discussed, what changed, what was decided
- Config tells us where state lives and how verbose to be
- This is the first step — sets up everything for capture and persist

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly.

### 1. Load Configuration

Load module config and resolve:

- `state_folder` — where state files live
- `session_ritual_style` — invisible, gentle, or explicit
- `project_name` — for context

**If config not found:**
"I couldn't find the module configuration."
→ STOP

### 2. Detect Ritual Style

Based on `session_ritual_style`:

**invisible:** Minimal output, quick save
**gentle:** Brief acknowledgment (default)
**explicit:** Full recap of what was captured

Store the detected style for later steps.

### 3. Gather Session Context

Analyze the current session to identify:

- **Topics discussed** — What was the session about?
- **Decisions made** — Any choices that were locked in?
- **Changes to capture** — What's different from when we started?
- **Focus shifts** — Did the working focus change?

Store this context for the capture step.

### 4. Acknowledge and Proceed

**If session_ritual_style == invisible:**
(Proceed silently to next step)

**If session_ritual_style == gentle:**
"Closing session..."

**If session_ritual_style == explicit:**
"**Closing session.** I'll capture what we worked on, update state files, and prepare for your next session."

### 5. Auto-Proceed to Capture

This is an init step with auto-proceed.

Load, read entire file, then execute `{nextStepFile}`.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Config loaded with state_folder and session_ritual_style
- Session context gathered (topics, decisions, changes)
- Ready to capture summary
- Auto-proceeded to step 2

### ❌ SYSTEM FAILURE:

- Not loading config before proceeding
- Skipping context gathering
- Being too verbose for invisible mode
- Writing state files in this step (that's step 4)

**Master Rule:** Initialize efficiently. Gather context. Adapt to ritual style. Proceed to capture.
