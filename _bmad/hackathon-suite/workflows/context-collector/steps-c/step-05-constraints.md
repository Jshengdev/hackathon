---
name: 'step-05-constraints'
description: 'Gather time, hardware, API, and other constraints'

nextStepFile: './step-06-yaps.md'
outputLocation: '{output_location}'
default_duration: '{default_duration}'
---

# Step 5: Constraints

## STEP GOAL:

Identify REAL constraints vs perceived constraints.

## MANDATORY SEQUENCE

### 1. Prompt for Constraints

"**Step 4: Constraints**

Let's identify your real constraints:

**Time:**
- How much time left? ({default_duration} hours total?)
- How much time already spent?
- Deadlines? (submission, judging)

**Hardware:**
- What hardware do you have access to?
- What's checked out already?
- What can you get if needed?

**APIs/Services:**
- What APIs are you using?
- API keys obtained?
- Rate limits or quotas?

**Other:**
- Internet reliability?
- Power/charging situation?
- Team availability (anyone leaving early?)

What are your constraints?"

### 2. Distinguish Real vs Perceived

As they share constraints, categorize:
- **Real limits** — Can't change (time deadline, no hardware available)
- **Perceived limits** — Could work around (think there's no API, but there is)

### 3. Write Constraints File

Create: `{outputLocation}/context/constraints.md`

```markdown
# Constraints

## Time
- Total: {default_duration} hours
- Used: [X] hours
- Remaining: [Y] hours
- Hard deadlines: [List]

## Real Limits
- [Actual unchangeable constraints]
- [Things we absolutely can't do]

## Perceived Limits (Workarounds Possible)
- [Things that seem limiting but aren't]
- [Possible workarounds]

## Hardware Available
- [List with quantities]
- [Checked out: X, Still available: Y]

## APIs/Services
- [Service name]: [Access? Rate limits?]

## Other Considerations
- [Internet, power, team availability]

## Scope Implications
**Given these constraints, we should:**
- [Scope guideline 1]
- [Scope guideline 2]
```

### 4. Brief Confirmation

"**✓ Constraints identified**

Almost done—time for yap mode..."

### 5. Auto-Proceed

Load, read entire file, then execute `{nextStepFile}`.

---

**Master Rule:** Real limits guide scope. Perceived limits are challenges to solve.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Real vs perceived limits clearly distinguished
- Constraints file written with workarounds noted
- Time budget realistic
- Hardware/API availability confirmed
- Scope implications identified

### ❌ SYSTEM FAILURE:

- Treating perceived limits as real constraints
- Unrealistic time estimates
- Not checking hardware availability
- Missing workaround opportunities

**Master Rule:** Real limits guide scope. Perceived limits are challenges to solve.
