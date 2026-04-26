<template>
  <div class="landing">
    <div class="bg-grid" />
    <div class="bg-glow" />

    <!-- Orbital backdrop: two faint, slow-rotating ellipses -->
    <svg class="landing-orbital-svg" viewBox="0 0 800 800" aria-hidden="true">
      <g class="landing-orbital-group">
        <ellipse
          class="landing-orbital landing-orbital--outer"
          cx="400" cy="400"
          rx="320" ry="190"
          transform="rotate(-18 400 400)"
        />
        <ellipse
          class="landing-orbital landing-orbital--inner"
          cx="400" cy="400"
          rx="220" ry="130"
          transform="rotate(24 400 400)"
        />
      </g>
    </svg>

    <!-- Vignette: accent glow at center, fades to transparent -->
    <div class="landing-vignette" />

    <div class="hero">
      <div class="brand-line">
        <span class="brand-dot" />
        TRIBE&nbsp;V2 ·  brain-swarm demo
      </div>
      <h1>See what the brain is doing<br/>while it watches.</h1>
      <p class="sub">
        Drop in a video clip — we'll match it against our prerendered TRIBE V2
        neural predictions and walk you through what each cortical network is
        seeing, second by second.
      </p>

      <div
        class="dropzone"
        :class="{ 'is-dragging': isDragging, 'is-loading': loading, 'has-error': !!error }"
        @click="onClickPick"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="onDrop"
      >
        <input
          ref="fileInput"
          type="file"
          accept="video/mp4,video/*"
          @change="onFileChange"
          hidden
        />

        <div v-if="!loading && !error" class="dz-content">
          <div class="dz-icon">↑</div>
          <div class="dz-title">Drop an MP4 here</div>
          <div class="dz-sub">or click to browse</div>
        </div>

        <div v-else-if="loading" class="dz-content">
          <div class="spinner" />
          <div class="dz-title">Matching clip…</div>
          <div class="dz-sub">{{ filename }}</div>
        </div>

        <div v-else class="dz-content">
          <div class="dz-icon error">!</div>
          <div class="dz-title">{{ error }}</div>
          <div class="dz-sub">Try again with a supported clip.</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { postDemoMatch } from '../api/index.js'

const emit = defineEmits(['matched'])

const fileInput = ref(null)
const isDragging = ref(false)
const loading = ref(false)
const error = ref('')
const filename = ref('')

function onClickPick() {
  if (loading.value) return
  fileInput.value?.click()
}

async function handleFile(file) {
  if (!file) return
  filename.value = file.name
  error.value = ''
  loading.value = true
  try {
    const result = await postDemoMatch(file.name)
    // Brief pause so UI doesn't flash
    await new Promise(r => setTimeout(r, 400))
    emit('matched', result)
  } catch (e) {
    error.value = `Couldn't match "${file.name}".`
    console.error(e)
  } finally {
    loading.value = false
  }
}

function onDrop(ev) {
  isDragging.value = false
  const file = ev.dataTransfer?.files?.[0]
  handleFile(file)
}

function onFileChange(ev) {
  const file = ev.target.files?.[0]
  handleFile(file)
}
</script>

<style scoped>
.landing {
  position: relative;
  width: 100vw; height: 100vh;
  background: #050510;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
  font-family: 'Inter', system-ui, sans-serif;
  color: #d0d8ee;
}

.bg-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(120, 160, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(120, 160, 255, 0.04) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
  mask-image: radial-gradient(circle at center, #000 30%, transparent 75%);
}
.bg-glow {
  position: absolute; inset: 0;
  background: radial-gradient(circle at 30% 40%, rgba(78, 205, 196, 0.10), transparent 50%),
              radial-gradient(circle at 70% 60%, rgba(187, 143, 206, 0.10), transparent 50%);
  pointer-events: none;
}

/* Orbital backdrop — slow-rotating SVG ellipses, CSS-only animation */
.landing-orbital-svg {
  position: absolute;
  top: 50%; left: 50%;
  width: min(120vmin, 1100px);
  height: min(120vmin, 1100px);
  transform: translate(-50%, -50%);
  pointer-events: none;
  overflow: visible;
  opacity: 0.9;
}
.landing-orbital {
  fill: none;
  stroke-width: 1;
  transform-origin: 400px 400px;
  transform-box: fill-box;
}
.landing-orbital--outer {
  stroke: rgba(180, 200, 255, 0.10);
  animation: orbit-spin 60s linear infinite;
}
.landing-orbital--inner {
  stroke: rgba(180, 200, 255, 0.06);
  animation: orbit-spin 35s linear infinite reverse;
}
@keyframes orbit-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* Vignette — accent glow at center, fades to transparent */
.landing-vignette {
  position: absolute; inset: 0;
  background: radial-gradient(circle at 50% 50%,
    rgba(130, 224, 170, 0.08) 0%,
    rgba(130, 224, 170, 0) 55%);
  pointer-events: none;
}

.hero {
  position: relative; z-index: 1;
  max-width: 640px;
  text-align: center;
  padding: 0 24px;
}

.brand-line {
  font-size: 11px; letter-spacing: 2.5px;
  text-transform: uppercase;
  color: #6677aa;
  display: inline-flex; align-items: center; gap: 8px;
  margin-bottom: 24px;
  font-weight: 500;
}
.brand-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #4ecdc4;
  box-shadow: 0 0 8px #4ecdc4;
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

h1 {
  font-size: 44px;
  font-weight: 600;
  line-height: 1.1;
  color: #f0f4ff;
  letter-spacing: -1px;
  margin-bottom: 18px;
}

.sub {
  font-size: 15px;
  line-height: 1.55;
  color: #aab4cc;
  margin-bottom: 36px;
}

.dropzone {
  border: 1.5px dashed #2a3a6a;
  border-radius: 10px;
  padding: 38px 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(10, 10, 28, 0.5);
}
.dropzone:hover, .dropzone.is-dragging {
  border-color: #4ecdc4;
  background: rgba(20, 28, 48, 0.7);
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(78, 205, 196, 0.12);
}
.dropzone.is-loading { cursor: wait; border-color: #f7dc6f; }
.dropzone.has-error  { border-color: #ff6b6b; }

.dz-content {
  display: flex; flex-direction: column;
  align-items: center; gap: 8px;
}
.dz-icon {
  width: 44px; height: 44px;
  border: 1.5px solid #4ecdc4;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; color: #4ecdc4;
  margin-bottom: 8px;
}
.dz-icon.error { border-color: #ff6b6b; color: #ff6b6b; }

.dz-title {
  font-size: 15px; font-weight: 500;
  color: #f0f4ff;
}
.dz-sub {
  font-size: 12px; color: #6677aa;
}
.dz-sub code {
  font-family: 'JetBrains Mono', monospace;
  background: rgba(78, 205, 196, 0.08);
  padding: 1px 6px; border-radius: 3px;
  color: #4ecdc4;
}

.spinner {
  width: 32px; height: 32px;
  border: 2.5px solid rgba(247, 220, 111, 0.15);
  border-top-color: #f7dc6f;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 4px;
}
@keyframes spin { to { transform: rotate(360deg); } }

.hint {
  margin-top: 20px;
  font-size: 11px; color: #556688;
  display: flex; align-items: center; gap: 8px; justify-content: center;
}
.hint .key {
  background: #1a1a2a; padding: 2px 7px;
  border-radius: 3px; border: 1px solid #2a3a6a;
  text-transform: uppercase; letter-spacing: 1px;
  color: #99a3bb; font-size: 9.5px;
}
.hint code {
  font-family: 'JetBrains Mono', monospace;
  color: #aab4cc;
}
</style>
