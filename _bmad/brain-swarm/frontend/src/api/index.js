const API = '/brain'

export async function fetchMesh() {
  const r = await fetch(`${API}/mesh`)
  if (!r.ok) throw new Error(`mesh fetch failed: ${r.status}`)
  return r.json()
}

export async function startSim() {
  await fetch(`${API}/start`, { method: 'POST' })
}

export async function stopSim() {
  await fetch(`${API}/stop`, { method: 'POST' })
}

export async function fetchStatus() {
  const r = await fetch(`${API}/status`)
  return r.json()
}
