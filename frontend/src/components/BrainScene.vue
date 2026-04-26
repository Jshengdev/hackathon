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
const regionMeshes = {}      // network → { mesh, glowMat, labelDiv }
let raycaster = null
const _ndc = new THREE.Vector2()
let animId = null

// Wanderer agent state — frontend-driven boids-ish update
const N_WANDERERS = 64
const wanderers = []         // [{ pos: Vector3, vel: Vector3, target: string }]

const _dummy = new THREE.Object3D()
const _col = new THREE.Color()

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

  const colors = new Float32Array(N * 3)
  for (let i = 0; i < N; i++) {
    colors[i * 3] = 0.05; colors[i * 3 + 1] = 0.05; colors[i * 3 + 2] = 0.13
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
  geo.setAttribute('color',    new THREE.BufferAttribute(colors,   3))
  geo.setIndex(new THREE.BufferAttribute(indices, 1))
  geo.computeVertexNormals()

  const mat = new THREE.MeshPhongMaterial({
    vertexColors: true,
    side: THREE.DoubleSide,
    shininess: 18,
    transparent: true,
    opacity: 0.86,
  })

  brainMesh = new THREE.Mesh(geo, mat)
  scene.add(brainMesh)
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

  if (cameraTween) cameraTween(now)
  controls.update()

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
      topRegion.value = frame.top_region || ''
    }
  }

  renderer.render(scene, camera)
  labelRenderer.render(scene, camera)
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
