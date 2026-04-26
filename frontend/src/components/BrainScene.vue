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
  activityData: { type: Object, default: null },     // activity.json contents
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
let raycaster = null
const _ndc = new THREE.Vector2()
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
  renderer.setClearColor(0x050510, 1)
  container.value.appendChild(renderer.domElement)

  labelRenderer = new CSS2DRenderer()
  labelRenderer.setSize(W, H)
  Object.assign(labelRenderer.domElement.style, {
    position: 'absolute', top: '0', left: '0', pointerEvents: 'none',
  })
  container.value.appendChild(labelRenderer.domElement)

  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x050510, 0.0025)

  camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 1000)
  camera.position.set(0, 40, 230)
  camera.lookAt(0, 10, 0)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.07
  controls.minDistance = 60
  controls.maxDistance = 500

  scene.add(new THREE.AmbientLight(0x223355, 2.5))
  const sun = new THREE.DirectionalLight(0xffffff, 1.8)
  sun.position.set(120, 180, 100)
  scene.add(sun)

  raycaster = new THREE.Raycaster()
  renderer.domElement.addEventListener('click', onCanvasClick)

  window.addEventListener('resize', onResize)
}

// ── Brain surface ──────────────────────────────────────────────────────────
function buildBrainMesh(data) {
  const N = data.n_vertices
  const vertices = new Float32Array(data.vertices)
  const indices = new Uint32Array(data.faces)

  // Bilateral central-fissure cue: vertices very near the x=0 plane get a
  // darker base color, suggesting the longitudinal fissure between hemispheres.
  // fsaverage5 is in MNI mm; the midline shows up well within ±2.5 mm.
  const colors = new Float32Array(N * 3)
  for (let i = 0; i < N; i++) {
    const x = vertices[i * 3]
    const fissure = Math.max(0, 1 - Math.abs(x) / 2.5)  // 1 at midline → 0 outside
    const base = 0.05 - fissure * 0.035                 // darken at midline
    colors[i * 3]     = Math.max(0.02, base)
    colors[i * 3 + 1] = Math.max(0.02, base)
    colors[i * 3 + 2] = Math.max(0.06, 0.13 - fissure * 0.06)
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
  geo.setAttribute('color',    new THREE.BufferAttribute(colors,   3))
  geo.setIndex(new THREE.BufferAttribute(indices, 1))
  geo.computeVertexNormals()

  // MeshStandardMaterial with high roughness reads as organic tissue, not a
  // glossy sphere. Slight emissive on top of vertexColors keeps active regions
  // visible against the dark backdrop.
  const mat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    side: THREE.DoubleSide,
    roughness: 0.85,
    metalness: 0.05,
    emissive: 0x1a1a32,
    emissiveIntensity: 0.18,
    transparent: true,
    opacity: 0.92,
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
  const geo = new THREE.SphereGeometry(brainR * 1.18, 48, 36)
  atmosphereMat = new THREE.MeshBasicMaterial({
    color: 0x6da9ff,
    transparent: true,
    opacity: 0.05,
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
function buildRegionAgents(networks) {
  for (const [name, data] of Object.entries(networks)) {
    const hex = networkHex(name)

    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(4, 16, 12),
      new THREE.MeshPhongMaterial({ color: hex, emissive: hex, emissiveIntensity: 0.25 }),
    )
    mesh.position.set(...data.centroid)
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
// Fire colormap: dark navy → purple → red → orange → yellow
function activationToRGB(t, out) {
  const tt = Math.max(0, Math.min(1, t))
  if (tt < 0.35) {
    const s = tt / 0.35
    out[0] = 0.05 + s * 0.50;  out[1] = 0.05 - s * 0.04;  out[2] = 0.13 + s * 0.52
  } else if (tt < 0.70) {
    const s = (tt - 0.35) / 0.35
    out[0] = 0.55 + s * 0.45;  out[1] = 0.01 + s * 0.20;  out[2] = 0.65 - s * 0.65
  } else {
    const s = (tt - 0.70) / 0.30
    out[0] = 1.0;               out[1] = 0.21 + s * 0.79;  out[2] = 0.0 + s * 0.08
  }
}

// Apply a per-network level dictionary to the mesh's vertex-color buffer.
function applyRegionLevelsToMesh(levels) {
  if (!brainMesh || !meshNetworks.value) return
  const colors = brainMesh.geometry.attributes.color.array
  const tmp = [0, 0, 0]
  // First, fill base color for all verts
  for (let i = 0; i < colors.length; i += 3) {
    colors[i] = 0.05; colors[i + 1] = 0.05; colors[i + 2] = 0.13
  }
  for (const [name, meta] of Object.entries(meshNetworks.value)) {
    const lvl = levels[name] ?? 0
    activationToRGB(lvl, tmp)
    const idxs = meta.vertex_indices
    if (!idxs) continue
    for (let k = 0; k < idxs.length; k++) {
      const v = idxs[k]
      colors[v * 3]     = tmp[0]
      colors[v * 3 + 1] = tmp[1]
      colors[v * 3 + 2] = tmp[2]
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
    // Pull camera back & slightly to the right so the brain feels centered
    // within the left half of the screen
    tweenCameraTo(
      new THREE.Vector3(40, 35, 220),
      new THREE.Vector3(0, 10, 0),
    )
  } else {
    tweenCameraTo(
      new THREE.Vector3(0, 40, 230),
      new THREE.Vector3(0, 10, 0),
    )
  }
}

// ── Click → raycast region spheres ─────────────────────────────────────────
function onCanvasClick(ev) {
  if (!props.interactive || !raycaster) return
  const rect = renderer.domElement.getBoundingClientRect()
  _ndc.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1
  _ndc.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1
  raycaster.setFromCamera(_ndc, camera)
  const targets = Object.values(regionMeshes).map(rm => rm.mesh)
  const hits = raycaster.intersectObjects(targets, true)
  if (hits.length) {
    // Walk up to find the userData.network
    let obj = hits[0].object
    while (obj && !obj.userData.network) obj = obj.parent
    if (obj?.userData.network) {
      emit('region-clicked', obj.userData.network)
    }
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
    atmosphereMat.opacity = 0.04 + breath * 0.05
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
      const idx = Math.floor((props.currentTime || 0) * fps)
      const safeIdx = ((idx % nFrames) + nFrames) % nFrames
      const frame = data.frames[safeIdx]
      const levels = frame.regions || {}
      applyRegionLevelsToMesh(levels)
      applyRegionGlows(levels)
      updateWanderers(levels, dt / 16.67)  // normalize to ~60fps step units
      // Update atmosphere intensity from peak activation — brain "breathes harder"
      // when a network is firing strongly.
      if (atmosphereMat) {
        let peak = 0
        for (const v of Object.values(levels)) if (v > peak) peak = v
        atmosphereMat.opacity = Math.min(0.25, atmosphereMat.opacity + peak * 0.06)
        // Tint atmosphere toward the top region's color
        const top = frame.top_region
        const topMesh = top && regionMeshes[top]
        if (topMesh) atmosphereMat.color.set(topMesh.mesh.material.color)
      }
      updateAgentEdges()
      updateRegionEdges(levels)
      updateSwarmNetwork(now, dt)
      topRegion.value = frame.top_region || ''
    }
  } else {
    // No activity yet — still tick the swarm so it's always alive on stage.
    updateAgentEdges()
    updateSwarmNetwork(now, dt)
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

function updateSwarmNetwork(now, dt) {
  if (!swarmNetEdgeLines) return
  if (swarmNetPairs.length === 0) initSwarmNetPairs()
  if (swarmNetPairs.length === 0) return

  const positions = swarmNetEdgeLines.geometry.attributes.position.array
  const colors    = swarmNetEdgeLines.geometry.attributes.color.array
  const decay = Math.exp(-SWARM_NET_DECAY_PER_MS * dt)

  let segOffset = 0
  for (const pair of swarmNetPairs) {
    if (now >= pair.fireAt && pair.intensity < 0.05) {
      pair.intensity = 1.0
      pair.fireAt = now + SWARM_NET_FIRE_MIN_MS
        + Math.random() * (SWARM_NET_FIRE_MAX_MS - SWARM_NET_FIRE_MIN_MS)
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
      const p0 = arcPoint(a, b, t0)
      const p1 = arcPoint(a, b, t1)
      const k = (segOffset + s) * 6
      positions[k]     = p0.x; positions[k + 1] = p0.y; positions[k + 2] = p0.z
      positions[k + 3] = p1.x; positions[k + 4] = p1.y; positions[k + 5] = p1.z

      // Bright leading head, dim tail — head sits at t=0 on fire and slides
      // out as intensity decays, so a fresh pulse reads as "signal racing
      // from one node to the other".
      const headPos = 1 - I
      const distFromHead = Math.abs(t0 - headPos)
      const headGlow = Math.pow(Math.max(0, 1 - distFromHead * 6), 2)
      const baseT = (0.15 + headGlow * 0.85) * I
      const blend = t0
      const r = (aCol.r * (1 - blend) + bCol.r * blend) * baseT
      const g = (aCol.g * (1 - blend) + bCol.g * blend) * baseT
      const bl = (aCol.b * (1 - blend) + bCol.b * blend) * baseT
      colors[k]     = r;  colors[k + 1] = g;  colors[k + 2] = bl
      colors[k + 3] = r;  colors[k + 4] = g;  colors[k + 5] = bl
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
function arcPoint(a, b, t) {
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
  const lift = Math.pow(Math.sin(t * Math.PI), 0.94) * dist * 0.45
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

// ── Lifecycle ──────────────────────────────────────────────────────────────
onMounted(async () => {
  initThree()
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
  background: #050510;
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
