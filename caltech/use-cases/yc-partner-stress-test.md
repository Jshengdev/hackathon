---
title: "YC Partner Stress-Test — How to Get Startup Ideas Framework Applied"
status: stress-test (saved 2026-04-25 from PRD-builder pane)
source_framework: Jared Friedman / YC partner talk transcript on common founder mistakes + 10 questions to evaluate startup ideas
purpose: |
  Walk our product through the same evaluation gauntlet a YC partner would in office hours.
  Answer each of YC's 10 questions honestly. Surface where we fail, where we pass, where we
  duck the question. Map results back to existing locks for editing/sharpening.
  Hackathon-scoped — defensibility means "would a YC partner see legs in this if it were
  pitched as a startup?" — but the answers ALSO inform Best Use of AI judging where YC-style
  founder-market-fit and tar-pit questions matter.
companion_files:
  - _bmad-output/planning-artifacts/yc-defensibility-review.md (prior run; tar-pit + 10x feature analysis)
  - caltech/use-cases/ironside.md (B2B overlay use case)
  - caltech/use-cases/listenlabs-sideshift.md (B2C-primary spine use case)
ladders_to: caltech/prd-final.md §6 YC swap-slide; _bmad-output/planning-artifacts/prd.md §Innovation
---

# YC Partner Stress-Test — Our Product Through Jared's Framework

> Read the four common-mistake checks first (do we fall into any?), then walk the 10 evaluation questions. Honest — not promotional.

---

## §0. The four common-mistake checks (before evaluating the idea)

### Mistake 1 — Solving a fake problem ("FISP — Fake Solution Searchable Problem")

**Check:** Did we start with a problem we (or someone we observed) actually has? Or did we get excited about building something cool and reverse-engineer a problem to fit?

**Honest answer:** We started **engine-first, then back-fit the problem to maximize sponsor-track coverage** (Decision 001). That's textbook FISP risk. BUT — Johnny's published TRIBE V2 corpus + Maya persona predates the sponsor strategy; the cultural-flattening problem ("Gen-Z thoughts converging with the algorithm") was a real instinct Johnny was articulating in his published video work BEFORE the hackathon team was assembled. So:

