<template>
  <div class="loading-stage">
    <div class="bg-grid" />
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
      </div>

      <div class="status-line" :class="{ done: allDone }">
        <span v-if="allDone">Both pipelines complete · advancing…</span>
        <span v-else>Running pipelines in parallel…</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, h, defineComponent } from 'vue'
import { fetchVisionReport, fetchActivity } from '../api/index.js'

const props = defineProps({
  clipId: { type: String, required: true },
})

const emit = defineEmits(['done'])

// Per-stream state
const visionProgress = ref(0)
const tribeProgress  = ref(0)
const visionDone = ref(false)
const tribeDone  = ref(false)

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

const allDone = computed(() => visionDone.value && tribeDone.value)

function pushLog(target, msg) {
  target.value = [...target.value, msg]
  if (target.value.length > 4) target.value = target.value.slice(-4)
}

async function runVision() {
  // Tick a fake progress while fetching, then snap to 100 once data lands
  const start = performance.now()
  const minMs = 3500
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
  const minMs = 4200
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

onMounted(async () => {
  await Promise.all([runVision(), runTribe()])
  // Brief settle before emitting
  await new Promise(r => setTimeout(r, 600))
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
    return () => h('div', { class: ['stream', p.done && 'is-done'] }, [
      h('div', { class: 'stream-head' }, [
        h('span', { class: 'stream-label' }, p.label),
        h('span', { class: 'stream-sub' }, p.subtitle),
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
:deep(.stream-pct) {
  margin-left: auto;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px; font-weight: 500;
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
</style>
