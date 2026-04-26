<template>
  <div class="landing">
    <!-- Top rail -->
    <header class="rail">
      <div class="rail-mark">
        <span class="rail-mark-title">TRIBE&nbsp;v2</span>
        <span class="rail-mark-sub">Empathy Layer · brain-swarm demo</span>
      </div>
      <div class="rail-links">
        <a class="rail-link" href="#" @click.prevent>Code</a>
        <a class="rail-link" href="#" @click.prevent>Weights</a>
        <a class="rail-link" href="#" @click.prevent>Paper</a>
      </div>
    </header>

    <!-- Hero: flanking brain meshes + centered text -->
    <main class="hero-wrap">
      <!-- Left brain ghost (silhouette + stylized warm patches) -->
      <figure class="brain-ghost brain-ghost--left" aria-hidden="true">
        <span class="ghost-eyebrow">Actual brain activity</span>
        <svg viewBox="0 0 320 320" class="ghost-svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="patchA" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%"  stop-color="#ffd84a" stop-opacity="0.95" />
              <stop offset="55%" stop-color="#d83a00" stop-opacity="0.55" />
              <stop offset="100%" stop-color="#1a0000" stop-opacity="0" />
            </radialGradient>
            <radialGradient id="patchB" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%"  stop-color="#f9a000" stop-opacity="0.85" />
              <stop offset="60%" stop-color="#5a1100" stop-opacity="0.4" />
              <stop offset="100%" stop-color="#000000" stop-opacity="0" />
            </radialGradient>
            <radialGradient id="silhouette" cx="0.5" cy="0.5" r="0.7">
              <stop offset="0%"  stop-color="#1f1f1f" stop-opacity="1" />
              <stop offset="80%" stop-color="#0a0a0a" stop-opacity="1" />
              <stop offset="100%" stop-color="#000000" stop-opacity="1" />
            </radialGradient>
          </defs>

          <!-- Hemisphere silhouette: rough cortex shape, left-facing -->
          <path
            d="M 60 160
               C 60 90, 130 38, 200 50
               C 252 60, 280 110, 282 160
               C 282 200, 268 240, 232 268
               C 200 290, 150 296, 110 280
               C 80 268, 60 232, 60 200 Z"
            fill="url(#silhouette)"
            stroke="rgba(255,255,255,0.05)"
            stroke-width="1"
          />

          <!-- Activation patches -->
          <ellipse cx="170" cy="130" rx="46" ry="28" fill="url(#patchA)" />
          <ellipse cx="218" cy="180" rx="32" ry="22" fill="url(#patchB)" />
          <ellipse cx="140" cy="210" rx="22" ry="14" fill="url(#patchB)" />
          <ellipse cx="200" cy="240" rx="18" ry="10" fill="url(#patchA)" />
          <ellipse cx="100" cy="170" rx="14" ry="9"  fill="url(#patchB)" />

          <!-- Brain-stem hint -->
          <path
            d="M 170 285
               C 168 304, 170 314, 174 318"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </figure>

      <!-- Centered hero text -->
      <section class="hero">
        <div class="kicker">
          <span class="kicker-dot" />
          TRIBE&nbsp;V2 · Empathy&nbsp;Layer
        </div>

        <h1 class="title">
          What it took<br/>
          <em class="title-em">— not just what was done.</em>
        </h1>

        <p class="sub">
          Drop a clip. We match it against pre-rendered TRIBE&nbsp;V2
          cortical activations and walk you through what each network
          was doing, second by second.
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
            <span class="dz-arrow">↑</span>
            <span class="dz-title">Drop an MP4 here</span>
            <span class="dz-sub">
              or click to browse · try
              <code>30s_ironsite.mp4</code>
            </span>
          </div>

          <div v-else-if="loading" class="dz-content">
            <span class="spinner" />
            <span class="dz-title">Matching clip…</span>
            <span class="dz-sub">{{ filename }}</span>
          </div>

          <div v-else class="dz-content">
            <span class="dz-arrow dz-arrow--error">!</span>
            <span class="dz-title">{{ error }}</span>
            <span class="dz-sub">Try again with a supported clip.</span>
          </div>
        </div>

        <p class="tip">
          <span class="tip-key">tip</span>
          Filename is what's matched, not the bytes. Anything named
          <code>30s_ironsite.mp4</code> or
          <code>30s_twitter.mp4</code> works.
        </p>
      </section>

      <!-- Right brain ghost (mirrored) -->
      <figure class="brain-ghost brain-ghost--right" aria-hidden="true">
        <span class="ghost-eyebrow">Predicted brain activity</span>
        <svg viewBox="0 0 320 320" class="ghost-svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="patchC" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%"  stop-color="#ffd84a" stop-opacity="0.9" />
              <stop offset="55%" stop-color="#d83a00" stop-opacity="0.5" />
              <stop offset="100%" stop-color="#1a0000" stop-opacity="0" />
            </radialGradient>
            <radialGradient id="patchD" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%"  stop-color="#f9a000" stop-opacity="0.8" />
              <stop offset="60%" stop-color="#5a1100" stop-opacity="0.35" />
              <stop offset="100%" stop-color="#000000" stop-opacity="0" />
            </radialGradient>
          </defs>

          <g transform="scale(-1, 1) translate(-320, 0)">
            <path
              d="M 60 160
                 C 60 90, 130 38, 200 50
                 C 252 60, 280 110, 282 160
                 C 282 200, 268 240, 232 268
                 C 200 290, 150 296, 110 280
                 C 80 268, 60 232, 60 200 Z"
              fill="url(#silhouette)"
              stroke="rgba(255,255,255,0.05)"
              stroke-width="1"
            />
            <ellipse cx="170" cy="130" rx="42" ry="26" fill="url(#patchC)" />
            <ellipse cx="218" cy="180" rx="34" ry="22" fill="url(#patchD)" />
            <ellipse cx="142" cy="216" rx="24" ry="14" fill="url(#patchD)" />
            <ellipse cx="198" cy="244" rx="20" ry="12" fill="url(#patchC)" />
            <ellipse cx="106" cy="172" rx="14" ry="9"  fill="url(#patchD)" />
            <path
              d="M 170 285
                 C 168 304, 170 314, 174 318"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              stroke-width="2"
              stroke-linecap="round"
            />
          </g>
        </svg>
      </figure>
    </main>

    <!-- Legend bar bottom-right (echoing TRIBE's correlation legend) -->
    <aside class="legend" aria-hidden="true">
      <span class="legend-tick">Low</span>
      <span class="legend-strip" />
      <span class="legend-tick">High</span>
      <span class="legend-caption">Activity</span>
    </aside>
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
  width: 100vw;
  min-height: 100vh;
  background: var(--tribe-bg);
  color: var(--tribe-smoke);
  font-family: var(--tribe-font-body);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* ---------- Top rail ---------- */
.rail {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px;
}
.rail-mark {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.rail-mark-title {
  font-family: var(--tribe-font-display);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0;
  color: var(--tribe-ink);
}
.rail-mark-sub {
  font-size: 11px;
  letter-spacing: var(--tribe-track-label);
  text-transform: uppercase;
  color: var(--tribe-smoke);
}
.rail-links {
  display: flex;
  gap: 24px;
}
.rail-link {
  font-size: 13px;
  color: var(--tribe-ink-soft);
  text-decoration: none;
  transition: color var(--tribe-dur-fast) var(--tribe-easing);
}
.rail-link:hover {
  color: var(--tribe-accent);
}
.rail-link::after {
  content: ' ↗';
  color: var(--tribe-smoke);
  font-size: 11px;
}

/* ---------- Hero layout ---------- */
.hero-wrap {
  position: relative;
  flex: 1 1 auto;
  display: grid;
  grid-template-columns: minmax(220px, 1fr) minmax(420px, 720px) minmax(220px, 1fr);
  align-items: center;
  gap: 32px;
  padding: 24px 64px 96px;
}

@media (max-width: 1100px) {
  .hero-wrap {
    grid-template-columns: 1fr;
    padding: 24px 32px 64px;
  }
  .brain-ghost { display: none; }
}

/* ---------- Brain ghosts ---------- */
.brain-ghost {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin: 0;
  opacity: 0.85;
}
.brain-ghost--left  { justify-self: end; }
.brain-ghost--right { justify-self: start; }

.ghost-eyebrow {
  font-size: 11px;
  letter-spacing: var(--tribe-track-label);
  text-transform: uppercase;
  color: var(--tribe-smoke);
  font-weight: 500;
}
.ghost-svg {
  width: clamp(220px, 22vw, 320px);
  height: auto;
  filter: drop-shadow(0 0 24px rgba(216, 58, 0, 0.18));
}

/* ---------- Hero text ---------- */
.hero {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 640px;
  justify-self: center;
}

.kicker {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  letter-spacing: var(--tribe-track-label);
  text-transform: uppercase;
  color: var(--tribe-smoke);
  font-weight: 500;
  margin-bottom: 28px;
}
.kicker-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--tribe-accent);
  box-shadow: 0 0 8px rgba(249, 200, 80, 0.6);
}

