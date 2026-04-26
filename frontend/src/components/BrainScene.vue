<template>
  <div ref="container" class="scene-container" :class="`layout-${layout}`">
    <div class="hud" v-if="showHud">
      <span class="top-region" v-if="topRegion">{{ topRegion.replace(/_/g, ' ') }}</span>
      <span class="frame-counter">t={{ Math.floor(currentTime) }}s</span>
    </div>
  </div>
</template>

<script setup>
import {
  ref, watch, onMounted, onBeforeUnmount, shallowRef,
} from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js'
import { fetchMesh } from '../api/index.js'
import { networkHex } from '../utils/colors.js'

// ── Props / emits ──────────────────────────────────────────────────────────
const props = defineProps({
  // Driving inputs (frontend-driven mode)
  clipId:       { type: String, default: '' },       // current clip — used by Phase-3 per-vertex probe
  activityData: { type: Object, default: null },     // activity.json contents
  // Extra multiplier applied on top of the auto-gain. Useful for clips where
  // even gain-normalized peaks read too cool (raise) or too saturated (lower).
  levelGainBoost: { type: Number, default: 1.0 },
  currentTime:  { type: Number, default: 0 },        // seconds (fractional ok)
  isPlaying:    { type: Boolean, default: false },

  // Layout: 'full' = whole canvas, 'left-half' = brain occupies left 50%
  layout:       { type: String, default: 'full' },

  // Show top-region/frame-counter HUD overlay
  showHud:      { type: Boolean, default: true },

  // Whether clicks on regions should emit
  interactive:  { type: Boolean, default: true },
})

const emit = defineEmits(['region-clicked', 'mesh-ready'])

// ── Reactive UI state ──────────────────────────────────────────────────────
const container = ref(null)
const topRegion = ref('')

// Mesh networks (exposed to parent via mesh-ready emit)
const meshNetworks = shallowRef(null)
const nVertices    = ref(0)

// activity.json values are z-scored (~ -0.1 to +0.3 in practice) but the
// colormap + glow thresholds expect 0..1. Compute a per-clip auto-gain when
// activityData arrives so peak activation maps to ~1.0. Without this every
// network reads as near-baseline cortex and nothing visibly lights up.
let levelGain = 1.0
function recomputeLevelGain(activity) {
  levelGain = 1.0
  const frames = activity?.frames
  if (!Array.isArray(frames) || !frames.length) return
  let peak = 0
  for (const f of frames) {
    const r = f.regions || {}
    for (const v of Object.values(r)) if (v > peak) peak = v
  }
  if (peak <= 0) return
  // Target peak activation ≈ 0.95 in colormap space (just below white-hot).
  // Clamp to [1, 25] so a noisy/empty clip can't spike to wild gains.
  levelGain = Math.max(1, Math.min(25, 0.95 / peak))
}

// ── Three.js handles ───────────────────────────────────────────────────────
let renderer, labelRenderer, scene, camera, controls
let brainMesh, wandererMesh
let atmosphereMesh, atmosphereMat
let orbitGroup
let agentEdgeLines, regionEdgeLines, swarmNetEdgeLines
const regionMeshes = {}      // network → { mesh, glowMat, labelDiv }

// Per-pair firing schedule for the inter-region "swarm network" graph.
// Each pair fires independently on its own random period — visualizes the
// 7 K2 specialists exchanging signals at uncorrelated rates.
const SWARM_NET_SEGMENTS = 24
const SWARM_NET_FIRE_MIN_MS = 1500
const SWARM_NET_FIRE_MAX_MS = 4500
const SWARM_NET_DECAY_PER_MS = 0.0022
const swarmNetPairs = []     // [{ a, b, fireAt, intensity }]
let animId = null

// Wanderer agent state — frontend-driven boids-ish update
const N_WANDERERS = 96         // bumped — denser swarm reads as parallel K2 agents
const AGENT_EDGE_BUDGET = 80   // max simultaneous agent-agent connection lines
const AGENT_EDGE_DIST   = 14   // world units; agents closer than this draw an edge
const wanderers = []         // [{ pos: Vector3, vel: Vector3, target: string }]

const _dummy = new THREE.Object3D()
const _col = new THREE.Color()
let _frame = 0

// Camera tween state
let cameraTween = null

// ── Init ───────────────────────────────────────────────────────────────────
function initThree() {
  const W = container.value.clientWidth
  const H = container.value.clientHeight

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(W, H)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 1)
  container.value.appendChild(renderer.domElement)

  labelRenderer = new CSS2DRenderer()
  labelRenderer.setSize(W, H)
  Object.assign(labelRenderer.domElement.style, {
    position: 'absolute', top: '0', left: '0', pointerEvents: 'none',
  })
  container.value.appendChild(labelRenderer.domElement)

  scene = new THREE.Scene()
  // Black fog — fades the swarm wanderers into the void without tinting the
  // foreground brain (TRIBE V2 hero is on pure-black, no atmospheric tint).
  scene.fog = new THREE.FogExp2(0x000000, 0.0025)

  // Lateral right-hemisphere view by default — matches TRIBE V2's hero render
  // angle. fsaverage5 mesh sits in MNI mm space, so the right hemi's lateral
  // surface faces +X.
  camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 1000)
  camera.position.set(220, 30, 0)
  camera.lookAt(0, 0, 0)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.07
  controls.minDistance = 60
  controls.maxDistance = 500
  controls.target.set(0, 0, 0)

  // Lighting tuned for cortical-tissue read: low neutral ambient, warm key
  // from upper-front (mimics studio light on a phantom brain), cool back-rim
  // for silhouette separation against the black bg.
  scene.add(new THREE.AmbientLight(0x303030, 0.55))
  const key = new THREE.DirectionalLight(0xfff0e0, 1.35)
  key.position.set(180, 220, 120)
  scene.add(key)
  const rim = new THREE.DirectionalLight(0xff9966, 0.45)
  rim.position.set(-140, 60, -120)
  scene.add(rim)
  const fill = new THREE.DirectionalLight(0xb0c8e0, 0.25)
  fill.position.set(-60, -40, 100)
  scene.add(fill)

  renderer.domElement.addEventListener('click', onCanvasClick)

  window.addEventListener('resize', onResize)
}

