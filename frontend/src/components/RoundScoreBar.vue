<template>
  <div class="rsb">
    <div v-if="label" class="rsb-label">{{ label }}</div>
    <div class="rsb-track" :style="{ height: `${height}px` }">
      <div class="rsb-fill" :style="fillStyle" />
    </div>
    <div class="rsb-readout">{{ displayScore.toFixed(2) }}</div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  score:     { type: Number, required: true },
  fromScore: { type: Number, default: 0 },
  duration:  { type: Number, default: 1500 },
  height:    { type: Number, default: 12 },
  accent:    { type: String, default: '#4ecdc4' },
  label:     { type: String, default: '' },
})

const displayScore = ref(props.fromScore)
let rafId = null
let animStart = 0
let animFrom = props.fromScore
let animTo = props.score

function animateTo(target) {
  if (rafId) cancelAnimationFrame(rafId)
  animFrom = displayScore.value
  animTo = target
  animStart = performance.now()
  const tick = (now) => {
    const elapsed = now - animStart
    const t = Math.min(1, elapsed / props.duration)
    const eased = 1 - Math.pow(1 - t, 3)
    displayScore.value = animFrom + (animTo - animFrom) * eased
    if (t < 1) rafId = requestAnimationFrame(tick)
    else rafId = null
  }
  rafId = requestAnimationFrame(tick)
}

const fillStyle = computed(() => ({
  width: `${Math.max(0, Math.min(1, displayScore.value)) * 100}%`,
  background: props.accent,
  boxShadow: `0 0 12px ${props.accent}aa`,
}))

watch(() => props.score, (n) => animateTo(n))
onMounted(() => animateTo(props.score))
onBeforeUnmount(() => { if (rafId) cancelAnimationFrame(rafId) })
</script>

<style scoped>
.rsb {
  display: flex; flex-direction: column; gap: 6px;
  font-family: 'JetBrains Mono', monospace;
  color: #aab4cc;
}
.rsb-label {
  font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase;
  color: #6677aa;
}
.rsb-track {
  position: relative;
  width: 100%;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  overflow: hidden;
}
.rsb-fill {
  height: 100%;
  border-radius: 4px;
  transition: background 0.3s ease;
}
.rsb-readout {
  font-size: 11px;
  color: #f0f4ff;
  align-self: flex-end;
}
</style>
