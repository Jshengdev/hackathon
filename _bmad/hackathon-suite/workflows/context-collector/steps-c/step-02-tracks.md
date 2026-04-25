---
name: 'step-02-tracks'
description: 'Collect and analyze track descriptions'

nextStepFile: './step-03-sponsors.md'
outputLocation: '{output_location}'
---

# Step 2: Track Collection

## STEP GOAL:

Gather all hackathon track descriptions and analyze what judges ACTUALLY want.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER skip track analysis
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- 📋 YOU ARE A FACILITATOR extracting hidden priorities
- ✅ Accept chaotic input, produce structured output

### Role Reinforcement:

- ✅ You are the Context Specialist analyzing tracks
- ✅ Your job is to read between the lines
- ✅ Find what sponsors ACTUALLY want vs what they say
- ✅ Identify track-stacking opportunities

### Step-Specific Rules:

- 🎯 Focus ONLY on track collection and analysis
- 🚫 FORBIDDEN to skip consolidation step (that's step 7)
- 💬 YAP MODE: Accept any format they provide
- 📋 Extract hidden priorities from every track

## EXECUTION PROTOCOLS:

- 🎯 Accept tracks in any format (paste, bullets, photos)
- 💾 Write individual track analysis files
- 📖 Analyze official criteria AND hidden wants
- 🚫 FORBIDDEN to move to sponsors before tracks are complete

## CONTEXT BOUNDARIES:

- Input: Raw track descriptions from hackathon
- Output: Individual track analysis files
- Available: Track names, criteria, prizes, sponsors
- Focus: What judges ACTUALLY reward
- Dependencies: None - this is step 2

## MANDATORY SEQUENCE

### 1. Prompt for Tracks

"**Step 1: Tracks**

Paste ALL the track descriptions from the hackathon. Include:
- Track names
- Judging criteria
- Prize amounts
- Sponsor names
- Any special requirements

You can paste them all at once or one at a time. I'll organize them."

### 2. Accept Track Information

**YAP MODE ACTIVATED**

Accept whatever format they provide:
- Copy-pasted website text
- Bullet lists
- Multiple tracks in one message
- Photos of slides (if Read tool supports)

### 3. Extract and Analyze

For each track, extract:
- Track name
- Sponsor
- Official judging criteria
- Prize value/structure
- Special requirements

**Then analyze:**
- What do they ACTUALLY want? (read between lines)
- What's the hidden priority? (sustainability? innovation? business viability?)
- Competition level (how many will submit here?)
- Wow factor potential

### 4. Write Track Files

For each track, write: `{outputLocation}/context/tracks/{track-name}.md`

```markdown
# Track: [Name]

**Sponsor:** [Company/Organization]
**Prize:** [Amount/Description]

## Official Criteria
- [Criterion 1]
- [Criterion 2]

## What They ACTUALLY Want
[Read-between-the-lines analysis]

## Hidden Priorities
- [e.g., "Mentions 'social good' 3 times → they want impact story"]
- [e.g., "Sponsored by hardware company → physical demo scores higher"]

## Competition Level
[High/Medium/Low + reasoning]

## Wow Factor Potential
[How much room for moonshot thinking?]

## Notes
[Any other insights]
```

### 5. Confirm and Continue

"**✓ Tracks captured:** [count]

I've analyzed what each track is really looking for. We'll identify track-stacking opportunities in the consolidation step."

### 6. Auto-Proceed

Load, read entire file, then execute `{nextStepFile}`.

---

**Master Rule:** Read between the lines. What do sponsors ACTUALLY reward?

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- All tracks collected and analyzed
- Individual track files written to {outputLocation}/context/tracks/
- Hidden priorities identified for each track
- Track-stacking potential noted
- Ready to proceed to sponsors

### ❌ SYSTEM FAILURE:

- Skipping tracks or accepting incomplete data
- Not analyzing what sponsors ACTUALLY want
- Missing track-stacking opportunities
- Not writing individual track files
- Proceeding without complete track context

**Master Rule:** Read between the lines. What do sponsors ACTUALLY reward?
