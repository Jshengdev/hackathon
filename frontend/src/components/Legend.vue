<template>
  <div class="legend">
    <div class="legend-axis">
      <span class="legend-num">{{ minLabel }}</span>
      <span class="legend-num">{{ maxLabel }}</span>
    </div>
    <div class="legend-bar" />
    <div class="legend-label">{{ label }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, default: 'correlation' },
  min:   { type: Number,  default: 0.0 },
  max:   { type: Number,  default: 0.4 },
})

const fmt = (v) => Number.isInteger(v) ? `${v}.0` : v.toFixed(1)
const minLabel = computed(() => fmt(props.min))
const maxLabel = computed(() => fmt(props.max))
</script>

<style scoped>
.legend {
  display: flex;
  flex-direction: column;
  width: 140px;
  font-family: 'Space Mono', 'JetBrains Mono', ui-monospace, monospace;
  color: var(--tribe-smoke, #465a69);
  user-select: none;
  pointer-events: none;
}

.legend-axis {
  display: flex;
  justify-content: space-between;
  font-size: 9.5px;
  letter-spacing: 0.3px;
  margin-bottom: 3px;
  color: var(--tribe-ink, #ffffff);
  opacity: 0.85;
  text-transform: lowercase;
}

.legend-num {
  font-variant-numeric: tabular-nums;
}

.legend-bar {
  height: 6px;
  width: 100%;
  border-radius: 1px;
  background: linear-gradient(
    to right,
    #1a0000 0%,
    #5a1100 22%,
    #d83a00 46%,
    #f9a000 68%,
    #ffd84a 86%,
    #ffffff 100%
  );
  border: 1px solid var(--tribe-hair, rgba(255, 255, 255, 0.08));
}

.legend-label {
  font-size: 9.5px;
  letter-spacing: 0.6px;
  text-align: center;
  margin-top: 4px;
  text-transform: lowercase;
  color: var(--tribe-smoke, #465a69);
}
</style>
