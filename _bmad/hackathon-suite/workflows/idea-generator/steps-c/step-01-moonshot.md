---
name: 'step-01-moonshot'
description: 'Generate 15-20 IMPOSSIBLE ideas using moonshot prompts'

nextStepFile: './step-02-track-mapping.md'
outputLocation: '{output_location}'
moonshotPromptsFile: '../../../resources/moonshot-prompts.md'
---

# Step 1: Moonshot Dump

## STEP GOAL:

Generate 15-20 IMPOSSIBLE ideas without constraint. Think furthest, not hardest.

## MANDATORY SEQUENCE

### 1. Load Context and Resources

Read:
- `{outputLocation}/context.md`
- `{moonshotPromptsFile}`

Extract from context:
- Track list and priorities
- Team strengths
- Available resources (hardware, APIs)

### 2. Set Moonshot Mindset

"**🚀 MOONSHOT IDEATION MODE**

We're going to think IMPOSSIBLE first, then scale back.

**The rules:**
1. No self-censoring — wild ideas only
2. Start with "If I had 1000 engineers..."
3. Think 10 years in the future, build today
4. Weird combinations encouraged
5. Minimum 15 ideas, target 20

**Time box: 15 minutes**

Ready? Let's probe the dark."

### 3. Apply Curated Ideation Techniques

Use these methods (from moonshot-prompts.md):

**Dream Fusion Laboratory:**
- "What's the most IMPOSSIBLE idea for [Track X]?"
- "If unlimited compute/resources, what would you build?"

**What If Scenarios:**
- "What if sensors covered entire body?"
- "What if neural networks were physical circuits?"
- "What if you could see data flowing in real-time?"

**Provocation Technique:**
- "What's the dumbest idea that might actually work?"
- "How would aliens solve this problem?"

**Cross-Pollination:**
- "Hardware + AI + Social Impact = ?"
- "Take winning pattern from Track A, apply to Track B"

**Time Shifting:**
- "What does this look like in 10 years?"
- "What's impossible today but obvious tomorrow?"

### 4. Generate Ideas

For each prompt/technique, generate 2-3 ideas.

**Capture:**
- Idea name (punchy, memorable)
- Core concept (2-3 sentences)
- Which tracks it could target
- Why it's a moonshot

**No filtering yet. Just generate.**

### 5. Write Moonshot Ideas File

Create: `{outputLocation}/ideas/moonshot-ideas.md`

```markdown
# Moonshot Ideas

**Generated:** [timestamp]
**Total Ideas:** [count]

---

## Idea 1: [Punchy Name]

**Core Concept:**
[2-3 sentence description]

**Tracks:** [List potential tracks]

**Moonshot Factor:** [Why this is ambitious]

**Inspiration:** [Which prompt/technique generated this]

---

[Repeat for all ideas]
```

### 6. Confirm and Transition

"**✓ Moonshot phase complete: [N] ideas generated**

Now let's map these against tracks to find track-stacking champions..."

### 7. Auto-Proceed

Load, read entire file, then execute `{nextStepFile}`.

---

**Master Rule:** No constraint. No judgment. IMPOSSIBLE first. Filter later.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- 15-20 IMPOSSIBLE ideas generated
- No self-censoring or premature filtering
- Moonshot ideas file written
- Each idea has: name, concept, tracks, moonshot factor
- Ready for track mapping

### ❌ SYSTEM FAILURE:

- Generating "realistic" ideas too early
- Self-censoring or filtering during generation
- Less than 15 ideas
- Missing moonshot factor (just normal ideas)
- Skipping ideation techniques

**Master Rule:** No constraint. No judgment. IMPOSSIBLE first. Filter later.
