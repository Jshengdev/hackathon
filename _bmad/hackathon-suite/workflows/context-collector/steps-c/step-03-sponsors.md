---
name: 'step-03-sponsors'
description: 'Identify sponsor priorities and what they actually want'

nextStepFile: './step-04-team.md'
outputLocation: '{output_location}'
---

# Step 3: Sponsor Analysis

## STEP GOAL:

Understand sponsor priorities beyond the official criteria.

## MANDATORY SEQUENCE

### 1. Prompt for Sponsor Info

"**Step 2: Sponsors & Prizes**

Tell me about the sponsors. Include:
- Company background (what they do)
- Any sponsor talks/presentations you attended
- Prize structure (overall winner, track winners, etc.)
- Sponsor tech/APIs available
- Any insights from talking to sponsor reps

What have you learned about what they care about?"

### 2. Accept Information

**YAP MODE** — Accept chaotic input:
- Overheard conversations
- Sponsor booth visits
- API documentation URLs
- Impressions and vibes

### 3. Extract Hidden Priorities

For each major sponsor, create: `{outputLocation}/context/sponsors/{sponsor}.md`

```markdown
# Sponsor: [Name]

**Company:** [What they do]
**Tracks Sponsored:** [List]
**Tech/APIs Provided:** [List]

## What They Care About
[Based on talks, booth conversations, track criteria]

## Hidden Signals
- [e.g., "Mentioned 'scale' 5 times → they want big vision"]
- [e.g., "Gave hardware to teams → they want physical demos"]

## How to Win Them Over
[Strategic insights]

## Available Resources
- APIs: [List with access info]
- Hardware: [What's available]
- Docs: [Links]

## Notes
[Anything else useful]
```

### 4. Brief Confirmation

"**✓ Sponsor analysis complete**

Moving to team information..."

### 5. Auto-Proceed

Load, read entire file, then execute `{nextStepFile}`.

---

**Master Rule:** Sponsors signal what they want through more than just official criteria.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Sponsor priorities extracted and documented
- Hidden signals identified from talks/conversations
- Individual sponsor files written
- Strategic insights captured
- Ready for team profiling

### ❌ SYSTEM FAILURE:

- Taking sponsors at face value (missing hidden priorities)
- Not capturing booth/talk insights
- Skipping sponsor analysis
- Missing "what they care about" analysis

**Master Rule:** Sponsors signal what they want through more than just official criteria.
