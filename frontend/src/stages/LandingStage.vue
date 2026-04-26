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
        amy · short for amygdala · the empathy layer
      </div>
      <h1>see what your brain<br/>is feeling.</h1>
      <p class="sub">
        amy reads each cortical network second-by-second. drop in a 30s clip and
        watch the brain light up — grounded in real neural signal, not invented
        emotion.
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
  background: var(--warm-cream);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
  font-family: var(--font-sans), 'DM Sans', system-ui, sans-serif;
  color: var(--warm-charcoal);
}

.bg-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
  mask-image: radial-gradient(circle at center, #000 30%, transparent 75%);
}
.bg-glow {
  position: absolute; inset: 0;
  background: radial-gradient(circle at 30% 40%, rgba(1, 65, 141, 0.05), transparent 50%),
              radial-gradient(circle at 70% 60%, rgba(1, 65, 141, 0.04), transparent 50%);
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
  stroke: rgba(1, 65, 141, 0.10);
  animation: orbit-spin 60s linear infinite;
}
.landing-orbital--inner {
  stroke: rgba(1, 65, 141, 0.06);
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
    rgba(1, 65, 141, 0.05) 0%,
    rgba(1, 65, 141, 0) 55%);
  pointer-events: none;
}

.hero {
  position: relative; z-index: 1;
  max-width: 640px;
  text-align: center;
  padding: 0 24px;
}

.brand-line {
  font-family: var(--font-mono), 'DM Mono', monospace;
  font-size: 11px; letter-spacing: 2.5px;
  text-transform: uppercase;
  color: var(--warm-charcoal);
  display: inline-flex; align-items: center; gap: 8px;
  margin-bottom: 24px;
  font-weight: 500;
}
.brand-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--blueberry-800);
  box-shadow: 0 0 6px rgba(1, 65, 141, 0.40);
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

h1 {
  font-family: var(--font-display), 'Roboto', system-ui, sans-serif;
  font-size: 44px;
  font-weight: 600;
  line-height: 1.1;
  color: var(--clay-black);
  letter-spacing: -0.02em;
  margin-bottom: 18px;
}

.sub {
  font-family: var(--font-sans), 'DM Sans', system-ui, sans-serif;
  font-size: 15px;
  line-height: 1.55;
  color: var(--warm-charcoal);
  margin-bottom: 36px;
}

.dropzone {
  border: 2px dashed var(--oat-border);
  border-radius: var(--r-card);
  padding: 38px 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--pure-white);
  box-shadow: var(--elev-1);
}
.dropzone:hover, .dropzone.is-dragging {
  border-color: var(--blueberry-800);
  background: rgba(1, 65, 141, 0.04);
  transform: translateY(-1px);
  box-shadow: var(--elev-1), 0 8px 24px rgba(1, 65, 141, 0.10);
}
.dropzone.is-loading {
  cursor: wait;
  border-color: var(--blueberry-600);
  background: rgba(10, 93, 191, 0.05);
}
.dropzone.has-error {
  border-color: var(--red);
  background: rgba(252, 121, 129, 0.05);
}

.dz-content {
  display: flex; flex-direction: column;
  align-items: center; gap: 8px;
}
.dz-icon {
  width: 44px; height: 44px;
  border: 1.5px solid var(--blueberry-800);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; color: var(--blueberry-800);
  margin-bottom: 8px;
}
.dz-icon.error { border-color: var(--red); color: var(--red); }

.dz-title {
  font-family: var(--font-sans), 'DM Sans', system-ui, sans-serif;
  font-size: 15px; font-weight: 500;
  color: var(--clay-black);
}
.dz-sub {
  font-family: var(--font-mono), 'DM Mono', monospace;
  font-size: 12px; color: var(--warm-silver);
}
.dz-sub code {
  font-family: var(--font-mono), 'DM Mono', monospace;
  background: rgba(1, 65, 141, 0.08);
  padding: 1px 6px; border-radius: 3px;
  color: var(--blueberry-800);
}

.spinner {
  width: 32px; height: 32px;
  border: 2.5px solid rgba(1, 65, 141, 0.15);
  border-top-color: var(--blueberry-600);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 4px;
}
@keyframes spin { to { transform: rotate(360deg); } }

.hint {
  margin-top: 20px;
  font-size: 11px; color: var(--warm-silver);
  display: flex; align-items: center; gap: 8px; justify-content: center;
}
.hint .key {
  background: var(--pure-white); padding: 2px 7px;
  border-radius: 3px; border: 1px solid var(--oat-border);
  text-transform: uppercase; letter-spacing: 1px;
  color: var(--warm-charcoal); font-size: 9.5px;
}
.hint code {
  font-family: var(--font-mono), 'DM Mono', monospace;
  color: var(--warm-charcoal);
}
</style>
