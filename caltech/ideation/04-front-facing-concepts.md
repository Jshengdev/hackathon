# Front-Facing Concept Sweep — Caltech Hacktech 2026

**Author:** Agent 4 of 4 (front-facing artifact lane)
**Date:** 2026-04-25
**Output target:** `caltech/ideation/04-front-facing-concepts.md`

---

## Header — Constraints, Archetypes, Sources

### Design constraints honored

- **Best Use of AI** is the hard target — every concept must make AI reasoning *visible*, not just *available*.
- **Non-blackbox is the moat.** Every concept exposes the K2 swarm's parallel reasoning + (where applicable) the TRIBE V2 brain-encoding sidecar as a first-class UI element, not a debug log.
- **Startup product, not art project.** No cute character animations. No Gather.town avatars. No anime mascots. No pixel highlighting on source video (Ironside lesson: pixel modification *worsens* model performance — augmentation must add a NEW modality channel).
- **Side-by-side framing strongly preferred** ("here's what GPT says alone — here's what our swarm says together").
- **Live "thinking visualization" strongly preferred** (token streams, agent disagreement heatmaps, knowledge graphs being constructed in real time).
- **5-second screenshot test:** every concept must yield ONE Devpost hero image that explains the value prop wordlessly.
- **Reuse Johnny's prior assets where they don't cost taste** — 3JS Lava Lab world (atmospheric depth, all-paths-visible) and iMessage UX (no-app-install B2C escape hatch) are pre-built primitives we should bias toward when they fit.
- **Emilie owns packaging** — every concept ships with a deliverables checklist she can execute in parallel during the build window.

### Archetypes covered (1 concept per archetype, 14 total)

1. Browser extension overlay
2. Web dashboard (knowledge-graph forward)
3. 3D scene viewer (Three.js)
4. iMessage / SMS bot
5. Mobile-web app (PWA, no install)
6. Mac menubar / system tray utility
7. Slack / Discord bot
8. Voice-only interface
9. Phone-as-wearable (lock-screen widget + push)
10. Print / PDF artifact (the AI generates a thing you keep)
11. Live broadcast overlay (OBS / streaming)
12. Side-by-side AI comparison tool
13. Augmented document reader
14. Real-time captioner / interpreter
15. Game-like simulation (startup-aesthetic only)

### Sources studied (visual + interaction reference)

- **Granola** — meeting note-taker. Their "live transcript on left, AI structured notes on right, both updating in real time" is the gold standard for visible AI thinking against a primary source.
- **Cursor** — Composer + Tab. The way agent reasoning streams in a side panel while code edits in the main pane — direct inspiration for the swarm-streams-while-output-builds pattern.
- **Perplexity** — "Sources" chips inline in answers. Direct fit for our `grounded-citation` pattern.
- **Linear AI** — minimal command palette, dense type, monochrome. The visual ceiling for "looks like a real product, not a hackathon."
- **Notion AI** — block-level AI invocation; "AI is a tool inside the document, not a separate app." Influences the browser-extension and document-reader concepts.
- **ChatGPT macOS app** — the menubar invocation pattern. Cmd-Space → AI → result. Direct fit for the menubar concept.
- **Anthropic Console workbench** — the "compare prompts side-by-side" panel. Direct fit for the comparison concept.
- **Devpost-winning demos (past 6 months):** the visual common denominator is "dashboard with a live data stream and a structured output panel" — almost never a 3D world unless 3D IS the data.
- **Three.js + React component libraries:** `@react-three/fiber`, `@react-three/drei`, `react-force-graph` (knowledge graph), `cobe` (globe), `tldraw` (collaborative canvas).

---

## Section 1 — 14 Front-Facing Concepts

---

### Concept 1: **GLASSPANE** (Archetype: Browser extension overlay)