.title {
  font-family: var(--tribe-font-display);
  font-size: var(--tribe-hero-title);
  font-weight: 600;
  line-height: 1.04;
  letter-spacing: var(--tribe-track-display);
  color: var(--tribe-ink);
  margin: 0 0 24px;
}
.title-em {
  font-style: normal;
  color: var(--tribe-smoke);
  font-weight: 500;
}

.sub {
  font-family: var(--tribe-font-body);
  font-size: var(--tribe-hero-sub);
  line-height: 1.6;
  color: var(--tribe-smoke);
  max-width: 520px;
  margin: 0 auto 40px;
}

/* ---------- Drop zone ---------- */
.dropzone {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--tribe-r-pill);
  border: 1px solid var(--tribe-hair);
  background: rgba(255, 255, 255, 0.02);
  padding: 18px 32px;
  min-width: 360px;
  cursor: pointer;
  transition:
    border-color var(--tribe-dur-base) var(--tribe-easing),
    background   var(--tribe-dur-base) var(--tribe-easing),
    transform    var(--tribe-dur-base) var(--tribe-easing);
}
.dropzone:hover,
.dropzone.is-dragging {
  border-color: var(--tribe-accent);
  background: rgba(249, 200, 80, 0.04);
  transform: translateY(-1px);
}
.dropzone.is-loading {
  cursor: wait;
  border-color: var(--tribe-accent-warm);
}
.dropzone.has-error {
  border-color: var(--tribe-fail);
  background: rgba(252, 121, 129, 0.05);
}

