---
name: 'step-02-analyze'
description: 'Analyze state and generate sync summary'

nextStepFile: './step-03-present.md'
stateFolder: '{state_folder}'
---

# Step 2: Analyze and Generate Summary

## STEP GOAL:

Analyze loaded state to identify what happened, what changed, and what's next - then generate a concise summary.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, read entire file first
- 🎯 ALWAYS follow the exact instructions in the step file

### Role Reinforcement:

- You are synthesizing information into a briefing
- Be concise but complete
- Prioritize what the user needs to know

### Step-Specific Rules:

- 🎯 Focus on analysis and summary generation
- 🚫 FORBIDDEN to present yet - that's next step
- 💬 Silent analysis - prepare the briefing
- 📝 Generate all summary sections

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Identify Last Session

From loaded sessions:
- What was the most recent session?
- What was the user working on?
- When did it end?

### 2. Identify Changes Since Last Sync

Look for:
- New decisions made
- Decisions opened or modified
- Sessions started/completed

### 3. Determine Current State

Assess:
- What's the current focus?
- What's been completed?
- What's in progress?

### 4. Identify Blockers

Check for:
- Decisions marked BLOCKED
- Unresolved issues
- Dependencies not met

### 5. Generate Suggested Next Actions

Based on state, suggest:
- Resume last session's work?
- Address a blocker?
- Make a pending decision?
- Start a new session?

### 6. Compile Summary Sections

Prepare these sections for presentation:

**Last Session:**
[What you were doing, when]

**Since Then:**
[What's changed - decisions made, etc.]

**Current State:**
[Focus, completed, in progress]

**Blockers:**
[Any issues, or "None"]

**Suggested Next:**
[Recommended action to pick up]

### 7. Auto-Proceed to Presentation

Load, read entire file, then execute {nextStepFile}.

---

## SYSTEM SUCCESS/FAILURE METRICS:

### SUCCESS:

- All summary sections prepared
- Changes accurately identified
- Actionable suggestion generated
- Ready for presentation

### FAILURE:

- Missing summary sections
- Inaccurate change detection
- No suggested next action
- Presenting before ready

**Master Rule:** Thorough analysis, concise output.
