---
file-type: project
status: partial
last-verified: 2026-04-25
supports-decisions:
  - ../decisions/006-tribe-v2-as-special-mode.md
  - ../decisions/007-agent-swarms-as-coordination-pattern.md
  - ../decisions/009-ironside-pipeline-mirror.md
cites-sources:
  - ../scrapes/treehacks-2026-winners.md
  - https://devpost.com/software/mira-w65b0a
  - https://github.com/nathanjzhao/treehacks2026
cross-links:
  - ../decisions/006-tribe-v2-as-special-mode.md
  - ../decisions/009-ironside-pipeline-mirror.md
  - ../patterns/localize-and-zoom.md
  - ../patterns/spatial-sidecar.md
  - ../patterns/grounded-citation.md
  - jarvis.md
  - memento.md
  - keryx.md
  - 4sight.md
---

# Mira

> **⚠️ Lookalike-risk teardown:** Same problem space as Memento + Jarvis (egocentric VLM with grounded reasoning), but Mira shipped the most complete spatial pipeline of the 2025–26 hackathon cycle. The "Localize-and-Zoom-on-raw-video" pattern Jarvis claims is *operationalized* here in code — read both side-by-side.

- **Hackathon / event:** TreeHacks 2026 (Stanford, Feb 13–15)
- **Year / date:** 2026
- **Prize won:** **Most Impactful** + **OpenAI AI Track 1st** (per scrape row 5)
- **Sponsor tracks involved:** OpenAI, Modal, Perplexity (Sonar)
- **Devpost / press / video / repo:** https://devpost.com/software/mira-w65b0a · repo: https://github.com/nathanjzhao/treehacks2026
- **Local clone:** `../../sources/repos/mira/`

## Pitch (one sentence)

Voice-first AI on Ray-Ban Meta glasses for dementia care — pre-build a 3D point cloud of the home, then "where are my pills?" runs multi-view Gemini detection against rendered viewpoints of that cloud and animates a flythrough to the object.

## What's actually in the repo (verified vs. claimed)

The repo is unusually large for a hackathon (~14 modules, two backends, an Android app, a Next.js dashboard, multiple Modal apps). The vision system is real and load-bearing. The agent / clinical layer is real. The "scene graph" is partially fake.