.dz-content {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: center;
}
.dz-arrow {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid var(--tribe-hair-strong);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: var(--tribe-ink);
}
.dropzone:hover .dz-arrow {
  border-color: var(--tribe-accent);
  color: var(--tribe-accent);
}
.dz-arrow--error {
  border-color: var(--tribe-fail);
  color: var(--tribe-fail);
}
.dz-title {
  font-family: var(--tribe-font-body);
  font-size: 14px;
  font-weight: 500;
  color: var(--tribe-ink);
}
.dz-sub {
  font-size: 12px;
  color: var(--tribe-smoke);
}
.dz-sub code {
  font-family: var(--tribe-font-mono);
  background: rgba(255, 255, 255, 0.04);
  padding: 1px 6px;
  border-radius: var(--tribe-r-sharp);
  color: var(--tribe-ink-soft);
  font-size: 11px;
}

/* ---------- Spinner ---------- */
.spinner {
  width: 18px;
  height: 18px;
  border: 1.5px solid rgba(249, 160, 0, 0.2);
  border-top-color: var(--tribe-accent-warm);
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ---------- Tip ---------- */
.tip {
  margin-top: 28px;
  font-size: 12px;
  color: var(--tribe-mute);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}
.tip-key {
  font-family: var(--tribe-font-mono);
  background: transparent;
  padding: 2px 8px;
  border-radius: var(--tribe-r-sharp);
  border: 1px solid var(--tribe-hair);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--tribe-smoke);
  font-size: 10px;
}
.tip code {
  font-family: var(--tribe-font-mono);
  color: var(--tribe-ink-soft);
  font-size: 11px;
}

/* ---------- Legend (correlation strip) ---------- */
.legend {
  position: absolute;
  right: 32px;
  bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  color: var(--tribe-smoke-soft);
}
.legend-strip {
  width: 96px;
  height: 5px;
  border-radius: 2px;
  background: var(--tribe-heat-gradient);
}
.legend-tick {
  font-family: var(--tribe-font-mono);
  letter-spacing: 0.08em;
  color: var(--tribe-smoke);
}
.legend-caption {
  margin-left: 6px;
  font-family: var(--tribe-font-body);
  font-size: 11px;
  letter-spacing: var(--tribe-track-label);
  text-transform: uppercase;
  color: var(--tribe-smoke);
}
</style>
