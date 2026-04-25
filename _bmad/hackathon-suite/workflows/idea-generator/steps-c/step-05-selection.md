---
name: 'step-05-selection'
description: 'Present top 3 ideas, user selects winner'

nextStepFile: './step-06-idea-document.md'
outputLocation: '{output_location}'
---

# Step 5: Selection

## STEP GOAL:

Present top 3 ideas with complete context. User selects the winner.

## MANDATORY SEQUENCE

### 1. Load All Analysis

Read:
- `{outputLocation}/ideas/gap-analysis.md`
- `{outputLocation}/ideas/feasibility-assessment.md`
- `{outputLocation}/ideas/scored-ideas.md`

### 2. Select Top 3 Candidates

Choose based on:
1. **Crossed The Gap** (Gap score 4-5)
2. **Definitely buildable** (or risky but possible)
3. **Track stacking** (hits 2-3+ tracks)

Rank by overall winning potential.

### 3. Present Top 3

For each idea, present:

"---

## Option [N]: [IDEA NAME]

**One-Liner:** [10 word hook]

**The Gap:** [Why this is HOLY SHIT not cool]

**Tracks:** [List with confidence scores]
- [Track 1]: [Why it fits] (5/5)
- [Track 2]: [Why it fits] (4/5)

**The One Demo Case:**
- Input: [Specific]
- Magic happens: [What you'll show]
- Output: [Impressive]

**Build Time:** [N] hours (we have [Y])
**Risk Level:** [LOW / MEDIUM]
**Team Excitement:** [Based on preferences]

**Why this wins:**
[Concise case for why this idea can win the hackathon]

---"

### 4. Prompt for Selection

"**Which idea do you want to build?**

Enter the number (1, 2, or 3) or tell me if you want to:
- **Combine** aspects of multiple ideas
- **Modify** one of these ideas
- **Go back** and pick a different idea from earlier analysis

Your choice?"

### 5. Accept Selection

**IF number selected:**
- Confirm selection
- Proceed to idea document generation

**IF wants to combine:**
- Discuss combination
- Create hybrid idea
- Proceed to idea document generation

**IF wants to modify:**
- Discuss modifications
- Update idea
- Proceed to idea document generation

**IF wants different idea:**
- Load earlier analysis
- Present alternatives
- Return to selection

### 6. Confirm Selection

"**✓ Idea selected: [IDEA NAME]**

Great choice. This crosses The Gap, hits [N] tracks, and you can build it.

Now I'll generate the complete idea document for the next workflow..."

### 7. Store Selection

Save selected idea details to memory for next step.

### 8. Auto-Proceed

Load, read entire file, then execute `{nextStepFile}`.

---

**Master Rule:** Make the choice easy. Present complete context. Trust their judgment.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Top 3 ideas presented with complete context
- User makes informed selection
- Selected idea ready for documentation
- Clear case for why this idea can win
- User confident in choice

### ❌ SYSTEM FAILURE:

- Presenting ideas without Gap/feasibility context
- Missing track-stacking information
- Not showing "why this wins"
- Proceeding without user selection
- Unclear presentation of options

**Master Rule:** Make the choice easy. Present complete context. Trust their judgment.
