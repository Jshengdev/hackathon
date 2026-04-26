<template>
  <div class="comparison-stage">
    <!-- LEFT: brain (~50% viewport, looping activity) -->
    <div class="brain-pane">
      <BrainScene
        :activity-data="activityData"
        :current-time="loopTime"
        :is-playing="true"
        layout="left-half"
        :show-hud="true"
        :interactive="false"
      />

      <!-- Correlation legend pinned top-right of the brain pane -->
      <div class="legend-anchor">
        <Legend label="correlation" :min="0.0" :max="0.4" />
      </div>
    </div>

    <!-- RIGHT: stacked panels with the iterative loop sandwiched IN BETWEEN —
         physically anchoring "the loop refines INTO the with-TRIBE result". -->
    <div class="panels-pane">
      <div class="panel-slot">
        <AnalysisPanel
          variant="without"
          :data="comparison?.without_tribe || {}"
        />
      </div>

      <div class="loop-slot">
        <IterativeLoop
          :trajectory="trajectory"
          :accent="dominantColor"
        />
      </div>

      <div class="panel-slot">
        <AnalysisPanel
          variant="with"
          :data="comparison?.with_tribe || {}"
          :accent-color="dominantColor"
        />
      </div>
    </div>

    <!-- Header label across the panels area -->
    <div class="cmp-header">
      <span class="brand-dot" />
      <span>side-by-side · <code>{{ clipId }}</code></span>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="cmp-loading">loading comparison…</div>
    <div v-else-if="error" class="cmp-error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import BrainScene from '../components/BrainScene.vue'
import AnalysisPanel from '../components/AnalysisPanel.vue'
import IterativeLoop from '../components/IterativeLoop.vue'
import Legend from '../components/Legend.vue'
import { fetchComparison } from '../api/index.js'
import { NETWORK_COLORS } from '../utils/colors.js'

// Mock iterative-loop trajectory until the engine's EmpathyDocument JSON wires
// up. Shape matches caltech/engine/runner.py EmpathyDocument.round_trajectory.
const trajectory = [
  { round: 1, score: 0.42, paragraphExcerpt: 'Worker walked through the area, observing materials and tools.' },
  { round: 2, score: 0.58, paragraphExcerpt: 'She entered the scaffolding zone and surveyed the workspace.' },
  { round: 3, score: 0.65, paragraphExcerpt: 'She moved through the scaffolding with deliberate pace.' },
  { round: 4, score: 0.71, paragraphExcerpt: 'She moved through the scaffolding, attention drifting between tasks.' },
  { round: 5, score: 0.79, paragraphExcerpt: 'She moved through the scaffolding like someone with split focus.' },
  { round: 6, score: 0.81, paragraphExcerpt: 'She moved through the scaffolding like someone whose mind was already elsewhere.' },
  { round: 7, score: 0.83, paragraphExcerpt: 'She moved through the scaffolding like someone whose attention had already left for the day.' },
  { round: 8, score: 0.84, paragraphExcerpt: 'She moved through the scaffolding like someone whose attention had already left for the day, body still here, mind clocked out.' },
]

const props = defineProps({
  clipId:       { type: String, required: true },
  activityData: { type: Object, required: true },
})

const comparison = ref(null)
const loading = ref(true)
const error   = ref('')

// Drive a virtual "currentTime" so the brain keeps looping through the activity.json
const loopTime = ref(0)
let rafId = null
let startWall = performance.now()
function tickLoop() {
  const elapsed = (performance.now() - startWall) / 1000
  loopTime.value = elapsed
  rafId = requestAnimationFrame(tickLoop)
}

// Pick dominant network from the activity (most-active across the clip) for the
// "with TRIBE" panel glow color.
const dominantColor = computed(() => {
  const data = props.activityData
  if (!data?.frames?.length) return NETWORK_COLORS.frontoparietal
  const totals = {}
  for (const f of data.frames) {
    for (const [k, v] of Object.entries(f.regions || {})) {
      totals[k] = (totals[k] || 0) + (v || 0)
    }
  }
  let best = null, bestVal = -Infinity
  for (const [k, v] of Object.entries(totals)) {
    if (v > bestVal) { bestVal = v; best = k }
  }
  return NETWORK_COLORS[best] || NETWORK_COLORS.frontoparietal
})

onMounted(async () => {
  rafId = requestAnimationFrame(tickLoop)
  try {
    comparison.value = await fetchComparison(props.clipId)
  } catch (e) {
    error.value = 'Could not load comparison data.'
    console.error(e)
  } finally {
    loading.value = false
  }
})

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.comparison-stage {
  position: relative;
  width: 100vw; height: 100vh;
  background: var(--tribe-bg, #000000);
  display: flex;
  color: var(--tribe-ink, #ffffff);
  font-family: 'Inter', system-ui, sans-serif;
  overflow: hidden;
}

.brain-pane {
  width: 50%;
  height: 100%;
  position: relative;
  background: var(--tribe-bg, #000000);
  border-right: 1px solid var(--tribe-hair, rgba(255, 255, 255, 0.08));
}

.legend-anchor {
  position: absolute;
  top: 16px; right: 16px;
  z-index: 5;
}

.panels-pane {
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 56px 16px 16px 16px;
  gap: 12px;
  background: var(--tribe-bg, #000000);
}

.panel-slot {
  flex: 1 1 0;
  min-height: 160px;
}

.loop-slot {
  flex: 0 1 auto;
  min-height: 260px;
}

.cmp-header {
  position: absolute;
  top: 16px; left: calc(50% + 18px);
  display: flex; align-items: center; gap: 10px;
  font-family: 'Space Mono', 'JetBrains Mono', ui-monospace, monospace;
  font-size: 11px;
  letter-spacing: 0.6px;
  text-transform: lowercase;
  color: var(--tribe-smoke, #465a69);
  z-index: 5;
}
.cmp-header code {
  font-family: 'Space Mono', 'JetBrains Mono', ui-monospace, monospace;
  color: var(--tribe-ink, #ffffff);
  letter-spacing: normal;
  text-transform: lowercase;
  margin-left: 2px;
}
.brand-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--tribe-ink, #ffffff);
}

.cmp-loading, .cmp-error {
  position: absolute;
  top: 50%; left: 75%;
  transform: translate(-50%, -50%);
  font-family: 'Space Mono', 'JetBrains Mono', ui-monospace, monospace;
  font-size: 12px;
  color: var(--tribe-smoke, #465a69);
  letter-spacing: 0.4px;
  text-transform: lowercase;
}
.cmp-error { color: #d83a00; }
</style>
