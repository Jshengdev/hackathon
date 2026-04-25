---
name: 'step-03-gap-filter'
description: 'Apply The Gap test - HOLY SHIT vs cool project'

nextStepFile: './step-04-skill-check.md'
outputLocation: '{output_location}'
gapSignalsFile: '../../../resources/the-gap-signals.md'
---

# Step 3: The Gap Filter

## STEP GOAL:

Distinguish ideas that cross "The Gap" from those that don't. HOLY SHIT vs cool project.

## MANDATORY SEQUENCE

### 1. Load Resources

Read:
- `{outputLocation}/ideas/scored-ideas.md` (top champions)
- `{gapSignalsFile}` (Gap measurement signals)

### 2. Explain The Gap

"**The Gap Filter**

This is where we separate:
- **Cool projects** → Judges nod politely, say 'nice work'
- **HOLY SHIT projects** → Judges lean forward, ask questions, remember you

**The Gap signals** (from veteran wisdom):
- Would a judge lean forward when you explain it?
- Would they ask follow-up questions?
- Would they remember your project name afterward?
- Would they mention you to other judges?

Let's test each top idea."

### 3. Test Each Top Idea

For each track-stacking champion (top 5-7 ideas), evaluate:

**Gap Signal 1: Lean Forward Test**
- Does the concept make someone want to hear more?
- Or is it "yeah, that makes sense"?

**Gap Signal 2: 30-Second Explainable**
- Can you explain it in 30 seconds clearly?
- Does it have a memorable hook?

**Gap Signal 3: Future Pull**
- Does it feel like the future?
- Or like a hackathon project?

**Gap Signal 4: Unique Angle**
- Would judges say "haven't seen this before"?
- Or "another X project"?

**Gap Signal 5: Moonshot Intact**
- Did we keep the moonshot core?
- Or did we over-constrain to boring?

**Score each signal: Pass/Weak/Fail**

### 4. Categorize Ideas

Based on Gap signals:

- **Crossed The Gap** — 4-5 signals Pass
- **On The Edge** — 2-3 signals Pass (could be developed)
- **Cool But Not Holy Shit** — 0-1 signals Pass

### 5. Write Gap Analysis File

Create: `{outputLocation}/ideas/gap-analysis.md`

```markdown
# The Gap Analysis

Testing which ideas cross from "cool" to "HOLY SHIT."

---

## Ideas That Crossed The Gap

### [Idea Name]

**Gap Signals:**
- ✅ Lean Forward Test: [Why it works]
- ✅ 30-Second Explainable: [The hook]
- ✅ Future Pull: [Why it feels like the future]
- ✅ Unique Angle: [What makes it different]
- ✅ Moonshot Intact: [The ambitious core]

**Gap Score:** 5/5 — **HOLY SHIT**

**Why it crosses The Gap:**
[Explanation of what makes this special]

---

[Repeat for all ideas that crossed]

---

## On The Edge (Could Be Developed)

### [Idea Name]

**Gap Signals:**
- ✅ Pass
- ⚠️ Weak
- ❌ Fail

**Gap Score:** 3/5 — **Needs refinement**

**How to cross The Gap:**
[What would make this HOLY SHIT]

---

## Cool But Not HOLY SHIT

### [Idea Name]

**Why it doesn't cross:**
[Honest assessment]

---

## Recommendations

**Top Gap-Crossers for Selection:**
1. [Idea 1] — [Why it's special]
2. [Idea 2] — [Why it's special]
3. [Idea 3] — [Why it's special]
```

### 6. Brief Confirmation

"**✓ Gap filter complete**

**Ideas that crossed The Gap:** [N]
**On the edge:** [N]

Next: Skill check — can we actually build these in time?"

### 7. Auto-Proceed

Load, read entire file, then execute `{nextStepFile}`.

---

**Master Rule:** The Gap is real. Cool projects don't win hackathons. HOLY SHIT projects do.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- All top ideas tested against The Gap signals
- "HOLY SHIT" vs "cool project" clearly distinguished
- Gap analysis file written
- Ideas that crossed The Gap identified
- Clear recommendations for selection step

### ❌ SYSTEM FAILURE:

- Accepting "cool projects" as good enough
- Not testing all 5 Gap signals
- Missing the "lean forward" test
- Confusing technical complexity with The Gap
- Proceeding with ideas that don't cross The Gap

**Master Rule:** The Gap is real. Cool projects don't win hackathons. HOLY SHIT projects do.
