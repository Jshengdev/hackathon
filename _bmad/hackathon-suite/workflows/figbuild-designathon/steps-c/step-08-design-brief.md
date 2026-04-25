---
name: 'step-08-design-brief'
description: 'Translate story beats into design workstreams and assignments'

nextStepFile: './step-09-package-ship.md'
outputLocation: '{output_location}'
storyFile: '{output_location}/story.md'
visionFile: '{output_location}/vision.md'
---

# Step 8: Design Brief

## STEP GOAL:

Translate the 5-beat story into concrete design workstreams. Each story beat becomes a design assignment. Each team member knows exactly what they're building and why.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- Load story.md and vision.md first
- This is TRANSLATION, not invention — every design decision comes from the story
- The team should feel like "of course that's what it looks like" — the design is obvious because the story is deep

### Step-Specific Rules:

- Map each beat to specific Figma work
- Assign by team role (Teri = core design, Kaitlyn = experience + illustration, Johnny = AI pipeline + assets)
- Include Figma Make credit strategy
- Set build checkpoints

## CONTEXT BOUNDARIES:

- Input: Locked story.md, vision.md
- Output: design-brief.md with assignments and checkpoints
- Dependencies: Steps 6-7 complete

## MANDATORY SEQUENCE

### 1. Load Story + Vision

Read `{storyFile}` and `{visionFile}` completely.

### 2. Frame the Translation

"**Phase 4: Design Brief**

The story is your design spec. Every screen is a story beat. Every interaction is a narrative moment. You're not inventing — you're translating.

Let's map each beat to what gets built in Figma."

### 3. Map Beats to Design

For each beat, define:

**Beat 1 (The World) -> Design:**
- Mood, tone, visual language direction
- Color palette implications
- Typography direction
- Opening frames of Figma Slides

**Beat 2 (The Person) -> Design:**
- The entry screen / first frame
- How the person is represented
- Emotional context setting
- Scene illustration (Kaitlyn)

**Beat 3 (The Encounter) -> Design:**
- THE hero screen — the vector visualization
- The core UI of the tool
- The interactive prototype moment
- This is the signature design challenge

**Beat 4 (The Shift) -> Design:**
- The emotional payoff screen
- Before/after or transformation visual
- The "I see myself" moment
- Animation or transition design

**Beat 5 (The Vision) -> Design:**
- Scale visualization
- Closing frame
- The "imagine if..." shot
- Leave judges wanting more

### 4. Assign Workstreams

"**Workstream assignments:**

**Teri — Vision + Core Design**
- Visual language system (from Beat 1 mood)
- The vector visualization (Beat 3 — this is THE design challenge)
- Core frames mapped to all 5 beats
- Prototype interactions in Figma
- Owns craft and intentionality across everything

**Kaitlyn — Experience + Illustration**
- Character/person illustration for Beat 2 (her hand-drawn vector style)
- Storyboard frames for the narrative arc
- Micro-moments of emotion and delight
- UX details that make interactions feel like discovery
- The human texture AI can't produce

**Johnny — AI Pipeline + Assets**
- Figma Make prompts (pre-written from story beats, specific and credit-efficient)
- Generated assets: vector space backgrounds, data viz elements, textures
- Copy and microcopy adapted from story.md
- Claude <> Figma MCP support for design iteration
- Research pulls or reference imagery as needed"

### 5. Figma Make Credit Strategy

"**Credit plan (9000 total across 3 accounts):**

| Phase | Credits | Use For |
|-------|---------|---------|
| Exploration | ~900 (10%) | Quick concept tests after direction is locked |
| Core Build | ~4500 (50%) | Main screens, vector viz, layouts from story scenes |
| Assets | ~1800 (20%) | Illustrations, backgrounds, data viz elements |
| Polish | ~1800 (20%) | Final refinements, consistency, presentation slides |

**Rules:**
- Pre-write ALL prompts in a doc before entering Make
- Be specific from first prompt (saves 3-4 follow-up iterations)
- Use Make for generation, Figma Design for craft
- Point-and-edit for small changes (cheaper than re-prompting)
- New files for distinct sections (context degrades at scale)"

### 6. Build Checkpoints

"**Checkpoints:**

- **Saturday night:** Core frames roughed in, mapped to 5 beats. Visual language direction set.
- **Sunday morning:** Vector visualization (Beat 3) designed. Core interaction prototyped.
- **Sunday afternoon:** Illustration integrated. Visual polish pass. All 5 beats have frames.
- **Sunday evening:** Prototype LOCKED. Move to presentation packaging.

**If behind schedule:** Cut scope on Beats 1 and 5 (context + vision slides). Protect Beat 3 (the hero moment) and Beat 4 (the emotional payoff) at all costs."

### 7. Write Design Brief

Save to `{outputLocation}/design-brief.md`:

```markdown
# Design Brief — FigBuild 2026

## Vision
[Copy vision statement from vision.md]

## Beat-to-Design Mapping
[All 5 beat mappings]

## Workstream Assignments
### Teri
[assignments]

### Kaitlyn
[assignments]

### Johnny
[assignments]

## Figma Make Credit Plan
[credit table]

## Build Checkpoints
[checkpoint list]

## Scope Protection
If behind: protect Beat 3 (hero) and Beat 4 (shift). Cut Beats 1 and 5.

## Anti-Patterns (Posted in Figma)
[Copy anti-patterns list]
```

### 8. Confirm and Proceed

"**Design brief locked. Everyone knows what they're building and why.**

Every screen traces back to a story beat. Every interaction traces back to the vision. The concept did the work — the design is just making it visible.

Final step: packaging and shipping. Ready?"

Load, read entire file, then execute `{nextStepFile}`.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:
- Every design assignment traces to a story beat
- Team members know exactly what they're building
- Credit strategy is specific and budgeted
- Checkpoints are realistic for the timeline
- Scope protection prioritizes the hero moment

### FAILURE:
- Design assignments are vague ("make it look good")
- Disconnected from story beats
- No credit strategy (will burn Make credits randomly)
- Unrealistic checkpoints
- No scope protection plan

**Master Rule:** The design brief is the story wearing Figma clothes. If you can't trace a screen back to a beat, it doesn't belong.
