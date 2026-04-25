# Jarvis

- **Hackathon / event:** unverified — context implies a recent (late-2025 or 2026) college hackathon (worker noted "judges talked about as pretty impressive")
- **Year / date:** unverified
- **Prize won:** unverified — but team-internal signal: judges called it impressive
- **Sponsor tracks involved:** unverified (no sponsor breakout in the writeup; tools used include Google Gemini)
- **Devpost / press / video / repo:** ❌ no public repo found in user dump; only "Try it out" → Figma link (placeholder). Write the entry from prose + architecture diagrams.
- **Local clone:** *(none — repo not provided)*
- **Architecture diagrams:** two diagrams shared in chat. If Johnny saves them locally, drop into `jarvis-assets/` next to this file.

> ⚠️ **Verification level: prose + diagrams only.** Unlike `bridge.md` and `greenchain.md`, no code was inspected. Treat every "needle" below as *claimed* — re-verify against the repo if it surfaces later.

## Pitch (one sentence)

Jarvis turns hours of construction-site headcam footage into a 4-metric supervisor report (Safety / Ergonomics / Productivity / Quality) with timestamped clips, every claim cited to a specific event, and a voice agent the supervisor can interrogate.

## What's actually in the writeup (claimed)

| Claim | Notes |
|---|---|
| Keyframe selection via pixel-diff magnitude + histogram transitions | Standard CV technique; cheap to implement with OpenCV. |
| MiDaS depth + MediaPipe hand-tracking + YOLOv8 tool detection running in parallel per keyframe → fused JSON "spatial sidecar" | Three off-the-shelf models, one structured evidence file. See `patterns/spatial-sidecar.md`. |
| **Localize-and-Zoom loop** — Gemini scans full frame, returns hand/tool bounding boxes; system crops raw frame at those coords; re-query Gemini on the zoomed crop | The actual unique sauce. See `patterns/localize-and-zoom.md`. |
| Confidence-feedback resample on low-confidence detections | Standard active-vision pattern. |
| Temporal consistency vote across ±2s adjacent frames | Suppresses single-frame anomalies. |
| Event extraction → 4 metrics scored 0–100 | Rules engine over the sidecar JSON. |
| Every report claim cited to event ID + timestamp + clip | Auditable / grounded. See `patterns/grounded-citation.md`. |
| Voice AI agent over the final structured report | Q&A surface; tool/provider not specified in the writeup. |

The team's **research-first framing** is unusual and effective: they cite three specific 2025 papers (GeoMeter benchmark on depth/height failures, AdaptVis at ICML 2025 on misallocated spatial attention, EgoConQS 2025 on egocentric moment retrieval) as direct justification for the architecture. Each cited failure mode maps to a pipeline component. This is a strong "we read the literature, then engineered the pipeline" story for judges.

## The unique sauce (what made it stand out)

1. **Localize-and-Zoom defeats VLM spatial blindness without fine-tuning.** Wide-angle headcam shots are too low-resolution for Gemini to tell whether a hand is contacting a blade. So they let Gemini *find* the interaction, then crop the **original raw frame** at those coords (not the down-sampled view) and ask again. Inference-time fix; no training; reusable across any spatially-failing VLM task.
2. **The spatial sidecar is a separation-of-concerns trick.** They don't ask the LLM to "look at this frame and reason." They preprocess each keyframe into a JSON of (depth distances, hand-joint positions, tool bounding boxes, region tags) — *then* let the LLM reason over structured evidence. The LLM's job becomes "interpret this small dictionary," not "perceive this image."
3. **Grounded citations + clip reel = audit-grade reports.** Every line in the report links to a timestamp. Judges (and customers) can verify any claim in two clicks. This is the same trust-pattern as GreenChain's named-dataset citations and is what separates "AI summary" from "AI evidence."
4. **The voice-agent layer turns a report into a workflow.** Once you have a structured, evidence-cited report, putting a voice Q&A on top of it is cheap — and it's the demo moment where the judge actually talks to the system.

## Implementation needles (claimed, unverified by code)

### 1. Localize-and-Zoom loop (the headline pattern)

```
[Wide headcam frame] ──► Gemini scan pass ──► bbox(hand), bbox(tool)
                                                       │
                                                       ▼
                       crop RAW frame at exact coords (not downsampled view)
                                                       │
                                                       ▼
                       Gemini re-query on zoomed crop ──► contact / proximity verdict
                                                       │
                            (low confidence?) ──── feedback ──── resample with different crop
                                                       │
                                                       ▼
                       temporal vote across ±2s adjacent frames
```

**Why it works:** Single-shot VLMs underperform on spatial questions because the model's attention spreads across the whole frame. By using the model itself as a region-proposal step and re-prompting on the cropped region, you get **attention you don't have to fine-tune for**. The crop must come from the *raw* frame so you preserve resolution.

Generalizes far beyond construction: any time a wide image hides a small interaction (medical imaging, surveillance, sports analysis, microscopy, drone footage, satellite imagery, AR overlays).

### 2. Spatial sidecar (fuse-then-reason)

