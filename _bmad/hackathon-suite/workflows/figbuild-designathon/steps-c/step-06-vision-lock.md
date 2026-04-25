---
name: 'step-06-vision-lock'
description: 'Synthesize all 5 locked sentences into vision.md'

nextStepFile: './step-06b-competition-frame.md'
outputLocation: '{output_location}'
---

# Step 6: Vision Lock

## STEP GOAL:

Combine the 5 locked sentences into a unified vision statement. Write vision.md. Read it aloud. If it doesn't give chills, rewrite.

## MANDATORY EXECUTION RULES (READ FIRST):

- This is a SYNTHESIS step, not a yap step
- The facilitator proposes the synthesis, team validates
- The vision statement must work as: an elevator pitch, a design north star, AND the emotional hook of the presentation
- Do NOT water down the locked sentences — they were hard-won

## MANDATORY SEQUENCE

### 1. Assemble the 5 Sentences

"**Vision synthesis.**

Here are your 5 locked sentences:

1. **Reference point:** [sentence]
2. **Inputs:** [sentence]
3. **Form:** [sentence]
4. **Timing:** [sentence]
5. **Core interaction:** [sentence]"

### 2. Propose Vision Statement

Combine into a single paragraph (4-6 sentences max) that reads as a cohesive vision. It should:
- Open with the world (why this matters now)
- Name the sense (divergence)
- Describe what happens (the experience)
- End with the feeling (what changes)

"**Proposed vision statement:**

[Write the paragraph]

**Read this aloud. Does it give you chills? If not, what's missing?**"

### 3. Iterate Until It Hits

If the team says "not quite":
- Ask what's missing
- Ask what word feels wrong
- Ask what emotion is absent
- Rewrite and re-read

Repeat until the team says yes.

### 4. Write vision.md

Create `{outputLocation}/vision.md`:

```markdown
# Vision — FigBuild 2026

## The Vision Statement

[The locked paragraph]

## The 5 Pillars

### Reference Point
[locked sentence]

### Inputs
[locked sentence]

### Form
[locked sentence]

### Timing
[locked sentence]

### Core Interaction
[locked sentence]

## Key Analogies
1. Chess — 1-in-10,000 move that won the game
2. Left-handed fighters — evolutionary advantage of going opposite
3. Vanilla vs. durian — as average gets perfect, divergence becomes precious
4. Uber's path — wildly different trajectory, same destination

## Anti-Patterns
[Copy from concept-seed.md]
```

### 5. Transition to Story

"**Vision locked and saved.**

You can see the product now. You can FEEL it.

Next phase: build the story. The 5-beat narrative that becomes your design brief, your presentation, your demo script, and your DevPost description. One artifact, four uses.

Ready?"

### 6. Proceed

Load, read entire file, then execute `{nextStepFile}`.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:
- All 5 sentences preserved in the synthesis
- Vision statement reads as cohesive, not a list
- Team says "yes, that's it" or "chills"
- vision.md written and saved
- Could pitch this vision in 30 seconds and have someone lean forward

### FAILURE:
- Vision statement is generic or vague
- Lost the specificity of the locked sentences
- Team says "it's fine" (fine = not good enough)
- Reads like a feature description instead of a feeling

**Master Rule:** "Fine" is not done. "Chills" is done.
