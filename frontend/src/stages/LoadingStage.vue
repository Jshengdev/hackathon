<template>
  <div class="loading-stage">
    <div class="bg-grid" />

    <!-- Orbital backdrop: two faint, slow-rotating ellipses (matches LandingStage) -->
    <svg class="loading-orbital-svg" viewBox="0 0 800 800" aria-hidden="true">
      <g class="loading-orbital-group">
        <ellipse
          class="loading-orbital loading-orbital--outer"
          cx="400" cy="400"
          rx="320" ry="190"
          transform="rotate(-18 400 400)"
        />
        <ellipse
          class="loading-orbital loading-orbital--inner"
          cx="400" cy="400"
          rx="220" ry="130"
          transform="rotate(24 400 400)"
        />
      </g>
    </svg>

    <!-- Vignette: accent glow at center, fades to transparent -->
    <div class="loading-vignette" />

    <div class="container">
      <div class="header">
        <span class="brand-dot" :class="{ done: allDone }" />
        <span class="header-text">analyzing clip <code>{{ clipId }}</code></span>
      </div>

      <div class="streams">
        <ProgressStream
          label="Vision analysis"
          subtitle="Gemini · Claude"
          :progress="visionProgress"
          :done="visionDone"
          :logs="visionLogs"
          accent="#bb8fce"
        />
        <ProgressStream
          label="TRIBE V2 neural prediction"
          subtitle="prerendered · cached"
          :progress="tribeProgress"
          :done="tribeDone"
          :logs="tribeLogs"
          accent="#4ecdc4"
        />
        <ProgressStream
          :label="`K2 swarm · ${swarmDoneCount}/7 specialists`"
          subtitle="Cerebras · per-region readings"
          :progress="warmupProgress"
          :done="warmupReady"
          :logs="warmupLogs"
          accent="#f9a000"
        />
      </div>

      <div class="status-line" :class="{ done: allDone }">
        <span v-if="allDone">Both pipelines complete · advancing…</span>
        <span v-else>Running pipelines in parallel…</span>
      </div>

      <!-- Overall pipeline phase-rail: uploading → analyzing → syncing -->
      <div class="loading-phase-rail" role="progressbar" :aria-valuenow="Math.round(overallProgress * 100)" aria-valuemin="0" aria-valuemax="100">
        <div
          v-for="(p, i) in pipelinePhases"
          :key="`phase-${p.key}`"
          class="loading-phase-cell"
          :class="{
            past: phaseIndex > i,
            active: phaseIndex === i,
            future: phaseIndex < i,
          }"
        >
          <span class="loading-phase-dot" />
          <span class="loading-phase-label">{{ p.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, h, defineComponent } from 'vue'
import { fetchVisionReport, fetchActivity, fetchWarmupStatus } from '../api/index.js'

const props = defineProps({
  clipId: { type: String, required: true },
})

const emit = defineEmits(['done'])

// Per-stream state
const visionProgress = ref(0)
const tribeProgress  = ref(0)
const visionDone = ref(false)
const tribeDone  = ref(false)

// Warmup / swarm-progress stream (driven by /demo/warmup-status). The bar
// paces with real backend reality — swarm specialists, k2_region_cache, and
// empathy each contribute. This is the "slow lane" so the loading screen
// reflects the actual swarm work instead of snapping to 100% on cached fetches.
const warmupProgress = ref(0)
const warmupReady = ref(false)
const swarmDoneCount = ref(0)
const warmupLogs = ref([])

const visionLogs = ref([])
const tribeLogs  = ref([])

const VISION_LOGS = [
  'Extracting frames…',
  'Calling Claude vision…',
  'Aggregating scene descriptors…',
  'Synthesizing narrative…',
]
const TRIBE_LOGS = [
  'Loading TRIBE predictions…',
  'Aligning to fsaverage5…',
  'Aggregating to Yeo7…',
  'Normalizing per-network…',
]

let visionResult = null
let tribeResult  = null
let timers = []

const allDone = computed(() =>
  visionDone.value && tribeDone.value && warmupReady.value
)

// Weighted overall progress — warmup (swarm + caches) is the slow lane so it
// dominates pacing. Vision + TRIBE are fast cached fetches, capped to a
// minor share so the bar can't blow past the swarm.
const overallProgress = computed(() => {
  const v = Math.min(visionProgress.value, 1)
  const t = Math.min(tribeProgress.value, 1)
  const w = Math.min(warmupProgress.value, 1)
  return v * 0.10 + t * 0.10 + w * 0.80
})

const pipelinePhases = [
  { key: 'uploading', label: 'uploading' },
  { key: 'analyzing', label: 'analyzing' },
  { key: 'syncing',   label: 'syncing' },
]

// Threshold-based phase index. 0..0.33 → uploading, 0.33..0.66 → analyzing,
// 0.66..1.0 → syncing, ===1.0 → done (all three filled).
const phaseIndex = computed(() => {
  const p = overallProgress.value
  if (allDone.value || p >= 1) return 3 // all phases past
  if (p < 0.33) return 0
  if (p < 0.66) return 1
  return 2
})

function pushLog(target, msg) {
  target.value = [...target.value, msg]
  if (target.value.length > 4) target.value = target.value.slice(-4)
}

async function runVision() {
  // Tick a fake progress while fetching, then snap to 100 once data lands.
  // When the clip is fully prebaked, drop the min-floor so we don't stall on
  // a sub-second cached fetch.
  const start = performance.now()
  const minMs = prebakedAtStart.value ? 600 : 3500
  pushLog(visionLogs, VISION_LOGS[0])
  let logIdx = 1

  const tick = setInterval(() => {
    const elapsed = performance.now() - start
    visionProgress.value = Math.min(0.92, elapsed / minMs * 0.92)
    if (logIdx < VISION_LOGS.length && elapsed > (logIdx * minMs / VISION_LOGS.length)) {
      pushLog(visionLogs, VISION_LOGS[logIdx])
      logIdx++
    }
  }, 80)
  timers.push(tick)

  try {
    visionResult = await fetchVisionReport(props.clipId)
  } catch (e) {
    console.error('vision-report fetch failed', e)
    visionResult = null
  }

  // Wait the rest of the min duration if needed
  const remaining = minMs - (performance.now() - start)
  if (remaining > 0) await new Promise(r => setTimeout(r, remaining))

  clearInterval(tick)
  visionProgress.value = 1
  visionDone.value = true
  pushLog(visionLogs, '✓ Vision report ready')
}

async function runTribe() {
  const start = performance.now()
  const minMs = prebakedAtStart.value ? 600 : 4200
  pushLog(tribeLogs, TRIBE_LOGS[0])
  let logIdx = 1

  const tick = setInterval(() => {
    const elapsed = performance.now() - start
    tribeProgress.value = Math.min(0.92, elapsed / minMs * 0.92)
    if (logIdx < TRIBE_LOGS.length && elapsed > (logIdx * minMs / TRIBE_LOGS.length)) {
      pushLog(tribeLogs, TRIBE_LOGS[logIdx])
      logIdx++
    }
  }, 80)
  timers.push(tick)

  try {
    tribeResult = await fetchActivity(props.clipId)
  } catch (e) {
    console.error('activity fetch failed', e)
    tribeResult = null
  }

  const remaining = minMs - (performance.now() - start)
  if (remaining > 0) await new Promise(r => setTimeout(r, remaining))

  clearInterval(tick)
  tribeProgress.value = 1
  tribeDone.value = true
  pushLog(tribeLogs, '✓ Activity loaded')
}

// Pace the warmup progress bar with real backend reality, with a minimum
// animation floor so the bar never finishes faster than the eye can follow.
//   swarm_readings_progress[net].state === 'done'  → 1/7 of swarm slice (50% of bar)
//   k2_region_cache present in completed[]          → +25% of bar
//   empathy present in completed[]                  → +25% of bar
// MIN_MS floor: even when the backend is instant (cached/placeholder), the bar
// rises over MIN_MS and the swarm-count "lights up" one specialist per ~2.6s,
// so the loading screen feels like the swarm is actually working.
const WARMUP_MIN_MS = 20000           // 20s minimum loading duration
const SWARM_TICK_MS = WARMUP_MIN_MS / 7 // ~2.86s per specialist reveal
async function pollWarmup(maxMs = 180000, intervalMs = 600) {
  const start = performance.now()
  let lastShownCount = 0
  let backendReady = false
  while (performance.now() - start < maxMs) {
    let backendBar = 0
    let backendSwarm = 0
    try {
      const status = await fetchWarmupStatus(props.clipId)
      const sp = status?.swarm_readings_progress || {}
      backendSwarm = Object.values(sp).filter(
        (s) => s && s.state === 'done',
      ).length
      const completed = status?.completed || []
      const k2reg  = completed.includes('k2_region_cache') ? 1 : 0
      const empath = completed.includes('empathy') ? 1 : 0
      backendBar = (backendSwarm / 7) * 0.50 + k2reg * 0.25 + empath * 0.25
      backendReady = !!status?.ready
    } catch (e) {
      console.warn('warmup-status fetch failed', e)
      // Fall back to the time-paced floor if the backend isn't reachable.
      backendBar = 0
      backendReady = false
    }

    const elapsed = performance.now() - start
    const timeFraction = Math.min(1, elapsed / WARMUP_MIN_MS)
    const timeSwarm = Math.min(7, Math.floor(elapsed / SWARM_TICK_MS) + 1)

    // Bar = min of real backend progress and time-floor — never finishes
    // before MIN_MS even if backend is instant.
    const pacedBar = Math.min(
      backendReady ? 1 : 0.95,
      Math.max(0.05, Math.min(backendBar, timeFraction)),
    )
    warmupProgress.value = pacedBar

    // Reveal swarm specialists one-by-one over time even if cached.
    const shown = Math.min(backendSwarm, timeSwarm)
    if (shown > lastShownCount) {
      lastShownCount = shown
      // Pick a deterministic-looking label; falls back to a generic line.
      const sp = (await fetchWarmupStatus(props.clipId).catch(() => null))
        ?.swarm_readings_progress || {}
      const names = Object.keys(sp).filter((k) => sp[k]?.state === 'done')
      const label = names[shown - 1]
        ? names[shown - 1].replace(/_/g, ' ')
        : `specialist ${shown}`
      pushLog(warmupLogs, `✓ ${label}`)
    }
    swarmDoneCount.value = shown

    // Exit when both real readiness AND minimum time floor have been met.
    if (backendReady && elapsed >= WARMUP_MIN_MS) {
      warmupProgress.value = 1
      warmupReady.value = true
      swarmDoneCount.value = 7
      pushLog(warmupLogs, '✓ swarm ready · advancing')
      return true
    }
    await new Promise((r) => setTimeout(r, intervalMs))
  }
  return false
}

onMounted(async () => {
  pushLog(warmupLogs, 'spawning K2 specialists…')
  await Promise.all([runVision(), runTribe(), pollWarmup()])
  await new Promise((r) => setTimeout(r, 600))
  emit('done', { vision: visionResult, activity: tribeResult })
})

onBeforeUnmount(() => {
  for (const t of timers) clearInterval(t)
})

// ── Inline ProgressStream component (kept colocated for simplicity) ────────
const ProgressStream = defineComponent({
  name: 'ProgressStream',
  props: {
    label:    { type: String, required: true },
    subtitle: { type: String, default: '' },
    progress: { type: Number, default: 0 },
    done:     { type: Boolean, default: false },
    logs:     { type: Array, default: () => [] },
    accent:   { type: String, default: '#4ecdc4' },
  },
  setup(p) {
    // Tick-rail thresholds: 0.2 / 0.4 / 0.6 / 0.8 / 1.0
    const TICK_THRESHOLDS = [0.2, 0.4, 0.6, 0.8, 1.0]

    return () => h('div', { class: ['stream', p.done && 'is-done'] }, [
      h('div', { class: 'stream-head' }, [
        h('span', { class: 'stream-label' }, p.label),
        h('span', { class: 'stream-sub' }, p.subtitle),
        h('span', { class: 'stream-tick-rail' },
          TICK_THRESHOLDS.map((t, i) => h('span', {
            key: `tick-${i}`,
            class: ['stream-tick', p.progress >= t && 'is-filled'],
            style: p.progress >= t
              ? { background: p.accent, boxShadow: `0 0 4px ${p.accent}` }
              : undefined,
          })),
        ),
        h('span', {
          class: 'stream-pct',
          style: { color: p.accent },
        }, `${Math.round(p.progress * 100)}%`),
      ]),
      h('div', { class: 'bar' }, [
        h('div', {
          class: 'bar-fill',
          style: {
            width: `${Math.round(p.progress * 100)}%`,
            background: p.accent,
            boxShadow: `0 0 10px ${p.accent}88`,
          },
        }),
      ]),
      h('div', { class: 'logs' },
        p.logs.map(l => h('div', { class: 'log-line', style: { color: l.startsWith('✓') ? p.accent : undefined } }, l)),
      ),
    ])
  },
})
</script>

<style scoped>
.loading-stage {
  position: relative;
  width: 100vw; height: 100vh;
  background: #050510;
  color: #d0d8ee;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Inter', system-ui, sans-serif;
  overflow: hidden;
}
.bg-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(120, 160, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(120, 160, 255, 0.04) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(circle at center, #000 30%, transparent 75%);
  pointer-events: none;
}

/* Orbital backdrop — slow-rotating SVG ellipses, CSS-only animation */
.loading-orbital-svg {
  position: absolute;
  top: 50%; left: 50%;
  width: min(120vmin, 1100px);
  height: min(120vmin, 1100px);
  transform: translate(-50%, -50%);
  pointer-events: none;
  overflow: visible;
  opacity: 0.9;
}
.loading-orbital {
  fill: none;
  stroke-width: 1;
  transform-origin: 400px 400px;
  transform-box: fill-box;
}
.loading-orbital--outer {
  stroke: rgba(180, 200, 255, 0.10);
  animation: orbit-spin 60s linear infinite;
}
.loading-orbital--inner {
  stroke: rgba(180, 200, 255, 0.06);
  animation: orbit-spin 35s linear infinite reverse;
}
@keyframes orbit-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* Vignette — accent glow at center, fades to transparent */
.loading-vignette {
  position: absolute; inset: 0;
  background: radial-gradient(circle at 50% 50%,
    rgba(130, 224, 170, 0.08) 0%,
    rgba(130, 224, 170, 0) 55%);
  pointer-events: none;
}

.container {
  position: relative; z-index: 1;
  width: 720px;
  max-width: 92vw;
}

.header {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 36px;
  font-size: 12px; letter-spacing: 1.6px;
  text-transform: uppercase;
  color: #99a3bb;
}
.brand-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: #f7dc6f;
  box-shadow: 0 0 8px #f7dc6f;
  animation: pulse 1.4s ease-in-out infinite;
}
.brand-dot.done {
  background: #82e0aa;
  box-shadow: 0 0 8px #82e0aa;
  animation: none;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}
.header-text code {
  font-family: 'JetBrains Mono', monospace;
  color: #4ecdc4;
  letter-spacing: normal;
  text-transform: lowercase;
  margin-left: 4px;
}

.streams {
  display: flex; flex-direction: column; gap: 32px;
  margin-bottom: 32px;
}

:deep(.stream) {
  background: rgba(10, 10, 25, 0.6);
  border: 1px solid #1f2a4a;
  border-radius: 6px;
  padding: 16px 20px;
  transition: border-color 0.3s ease;
}
:deep(.stream.is-done) {
  border-color: #2e6a4a;
}

:deep(.stream-head) {
  display: flex; align-items: baseline; gap: 12px;
  margin-bottom: 10px;
}
:deep(.stream-label) {
  font-size: 13px; font-weight: 500;
  color: #e8ecf8;
  letter-spacing: 0.4px;
}
:deep(.stream-sub) {
  font-size: 11px; color: #6677aa;
  text-transform: uppercase; letter-spacing: 1.2px;
}
:deep(.stream-tick-rail) {
  margin-left: auto;
  display: inline-flex; align-items: center; gap: 4px;
  padding-right: 4px;
}
:deep(.stream-tick) {
  width: 4px; height: 4px; border-radius: 50%;
  background: rgba(180, 200, 255, 0.18);
  transition: background 0.25s ease, box-shadow 0.25s ease;
}
:deep(.stream-tick.is-filled) {
  /* color/box-shadow set inline via accent */
}
:deep(.stream-pct) {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px; font-weight: 500;
  min-width: 36px; text-align: right;
}

:deep(.bar) {
  height: 4px; background: rgba(255, 255, 255, 0.06);
  border-radius: 2px; overflow: hidden;
  margin-bottom: 12px;
}
:deep(.bar-fill) {
  height: 100%;
  transition: width 0.15s linear;
  border-radius: 2px;
}

:deep(.logs) {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #6677aa;
  min-height: 60px;
  display: flex; flex-direction: column; gap: 3px;
}
:deep(.log-line) {
  white-space: nowrap; overflow: hidden;
  text-overflow: ellipsis;
}

.status-line {
  text-align: center;
  font-size: 12px;
  color: #6677aa;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: color 0.4s ease;
}
.status-line.done { color: #82e0aa; }

/* Overall pipeline phase-rail: 3 dots labeled uploading / analyzing / syncing */
.loading-phase-rail {
  margin-top: 20px;
  display: flex; align-items: center; justify-content: center;
  gap: 28px;
}
.loading-phase-cell {
  display: flex; align-items: center; gap: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 1.2px;
  text-transform: uppercase;
  color: #556688;
  transition: color 0.35s ease;
}
.loading-phase-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: rgba(180, 200, 255, 0.18);
  transition: background 0.35s ease, box-shadow 0.35s ease, transform 0.35s ease;
}
.loading-phase-cell.past .loading-phase-dot {
  background: color-mix(in srgb, #82e0aa 55%, transparent);
}
.loading-phase-cell.past .loading-phase-label {
  color: #99a3bb;
}
.loading-phase-cell.active .loading-phase-dot {
  background: #82e0aa;
  box-shadow: 0 0 6px #82e0aa;
  transform: scale(1.4);
  animation: phase-pulse 1.6s ease-in-out infinite;
}
.loading-phase-cell.active .loading-phase-label {
  color: #82e0aa;
}
@keyframes phase-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.55; }
}
</style>
