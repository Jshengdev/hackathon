// Yeo7 network colors — single source of truth.
// Keep in sync with backend services/brain_mesh.py:YEO7_COLORS.
export const NETWORK_COLORS = {
  visual:             '#ff6b6b',
  somatomotor:        '#4ecdc4',
  dorsal_attention:   '#45b7d1',
  ventral_attention:  '#f7dc6f',
  limbic:             '#bb8fce',
  frontoparietal:     '#82e0aa',
  default_mode:       '#f0b27a',
  moderator:          '#ffffff',
}

export function networkColor(n) {
  return NETWORK_COLORS[n] ?? '#aaaaaa'
}

export function networkHex(n) {
  const c = NETWORK_COLORS[n]
  return c ? parseInt(c.replace('#', ''), 16) : 0xaaaaaa
}
