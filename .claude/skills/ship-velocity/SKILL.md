---
name: ship-velocity
description: 'Apply solo-ship discipline (idea scoping, parallel AI coding lanes, story-first packaging) to hackathon PRD and build work. Use when scoping a slice, deciding what to cut, splitting work across teammates and AI tools, prepping the demo story, or sanity-checking that the team is shipping not engineering. Invoke whenever "are we doing too much?" "what is the MVP cut?" "who builds what?" "is the story right?" or "are we on track to ship?" comes up.'
---

# Ship Velocity

Distilled from a solo dev's Yelp-AI hackathon walkthrough. Adapted for a 4-person, 12-hour, 5-sponsor team in PRD-building stage.

## When to invoke

- Scoping any slice of the build (MVP vs bonus)
- Splitting work across Johnny / Jacob+Junsoo / Emilie
- Choosing between Codex / Cursor / Claude Code / v0 / Supabase / etc.
- Drafting the One Demo Case
- Writing or rehearsing the pitch / Devpost / launch video
- Whenever someone says "let's also add..." or "what if we..."
- Before any architectural decision that locks engineering hours

## The 10 Principles (and how they apply to OUR team)

### 1. Idea = personal frustration × sponsor constraint

**Solo:** Pick what bothers YOU personally that fits the prompt.

**Our team:** The strongest pitch is whichever one a teammate has personally lived. Mine the team profiles (`caltech/context/team/*.md`) for personal stakes. Johnny's TRIBE V2 prior work, Junsoo's egocentric-VLM pipeline, Emilie's content-creator perspective on AI slop — these are the honest stories. **An idea no teammate has lived will be flat in the pitch.**

### 2. First LLM ideas are inspiration, not output

**Solo:** Paste prompt into ChatGPT, get 5 ideas, get inspired.

**Our team:** Our `caltech/ideation/01-problem-space-buffet.md` has 30 ideas. Don't pick from it directly — use it to find the SHAPE that excites the team, then refine. The synthesis matters more than the list.

### 3. Define the ONE base feature; everything else is bonus

**Solo:** "Save restaurants → recommend nearby" was the base. Map view, diner banner, globe loader = bonus.

**Our team:** The PRD must declare ONE demo case. Example shape: "User uploads 30s video → swarm analyzes → glass-box knowledge graph appears in 4 seconds → user sees a bias the model caught." Everything else is bonus and goes BELOW a hard line in the PRD. **If something is above the line, every teammate's slice contributes to it. Below the line is each person's creative freedom.**

### 4. Parallelize: frontend + backend + design + story all run simultaneously

**Solo:** v0 generating UI while Codex did backend while Jake thought about the story.

**Our team (mapped to locked roles):**
| Lane | Owner | AI tools | Runs in parallel with |
|---|---|---|---|
| Hard innovation (TRIBE V2 wiring, K2 swarm logic) | Johnny | Claude Code, Cursor | Everything else |
| Backend orchestration + API integration | Jacob, Junsoo | Codex, Claude Code | Hard innovation lane |
| Frontend prototype | Whoever picks it (likely Jacob if assigned) | v0 | Backend |
| Story / Devpost / launch video / design | Emilie | v0 (for components), Figma, Claude | All three above |

**Each person gets a dedicated AI coding session.** Don't share Cursor windows. Don't pair-program in PRD-building mode — pair-program only at integration.

### 5. AI coding > look-up-and-copy

**Solo:** "It's just so much faster to prompt Codex" rather than read docs and copy code.

**Our team:** Aggressive AI coding is mandatory at our hour budget. But the **input/output contract is human-defined**, the implementation is AI-generated. PRD slices specify *interfaces*, not *implementation*. Each person prompts their AI tool to fill the interface. Saves 50%+ of build time.

### 6. Mock and hard-code to unblock

**Solo:** Hard-coded the location to bypass the geolocation issue. Got results flowing, polished later.

**Our team:** This is THE most-important principle for our stack. TRIBE V2 might return junk. K2 keys might delay. Ironside dataset might not arrive. **For each external dependency, the PRD must specify a mock that ships realistic-shape data.** Build against the mock. Swap to real at integration. No teammate is ever blocked waiting for an API.

### 7. UX polish goes LAST

**Solo:** Built backend → tested → THEN built loading globe + diner banner.

**Our team:** Emilie's design polish (color palette, launch video, hero image) should be SCHEDULED for Saturday afternoon, not Friday night. Friday night = wireframes only. The loading animation and hero shot are last-mile work. The PRD should reflect this scheduling — if Emilie's slice is "deliver final design Friday night," she'll get blocked. Her slice should be "wireframes Friday, polish Saturday after demo case works end-to-end."

### 8. Story is the deciding factor — write it BEFORE the build

**Solo:** "I want to make the story so compelling and so relatable that the judges are impressed." Got the demo script crisp before recording.

