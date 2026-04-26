// Yeo7 network colors — single source of truth.
// Keep in sync with backend services/brain_mesh.py:YEO7_COLORS.
// Retuned for TRIBE V2 register: warmer, less saturated, sit on warm-cream
// chips against a near-black surface without screaming.
export const NETWORK_COLORS = {
  visual:             '#f9c850',
  somatomotor:        '#a0c8e0',
  dorsal_attention:   '#88d090',
  ventral_attention:  '#e08aa0',
  limbic:             '#d83a00',
  frontoparietal:     '#f9a000',
  default_mode:       '#bb8fce',
  moderator:          '#ffffff',
}

export function networkColor(n) {
  return NETWORK_COLORS[n] ?? '#aaaaaa'
}

export function networkHex(n) {
  const c = NETWORK_COLORS[n]
  return c ? parseInt(c.replace('#', ''), 16) : 0xaaaaaa
}

// ── TRIBE V2 heat colormap (used on the cortical surface) ──────────────────
// Black → deep red → red-orange → orange → yellow → white. Matches the
// correlation legend in /tmp/tribev2-ref/section-2.png.
export const TRIBE_HEAT_STOPS = [
  { v: 0.0,  hex: '#1a0000' },
  { v: 0.2,  hex: '#5a1100' },
  { v: 0.45, hex: '#d83a00' },
  { v: 0.7,  hex: '#f9a000' },
  { v: 0.9,  hex: '#ffd84a' },
  { v: 1.0,  hex: '#ffffff' },
]

function mixHex(h1, h2, f) {
  const p = (h) => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ]
  const [r1, g1, b1] = p(h1)
  const [r2, g2, b2] = p(h2)
  const r = Math.round(r1 + (r2 - r1) * f)
  const g = Math.round(g1 + (g2 - g1) * f)
  const b = Math.round(b1 + (b2 - b1) * f)
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
}

// Piecewise-linear interpolation across TRIBE_HEAT_STOPS.
// Input v is clamped to [0,1].
export function tribeHeat(v) {
  const t = Math.max(0, Math.min(1, v))
  for (let i = 1; i < TRIBE_HEAT_STOPS.length; i++) {
    const a = TRIBE_HEAT_STOPS[i - 1]
    const b = TRIBE_HEAT_STOPS[i]
    if (t <= b.v) {
      const f = (t - a.v) / (b.v - a.v)
      return mixHex(a.hex, b.hex, f)
    }
  }
  return TRIBE_HEAT_STOPS[TRIBE_HEAT_STOPS.length - 1].hex
}

// Same gradient but returned as 0..1 RGB triplet for direct use in
// THREE.BufferAttribute('color') vertex buffers — avoids hex parsing in the
// hot path of applyRegionLevelsToMesh().
export function tribeHeatRGB(v, out) {
  const t = Math.max(0, Math.min(1, v))
  for (let i = 1; i < TRIBE_HEAT_STOPS.length; i++) {
    const a = TRIBE_HEAT_STOPS[i - 1]
    const b = TRIBE_HEAT_STOPS[i]
    if (t <= b.v) {
      const f = (t - a.v) / (b.v - a.v)
      const ar = parseInt(a.hex.slice(1, 3), 16) / 255
      const ag = parseInt(a.hex.slice(3, 5), 16) / 255
      const ab = parseInt(a.hex.slice(5, 7), 16) / 255
      const br = parseInt(b.hex.slice(1, 3), 16) / 255
      const bg = parseInt(b.hex.slice(3, 5), 16) / 255
      const bb = parseInt(b.hex.slice(5, 7), 16) / 255
      out[0] = ar + (br - ar) * f
      out[1] = ag + (bg - ag) * f
      out[2] = ab + (bb - ab) * f
      return out
    }
  }
  out[0] = 1; out[1] = 1; out[2] = 1
  return out
}
