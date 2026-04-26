---
file-type: tier-2-epic
status: spec — fresh-Claude-spawn-ready
worktree: .worktrees/pkg-social-content
owner: Emilie + social-content Claude
duration_estimate: 2 person-hours (post-submission, Sunday morning)
last-verified: 2026-04-25
---

# Tier-2 Epic — Social Content

## Mission

Post-submission viral assets. Ride the demo's momentum into LinkedIn / X / Instagram for views, recruiter-eyes, and team profile-building. Optional but high-leverage given Emilie's 6M-view track record.

## INPUT

1. `caltech/emilie-brief.md` §7
2. `caltech/research-context/007-johnny-public-corpus-tribe-posts.md` (Johnny's public voice — register reference)
3. `.worktrees/pkg-demo-video/final-cut.mp4` (the 3-min demo — clip source)
4. `.worktrees/pkg-brand-system/` (visual tokens for thumbnails / cover images)

## DELIVERABLES

### 1. LinkedIn announcement post (Johnny voice — primary)
- Civilizational-stakes opener (per Johnny's published post pattern)
- Specific platforms named (Spotify / YouTube / Reels)
- The trilemma named
- The Clair de Lune precedent referenced
- *"Manipulation only works in the dark"* tagline
- Closing: tap-in / DM-for-collab / link to Devpost
- Length: 250-400 words
- Embedded: 60s vertical cut of the hero demo moment

### 2. X thread (5-7 posts)
- Post 1: Hook — *"Your Spotify is no longer your music taste. Your YouTube isn't yours. Your Reels — you can't select any of that."* (image: 4-platform logos)
- Post 2: The trilemma — three columns visual
- Post 3: The product reveal — 1 sentence + brain-render screenshot
- Post 4: The architecture — 4-layer pipeline diagram
- Post 5: The Clair de Lune precedent — link to Johnny's prior post + headline number
- Post 6: The future vision — "Today it's Reels. In 5 years it's BCI."
- Post 7: Close — Devpost link + team handles

### 3. 9:16 vertical video cut (Instagram Reels / TikTok / YouTube Shorts)
- Length: 30-45s (TikTok native sweet-spot)
- Source: extract Act 3 hero moment from the 3-min video
- Hook (first 2s): the brain visualization at full vastness
- Body: the toggle reveal (feed-shaped vs. baseline-shaped pattern)
- Close: tagline overlay
- Captions burned-in (most consumers watch silent)
- Music: trending instrumental (royalty-free) OR muted-with-text for higher legibility

### 4. Devpost cover thumbnail
- 1280x720 cover image
- Single hero shot: the cortical mesh with one bright region + the Wrapped card overlay
- Headline overlay: locked final headline
- Brand tokens applied

### 5. Demo video YouTube/Vimeo upload
- Title: locked headline
- Description: condensed Devpost copy + chapters timestamped
- Thumbnail: same as Devpost cover
- Tags: AI, neuroscience, brain-computer interface, hackathon, Caltech, TRIBE V2, Listen Labs, IFM, K2 Think

### 6. Team-member profile assets (optional)
- For each teammate (Johnny, Jacob, Junsoo, Emilie):
  - 1 LinkedIn-ready square image (1080x1080) with their role + 1-line achievement
  - Pull-quote from the project they can post
  - Suggested tagging strategy (sponsor handles, hackathon organizer)

## VOICE GUIDANCE

Johnny's published posts (`research-context/007`) are the register reference for LinkedIn. His pattern:
- Opens with hook concept or framing question
- Walks through reasoning openly with methodology / numbers
- Closes with question or call to "tap in"
- Mixes personal experiment writeups with thesis posts

Emilie's social register (per `team/emilie.md`) is more emotional/visual-first — adapt for X (which rewards punchier hooks) and Instagram (which rewards aesthetic-first frames).

## OUTPUT FORMAT

```
.worktrees/pkg-social-content/
├── linkedin/
│   ├── post.md
│   └── attached-image.png (or video)
├── x/
│   ├── thread.md (post-by-post)
│   └── attached-images/ (post-by-post)
├── vertical-cut/
│   ├── reel.mp4 (9:16, 30-45s)
│   └── thumbnail.png
├── devpost-cover.png
├── youtube-listing.md
├── team-profiles/
│   ├── johnny.md
│   ├── jacob.md
│   ├── junsoo.md
│   └── emilie.md
└── README.md
```

## SUCCESS CRITERIA

- LinkedIn post passes the *"would Johnny actually post this?"* sniff test
- X thread is screenshottable for any single post (each one stands alone)
- Vertical cut hits the hero moment in <2s
- Brand tokens consistent across all assets

## DEPENDENCIES

- INPUT: demo video final cut (Saturday 5 PM)
- INPUT: brand system (Saturday 2 PM)
- INPUT: locked headline + product name (Saturday 6 PM)
- TIMING: post-submission (Sunday morning is fine; not on the submission critical path)
- DEADLINE: Sunday noon for first wave; team posts at coordinated time
