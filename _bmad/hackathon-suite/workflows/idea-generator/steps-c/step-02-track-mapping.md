---
name: 'step-02-track-mapping'
description: 'Score each idea against all tracks, identify champions'

nextStepFile: './step-03-gap-filter.md'
outputLocation: '{output_location}'
---

# Step 2: Track Mapping

## STEP GOAL:

Score every idea against every track. Identify track-stacking champions.

## MANDATORY SEQUENCE

### 1. Load Ideas and Context

Read:
- `{outputLocation}/ideas/moonshot-ideas.md`
- `{outputLocation}/context.md` (for track criteria)

### 2. Explain Track Mapping

"**Track Mapping Phase**

For each idea, I'll score it against ALL tracks (1-5 scale):
- 5 = Perfect fit, obviously targets this track
- 4 = Strong fit, would likely place
- 3 = Moderate fit, could work
- 2 = Weak fit, stretch
- 1 = Poor fit, doesn't target this

Then we'll identify **track-stacking champions** — ideas that hit 2-3+ tracks strongly."

### 3. Score Each Idea

For each idea, for each track, determine score based on:
- Does it match official criteria?
- Does it hit the hidden priority we identified?
- Would judges see the connection?

**Generate scoring matrix:**

| Idea | Track 1 | Track 2 | Track 3 | ... | Total | Tracks Hit (4-5) |
|------|---------|---------|---------|-----|-------|------------------|
| Idea 1 | 5 | 3 | 1 | ... | [sum] | 2 |
| Idea 2 | 4 | 5 | 4 | ... | [sum] | 3 |

### 4. Identify Track-Stacking Champions

Sort ideas by:
1. **Number of strong hits (4-5 scores)** — More tracks = better
2. **Total score** — Overall alignment
3. **Strategic combinations** — Do the tracks complement each other?

**Highlight top 5-7 track-stacking champions.**

### 5. Write Scored Ideas File

Create: `{outputLocation}/ideas/scored-ideas.md`

```markdown
# Track-Mapped Ideas

**Scoring:** 1 (poor fit) to 5 (perfect fit)

---

## Track-Stacking Champions

### [Idea Name] — [N] tracks hit

**Scores:**
| Track | Score | Reasoning |
|-------|-------|-----------|
| [Track 1] | 5 | [Why perfect fit] |
| [Track 2] | 4 | [Why strong fit] |

**Total Score:** [sum]
**Tracks Strongly Hit (4-5):** [count]

**Why it stack-stacks well:**
[Explanation of how tracks complement each other]

---

[Repeat for top 5-7 champions]

---

## All Ideas Ranked

| Rank | Idea | Total Score | Tracks Hit (4-5) | Strategic Value |
|------|------|-------------|------------------|-----------------|
| 1 | [Idea] | [score] | [count] | [High/Medium/Low] |

---

## Track Coverage Analysis

Which tracks are well-covered vs underserved by our ideas?

| Track | Strong Ideas (4-5) | Moderate Ideas (3) | Weak Ideas (1-2) |
|-------|-------------------|-------------------|------------------|
```

### 6. Brief Confirmation

"**✓ Track mapping complete**

**Top track-stacking champions:** [N] ideas hit 2-3+ tracks strongly.

Next: The Gap filter — let's see which are 'HOLY SHIT' vs just 'cool.'"

### 7. Auto-Proceed

Load, read entire file, then execute `{nextStepFile}`.

---

**Master Rule:** Track stacking wins. Find ideas that hit multiple tracks convincingly.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- ALL ideas scored against ALL tracks
- Track-stacking champions identified (2-3+ strong hits)
- Scored ideas file written with matrix
- Strategic combinations highlighted
- Top 5-7 champions identified for Gap filter

### ❌ SYSTEM FAILURE:

- Not scoring all ideas against all tracks
- Missing track-stacking opportunities
- Incomplete scoring matrix
- Not identifying which tracks complement each other
- Proceeding without complete track analysis

**Master Rule:** Track stacking wins. Find ideas that hit multiple tracks convincingly.
