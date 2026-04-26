// Match the backend `_looks_like_region_list_dump` heuristic in
// services/empathy_synthesis.py. A round is "malformed" when its candidate
// paragraph collapsed into a list of `network: value` lines instead of
// flowing prose — a known K2 failure mode in late refinement rounds.
const NETWORKS = new Set([
  'visual',
  'somatomotor',
  'dorsal_attention',
  'ventral_attention',
  'limbic',
  'frontoparietal',
  'default_mode',
])

export function isMalformedRoundExcerpt(text) {
  if (!text) return true
  const trimmed = String(text).trim()
  // Pattern A: backend timeout/parse error string leaks through as the
  // candidate paragraph. Shape: "[empathy_synthesis error: TimeoutError: ]"
  // or "[empathy_synthesis retry error: ...]" or "[parse error: ...]".
  // Matches any bracket-wrapped string mentioning "error".
  if (/^\[[^\]]*\berror\b[^\]]*\]?/i.test(trimmed)) {
    return true
  }
  // Pattern B: K2 mirrored the per_region_miss input format and returned a
  // list of `network: value` lines instead of prose.
  const lines = trimmed.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
  if (!lines.length) return true
  let regionLineCount = 0
  for (const ln of lines) {
    const head = ln.replace(/^[-*\s\t]+/, '').split(':', 1)[0].trim().toLowerCase()
    if (NETWORKS.has(head)) regionLineCount += 1
  }
  return regionLineCount >= 2 && lines.length <= regionLineCount + 2
}

export function filterRealRounds(rounds) {
  if (!Array.isArray(rounds)) return []
  return rounds.filter(r => !isMalformedRoundExcerpt(r?.paragraph_excerpt))
}
