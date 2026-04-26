<template>
  <div ref="container" class="scene-container" :class="`layout-${layout}`">
    <!-- Warm bottom glow — radial gradient evokes the lit-from-below look in
         the TRIBE V2 hero (matches /tmp/tribev2-ref/landing.png). -->
    <div class="bottom-glow" aria-hidden="true"></div>
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
import { networkHex, tribeHeatRGB } from '../utils/colors.js'

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
let agentEdgeLines, regionEdgeLines
const regionMeshes = {}      // network → { mesh, glowMat, labelDiv }
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
  // TRIBE V2 reskin: pure black canvas — brain sits on the void.
  renderer.setClearColor(0x000000, 1)
  container.value.appendChild(renderer.domElement)

  labelRenderer = new CSS2DRenderer()
  labelRenderer.setSize(W, H)
  Object.assign(labelRenderer.domElement.style, {
    position: 'absolute', top: '0', left: '0', pointerEvents: 'none',
  })
  container.value.appendChild(labelRenderer.domElement)

  scene = new THREE.Scene()
  // Black fog so the brain edges fade into the void instead of clipping hard.
  scene.fog = new THREE.FogExp2(0x000000, 0.0025)

  camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 1000)
  camera.position.set(0, 40, 230)
  camera.lookAt(0, 10, 0)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.07
  controls.minDistance = 60
  controls.maxDistance = 500

  // TRIBE V2 lighting — soft warm rim. Low ambient keeps the cortex from
  // looking flat-lit; warm key from upper-front gives the cream-tissue
  // surface its honey'd highlights; cool back rim outlines the silhouette.
  scene.add(new THREE.AmbientLight(0xfff5e6, 0.25))
  const keyLight = new THREE.DirectionalLight(0xfff5e6, 0.6)
  keyLight.position.set(60, 140, 200)
  scene.add(keyLight)
  const rimLight = new THREE.DirectionalLight(0x8aa0c0, 0.35)
  rimLight.position.set(-100, 60, -120)
  scene.add(rimLight)
  // Subtle warm fill from below — pairs with the CSS bottom glow.
  const fillLight = new THREE.DirectionalLight(0xffb44a, 0.18)
  fillLight.position.set(0, -100, 80)
  scene.add(fillLight)

  raycaster = new THREE.Raycaster()
  renderer.domElement.addEventListener('click', onCanvasClick)

  window.addEventListener('resize', onResize)
}

