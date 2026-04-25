---
name: 'step-02-capture'
description: 'Generate session summary from conversation context'

nextStepFile: './step-03-archive.md'
stateFolder: '{state_folder}'
---

# Step 2: Capture Session Summary

## STEP GOAL:

To generate a concise, useful session summary that captures what happened, what was decided, and what the next session needs to know.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate empty or generic summaries
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- 📋 YOU ARE A FACILITATOR capturing session essence
- ✅ Adapt to session_ritual_style from step 1

### Role Reinforcement:

- ✅ You are capturing what matters for next session
- ✅ Summaries should be actionable, not verbose
- ✅ Focus on continuity — what does future-you need to know?

### Step-Specific Rules:

- 🎯 Focus ONLY on generating the session summary
- 🚫 FORBIDDEN to write files yet — that's step 4
- 💬 Be concise — capture essence, not transcripts
- 📋 Structure for quick scanning

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly.

### 1. Generate Session Summary

Create a structured summary:

```markdown
## Session Summary

**Date:** [current date]
**Duration:** [approximate session length]

### What We Worked On
- [Main topic 1]
- [Main topic 2]

### Decisions Made
- [Decision 1] — [brief rationale]
- [Decision 2] — [brief rationale]

### Changes to State
- [What changed]
- [What was updated]

### Next Session Should
- [Continue with X]
- [Review Y]
- [Consider Z]
```

**Summary Guidelines:**
- Keep each bullet to one line
- Focus on actionable context
- Include enough detail to resume, not more
- If nothing was decided, omit "Decisions Made" section
- If no state changes, omit "Changes to State" section

### 2. Adapt to Ritual Style

**If session_ritual_style == invisible:**
(Generate summary silently, no output)

**If session_ritual_style == gentle:**
"Summary captured."

**If session_ritual_style == explicit:**
Present the generated summary and allow review.

### 3. Auto-Proceed to Archive

Load, read entire file, then execute `{nextStepFile}`.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Summary generated
- Summary is concise and actionable
- Adapted to session_ritual_style
- Ready to persist in step 4

### ❌ SYSTEM FAILURE:

- Generating empty or generic summaries
- Being verbose in invisible mode
- Writing files (that's step 4's job)
- Not including actionable "Next Session Should" section

**Master Rule:** Capture the essence. Enable continuity. Respect the ritual style.