**Our team:** Most teams write the pitch Sunday morning at 7 AM. We write it during PRD. **The PRD's first section should be the 5-minute pitch arc** (we have 8 candidate arcs in `caltech/ideation/03-pitch-hooks.md`). The build then HAS to support that arc — no architectural decision is made without checking "does this serve the pitch?" If a feature doesn't appear in the pitch, why are we building it?

**Specifically for our team:** Emilie owns the pitch but EVERY teammate must be able to tell the 30-second version. Practice once per integration checkpoint.

### 9. Demo discipline: judges remember how they FELT, not what you built

**Solo:** "If you're looking at so many submissions, you're going to remember how you felt after a certain project."

**Our team:** Round 1 = 5 min. Round 2 = 3 min. **Cut everything that doesn't move the feeling forward.** The K2 swarm visualization isn't valuable because it's technically novel — it's valuable because it makes a judge feel "oh wow, I can SEE the AI thinking." If a feature doesn't generate a feeling, it gets cut, even if it took 4 hours to build.

**Rule for our PRD:** Every feature gets a "feeling tag": *aha*, *trust*, *fear*, *delight*, *relief*, *recognition*. Features with no feeling tag get cut.

### 10. Submit on time. Polish only what's done.

**Solo:** Submitted before deadline even when imperfect. Lost the hackathon — but had a project.

**Our team:** Devpost deadline is Sunday 9 AM PDT — HARD. Plan to submit Saturday 11 PM. That gives 10 hours of buffer for fixes. **The PRD must declare a "feature freeze at Saturday 8 PM."** After 8 PM Saturday: only bug fixes, demo recording, Devpost writeup, slide polish. No new features. Anyone caught building a new feature after 8 PM Saturday gets pulled to demo prep.

## Quick-fire checks (run when invoked)

When this skill is invoked mid-PRD or mid-build, run these checks in order. Stop at the first one that fails:

1. **Story-first check:** Is the 5-minute pitch arc written down? If no → write it before anything else.
2. **One Demo Case check:** Is there exactly ONE demo case named? If no or multiple → narrow to one.
3. **Above/below line check:** Does the PRD have a hard line separating MVP from bonus? If no → draw it now.
4. **Mock check:** Does every external dependency (TRIBE V2, K2, Ironside, Listen Labs, any sponsor API) have a named mock with input/output shape declared? If no → list missing mocks.
5. **Lane check:** Is every PRD slice assigned to exactly ONE owner with input/output contract declared? If no → assign or contract.
6. **Feeling tag check:** Does every feature in MVP have a feeling tag? If no → tag or cut.
7. **AI tool check:** Does every owner know which AI tool they'll use for their slice? If no → assign tools.
8. **Schedule check:** Is "feature freeze Saturday 8 PM" in the PRD? Is "submit Saturday 11 PM" in the PRD? If no → add.
9. **Pitch-rehearsal check:** Can every teammate deliver the 30-second version? If not → schedule a 10-min team rehearsal at next integration checkpoint.

## Integration with our existing PRD work

When you invoke this skill during PRD-building (`bmad:hackathon-suite:workflows:prd-splitter` or `bmad-create-prd`), it slots in like this:

- BEFORE running prd-splitter → run principles 1, 2, 3, 8 to lock idea + One Demo Case + pitch arc
- DURING prd-splitter → run principles 4, 5, 6, 9 to ensure each slice has owner / interface / mock / feeling tag
- AFTER prd-splitter → run principles 7, 10 to add schedule guards (polish-last, freeze-at-8PM)
- DURING build → invoke for any "should we add X?" decision; principle 3 (above/below line) usually settles it

## Anti-patterns this skill catches

| Anti-pattern | What you'll hear | What to do |
|---|---|---|
| Scope creep | "What if we also..." | Below the line. Defer. |
| Premature polish | "Let me make this look nicer" | Schedule for Saturday PM. Move on. |
| Story-last | "We'll figure out the pitch Sunday morning" | NO. Write the arc now. |
| API blocking | "Waiting for K2 keys" | Build against mock. Swap later. |
| Solo hero | "I'll just do all the backend tonight" | Lane it. Single-points-of-failure die. |
| Architecture for the future | "Let's set up CI/CD" | Hackathon. No. Just `git push`. |
| Generic AI tools | "Let's use Claude for everything" | One tool per lane. Codex for backend. v0 for UI. Etc. |
| Feeling-less feature | "This is technically interesting" | If no feeling tag, cut. |

## Output when invoked

When this skill is invoked, end with:

1. **Diagnosis:** What stage is the team in? (idea / PRD / build / demo prep)
2. **Quick-fire results:** Which checks passed, which failed
3. **Top 3 immediate moves:** What to do in the next 60 minutes
4. **Anti-pattern flags:** Any of the above patterns currently active

Keep diagnosis to under 200 words unless explicitly asked for depth.