// ── Brain surface ──────────────────────────────────────────────────────────
function buildBrainMesh(data) {
  const N = data.n_vertices
  const vertices = new Float32Array(data.vertices)
  const indices = new Uint32Array(data.faces)

  // TRIBE V2 cortical-tissue base: cream-white (#e8e2d9) with the central
  // fissure pulled toward shadow so the longitudinal valley still reads.
  // Vertex colors get multiplied by material.color (white) so the buffer
  // alone drives surface albedo. Activations later lerp these toward the
  // heat colormap.
  const colors = new Float32Array(N * 3)
  const TISSUE_R = 0xe8 / 255  // 0.910
  const TISSUE_G = 0xe2 / 255  // 0.886
  const TISSUE_B = 0xd9 / 255  // 0.851
  for (let i = 0; i < N; i++) {
    const x = vertices[i * 3]
    const fissure = Math.max(0, 1 - Math.abs(x) / 2.5)  // 1 at midline → 0 outside
    const k = 1 - fissure * 0.55                        // pull toward dark at midline
    colors[i * 3]     = TISSUE_R * k
    colors[i * 3 + 1] = TISSUE_G * k
    colors[i * 3 + 2] = TISSUE_B * k
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
  geo.setAttribute('color',    new THREE.BufferAttribute(colors,   3))
  geo.setIndex(new THREE.BufferAttribute(indices, 1))
  geo.computeVertexNormals()

  // TRIBE V2 cortical tissue: high-roughness, no metalness, no emissive.
  // material.color stays white so the vertex-color buffer fully drives the
  // surface — that buffer carries cream tissue at rest and lerps toward the
  // heat colormap where activations fire.
  const mat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    vertexColors: true,
    side: THREE.DoubleSide,
    roughness: 0.85,
    metalness: 0.0,
    transparent: false,
    opacity: 1.0,
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
    // TRIBE V2 reskin: warm tungsten halo instead of cool-blue rim.
    color: 0xfff5e6,
    transparent: true,
    opacity: 0.04,
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
      // TRIBE V2 reskin: warm beige orbits instead of cool-blue rings.
      color: 0xe8e2d9, transparent: true, opacity: cfg.opacity * 0.7,
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
    // TRIBE V2 reskin: subdued swarm web — the activation IS the visual,
    // edges should whisper, not shout.
    opacity: 0.22,
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
    // TRIBE V2 reskin: thin cross-talk arcs only — the surface heatmap
    // does the heavy lifting, arcs hint at "swarm cross-talk" subtly.
    opacity: 0.45,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  regionEdgeLines = new THREE.LineSegments(regionGeo, regionMat)
  scene.add(regionEdgeLines)
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

    // TRIBE V2 register: lowercase mono label on near-black chip with a
    // hairline border. Network color tints the dot, not the whole pill.
    const div = document.createElement('div')
    Object.assign(div.style, {
      color: '#e8e2d9',
      fontSize: '10px',
      fontWeight: '500',
      fontFamily: "'JetBrains Mono', monospace",
      background: 'rgba(0,0,0,0.78)',
      padding: '3px 8px',
      borderRadius: '2px',
      border: '1px solid rgba(255,255,255,0.12)',
      whiteSpace: 'nowrap',
      letterSpacing: '1.1px',
      textTransform: 'lowercase',
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
// TRIBE V2 heat colormap (delegated to utils/colors.js) — cream tissue at
// rest lerps toward deep red → orange → yellow → white as activation rises.

// Cached cortical-tissue base (vertex colors at zero activation). Captured
// once on first call so per-frame updates don't have to recompute the
// fissure-tinted base for every vertex — we just lerp from this snapshot.
let _baseTissueColors = null
function rememberBaseTissue() {
  if (!brainMesh) return
  if (_baseTissueColors) return
  const arr = brainMesh.geometry.attributes.color.array
  _baseTissueColors = new Float32Array(arr.length)
  _baseTissueColors.set(arr)
}

// Apply a per-network level dictionary to the mesh's vertex-color buffer.
// Vertices outside any active network reset to their cream-tissue base; verts
// inside a firing network lerp toward tribeHeat(level) by `level` strength,
// so low activation reads as warm red on tissue and peak blows out to white.
function applyRegionLevelsToMesh(levels) {
  if (!brainMesh || !meshNetworks.value) return
  rememberBaseTissue()
  const colors = brainMesh.geometry.attributes.color.array
  const base   = _baseTissueColors
  // Restore tissue base for every vertex
  colors.set(base)
  const heat = [0, 0, 0]
  for (const [name, meta] of Object.entries(meshNetworks.value)) {
    const lvl = levels[name] ?? 0
    if (lvl <= 0.001) continue
    tribeHeatRGB(lvl, heat)
    const idxs = meta.vertex_indices
    if (!idxs) continue
    const w = Math.max(0, Math.min(1, lvl))
    for (let k = 0; k < idxs.length; k++) {
      const v = idxs[k]
      const i = v * 3
      colors[i]     = base[i]     + (heat[0] - base[i])     * w
      colors[i + 1] = base[i + 1] + (heat[1] - base[i + 1]) * w
      colors[i + 2] = base[i + 2] + (heat[2] - base[i + 2]) * w
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
  } else if (layout === 'hero-left') {
    // TRIBE V2 hero — lateral view of the LEFT hemisphere from outside.
    // Left hemi sits at -X in MNI space, so camera goes to negative X with
    // a tiny upward tilt to avoid a flat profile silhouette.
    tweenCameraTo(
      new THREE.Vector3(-220, 18, 30),
      new THREE.Vector3(0, 6, 0),
    )
  } else if (layout === 'hero-right') {
    // Lateral view of the RIGHT hemisphere from outside (camera at +X).
    tweenCameraTo(
      new THREE.Vector3(220, 18, 30),
      new THREE.Vector3(0, 6, 0),
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
      topRegion.value = frame.top_region || ''
    }
  } else {
    // No activity yet — still tick the swarm so it's always alive on stage.
    updateAgentEdges()
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
  /* TRIBE V2: pure-black surface so the brain reads against the void. */
  background: var(--tribe-bg, #000);
}

/* Warm radial glow at the bottom — pairs with the warm fill light in the
   Three.js scene to evoke TRIBE V2's lit-from-below register. */
.bottom-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  background: radial-gradient(
    ellipse at 50% 100%,
    rgba(255, 180, 80, 0.15) 0%,
    transparent 60%
  );
  mix-blend-mode: screen;
}

.hud {
  position: absolute; top: 16px; left: 16px;
  display: flex; gap: 12px; align-items: center; z-index: 10;
  pointer-events: none;
}
.top-region {
  font-size: 11px;
  color: var(--tribe-ink, #e8e2d9);
  font-family: 'JetBrains Mono', monospace;
  text-transform: lowercase;
  letter-spacing: 1.4px;
  font-weight: 500;
}
.frame-counter {
  font-size: 10px;
  color: var(--tribe-smoke, #465a69);
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.6px;
}
</style>
