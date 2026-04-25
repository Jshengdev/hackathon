---
name: 'step-04-team'
description: 'Capture team skills, energy levels, preferences'

nextStepFile: './step-05-constraints.md'
outputLocation: '{output_location}'
team_size: '{team_size}'
---

# Step 4: Team Profile

## STEP GOAL:

Understand team capabilities, energy levels, and working preferences.

## MANDATORY SEQUENCE

### 1. Prompt for Team Info

"**Step 3: Team**

Tell me about your team ({team_size} people):
- Names and roles
- Technical skills (what can each person build?)
- Energy levels right now (fresh? tired?)
- Working preferences (wants to code? design? pitch?)
- Previous hackathon experience

Be honest about energy and preferences—this affects scope."

### 2. Accept Team Information

Gather for each team member:
- Name
- Primary skills
- Secondary skills
- Current energy (1-5)
- Preference (what they WANT to work on)
- Hackathon experience level

### 3. Write Team File

Create: `{outputLocation}/context/team.md`

```markdown
# Team Profile

## Team Members

| Name | Primary Skills | Secondary Skills | Energy (1-5) | Wants To | Experience |
|------|----------------|------------------|--------------|----------|------------|
| [Name] | [e.g., Python, ML] | [e.g., Hardware] | 4 | Code backend | 3 hackathons |
| [Name] | [e.g., React, Design] | [e.g., Pitch] | 5 | Design UI | First time |

## Team Strengths
- [What this team is good at]
- [Unique capabilities]

## Team Constraints
- [What this team can't/won't do]
- [Energy considerations]

## Division of Labor Strategy
[Suggested split based on preferences and skills]

## Notes
[Any other team dynamics]
```

### 4. Brief Confirmation

"**✓ Team profile captured**

Now let's talk constraints..."

### 5. Auto-Proceed

Load, read entire file, then execute `{nextStepFile}`.

---

**Master Rule:** Honest assessment. Energy and preference matter as much as skill.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Honest team assessment captured
- Energy levels and preferences documented
- Team file written with complete profile
- Division of labor strategy identified
- Ready for constraints gathering

### ❌ SYSTEM FAILURE:

- Sugarcoating energy levels or skills
- Ignoring preferences (leads to unmotivated team)
- Missing team dynamics or constraints
- Unrealistic capability assessment

**Master Rule:** Honest assessment. Energy and preference matter as much as skill.
