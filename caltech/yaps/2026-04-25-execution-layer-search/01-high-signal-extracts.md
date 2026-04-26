---
file-type: yap
status: reflection (Socratic — Johnny named, Claude reflects)
last-verified: 2026-04-25
locked-by: Johnny verbatim execution-layer search → Claude reflection
cross-links:
  - ./00-raw-yap.md
  - ../../prd.md
  - ../../narration-script-3min.md
---

# High-signal extracts — 2026-04-25 execution-layer + input-layer search

## A. The "now-vs-future" doctrine clarified — NEW LOCK

Johnny's verbatim resolution of an ambiguity that's been hanging in the PRD:

> *"Right now I think it'll be the now, but when we still tell the story in person it'll just be we recognize that we're thinking about the future."*

**The lock:**
- **Use cases (what works TODAY):** scoped to data the user can actually upload now (screen recordings, saved folders, friend-shared content). The demo has to actually work on this.
- **Story (in-person pitch framing):** acknowledges the future scenario (BCI, full-platform-data-export, 24/7 monitoring) as the trajectory — but doesn't claim to deliver it.

**Why this matters:** earlier locks had *"empowerment for the post-recommender era"* in PRD §6. That's future-tense. This turn says: *demo and use-cases are present-tense; story acknowledges future-tense.* Sharper line.

## B. The reverse-engineering thesis — NEWLY ARTICULATED LOCK

> *"It's almost like reverse we're doing like a reverse hacking thing... these big industries use the brain model to maximize attention on their platform. The real company use case is mapping how people feel so they can maximize certain parts of your brain firing so they stay on the platform. We can use the same brain model to do the opposite — show them what they haven't seen, find a use case more empowerment focused than attention farming."*

**This is the cleanest articulation of the thesis Johnny has produced so far.** It does THREE things at once:

1. **Names the antagonist concretely.** Not "the algorithm" (abstract). It's *"the brain model used by Meta/Apple/Google to maximize attention."* That's a real technology with a real industry use case the audience already suspects exists.

2. **Establishes that we use the SAME tool.** This avoids the credibility trap of *"we have a magic brain-reader the platforms don't have."* We have *the same brain model, used differently.* The technology is symmetric; only the ethics differ.

3. **The product is the inverse function.** Where they USE the model to maximize their region-firing optimization for engagement, WE use it to surface what regions DIDN'T fire and offer the user agency over that gap.

**Pitch-deck-grade phrasing seed:**
> *"Big tech uses brain models to engineer attention. We use the same model — in reverse — to engineer choice."*

## C. The third-party-data-access frame — NEW (the input-layer answer)

Johnny's framing of why a third-party tool is legitimate:

> *"Their activity is being monitored 24/7 by Apple, Google, Meta. Why can't a third party also do that? ...if the user enables them to collect their information. These third parties can only do it for their specific use case now. The idea is we want to access the things we give Meta and access the things we give Apple."*

**The lock:** the product positions as *the user-side third-party that re-uses the data the user has already given to platforms.* Not asking for new data; surfacing access to existing-data-the-user-already-shared.