| Devpost claim | Reality |
|---|---|
| Voice → 3D object localization in <10s | ✅ Verified — `explorer/object_finder.py:75-405` is the full pipeline (render → multi-view bbox → raycast → animated fly-to). |
| Gemini detects bounding boxes per multi-view render | ✅ `explorer/gemini_client.py:127-238` — sends N base64 JPEG views in one OpenRouter call, parses normalized `[y_min,x_min,y_max,x_max]` per view. |
| Multi-view 3D triangulation via raycast | ✅ `object_finder.py:294-301` calls `localize_by_ray()` from `camera_utils.py` against the point cloud. |
| Auto-detect scene "up" direction (point clouds don't know which way is up) | ✅ `explorer/gemini_client.py:268-370` — renders 3 candidate up vectors (+Z, +Y, −Y) and asks Gemini "which looks right-side up?" with one-letter answer. Inelegant but works (their words). |
| MapAnything / VGGT for SfM + camera poses | ⚠️ Referenced in `scenegraph/README.md` and `VIEWERS.md`; only `scenegraph/make_demo.py` (146 lines) lives in the repo. **The real `scenegraph/app.py` Modal pipeline that the README describes is not in the repo.** `make_demo.py` produces a *fake* scene graph: kmeans clustering + `np.random.randn(1024)` for CLIP features + hardcoded object name list. |
| Grounding DINO + SAM 2 + RAM detection per frame | ⚠️ `segmentation/README.md` claims it; `segmentation/app.py` (the Modal app) is **not in the repo** — only viewers (`seg_viewer.py`, `locate_viewer.py`, `depth_viewer.py`, `run_batch.py`) shipped. |
| HLoc (SuperPoint + LightGlue + PnP) for 6DoF localization | ✅ `hloc_localization/backend/app.py` exists with full Modal app; benchmarks are documented in `hloc_localization/README.md` (NetVLAD = 11.4s/frame is the bottleneck). |
| DPVO continuous pose tracking + HLoc anchor frames | ✅ `hloc_localization/backend/dpvo_app.py` exists. README documents 31.5 fps DPVO vs 0.07 fps HLoc tradeoff. |
| Depth Anything V2 monocular depth | ✅ `depthanything/app.py:23-82` — full Modal image with pre-downloaded ViT-L weights. |
| Whisper STT + OpenAI TTS | ✅ `mira-chat/app/api/voice/transcribe/route.ts:18-29` (whisper-1) and `mira-chat/app/api/voice/tts/route.ts:23-25` (gpt-4o-mini-tts). |
| Function-calling agent (find_object, escalate_to_caregiver, lookup_medication, search_medical_info, check_clinical_guidelines) | ✅ `mira-chat/app/api/chat/route.ts:11-116` — 5 tools defined, OpenAI tool_choice="auto". |
| Perplexity Sonar with evidence-graded citations | ✅ `mira-chat/app/api/chat/route.ts:171-296` — `callSonar` + `gradeCitations` classify URLs into `clinical / health_info / general` tiers based on a domain allowlist. |
| Patient records de-identified before reaching LLM (FHIR R4 inspired) | ⚠️ Partial. `chat/route.ts:178-189` only sends `age_range`, `sex`, condition names, medication names to Sonar — no DOB, name, MRN. But it's hand-rolled redaction, not a tested PHI scrubber, and the in-process patient card still holds `display_name`. |
| ElevenLabs voice | ❌ Claimed in scrape; no ElevenLabs in `mira-chat/package.json` — only OpenAI TTS. |
| Grounded SAM 2 (Devpost line) | ❌ Aspirational — README mentions GroundingDINO + SAM in scenegraph, but the actual scenegraph Modal app isn't in the repo. |
| Twilio integration | ⚠️ `mira-chat/lib/twilio.ts` exists; only an SMS escalation helper, not voice. |
| **Email escalation** to caregiver with full context (Devpost: "the caregiver gets an email within seconds") | ❌ **Channel was swapped.** `/api/escalate` calls `sendSms`, not any mailer. Body is literally `Mira Alert: {patient.display_name} - {reason}`. Devpost says email; code says SMS. |
| Real-time caregiver dashboard (Supabase Realtime, zero polling) | ✅ `mira-chat/app/dashboard/` + `lib/supabase-server.ts` + `lib/event-spine.ts` — events appended to Supabase, dashboard subscribes via postgres_changes. |
| Browser-side YOLOv8n via ONNX Runtime Web | ✅ `mira-chat/yolo/` directory + `onnxruntime-web` in `package.json`. |
| Tailscale tunneling for Stanford WiFi | ⚠️ Referenced in devpost prose; no Tailscale code in repo (it's an ops choice, not code). |

**Net:** ~half of the load-bearing capabilities ship as runnable code (HLoc, DPVO, depth, agent + tools, Sonar grading, dashboard). The other half (MapAnything scene graph, Grounded SAM tracking) ship only as viewers + READMEs — the demo's "spatial memory" was likely built once with offline tooling, then served from saved GLBs.

## The unique sauce (what made it stand out)

1. **Render-from-cloud, then ask the VLM.** They don't ask Gemini to localize objects in raw camera frames. They build a dense point cloud once, then at query time **render 6 diverse synthetic viewpoints** (farthest-point sampling over the original camera positions), send all 6 in one Gemini call, get back per-view 2D bboxes with `view_index`, and triangulate via raycast. This is the inverse of "scan the live video" — closer to "search the memory." Latency they advertise is end-to-end voice-to-fly under 10s.
2. **Gemini-as-up-detector.** Point clouds have no canonical "up" — `Z`, `Y`, `−Y` are equally valid until you ask "does this look right-side up?". They render the *same* viewpoint with three candidate up vectors, send all three to Gemini with a one-letter prompt (`A`, `B`, or `C`). Caches the result globally on first run. Same trick as Localize-and-Zoom: use the VLM as a perceptual oracle for a small categorical decision, not as a geometric solver.
3. **Multi-view 3D triangulation, not "ask for box_3d."** Devpost says they tried Gemini's native `box_3d` output and abandoned it because it returns coords in Gemini's own frame, not the point cloud's world frame (`gemini_client.py:258-261` documents this verbatim). They fell back to 2D bboxes per view + raycasting through known camera poses. This is a real engineering finding — published Gemini box_3d is unreliable at this scale.
4. **Evidence-graded clinical citations as a UI primitive.** Sonar returns generic citations; their `classifyEvidence` (lines 274-287) buckets each URL into `clinical / health_info / general` tiers using a domain allowlist (PubMed, Cochrane, NEJM, AHA, etc. → `clinical`; Mayo, Cleveland Clinic, NHS → `health_info`). The dashboard renders chips colored by tier, so a caregiver sees grade at a glance. This is the same trust pattern Tribune uses for constituent voices and GreenChain uses for EPA/Ember sources.
5. **5-tool agent with hard-coded escalation bias.** The system prompt (`route.ts:505-518`) explicitly tells the model to **always escalate** on safety concerns, even at cost of false positives ("Better safe than sorry"). For a dementia/elder vertical the bias is correct; the lesson is that tool-calling agents need a stated risk preference, not just a tool list.

## Implementation needles (actual code patterns)

### 1. Multi-view rendering + per-view bbox + raycast triangulation (`explorer/object_finder.py:151-302`)

```python
# Pick N diverse camera viewpoints from the SfM camera trajectory
indices = _select_diverse_cameras(camera_positions, NUM_VIEWS)  # FPS over positions
viewpoints = []
for idx in indices:
    pos = camera_positions[idx]
    if camera_look_dirs and idx < len(camera_look_dirs):
        look_target = pos + camera_look_dirs[idx] * 10.0
        wxyz = look_at_wxyz(pos, look_target)
    else:
        wxyz = look_at_wxyz(pos, centroid)
    viewpoints.append({"position": pos, "wxyz": wxyz, "label": f"cam{idx}"})

# Render each, validate not blank, save debug JPEGs
for vp in viewpoints:
    render = await loop.run_in_executor(None, lambda vp=vp:
        client.get_render(height=480, width=640, wxyz=tuple(vp["wxyz"]),
                          position=tuple(vp["position"]), fov=1.2))
    arr = np.array(render)
    mean_val = arr.mean()
    if mean_val < 5 or mean_val > 250: continue   # skip blank renders
    renders.append(arr); render_labels.append(vp["label"]); valid_viewpoints.append(vp)

# One LLM call with all N views; up to MAX_LLM_RETRIES
for attempt in range(MAX_LLM_RETRIES):
    result = await query_object_location(query, renders, render_labels)
    if result.get("detections") or result.get("target_3d"):
        llm_result = result; break

# 2D-bbox path: raycast each view's bbox center through the known camera pose
target_3d = localize_by_ray(detections=detections, viewpoints=valid_viewpoints,
                            points=points, img_width=640, img_height=480, fov_y=1.2)
```

**Why it works:** The LLM does what LLMs are good at (per-view 2D detection). The known camera intrinsics + extrinsics do what they're good at (3D triangulation). FPS over the original SfM camera positions guarantees the rendered viewpoints are in *free space* (a camera was actually there during capture). The 6-view fan-out beats single-view by an order of magnitude on detection robustness without retraining anything.

### 2. Gemini as scene-orientation classifier (`explorer/gemini_client.py:268-370`)

```python
async def detect_up_direction(renders, labels):
    UP_MAP = {"A": np.array([0,0,1.0]),
              "B": np.array([0,1.0,0]),
              "C": np.array([0,-1.0,0])}
    prompt = (
        "These are 3 renders of the same indoor 3D scene from the same camera "
        "position, but with different 'up' orientations. Which option shows the "
        "scene RIGHT-SIDE UP (gravity pointing down, floor at bottom, ceiling at top)?\n"
        "Reply with ONLY the letter: A, B, or C."
    )
    # ... sends 3 base64 JPEGs + prompt → parses "A"/"B"/"C" → returns matching np.array
```

Cached at the module level (`_scene_up: np.ndarray | None = None`) so first query pays the cost; all subsequent queries reuse. The `look_at_wxyz` helper later uses this `up` vector to align the camera fly-to so it lands right-side up.

**Why it works:** Reduces a continuous geometric problem (estimate gravity direction) to a 3-way categorical choice. VLMs are reliable on the latter, unreliable on the former. Generalizes to any "I have N candidate poses, which is the canonical one?" problem.

### 3. PHI-redacting context builder for clinical Sonar (`mira-chat/app/api/chat/route.ts:178-189`, `316-329`)

```typescript
const patientContext = [
    patientCard.demographics?.age_range
      ? `Patient: ${patientCard.demographics.age_range} year old`
      : "",
    patientCard.demographics?.sex || "",
    patientCard.conditions?.length
      ? `Conditions: ${patientCard.conditions.map((c) => c.name).join(", ")}`
      : "",
    patientCard.meds?.length
      ? `Current medications: ${patientCard.meds.map((m) => m.name).join(", ")}`
      : "",
  ].filter(Boolean).join(". ");
```

`display_name`, `dob`, MRN, addresses are explicitly *not* in the projection. The Sonar request (`route.ts:339-365`) gets `model: "perplexity/sonar"` with a system prompt that prioritizes peer-reviewed sources (PubMed, Cochrane, NEJM, JAMA, BMJ) and forces "Clinical review recommended before any care changes." as the closing line.

**Why it works:** It's not a real PHI scrubber — it's a hand-curated *projection* that omits identifiers entirely. For a hackathon demo with 60 seconds to convince a judge, this is the right trade. The lesson: HIPAA-grade compliance is hard; "the LLM only ever sees these 4 fields" is auditable and defensible.

### 4. Evidence grading via domain allowlist (`mira-chat/app/api/chat/route.ts:255-296`)

```typescript
const CLINICAL_DOMAINS = ["pubmed.ncbi.nlm.nih.gov", "cochrane.org", "nejm.org",
  "jamanetwork.com", "thelancet.com", "bmj.com", "uptodate.com", ...];
const HEALTH_INFO_DOMAINS = ["mayoclinic.org", "clevelandclinic.org",
  "hopkinsmedicine.org", "nhs.uk", ...];

function classifyEvidence(url: string): EvidenceGrade {
  const hostname = new URL(url).hostname.replace("www.", "").toLowerCase();
  for (const d of CLINICAL_DOMAINS) if (hostname === d || hostname.endsWith("." + d)) return "clinical";
  for (const d of HEALTH_INFO_DOMAINS) if (hostname === d || hostname.endsWith("." + d)) return "health_info";
  return "general";
}

function gradeCitations(citations) {
  return citations.map((c) => ({ ...c, evidence_grade: classifyEvidence(c.url) }));
}
```

**Why it works:** It's a 30-line function that produces a UI-ready trust signal. The dashboard renders `clinical` chips green, `general` chips yellow. Same idea as GreenChain pinning emissions to EPA/Ember/GLEC — judges (and users) get an at-a-glance "should I believe this?" answer. Generalizes to any domain with a known set of authoritative sources (legal, financial, scientific, regulatory).

## Capability stack

| Layer | Choice |
|---|---|
| Hardware | Ray-Ban Meta Gen 3 → Android phone (BT audio + JPEG-over-hotspot) → laptop |
| Tunneling | Tailscale (ops, no code) |
| Frontend | Next.js 16 + React 19 + Tailwind v4 |
| 3D viewer | Viser (Python) + custom flythrough animation in `object_finder.py` |
| Browser ML | YOLOv8n via `onnxruntime-web` |
| Speech in | OpenAI Whisper-1 (`/api/voice/transcribe`) |
| Speech out | OpenAI gpt-4o-mini-tts (`/api/voice/tts`) |
| Agent LLM | OpenAI gpt-5-mini via OpenRouter, function-calling, 5 tools |
| VLM (object localization) | Gemini 3 Flash Preview via OpenRouter (`google/gemini-3-flash-preview`) |
| Search/research | Perplexity Sonar via OpenRouter (`perplexity/sonar`) for both general medical Q&A and clinical guidelines |
| Depth | Depth Anything V2 (ViT-L) on Modal A100 |
| 6DoF localization | hloc (SuperPoint + NetVLAD + LightGlue + PnP+RANSAC) on Modal |
| Real-time tracking | DPVO on Modal, anchored every 2-3 frames by HLoc |
| Database / realtime | Supabase Postgres + Realtime (postgres_changes for dashboard) |
| Backend (vic-backend) | FastAPI + Firestore + GCS + Google Cloud TTS + Gemini (parallel/separate stack — daily memory analysis, not the live agent) |
| Escalation | Twilio SMS via `lib/twilio.ts` (Devpost prose says "email" caregiver alerts; actual code in `app/api/escalate/route.ts:47-50` only calls `sendSms`. No SendGrid/Resend/SES anywhere.) |
| Secrets hygiene | ⚠️ OpenRouter + Gemini API keys hardcoded as string literals in `explorer/openrouter_client.py:13` and `explorer/gemini_client.py:18-23`. Rotate before reusing. |
| Modal | depth, hloc, dpvo, segmentation (claimed but missing app.py), scenegraph (claimed but missing app.py) |

## Why it won

- **Most multi-modal stack of any 2026 winner.** Voice in + voice out + 3D scene + per-frame VLM + clinical reasoning + grounded citations + caregiver dashboard. Five frontier modalities in one demo. Per the scrape's findings, "grand-prize winners *all* had 3+ modalities" — Mira had 5+.
- **Personal-stakes inspiration.** Three of four founders have grandparents with dementia. The "where are my pills?" demo line is emotionally complete in 8 seconds.
- **Hardware on stage.** Ray-Bans give the demo physicality; the laptop dashboard gives the data layer; the dual surface beats either alone.
- **Honest engineering signals in the writeup.** "Don't ask a foundation model to do geometry" + "compose specialists, not monoliths" — these are the kind of post-mortem one-liners that signal team maturity. Judges read those.

## Lookalike-risk score for our HackTech 2026 entry

**🔴 HIGH** — same architectural family as our locked direction (egocentric VLM + grounded reasoning + caregiver/auditor dashboard + multi-modal stack + hardware on stage + Best Use of AI track adjacency). Mira ate the **most-impactful + AI-track 1st** combo at the 2026 hackathon cycle's most prestigious hackathon. The render-from-cloud + multi-view raycast pipeline is exactly the "engineering over prompting" answer to "how is this not just GPT?" we'd reach for. **A judge who saw Mira at TreeHacks will pattern-match to our demo within 60 seconds if our demo includes: Ray-Ban form factor, voice-first UX, "find my X" affordance, evidence-graded chips, or "we used Modal A100 for the heavy CV."**

The risk is sharpest for the eldercare/dementia vertical (Memento + Mira already own that judge slot at HackTech-class events). The risk is also sharp for the visual signature: 3D viewer fly-to a marker is a memorable demo moment that's now been done.

## What this project's existence forecloses for our project

- **The "voice → fly to object in 3D scene" demo affordance.** Mira owns it.
- **The render-N-viewpoints + per-view-bbox + raycast triangulation pipeline as a headline architecture.** It's the cleanest published version we've seen.
- **The "evidence-graded chips" UI primitive** for medical sources (PubMed/Cochrane/NEJM colored chips). For a different vertical, the pattern is reusable; for medical, Mira shipped it first at this judging cycle.
- **The "Gemini as up-direction classifier" trick** as a novel demo bullet — they already wrote the post-mortem.
- **Ray-Ban + dementia + caregiver dashboard** as a vertical pitch — they own this exact composition.

## What's still open

- Mira's spatial memory is built **once** from a walkthrough. The "What's Next" section names continuous incremental updates as the open hard problem. That's a real open differentiation lane.
- The 3D scene graph (the part that's missing from the repo) — Devpost narrates an OpenFunGraph-derived pipeline with object/part/edge functional relationships. If our project exposes such a graph as a *queryable* surface (not just a viewer), that's an open lane.
- Mira's agent is single-resident, single-home. Federation across rooms / facilities / families is unaddressed (the same gap Jarvis flags for construction sites).

## Cross-links

- [`patterns/localize-and-zoom.md`](../patterns/localize-and-zoom.md) — Mira is the *operationalized* version of what Jarvis claims (multi-view re-query against rendered viewpoints).
- [`patterns/spatial-sidecar.md`](../patterns/spatial-sidecar.md) — the JSON detection format Mira uses (per-view bbox + view_index + confidence) is structurally a sidecar.
- [`patterns/grounded-citation.md`](../patterns/grounded-citation.md) — `gradeCitations()` is the cleanest one-file implementation in the wiki.
- [`projects/jarvis.md`](jarvis.md), [`projects/memento.md`](memento.md) — sibling egocentric-VLM teardowns.
- [`projects/keryx.md`](keryx.md), [`projects/4sight.md`](4sight.md) — sibling spatial / wearable stacks at the same hackathon.
