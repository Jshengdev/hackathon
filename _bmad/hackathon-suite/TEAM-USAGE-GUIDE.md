# Hackathon Suite - Realistic Team Usage Guide

**For: 4-person teams at hackathons**
**Reality check: What's actually worth your time**

---

## The Brutal Truth

**This system is comprehensive. Maybe TOO comprehensive for a first-time use.**

Here's what you need to know:
- Some workflows are overkill for teams
- Some are essential
- Some make sense solo, not with 4 people
- The library won't help until hackathon #2+

**This guide tells you what to actually use.**

---

## Team Dynamics Reality

**With 4 people, you typically have:**
- 1 person who drives strategy/planning (probably you)
- 2-3 people who just want to code
- Maybe 1 person handling design/pitch

**Not everyone will use workflows. That's fine.**

**The key: One person (strategy lead) uses the system to guide the team.**

---

## Three Usage Levels

### Level 1: Minimum Viable Workflow (2 hours investment)
**For: First hackathon with the suite, or time-constrained teams**

**What to use:**
1. **Field Guide** (you + 1 other person) - 90 min
   - One person reads it before hackathon
   - Both do sponsor table crawl together
   - Take notes on phones/notebook

2. **Quick brainstorm** (whole team) - 30 min
   - Skip formal workflows
   - Use "The Gap" as mental filter
   - Ask: "Is this HOLY SHIT or just cool?"