**Operational implication:** the input layer should focus on **re-importing platform-data the user has already created**, not on creating new data for us. Examples:
- Screen-recording (the user's own scroll session — already-shared with Meta)
- Saved-folder export (already in the user's own Instagram account)
- Topic-list (already curated by the user on the platform)
- Friend-shared content (already in their DMs)

**Why this matters for legitimacy:** *"we just use what you've already given them, but for you instead of for them."*

## D. The "more than stats" problem — NAMED, NOT YET RESOLVED

Johnny's tension with the current locked output:

> *"Once we give them empowerment we need to have them USE that empowerment... we need to give them a specific more specific thing they're taking away from it rather than just like showing them stats. Spotify Wrapped is just showing them their data. There should be something MORE that comes out of it."*

**The lock:** stats-as-output is insufficient. Need a *takeaway artifact* the user keeps and acts on.

**Johnny's seed candidate:** *"interactable Wrapped — see your data but then try to fill in the gaps by adding another piece of content and seeing what fires from there, and then you add another piece of content..."*

This is structurally an **iterative-discovery loop** — user's wrap shows gaps, user adds content to fill gaps, the wrap updates. Each iteration is a measurable change in their brain-fire pattern.

**The Land card mechanic already approaches this** — click grayed-out region → see content formats. But Johnny is reaching for something more iterative: not a one-shot suggestion, but a session where the user fills gaps and watches the pattern shift in real time.

**Open question Johnny didn't resolve:** in-demo (changes the BEAT-4 hero) or post-demo (V2 product surface)? Pre-mortem says probably post-demo for hackathon scope; could fold a tiny version into the demo as the closing beat.

## E. Input-layer candidates Johnny floated (held as options, NOT yet locked)

| Input method | What user does | Friction | Privacy | Currently in spec? |
|---|---|---|---|---|
| Screen-recording feed | User records their scroll session | Low | High (self-recorded) | ✅ current default |
| Instagram saved folder | User exports / reads saved posts | Low (if API; high if scraped) | Medium | ❓ option |
| Friend-shared content | User pastes DM links / forwarded URLs | Low | Medium | ❓ option |
| Topic-list manual entry | User types interests they want analyzed | Very low | High | ❓ option |
| Widget-triggered recording | User taps widget on phone → records 60s | Low | High | ❓ option |
| Instagram topic-preferences | User imports their platform-stated topic list | Low | Medium | ❓ option (ambiguous if Instagram exposes this) |

**Implication:** the demo input is screen-recording (already locked). But the *story* about how this scales to a real product can name 2-3 of these as *"in production, users can upload via..."* — answering judges' "but how does this become a real product?" question without changing demo scope.

## F. Searching against TreeHacks scrape — DELEGATED (research agent in flight)

Johnny named the search task:

> *"Explore our current data base of analyzed treehack scraped hackathon projects, identify what they do for their execution points and what they do for the input points, and how we can map that to our unique engine and somewhat similar story. Revise everything depending on what we discover until we find something that we really like and believe in."*

**Action:** parallel research agent dispatched against:
- `research/wiki/scrapes/treehacks-2026-winners.md` (64 winners)
- `research/wiki/projects/` (deeper teardowns)
- `feesh/research/02 + 03` (multi-capability + winner-deep-dive)
- `caltech/ideation/04-front-facing-concepts.md` (per Socratic caveat)

**Returning:**
1. Input-layer pattern catalog
2. Execution-layer pattern catalog
3. Reverse-engineering pattern catalog (industry-use-case-inversions)
4. "What did users DO with empowerment" examples
5. 3-5 concrete adaptations for our engine

When that lands, we triage which patterns to fold into PRD §3 + §6 + demo-script + narration-script.

## G. Soft-locks proposed for the live-thread (Johnny to confirm)

- **SL-NEW-17.** Now-vs-future split: USE CASES are present-tense; STORY acknowledges future-tense. Demo runs on what works today.
- **SL-NEW-18.** Reverse-engineering thesis: *"Big tech uses brain models to engineer attention. We use the same model — in reverse — to engineer choice."* Locked as pitch-deck-grade phrasing seed.
- **SL-NEW-19.** Third-party-data-access frame: the product re-imports platform-data the user has already shared. Not asking for new data.
- **SL-NEW-20.** Stats-as-output is insufficient. Need a takeaway artifact (current Land card approaches this but the iterative-fill-gaps loop is a stronger candidate).
- **SL-NEW-21.** Input-layer is held as multi-method (screen-recording + saved-folder + friend-shared + topic-list) for the *story*; demo runs screen-recording only.

## H. What this DOESN'T resolve (held until research agent returns)

- **The interactable-Wrapped vs. one-shot-Wrapped pick.** Johnny's iterative-fill-gaps seed is compelling but blows the 90s demo budget if added in-demo. Possible compromise: 10s of Land-card iteration shown as "this is what the user does with the wrap" without making it the BEAT-4 hero.
- **The post-Wrapped takeaway artifact.** What does the user *keep*? A shareable card? An export of their brain-fire-pattern history? A "branched-out content list" they curated? Held until research returns examples.
- **The Instagram-topic-preferences claim** — Johnny suggested Instagram lets you choose topics; he wasn't sure. If true, it's a powerful "the user already curated this — we just visualize it differently" angle. Verification needed.
