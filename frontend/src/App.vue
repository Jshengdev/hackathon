<template>
  <div class="app-root">
    <transition name="stage" mode="out-in">
      <component
        :is="stageComponent"
        :key="currentStage"
        v-bind="stageProps"
        @matched="onMatched"
        @done="onLoadingDone"
        @next="goToComparison"
      />
    </transition>

    <!-- Tiny stage indicator (bottom-left) -->
    <div class="stage-indicator">
      <span
        v-for="(s, i) in stages"
        :key="s"
        class="dot"
        :class="{ active: i === stageIdx, past: i < stageIdx }"
      />
      <span class="stage-name">{{ currentStage }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, shallowRef } from 'vue'
import LandingStage    from './stages/LandingStage.vue'
import LoadingStage    from './stages/LoadingStage.vue'
import MainStage       from './stages/MainStage.vue'
import ComparisonStage from './stages/ComparisonStage.vue'

const stages = ['landing', 'loading', 'main', 'comparison']
const currentStage = ref('landing')
const stageIdx = computed(() => stages.indexOf(currentStage.value))

// Cross-stage state
const clipId       = ref('')   // matched clip identifier
const activityData = shallowRef(null)
const visionReport = shallowRef(null)

const stageMap = { landing: LandingStage, loading: LoadingStage, main: MainStage, comparison: ComparisonStage }
const stageComponent = computed(() => stageMap[currentStage.value])

const stageProps = computed(() => {
  switch (currentStage.value) {
    case 'loading':    return { clipId: clipId.value }
    case 'main':       return { clipId: clipId.value, activityData: activityData.value }
    case 'comparison': return { clipId: clipId.value, activityData: activityData.value }
    default:           return {}
  }
})

// ── Stage transitions ──────────────────────────────────────────────────────
function onMatched(payload) {
  // payload from POST /demo/match — expect { clip_id, ... }
  clipId.value = payload?.clip_id || payload?.clipId || ''
  if (!clipId.value) {
    console.warn('No clip_id in match payload', payload)
    return
  }
  currentStage.value = 'loading'
}

function onLoadingDone({ vision, activity }) {
  activityData.value = activity
  visionReport.value = vision
  currentStage.value = 'main'
}

function goToComparison() {
  currentStage.value = 'comparison'
}
</script>

<style scoped>
.app-root {
  width: 100vw; height: 100vh;
  position: relative;
  background: #050510;
  overflow: hidden;
}

.stage-indicator {
  position: fixed;
  bottom: 14px; left: 14px;
  display: flex; align-items: center; gap: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #556688;
  z-index: 200;
  pointer-events: none;
}
.dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #1f2a4a;
  transition: background 0.3s ease, box-shadow 0.3s ease;
}
.dot.past   { background: #2a3a6a; }
.dot.active {
  background: #4ecdc4;
  box-shadow: 0 0 6px #4ecdc4;
}
.stage-name {
  margin-left: 6px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* Stage cross-fade */
.stage-enter-active, .stage-leave-active {
  transition: opacity 0.4s ease;
}
.stage-enter-from, .stage-leave-to { opacity: 0; }
</style>