- ✅ The problem is real for Maya (Gen-Z teen, no pre-algorithm reference frame, can't tell which thoughts are hers)
- ⚠️ But we have NOT talked to 100 actual Mayas. We have one persona derived from public posts + team intuition. **That's what would worry a YC partner.**
- ❌ We're explicitly NOT positioning as a hackathon-only project; we're positioning as a category-creator product. That raises the bar from "demo-day plausible" to "user-validated."

**Score: 6/10.** Real problem instinct; weak user-validation.

**Mitigation if we wanted to fix this:** Friday night, before the freeze gate, run the Adaptation 2 Brain Card export by 3 actual Gen-Z teens (high-school siblings, friends-of-friends). Watch them use the demo. Note their reactions. Cite "we tested with N Gen-Z users, here's what they said" in Devpost. ~1 hour cost; massive YC-credibility lift.

### Mistake 2 — Tar pit idea

**Check:** Has "un-blackbox the algorithm" been tried? By whom? Why did it fail?

**Honest answer:** **YES. This is a tar pit.** Per the prior `yc-defensibility-review.md`:
- Mozilla RegretsReporter (algorithm-audit browser extension) — failed; awareness ≠ behavior change
- Pol.is (consensus-forging discussion platform) — niche; never reached consumer scale
- TikTok "Why am I seeing this?" — built-in feature; nobody uses it
- Apple Screen Time / Headspace / RescueTime — wellness genre; usage curves all show abandonment
- Academic feed-audit projects (multiple) — research outputs, never products

**The structural failure mode:** Awareness alone doesn't change behavior. People know they spend too much time on Reels; the knowledge doesn't change their behavior because the dopamine loop is stronger than the cognitive understanding.

**Where we're trying to escape the tar pit (per YC review):**
1. **No-recommendation positioning** — we don't try to change behavior; we surface options the user judges
2. **Brain-encoding as audit signal** — the audit isn't another LLM's opinion (Pol.is failure mode); it's the user's own brain-fire pattern
3. **Demo-first not policy-first** — we don't ask the user to fight the algorithm; we show them their neural divergence and hand them choice

**Where we're still in the tar pit:** The "awareness ≠ behavior change" failure mode. *Why would Maya scroll less or scroll differently after seeing her Brain Card?* Honest answer: **we don't have an evidence-based answer.** We have a hope. YC partner would press hard here.

**Score: 4/10 as escape attempt.** Honest acknowledgment that this is a tar pit; structural moves to differentiate; no proof yet that we've actually escaped the gravity.

**Mitigation:** Reframe the "what changes for Maya" answer in the FAQ. Instead of *"she scrolls more intentionally"* (low-base-rate prediction), claim only what we can defend: *"she has language for what's happening to her, a specific actionable next step she chose herself, and a shareable artifact that propagates the framing — we don't claim behavior change; we claim AWARENESS-WITH-AGENCY which is qualitatively different from awareness alone."* That's defensible.

### Mistake 3 — Not evaluating an idea hard enough

**Check:** Did we kill candidate ideas before falling in love? Did we stress-test before building?

**Honest answer:** Mixed.
- ✅ Six yaps in two days (PRFAQ canvas / Listen Labs / empowerment / BCI / execution-layer / capability-first)
- ✅ Validation findings × 5 (Phase 2 party mode / blockers reclassified / team gap fillers / TreeHacks pattern search / capability inventory)
- ✅ T1 + T2 surfaced as held tensions (`research/wiki/themes/.../window-2-research-deepening/`)
- ⚠️ But evaluations happened AFTER the architecture was locked (Decisions 006/007 architectural anchors locked Friday early; validation passes came later in the day)
- ⚠️ The "Adaptation 2 + SynthDebate" recommendation came from capability-inventory analysis on the EXISTING architecture — not from open-field evaluation of "what should we build"

**Score: 7/10.** Strong evaluation discipline; weakened by the fact that evaluations came after architectural commitment, not before.

### Mistake 4 — Overthinking (the worst of the four per Jared)

**Check:** Have we been thinking too long instead of doing?

**Honest answer:**
- ✅ Build is in flight per `_bmad-output/.../prd.md` §Team Execution Status (Junsoo on TRIBE, Jacob on K2, Emilie on filming, Johnny on PM/integration)
- ✅ 16 decisions locked
- ✅ PRD + PRFAQ + demo-script + narration-script + 4 use-case docs all written
- ⚠️ But we've also produced ~20+ documents in 2 days. **Document-count is a proxy for overthinking.** A YC partner would say: *"You're 30 hours from feature freeze. Stop documenting and ship."*

**Score: 5/10.** Building IS happening; documentation overhead is real.

**Mitigation:** Stop writing PRDs and use-case docs. Start running the Friday smoke gate. The remaining 30 hours' best use is execution + smoke-test + pre-cache + final-pass polish — not more synthesis docs.

---

## §1. Founder-market fit

**Question:** Does this team have the unfair advantage to build this specific thing?

**Honest answer:** **STRONG.**

| Founder | Domain edge | Specific evidence |
|---|---|---|
| **Johnny** | Brain-encoding + AI swarm methodology | Synthetic Synesthesia work (90.4% Clair de Lune match across 20,484 vertices, 8 rounds of iteration, falsified against control music) — public, dated, shipped. Plus the published 77-mental-models-from-Naval/Lucky/Graham swarm experiment (3 of his 3 most-attracted-to videos use the exact methodology this product is built on) |
| **Junsoo** | TRIBE V2 + egocentric video pipelines | IDM-Lab egocentric-video supervision pipeline work (the Ironside angle defense's credibility chip per `tasks-by-person/junsoo-tribe-v2.md`); Sven Koenig orbit |
| **Jacob** | Multi-agent orchestration + observability | Nucleus production-pattern (the K2 swarm + cross-region-comm + observability is Jacob's resume narrative per `tasks-by-person/jacob-agent-swarms.md`) |
| **Emilie** | Packaging + storytelling craft | Claude Campus Ambassador craft; Nova Intelligence-quality bar; pitch-translation lane |

**YC partner reaction:** *"Founder-market fit is real — Johnny's published TRIBE work is a textbook FMF chip. Junsoo's prior egocentric-video work is the second chip. The team is over-qualified for this specific architecture."*

**Score: 9/10.** This is the single strongest YC-style answer in our profile.

**Where it's weak:** None of the team has shipped a CONSUMER product to real users. All prior work is research, hackathon, or B2B. *"Have you shipped consumer software at scale?"* — answer is no. YC partner would note this as a real gap if we positioned as a consumer-startup pitch (which we are, in the YC swap-slide).

---

## §2. Is this a fast-growing market?

**Question:** Is the market for this big now, or going to be big soon?

**Honest answer:** Murky.

**The market we're explicitly in:**
- Consumer "algorithmic awareness" tools — small, slow-growth, mostly-failed (see tar pit answer)
- Wellness apps — saturated, shrinking-CAC
- Brain-computer interfaces — pre-product, decade-out

**The market we're claiming will become big:**
- Personal data vaults / consumer data agency — speculative; no product has hit consumer scale yet
- Brain-grounded AI augmentation — pre-product; first-mover risk vs. category-creator opportunity
- Post-recommender consumer surfaces — speculative; depends on platform-policy / regulation we don't control

**YC partner reaction:** *"Like Scale AI in 2016 — small market today, claim it'll be big. The Scale AI bet worked because human-data-labeling actually became LLM-training-substrate. What's the analogous tailwind that makes brain-grounded consumer surfaces big in 5 years?"*

**Our answer:** BCI inevitability. As neural interfaces become consumer-grade (Neuralink trajectory, Apple's neural-band patents, etc.), the audit/un-blackbox surface for neural data becomes load-bearing infrastructure. **We're building the design pattern for human-AI partnership before the cognitive interface becomes invisible.** That's the future-vision argument from `prd-final.md` §3.

**Score: 5/10 today.** Speculative tailwind. Honest YC-partner score would be: *"Plausible. Show me one piece of evidence the BCI tailwind is < 3 years out."*

---

## §3. How acute is the problem?

**Question:** Is this a hair-on-fire problem, or a "would be nice"?

**Honest answer:** **Not hair-on-fire for the user (Maya).**

- Maya scrolls Reels too much. She knows it. She doesn't have a hair-on-fire pain that drives her to seek a tool. She has a low-grade malaise. (This is exactly why Mozilla RegretsReporter, Apple Screen Time, etc. failed — same malaise, no acute pain → no purchase intent.)
- The acute pain is at the SOCIETAL level (cultural flattening, generational thought convergence) — not at the user level.

**Where the problem IS acute:**
- For Listen Labs (the sponsor): they NEED multi-agent opinion-dynamics simulations. Acute commercial pain. ✅
- For Sideshift (the sponsor): they NEED consumer-data-agency surfaces. Acute commercial pain. ✅
- For Ironside (the sponsor): they NEED to add cognitive-state inference to their pixel-only pipeline. Acute commercial pain. ✅
- For YC's "future Obsidian" thesis: the personal-data-vault category is acute for early-adopter Obsidian/Notion power-users. ⚠️ Niche.
- For Johnny's published-corpus audience: people who saw the TRIBE V2 video and asked "what would you build with this?" Acute curiosity. ⚠️ Audience interest, not user pain.

**YC partner reaction:** *"You have B2B pain (sponsors need this), but you're pitching a B2C product (Maya). Maya doesn't have the pain. That's the asymmetry that breaks consumer-startup pitches every time. Either pitch as B2B (sell to platforms) or find the B2C user with acute pain — probably NOT 'Gen-Z teens' but maybe 'parents of Gen-Z teens' or 'high-school counselors' or someone for whom the convergence problem is observed close-up and creates real anxiety."*

**Score: 4/10 as B2C acute pain.** 8/10 as B2B sponsor-track-fit pain (which IS our hackathon track strategy).

---

## §4. Do you have competition?

**Question:** Counterintuitive YC point — competition is GOOD because it validates the market.

**Honest answer:** **Yes — and it's a healthy sign.**

| Competitor / Comparable | What they do | Where our differentiation lives |
|---|---|---|
| **Cortex.buzz** | TRIBE V2 attention-engineering as a service (the FORWARD direction) | We INVERT it. *"Big tech uses brain models for X; we use the same model for not-X."* Same model. Opposite direction. Manipulation-as-shield, not manipulation-as-weapon. |
| **Renaissance Research (HackTech 2025 winner)** | LLM debate triad on text-only inputs | Brain-encoding as grounding (not text-only); N region-specialists (not 3 fixed roles); user's own brain as auditor (not another LLM); video input (not search-box text). 4 structural differences. |
| **Mozilla RegretsReporter** | Browser extension for algorithm-audit | Same surface ambition; different evidence layer (RegretsReporter scrapes; we brain-encode). Different epistemology. |
| **Pol.is** | Consensus-forging discussion platform | Different mechanism (text-only consensus vs. brain-grounded individual + population) |
| **BeReal** | Anti-curation through scarcity | Same anti-algorithm-curation thesis; completely different mechanism (scarcity vs. transparency) |
| **Apple Screen Time / Headspace** | Wellness/measurement apps | Different rubric (we're YEA-side per Best Use of AI; they're NAY-side per our own positioning) |
| **Listen Labs internal** | Multi-agent simulation research | We complement, don't compete — they're the sponsor; we'd license/acquire/integrate |

**YC partner reaction:** *"Healthy competition signal. Cortex.buzz is the strongest comparable because it proves the TRIBE-V2-as-product path commercially viable. The 'we built the inverse' framing is a real positioning move — DoorDash relative to UberEats. The Renaissance Research differentiation is structural enough to defend in 10 seconds. PASS."*

**Score: 8/10.** Strongest YC-style answer after founder-market fit.

---

## §5. Is there something that just became possible?

**Question:** What changed recently that makes this product possible/necessary now?

**Honest answer:** **YES, multi-front.**

1. **TRIBE V2 released by Meta FAIR** — first public brain-encoding model accurate enough to run inference on consumer video input. Without this, the engine doesn't exist. (This is the Lovable-equivalent unlock — a foundation-model release that unlocks an entire product category.)
2. **K2 Cerebras at ~1,300 tok/s** — first inference engine fast enough to fan out per-region specialist agents within 90-second consumer interaction. Without this, the swarm runs offline-batch, not live-during-demo. SynthDebate (100K tokens) only fits at K2 speed.
3. **Cortex.buzz exists** — proves commercial viability of TRIBE V2 (the FORWARD direction). Validates the model as foundation infra. We invert.
4. **Gen-Z 2008-cohort hits adulthood** — first generation with no pre-algorithm reference frame; the user persona is now demographically real, not speculative.
5. **Algorithm-shaping discourse mainstreamed** — Filter World, Trends Slop, "personalization is a lie" framings are now consumer-readable language, not just academic. The pitch lands without needing to define the problem from scratch.

**YC partner reaction:** *"Five 'why now' factors, three of which (TRIBE V2 release, K2 speed, Cortex.buzz validation) are real recent technological events. This passes the why-now test. The Gen-Z demographic and discourse-mainstreaming factors are softer but reinforce."*

**Score: 9/10.** Best YC-style answer along with founder-market fit.

---

## §6. Is there a good proxy for this idea? (X for Y)

**Question:** Is there a successful product in another market we could "X for Y" against?

**Honest answer:** **Yes — multiple framings.**

- *"Spotify Wrapped for your brain"* (format reference per `research-context/004-spotify-wrapped-as-format.md`) — but trademark caveat held; not the product name
- *"Future Obsidian — your knowledge graph is your brain's response shape, not your typed notes"* (YC swap-slide framing per `prd-final.md` §6)
- *"BeReal vs the algorithm — but for cognitive divergence instead of social authenticity"*
- *"DuoLingo for content diversity — daily streak for activating brain regions your feed never touches"* (this is a NEW framing not in current locks; surfacing it as candidate not recommendation)
- *"Mint.com for personal data — see your data flowing across platforms in one place"* (vault frame extension)

**YC partner reaction:** *"X-for-Y proxies are STRONG validators. 'Future Obsidian for brain-response' is the most defensible because Obsidian itself proved consumer demand for personal-knowledge-vault. The Spotify Wrapped framing is the most viral because the FORMAT is already loved."*

**Score: 8/10.** Multiple defensible X-for-Y proxies; the YC swap-slide already lands "future Obsidian."

---

## §7. Would you work on this for a decade?

**Question:** Is the founder excited enough to spend 10 years here?

**Honest answer:** **For Johnny, yes — clearly.** His published TRIBE V2 corpus shows multi-month sustained interest BEFORE the hackathon. The 90.4% Clair de Lune work was 8 rounds of iterative scoring — not a quick experiment. The 77-mental-models swarm experiment shows he keeps coming back to the architecture. **This is not a flash interest.**

**For the rest of the team:** Lane-locked per Decision 003 — Junsoo is doing PhD-relevant work; Jacob is doing resume-relevant work; Emilie is doing Campus-Ambassador-relevant work. Each lane has a 1-year+ horizon. None of them are obviously committed to a 10-year build.

**YC partner reaction:** *"Founder commitment is real for Johnny. Team commitment is hackathon-scoped. If you were pitching as a startup, the YC partner would ask: 'Who's full-time after the hackathon? Anyone?' Honest answer: probably nobody, immediately. Maybe Johnny eventually. That's a Series A killer if you pitched today; that's fine for a hackathon."*

**Score: 7/10 for Johnny.** 4/10 for full team commitment as startup. **For hackathon evaluation, this question doesn't bind — but for Best Use of AI judging where YC-style founder-conviction signals matter, it's worth the team rehearsing the answer to "would you keep building this?"**

---

## §8. Is this a sustainable business?

**Question:** Software-scale or human-labor-scale?

**Honest answer:** **Software-scale, with one caveat.**

- TRIBE V2 inference: software (GPU compute scales)
- K2 swarm: software (inference scales)
- 3D viz: software (browser-side rendering scales)
- Hand-curated suggestions for Land card: **human-labor in current demo**, but production version uses one of three software approaches (reverse-lookup precomputed library / LLM-generate / search API per Open Item #2)
- Adaptation 2 share-card export: software
- SynthDebate sim: software (K2 inference scales)

**No agency / dev-shop component.** Production economics: marginal cost = inference cost per user session × sessions. Inference cost trends downward. Scales like a SaaS.

**YC partner reaction:** *"Software-scale economics. PASS. The hand-curated suggestions are a hackathon shortcut, not a structural problem."*

**Score: 9/10.**

---

## §9. Is this a scalable business?

**Question:** Per-user economics work at scale?

**Honest answer:** **Maybe.** Two paths held (per Open Item #7):

| Monetization path | Per-user economics | Scalability |
|---|---|---|
| **Path A — Hosted "FOR you"** (your data, you're the customer not the product) | Subscription model; cost = inference + infra per user; revenue = subscription | Scales like Notion / Obsidian Sync. Competitive with consumer SaaS norms. |
| **Path B — Local-first pay-once** (model + brain-data on-device) | One-time purchase; cost = R&D amortized; revenue = unit price × downloads | Scales like Pixelmator / Affinity. Lower LTV but lower CAC ceiling. |

**Both software-scale.** Difference is unit-economics curve shape, not whether it scales.

**YC partner reaction:** *"Both paths are viable. Path A scales bigger; Path B has better moat (local-first compute + on-device brain-data is a structural advantage). Honest answer for hackathon: pick Path A for the YC swap-slide because it has the bigger TAM story; mention Path B as the long-term moat."*

**Score: 8/10.**

---

## §10. Is this a good idea space (fertile vs. cursed)?

**Question:** Has this category produced winners recently? Is the wind at our back or in our face?

**Honest answer:** **Mixed.**

**Cursed adjacencies:**
- Wellness / screen-time apps (decade of failed attempts) — we differentiate against, but adjacency-stink risk is real
- Algorithm-audit tools (Mozilla / academic projects all failed) — same
- Consumer brain-tech (Muse, Emotiv, Neurable — modest exits, not category-defining)

**Fertile adjacencies:**
- Vertical AI agent products (15 of 64 TreeHacks 2026 winners per `wiki/scrapes/treehacks-2026-winners.md`) — we ARE a vertical agent stack
- Spatial/VLM-grounded products (8 of 64 TreeHacks 2026 winners) — we ARE spatial-VLM-grounded by way of brain-encoded perception
- Foundation-model-unlock products (Lovable / Cursor / Harvey) — we are TRIBE-V2-unlock product, structurally similar
- Personal-data-vault category (Obsidian / Notion / Anytype trajectory) — fertile recent

**YC partner reaction:** *"You're standing on the boundary between cursed (wellness/algorithm-audit) and fertile (vertical agent / foundation-model-unlock). Position carefully. If you let judges file you under 'wellness app,' you're cursed. If you position as 'vertical AI agent product unlocked by TRIBE V2 + K2,' you're fertile. The YEA/NAY rubric and the no-recommendation positioning are the wedge that puts you in fertile category."*

**Score: 7/10 with positioning discipline.** 4/10 if positioning slips into wellness adjacency.

---

## §11. Composite score + YC partner verdict

| Question | Score |
|---|---|
| FISP check | 6 |
| Tar pit escape | 4 |
| Evaluated hard enough | 7 |
| Not overthinking | 5 |
| §1 Founder-market fit | 9 |
| §2 Fast-growing market | 5 |
| §3 Acute problem | 4 (B2C) / 8 (B2B sponsors) |
| §4 Healthy competition | 8 |
| §5 Just-became-possible | 9 |
| §6 X-for-Y proxy | 8 |
| §7 Decade-commit | 7 (Johnny) / 4 (team) |
| §8 Sustainable | 9 |
| §9 Scalable | 8 |
| §10 Idea space | 7 (with positioning) |
| **Average** | **~6.7/10** |

**YC partner verdict (composite):**

> *"Founder-market fit is excellent. Why-now is excellent. Tar-pit escape is unconvincing. Acute pain is on the wrong side (B2B sponsors have it; B2C user doesn't). Idea space is on a knife-edge between cursed and fertile, depending on positioning discipline. If you came to me as a consumer startup pitch, I'd ask you to either (a) re-pivot to B2B and sell to platforms / Listen Labs / Sideshift, or (b) find the B2C user with acute pain — probably NOT Gen-Z teens but the people who observe Gen-Z's algorithmic shaping close-up. As a hackathon project specifically pitching Best Use of AI + multi-track, the positioning works because the rubric IS the product, the founder-market fit chip is rare, and the architectural differentiation from Renaissance is structural. Win-probability for Best Use of AI: 55-65% per the prior defensibility review. The hackathon scoring rewards founder-market-fit + just-became-possible + healthy-competition + scalable-business — all of which are 8-9/10 for us. The hackathon scoring DOES NOT heavily weigh acute-B2C-pain or tar-pit-escape, which are our weakest scores. Net: hackathon-defensibility is HIGH; startup-defensibility is MEDIUM-LOW."*

---

## §12. Concrete edits before Friday smoke gate (ordered by ROI per YC stress-test)

1. **Friday afternoon — talk to 3 actual Gen-Z teens.** Show them the demo. Note reactions. Cite in Devpost. ~1 hour. Massive YC-credibility lift; addresses Mistake 1 (FISP risk).
2. **Reframe FAQ Q-INT-1 (Renaissance differentiation) to lead with the "we built the inverse of Cortex.buzz" framing.** Cortex.buzz is the strongest just-became-possible comparable; surface it. Q-INT-15 already has this — promote it earlier in the FAQ deck.
3. **Add a "for whom is this acute?" answer to FAQ.** Don't claim Maya has acute pain; honestly answer *"the acute pain is at the population-scale (generational cognitive convergence) and we're betting that population-scale-pain becomes individually-felt-pain when the user can SEE it."* That's defensible.
4. **Add the X-for-Y proxy to the YC swap-slide explicitly** — *"Future Obsidian for brain-response data — Obsidian proved consumer-demand for personal knowledge vaults; we're the vault for the data type platforms don't give you."* That lands harder than current YC swap-slide copy.
5. **Stop writing PRD docs.** This stress-test is the last one. Use remaining time on Friday smoke gate + per-component pre-cache + final-pass polish per Mistake 4 (overthinking).

---

## §13. The Devora insight (from Jared's transcript — "domain expertise easier to learn than being a good builder")

> *"You don't need to be a domain expert. Domain expertise is easier to learn than learning to be a good builder."*

**Applied to us:** Johnny is a good builder (Synthetic Synesthesia + 77-mental-models swarm). Junsoo is a good builder (egocentric-video pipeline). Jacob is a good builder (Nucleus production-pattern). Emilie is a good builder (packaging craft). **None of them are deep neuroscience / consumer-AI domain experts.** That's fine per Devora pattern — Max went and talked to 100 lawyers.

**Hackathon equivalent of "talked to 100 lawyers":** The 6 yaps + 5 validation-findings docs + 16 decisions IS the team's domain-expertise-acquisition pass. We talked to (versions of) the user, the sponsors, the past winners, the canonical references. **The "talked to N domain experts" answer is real.**

**For the YC-style pitch line:** *"Johnny didn't work on TikTok's recommendation team. He just thought TRIBE V2 was going to change how we relate to algorithms, went and ran the experiments, and built it."* Mirrors the Devora founder origin story exactly.

---

## §14. Final lock-in question for Johnny

The composite score is 6.7/10. That's middling for a startup; that's strong for a hackathon. The places we're weakest (tar pit + B2C acute pain + team decade-commit) don't bind for hackathon scoring. The places we're strongest (founder-market fit + why-now + healthy-competition + scalable + sustainable) do bind for hackathon scoring.

**Three ways to act on this:**

| Option | Cost | Yield |
|---|---|---|
| **A. Execute the 5 concrete edits above** (talk to 3 teens, reframe Q-INT-1, add B2C-pain honesty, sharpen YC swap-slide, stop documenting) | ~3 hours | YC-credibility lift; Best Use of AI judges who think like YC partners (and many do) score higher |
| **B. Fold this stress-test into the FAQ ammunition deck** as Q-INT-16 through Q-INT-25 with verbatim answers | ~30 min | Pavilion-judge readiness; addresses YC-style questions in real-time |
| **C. Rest on the prior `yc-defensibility-review.md` + this stress-test as background context; ship as planned** | 0 hours | Hackathon ships; YC pitch is the YC swap-slide as already locked |

**Pick A, B, or C.** Or name a different cut.
