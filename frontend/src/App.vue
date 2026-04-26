<template>
  <div class="app-root" :class="`stage-${currentStage}`">
    <transition name="stage" mode="out-in">
      <component
        :is="stageComponent"
        :key="currentStage"
        v-bind="stageProps"
        @matched="onMatched"
        @done="onLoadingDone"
        @next="goToIterativeReveal"
        @reveal-done="onRevealDone"
      />
    </transition>

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
import LandingStage         from './stages/LandingStage.vue'
import LoadingStage         from './stages/LoadingStage.vue'
import MainStage            from './stages/MainStage.vue'
import IterativeRevealStage from './stages/IterativeRevealStage.vue'
import EmpathyDocumentStage from './stages/EmpathyDocumentStage.vue'

const stages = ['landing', 'loading', 'main', 'iterative-reveal', 'empathy-document']
const currentStage = ref('landing')
const stageIdx = computed(() => stages.indexOf(currentStage.value))

const clipId         = ref('')
const scenario       = ref('')
const scenarioLabel  = ref('')
const videoUrl       = ref(null)
const activityData   = shallowRef(null)
const visionReport   = shallowRef(null)

const stageMap = {
  'landing':          LandingStage,
  'loading':          LoadingStage,
  'main':             MainStage,
  'iterative-reveal': IterativeRevealStage,
  'empathy-document': EmpathyDocumentStage,
}
const stageComponent = computed(() => stageMap[currentStage.value])

const stageProps = computed(() => {
  switch (currentStage.value) {
    case 'loading':
      return { clipId: clipId.value }
    case 'main':
      return {
        clipId: clipId.value,
        activityData: activityData.value,
        scenario: scenario.value,
        videoUrl: videoUrl.value,
      }
    case 'iterative-reveal':
      return { clipId: clipId.value, scenario: scenario.value }
    case 'empathy-document':
      return {
        clipId: clipId.value,
        scenario: scenario.value,
        scenarioLabel: scenarioLabel.value,
      }
    default:
      return {}
  }
})

function onMatched(payload) {
  clipId.value        = payload?.clip_id      || payload?.clipId       || ''
  scenario.value      = payload?.scenario     || 'consumer'
  scenarioLabel.value = payload?.scenarioLabel|| payload?.scenario_label|| ''
  videoUrl.value      = payload?.video_url    || payload?.videoUrl      || null
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

function goToIterativeReveal() {
  currentStage.value = 'iterative-reveal'
}

function onRevealDone() {
  currentStage.value = 'empathy-document'
}
</script>

<style>
:root {
  /* Color tokens — Clay-inspired */
  --clay-black: #000000;
  --pure-white: #ffffff;
  --warm-cream: #faf9f7;
  --warm-silver: #9f9b93;
  --warm-charcoal: #55534e;
  --border-light: #eee9df;
  --oat-border: #dad4c8;
  --blueberry-800: #01418d;
  --blueberry-600: #0a5dbf;
  --blueberry-300: #6da6e8;
  --red: #fc7981;
  --red-soft: #ff9aa1;
  --activation-cool: var(--blueberry-800);
  --activation-warm: #c44569;
  --activation-hot: #f5a142;

  /* Radii — Clay scale */
  --r-sharp: 4px;
  --r-standard: 8px;
  --r-card: 12px;
  --r-feature: 24px;
  --r-section: 40px;
  --r-pill: 9999px;

  /* Shadow — Clay signature multi-layer */
  --elev-1:
    rgba(0, 0, 0, 0.10) 0px 1px 1px,
    rgba(0, 0, 0, 0.04) 0px -1px 1px inset,
    rgba(0, 0, 0, 0.05) 0px -0.5px 1px;

  /* Fonts (loaded via Google Fonts in index.html) */
  --font-sans: 'DM Sans', system-ui, sans-serif;
  --font-mono: 'DM Mono', monospace;
  --font-display: 'Roboto', sans-serif;
}
</style>

<style scoped>
.app-root {
  width: 100vw; height: 100vh;
  position: relative;
  background: var(--warm-cream);
  overflow: hidden;
}
.app-root.stage-empathy-document {
  height: auto;
  min-height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.stage-indicator {
  position: fixed;
  bottom: 14px; left: 14px;
  display: flex; align-items: center; gap: 6px;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--warm-silver);
  z-index: 200;
  pointer-events: none;
}
.dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--oat-border);
  transition: background 0.3s ease, box-shadow 0.3s ease;
}
.dot.past   { background: var(--blueberry-300); }
.dot.active {
  background: var(--blueberry-800);
  box-shadow: 0 0 6px var(--blueberry-800);
}
.stage-name {
  margin-left: 6px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.stage-enter-active, .stage-leave-active { transition: opacity 0.4s ease; }
.stage-enter-from, .stage-leave-to       { opacity: 0; }
</style>
