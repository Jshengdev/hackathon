---
name: 'step-05-confirm'
description: 'Deliver confirmation based on session ritual style'

stateFolder: '{state_folder}'
lastSessionFile: '{state_folder}/sessions/last-session.md'
archiveFolder: '{state_folder}/sessions/_archive'
---

# Step 5: Confirm Close

## STEP GOAL:

To deliver appropriate confirmation that the session was successfully closed, adapting the message to the configured session ritual style.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER skip confirmation (even invisible mode has minimal confirmation)
- 📖 CRITICAL: Read the complete step file before taking any action
- 📋 YOU ARE COMPLETING the session close ritual
- ✅ Adapt confirmation to session_ritual_style exactly

### Role Reinforcement:

- ✅ You are delivering the closing confirmation
- ✅ The ending matters — make it feel complete
- ✅ Match verbosity to ritual style perfectly
- ✅ This is the final step — no next step

### Step-Specific Rules:

- 🎯 Focus ONLY on delivering confirmation
- 🚫 FORBIDDEN to write any more files
- 💬 Adapt output to session_ritual_style
- ✅ Make the user feel the session is properly closed

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly.

### 1. Determine Confirmation Style

Based on `session_ritual_style` from config:

- **invisible** → Minimal or silent
- **gentle** → Brief acknowledgment
- **explicit** → Full recap

### 2. Deliver Confirmation

**If session_ritual_style == invisible:**

Output only:
```
✓
```

---

**If session_ritual_style == gentle:**

```
Saved: [1-line summary of what was captured]
Previous session archived.

Session closed. See you next time.
```

Example:
```
Saved: Working on hackathon context management, decided on simplified workflow approach.
Previous session archived.

Session closed. See you next time.
```

---

**If session_ritual_style == explicit:**

```
**Session Closed**

---

**What was saved:**

**Last Session Summary:** Written to sessions/last-session.md
- [Topics discussed]
- [Decisions made]
- [Next actions identified]

**Session Archive:**
- ✅ Previous session archived to `_archive/{date}/`
- ✅ Archive index updated

**State Updates:**
- ✅ Index updated
- ✅ Focus updated [if applicable]
- ✅ [N] decisions logged [if applicable]

---

**Your next session will start with full context.**
**Session history preserved for future reference.**

See you next time.
```

### 3. Signal Workflow Complete

This is the final step. The workflow is complete.

**No menu. No next step. Session is closed.**

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Confirmation delivered matching ritual style exactly
- invisible: Minimal or silent
- gentle: Brief, one-line summary with archive note
- explicit: Full recap of what was saved including archive
- User feels session is properly closed
- Workflow marked complete

### ❌ SYSTEM FAILURE:

- Wrong verbosity for ritual style (verbose in invisible mode)
- Missing confirmation entirely
- Offering next actions (this is the END)
- Not making the closing feel complete

**Master Rule:** End it right. Match the style. Make it feel complete. Done.
