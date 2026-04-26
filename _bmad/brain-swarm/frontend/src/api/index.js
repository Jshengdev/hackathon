// ── Brain mesh / sim (existing) ─────────────────────────────────────────────
const BRAIN = '/brain'

export async function fetchMesh() {
  const r = await fetch(`${BRAIN}/mesh`)
  if (!r.ok) throw new Error(`mesh fetch failed: ${r.status}`)
  return r.json()
}

export async function startSim() {
  await fetch(`${BRAIN}/start`, { method: 'POST' })
}

export async function stopSim() {
  await fetch(`${BRAIN}/stop`, { method: 'POST' })
}

export async function fetchStatus() {
  const r = await fetch(`${BRAIN}/status`)
  return r.json()
}

// ── Demo flow endpoints ─────────────────────────────────────────────────────
const DEMO = '/demo'

/**
 * Stage 1: "Match" an uploaded video to a prerendered clip.
 * Fakes the upload — server looks up by filename and returns clip_id + URLs.
 * @param {string} filename — e.g. "30s_ironsite.mp4"
 */
export async function postDemoMatch(filename) {
  const r = await fetch(`${DEMO}/match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename }),
  })
  if (!r.ok) throw new Error(`demo/match failed: ${r.status}`)
  return r.json()
}

/**
 * Stage 2: vision analysis (Gemini/Claude). Returns the structured report.
 */
export async function fetchVisionReport(clipId) {
  const r = await fetch(`${DEMO}/vision-report/${encodeURIComponent(clipId)}`)
  if (!r.ok) throw new Error(`vision-report failed: ${r.status}`)
  return r.json()
}

/**
 * Stage 2/3: load activity.json (TRIBE V2 predictions, prerendered).
 */
export async function fetchActivity(clipId) {
  const r = await fetch(`${DEMO}/activity/${encodeURIComponent(clipId)}`)
  if (!r.ok) throw new Error(`activity fetch failed: ${r.status}`)
  return r.json()
}

/**
 * Stage 3: K2 narration for a single clicked region.
 * @param {string} clipId
 * @param {string} network — yeo7 network name (e.g. "visual")
 * @param {number} t — integer seconds (floor of currentTime)
 */
export async function postK2Region({ clipId, network, t }) {
  const r = await fetch(`${DEMO}/k2-region`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clip_id: clipId, network, t }),
  })
  if (!r.ok) throw new Error(`k2-region failed: ${r.status}`)
  return r.json()
}

/**
 * Stage 4: side-by-side without/with TRIBE V2 comparison.
 */
export async function fetchComparison(clipId) {
  const r = await fetch(`${DEMO}/comparison/${encodeURIComponent(clipId)}`)
  if (!r.ok) throw new Error(`comparison fetch failed: ${r.status}`)
  return r.json()
}

/**
 * Helper: URL of the prerendered MP4 for an HTML5 <video> element.
 */
export function videoUrl(clipId) {
  return `/prerendered/${encodeURIComponent(clipId)}/${encodeURIComponent(clipId)}.mp4`
}
