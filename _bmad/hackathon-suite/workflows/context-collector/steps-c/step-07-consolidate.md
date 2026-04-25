---
name: 'step-07-consolidate'
description: 'Generate consolidated context.md with track-stacking analysis'

outputLocation: '{output_location}'
---

# Step 7: Consolidate Context

## STEP GOAL:

Generate the master context.md file with track-stacking opportunities identified.

## MANDATORY SEQUENCE

### 1. Load All Context Files

Read:
- All track files from `tracks/`
- All sponsor files from `sponsors/`
- Team file
- Constraints file
- All yap files

### 2. Identify Track-Stacking Opportunities

Analyze which track combinations:
- Share judging criteria (overlap = easier to hit both)
- Have complementary priorities (hardware + social impact)
- Create multiplicative wow factor
- Are feasible given team skills and constraints

**Generate table:**
| Combo | Tracks Hit | Difficulty (1-5) | Wow Potential (1-5) | Why It Works |
|-------|------------|------------------|---------------------|--------------|

### 3. Extract "What Judges Actually Want"

From all tracks, sponsors, and yaps, synthesize:
- Recurring themes (social impact mentioned 10 times?)
- Hidden priorities (all winners had hardware demos?)
- Memorable patterns (judges love X type of project)

### 4. Organize Yap Insights

Sort yap insights into:
- Track-specific insights
- General hackathon wisdom
- Technical curiosities
- Gut feelings worth keeping

### 5. Write Master Context File

Create: `{outputLocation}/context.md`

```markdown
# Hackathon Context

**Generated:** [timestamp]

---

## Event Profile
- Name: [event name]
- Duration: {default_duration} hours ([X] remaining)
- Vibe: [competitive/collaborative/learning]
- Submission deadline: [time]

---

## Team
[Import from team.md]

---

## Tracks Analysis

### [Track 1]
- **Sponsor:** [sponsor]
- **Official criteria:** [list]
- **What they ACTUALLY want:** [analysis]
- **Prize:** [amount]
- **Competition level:** [High/Med/Low]

[Repeat for all tracks]

---

## Track-Stacking Opportunities

**Recommended Combinations:**

| Combo | Tracks Hit | Difficulty | Wow Potential | Why It Works |
|-------|------------|------------|---------------|--------------|
| [Combo 1] | 3 | 3/5 | 5/5 | [Hardware + AI + Social Impact = judges love this] |
| [Combo 2] | 2 | 2/5 | 4/5 | [Sustainability + Sponsor tech = easy overlap] |

---

## Available Resources

**Hardware:**
- [List with availability]

**APIs:**
- [List with access status]

**Sponsor Tech:**
- [Special resources]

---

## Constraints

**Time:**
- [Remaining hours]
- [Deadlines]

**Real Limits:**
- [Unchangeable constraints]

**Team Capacity:**
- [Based on energy, skills, preferences]

---

## Win Conditions

**What makes judges say "this one":**

- [Pattern 1 from analysis]
- [Pattern 2 from analysis]
- [Hidden priority that keeps appearing]

**From yaps and overheard insights:**
- [Notable observation]
- [Gut feeling worth noting]

---

## Raw Insights

**Technical Curiosities:**
- [Interesting tech possibilities]

**Judge Observations:**
- [Patterns about what judges respond to]

**Past Winner Patterns:**
- [If available from research]

---

## Ideation Starting Points

Based on this context, strong starting directions:
1. [Direction 1 based on track stacking]
2. [Direction 2 based on team strengths]
3. [Direction 3 based on hidden judge priorities]

---

_Context collected by Context Collector workflow_
_Ready for Idea Generator workflow_
```

### 6. Present Completion

"**✓ Context Collection Complete**

---

**What I've created:**
- `context.md` — Master context file with everything
- `context/tracks/` — [N] individual track analyses
- `context/sponsors/` — [N] sponsor priority files
- `context/team.md` — Team profile
- `context/constraints.md` — Real vs perceived limits
- `context/yaps/` — [N] captured insights

**Key findings:**
- **Top track-stacking opportunity:** [Best combo]
- **Hidden judge priority:** [Most important insight]
- **Team sweet spot:** [What this team is best positioned to build]

---

**Next step:** Run the **idea-generator** workflow to turn this context into moonshot ideas.

Ready when you are!"

### 7. Workflow Complete

This is the final step. Context collection is done.

---

**Master Rule:** Synthesize everything. Surface the opportunities. Set up ideation for success.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Master context.md file created
- Track-stacking opportunities identified
- Hidden judge priorities surfaced
- All insights organized and synthesized
- Ideation starting points provided
- Context collection complete

### ❌ SYSTEM FAILURE:

- Missing track-stacking analysis
- Not surfacing hidden priorities
- Incomplete consolidation
- Missing "what judges actually want"
- Not providing clear starting points

**Master Rule:** Synthesize everything. Surface the opportunities. Set up ideation for success.