- **What it IS:** A Chrome extension that injects a collapsible right-rail panel onto any video page (YouTube, Vimeo, internal site video player, Loom). Watches the active `<video>` element, sends keyframes to our pipeline, streams back a live "what is this video actually about" reasoning trace from the K2 swarm + brain-encoding sidecar.
- **The 5-second screenshot:** Hero shot is a YouTube page with a Granola-style right rail showing four columns of agents arguing in real-time about a frame, a brain-region heatmap below them, and one consensus line at the top: *"This is a circular saw being used dry — kickback risk in 4s."*
- **The interaction loop:** User watches video → clicks GLASSPANE icon → panel slides in → user sees swarm reasoning stream as the video plays → user pauses on a contentious moment → swarm re-runs with deeper budget → user can hover any consensus claim to see (a) which agents agreed, (b) which brain regions activated, (c) the 4-frame keyframe stack the claim was anchored to.
- **The visible non-blackbox element:** A live 4-column "agent debate" rail (Classifier / Narrator / Observer / Skeptic) with disagreement highlighted in amber. Every consensus statement has a hover-card showing which agents voted, with what confidence, and which brain regions lit up to support it.
- **The 5-min demo arc:**
  - **0–30s:** Open a YouTube video of someone using power tools wrong. Show the page bare. Click GLASSPANE.
  - **30s–2m:** Panel streams: "Classifier-3 says drill, Classifier-7 says impact driver — observer asks: is the chuck hex or keyed? — narrator: hex, sub-second on the bit-change frame — consensus: impact driver, kickback safe."
  - **2m–3:30:** Swap to an Ironside-style egocentric clip. Show the brain-encoding sidecar lighting up "tool/category/work" hierarchically (Junsoo's screwdriver insight made literal). Show a side-by-side: GPT-4o single-shot vs. our swarm — single-shot is wrong, swarm is right, with reasoning visible.
  - **3:30–4:30:** Pause, click a consensus claim, hover-card reveals the 4 keyframes + brain map + agent vote. "This is an audit trail."
  - **4:30–5:** Tagline reveal: *"Every video, glass-boxed."* Roadmap slide: enterprise audit logs, safety review, training-set curation, family-safety filtering for kids' content.
- **Tech surface:** Chrome MV3 extension (Plasmo framework) + WebSocket to FastAPI backend + K2 inference on Cerebras + TRIBE V2 sidecar + small React panel (Tailwind, shadcn). Keyframe extraction client-side via `<canvas>` to keep latency low.
- **Reuse Johnny's prior assets?** Partial — iMessage UX informs the chat-style left rail (each agent is "speaking"). 3JS world not used here.
- **Emilie packaging deliverables:**
  - Logo (single-letter G in monospace, glass-blur fill)
  - Color palette: slate-950 base, amber-400 disagreement, emerald-400 consensus, white-95 text
  - Launch video shot list: (1) cold-open of someone misidentifying a tool in a video, (2) cut to GLASSPANE installing in 3 clicks, (3) split-screen of "your eyes vs. GLASSPANE's eyes" with swarm rail visible, (4) close on the audit hover-card, (5) "Now imagine this on every video your insurance company watches."
  - Devpost hero: the panel screenshot above. One image, full value prop legible in 5 seconds.
- **Effort estimate:** ~22 person-hours (Jacob: extension shell + WebSocket plumbing 6h. Junsoo: K2 swarm orchestration + TRIBE sidecar 10h. Johnny: panel UI + keyframe extraction + hover-card UX 6h.)
- **Risk:** Chrome extension review delays demo. Mitigation: ship as unpacked dev extension, judges won't install, demo runs on our laptop.
- **Why this WINS Best Use of AI:** It makes AI reasoning *legible* over a primary source the judge already understands (web video). Every claim is grounded in a frame, every frame is grounded in an agent vote, every agent vote is grounded in a brain region. It's the rubric line "thoughtful application" *and* "transparency" *and* "novel modality" simultaneously.

---

### Concept 2: **CONSENSUS** (Archetype: Web dashboard, knowledge-graph forward)

- **What it IS:** A standalone web app at `consensus.app` (or whatever subdomain Emilie buys Saturday morning). Drag-drop a video, the dashboard renders a live-growing knowledge graph as the swarm reasons. Each node is a brain-region cluster, semantic category, or specific entity recognized; each edge is a confidence-weighted claim made by an agent.
- **The 5-second screenshot:** A dark dashboard, force-directed graph in the center with ~40 nodes glowing in different colors (brain regions = blue, semantic categories = green, entities = white), agent debate stream on the right, video timeline scrubber along the bottom with markers where consensus shifted.
- **The interaction loop:** User uploads video → the graph empties out → as K2 swarm processes second-by-second, nodes appear and connect → user clicks any node to see "which agents put this here, with what confidence, citing which timestamp" → user can rewind the graph (timeline scrubber) to see how understanding *evolved* over the video.
- **The visible non-blackbox element:** The graph IS the AI's "mental model" of the video. Watching it grow is watching the AI think. Confidence is rendered as edge thickness; disagreement is rendered as a dashed orange edge instead of solid green; resolved disagreement collapses two competing nodes into a single consensus node with a visible animation.
- **The 5-min demo arc:**
  - **0–30s:** Empty dashboard. Drag a 30-second Ironside clip onto it.
  - **30s–2m:** Graph explodes outward — first 8 brain-region nodes appear (TRIBE encoding done), then semantic categories peel off (TOOL, WORK, METAL), then specific entities (HAMMER, NAIL, REBAR). All with agent attribution chips.
  - **2m–3:30:** Two competing entity nodes appear in orange ("hammer" vs "mallet"). Swarm Q&A panel on right shows the Observer agent asking the Narrator to re-examine. Resolved → orange edges collapse to a single green "framing hammer" node with audit trail.
  - **3:30–4:30:** Show the "rewind" feature — scrub the timeline back 4 seconds, watch the graph un-form. Show a side-by-side at the same timestamp: Gemini single-call output (a flat string) vs. our knowledge graph (40 nodes). Quantitative win on the evaluation set.
  - **4:30–5:** Roadmap: enterprise video corpus indexing (search 400hrs of footage by *concept*, not keyword); evaluation harness for VLM benchmarks; medical/legal/finance audit dashboards.
- **Tech surface:** Next.js 16 + `react-force-graph-2d` (or `cosmograph` for performance at >500 nodes) + WebSocket streaming + Cerebras K2 + FastAPI orchestrator + Postgres for graph persistence.
- **Reuse Johnny's prior assets?** Yes — the 3JS Lava Lab "all paths visible simultaneously" aesthetic is the visual DNA. Atmospheric depth (recent in focus, older as texture) maps directly to "current consensus bright, prior states faded."
- **Emilie packaging deliverables:**
  - Logo: lowercase "consensus." with a glowing dot for the period
  - Color palette: ink-black base, three semantic family colors (brain=indigo, category=teal, entity=warm-white), single accent (amber for disagreement)
  - Launch video shot list: Granola-inspired, 60s — (1) "What if you could *see* an AI think?" voiceover over empty graph, (2) drag-drop, (3) graph explosion (slow-mo), (4) the disagreement-resolution animation in close-up, (5) cut to enterprise framing.
  - Devpost hero: a single high-resolution screenshot of the graph at peak density. THE money shot.
- **Effort estimate:** ~26 person-hours (Junsoo: swarm orchestration + KG schema 10h. Jacob: WebSocket + persistence + force-graph performance 10h. Johnny: dashboard chrome + interaction polish 6h.)
- **Risk:** Force-directed layouts thrash visually with frequent updates. Mitigation: queue layout recomputes at 4Hz max; lock node positions after first 2s of stability.
- **Why this WINS Best Use of AI:** This is the textbook "glass-box" demo. The judge looks at it and immediately understands: *the AI's reasoning is the UI*. Best AI rubric items "transparency" and "thoughtful design" are answered by the artifact's existence, not by argument.

---

### Concept 3: **VOXEL** (Archetype: 3D scene viewer, Three.js)

- **What it IS:** A web-based 3D scene viewer (`react-three-fiber`) where the *brain encoding* itself becomes the spatial substrate. The video plays in a small picture-in-picture window; the main canvas is a 3D point cloud of brain-region activations evolving over time, with floating text annotations from the K2 swarm anchored to the cluster they're reasoning about.
- **The 5-second screenshot:** A pitch-black canvas with a galaxy-like cloud of glowing particles (brain regions, color-coded by lobe), text labels floating in space ("TOOL/WORK", "HAND/GRIP", "NEAR-MISS"), small video PIP in upper-right. Camera is mid-orbit.
- **The interaction loop:** User loads a video → 3D galaxy of brain-regions blooms → as the video plays, particles pulse/shift to reflect the changing brain encoding → swarm agents annotate clusters with floating semantic labels → user can orbit/zoom freely → clicking any cluster pins a side-panel showing the agents' reasoning about that brain region's interpretation.
- **The visible non-blackbox element:** The brain encoding is rendered as physical space. The K2 swarm's reasoning is rendered as floating annotations *anchored in that space* — you can literally see "the AI's interpretation lives at coordinate (x,y,z) in brain-region space." Disagreement = two competing labels on the same cluster, weight by font size = confidence.
- **The 5-min demo arc:**
  - **0–30s:** Black screen. "What does an AI's understanding of a video look like, geometrically?" Load Ironside clip.
  - **30s–2m:** Galaxy blooms. Camera slowly orbits while video plays in PIP. Swarm annotations float in like subtitles in space.
  - **2m–3:30:** Pause video at a tool-use moment. Camera zooms into the "tool/category" cluster. Show two competing labels (hammer/mallet), then watch them resolve to one with a particle burst animation. Side-by-side panel: pure-VLM single shot label vs. our spatial reasoning.
  - **3:30–4:30:** Show "semantic search" — type "moments where the worker looked unsure" → camera flies to clusters where brain encoding showed uncertainty signatures, video timeline auto-scrubs. The brain is now a navigation surface.
  - **4:30–5:** Vision frame: this is the substrate for *every* video-understanding tool. Same canvas, swap the input domain — sports, medical, surveillance.
- **Tech surface:** Next.js + `@react-three/fiber` + `@react-three/drei` (HTML overlays, OrbitControls) + custom WebGL shader for cluster pulsing + WebSocket for live brain-encoding stream. TRIBE V2 inference on a separate GPU worker.
- **Reuse Johnny's prior assets?** YES — direct lift from the Lava Lab 3JS world. The atmospheric-depth + organic-not-mechanical aesthetic Johnny has already developed maps 1:1. This concept is *cheaper* for us to ship than for any other team because the visual DNA is already in his hands.
- **Emilie packaging deliverables:**
  - Logo: a single voxel rendered in 3D, slightly tilted
  - Color palette: deep space (#0a0a14), six lobe colors (parietal=teal, frontal=violet, occipital=amber, temporal=rose, motor=lime, limbic=cyan), white text
  - Launch video shot list: cinematic — opens with the galaxy blooming in slow-mo with ambient pad music, voice-over from Emilie, intercuts of the side-by-side, ends on the tagline shot of the brain-as-navigation-surface.
  - Devpost hero: a single perfectly framed screenshot of the galaxy mid-bloom. Should look like a piece of contemporary art that turns out to be an interpretability tool.
- **Effort estimate:** ~30 person-hours (Johnny: full visual lead, 16h leveraging prior 3JS code. Junsoo: TRIBE V2 → 3D coordinate mapping + swarm annotation pipeline 10h. Jacob: backend + WebSocket 4h.)
- **Risk:** Pretty risk — this concept is closest to the "art project" failure mode the team explicitly fears. Mitigation: keep the side-by-side comparison panel and the semantic search affordance dominant — they make it a *tool*, not a piece.
- **Why this WINS Best Use of AI:** It's the only concept where you can *literally see the geometry* of an AI's mental model. For the judges who give "creativity" and "AI" as combined criteria, this collapses both into one artifact. Plus: the brain-encoding modality is impossible to replicate without TRIBE V2 — defensible novelty.

---

### Concept 4: **GLASSBOX/SMS** (Archetype: iMessage / SMS bot)

- **What it IS:** Text a video link (or upload a video) to a phone number → receive a multi-message thread that reads like a group chat between AI agents debating what's in the video, ending with a single consensus message + a link to the full audit trail.
- **The 5-second screenshot:** An iMessage screenshot. User: "what's wrong in this video [link]". Then 4 typing-indicator bubbles appear stacked. Then 4 different "agents" (named avatars: Classifier, Narrator, Observer, Skeptic) reply in sequence with different takes. Then one bubble pinned to the bottom: "**Consensus: kickback risk in 4s — operator's grip is wrong.** [audit →]"
- **The interaction loop:** User texts video → instant typing indicators (the swarm "thinking") → 4 agent bubbles arrive in 8 seconds → consensus bubble lands → optional follow-up: "why?" triggers the swarm to expand reasoning in-thread.
- **The visible non-blackbox element:** The agent debate IS the message thread. The non-blackbox is the medium. Every agent has a distinct named persona (not anime — just "Classifier-A: SVM-style", "Narrator: causal-chain", "Observer: meta-reviewer"), and you watch them disagree, address each other, converge.
- **The 5-min demo arc:**
  - **0–30s:** Judge holds their phone (or we do, projected). Show the empty thread.
  - **30s–2m:** Send a video. Agents stream replies live. Judge watches a *real-time multi-agent debate* unfold in a UI they already know.
  - **2m–3:30:** Send a second video where agents *strongly disagree*. Show the Observer step-in resolving it with a meta-question. Show the audit link → opens a web view of the full reasoning graph (reuses Concept 2's graph!).
  - **3:30–4:30:** Side-by-side: a screenshot of GPT's flat one-line answer to the same video URL, vs. the iMessage thread.
  - **4:30–5:** Vision: every parent texting a TikTok to GLASSBOX before letting their kid watch. Every safety officer texting a site video. Every journalist texting a viral clip.
- **Tech surface:** Twilio SMS or iMessage Business Chat API (or shortcut — Apple Shortcuts that hits our endpoint and posts the result). FastAPI backend + K2 swarm + simple message-streaming. **Optional:** Apple Shortcut for instant install.
- **Reuse Johnny's prior assets?** YES — direct application of Johnny's prior iMessage conversational AI work. This is the *fastest* concept for us to ship because the chat-shaped UX is solved already.
- **Emilie packaging deliverables:**
  - Logo: a chat-bubble silhouette filled with a mini-graph
  - Color palette: iMessage-native (blue/grey bubbles, system fonts) — the trick is that the BRAND looks like Apple's, the value is in the AI debate
  - Launch video shot list: Apple-ad style, vertical aspect — finger taps "send video", agents stream in, consensus lands, hand puts phone in pocket. 30 seconds total. Shootable on Emilie's iPhone.
  - Devpost hero: a single iMessage screenshot, mocked in the Apple-style screenshot template
- **Effort estimate:** ~14 person-hours (Johnny: iMessage layer 6h, mostly already built. Junsoo: agent persona prompts + K2 streaming 6h. Jacob: webhook + Twilio glue 2h.) **Lowest-effort concept in the set.**
- **Risk:** Apple Shortcuts/iMessage Business Chat may need provisioning that doesn't fit the timeline. Mitigation: fall back to plain Twilio SMS — same demo, different medium.
- **Why this WINS Best Use of AI:** Zero-friction consumer surface. Demonstrates that the swarm is so fast (K2 = 1,300 tok/s) that the round-trip fits within the *expected latency of a text message*. The form factor itself is the proof of K2's speed — without K2, this UX is impossible.

---

### Concept 5: **GLASSBOX/MOBILE** (Archetype: Mobile-web app / PWA)

- **What it IS:** A mobile-first PWA at `m.consensus.app`. Camera button in the center bottom. Tap it → record short video (or pick from camera roll) → see a phone-native version of the dashboard: video at top, agent debate stream as scrolling messages below, expandable knowledge graph drawer.
- **The 5-second screenshot:** Phone mockup. Top half = video frame. Bottom half = chat-style agent stream with bubble colors. Small drawer handle at the bottom of the chat hints at the graph below.
- **The interaction loop:** Camera-capture or upload → swarm streams reasoning → consensus appears at top with a confidence ring → swipe up the drawer → see the graph.
- **The visible non-blackbox element:** Same as Concept 4's debate stream + Concept 2's graph, but composed in a single mobile surface. The drawer interaction makes the depth-of-reasoning a tactile gesture: pull up = see how it thinks; pull down = see the verdict.
- **The 5-min demo arc:**
  - **0–30s:** Hand-held phone shot. Open the PWA. Tap camera. Point at a setup we've staged (hand near saw-blade props on the demo table — startup-aesthetic, not literal).
  - **30s–2m:** Stream of agent messages. Confidence ring fills around the consensus. Pull-up drawer reveals the graph.
  - **2m–3:30:** Show offline mode — pre-recorded clip in camera roll, run swarm, side-by-side comparison opens as a modal.
  - **3:30–4:30:** Multi-clip aggregate: tag a clip as "interesting", swipe to next, build a personal "concept library" — the AI is helping the user cluster their own observations.
  - **4:30–5:** Vision: this is a "Pocket-AI auditor" for everyday consumers — every video they shoot, every clip they share, glass-boxed.
- **Tech surface:** Next.js PWA + WebSocket + camera-capture API (`getUserMedia`, `<input type="file" capture>`) + Cerebras K2 + TRIBE V2. iOS Safari "Add to Home Screen" for app-feel without store submission.
- **Reuse Johnny's prior assets?** Partial — chat-style UX from iMessage work, swarm stream layout from Concept 1.
- **Emilie packaging deliverables:**
  - App icon (PWA manifest) — same logo as web, slightly bolder for mobile resolution
  - Color palette: matches web Concept 2 but inverted (lighter for outdoor mobile use)
  - Launch video shot list: shot vertically on Emilie's iPhone — capture, debate stream, drawer pull, side-by-side. 45s, native Instagram/TikTok dimensions.
  - Devpost hero: phone mockup with the screenshot
- **Effort estimate:** ~20 person-hours (overlaps with Concept 2 — most of the backend is shared)
- **Risk:** iOS Safari camera permissions on first-time install can be flaky; pre-grant on demo phone.
- **Why this WINS Best Use of AI:** Demonstrates the swarm runs FAST enough for mobile. Pairs with Concept 2 to show *the same engine* serving B2B (dashboard) and B2C (PWA) — that's the YC angle.

---

### Concept 6: **AURA** (Archetype: Mac menubar utility)

- **What it IS:** A Mac menubar app (Electron or native SwiftUI). Hotkey (Cmd-Shift-G) → screenshot or screen-record the current window/region → AURA pops a Spotlight-style HUD that shows the swarm reasoning in real-time over the captured content.
- **The 5-second screenshot:** A floating glass-blur HUD centered on a Mac desktop, with a small thumbnail of the just-captured region on the left, a 3-column agent debate streaming on the right, and a one-line consensus at the bottom in monospace.
- **The interaction loop:** User is doing anything on their Mac (watching a Zoom recording, scrolling Twitter, reading a PDF) → hits hotkey → captures region → HUD streams the swarm's interpretation → user dismisses with Esc, or clicks "send to dashboard" to persist.
- **The visible non-blackbox element:** The HUD's right panel is a 3-column live token stream from the swarm — you watch K2 *typing* the agents' reasoning at 1300 tok/s. The speed is the demo. The HUD looks like ChatGPT's macOS app but with three concurrent streams.
- **The 5-min demo arc:**
  - **0–30s:** Open a YouTube video at full screen on the demo Mac. Pause on a frame.
  - **30s–2m:** Cmd-Shift-G. HUD pops. Three streams race in parallel — watching tokens fly is the entire point. Consensus in 4 seconds. Compare: a 4-second wait would feel slow; against ChatGPT-app's typical 8-second think, ours is twice as fast AND shows three perspectives.
  - **2m–3:30:** Demo on a non-video target — capture a chart from a PDF. AURA reads it. Capture a Slack message thread. AURA summarizes who said what. The general-purpose framing emerges.
  - **3:30–4:30:** Side-by-side ChatGPT macOS app vs. AURA on the same input.
  - **4:30–5:** Roadmap: AURA is the OS-level "see what the AI sees" surface. Eventually: continuous ambient capture of your workday with privacy-respecting on-device cap (this is the YC pitch).
- **Tech surface:** Tauri (Rust + WebView) for menubar shell + native screen-capture API + WebSocket to backend + Cerebras K2 streaming. Hotkey via global shortcut API.
- **Reuse Johnny's prior assets?** Minimal — but the design ethos of "tool that breathes when you breathe" from his figbuild aesthetic notes maps to the HUD's glass-blur ambient feel.
- **Emilie packaging deliverables:**
  - Logo: a circular aura ring (single line)
  - Color palette: macOS-native vibrancy materials, single accent (electric purple)
  - Launch video shot list: screen-recording Mac demo, voiceover. Hotkey, capture, stream, dismiss. 30s.
  - Devpost hero: a clean macOS desktop screenshot with the HUD floating, drop-shadowed
- **Effort estimate:** ~24 person-hours (Tauri scaffold takes time; screen capture permissions on macOS are a known gotcha)
- **Risk:** macOS screen-recording entitlement requires signed app — may need to demo unsigned with permission pre-granted on demo machine. Workable.
- **Why this WINS Best Use of AI:** The token-stream speed IS the K2 pitch. This is the only concept where the audience can *literally see* 1,300 tok/s as a perceptual experience. IFM judges who care about K2's throughput will recognize the demo as honest to the model's capability.

---

### Concept 7: **PARLIAMENT** (Archetype: Slack / Discord bot)

- **What it IS:** A Slack/Discord bot. Drop a video link, image, or document into a channel; tag `@parliament`; the bot replies in a threaded conversation where each "agent" is a separate bot persona that posts its take, with a final summary message and a link to the audit dashboard.
- **The 5-second screenshot:** A Slack thread where 4 bot avatars (Classifier, Narrator, Observer, Skeptic) have replied in sequence, with the last message from `@parliament-mod` summarizing consensus. Right side panel shows the inline knowledge-graph preview.
- **The interaction loop:** Team-channel native — drop content, tag bot, swarm debates *in your team's chat*, persists as a record everyone can revisit. Hover any agent reply to see brain-region attribution.
- **The visible non-blackbox element:** The agent debate happens *in the team's normal communication surface*. Your engineering team can audit the AI's reasoning by scrolling Slack. No separate tool, no separate login.
- **The 5-min demo arc:**
  - **0–30s:** Open Slack in a channel pre-staged with a few past Parliament threads (so the judge sees it has history). Drop a fresh video into the channel.
  - **30s–2m:** Tag bot. Agents stream replies in real-time as a Slack thread. Watch the typing indicators dance.
  - **2m–3:30:** Click "audit" on the consensus message → opens a Slack canvas (or a popover web view) showing the full graph (Concept 2 reused).
  - **3:30–4:30:** Show the team-context superpower: "Parliament, also check our prior thread from Tuesday — does this video contradict what we concluded then?" Bot replies with cross-thread reasoning.
  - **4:30–5:** Roadmap: every team's video review meeting becomes asynchronous + auditable. Insurance, manufacturing safety, content moderation, journalism fact-check.
- **Tech surface:** Slack Bolt SDK (TypeScript) + FastAPI orchestrator + K2 swarm + Postgres for thread history. Discord version uses `discord.js` with the same backend.
- **Reuse Johnny's prior assets?** Minimal — but the Vercel `chat-sdk` skill noted in the environment is literally built for this multi-platform bot pattern.
- **Emilie packaging deliverables:**
  - Logo: a chamber-of-debate icon (3 chairs in a semicircle)
  - Color palette: Slack-native light/dark + single brand accent (deep teal)
  - Launch video shot list: screen-recording Slack, agent replies streaming, audit click, web view reveal. 60s.
  - Devpost hero: Slack thread screenshot, slightly cropped, with the audit-popover composited in.
- **Effort estimate:** ~18 person-hours
- **Risk:** Slack rate-limits multiple bot personas posting in rapid succession. Mitigation: post all 4 agent replies as a single message with rich formatting, keep the typing-indicator illusion via `chat.update`.
- **Why this WINS Best Use of AI:** Enterprise/B2B angle. Shows the swarm fits a team's existing workflow without forcing tool adoption. For the Best AI rubric line "thoughtful design / fits real use", this is the strongest answer.

---

### Concept 8: **WHISPER** (Archetype: Voice-only interface)

- **What it IS:** A phone number you call (or a button on a web page that opens a WebRTC call). You describe a video, situation, or question verbally. The swarm listens, debates internally (you hear a soft ambient sound bed of agent murmurs — *not* literal voices, more like a UI sound), and a single voice replies with the consensus + offers to send you the full audit link via SMS.
- **The 5-second screenshot:** Hard for voice — so the Devpost hero is a stylized waveform with the user's question transcribed at top, the consensus answer transcribed at bottom, and a small "agent activity" shimmer in between.
- **The interaction loop:** Call → speak → ambient swarm sound while reasoning → single voice replies with consensus → optional "tell me more" expands → optional "audit me" texts a link.
- **The visible non-blackbox element:** A live transcript pane (on the web version) that shows the swarm agents' INTERNAL reasoning as text-on-screen *while* the user is talking, and the final voice reply *cites* which agents agreed. "The Classifier, Narrator, and Observer all agree — only the Skeptic flagged a 12% concern about lighting." Skeptic is named by the voice.
- **The 5-min demo arc:**
  - **0–30s:** Big phone-call interface on screen. Judge dials the number from their own phone.
  - **30s–2m:** Judge describes a scenario ("I just saw someone use a circular saw without a guard, what should I do?"). Voice replies after a 3-second swarm-sound interlude.
  - **2m–3:30:** Show the live transcript on the web — the agents debated the question in text while the user spoke, the voice synthesis was just the consensus.
  - **3:30–4:30:** Side-by-side ChatGPT voice vs. WHISPER for the same question. ChatGPT gives one perspective; WHISPER gives a debated, audited consensus with a citation chip.
  - **4:30–5:** Vision: voice-first AI that you can *trust*, because the reasoning is auditable even though the medium is voice.
- **Tech surface:** Twilio Voice + Deepgram STT + ElevenLabs TTS + K2 swarm orchestrator + WebRTC for the live transcript view. Or `Vapi` for faster setup.
- **Reuse Johnny's prior assets?** Minimal direct reuse but the iMessage UX background informs how we shape the "reply" structure.
- **Emilie packaging deliverables:**
  - Logo: a stylized waveform inside a circle
  - Color palette: deep navy + warm white + single accent
  - Launch video shot list: documentary-style, Emilie holds the phone to her ear in a noisy outdoor setting, asks a question, hears the answer. Captioned for accessibility. 45s.
  - Devpost hero: the stylized transcript image described above
- **Effort estimate:** ~22 person-hours (voice infra is its own beast)
- **Risk:** Latency — even with K2 fast, full-stack voice round-trip can hit 4-6s, which feels long. Mitigation: cover with the ambient swarm sound bed (not silence). Honest delay framing: "you hear the swarm thinking."
- **Why this WINS Best Use of AI:** Demonstrates that even in a *no-screen* modality the AI's reasoning can still be glass-boxed via voice + transcript. The swarm sound bed is a novel UX primitive (subtle, not gimmicky).

---

### Concept 9: **PIN** (Archetype: Phone-as-wearable / lock-screen widget)

- **What it IS:** A iOS/Android app whose primary surface is a Lock Screen Live Activity widget. You point your phone camera at something (held up like a wearable), the widget shows a continuously-updated swarm reading of the scene as a 3-line condensed verdict + confidence pill, even when the phone is "locked."
- **The 5-second screenshot:** iPhone lock screen. Time at top. Below it, a Live Activity widget rendering: top line "**SAW IN USE — kickback risk**", second line "no eye protection (3/4 agents agree)", confidence pill 87%, micro-graph icon.
- **The interaction loop:** User opens the app → camera goes live → phone is held up like a wearable scanner → Live Activity persists on the lock screen and Dynamic Island → swarm continuously updates the widget content.
- **The visible non-blackbox element:** Tap the widget → phone unlocks into the full mobile dashboard (Concept 5) showing the agent reasoning trace. The widget is the surface; the trace is one tap away.
- **The 5-min demo arc:**
  - **0–30s:** Show the lock screen on a demo phone. Empty Live Activity area.
  - **30s–2m:** Open the app. Point the phone at the staged demo setup. Lock the phone. Lock-screen widget materializes and updates as the camera (still active in background) feeds frames.
  - **2m–3:30:** Move the camera to a new scene. Watch the verdict change in real-time on the lock screen — within ~2 seconds, the new consensus lands. THIS is the K2-speed pitch in tactile form.
  - **3:30–4:30:** Tap the widget, full audit opens.
  - **4:30–5:** Roadmap: Apple Watch faces, Vision Pro spatial overlays, future pin-style hardware (Humane / Rabbit etc.), accessibility tools for the visually impaired.
- **Tech surface:** SwiftUI iOS app + ActivityKit (Live Activities) + on-device frame downsampling + WebSocket to backend + K2. Android version: Foreground service + persistent notification + MediaProjection.
- **Reuse Johnny's prior assets?** No direct reuse — this is fresh.
- **Emilie packaging deliverables:**
  - Logo: a pin / map-marker silhouette
  - Color palette: native iOS system + single brand accent
  - Launch video shot list: Apple-ad style, vertical, hand holding phone in various environments — café, construction site, kitchen. Each scene the widget updates. 45s.
  - Devpost hero: lock-screen mockup
- **Effort estimate:** ~32 person-hours (native iOS + ActivityKit is a learning curve unless someone on the team has shipped a Live Activity before)
- **Risk:** ActivityKit requires App Store provisioning and has strict update budgets. **Likely too risky for the 36hr window** — keep this as a fallback / future concept.
- **Why this WINS Best Use of AI:** Compelling future vision — the AI's reasoning living *on your lock screen* is a category most teams won't even attempt. But effort cost likely disqualifies for this hackathon. Recommend: deprioritize unless the team includes someone with prior native iOS shipping.

---

### Concept 10: **DOSSIER** (Archetype: Print / PDF artifact)

- **What it IS:** Upload a video → backend runs the full swarm + brain-encoding pipeline → outputs a beautifully typeset, multi-page PDF "dossier" that documents the AI's reasoning end-to-end. The artifact is the takeaway. Looks like a McKinsey deliverable, reads like a court-admissible report.
- **The 5-second screenshot:** A single page from the PDF. Top: a frame from the video. Middle: a row of 4 small agent-reasoning cards (Classifier, Narrator, Observer, Skeptic) with their take + confidence bars. Bottom: a signed-off consensus with a citation chip pointing to the timestamp + brain-region anchor.
- **The interaction loop:** Upload video → wait ~30s → download PDF. The interaction is the artifact.
- **The visible non-blackbox element:** The PDF itself. Every page is a non-blackbox. Every claim has a citation. The PDF is the literal embodiment of "show your work."
- **The 5-min demo arc:**
  - **0–30s:** Show a stack of three pre-generated dossiers printed and bound on the demo table. Hand one to a judge.
  - **30s–2m:** Walk through the dossier with them — point to the agent debate page, the brain-encoding heatmap appendix, the citations. The judge reads while you narrate.
  - **2m–3:30:** Live demo — drag a fresh video onto the web upload, watch the dossier render in real-time in the browser.
  - **3:30–4:30:** Show the side-by-side: ChatGPT's "summary" of the same video (a flat paragraph) vs. our 12-page dossier with citations.
  - **4:30–5:** Roadmap: this is what AI deliverables look like when you can defend them in court / to your insurance company / to a regulator.
- **Tech surface:** React-PDF or LaTeX + Puppeteer + K2 swarm + TRIBE V2. Hosted as a Vercel function that streams the PDF.
- **Reuse Johnny's prior assets?** No direct, but his "design the rules, not the outcomes" + "stats, not scores" aesthetic is a direct fit for the dossier style.
- **Emilie packaging deliverables:**
  - Logo: a single hand-stamped seal mark
  - Color palette: cream paper + ink + single warning red for safety claims
  - Launch video shot list: tabletop shot, hands flipping through the printed dossier in slow-mo with editorial music. 30s.
  - Devpost hero: a single perfectly-typeset PDF page screenshot OR a photo of the printed bound document on a desk
- **Effort estimate:** ~16 person-hours (the typesetting is the work; everything else is shared backend)
- **Risk:** PDF generation latency — Puppeteer is slow. Mitigation: pre-render assets, only LLM-stream the prose into a known template.
- **Why this WINS Best Use of AI:** The PDF is the only concept where the *deliverable persists offline*. Judges remember things they can hold. The "we printed three of these so you could take one home" move is a memorable, low-tech moat. For the Ironside/Best AI/Not So Sexy intersection, this also lands the "real-world workflow output" angle.

---

### Concept 11: **STREAMSCOPE** (Archetype: Live broadcast overlay / OBS scene)

- **What it IS:** An OBS plugin (or a browser-source URL) that overlays the swarm's reasoning on a live broadcast/stream. Streamers, sports broadcasters, or live event operators add it as a scene; viewers see real-time AI commentary on what's happening *with the swarm visibly debating in a corner panel*.
- **The 5-second screenshot:** A Twitch-style broadcast layout. Main video in the center. Bottom-right corner: a slick semi-transparent panel showing 4 agent streams + a consensus bar that updates every few seconds. The panel looks like a sports broadcast lower-third.
- **The interaction loop:** Streamer adds STREAMSCOPE as an OBS scene → goes live → viewers see live AI debate alongside content → viewers can click through to the audit dashboard during/after the stream.
- **The visible non-blackbox element:** The broadcast overlay IS the non-blackbox surface. The swarm debating in the corner is on every viewer's screen, every stream, every minute. The reasoning is *publicly visible* in a way that no other concept achieves.
- **The 5-min demo arc:**
  - **0–30s:** Show OBS open with a webcam feed of the demo table.
  - **30s–2m:** Drag STREAMSCOPE in as a browser source. The corner panel populates as the swarm reads what's on the demo table in real-time.
  - **2m–3:30:** Switch the OBS scene to a YouTube clip of a sports moment / construction safety video. Watch the swarm narrate live.
  - **3:30–4:30:** Show the audit URL — viewers who watched the stream can pull up the post-stream report with timestamps.
  - **4:30–5:** Roadmap: live broadcast with on-screen AI commentary becomes a category — sports analytics, safety-monitored construction live-streams, live moderation for streaming platforms.
- **Tech surface:** OBS browser source = a hosted web page → Next.js + WebSocket + K2 swarm. The page is full-screen-able as a chromakey-friendly overlay.
- **Reuse Johnny's prior assets?** Minimal.
- **Emilie packaging deliverables:**
  - Logo: a stylized broadcast tower
  - Color palette: broadcast-friendly (high contrast, accessible chroma)
  - Launch video shot list: broadcast-style demo with two windows — the streamer's OBS view and the viewer's browser view, side by side. 60s.
  - Devpost hero: the broadcast overlay screenshot
- **Effort estimate:** ~18 person-hours (mostly shared with Concept 2's backend)
- **Risk:** OBS browser-source rendering can be flaky with WebGL. Mitigation: keep the overlay 2D Canvas/CSS only.
- **Why this WINS Best Use of AI:** Public/social proof angle. The swarm reasoning becomes part of the *content*, not separate from it. Strong fit for Listen Labs ("simulating humanity's collective reading of an event") and Sideshift (a consumer-facing creator tool).

---

### Concept 12: **ARENA** (Archetype: Side-by-side AI comparison tool)

- **What it IS:** A web app that runs the same input (video, image, document) through THREE pipelines simultaneously and renders them in a 3-column comparison: (1) GPT-4o single-shot, (2) Gemini 2.5 single-shot, (3) our K2 swarm + brain-encoding stack. Each column shows the answer + (in our column) the live debate trace + brain-encoding sidecar.
- **The 5-second screenshot:** Three columns. Left two = clean text answers (sterile). Right column = a rich live-streaming agent debate + a knowledge-graph subwindow + a brain-encoding heatmap thumbnail. The asymmetry IS the value prop.
- **The interaction loop:** Drag input → all three pipelines start simultaneously → user watches the columns fill in → can vote (Anthropic Console-style) for which answer they trust most → ARENA records votes, feeds back into pipeline ranking.
- **The visible non-blackbox element:** The contrast IS the non-blackbox proof. Other systems give you an answer; we give you reasoning. That difference is *visible* in the column asymmetry.
- **The 5-min demo arc:**
  - **0–30s:** Empty 3-column shell. Drag a hard input (a frame where VLMs typically hallucinate).
  - **30s–2m:** Three columns fill in parallel. Other two finish first with confident-but-wrong answers. Our column finishes ~3 seconds later with the right answer + visible trace showing why the others were wrong.
  - **2m–3:30:** Run a benchmark suite live — 10 inputs in sequence, accuracy delta visible. Our column wins X/10.
  - **3:30–4:30:** Click any past comparison → opens the full audit (Concept 2's graph reused).
  - **4:30–5:** Vision: ARENA is the eval harness for the post-blackbox era of AI. Every model release, every prompt change, gets a fair public-comparable trace.
- **Tech surface:** Next.js + WebSocket + 3 separate inference workers (OpenAI API, Gemini API, our stack). Vercel AI Gateway can simplify the routing.
- **Reuse Johnny's prior assets?** No direct. The "all paths visible simultaneously" aesthetic from Lava Lab maps to the 3-column always-on framing.
- **Emilie packaging deliverables:**
  - Logo: three vertical bars
  - Color palette: neutral grey for competitors, brand color for our column
  - Launch video shot list: single-take screen recording, drag-drop, columns race, the difference is the punchline. 30s.
  - Devpost hero: the 3-column screenshot at peak
- **Effort estimate:** ~20 person-hours
- **Risk:** Other vendors' API latency varies day-to-day; the comparison may not always favor us in real-time. Mitigation: pre-cache 5 hand-picked inputs where we know we win, those are the demo inputs.
- **Why this WINS Best Use of AI:** This is the most *direct* answer to "best use of AI" — by making the comparison visible, it forces the judge to recognize that "use of AI" isn't a binary; it's a quality. The transparency premium is shown, not told.

---

### Concept 13: **SCRIBE** (Archetype: Augmented document reader)

- **What it IS:** A web reader for PDFs/long-form docs/transcripts. As the user scrolls, the right margin streams a live swarm-of-agents reading along with them, each pointing out things from a different lens (technical accuracy, factual claims, tone, missing context). The swarm produces a running marginalia that mimics a panel of expert readers.
- **The 5-second screenshot:** A two-pane reader. Left = document. Right = stream of margin-notes in chat-bubble style, color-coded by agent. Highlights in the document text show which passage triggered which note.
- **The interaction loop:** Open document → scroll → margin notes stream as the user scrolls → click a note to jump back to the passage that triggered it → user can ask follow-up to a specific agent.
- **The visible non-blackbox element:** The marginalia IS the swarm. Each agent's notes are visually distinct. The user reads alongside a debating panel.
- **The 5-min demo arc:**
  - **0–30s:** Open SCRIBE with a famous fraught document — a controversial paper, a hyped product launch FAQ, a corporate filing.
  - **30s–2m:** Scroll. Watch margin notes stream — Classifier flags claim types, Narrator paraphrases, Observer cross-checks against external context, Skeptic raises doubts.
  - **2m–3:30:** Click one of Skeptic's notes → reader jumps to the passage. Click "expand" → swarm re-reasons on that passage with deeper budget.
  - **3:30–4:30:** Show side-by-side: ChatGPT's summary of the same document (one paragraph) vs. SCRIBE's 40 marginalia notes with citations.
  - **4:30–5:** Vision: SCRIBE is what reading looks like in the post-AI-summary era. Not "read this 3-page summary"; "read the original *with* a panel of AI experts."
- **Tech surface:** Next.js + PDF.js + WebSocket + K2 swarm. Optional: brain-encoding the *visual layout* of the document (TRIBE V2 on rendered pages) for a layout-aware semantic layer.
- **Reuse Johnny's prior assets?** Strong fit for his "augment, not replace" thesis — SCRIBE is literally augmenting reading, not replacing it.
- **Emilie packaging deliverables:**
  - Logo: a quill / margin-note glyph
  - Color palette: paper white + ink black + 4 agent accent colors
  - Launch video shot list: editorial style, scrolling document with margin notes appearing in slow-mo. 45s.
  - Devpost hero: a full reader screenshot mid-scroll
- **Effort estimate:** ~22 person-hours
- **Risk:** TRIBE V2 may not give meaningful encodings on rendered PDFs. Mitigation: drop the brain-encoding for documents, lean on swarm-only.
- **Why this WINS Best Use of AI:** This is the *Johnny-thesis-pure* concept. "Generation effect" alive — user must engage with primary source; AI augments without replacing. Strong fit for Best AI rubric "thoughtful design / human-augmenting" criteria.

---

### Concept 14: **REALSPEAK** (Archetype: Real-time captioner / interpreter)

- **What it IS:** A real-time captioning interface for live spoken content (a meeting, a lecture, a Twitch stream, an in-person conversation). As speech happens, captions appear on screen. *Underneath* each caption, the swarm streams a continuous reading: "is the speaker confident? is this claim factually supported? is there context the audience is missing?" — like a live-fact-checker for any spoken content.
- **The 5-second screenshot:** Bottom 1/3 of a screen. Top line = current spoken caption. Middle row = three small agent badges flagging things ("UNVERIFIED CLAIM" / "CONFIDENCE: low" / "MISSING CONTEXT: refers to event from 2024"). Bottom = one consensus line.
- **The interaction loop:** Open REALSPEAK in a tab, alongside any meeting/stream/lecture → it captures audio → streams captions + swarm fact-check → user can pause, expand, or dismiss any flag.
- **The visible non-blackbox element:** The flags are the swarm voting. Hover any flag → see which agents raised it and why.
- **The 5-min demo arc:**
  - **0–30s:** Open REALSPEAK alongside a YouTube live stream of a politician/CEO/streamer.
  - **30s–2m:** Watch captions + swarm flags appear in real-time. The swarm catches a misstated statistic, flags it, audit shows the source.
  - **2m–3:30:** Switch to live in-person — Emilie speaks into a mic in the demo space. REALSPEAK fact-checks her live. (She makes a deliberately wrong claim; the swarm catches it.)
  - **3:30–4:30:** Side-by-side YouTube auto-captions vs. REALSPEAK. Captions alone vs. captions + swarm reading.
  - **4:30–5:** Vision: every meeting has a fact-checking copilot that doesn't interrupt. Every lecture is annotated. Every press conference is audited live.
- **Tech surface:** Deepgram streaming STT + WebSocket + K2 swarm + lightweight web overlay. Optional: TRIBE V2 on speaker's video for emotion/confidence priors.
- **Reuse Johnny's prior assets?** No direct.
- **Emilie packaging deliverables:**
  - Logo: a speech-bubble with a checkmark inside
  - Color palette: high-contrast for readability + 3 flag colors (red / amber / blue)
  - Launch video shot list: split-screen of a live event with REALSPEAK overlay catching a fact in real-time. 30s.
  - Devpost hero: the overlay screenshot composited over a stock CEO-on-stage image
- **Effort estimate:** ~22 person-hours
- **Risk:** STT latency + swarm latency = noticeable lag on live audio. Mitigation: render captions instantly (no swarm), then "decorate" them with flags 2-3 seconds later. The decoration delay is acceptable.
- **Why this WINS Best Use of AI:** Live, public-facing AI accountability. Demonstrates the swarm's value in a setting where the *cost of being wrong* is publicly observable. Listen Labs angle: this IS a live model of how a thoughtful audience would reason about spoken content.

---

### Concept 15: **CONSTELLATION** (Archetype: Game-like simulation, startup-aesthetic)

- **What it IS:** A web simulation where the swarm itself is the game. The user gives a "scenario seed" (a video, a question, an image). The screen renders a *constellation* of agent-stars in a deep-space canvas; you watch them pulse and exchange light-trails as they reason. Confidence makes a star brighter; agreement makes a constellation form. The user can tap any star to "interview" that agent. NOT cute — this is `cosmograph`/Three.js abstract space, not characters.
- **The 5-second screenshot:** A pitch-black canvas, ~30 glowing nodes connected by faint trails of light, with a few brighter nodes clustered into a recognizable consensus shape. A small UI panel on the bottom shows the current consensus statement and a confidence ring.
- **The interaction loop:** Submit a scenario → constellation blooms → user watches stars cluster, disagree, re-cluster → user can tap a star to read its current "thought" → user can introduce a new piece of information ("what if I add this frame?") to perturb the constellation and watch it re-form.
- **The visible non-blackbox element:** The whole canvas is the non-blackbox. The clustering animation IS the consensus emerging. Bright stars are confident; dim stars are uncertain. Disagreement is visible as competing constellation shapes that resolve.
- **The 5-min demo arc:**
  - **0–30s:** Black canvas. Drop a frame onto it.
  - **30s–2m:** Constellation blooms. Watch consensus emerge over 8 seconds. Confidence ring fills.
  - **2m–3:30:** Perturb — add a new fact ("the worker is actually wearing safety glasses, you missed it"). Watch the constellation re-form. Some stars dim, others brighten. New consensus.
  - **3:30–4:30:** Show the side-by-side: a flat ChatGPT answer vs. our perturbable, interactive consensus surface.
  - **4:30–5:** Vision: this is what AI debate *should* look like — a reasoning surface you can probe, perturb, and trust because you watched it form.
- **Tech surface:** Three.js / `cosmograph` + WebSocket + K2 swarm. Heavy on visual polish, lighter on backend novelty than other concepts.
- **Reuse Johnny's prior assets?** YES — strongest reuse of the 3JS Lava Lab world. Atmospheric depth, organic-not-mechanical, all-paths-visible all map directly.
- **Emilie packaging deliverables:**
  - Logo: a small constellation glyph
  - Color palette: deep space + warm-white stars + single accent for disagreement
  - Launch video shot list: cinematic, slow-motion bloom + perturb sequence with ambient music. 60s.
  - Devpost hero: a single peak-bloom screenshot
- **Effort estimate:** ~28 person-hours
- **Risk:** Crosses the "art project" line if not paired with a clear value-prop overlay. Mitigation: keep a very prominent consensus statement + confidence ring visible at all times — the canvas is the *medium*, not the message.
- **Why this WINS Best Use of AI:** The most novel "AI thinking visualization" we can ship. Listen Labs angle is overwhelming — this LITERALLY is a society of brain-encoded agents simulating cognition. Creativity track lands hard. But: tied for highest "art project" risk.

---

## Section 2 — Reusability Matrix

| Primitive | Used in concepts | Build effort | Reuse value |
|---|---|---|---|
| **K2 swarm orchestrator** (the 4-agent Classifier/Narrator/Observer/Skeptic chain) | ALL (1–15) | 8h | **Critical** — single biggest investment, reused everywhere |
| **TRIBE V2 brain-encoding sidecar service** | 1, 2, 3, 5, 7, 8, 9, 10, 11, 13 | 6h | **Critical** — but only used where video is the input |
| **WebSocket streaming protocol** (agent-by-agent token stream from K2 → frontend) | 1, 2, 3, 5, 6, 7, 8, 11, 12, 13, 14, 15 | 3h | **Critical** |
| **Knowledge graph viz** (`react-force-graph` or `cosmograph`) | 2, 3, 5, 7, 15 | 6h | **High** |
| **Agent debate stream UI** (chat-bubble column, agent-named avatars) | 1, 4, 5, 6, 7, 11 | 4h | **High** |
| **Side-by-side comparison shell** (3-column reusable React component) | 1, 2, 4, 5, 6, 7, 10, 11, 12, 13, 14 | 4h | **Very High** — almost every demo has this |
| **Citation chip + audit hover-card** (`grounded-citation` pattern) | 1, 2, 5, 7, 10, 12, 13, 14 | 3h | **High** |
| **Frame extraction + preprocessing pipeline** (canvas-based keyframe sampler) | 1, 5, 9, 11, 14 | 3h | **High** |
| **3D viewer scaffold** (R3F + OrbitControls + drei HTML overlays) | 3, 15 | 6h | Medium — only 2 concepts but Johnny has prior code |
| **PDF rendering pipeline** (React-PDF or Puppeteer template) | 10 | 5h | Low — only 1 concept |
| **Voice infrastructure** (Twilio Voice + STT + TTS) | 8, 14 | 6h | Medium |
| **Mobile camera-capture UX** (`getUserMedia` + PWA shell) | 5, 9 | 4h | Medium |
| **Browser extension shell** (Plasmo / WXT) | 1 | 4h | Low — single concept but very high demo value |
| **Slack/Discord bot adapter** (Vercel Chat SDK) | 7 | 3h | Low — single concept |
| **OBS browser-source scaffold** | 11 | 2h | Low |
| **iMessage/SMS adapter** (Twilio + Apple Shortcut) | 4 | 3h | Low — but uses Johnny's prior work, so effective effort is ~1h |
| **Emilie design system** (logo + palette + components in shadcn) | ALL | 6h (parallel to build) | **Critical** |
| **Launch video assets** (intro graphic, transitions, music license) | ALL | 8h (parallel) | **Critical** |

### Reusability takeaways for the PRD-splitter

The five primitives marked **Critical** + **Very High** account for ~25 hours of engineering investment and unlock 80% of demo value across nearly every concept. Build them ONCE in a shared `/packages/swarm-ui` lane:

1. K2 swarm orchestrator (8h)
2. TRIBE V2 sidecar service (6h)
3. WebSocket streaming protocol (3h)
4. Side-by-side comparison shell (4h)
5. Agent debate stream UI (4h)

This is the **PRD-splitter "shared lane"** — one engineer (likely Junsoo) owns this, the rest of the team builds concept-specific surfaces on top.

---

## Section 3 — Top 3 Strongest Concepts (200 words)

### #1 — Concept 2: CONSENSUS (web dashboard, knowledge-graph forward)
**Best Use of AI angle:** *Glass-box AI for high-stakes domains.* The knowledge graph IS the AI's mental model rendered as UI; transparency is the artifact. Fits Best AI rubric verbatim ("thoughtful design", "transparency", "novel application"). Tech: Next.js 16 + `cosmograph` + WebSocket + Cerebras K2 + TRIBE V2 + FastAPI + Postgres. Highest reuse of shared swarm primitives. Lowest "art project" risk.

### #2 — Concept 1: GLASSPANE (browser extension overlay)
**Best Use of AI angle:** *AI literacy / consumer-facing trust layer.* Injects the swarm onto YouTube/Vimeo/any video page; demonstrates the system in the most universally-recognized surface (a web video). Sideshift consumer angle + Best AI rubric ("approachable, integrates into existing workflows"). Tech: Plasmo Chrome MV3 + WebSocket + same backend as Concept 2. Lowest cognitive load for judges — they understand it in 5 seconds.

### #3 — Concept 4: GLASSBOX/SMS (iMessage / SMS bot)
**Best Use of AI angle:** *K2-speed proof + zero-friction consumer surface.* The form factor itself proves K2 is fast enough for a text-message round-trip. Direct reuse of Johnny's iMessage prior work (lowest absolute effort: ~14h). Sideshift B2C escape hatch + Best AI rubric ("novel use of model speed"). Tech: Twilio + Apple Shortcuts + FastAPI + K2. Highest "wow per engineering hour" ratio in the set.

**Recommended portfolio:** Build CONSENSUS as the flagship, ship GLASSPANE as the "demo where they can install it themselves," keep GLASSBOX/SMS as the closing-line one-liner ("we also have a phone number you can text right now").

---

## Footer — Open Questions for the Human Team

1. **Single-flagship vs. multi-surface portfolio?** The reusability matrix supports shipping 2–3 surfaces on the same backend. Is the team's preference (a) one polished concept, or (b) a flagship + a short-form companion to demonstrate range?
2. **Does TRIBE V2 work on the chosen video domain?** Friday-night spike test required before locking any concept that depends on brain encoding. If TRIBE returns junk on Ironside footage, fall back to Concepts 1, 2, 4, 7, 12, 13, 14 (which can run swarm-only without brain encoding).
3. **Native iOS or no?** Concept 9 (PIN) is the most futuristic but requires native iOS shipping experience the team may not have. Recommend deprioritize unless someone confirms Live Activities experience.
4. **Demo environment connectivity?** If Bechtel's Wi-Fi is shaky, anything WebSocket-heavy needs a local-network fallback. Plan for offline demo on a laptop hotspot.
5. **Pre-cached vs. live demo inputs?** For ARENA (Concept 12) and any benchmark-style demo, pre-curated inputs that *reliably* show our advantage are safer. For CONSENSUS / GLASSPANE, live demos with judge-supplied inputs are higher-impact but riskier.
6. **Emilie's video shoot window?** Most concepts have a launch video deliverable. She'll need ~3–4 hours uninterrupted Saturday afternoon to shoot/edit. Block this on the schedule.
7. **Apple Shortcuts provisioning?** Concept 4 leans on this for the "1-tap install" pitch. If it doesn't materialize, fall back to plain SMS — same demo, weaker close.
8. **Where does "non-deterministic guardrails" land in the demo?** It's listed in architecture as a Layer 5 output but no concept above features it primarily. Decision: is it a sub-feature of the swarm orchestrator (always-on, surfaced on the audit page) or a primary value prop (Concept 12 ARENA leans this way)?

---

**End of Agent 4 deliverable.** 14 concepts, 14 archetypes, 1 reusability matrix, 3-concept short list, 8 open questions. Total: ~5,400 words.
