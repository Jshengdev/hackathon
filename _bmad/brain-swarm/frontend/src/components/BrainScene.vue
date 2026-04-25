<template>
  <div ref="container" class="scene-container">
    <!-- HUD top-left -->
    <div class="hud">
      <button @click="toggleSim" :class="{ active: running }">
        {{ running ? '⏹ Stop' : '▶ Start' }}
      </button>
      <span class="status-dot" :class="wsConnected ? 'green' : 'red'" />
      <span class="top-region" v-if="topRegion">{{ topRegion }}</span>
      <span class="frame-counter" v-if="running">t={{ frameT }}s</span>
    </div>

    <!-- Speech panel bottom-right -->
    <div class="speech-panel">
      <transition-group name="speech">
        <div
          v-for="msg in recentSpeech"
          :key="msg.uid"
          class="speech-msg"
          :class="msg.type"
          :style="{ borderColor: networkColor(msg.network) }"
        >
          <span class="speech-net" :style="{ color: networkColor(msg.network) }">
            {{ msg.network.replace(/_/g, ' ') }}
          </span>
          {{ msg.text }}
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js'
import { fetchMesh, startSim, stopSim } from '../api/index.js'

// ── Reactive state ─────────────────────────────────────────────────────────
const container = ref(null)
const running = ref(false)
const wsConnected = ref(false)
const topRegion = ref('')
const frameT = ref(0)
const recentSpeech = reactive([])

const NETWORK_COLORS = {
  visual:             '#ff6b6b',
  somatomotor:        '#4ecdc4',
  dorsal_attention:   '#45b7d1',
  ventral_attention:  '#f7dc6f',
  limbic:             '#bb8fce',
  frontoparietal:     '#82e0aa',
  default_mode:       '#f0b27a',
  moderator:          '#ffffff',
}
function networkColor(n) { return NETWORK_COLORS[n] ?? '#aaaaaa' }
function networkHex(n) {
  const c = NETWORK_COLORS[n]
  return c ? parseInt(c.replace('#', ''), 16) : 0xaaaaaa
}

// ── Three.js handles ───────────────────────────────────────────────────────
let renderer, labelRenderer, scene, camera, controls
let brainMesh, wandererMesh
const regionMeshes = {}   // network → { mesh, glowMat, labelDiv }
let ws = null, animId = null

// Frame interpolation — smooth 60fps between 1Hz WS ticks
let prevAct = null, nextAct = null
let prevAgents = null, nextAgents = null
let lerpT = 1.0

const _dummy = new THREE.Object3D()
const _col = new THREE.Color()

// ── Controls ───────────────────────────────────────────────────────────────
async function toggleSim() {
  if (running.value) { await stopSim(); running.value = false }
  else { await startSim(); running.value = true }
}