```
keyframe ──► [MiDaS depth]         ┐
          ──► [MediaPipe hands]      ├──► fused JSON evidence file per frame
          ──► [YOLOv8 tools]         ┘                  │
                                                        ▼
                              LLM reasons over JSON, not pixels
```

**Why it works:** LLMs are vastly better at structured reasoning over JSON than at perception over pixels. Doing the perception with cheap, specialized models (MiDaS for depth, MediaPipe for joints, YOLOv8 for objects) and shipping the result as a small JSON dict is dramatically more reliable than asking a single VLM to "describe what's happening." The sidecar pattern also makes failures observable — if MiDaS misses a frame, the JSON is missing a field, not silently wrong.

See `patterns/spatial-sidecar.md` for the cross-project version of this.

### 3. Grounded report with event-ID citations

Every metric-bearing sentence in the report ends with `[event_id: ev_142, t=00:14:32, clip: clips/ev_142.mp4]`. The dashboard renders citations as clickable chips that open the clip at the timestamp.

**Why it works:** This is the same trust pattern as GreenChain pinning every emission number to EPA/Ember/GLEC sources. Auditability is a *narrative* feature, not just a compliance feature — judges asking "how do you know?" can be answered in one click. See `patterns/grounded-citation.md`.

## Capability stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 16 + React 19 + Tailwind |
| VLM | Gemini 2.5 Flash (scanning + zoom re-query) |
| Depth | MiDaS-small (Intel) |
| Hand tracking | MediaPipe |
| Object detection | YOLOv8 Nano |
| CV plumbing | OpenCV |
| ML runtime | PyTorch + torchvision + timm |
| Voice agent | unspecified in writeup |

## Why it would win

- **Crisp problem framing.** Hours of headcam footage that nobody watches → 4-number report with citations. Easy to grasp in 15 seconds.
- **Research-grounded architecture.** Three cited 2025 papers as direct motivation for three pipeline components. Hard to argue against on a judging panel.
- **Live demo:** upload an MP4 → see the dashboard populate → ask the voice agent a question. Multimodal in/out in one flow.
- **Auditable.** Click a metric → see the clip. Demolishes "is this real?" doubts.

## Reusable for us at HackTech 2026?

- ✅ **angle:** The Localize-and-Zoom loop is portable to *any* domain where wide-shot VLMs fail spatially. Replace headcam with: dashcams (driver behaviour), ER cams (workflow audits), warehouse drones (inventory exceptions), retail security cams (loss prevention), kitchen cams (food-safety audits). Each is a vertical-agent-stack play in the GreenChain/Cal-Hacks-Haven mold.
- ✅ **angle:** The spatial-sidecar pattern is a clean "engineering over prompting" answer to the question "how is this not just GPT?"
- ✅ **angle:** Voice agent over a structured evidence file is a cheap, demo-friendly capstone for any of those verticals.
- ⚠️ **risk:** Vision pipelines on noisy footage are an iteration trap. Plan keyframe selection + a small curated demo dataset *before* HackTech weekend.
- ⚠️ **risk:** Depth from a single mono camera (MiDaS) is unreliable for safety-critical claims; if we go the safety route, frame the metric language carefully.

## Johnny's expansion angle (verbatim — capture for later)

> "what's so good about it is how it tries to solve for the problem that it was in the space that aren't site-specific you mentioned all the information is siloed so jarvis is almost like an idea which allows multiple people to contact each other so that if there's a problem on one end we can pull in context from other ends to utilize and that way everything can be more streamlined and productivity can actually rise so i think this one was one of the things that the judges talked about as like pretty impressive and if we just built on top of this it would genuinely create something really cool this one specifically for our insight though"

**Translation for the spec:** the original Jarvis is single-site, single-supervisor. The expansion is a **multi-site network** where evidence and events from one site are queryable as context for another — i.e., turn the per-site report into a federated knowledge layer. Sites share schema (the spatial-sidecar JSON, the event types, the metric vocabulary), so cross-site retrieval works without re-prompting.

Concrete shapes that idea could take for HackTech:
- **Cross-site near-miss ledger:** "show me every blade-proximity event across the company this month, ranked by severity." A vector index over event embeddings makes this one query.
- **Pattern-spread alerts:** if site A starts logging a new failure mode at 3× baseline, every other site supervisor gets a Slack/voice ping with the matching clips and the most-effective mitigation event from a peer site.
- **Best-practice surfacing:** voice agent answers "show me how the Phoenix team handled rebar transport last quarter" with their actual clipped events and the productivity delta they got.

This is the pattern that turns Jarvis from a "smart report" into a **construction-ops operations center** — and it lines up with the 2025–26 winning pattern of "vertical agent stack on critical infrastructure" we documented in `research/sponsors/_2026-sponsorship-footprint.md`'s antecedent (`research/03-recent-hackathon-winners-deep-dive.md`).

## Cross-links

- Patterns: [`localize-and-zoom.md`](../patterns/localize-and-zoom.md), [`spatial-sidecar.md`](../patterns/spatial-sidecar.md), [`grounded-citation.md`](../patterns/grounded-citation.md)
- (Tools entry skipped — Gemini / MiDaS / MediaPipe / YOLOv8 aren't sponsor-tied; pull on demand.)