// ── Brain surface ──────────────────────────────────────────────────────────
function buildBrainMesh(data) {
  const N = data.n_vertices
  const vertices = new Float32Array(data.vertices)
  const indices = new Uint32Array(data.faces)

  // Light cortical-tissue base — vertex colors give every triangle the warm
  // off-white of a phantom brain. Lighting (in initThree) supplies the
  // gyri/sulci shading; activation patches blend over this base via
  // applyRegionLevelsToMesh.
  // Bilateral central-fissure cue is preserved: vertices near x=0 darken
  // slightly to suggest the longitudinal fissure between hemispheres.
  const colors = new Float32Array(N * 3)
  for (let i = 0; i < N; i++) {
    const x = vertices[i * 3]
    const fissure = Math.max(0, 1 - Math.abs(x) / 2.5)  // 1 at midline → 0 outside
    const dim = fissure * 0.18
    colors[i * 3]     = 0.82 - dim
    colors[i * 3 + 1] = 0.78 - dim
    colors[i * 3 + 2] = 0.72 - dim
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
  geo.setAttribute('color',    new THREE.BufferAttribute(colors,   3))
  geo.setIndex(new THREE.BufferAttribute(indices, 1))
  geo.computeVertexNormals()

  // MeshStandardMaterial: high roughness + zero metalness reads as cortical
  // tissue under the warm key light. Lowered opacity so the firing nodes +
  // swarm-net arcs read against the cortex without being lost in it.
  const mat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    side: THREE.DoubleSide,
    roughness: 0.92,
    metalness: 0.0,
    transparent: true,
    opacity: 0.45,
    depthWrite: false,
  })

  brainMesh = new THREE.Mesh(geo, mat)
  scene.add(brainMesh)

  // Compute approximate brain radius for orbits + atmosphere from vertex bbox.
  let maxR = 0
  for (let i = 0; i < N; i++) {
    const x = vertices[i * 3], y = vertices[i * 3 + 1], z = vertices[i * 3 + 2]
    const r = Math.sqrt(x*x + y*y + z*z)
    if (r > maxR) maxR = r
  }
  const brainR = maxR || 70

  buildAtmosphere(brainR)
  buildOrbits(brainR)
}

