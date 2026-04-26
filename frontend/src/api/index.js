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

export async function postDemoMatch(filename) {
  const r = await fetch(`${DEMO}/match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename }),
  })
  if (!r.ok) throw new Error(`demo/match failed: ${r.status}`)
  return r.json()
}

export async function fetchVisionReport(clipId) {
  const r = await fetch(`${DEMO}/vision-report/${encodeURIComponent(clipId)}`)
  if (!r.ok) throw new Error(`vision-report failed: ${r.status}`)
  return r.json()
}

export async function fetchActivity(clipId) {
  const r = await fetch(`${DEMO}/activity/${encodeURIComponent(clipId)}`)
  if (!r.ok) throw new Error(`activity fetch failed: ${r.status}`)
  return r.json()
}

export async function postK2Region({ clipId, network, t }) {
  const r = await fetch(`${DEMO}/k2-region`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clip_id: clipId, network, t }),
  })
  if (!r.ok) throw new Error(`k2-region failed: ${r.status}`)
  return r.json()
}

export async function fetchEmpathyDocument(clipId) {
  const r = await fetch(`${DEMO}/empathy/${encodeURIComponent(clipId)}`)
  if (!r.ok) throw new Error(`empathy fetch failed: ${r.status}`)
  return r.json()
}

export async function fetchIterativeTrajectory(clipId) {
  const r = await fetch(`${DEMO}/iterative-trajectory/${encodeURIComponent(clipId)}`)
  if (!r.ok) throw new Error(`iterative-trajectory failed: ${r.status}`)
  return r.json()
}

export async function fetchFalsification(clipId) {
  const r = await fetch(`${DEMO}/falsification/${encodeURIComponent(clipId)}`)
  if (!r.ok) throw new Error(`falsification failed: ${r.status}`)
  return r.json()
}

export async function fetchWarmupStatus(clipId) {
  const r = await fetch(`${DEMO}/warmup-status/${encodeURIComponent(clipId)}`)
  if (!r.ok) throw new Error(`warmup-status failed: ${r.status}`)
  return r.json()
}

export function videoUrl(clipId) {
  return `/prerendered/${encodeURIComponent(clipId)}/${encodeURIComponent(clipId)}.mp4`
}
