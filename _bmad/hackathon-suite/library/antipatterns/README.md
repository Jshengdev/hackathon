# Antipatterns

**Common mistakes teams make at hackathons — and how to avoid them.**

## What You'll Find Here

Each antipattern documents:
- **The Mistake** — What teams do wrong
- **Why It Happens** — The thinking that leads here
- **The Cost** — What you lose (time, placement, etc.)
- **How to Avoid** — Specific prevention strategies
- **Early Warning Signs** — How to catch yourself doing this
- **Recovery** — What to do if you're already in this trap

## Categories of Antipatterns

### Scoping Failures
- Overscoping ("Let's build everything!")
- Underscoping ("This is too simple")
- Feature creep mid-hack
- Not defining the one demo case

### Track & Positioning Mistakes
- Ignoring track criteria
- Track stretching ("We fit ALL 8 tracks!")
- Missing sponsor priorities
- Not track-stacking

### Technical Traps
- Perfect code over working demo
- Technology rabbit holes
- Dependency hell
- Premature optimization
- "Let me refactor this first"

### Ideation Failures
- Incremental thinking
- "Cool" but not "HOLY SHIT"
- Solving fake problems
- Ignoring The Gap

### Presentation Disasters
- No demo plan
- Slides explaining architecture
- Missing the wow moment
- Burying the lead
- Submitting at 11:59pm

### Team Dynamics
- No task division
- Skill overlap/gaps
- Communication breakdowns
- Energy management failures

## How to Use This Category

**During ideation:**
→ Check "Ideation Failures" to avoid weak ideas
→ Validate you're crossing The Gap

**During planning:**
→ Review "Scoping Failures" before committing
→ Check "Track & Positioning Mistakes"

**During implementation:**
→ Watch for "Technical Traps"
→ Monitor "Team Dynamics" issues

**Before demo:**
→ Review "Presentation Disasters"
→ Ensure you have the one demo case

## Adding Content

To document a new antipattern:

```bash
/bmad:hackathon-suite:librarian
```

Say: "Add an antipattern"

The Librarian will ask for:
- Antipattern name
- Category (scoping, technical, ideation, etc.)
- Real example or scenario
- Tags
- Prevention strategies

## Template

```markdown
---
title: [Antipattern Name]
category: antipatterns
tags: [scoping, technical, ideation, presentation, team]
date_added: YYYY-MM-DD
severity: [high, medium, low]
frequency: [very-common, common, occasional]
---

# Antipattern: [Name]

## Quick Summary
[2-3 sentences: What this antipattern is]

## The Mistake

**What teams do:**
[Description of the antipattern behavior]

**Example scenario:**
"[Real example of how this plays out]"

## Why It Happens

**The thinking:**
- "[Reasoning 1]"
- "[Reasoning 2]"

**When it occurs:**
- [Phase of hackathon]
- [Context that triggers it]

## The Cost

**What you lose:**
- **Time:** [How much time wasted]
- **Placement:** [Impact on winning potential]
- **Morale:** [Team impact]
- **Demo quality:** [Impact on presentation]

**Real examples:**
- "Team X spent 6 hours on auth instead of core feature - didn't place"
- "Team Y built 3 half-working features instead of 1 working demo - judges confused"

## Early Warning Signs

**You're in this antipattern if:**
- [ ] [Warning sign 1]
- [ ] [Warning sign 2]
- [ ] [Warning sign 3]

**Check yourself:**
- [Question to ask]
- [Metric to check]

## How to Avoid

**Prevention strategies:**

1. **[Strategy 1]**
   - [Specific action]
   - [When to do it]

2. **[Strategy 2]**
   - [Specific action]
   - [When to do it]

**Workflow integration:**
- [Which workflow prevents this]
- [When to run it]

## Recovery (If You're Already Here)

**Stop and assess:**
1. [First step to take]
2. [What to cut]
3. [How to reorient]

**Time-based recovery:**
- **If you have 6+ hours left:** [Recovery plan]
- **If you have 2-4 hours left:** [Triage plan]
- **If you have < 2 hours:** [Emergency plan]

## Related Antipatterns
- [Similar mistake]
- [Often occurs with]

## Corrective Patterns
- [Link to technical-patterns that fix this]
- [Link to workflow that prevents this]

## Key Insights
- [Why this is so common]
- [Deep reason this happens]
- [Pattern across teams]

## Takeaways
- [Prevention rule 1]
- [Prevention rule 2]
- [When to course-correct]

---
*Severity: [high/medium/low]*
*Frequency: [very-common/common/occasional]*
*Added to library: [date]*
```

## Common Antipatterns

[Run librarian to see full list]

**Top offenders:**
1. Overscoping the MVP
2. "Cool" project that doesn't cross The Gap
3. No demo plan / buried the wow moment
4. Ignoring sponsor priorities
5. Submitting at the last minute

```bash
/bmad:hackathon-suite:librarian
```
Ask: "Show me the most common antipatterns"

---

_Antipatterns Collection - Learn from others' mistakes before making them yourself_ ⚠️
