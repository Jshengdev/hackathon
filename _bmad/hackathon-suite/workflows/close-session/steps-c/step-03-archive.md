---
name: 'step-03-archive'
description: 'Archive previous session before overwriting'

nextStepFile: './step-04-persist.md'
stateFolder: '{state_folder}'
sessionsFolder: '{state_folder}/sessions'
archiveFolder: '{state_folder}/sessions/_archive'
lastSessionFile: '{state_folder}/sessions/last-session.md'
archiveIndexFile: '{state_folder}/sessions/_archive-index.md'
---

# Step 3: Archive Previous Session

## STEP GOAL:

To archive the existing last-session.md before it gets overwritten, preserving session history for future reference.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER skip archival if previous session exists
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- 📋 YOU ARE THE ARCHIVIST preserving session history

### Role Reinforcement:

- ✅ You are preserving history
- ✅ Previous sessions are valuable context for long breaks
- ✅ Archive enables "look at last few sessions" capability
- ✅ Operate silently — this is background work

### Step-Specific Rules:

- 🎯 Focus ONLY on archiving the previous session
- 🚫 FORBIDDEN to write new session yet — that's step 4
- 💬 Operate silently — adapt to session_ritual_style
- 📋 Preserve original session metadata in archive

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly.

### 1. Check for Previous Session

Check if `{lastSessionFile}` exists.

**If file does NOT exist:**
- This is the first session, nothing to archive
- Skip to step 4 (proceed silently)

**If file EXISTS:**
- Previous session needs archiving
- Continue with archival sequence

### 2. Extract Session Metadata

Read the existing `{lastSessionFile}` and extract:

- `date` — From frontmatter or file content
- `session_id` — If present, or generate from timestamp
- `summary` — First 100 chars for index entry

### 3. Create Archive Folder Structure

Ensure archive folder exists:

```
{archiveFolder}/{YYYY-MM-DD}/
```

Where `{YYYY-MM-DD}` is the date from the session being archived.

**If folder doesn't exist:** Create it.

### 4. Archive the Session

Copy `{lastSessionFile}` to:

```
{archiveFolder}/{YYYY-MM-DD}/session-{timestamp}.md
```

**Filename format:** `session-{HHmmss}.md` using the session's timestamp.

**Do NOT delete the original yet** — step 4 will overwrite it.

### 5. Update Archive Index

Append entry to `{archiveIndexFile}`:

```markdown
| {date} | {session_id} | {summary...} | [View](./_archive/{YYYY-MM-DD}/session-{timestamp}.md) |
```

**If archive index doesn't exist:** Create it with header:

```markdown
# Session Archive Index

Historical record of all sessions.

---

| Date | Session ID | Summary | Link |
|------|------------|---------|------|
```

### 6. Auto-Proceed to Persist

Load, read entire file, then execute `{nextStepFile}`.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Previous session detected and archived (or correctly skipped if first session)
- Archive folder structure created if needed
- Session file copied with proper naming convention
- Archive index updated with new entry
- Auto-proceeded to step 4

### ❌ SYSTEM FAILURE:

- Skipping archival when previous session exists
- Deleting original before step 4 overwrites it
- Not creating archive folder structure
- Not updating archive index

**Master Rule:** Preserve history. Archive completely. Proceed silently.