**Skip:**
- ❌ context-collector workflow (too formal for team setting)
- ❌ idea-generator workflow (too structured, team prefers organic)
- ❌ All other workflows
- ❌ Agents (you're the orchestrator)
- ❌ Library (nothing in it yet)

**ROI: High**
- Field Guide gives you edge in context gathering
- The Gap filter prevents weak ideas
- Time: 2 hours
- Value: Avoid common mistakes, better context

**When this works:**
- Experienced team that moves fast
- Team prefers loose coordination
- You trust your team's instincts

### Level 2: Strategic Workflow Usage (4-5 hours investment)
**For: Team that wants structure but not overkill**

**What to use:**

**Pre-hackathon (30 min):**
- Strategy lead reads Field Guide
- Team reads Quick Reference Checklist
- Everyone knows the 6 questions for sponsor tables

**At Hackathon:**

**Hour 0-1.5: Context Gathering (solo or pair)**
- One or two people do sponsor table crawl
- Use Field Guide questions
- Take structured notes (track names, sponsor priorities, The Gap signals)
- **Don't run workflow yet** - just capture raw notes

**Hour 1.5-2: Team Alignment (30 min)**
- Share context with team verbally
- Brainstorm 5-10 ideas (loose, not formal workflow)
- Apply The Gap filter together
- Select idea as a team
- **Judge validation:** Strategy lead asks: "Would a judge lean forward?" If unsure, discuss

**Hour 2-3: Planning (30 min)**
- **Use prd-splitter workflow** (this one is valuable for teams)
  - Splits work into parallel branches
  - Each person knows their scope
  - Clear integration points
  - Prevents overlap/gaps

**Hour 3-7: Build**
- Team codes their branches
- **Use close-session if taking long breaks** (optional)
- **Use sync-session when resuming** (optional)

**Hour 7-8: Demo prep**
- Skip synthesizer workflow
- Manually integrate branches
- Team creates pitch together

**Skip:**
- ❌ Full context-collector (too time-consuming for team)
- ❌ Full idea-generator (team brainstorm is faster)
- ❌ pitch-deck-gen (team creates together)
- ❌ Agents (except maybe judge for idea validation)
- ❌ Library (use after hackathon to document learnings)

**ROI: Very High**
- Field Guide: 90 min → Better context than 90% of teams
- prd-splitter: 20 min → Parallel work, clear integration
- Session management: 10 min → Maintains momentum across breaks
- Total time: 4-5 hours
- Value: Better ideas, efficient execution

**When this works:**
- Team wants some structure
- You're the strategy lead who can run workflows
- Team trusts you to guide them

### Level 3: Full System Usage (8-10 hours investment)
**For: Solo participants or teams that LOVE process**

**Use everything:**
- All workflows in sequence
- All agents for validation
- Library for future hackathons
- Full documentation

**ROI: Variable**
- High for solo participants (no coordination overhead)
- High for teams that are process-oriented
- Low for teams that prefer speed over structure

**When this works:**
- Solo hackathon participation
- Team that values systematic approach
- Team where everyone buys into the system

---

## Recommended: Level 2 for 4-Person Teams

**Here's the realistic flow:**

### Before Hackathon (30 min)

**Strategy lead (you):**
- Read Field Guide completely
- Understand The Gap concept
- Know the 6 sponsor questions
- Brief team on the approach

**Whole team (15 min meeting):**
- Everyone reads Quick Reference Checklist
- Assign roles:
  - Context gatherers (1-2 people)
  - Builders (2-3 people)
  - Pitch lead (1 person)
- Agree on communication (Slack, Discord, etc.)

### At The Hackathon

**Hour 0-1.5: Context Phase (1-2 people)**

**Context gatherers:**
- Use Field Guide
- Visit sponsor tables with the 6 questions
- Take structured notes:
  - Track names + criteria
  - Sponsor priorities (official vs hidden)
  - The Gap signals
  - APIs/tech required
- Share notes in team channel as you go

**Builders (during context phase):**
- Set up dev environment
- Review hackathon tech/APIs
- Explore what's possible
- DON'T start coding yet

**Hour 1.5-2.5: Alignment Phase (whole team, 60 min)**

**Regroup location:** Find quiet spot

**Context share (15 min):**
- Context gatherers present findings
- Highlight: best tracks, sponsor priorities, constraints

**Idea brainstorm (30 min):**
- Everyone throws out 3-5 ideas
- No filtering yet (moonshot thinking)
- Capture all ideas

**Gap filter (15 min):**
- For each idea, ask: "Is this HOLY SHIT or cool?"
- Would judges lean forward?
- Does it cross The Gap?
- Eliminate "cool" ideas

**Selection:**
- Pick top 1-2 ideas
- Quick feasibility check: Can we build this in time?
- Team vote if tied
- **Commit to one idea**

**Hour 2.5-3: Planning Phase (30 min)**

**Run prd-splitter workflow (strategy lead):**

Open terminal:
```bash
/bmad:hackathon-suite:prd-splitter
```

Input:
- The selected idea
- Team skills
- Time available
- Track targets

Output:
- Branch A: [Person 1 + 2 work on X]
- Branch B: [Person 3 works on Y]
- Branch C: [Person 4 works on Z]
- Integration plan: How branches connect
- The ONE demo case: Exactly what you'll show

**Distribute branches:**
- Each person/pair gets their branch doc
- Everyone understands integration points
- Everyone knows the ONE demo case
- Set integration checkpoints (Hour 5, Hour 6)

**Hour 3-7: Build Phase (parallel work)**

**Everyone codes their branch**

**Integration checkpoints:**
- Hour 5: Quick standup (5 min)
  - What's working?
  - Any blockers?
  - On track?
- Hour 6: Integration test
  - Connect the branches
  - Test the ONE demo case
  - Identify issues

**If taking breaks:**
```bash
/bmad:hackathon-suite:close-session
```
(Captures state, helps resume later)

**When resuming:**
```bash
/bmad:hackathon-suite:sync-session
```
(Quick summary of where you left off)

**Hour 7-8: Demo Phase (whole team)**

**Manual integration (30 min):**
- Merge branches
- Get ONE demo case working end-to-end
- Hardcode everything else

**Pitch creation (20 min):**
- Problem statement
- Solution (the wow moment)
- Demo script
- Moonshot vision

**Practice (10 min):**
- Run through demo twice
- Time it (keep under 3 min)
- Identify who presents what

**Submit to Devpost early:**
- Don't wait until deadline
- Submit rough draft at Hour 7
- Edit until deadline

### After The Hackathon (optional, 30 min)

**If you won or learned something valuable:**

```bash
/bmad:hackathon-suite:librarian
```

Add to library:
- "Add sponsor insights for [Company]" → What you learned
- "Add antipattern" → Mistakes you made or saw
- "Add past winner" → If you won

**Why:** Next hackathon, you'll have searchable lessons

---

## What Each Workflow Actually Does (Realistic Time)

| Workflow | Real Time | Team Value | Solo Value | Skip If... |
|----------|-----------|------------|------------|------------|
| **context-collector** | 30-45 min | Low (too slow) | High | Team prefers manual notes |
| **idea-generator** | 45 min | Low (team brainstorm faster) | High | Team is experienced |
| **prd-splitter** | 15-20 min | **VERY HIGH** | Medium | Solo or pair team |
| **pitch-deck-gen** | 15 min | Medium | High | Team creates pitch together |
| **win-validator** | 10 min | Medium | High | Confident in idea |
| **team-yap** | 10 min | Low (redundant) | N/A | Always skip for teams |
| **synthesizer** | 20 min | Low | Medium | Manual integration is faster |
| **adapter** | 15 min | Medium | High | Not pivoting mid-hack |
| **close-session** | 5 min | High | High | Not taking breaks |
| **sync-session** | 5 min | High | High | No context window issues |

---

## Critical Flaws to Know About

### Flaw 1: Workflows Assume Solo Work

**Problem:** Most workflows are designed for solo participants, not teams

**Example:** context-collector asks YOU questions step by step. With a team, one person runs it while others wait = inefficient.

**Fix:**
- Use workflows as templates, not rigid scripts
- One person captures context manually, shares with team
- OR: Run workflow solo, present results to team

### Flaw 2: Time Investment Front-Loaded

**Problem:** System requires 2-3 hours up front (context + ideation)

**Reality:** Teams want to start building quickly

**Fix:**
- Minimum viable: Field Guide + team brainstorm (90 min)
- Full system: Only if team buys in

### Flaw 3: Library Has No Content Initially

**Problem:** Library system won't help on hackathon #1

**Reality:** Only valuable after you add content from multiple hackathons

**Fix:**
- Skip library on first hackathon
- Add learnings after hackathon
- Use on hackathon #2+

### Flaw 4: Coordination Overhead

**Problem:** 4 people = 6 communication pairs = coordination tax

**Reality:** Loose coordination might be faster than tight process

**Fix:**
- Strategy lead runs system, guides team
- Team doesn't need to learn workflows
- Use only workflows that reduce coordination (prd-splitter)

### Flaw 5: Not Everyone Cares About Process

**Problem:** Some team members just want to code

**Reality:** That's fine. Don't force it.

**Fix:**
- Strategy lead uses system
- Presents key insights to team
- Team follows guidance without seeing the process

---

## Decision Tree: What Should You Actually Use?

### Question 1: Is this your first time at a hackathon with this team?

**YES:**
→ Use **Level 1** (Minimum Viable)
→ Field Guide + The Gap filter
→ Total time: 2 hours
→ Learn the dynamics first

**NO (you've worked together):**
→ Continue to Question 2

### Question 2: Does your team value structure and process?

**YES:**
→ Use **Level 2** (Strategic Workflow Usage)
→ Field Guide + prd-splitter + session management
→ Total time: 4-5 hours
→ Maximum ROI

**NO (team prefers loose coordination):**
→ Use **Level 1** (Minimum Viable)
→ You use Field Guide, guide team informally
→ Total time: 2 hours

### Question 3: Are you participating solo?

**YES:**
→ Use **Level 3** (Full System)
→ All workflows + agents + library
→ Total time: 8-10 hours
→ No coordination overhead, maximum value

**NO:**
→ See Questions 1-2

---

## Honest ROI Analysis

### What's Worth The Time

**HIGH ROI:**
1. **Field Guide** (90 min)
   - Cost: 90 minutes
   - Benefit: Better context than 90% of teams
   - Skip if: Very experienced, know the sponsors already

2. **The Gap filter** (5 min)
   - Cost: 5 minutes
   - Benefit: Prevents weak ideas
   - Skip if: Never

3. **prd-splitter** (20 min)
   - Cost: 20 minutes
   - Benefit: Clear parallel work, prevents overlap
   - Skip if: Solo or team of 2

4. **Session management** (5 min each)
   - Cost: 5 minutes per use
   - Benefit: Maintains momentum across breaks
   - Skip if: Not taking breaks, no context window issues

**MEDIUM ROI:**
5. **Hackathon Judge agent** (10 min)
   - Cost: 10 minutes
   - Benefit: Validates idea before building
   - Skip if: Very confident in idea

6. **pitch-deck-gen** (15 min)
   - Cost: 15 minutes
   - Benefit: Structured pitch deck
   - Skip if: Team creates pitch together organically

**LOW ROI (for teams):**
7. **Full context-collector** (45 min)
   - Cost: 45 minutes
   - Benefit: Structured context
   - Skip if: Manual notes + sharing is faster

8. **Full idea-generator** (45 min)
   - Cost: 45 minutes
   - Benefit: Systematic ideation
   - Skip if: Team brainstorm is faster and more energizing

9. **team-yap** (10 min)
   - Cost: 10 minutes
   - Benefit: Captures discussion
   - Skip if: Redundant with natural team discussion

10. **Library system** (0 min first hack, valuable later)
    - Cost: 0 on first use (empty)
    - Benefit: Compounds over multiple hackathons
    - Skip if: First hackathon, use after to document learnings

---

## Realistic First Hackathon Plan (4-Person Team)

### Pre-Hackathon

**You (strategy lead):**
- [ ] Read Field Guide (30 min)
- [ ] Understand The Gap (5 min)
- [ ] Know the 6 sponsor questions (5 min)

**Team meeting (15 min):**
- [ ] Brief team on Field Guide approach
- [ ] Share Quick Reference Checklist
- [ ] Assign: Who does sponsor tables? Who starts building?

### At Hackathon

**Hour 0-1.5:**
- [ ] You + 1 person: Sponsor table crawl (Field Guide questions)
- [ ] Others: Set up dev environment, explore tech

**Hour 1.5-2:**
- [ ] Team: Share context, brainstorm ideas
- [ ] Apply The Gap filter
- [ ] Select idea

**Hour 2-2.5:**
- [ ] You: Run prd-splitter workflow
- [ ] Team: Review branches, understand integration

**Hour 3-7:**
- [ ] Team: Build branches in parallel
- [ ] Hour 5: Quick standup
- [ ] Hour 6: Integration test

**Hour 7-8:**
- [ ] Team: Integrate, get ONE demo case working
- [ ] Create pitch together
- [ ] Submit to Devpost early
- [ ] Practice demo

### After Hackathon (optional)

**If you have time:**
- [ ] Document 2-3 learnings in library
- [ ] Add sponsor insights
- [ ] Note what worked/didn't

**Total time invested in system:** 3-4 hours
**Total hackathon time:** 8 hours
**Percentage on process:** 37-50%

**Is it worth it?**
- If you win or place: **YES**
- If you learn valuable lessons: **YES**
- If you just wanted to code and have fun: **MAYBE NOT**

---

## Red Flags That System Is Too Heavy

**Stop and simplify if:**
- Team is frustrated with process
- You're spending more time on workflows than building
- Context gathering takes > 2 hours
- Team ignores your guidance
- You miss building time because of system
- Demo suffers because of process overhead

**When this happens:**
- Drop to Level 1 (Field Guide only)
- Let team work loosely
- Use system as personal guide, not team mandate

---

## Green Flags That System Is Working

**Keep using it if:**
- Team appreciates the structured context
- prd-splitter helped clarify work division
- You avoided a common mistake (overscoping, weak idea)
- Sponsor conversations were more valuable than expected
- You're ahead of other teams in understanding context
- Demo is clearer because of the ONE demo case focus

---

## Final Recommendation for 4-Person Team

### First Hackathon Together:
**Use Level 1 (Minimum Viable)**
- Field Guide for context gathering
- The Gap filter for ideas
- Manual coordination
- Total investment: 2 hours
- Learn team dynamics

### Second Hackathon Together:
**Use Level 2 (Strategic Workflow Usage)**
- Field Guide + prd-splitter + session management
- Add learnings to library
- Total investment: 4-5 hours
- Leverage what you learned

### Third+ Hackathon:
**Customize based on what worked**
- Keep what added value
- Drop what didn't
- Library becomes valuable (past lessons searchable)
- System adapts to your team

---

## The Bottom Line

**This system is powerful but can be overkill.**

**Start light:**
- Use Field Guide (90 min) → Better context than most
- Use The Gap filter (5 min) → Better ideas than most
- Use prd-splitter (20 min) → Better coordination than most

**That's 115 minutes = 2 hours**
**For 90% of teams, that's the sweet spot.**

**Everything else?**
- Nice to have
- Use if time permits
- Use if team buys in
- Use if solo
- Use after multiple hackathons

**Don't let the system prevent building.**
**Don't let process override fun.**
**Use what helps. Skip what doesn't.**

---

**The system exists to help you win.**
**If it's not helping, use less of it.**
**There is no "correct" way to use this.**

**Start simple. Add complexity only if it pays off.**

🏆 Go win your way.