// ── Three.js init ──────────────────────────────────────────────────────────
function initThree() {
  const W = container.value.clientWidth
  const H = container.value.clientHeight

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(W, H)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x050510, 1)
  container.value.appendChild(renderer.domElement)

  // CSS2D overlay for floating region labels
  labelRenderer = new CSS2DRenderer()
  labelRenderer.setSize(W, H)
  Object.assign(labelRenderer.domElement.style, {
    position: 'absolute', top: '0', pointerEvents: 'none',
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
      new THREE.MeshPhongMaterial({ color: hex, emissive: hex, emissiveIntensity: 0.25 })
    )
    mesh.position.set(...data.centroid)
    scene.add(mesh)

    // Additive glow — invisible until region activates
    const glowMat = new THREE.MeshBasicMaterial({
      color: hex, transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
    mesh.add(new THREE.Mesh(new THREE.SphereGeometry(7, 16, 12), glowMat))

    // Floating CSS2D label
    const div = document.createElement('div')
    Object.assign(div.style, {
      color: data.color, fontSize: '11px', fontWeight: '600',
      background: 'rgba(5,5,20,0.75)', padding: '3px 7px',
      borderRadius: '4px', border: `1px solid ${data.color}`,
      whiteSpace: 'nowrap', letterSpacing: '0.5px',
    })
    div.textContent = name.replace(/_/g, ' ')
    const labelObj = new CSS2DObject(div)
    labelObj.position.set(0, 9, 0)
    mesh.add(labelObj)

    regionMeshes[name] = { mesh, glowMat, labelDiv: div }
  }
}

// ── Wanderer swarm (93 instanced spheres) ──────────────────────────────────
function buildWanderers(n = 93) {
  wandererMesh = new THREE.InstancedMesh(
    new THREE.SphereGeometry(1.5, 6, 6),
    new THREE.MeshBasicMaterial({ color: 0xffffff }),
    n,
  )
  wandererMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  scene.add(wandererMesh)
}

// ── Per-frame update functions ─────────────────────────────────────────────

// Fire colormap: dark navy → purple → red → orange → yellow
function activationToRGB(t, out) {
  if (t < 0.35) {
    const s = t / 0.35
    out[0] = 0.05 + s * 0.50;  out[1] = 0.05 - s * 0.04;  out[2] = 0.13 + s * 0.52
  } else if (t < 0.70) {
    const s = (t - 0.35) / 0.35
    out[0] = 0.55 + s * 0.45;  out[1] = 0.01 + s * 0.20;  out[2] = 0.65 - s * 0.65
  } else {
    const s = (t - 0.70) / 0.30
    out[0] = 1.0;               out[1] = 0.21 + s * 0.79;  out[2] = 0.0 + s * 0.08
  }
}

function applyActivations(activations) {
  if (!brainMesh || !activations) return
  const colors = brainMesh.geometry.attributes.color.array
  const tmp = [0, 0, 0]
  for (let i = 0; i < activations.length; i++) {
    activationToRGB(activations[i], tmp)
    colors[i * 3] = tmp[0]; colors[i * 3 + 1] = tmp[1]; colors[i * 3 + 2] = tmp[2]
  }
  brainMesh.geometry.attributes.color.needsUpdate = true
}

function applyAgents(agents) {
  if (!agents) return
  let wIdx = 0
  for (const a of agents) {
    if (a.type === 'region') {
      const rm = regionMeshes[a.network]
      if (!rm) continue
      rm.mesh.position.set(...a.pos)
      rm.mesh.material.emissiveIntensity = a.active ? 0.85 : 0.18
      rm.glowMat.opacity = a.active ? 0.28 : 0.0
    } else {
      _dummy.position.set(...a.pos)
      _dummy.updateMatrix()
      wandererMesh.setMatrixAt(wIdx, _dummy.matrix)
      // Grey when inactive, bright white when near active region
      _col.setRGB(
        a.active ? 0.90 : 0.10,
        a.active ? 0.95 : 0.10,
        a.active ? 1.00 : 0.17,
      )
      wandererMesh.setColorAt(wIdx, _col)
      wIdx++
    }
  }
  wandererMesh.instanceMatrix.needsUpdate = true
  if (wandererMesh.instanceColor) wandererMesh.instanceColor.needsUpdate = true
}

// ── Linear interpolation helpers ──────────────────────────────────────────
function lerpFloat32(a, b, t) {
  if (!a) return b
  const out = new Float32Array(a.length)
  for (let i = 0; i < a.length; i++) out[i] = a[i] + (b[i] - a[i]) * t
  return out
}

function lerpAgentList(a, b, t) {
  if (!a || a.length !== b.length) return b
  return b.map((agent, i) => ({
    ...agent,
    pos: [
      a[i].pos[0] + (agent.pos[0] - a[i].pos[0]) * t,
      a[i].pos[1] + (agent.pos[1] - a[i].pos[1]) * t,
      a[i].pos[2] + (agent.pos[2] - a[i].pos[2]) * t,
    ],
  }))
}

// ── Animation loop ─────────────────────────────────────────────────────────
function animate() {
  animId = requestAnimationFrame(animate)
  controls.update()

  // Advance lerp by ~1 frame / 1000ms (16ms per RAF at 60fps)
  lerpT = Math.min(1.0, lerpT + 0.016)

  if (nextAct) {
    applyActivations(prevAct ? lerpFloat32(prevAct, nextAct, lerpT) : nextAct)
  }
  if (nextAgents) {
    applyAgents(prevAgents ? lerpAgentList(prevAgents, nextAgents, lerpT) : nextAgents)
  }

  renderer.render(scene, camera)
  labelRenderer.render(scene, camera)
}

// ── WebSocket ──────────────────────────────────────────────────────────────
function connectWS() {
  ws = new WebSocket(`ws://${location.host}/ws`)

  ws.onopen  = () => { wsConnected.value = true }
  ws.onclose = () => {
    wsConnected.value = false
    setTimeout(connectWS, 2000)
  }

  ws.onmessage = (e) => {
    const frame = JSON.parse(e.data)

    prevAct    = nextAct    ? Float32Array.from(nextAct) : null
    prevAgents = nextAgents ? [...nextAgents]             : null
    nextAct    = new Float32Array(frame.activations)
    nextAgents = frame.agents
    lerpT      = 0.0

    frameT.value = frame.t
    if (frame.top_region) topRegion.value = frame.top_region.replace(/_/g, ' ')

    if (frame.speech?.length) {
      for (const msg of frame.speech) {
        recentSpeech.unshift({ ...msg, uid: `${msg.network}-${frame.t}-${Math.random()}` })
      }
      while (recentSpeech.length > 5) recentSpeech.pop()
    }
  }
}

// ── Lifecycle ──────────────────────────────────────────────────────────────
function onResize() {
  const W = container.value.clientWidth
  const H = container.value.clientHeight
  camera.aspect = W / H
  camera.updateProjectionMatrix()
  renderer.setSize(W, H)
  labelRenderer.setSize(W, H)
}

onMounted(async () => {
  initThree()
  try {
    const meshData = await fetchMesh()
    buildBrainMesh(meshData)
    buildRegionAgents(meshData.networks)
    buildWanderers()
  } catch (err) {
    console.error('Mesh load failed:', err)
  }
  connectWS()
  animate()
})

onUnmounted(() => {
  cancelAnimationFrame(animId)
  ws?.close()
  window.removeEventListener('resize', onResize)
  renderer?.dispose()
})
</script>

<style scoped>
.scene-container { width: 100%; height: 100%; position: relative; }

.hud {
  position: absolute; top: 16px; left: 16px;
  display: flex; gap: 10px; align-items: center; z-index: 10;
}
button {
  background: #111128; color: #99bbff;
  border: 1px solid #2a3a6a; padding: 6px 14px;
  border-radius: 4px; cursor: pointer; font-size: 12px;
  transition: background 0.15s;
}
button:hover { background: #1e2050; }
button.active { border-color: #ff6644; color: #ff8866; }

.status-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.status-dot.green { background: #44ff88; box-shadow: 0 0 6px #44ff88; }
.status-dot.red   { background: #ff4444; }

.top-region {
  font-size: 12px; color: #ffcc66;
  text-transform: uppercase; letter-spacing: 1.5px;
}
.frame-counter { font-size: 11px; color: #556688; }

/* Speech panel */
.speech-panel {
  position: absolute; bottom: 20px; right: 20px;
  width: 360px; display: flex; flex-direction: column;
  gap: 8px; z-index: 10;
}
.speech-msg {
  background: rgba(4, 4, 18, 0.88);
  border-left: 3px solid #444;
  padding: 8px 12px; border-radius: 4px;
  font-size: 12px; line-height: 1.55;
}
.speech-msg.moderator {
  border-left-width: 4px;
  font-size: 13px; font-style: italic;
}
.speech-net {
  display: block; font-size: 10px;
  text-transform: uppercase; letter-spacing: 1px;
  margin-bottom: 3px; opacity: 0.75;
}

/* Vue transition */
.speech-enter-active { transition: all 0.25s ease; }
.speech-leave-active { transition: all 0.4s ease; }
.speech-enter-from   { opacity: 0; transform: translateX(12px); }
.speech-leave-to     { opacity: 0; }
</style>
