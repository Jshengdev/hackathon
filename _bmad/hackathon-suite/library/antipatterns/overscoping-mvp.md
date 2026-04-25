---
title: Overscoping the MVP
category: antipatterns
tags: [scoping, time-management, planning]
date_added: 2026-01-20
severity: high
frequency: very-common
---

# Antipattern: Overscoping the MVP

## Quick Summary
Teams plan to build 5+ features when they have time for 1. They end up with nothing fully working, demo multiple half-baked pieces, confuse judges, and don't place.

## The Mistake

**What teams do:**
"Let's build user auth, a database, real-time sync, AI recommendations, AND a mobile app!"

**Example scenario:**
"Team building a climate tracking app decides they need: user accounts, data collection from 5 sources, ML analysis, visualization dashboard, mobile app, email notifications, and social sharing. They have 18 hours. They finish 20% of each feature. Demo is fragmented. Judges are confused. They place 0th."

## Why It Happens

**The thinking:**
- "More features = more impressive"
- "We need this to be complete"
- "It's not a real product without [X]"
- "We're really good, we can build fast"
- "We'll just work through the night"

**When it occurs:**
- During initial planning (Hour 2-3)
- After ideation when excitement is high
- When comparing to "complete" products
- When team has strong technical skills (overconfidence)

## The Cost

**What you lose:**
- **Time:** 50-70% of build time goes to integration, not features
- **Placement:** 0th place — judges see nothing complete
- **Demo quality:** Fragmented presentation, no wow moment
- **Morale:** Team exhausted, demoralized by 20% completion

**Real examples:**
- "Team spent 4 hours on auth system instead of core demo — ran out of time"
- "Built 3 half-working features — judges said 'come back when it's done'"
- "Perfect backend, no frontend — nothing to show in demo"
- "Every feature 50% done — judge asked 'but does anything actually work?'"

## Early Warning Signs

**You're in this antipattern if:**
- [ ] Your plan has 5+ "must-have" features
- [ ] You estimate each feature at 2 hours but have 10 hours total
- [ ] You're building auth before your core feature
- [ ] You say "we need this to be realistic"
- [ ] Your Gantt chart assumes zero integration time
- [ ] Multiple team members are blocked waiting for others
- [ ] It's Hour 6 and nothing demos end-to-end

**Check yourself:**
- Can you demo ONE complete case right now?
- If you stopped building now, would you have something to show?
- Does your "MVP" require all planned features to work?

## How to Avoid

**Prevention strategies:**

1. **Define THE One Demo Case First**
   - What is the SINGLE scenario that proves the concept?
   - What's the absolute minimum to make that case work?
   - Build ONLY that

2. **Apply "Demo Once = Shipped" Rule**
   - If you can demo it ONCE, you're done
   - Everything else is scope creep
   - Don't build for "realism" — build for demo

3. **Use 1-3-5 Scoping**
   - 1 MUST-HAVE feature (the core wow)
   - 3 NICE-TO-HAVE features (if time permits)
   - 5 DREAM features (ignore these)
   - Build the 1, stop if it works

4. **Time-Box Ruthlessly**
   - Allocate 60% time to core feature
   - 20% to integration
   - 20% to demo prep
   - If core feature takes longer, cut everything else

**Workflow integration:**
- idea-generator Step 4: Skill Check validates feasibility
- hackathon-judge validates if scope is realistic
- prd-splitter creates parallel branches, not serial dependencies

## Recovery (If You're Already Here)

**Stop and assess:**
1. **Freeze new work immediately**
2. **List what actually works end-to-end** (probably nothing)
3. **Pick the ONE feature closest to working**
4. **Cut everything else — even if 80% done**

**Time-based recovery:**

**If you have 6+ hours left:**
- Choose your strongest feature
- Make it demo-able end-to-end
- Add only what's needed for that demo
- Stop when it demos once

**If you have 2-4 hours left:**
- Emergency scope reduction
- Pick the one wow moment
- Hardcode everything else
- Make THAT one thing work perfectly

**If you have < 2 hours:**
- Abandon code work
- Create video demo of "what it would do"
- Polish pitch to explain vision
- Use slides to show the concept
- Be honest: "This is the vision, here's what we built"

## Related Antipatterns
- Feature Creep Mid-Hack
- "It's Not Real Without Auth"
- Perfect Code Over Working Demo
- Ignoring Integration Time

## Corrective Patterns
- Link to technical-patterns/one-demo-case.md
- Link to technical-patterns/hardcode-first.md
- Use prd-splitter workflow to identify critical path

## Key Insights
- Judges score on "does it work" + "is it impressive", not "how many features"
- A single working feature that crosses The Gap beats 5 half-working features
- Integration time is always 2-3x what you estimate
- "Demo once = shipped" removes 80% of scope
- Hardcoding is not cheating — it's smart hackathon strategy

## Takeaways
- **Rule 1:** Define the one demo case before writing any code
- **Rule 2:** Build only what's needed for that ONE case
- **Rule 3:** If it demos once, STOP BUILDING
- **Rule 4:** More features ≠ higher score. Working demo = points.
- **Rule 5:** Hardcode everything that's not the wow moment

---
*Severity: high*
*Frequency: very-common (70%+ of teams make this mistake)*
*Added to library: 2026-01-20*
*Most common mistake at hackathons — learn from this!*
