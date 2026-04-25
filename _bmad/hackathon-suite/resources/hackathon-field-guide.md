# Hackathon Field Guide

**Purpose:** Maximize context gathering at the hackathon venue to fuel the context-collector workflow.

**Philosophy:** The first 60-90 minutes at a hackathon determine your winning potential. Context is gold. This guide tells you exactly what to capture and how.

---

## Pre-Hackathon Checklist

**Before You Leave Home:**
- [ ] Laptop + charger (test battery health)
- [ ] Phone + portable charger
- [ ] Notebook + pen (for quick notes when tables are crowded)
- [ ] Business cards (if you have them)
- [ ] GitHub/portfolio ready to show
- [ ] This field guide on your phone

**Mental Prep:**
- [ ] Read the hackathon website once more
- [ ] Check sponsor list
- [ ] Review past winners if available
- [ ] Set phone reminder: "Run /bmad:hackathon-suite:context-collector" for 90 min after arrival

---

## Hour 0: Arrival & Setup (15 min)

**Objective:** Claim space, settle in, then GO HUNTING.

### Do This First:
1. **Find your table/seat**
2. **Set up laptop** (but don't start coding!)
3. **Meet your immediate neighbors** (5 min max)
   - "Hey, I'm [name]. What track are you going for?"
   - "Have you done this hackathon before?"
   - Note: They might become collaborators or have insider tips

### DO NOT:
- ❌ Start coding yet
- ❌ Spend 30 min setting up your dev environment
- ❌ Deep dive into discussions
- ❌ Miss the opening ceremony

**Why:** Context comes first. Code comes later.

---

## Hour 0.25: Opening Ceremony (30-45 min)

**Objective:** Extract every signal about what judges ACTUALLY want.

### What to Capture (Take Notes!):

#### 1. Track Presentations
For EACH track, note:
- **Track name:** [write it exactly as they say it]
- **Sponsor:** Who's presenting? Company name?
- **Prize amount:** $$$
- **Official criteria:** What they SAY they want
- **Body language cues:**
  - What did they get excited about when explaining?
  - What examples did they give?
  - What did they repeat twice?
- **Hidden priorities:** (READ BETWEEN THE LINES)
  - Are they tech-focused or impact-focused?
  - Do they want polish or innovation?
  - Do they mention specific APIs/products?

**🎯 PRO TIP:** When they say "we're looking for X, Y, and Z" - pay attention to which one they explain MOST. That's what they actually care about.

#### 2. Sponsor Mentions
Note every time a sponsor is mentioned:
- "Special thanks to [Company] for..."
- "Make sure to check out [Company]'s API..."
- "[Company] is offering..."

**Why:** Sponsor mentions = potential bonus prizes/tracks you didn't know about.

#### 3. Judge Introductions
If judges are introduced:
- Names + companies
- Their backgrounds (technical? Business? Design?)
- What they say they're excited to see

**Why:** Knowing who's judging changes your pitch strategy.

#### 4. Logistics
- Submission deadline (EXACT time)
- Demo format (in-person? Video? Both?)
- Devpost URL
- Meals schedule
- Mentor availability times

---

## Hour 0.5-1.5: Table Crawl (MOST IMPORTANT)

**Objective:** Visit EVERY sponsor table and extract hidden priorities.

### The Golden Rule:
**Don't just grab swag. Have a 3-minute conversation at EVERY table.**

### Your Battle Plan:

#### Step 1: Make a Hit List
Walk the entire sponsor area once. Note:
- Which tables have the most energy?
- Which tables are empty? (Go there first - longer conversations)
- Which sponsors seem most engaged vs just there?

#### Step 2: The Conversation Formula

**Opening (30 sec):**
"Hey! I'm [name], I'm really interested in the [Track Name] track. Can I ask you a few questions?"

**The Questions (2 min):**

1. **"What does a WINNING project look like for this track?"**
   - Listen for: Specifics, examples, past winners they loved
   - Note: This reveals what they ACTUALLY want vs the official criteria

2. **"Between [Criteria A] and [Criteria B], which matters more to you?"**
   - Forces them to prioritize
   - Reveals their hidden hierarchy

3. **"What's something that would make you lean forward and go 'whoa'?"**
   - This is The Gap question
   - Listen for emotional responses

4. **"Have you seen teams make mistakes in past years with this track?"**
   - Reveals antipatterns
   - Tells you what NOT to do

5. **"Are there any APIs, tools, or integrations you're hoping to see used?"**
   - Sponsor-specific prizes often require their tech
   - Some won't say this in opening ceremony

6. **"Can I grab your email/contact for questions during the hackathon?"**
   - Mentorship opportunity
   - Shows you're serious

**Closing (30 sec):**
"This is super helpful, thank you! I'll definitely come back if we go this direction."

Take their swag. Take their business card. TAKE NOTES IMMEDIATELY after the conversation.

#### Step 3: Document Everything

**After EACH table conversation, capture:**

```markdown
## [Company Name] - [Track Name]

**Contact:** [Name, email if they gave it]
**Energy Level:** High/Medium/Low

**What They ACTUALLY Want:**
- [Point 1 from conversation]
- [Point 2 from conversation]

**The Gap Signal:**
"[Quote about what would make them excited]"

**Required Tech:**
- [API/tool/integration they want to see]

**Antipatterns to Avoid:**
- [Mistakes they mentioned]

**Swag:** [What you got - this helps you remember which table later]

**Vibe Check:** [Your gut feeling - are they engaged? Do they care?]
```

---

## Hour 1.5-2: Team Formation & Yap Mode

**If you're solo or need teammates:**

### Where to Find People:
- Team formation session (if offered)
- Slack/Discord channels
- Tables near you
- People who look lost (they need a team too!)

### Conversation Starters:
"What tracks are you interested in?"
"What's your background - dev, design, business?"
"I'm thinking about [idea direction] - want to brainstorm?"

### What to Look For:
- ✅ Complementary skills
- ✅ Similar energy level
- ✅ Good communication
- ❌ Know-it-alls who won't listen
- ❌ People who just want to code their own thing
- ❌ Zero energy (won't survive 24 hours)

**If you're with a team:**

### Yap Mode Session
Find a quiet corner. Set a timer: 20 minutes.

**Throw out EVERYTHING:**
- "What if we..."
- "I've always wanted to build..."
- "Wouldn't it be cool if..."
- "The [Track] sponsor said they want..."

**Capture all the chaos. No filtering yet.**

**🎯 PRO TIP:** Voice record this session. Transcribe later. Gold insights hide in yap mode.

---

## Hour 2: Context Consolidation

**NOW run the workflow:**

```bash
/bmad:hackathon-suite:context-collector
```

**You'll have:**
- ✅ Track analysis files (from table conversations)
- ✅ Sponsor priority notes (from opening ceremony)
- ✅ Team capabilities (from formation/yap)
- ✅ Constraints (time, APIs, hardware)
- ✅ Yap mode chaos (raw signal)

**The workflow will structure all of this into clean context.md**

---

## Networking Strategy

### During the Hackathon:

**1. Sponsor Tables (Continuous)**
- Visit them DURING the hack, not just at the start
- Show progress: "Hey, we're building X for your track. Mind if I show you?"
- Get early feedback
- They remember teams who engage

**2. Mentors**
- Use them for technical blockers
- Use them for "does this idea fit the track?" validation
- Ask: "If you were judging, what would make this a winner?"

**3. Other Teams**
- Check in with neighbors periodically
- "How's it going? What are you building?"
- Avoid: Stealing ideas. Build: Community goodwill.
- **The real network is post-hackathon connections**

**4. Organizers**
- Thank them when you see them (they're stressed)
- Ask logistics questions early, not last minute
- They often have judge insights

**5. Judges (During Demo Time)**
- Smile, make eye contact
- Start with your hook, not your name
- Watch their body language
- Ask: "Do you want to see the demo or hear the vision first?"

### Post-Hackathon Networking:

**Follow up within 48 hours:**
- LinkedIn connect with sponsors you talked to
- Email mentors who helped you: "Thanks for the [specific help]. We ended up building [result]."
- Connect with teammates on LinkedIn/GitHub
- Join the hackathon Discord/Slack alumni

**Message template:**
"Hey [Name], I'm [Your Name] from [Hackathon Name] last weekend. We talked about [Track] - really appreciated your insights on [specific thing]. Would love to stay connected!"

---

## Information Hierarchy: What Matters Most

### Tier 1 (CRITICAL):
1. **Track criteria** (official)
2. **What sponsors ACTUALLY want** (from conversations)
3. **Prize amounts** (prioritization)
4. **Submission deadline** (hard constraint)
5. **Demo format** (shapes your build)

### Tier 2 (IMPORTANT):
6. **Past winners** (pattern recognition)
7. **Judge backgrounds** (tailoring your pitch)
8. **Required technologies** (sponsor APIs)
9. **Team skills** (feasibility check)
10. **Hardware availability** (constraint awareness)

### Tier 3 (USEFUL):
11. **Mentor schedules** (when to ask for help)
12. **Meal times** (energy management)
13. **Wifi reliability** (backup plans)
14. **Swag collection** (morale boost)

---

## Red Flags to Watch For

### During Opening Ceremony:
- 🚩 Vague track criteria ("be creative!")
- 🚩 Overly complex submission process
- 🚩 Unclear judging timeline
- 🚩 Too many tracks (judges will be exhausted)

### At Sponsor Tables:
- 🚩 Disengaged sponsors (low prize/effort ratio likely)
- 🚩 "Just use our product" with no flexibility
- 🚩 No clear criteria beyond "impress us"

### Team Formation:
- 🚩 Someone who wants to "lead" but won't code/design/build
- 🚩 Skill overlap (3 backend devs, no frontend)
- 🚩 Unrealistic expectations ("Let's build a full marketplace")

---

## Quick Capture Templates

### Track Quick Notes (on your phone):

```
Track: [Name]
$: [Amount]
Want: [3 words]
Gap: [What makes them excited]
Tech: [Required APIs]
Avoid: [Antipattern]
Vibe: [1-5 stars]
```

### Team Quick Notes:

```
Name: [Name]
Skills: [List]
Energy: [High/Med/Low]
Worked before: [Y/N]
Track interest: [List]
```

### Yap Quick Notes:

```
Time: [timestamp]
Idea: [one line]
Why: [Why we said it]
Track fit: [Which tracks]
```

---

## The Context-Collector Mapping

**Everything you capture feeds directly into the workflow:**

| What You Gather | Workflow Step | File Created |
|-----------------|---------------|--------------|
| Opening ceremony track info | Step 2: Tracks | context/tracks/{track-name}.md |
| Sponsor table conversations | Step 3: Sponsors | context/sponsors/{sponsor}.md |
| Team formation / skills | Step 4: Team | context/team.md |
| Logistics, hardware, APIs | Step 5: Constraints | context/constraints.md |
| Yap mode brain dump | Step 6: Yaps | context/yaps/{timestamp}.md |
| All of the above synthesized | Step 7: Consolidate | context.md |

**The workflow transforms your chaotic notes into structured context ready for ideation.**

---

## Real Talk: Common Mistakes

### ❌ Mistake 1: "I'll figure out tracks later"
**Result:** You miss critical sponsor insights and build for the wrong criteria.

### ❌ Mistake 2: "I'll just grab swag and leave"
**Result:** You have stickers but no context. Everyone else is ahead of you.

### ❌ Mistake 3: "I'll start coding right away"
**Result:** You build something cool that doesn't fit any track. You place 0th.

### ❌ Mistake 4: "I'll talk to sponsors when I have questions"
**Result:** They're busy later. The best insights come early when they're fresh.

### ❌ Mistake 5: "I'll remember everything"
**Result:** You remember 40% by hour 3. Take notes NOW.

### ✅ The Winning Approach:
**Hour 0-2: CONTEXT GATHERING (this guide)**
**Hour 2-3: IDEA GENERATION (workflow)**
**Hour 3+: BUILDING (with confidence you're on the right track)**

---

## Emergency Shortcuts

**If you arrive late or time is tight:**

### 15-Minute Minimum Context Gathering:
1. **Devpost/website** (5 min): Read all track descriptions
2. **Top 3 tracks** (7 min): Visit those sponsor tables ONLY, ask the gap question
3. **Yap mode** (3 min): Quick team brainstorm on what's feasible

### 30-Minute Solid Context Gathering:
1. **Opening ceremony** (attend fully)
2. **Top 5 tracks** (15 min): Hit those sponsor tables
3. **Yap mode** (5 min): Team discussion
4. **Run workflow** (10 min): context-collector

### 90-Minute Deep Context (RECOMMENDED):
- Follow the full guide above
- This is the investment that pays off in winning

---

## Mental Models

### The Context Iceberg:
```
Above Surface (Official):
- Track criteria on website
- Prize amounts
- Submission rules

Below Surface (Where You Win):
- What sponsors ACTUALLY want
- Judge backgrounds and preferences
- Hidden bonus prizes
- Track stacking opportunities
- Antipatterns from past years
```

**Your job: Dive below the surface.**

### The Network Compound Interest:
Every conversation you have:
- Might lead to a collaboration opportunity
- Might provide a critical insight
- Might result in a job/internship
- Compounds over multiple hackathons

**Don't just extract value. Build relationships.**

---

## Post-Context Action Items

**Once you've gathered context:**

1. ✅ Run `/bmad:hackathon-suite:context-collector`
2. ✅ Review the consolidated context.md
3. ✅ Run `/bmad:hackathon-suite:idea-generator`
4. ✅ Validate with `/bmad:hackathon-suite:hackathon-judge`
5. ✅ Start building with confidence

**You've now invested 90-120 minutes in understanding the landscape.**
**This investment will save you from:**
- Building the wrong thing
- Missing track-stacking opportunities
- Ignoring what judges actually care about
- Wasting 20+ hours on a non-winner

---

## Final Checklist: Before Ideation

Before you run idea-generator, verify you have:

**Must-Have:**
- [ ] All major track criteria documented
- [ ] At least 3 sponsor table conversations captured
- [ ] Team skills and constraints noted
- [ ] Submission deadline confirmed
- [ ] Demo format understood

**Should-Have:**
- [ ] "What makes you excited" insights from sponsors
- [ ] Past winner examples
- [ ] Judge backgrounds
- [ ] Track-stacking possibilities identified
- [ ] Yap mode notes from team

**Nice-to-Have:**
- [ ] Mentor contacts
- [ ] Hardware inventory
- [ ] API documentation links
- [ ] Network connections made

**If you have Must-Have ✅ → Start ideation**
**If you have Must-Have + Should-Have ✅✅ → You're in excellent shape**
**If you have all three ✅✅✅ → You're ahead of 90% of teams**

---

## Remember:

**"The hackathon doesn't start when you write your first line of code.**
**It starts when you walk in the door and start gathering context."**

**This guide = Your competitive advantage**

Go win. 🏆

---

_Hackathon Field Guide - Transform venue chaos into winning context_
_Part of the Hackathon Suite by BMAD_
