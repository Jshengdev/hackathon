---
name: 'step-04-persist'
description: 'Write all state files'

nextStepFile: './step-05-confirm.md'
stateFolder: '{state_folder}'
lastSessionFile: '{state_folder}/sessions/last-session.md'
indexFile: '{state_folder}/_index.md'
focusFile: '{state_folder}/focus/current-focus.md'
decisionLogFolder: '{state_folder}/decisions'
---

# Step 4: Persist State

## STEP GOAL:

To write all state files that capture this session's work — last-session.md, _index.md updates, focus updates, and any decision log entries.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER skip file writes
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- 📋 YOU ARE WRITING STATE
- ✅ Write all applicable files atomically

### Role Reinforcement:

- ✅ File writes must be complete and accurate
- ✅ Update only what changed — don't overwrite unchanged data
- ✅ Maintain file format consistency

### Step-Specific Rules:

- 🎯 Focus ONLY on file write operations
- 🚫 FORBIDDEN to skip any required write
- 💬 Operate silently — this is background work
- 📋 Ensure atomic writes (all or nothing)

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly.

### 1. Write last-session.md

Write the session summary to `{lastSessionFile}`:

```markdown
---
date: [current date]
session_id: [timestamp or unique id]
---

# Last Session Summary

[Insert captured summary from step 2]

---

_Session closed: [timestamp]_
```

**Note:** Previous session was archived in step 3. Safe to overwrite.

### 2. Update _index.md

Create or update `{indexFile}` with pointers:

```markdown
# Project State Index

## Quick Links

- **Last Session:** sessions/last-session.md ([date])
- **Current Focus:** focus/current-focus.md
- **Decisions:** decisions/

## Session Archive

- View all sessions: sessions/_archive-index.md

---

_Last updated: [timestamp]_
```

### 3. Update current-focus.md (If Focus Changed)

**Check:** Did the session change what we're focusing on?

**If YES:**
Create or update `{focusFile}`:

```markdown
---
updated: [current date]
---

# Current Focus

**Working On:** [current focus area]

**Context:** [brief context]

**Next Actions:**
- [action 1]
- [action 2]
```

**If NO focus change:**
Skip this write.

### 4. Write Decision Log Entries (If Decisions Made)

**Check:** Were any decisions made during this session?

**If YES:**
For each decision, write to `{decisionLogFolder}/[date].md`:

```markdown
## [Decision Title]

**Date:** [date]
**Context:** [what led to this decision]

**Decision:** [what was decided]

**Rationale:** [why this choice]

**Impact:** [what this affects]

---
```

**If file for today exists:** Append new decisions
**If file doesn't exist:** Create new file

**If NO decisions:**
Skip this write.

### 5. Auto-Proceed to Confirm

Load, read entire file, then execute `{nextStepFile}`.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- last-session.md written with complete summary
- _index.md updated with current pointers
- current-focus.md updated (if focus changed)
- Decision log entries written (if decisions made)
- All writes atomic and complete

### ❌ SYSTEM FAILURE:

- Partial writes (some files updated, others not)
- Corrupting existing state files
- Writing empty or malformed content
- Skipping required writes

**Master Rule:** Write everything. Write it correctly. Write it completely. Then proceed.
