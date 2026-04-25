# Hackathon Suite Library

**Purpose:** Central knowledge repository for hackathon wisdom, patterns, and winning strategies.

---

## What's In The Library

The library contains curated content across 8 categories:

### 1. **past-winners/** — Case Studies of Winning Projects
Real examples of projects that placed top 3 at hackathons. Each includes:
- What they built
- Why it won
- The Gap moment
- Technical approach
- Track fit strategy
- Presentation insights

**Use when:** You need inspiration, want to see what actually wins, studying patterns

### 2. **track-examples/** — Examples by Track Type
Organized by common track types (social impact, AI/ML, sustainability, hardware, fintech, etc.)
- Track-specific winning patterns
- What judges in each track care about
- Technical approaches that work well
- Common mistakes in each track

**Use when:** Targeting specific tracks, understanding track criteria, track-stacking analysis

### 3. **sponsor-insights/** — What Sponsors Actually Reward
Real insights from sponsor conversations and past judging:
- What they SAY vs what they ACTUALLY want
- Hidden priorities
- Required technologies
- API usage patterns
- Bonus prize criteria

**Use when:** Analyzing sponsors, planning track strategy, API selection

### 4. **ideation-prompts/** — Proven Ideation Techniques
Structured prompts and frameworks for idea generation:
- Moonshot prompts
- Cross-pollination techniques
- Problem reframing exercises
- "What if" scenarios
- Provocation techniques

**Use when:** Brainstorming, stuck on ideas, need creative spark

### 5. **pitch-examples/** — Successful Pitch Decks and Scripts
Real pitch decks and demo scripts from winners:
- Slide structures that work
- Hook examples
- Problem framing techniques
- Demo flow patterns
- Closing statements

**Use when:** Creating pitch deck, preparing demo, structuring presentation

### 6. **demo-scripts/** — Demo Flow Examples
Step-by-step demo walkthroughs:
- Setup and framing
- The one demo case
- Wow moment timing
- Handling questions
- Backup plans

**Use when:** Planning demo, practicing presentation, optimizing flow

### 7. **technical-patterns/** — Implementation Patterns That Work
Proven technical approaches:
- Tech stack combinations
- API integration patterns
- MVP scoping strategies
- "Demo once = shipped" implementations
- Quick-win architectures

**Use when:** Planning implementation, choosing tech stack, scoping MVP

### 8. **antipatterns/** — What NOT to Do
Common mistakes and how to avoid them:
- Overscoping disasters
- Bad track positioning
- Poor demo structures
- Technical rabbit holes
- Time management failures

**Use when:** Validating decisions, avoiding mistakes, learning from failures

---

## How to Use the Library

### Browsing
1. Navigate to category directories
2. Read README.md in each for overview
3. Browse files in that category
4. Each file has metadata and tags for filtering

### Searching
Use the Librarian agent:
```bash
/bmad:hackathon-suite:librarian
```

Ask questions like:
- "Find examples of social impact projects"
- "What sponsor insights do we have for OpenAI?"
- "Show me antipatterns about overscoping"
- "I'm working on an AI + sustainability project. What's relevant?"

### Adding Content
Use the Librarian agent:
```bash
/bmad:hackathon-suite:librarian
```

Say:
- "Add this to the library" (agent will guide you)
- "Save this as a past winner example"
- "Add this sponsor insight to the library"

The Librarian will:
- Ask for category, tags, metadata
- Format content properly
- Add to correct location
- Update indices
- Enable searching

---

## Library Standards

### Every file includes:
```markdown
---
title: Clear, descriptive title
category: primary category
tags: [tag1, tag2, tag3]
date_added: YYYY-MM-DD
source: Hackathon name or URL
---

# Title

## Quick Summary
[2-3 sentences]

## Key Insights
- Bullet points

## Content
[Main content]

## Takeaways
- Actionable items

## Related Content
- Links to other library items
```

### File naming:
```
[category]/[source]-[brief-title].md

Examples:
past-winners/treehacks2025-climate-ai.md
sponsor-insights/openai-judge-priorities.md
antipatterns/overscoping-mvp.md
```

---

## Library Indices

### Master Index
`_index/master-index.md` - Complete inventory of all library content

### Category Indices
Each category has its own index linking to all items in that category

### Tag Indices
`_index/by-tag.md` - Content organized by tags for cross-category discovery

### Recent Additions
`_index/recent.md` - What's new in the library

---

## Library Growth Strategy

**The library gets better with each hackathon:**

**After each hackathon, add:**
1. Your winning idea (if you won) → past-winners/
2. Sponsor insights you gathered → sponsor-insights/
3. What worked / what didn't → technical-patterns/ or antipatterns/
4. Your pitch deck (if it succeeded) → pitch-examples/
5. Your demo script → demo-scripts/

**When you discover patterns:**
- New ideation techniques → ideation-prompts/
- Track-specific insights → track-examples/
- Sponsor preference patterns → sponsor-insights/

**When you learn lessons:**
- Mistakes to avoid → antipatterns/
- What worked unexpectedly → technical-patterns/

---

## Current Library Status

**Content Count:**
- Past Winners: [Run librarian to see stats]
- Track Examples: [Run librarian to see stats]
- Sponsor Insights: [Run librarian to see stats]
- Ideation Prompts: [Run librarian to see stats]
- Pitch Examples: [Run librarian to see stats]
- Demo Scripts: [Run librarian to see stats]
- Technical Patterns: [Run librarian to see stats]
- Antipatterns: [Run librarian to see stats]

**To see current stats:**
```bash
/bmad:hackathon-suite:librarian
```
Then ask: "Show me library stats"

---

## Quick Start

**First time using the library?**

1. **Browse past-winners/** to see what wins
2. **Read antipatterns/** to avoid common mistakes
3. **Check sponsor-insights/** if targeting specific sponsors
4. **Use librarian agent** to search as needed

**Adding your first content?**

1. Invoke librarian: `/bmad:hackathon-suite:librarian`
2. Say: "Add this to the library"
3. Follow the prompts
4. Your content is now searchable

**Building a new project?**

1. Invoke librarian with context: "I'm building [X] for [Y] track"
2. Librarian surfaces relevant content
3. Review examples and patterns
4. Apply learnings to your project

---

## Philosophy

**The library embodies compound learning:**

Every hackathon teaches lessons. Most teams forget them by the next hack. This library captures those lessons, making each hackathon build on the last.

**Key principles:**
1. **Capture wins** → Learn from success
2. **Document failures** → Avoid repeating mistakes
3. **Pattern recognition** → Surface what actually works
4. **Context-aware** → Recommend based on your current work
5. **Growing system** → Better with each addition

---

## Maintenance

The Librarian agent handles:
- Adding new content with proper metadata
- Cleaning and standardizing formats
- Organizing and categorizing
- Generating and updating indices
- Surfacing relevant content
- Removing duplicates
- Archiving outdated content

**Run periodic maintenance:**
```bash
/bmad:hackathon-suite:librarian
```
Then say: "Clean up the library" or "Regenerate indices"

---

**Your knowledge base for winning hackathons. Grows with every hack. Available instantly.** 📚

_Library Index - Part of the Hackathon Suite by BMAD_
