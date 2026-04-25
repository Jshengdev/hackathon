---
name: 'step-04-skill-check'
description: 'Filter to buildable in remaining time'

nextStepFile: './step-05-selection.md'
outputLocation: '{output_location}'
default_duration: '{default_duration}'
---

# Step 4: Skill Check

## STEP GOAL:

Filter Gap-crossing ideas to what the team can actually build in remaining time.

## MANDATORY SEQUENCE

### 1. Load Context and Gap-Crossers

Read:
- `{outputLocation}/ideas/gap-analysis.md` (ideas that crossed The Gap)
- `{outputLocation}/context.md` (team skills, constraints)

### 2. Explain Skill Check

"**Skill Check: Can We Build This?**

We have [N] ideas that crossed The Gap. Now the reality filter:
- Can this team build it?
- In the remaining time? (~{default_duration} hours)
- With available hardware/APIs?
- Given team energy levels?

Remember: **Demo once = shipped**. We only need ONE working case."

### 3. Assess Each Gap-Crosser

For each idea that crossed The Gap, evaluate:

**Technical Feasibility:**
- Core tech: Does team know it?
- New learning required: How much?
- Integration complexity: Simple or hairy?

**Time Feasibility:**
- Minimum viable demo: How many hours?
- Buffer for bugs: Realistic?
- Parallel work possible: Yes/No?

**Resource Availability:**
- Hardware needed: Available?
- APIs needed: Access confirmed?
- Dependencies: All obtainable?

**Team Match:**
- Does team WANT to build this?
- Energy level sufficient?
- Skills aligned?

**Score: Definitely Buildable / Risky But Possible / Too Ambitious**

### 4. Define "The One Demo Case"

For buildable ideas, define:
- Input: [Specific example]
- Process: [What happens, visibly]
- Output: [Impressive result]

**Scope ruthlessly to the one case that proves the concept.**

### 5. Write Feasibility Assessment

Create: `{outputLocation}/ideas/feasibility-assessment.md`

```markdown
# Feasibility Assessment

Given team: [skills], time: [hours remaining], resources: [list]

---

## Definitely Buildable

### [Idea Name]

**Technical Feasibility:** ✅
- Core tech: [Team knows X, Y, Z]
- Learning required: [Minimal / Moderate]
- Integration: [Simple — A → B → C]

**Time Feasibility:** ✅
- Minimum viable demo: [N] hours
- Buffer: [Y] hours available
- Parallel work: [Yes — person 1 does X, person 2 does Y]

**Resources:** ✅
- Hardware: [Available]
- APIs: [Access confirmed]

**Team Match:** ✅
- Team wants to build this: [Yes/excitement level]
- Energy sufficient: [Yes]

**The One Demo Case:**
- Input: [Specific]
- Process: [Visible]
- Output: [Impressive]

**Risk Level:** LOW

---

[Repeat for all definitely buildable]

---

## Risky But Possible

### [Idea Name]

**Why risky:**
- [Risk factor 1]
- [Risk factor 2]

**Could work if:**
- [Mitigation 1]
- [Mitigation 2]

---

## Too Ambitious

### [Idea Name]

**Why not feasible:**
- [Blocker 1]
- [Blocker 2]

**Would need:**
- [What it would take]

---

## Recommendation

**Safe bets (definitely buildable + crossed Gap):** [N] ideas
**Risky moonshots (possible + crossed Gap):** [N] ideas

Ready for selection.
```

### 6. Brief Confirmation

"**✓ Skill check complete**

**Definitely buildable:** [N] ideas
**Risky but possible:** [N] ideas

Next: Selection — I'll present the top 3 for you to choose."

### 7. Auto-Proceed

Load, read entire file, then execute `{nextStepFile}`.

---

**Master Rule:** Demo once = shipped. Scope to ONE working case. Ambitious but achievable.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- All Gap-crossing ideas assessed for buildability
- "The One Demo Case" defined for buildable ideas
- Feasibility assessment file written
- Risk levels identified (definitely buildable vs risky)
- Ready for selection with complete context

### ❌ SYSTEM FAILURE:

- Unrealistic time estimates
- Ignoring team energy/skill constraints
- Missing "demo once = shipped" principle
- Not defining the one demo case
- Overscoping to full product instead of single case

**Master Rule:** Demo once = shipped. Scope to ONE working case. Ambitious but achievable.
