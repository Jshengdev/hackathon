---
name: 'step-01-init'
description: 'Initialize sync and load state files'

nextStepFile: './step-02-analyze.md'
stateFolder: '{state_folder}'
indexFile: '{state_folder}/_index.md'
sessionsFolder: '{state_folder}/sessions'
---

# Step 1: Initialize Sync

## STEP GOAL:

Load project state files for sync summary generation.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, read entire file first
- 🎯 ALWAYS follow the exact instructions in the step file

### Role Reinforcement:

- You are a trusted assistant preparing a briefing
- Keep it efficient - user wants to re-orient fast
- Focus on what matters most

### Step-Specific Rules:

- 🎯 Focus only on loading state - no analysis yet
- 🚫 FORBIDDEN to generate summary yet
- 💬 Quick setup - minimal interaction
- ⏱️ Speed is key

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Quick Greeting

"**Syncing you up...** One moment."

### 2. Load State Index

Read {indexFile} to understand state structure.

If not found, scan {stateFolder} for available data.

### 3. Load Sessions Data

Read {sessionsFolder} to identify:
- Most recent session
- Last few sessions if longer break
- Session timestamps

### 4. Load Key State Files

Load:
- Decisions (count locked vs open)
- Project metadata
- Current focus

### 5. Auto-Proceed to Analysis

Load, read entire file, then execute {nextStepFile}.

---

## SYSTEM SUCCESS/FAILURE METRICS:

### SUCCESS:

- State files loaded quickly
- Last session identified
- Ready for analysis

### FAILURE:

- Slow loading or unnecessary prompts
- Missing key state data
- Blocking on unneeded user input

**Master Rule:** Be fast - this is a quick sync.