// ── Atmosphere halo (greenchain's atmosphere/rim/halo gradient stack) ──────
function buildAtmosphere(brainR) {
  // Subtle warm glow halo (matches the bottom-light feel of TRIBE V2's hero).
  // Kept very low opacity so the lateral cortex silhouette stays clean.
  const geo = new THREE.SphereGeometry(brainR * 1.18, 48, 36)
  atmosphereMat = new THREE.MeshBasicMaterial({
    color: 0xff9966,
    transparent: true,
    opacity: 0.025,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  atmosphereMesh = new THREE.Mesh(geo, atmosphereMat)
  scene.add(atmosphereMesh)
}

// ── Orbit rings (greenchain's faint orbit ellipses around the globe) ───────
function buildOrbits(brainR) {
  orbitGroup = new THREE.Group()
  scene.add(orbitGroup)

  const orbitCfg = [
    { radius: brainR * 1.32, tilt: 0.32, opacity: 0.18, dashArr: [0.6, 0.4] },
    { radius: brainR * 1.55, tilt: -0.18, opacity: 0.12, dashArr: [0.3, 0.7] },
  ]
  for (const cfg of orbitCfg) {
    const segments = 128
    const positions = new Float32Array(segments * 3)
    for (let i = 0; i < segments; i++) {
      const t = (i / segments) * Math.PI * 2
      positions[i * 3]     = Math.cos(t) * cfg.radius
      positions[i * 3 + 1] = Math.sin(t) * cfg.radius * 0.32  // squash for ellipse feel
      positions[i * 3 + 2] = Math.sin(t) * cfg.radius
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const mat = new THREE.LineBasicMaterial({
      color: 0xb4c8ff, transparent: true, opacity: cfg.opacity,
    })
    const orbit = new THREE.LineLoop(geo, mat)
    orbit.rotation.x = cfg.tilt
    orbitGroup.add(orbit)
  }
}

// ── Inter-agent + inter-region edge graphs ─────────────────────────────────
function buildEdgeGraphs() {
  // (1) Agent-to-agent: short connection lines between nearby wanderers when
  //     they cluster around an active region — visualizes "the swarm is
  //     thinking together".
  const agentPositions = new Float32Array(AGENT_EDGE_BUDGET * 2 * 3)
  const agentColors    = new Float32Array(AGENT_EDGE_BUDGET * 2 * 3)
  const agentGeo = new THREE.BufferGeometry()
  agentGeo.setAttribute('position', new THREE.BufferAttribute(agentPositions, 3))
  agentGeo.setAttribute('color',    new THREE.BufferAttribute(agentColors,    3))
  agentGeo.setDrawRange(0, 0)
  const agentMat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  agentEdgeLines = new THREE.LineSegments(agentGeo, agentMat)
  scene.add(agentEdgeLines)

  // (2) Region-to-region: arcs (multi-segment lines along a great-circle bow)
  //     between the top-2 most active regions, animated dashed-style. This is
  //     the "K2 swarm cross-talk" visual — when two specialists co-fire, an
  //     arc lights up between them.
  const REGION_ARC_SEGMENTS = 32
  const regionPositions = new Float32Array(REGION_ARC_SEGMENTS * 2 * 3) // segment lines
  const regionColors    = new Float32Array(REGION_ARC_SEGMENTS * 2 * 3)
  const regionGeo = new THREE.BufferGeometry()
  regionGeo.setAttribute('position', new THREE.BufferAttribute(regionPositions, 3))
  regionGeo.setAttribute('color',    new THREE.BufferAttribute(regionColors,    3))
  regionGeo.setDrawRange(0, 0)
  const regionMat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  regionEdgeLines = new THREE.LineSegments(regionGeo, regionMat)
  scene.add(regionEdgeLines)

  // (3) Swarm network: independent pulses between every pair of region
  //     specialists, each on its own random firing period. Reads as
  //     "agents talking at random rates" without depending on activation.
  const SWARM_PAIR_BUDGET = 21  // 7 choose 2 — every region pair
  const swarmNetPositions = new Float32Array(SWARM_PAIR_BUDGET * SWARM_NET_SEGMENTS * 2 * 3)
  const swarmNetColors    = new Float32Array(SWARM_PAIR_BUDGET * SWARM_NET_SEGMENTS * 2 * 3)
  const swarmNetGeo = new THREE.BufferGeometry()
  swarmNetGeo.setAttribute('position', new THREE.BufferAttribute(swarmNetPositions, 3))
  swarmNetGeo.setAttribute('color',    new THREE.BufferAttribute(swarmNetColors,    3))
  swarmNetGeo.setDrawRange(0, 0)
  const swarmNetMat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  swarmNetEdgeLines = new THREE.LineSegments(swarmNetGeo, swarmNetMat)
  scene.add(swarmNetEdgeLines)
}

// ── Region agents (7 spheres) ──────────────────────────────────────────────
//
// Place each sphere at the network's anatomical centroid PROJECTED to the
// nearest pial-surface vertex — `data.centroid` (mean of vertex_indices) can
// land inside the cortex for spread-out networks like default_mode. Pushing
// the projected vertex slightly outward along its origin-radial keeps the
// sphere visually "on the surface" rather than embedded in it.
function buildRegionAgents(networks) {
  const meshPos = brainMesh?.geometry?.attributes?.position?.array
  for (const [name, data] of Object.entries(networks)) {
    const hex = networkHex(name)

    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(4, 16, 12),
      new THREE.MeshPhongMaterial({ color: hex, emissive: hex, emissiveIntensity: 0.25 }),
    )

    let placed = data.centroid
    const idxs = data.vertex_indices || []
    if (meshPos && idxs.length) {
      const [cx, cy, cz] = data.centroid
      let bestIdx = idxs[0]
      let bestD2 = Infinity
      for (let k = 0; k < idxs.length; k++) {
        const v = idxs[k]
        const dx = meshPos[v * 3] - cx
        const dy = meshPos[v * 3 + 1] - cy
        const dz = meshPos[v * 3 + 2] - cz
        const d2 = dx * dx + dy * dy + dz * dz
        if (d2 < bestD2) {
          bestD2 = d2
          bestIdx = v
        }
      }
      const sx = meshPos[bestIdx * 3]
      const sy = meshPos[bestIdx * 3 + 1]
      const sz = meshPos[bestIdx * 3 + 2]
      // Push 5 units along the origin-outward direction so sphere sits ABOVE
      // the surface, not embedded in cortical tissue.
      const r = Math.sqrt(sx * sx + sy * sy + sz * sz) || 1
      const f = (r + 5) / r
      placed = [sx * f, sy * f, sz * f]
    }
    mesh.position.set(...placed)
    mesh.userData.network = name
    scene.add(mesh)

    const glowMat = new THREE.MeshBasicMaterial({
      color: hex, transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
    const glow = new THREE.Mesh(new THREE.SphereGeometry(7, 16, 12), glowMat)
    glow.userData.network = name
    mesh.add(glow)

    const div = document.createElement('div')
    Object.assign(div.style, {
      color: data.color, fontSize: '11px', fontWeight: '600',
      background: 'rgba(5,5,20,0.75)', padding: '3px 7px',
      borderRadius: '4px', border: `1px solid ${data.color}`,
      whiteSpace: 'nowrap', letterSpacing: '0.5px',
      pointerEvents: 'none',
    })
    div.textContent = name.replace(/_/g, ' ')
    const labelObj = new CSS2DObject(div)
    labelObj.position.set(0, 9, 0)
    mesh.add(labelObj)

    regionMeshes[name] = { mesh, glowMat, labelDiv: div, centroid: data.centroid }
  }
}

// ── Wanderers ──────────────────────────────────────────────────────────────
function buildWanderers(n = N_WANDERERS) {
  wandererMesh = new THREE.InstancedMesh(
    new THREE.SphereGeometry(1.5, 6, 6),
    new THREE.MeshBasicMaterial({ color: 0xffffff }),
    n,
  )
  wandererMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  scene.add(wandererMesh)

  // Seed wanderers around origin with random velocities
  for (let i = 0; i < n; i++) {
    wanderers.push({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 120,
        (Math.random() - 0.5) * 80 + 10,
        (Math.random() - 0.5) * 120,
      ),
      vel: new THREE.Vector3(
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3,
      ),
    })
  }
}

// ── Coloring helpers ───────────────────────────────────────────────────────
// TRIBE V2 heat colormap: deep red (low) → orange → yellow → white (peak).
// Stops match the reference at /tmp/tribev2-ref/section-2.png.
function activationToRGB(t, out) {
  const tt = Math.max(0, Math.min(1, t))
  if (tt < 0.20) {
    const s = tt / 0.20
    out[0] = 0.10 + s * 0.25; out[1] = 0.0;             out[2] = 0.0
  } else if (tt < 0.45) {
    const s = (tt - 0.20) / 0.25
    out[0] = 0.35 + s * 0.50; out[1] = 0.07 + s * 0.16; out[2] = 0.0
  } else if (tt < 0.70) {
    const s = (tt - 0.45) / 0.25
    out[0] = 0.85 + s * 0.13; out[1] = 0.23 + s * 0.40; out[2] = 0.0
  } else if (tt < 0.90) {
    const s = (tt - 0.70) / 0.20
    out[0] = 0.98;            out[1] = 0.63 + s * 0.22; out[2] = 0.0 + s * 0.29
  } else {
    const s = (tt - 0.90) / 0.10
    out[0] = 0.98 + s * 0.02; out[1] = 0.85 + s * 0.15; out[2] = 0.29 + s * 0.71
  }
}

// Cheap deterministic per-vertex noise — gives the activation patches a
// non-uniform, splotchy look so each region doesn't paint as one flat blob.
function vertNoise(x, y, z) {
  const s = Math.sin(x * 12.9898 + y * 78.233 + z * 43.563) * 43758.5453
  return s - Math.floor(s)
}

// Cortical base color — kept in sync with buildBrainMesh's initial fill.
const BASE_R = 0.82, BASE_G = 0.78, BASE_B = 0.72

// ── Per-vertex network weights (TRIBE-V2-style soft membership paint) ──────
// vertex_weights.bin is float32 little-endian, shape [n_vertices × 7],
// row-major. Computed via gaussian centroid distance (sigma=18mm) so each
// vertex carries soft membership across all 7 Yeo7 networks. Loaded once at
// mount; if the fetch fails we silently fall back to the legacy
// applyRegionLevelsToMesh (hard label boundaries).
let vertexWeights = null              // Float32Array len n_verts*7
let networkOrder = null               // string[7] from manifest
let nVerticesWeights = 0              // int from manifest
const SCRATCH_LV = new Float32Array(7) // pre-allocated lv vector for matmul

// Per-vertex direct slice cache (Phase 3 fallback path). Populated by
// loadPerVertex when /demo/per-vertex/{clipId} returns 200; otherwise stays
// null and the matmul path runs.
let perVertexBuf = null               // Float32Array [n_frames × n_vertices]
let perVertexNFrames = 0

async function loadVertexWeights() {
  // Served from /static/ — NOT /brain/ — because vite's dev proxy forwards
  // every /brain/* request to the backend (where these files don't live).
  try {
    const manifestRes = await fetch('/static/brain/vertex_weights.json')
    if (!manifestRes.ok) {
      console.warn('vertex_weights.json missing — falling back to legacy region paint')
      return
    }
    const manifest = await manifestRes.json()
    const binRes = await fetch('/static/brain/vertex_weights.bin')
    if (!binRes.ok) {
      console.warn('vertex_weights.bin missing — falling back to legacy region paint')
      return
    }
    const buf = await binRes.arrayBuffer()
    const expectedBytes = manifest.n_vertices * manifest.n_networks * 4
    if (buf.byteLength !== expectedBytes) {
      console.warn(
        `vertex_weights.bin size mismatch: got ${buf.byteLength} bytes, expected ${expectedBytes} ` +
        `(n_vertices=${manifest.n_vertices} × n_networks=${manifest.n_networks} × 4). ` +
        `Falling back to legacy region paint.`,
      )
      return
    }
    vertexWeights = new Float32Array(buf)
    networkOrder = manifest.network_order
    nVerticesWeights = manifest.n_vertices
  } catch (err) {
    console.warn('vertex weights load failed — falling back to legacy region paint:', err)
    vertexWeights = null
  }
}

async function loadPerVertex(clipId) {
  perVertexBuf = null
  perVertexNFrames = 0
  if (!clipId) return
  try {
    const r = await fetch(`/demo/per-vertex/${encodeURIComponent(clipId)}`)
    if (!r.ok) return  // 404 = no data baked yet, fall back to weight matmul
    const nFrames = parseInt(r.headers.get('X-N-Frames') || '0', 10)
    const nVerts  = parseInt(r.headers.get('X-N-Vertices') || '0', 10)
    if (nFrames < 1 || nVerts !== (nVerticesWeights || nVertices.value)) return
    const buf = await r.arrayBuffer()
    perVertexBuf = new Float32Array(buf)
    perVertexNFrames = nFrames
  } catch { /* network error → fall back silently */ }
}

// Phase 2 paint path: smooth TRIBE-V2-style heatmap via per-vertex network
// weight matmul. Each vertex's activation = Σ W[v,n] * level[n], yielding
// soft regional boundaries instead of hard Yeo7 label edges. Includes a
// baseline floor + per-vertex jitter so the cortex never reads as flat grey.
function paintHeatmapFromWeights(levels) {
  if (!brainMesh || !vertexWeights || !networkOrder) return
  const colors = brainMesh.geometry.attributes.color.array
  const positions = brainMesh.geometry.attributes.position.array
  const tmp = [0, 0, 0]
  // Cache the 7 levels in canonical network_order — order MUST match
  // the manifest so column n of W aligns with networkOrder[n].
  const lv = SCRATCH_LV
  for (let n = 0; n < 7; n++) lv[n] = levels[networkOrder[n]] ?? 0
  const N = nVerticesWeights
  for (let v = 0; v < N; v++) {
    const base = v * 7
    let act = 0
    for (let n = 0; n < 7; n++) act += vertexWeights[base + n] * lv[n]
    const px = positions[v * 3], py = positions[v * 3 + 1], pz = positions[v * 3 + 2]
    // Baseline floor + tiny jitter — cortex always carries a faint warm glow.
    const baseline = 0.04 + 0.03 * vertNoise(px, py, pz)
    const eff = Math.max(act, baseline)
    activationToRGB(eff, tmp)
    // Preserve fissure cue (matches buildBrainMesh's initial fill).
    const fissure = Math.max(0, 1 - Math.abs(px) / 2.5)
    const dim = fissure * 0.18
    const baseR = BASE_R - dim, baseG = BASE_G - dim, baseB = BASE_B - dim
    const blend = Math.min(1, eff * 1.4)
    colors[v * 3]     = baseR + (tmp[0] - baseR) * blend
    colors[v * 3 + 1] = baseG + (tmp[1] - baseG) * blend
    colors[v * 3 + 2] = baseB + (tmp[2] - baseB) * blend
  }
  brainMesh.geometry.attributes.color.needsUpdate = true
}

// Phase 3 paint path: direct per-vertex activation slice from a pre-baked
// [n_frames × n_vertices] buffer. Interpolates between adjacent frame slices
// (same temporal smoothing as Phase 1) and applies the same baseline floor +
// colormap blend logic as paintHeatmapFromWeights. Active only when
// perVertexBuf was successfully loaded for the current clip.
function paintHeatmapFromPerVertex(tFrac) {
  if (!brainMesh || !perVertexBuf || perVertexNFrames < 1) return
  const colors = brainMesh.geometry.attributes.color.array
  const positions = brainMesh.geometry.attributes.position.array
  const tmp = [0, 0, 0]
  const N = nVerticesWeights || nVertices.value
  const i0 = Math.floor(tFrac)
  const alpha = tFrac - i0
  const safe0 = ((i0 % perVertexNFrames) + perVertexNFrames) % perVertexNFrames
  const safe1 = (((i0 + 1) % perVertexNFrames) + perVertexNFrames) % perVertexNFrames
  const off0 = safe0 * N
  const off1 = safe1 * N
  for (let v = 0; v < N; v++) {
    const a0 = perVertexBuf[off0 + v]
    const a1 = perVertexBuf[off1 + v]
    const act = a0 * (1 - alpha) + a1 * alpha
    const px = positions[v * 3], py = positions[v * 3 + 1], pz = positions[v * 3 + 2]
    const baseline = 0.04 + 0.03 * vertNoise(px, py, pz)
    const eff = Math.max(act, baseline)
    activationToRGB(eff, tmp)
    const fissure = Math.max(0, 1 - Math.abs(px) / 2.5)
    const dim = fissure * 0.18
    const baseR = BASE_R - dim, baseG = BASE_G - dim, baseB = BASE_B - dim
    const blend = Math.min(1, eff * 1.4)
    colors[v * 3]     = baseR + (tmp[0] - baseR) * blend
    colors[v * 3 + 1] = baseG + (tmp[1] - baseG) * blend
    colors[v * 3 + 2] = baseB + (tmp[2] - baseB) * blend
  }
  brainMesh.geometry.attributes.color.needsUpdate = true
}

// fallback if vertex_weights.bin unavailable.
// Apply a per-network level dictionary to the mesh's vertex-color buffer.
// Heat colormap blends OVER the light cortical base — low activation leaves
// the cortex visible; high activation paints with TRIBE heat patches.
function applyRegionLevelsToMesh(levels) {
  if (!brainMesh || !meshNetworks.value) return
  const colors = brainMesh.geometry.attributes.color.array
  const positions = brainMesh.geometry.attributes.position.array
  const tmp = [0, 0, 0]
  // Reset to base cortex (preserves the bilateral fissure cue baked at build).
  for (let i = 0; i < colors.length; i += 3) {
    const x = positions[i]
    const fissure = Math.max(0, 1 - Math.abs(x) / 2.5)
    const dim = fissure * 0.18
    colors[i]     = BASE_R - dim
    colors[i + 1] = BASE_G - dim
    colors[i + 2] = BASE_B - dim
  }
  for (const [name, meta] of Object.entries(meshNetworks.value)) {
    const lvl = levels[name] ?? 0
    if (lvl < 0.05) continue  // leave base cortex visible at very low activity
    const idxs = meta.vertex_indices
    if (!idxs) continue
    for (let k = 0; k < idxs.length; k++) {
      const v = idxs[k]
      const px = positions[v * 3]
      const py = positions[v * 3 + 1]
      const pz = positions[v * 3 + 2]
      // Per-vertex jitter on activation (±20%) for the splotchy TRIBE look.
      const noise = 0.8 + 0.4 * vertNoise(px, py, pz)
      const lvlMod = Math.max(0, Math.min(1, lvl * noise))
      activationToRGB(lvlMod, tmp)
      // Blend strength rises with activation — quiet regions show base cortex
      // peeking through; hot regions saturate to full heat.
      const blend = Math.min(1, lvl * 1.4)
      colors[v * 3]     = colors[v * 3]     + (tmp[0] - colors[v * 3])     * blend
      colors[v * 3 + 1] = colors[v * 3 + 1] + (tmp[1] - colors[v * 3 + 1]) * blend
      colors[v * 3 + 2] = colors[v * 3 + 2] + (tmp[2] - colors[v * 3 + 2]) * blend
    }
  }
  brainMesh.geometry.attributes.color.needsUpdate = true
}

// Region sphere intensity from activation level
function applyRegionGlows(levels) {
  for (const [name, rm] of Object.entries(regionMeshes)) {
    const lvl = levels[name] ?? 0
    const active = lvl > 0.55
    rm.mesh.material.emissiveIntensity = 0.18 + lvl * 0.85
    rm.glowMat.opacity = active ? 0.10 + lvl * 0.30 : 0.05 + lvl * 0.15
  }
}

// ── Wanderer per-frame update (boids-lite) ─────────────────────────────────
function updateWanderers(levels, dt) {
  if (!wandererMesh) return

  // Pick the most-active region as primary attractor
  let best = null, bestLvl = 0
  for (const [name, lvl] of Object.entries(levels)) {
    if (lvl > bestLvl) { bestLvl = lvl; best = name }
  }
  const target = best ? regionMeshes[best]?.mesh.position : null

  for (let i = 0; i < wanderers.length; i++) {
    const w = wanderers[i]

    // Steering force toward active region
    if (target) {
      const dx = target.x - w.pos.x
      const dy = target.y - w.pos.y
      const dz = target.z - w.pos.z
      const dist = Math.sqrt(dx*dx + dy*dy + dz*dz) + 1e-6
      const k = (0.0002 + 0.001 * bestLvl) * dt
      w.vel.x += (dx / dist) * k
      w.vel.y += (dy / dist) * k
      w.vel.z += (dz / dist) * k
    }

    // Jitter
    w.vel.x += (Math.random() - 0.5) * 0.02 * dt
    w.vel.y += (Math.random() - 0.5) * 0.02 * dt
    w.vel.z += (Math.random() - 0.5) * 0.02 * dt

    // Damping (velocity cap)
    const vmag = Math.sqrt(w.vel.x*w.vel.x + w.vel.y*w.vel.y + w.vel.z*w.vel.z)
    const VMAX = 0.6
    if (vmag > VMAX) {
      w.vel.multiplyScalar(VMAX / vmag)
    }

    w.pos.x += w.vel.x * dt
    w.pos.y += w.vel.y * dt
    w.pos.z += w.vel.z * dt

    // Soft shell: clamp distance from center to 140
    const r = Math.sqrt(w.pos.x*w.pos.x + w.pos.y*w.pos.y + w.pos.z*w.pos.z)
    if (r > 140) {
      const s = 140 / r
      w.pos.multiplyScalar(s)
      w.vel.multiplyScalar(0.5)
    }

    _dummy.position.copy(w.pos)
    _dummy.updateMatrix()
    wandererMesh.setMatrixAt(i, _dummy.matrix)

    // Color based on whether near active region
    const intensity = bestLvl
    _col.setRGB(
      0.30 + 0.60 * intensity,
      0.60 + 0.35 * intensity,
      1.00,
    )
    wandererMesh.setColorAt(i, _col)
  }
  wandererMesh.instanceMatrix.needsUpdate = true
  if (wandererMesh.instanceColor) wandererMesh.instanceColor.needsUpdate = true
}

// ── Camera tween for layout transition ─────────────────────────────────────
function tweenCameraTo(targetPos, targetLookAt, ms = 1000) {
  const startPos = camera.position.clone()
  const startTarget = controls.target.clone()
  const t0 = performance.now()
  cameraTween = (now) => {
    const t = Math.min(1, (now - t0) / ms)
    // ease-in-out cubic
    const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    camera.position.lerpVectors(startPos, targetPos, e)
    controls.target.lerpVectors(startTarget, targetLookAt, e)
    if (t >= 1) cameraTween = null
  }
}

function applyLayout(layout) {
  if (!camera || !controls) return
  if (layout === 'left-half') {
    // Lateral right-hemi view, biased so the brain reads as centered within
    // the left half of the screen (slight off-axis pull to the right).
    tweenCameraTo(
      new THREE.Vector3(210, 25, 60),
      new THREE.Vector3(0, 0, 0),
    )
  } else {
    // Pure lateral right-hemisphere view — matches TRIBE V2 hero angle.
    tweenCameraTo(
      new THREE.Vector3(220, 30, 0),
      new THREE.Vector3(0, 0, 0),
    )
  }
}

// ── Click → nearest region in screen space ────────────────────────────────
// Yeo7 centroids are averaged across both hemispheres, so all 7 land near the
// midline (x≈5) and a strict raycaster against the small radius-4 spheres
// almost always picks whichever is closest to the camera (frontoparietal),
// regardless of where the user clicks. Project each centroid to screen and
// pick the closest one within a generous pixel radius — matches what the
// user actually sees.
const _projVec = new THREE.Vector3()
function onCanvasClick(ev) {
  if (!props.interactive || !camera) return
  const rect = renderer.domElement.getBoundingClientRect()
  const cx = ev.clientX - rect.left
  const cy = ev.clientY - rect.top
  const W = rect.width, H = rect.height

  let bestName = null
  let bestDist2 = Infinity
  for (const [name, rm] of Object.entries(regionMeshes)) {
    _projVec.copy(rm.mesh.position).project(camera)
    if (_projVec.z > 1) continue  // behind camera / clipped
    const sx = (_projVec.x * 0.5 + 0.5) * W
    const sy = (-_projVec.y * 0.5 + 0.5) * H
    const dx = sx - cx, dy = sy - cy
    const d2 = dx * dx + dy * dy
    if (d2 < bestDist2) {
      bestDist2 = d2
      bestName = name
    }
  }
  // Generous radius: 120px ~ a third of typical pane height. Spheres are
  // small and labels sit ~9 world units above; give the user room.
  const MAX_PX = 120
  if (bestName && bestDist2 <= MAX_PX * MAX_PX) {
    emit('region-clicked', bestName)
  }
}

// ── Animation loop ─────────────────────────────────────────────────────────
let lastT = performance.now()
function animate() {
  animId = requestAnimationFrame(animate)
  const now = performance.now()
  const dt = Math.min(50, now - lastT) // ms; cap to avoid huge jumps
  lastT = now
  _frame += 1

  if (cameraTween) cameraTween(now)
  controls.update()

  // Atmosphere pulse — independent of activity, so the brain is never visually
  // dead even with all-zero activations. Subtle 4s breath cycle.
  if (atmosphereMat) {
    const breath = (Math.sin(now * 0.001 * Math.PI / 2) + 1) / 2
    atmosphereMat.opacity = 0.018 + breath * 0.018
  }
  if (orbitGroup) {
    orbitGroup.rotation.y = now * 0.00008
  }

  // Drive visuals from activity.json + currentTime
  if (props.activityData && brainMesh) {
    const data = props.activityData
    const fps = data.fps || 1
    const nFrames = data.frames?.length || 0
    if (nFrames > 0) {
      // Phase 1: temporal interpolation between adjacent frames so the cortex
      // glides smoothly at 60fps instead of snapping at 1Hz. levels{} blends
      // the two flanking frames; downstream consumers (glows, wanderers,
      // arcs) all benefit from the smoothing for free.
      const tFrac = (props.currentTime || 0) * fps
      const i0 = Math.floor(tFrac)
      const alpha = tFrac - i0
      const safe0 = ((i0 % nFrames) + nFrames) % nFrames
      const safe1 = (((i0 + 1) % nFrames) + nFrames) % nFrames
      const f0 = data.frames[safe0]
      const f1 = data.frames[safe1]
      const r0 = f0.regions || {}
      const r1 = f1.regions || {}
      const levels = {}
      const gain = levelGain * (props.levelGainBoost || 1.0)
      for (const k of Object.keys(r0)) {
        levels[k] = ((r0[k] ?? 0) * (1 - alpha) + (r1[k] ?? 0) * alpha) * gain
      }
      // Heatmap dispatch: prefer the per-vertex direct slice when available,
      // otherwise weight-matmul, otherwise legacy hard-label paint.
      if (perVertexBuf) {
        paintHeatmapFromPerVertex(tFrac)
      } else if (vertexWeights) {
        paintHeatmapFromWeights(levels)
      } else {
        applyRegionLevelsToMesh(levels)
      }
      applyRegionGlows(levels)
      updateWanderers(levels, dt / 16.67)  // normalize to ~60fps step units
      // Update atmosphere intensity from peak activation — brain "breathes harder"
      // when a network is firing strongly.
      if (atmosphereMat) {
        let peak = 0
        for (const v of Object.values(levels)) if (v > peak) peak = v
        // Cap halo at a low maximum so the brain silhouette never gets a
        // bright halo overlay — TRIBE V2's brain reads against pure black.
        atmosphereMat.opacity = Math.min(0.06, atmosphereMat.opacity + peak * 0.02)
      }
      updateAgentEdges()
      updateRegionEdges(levels)
      updateSwarmNetwork(now, dt, levels)
      topRegion.value = (alpha < 0.5 ? f0.top_region : f1.top_region) || ''
    }
  } else {
    // No activity yet — still tick the swarm so it's always alive on stage.
    updateAgentEdges()
    updateSwarmNetwork(now, dt, {})
  }

  renderer.render(scene, camera)
  labelRenderer.render(scene, camera)
}

// Recompute the agent-agent connection lines. Only kept when agents are within
// AGENT_EDGE_DIST of each other — gives the swarm a "thinking together" feel
// without becoming a dense fog at every frame.
function updateAgentEdges() {
  if (!agentEdgeLines) return
  const positions = agentEdgeLines.geometry.attributes.position.array
  const colors    = agentEdgeLines.geometry.attributes.color.array
  let pairCount = 0
  const N = wanderers.length
  const D2 = AGENT_EDGE_DIST * AGENT_EDGE_DIST
  // O(N^2) but N=96 → ~9k checks/frame; fine on modern GPU-frontends.
  outer:
  for (let i = 0; i < N; i++) {
    const a = wanderers[i]
    for (let j = i + 1; j < N; j++) {
      const b = wanderers[j]
      const dx = a.pos.x - b.pos.x, dy = a.pos.y - b.pos.y, dz = a.pos.z - b.pos.z
      const d2 = dx*dx + dy*dy + dz*dz
      if (d2 > D2) continue
      const k = pairCount * 6
      positions[k]     = a.pos.x; positions[k + 1] = a.pos.y; positions[k + 2] = a.pos.z
      positions[k + 3] = b.pos.x; positions[k + 4] = b.pos.y; positions[k + 5] = b.pos.z
      // Fade by distance — closer = brighter.
      const t = 1 - Math.sqrt(d2) / AGENT_EDGE_DIST
      colors[k]     = 0.55 * t; colors[k + 1] = 0.85 * t; colors[k + 2] = 1.00 * t
      colors[k + 3] = 0.55 * t; colors[k + 4] = 0.85 * t; colors[k + 5] = 1.00 * t
      pairCount += 1
      if (pairCount >= AGENT_EDGE_BUDGET) break outer
    }
  }
  agentEdgeLines.geometry.setDrawRange(0, pairCount * 2)
  agentEdgeLines.geometry.attributes.position.needsUpdate = true
  agentEdgeLines.geometry.attributes.color.needsUpdate    = true
}

// Region-to-region cross-talk arc: connects the top-2 most active regions
// with a great-circle-style bow (greenchain peak-lift trick), animated as
// a moving dashed reveal so it reads as "signal flowing".
function updateRegionEdges(levels) {
  if (!regionEdgeLines) return
  // Top-2 by activation
  const ranked = Object.entries(levels)
    .filter(([, v]) => Number.isFinite(v))
    .sort((a, b) => b[1] - a[1])
  if (ranked.length < 2 || ranked[1][1] < 0.15) {
    regionEdgeLines.geometry.setDrawRange(0, 0)
    return
  }
  const aMesh = regionMeshes[ranked[0][0]]
  const bMesh = regionMeshes[ranked[1][0]]
  if (!aMesh || !bMesh) {
    regionEdgeLines.geometry.setDrawRange(0, 0)
    return
  }
  const a = aMesh.mesh.position, b = bMesh.mesh.position

  const REGION_ARC_SEGMENTS = 32
  const positions = regionEdgeLines.geometry.attributes.position.array
  const colors    = regionEdgeLines.geometry.attributes.color.array

  // Color = blend of the two region colors
  const aCol = aMesh.mesh.material.color
  const bCol = bMesh.mesh.material.color

  // Animated dash phase via _frame: each segment's brightness depends on its
  // position in the "wave".
  const wavePhase = (_frame * 0.045) % 1.0

  for (let i = 0; i < REGION_ARC_SEGMENTS; i++) {
    const t0 = i / REGION_ARC_SEGMENTS
    const t1 = (i + 1) / REGION_ARC_SEGMENTS
    const p0 = arcPoint(a, b, t0)
    const p1 = arcPoint(a, b, t1)
    const k = i * 6
    positions[k]     = p0.x; positions[k + 1] = p0.y; positions[k + 2] = p0.z
    positions[k + 3] = p1.x; positions[k + 4] = p1.y; positions[k + 5] = p1.z

    // Dashed-pulse: brightness peaks where (t - wavePhase) wraps to ~0.
    const dashT = ((t0 - wavePhase) + 1) % 1
    const pulse = Math.pow(Math.max(0, 1 - dashT * 4), 2)  // sharp peak then decay
    const baseT = 0.18 + pulse * 0.82
    // Lerp color a→b along the arc
    const blend = t0
    colors[k]     = (aCol.r * (1 - blend) + bCol.r * blend) * baseT
    colors[k + 1] = (aCol.g * (1 - blend) + bCol.g * blend) * baseT
    colors[k + 2] = (aCol.b * (1 - blend) + bCol.b * blend) * baseT
    colors[k + 3] = colors[k]
    colors[k + 4] = colors[k + 1]
    colors[k + 5] = colors[k + 2]
  }
  regionEdgeLines.geometry.setDrawRange(0, REGION_ARC_SEGMENTS * 2)
  regionEdgeLines.geometry.attributes.position.needsUpdate = true
  regionEdgeLines.geometry.attributes.color.needsUpdate    = true
}

// Inter-region swarm network: every region pair sparks on its own random
// schedule. Each pair holds an `intensity` that jumps to 1 on fire, then
// decays exponentially. Geometry is rewritten every frame; pairs with
// near-zero intensity contribute black-on-additive (effectively invisible).
function initSwarmNetPairs() {
  if (swarmNetPairs.length > 0) return
  const names = Object.keys(regionMeshes)
  if (names.length < 2) return
  const now = performance.now()
  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      swarmNetPairs.push({
        a: names[i],
        b: names[j],
        fireAt: now + Math.random() * SWARM_NET_FIRE_MAX_MS,
        intensity: 0,
      })
    }
  }
}

function updateSwarmNetwork(now, dt, levels) {
  if (!swarmNetEdgeLines) return
  if (swarmNetPairs.length === 0) initSwarmNetPairs()
  if (swarmNetPairs.length === 0) return

  const positions = swarmNetEdgeLines.geometry.attributes.position.array
  const colors    = swarmNetEdgeLines.geometry.attributes.color.array
  const decay = Math.exp(-SWARM_NET_DECAY_PER_MS * dt)

  let segOffset = 0
  for (const pair of swarmNetPairs) {
    // Continuous per-pair boost driven by the activity.json levels for the
    // two endpoint networks. The pair's fire rate, peak intensity, and arc
    // lift all scale with max(level_a, level_b) via a smoothstep ramp from
    // 0.30 → 0.85. No regex, no "high" keyword — purely numeric.
    const la = (levels && levels[pair.a]) || 0
    const lb = (levels && levels[pair.b]) || 0
    const lvl = la > lb ? la : lb
    const x = Math.max(0, Math.min(1, (lvl - 0.30) / (0.85 - 0.30)))
    const k = x * x * (3 - 2 * x)
    const fireScale = 1.0 + (0.18 - 1.0) * k       // 1.0 → 0.18 (interval shrinks ~5.5×)
    const peakI    = 1.0 + (1.8  - 1.0) * k
    const liftCoef = 0.45 + (1.10 - 0.45) * k

    const fireMin = SWARM_NET_FIRE_MIN_MS * fireScale
    const fireMax = SWARM_NET_FIRE_MAX_MS * fireScale

    if (now >= pair.fireAt && pair.intensity < 0.05) {
      pair.intensity = peakI
      pair.fireAt = now + fireMin + Math.random() * (fireMax - fireMin)
    } else {
      pair.intensity *= decay
    }

    const aMesh = regionMeshes[pair.a]
    const bMesh = regionMeshes[pair.b]
    if (!aMesh || !bMesh) { segOffset += SWARM_NET_SEGMENTS; continue }

    const a = aMesh.mesh.position, b = bMesh.mesh.position
    const aCol = aMesh.mesh.material.color
    const bCol = bMesh.mesh.material.color
    const I = pair.intensity

    for (let s = 0; s < SWARM_NET_SEGMENTS; s++) {
      const t0 = s / SWARM_NET_SEGMENTS
      const t1 = (s + 1) / SWARM_NET_SEGMENTS
      const p0 = arcPoint(a, b, t0, liftCoef)
      const p1 = arcPoint(a, b, t1, liftCoef)
      const ki = (segOffset + s) * 6
      positions[ki]     = p0.x; positions[ki + 1] = p0.y; positions[ki + 2] = p0.z
      positions[ki + 3] = p1.x; positions[ki + 4] = p1.y; positions[ki + 5] = p1.z

      // Bright leading head, dim tail — head sits at t=0 on fire and slides
      // out as intensity decays, so a fresh pulse reads as "signal racing
      // from one node to the other".
      const headPos = 1 - Math.min(1, I)
      const distFromHead = Math.abs(t0 - headPos)
      const headGlow = Math.pow(Math.max(0, 1 - distFromHead * 6), 2)
      const gain = 1.0 + 0.7 * k
      const baseT = (0.15 + headGlow * 0.85) * Math.min(1, I) * gain
      const blend = t0
      const r = (aCol.r * (1 - blend) + bCol.r * blend) * baseT
      const g = (aCol.g * (1 - blend) + bCol.g * blend) * baseT
      const bl = (aCol.b * (1 - blend) + bCol.b * blend) * baseT
      colors[ki]     = r;  colors[ki + 1] = g;  colors[ki + 2] = bl
      colors[ki + 3] = r;  colors[ki + 4] = g;  colors[ki + 5] = bl
    }
    segOffset += SWARM_NET_SEGMENTS
  }
  swarmNetEdgeLines.geometry.setDrawRange(0, segOffset * 2)
  swarmNetEdgeLines.geometry.attributes.position.needsUpdate = true
  swarmNetEdgeLines.geometry.attributes.color.needsUpdate    = true
}

// Arc helper — quadratic Bézier with a midpoint lifted along the average
// outward normal of the two endpoints. Same trick as greenchain's route arcs:
// `arcHeight = sin(progress*PI)^0.94` lifts the midpoint above the body.
// liftCoef controls how far above the brain volume the arc bows — values >0.6
// take the arc visibly outside the cortex (used for boosted "high" pairs).
function arcPoint(a, b, t, liftCoef = 0.45) {
  const ax = a.x, ay = a.y, az = a.z
  const bx = b.x, by = b.y, bz = b.z
  // Linear interp
  const lx = ax + (bx - ax) * t
  const ly = ay + (by - ay) * t
  const lz = az + (bz - az) * t
  // Lift along the midpoint's outward direction
  const mx = (ax + bx) / 2, my = (ay + by) / 2, mz = (az + bz) / 2
  const rm = Math.sqrt(mx * mx + my * my + mz * mz) + 1e-6
  const dist = Math.sqrt(
    (bx - ax) ** 2 + (by - ay) ** 2 + (bz - az) ** 2
  )
  const lift = Math.pow(Math.sin(t * Math.PI), 0.94) * dist * liftCoef
  return {
    x: lx + (mx / rm) * lift,
    y: ly + (my / rm) * lift,
    z: lz + (mz / rm) * lift,
  }
}

// ── Layout / resize ────────────────────────────────────────────────────────
function onResize() {
  if (!container.value) return
  const W = container.value.clientWidth
  const H = container.value.clientHeight
  camera.aspect = W / H
  camera.updateProjectionMatrix()
  renderer.setSize(W, H)
  labelRenderer.setSize(W, H)
}

watch(() => props.layout, (v) => {
  // Defer one tick so DOM has the new size
  requestAnimationFrame(() => {
    onResize()
    applyLayout(v)
  })
})

// Reload the per-vertex direct slice when the clip changes (Phase 3 path).
// 404 is expected today since no per_vertex.bin is baked yet — loadPerVertex
// stays silent in that case and the matmul path takes over.
watch(
  () => props.clipId,
  (id) => { loadPerVertex(id) },
)

// Recompute level-gain whenever activityData arrives or swaps. Without this,
// z-scored activity values (~0..0.3) never lift the colormap above baseline
// and the cortex stays grey.
watch(
  () => props.activityData,
  (act) => { recomputeLevelGain(act) },
  { immediate: true },
)

// ── Lifecycle ──────────────────────────────────────────────────────────────
onMounted(async () => {
  initThree()
  // Kick off vertex_weights fetch in parallel with the mesh fetch — both are
  // small and independent. Weights become active in animate() on the first
  // frame they're available.
  const weightsP = loadVertexWeights()
  try {
    const meshData = await fetchMesh()
    buildBrainMesh(meshData)
    buildRegionAgents(meshData.networks)
    buildWanderers()
    buildEdgeGraphs()
    meshNetworks.value = meshData.networks
    nVertices.value = meshData.n_vertices
    emit('mesh-ready', {
      networks: meshData.networks,
      n_vertices: meshData.n_vertices,
    })
  } catch (err) {
    console.error('Mesh load failed:', err)
  }
  await weightsP
  // If clipId was already set at mount, probe per-vertex now.
  if (props.clipId) loadPerVertex(props.clipId)
  applyLayout(props.layout)
  animate()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animId)
  window.removeEventListener('resize', onResize)
  renderer?.domElement.removeEventListener('click', onCanvasClick)
  renderer?.dispose()
})

</script>

<style scoped>
.scene-container {
  width: 100%;
  height: 100%;
  position: relative;
  background: #000000;
}
.scene-container::after {
  /* Warm bottom glow — matches the lit-from-below feel of the TRIBE V2 hero */
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse at 50% 100%,
    rgba(255, 160, 90, 0.12) 0%,
    transparent 55%
  );
}

.hud {
  position: absolute; top: 16px; left: 16px;
  display: flex; gap: 12px; align-items: center; z-index: 10;
  pointer-events: none;
}
.top-region {
  font-size: 12px; color: #ffcc66;
  text-transform: uppercase; letter-spacing: 1.5px;
  text-shadow: 0 0 6px rgba(255, 204, 102, 0.4);
}
.frame-counter {
  font-size: 11px;
  color: #556688;
  font-family: 'JetBrains Mono', monospace;
}
</style>
