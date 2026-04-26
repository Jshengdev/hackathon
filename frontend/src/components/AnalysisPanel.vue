<template>
  <div
    class="panel"
    :class="{ 'with-tribe': variant === 'with' }"
    :style="variant === 'with' ? glowStyle : {}"
  >
    <div class="panel-header">
      <span class="brand-dot" :style="brandDotStyle" />
      <span class="badge" :class="variant">
        {{ variant === 'without' ? 'without' : 'with' }} tribe v2
      </span>
      <span class="title">{{ title }}</span>
      <span
        v-if="variant === 'with'"
        class="round-badge"
        :style="{ color: accentColor, borderColor: accentColor }"
      >
        {{ loopMeta.rounds }} rounds · {{ loopMeta.finalScore.toFixed(2) }} cosine
      </span>
      <span class="header-meta">{{ metaTag }}</span>
    </div>

    <div class="panel-divider"></div>

    <div class="panel-body">
      <section v-if="data?.summary">
        <h4>summary</h4>
        <p>{{ data.summary }}</p>
      </section>

      <section v-if="data?.emotional_assessment">
        <h4>emotional assessment</h4>
        <p>{{ data.emotional_assessment }}</p>
      </section>

      <section v-if="data?.cognitive_processes">
        <h4>cognitive processes</h4>
        <p>{{ data.cognitive_processes }}</p>
      </section>

      <section v-if="variant === 'with' && data?.neural_signatures">
        <h4 :style="{ color: accentColor }">neural signatures</h4>
        <p>{{ data.neural_signatures }}</p>
      </section>

      <div v-if="!hasContent" class="empty">no data available.</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant:     { type: String, default: 'without' },
  data:        { type: Object, default: () => ({}) },
  accentColor: { type: String, default: '#82e0aa' },
  loopMeta:    {
    type: Object,
    default: () => ({ rounds: 8, finalScore: 0.84 }),
  },
})

const title = computed(() =>
  props.variant === 'without' ? 'vision-only analysis' : 'tribe-augmented analysis',
)

const metaTag = computed(() =>
  props.variant === 'without' ? 'vision-only · qwen3-vl' : 'tribe-augmented · 8 rounds',
)

const glowStyle = computed(() => ({
  borderColor: 'rgba(255, 255, 255, 0.18)',
  boxShadow: `inset 0 0 22px ${props.accentColor}10`,
}))

const brandDotStyle = computed(() => {
  const color = props.variant === 'with' ? props.accentColor : '#465a69'
  return {
    background: color,
    boxShadow: `0 0 6px ${color}`,
  }
})

const hasContent = computed(() => {
  const d = props.data || {}
  return !!(d.summary || d.emotional_assessment || d.cognitive_processes || d.neural_signatures)
})
</script>

<style scoped>
.panel {
  height: 100%;
  background: #0d0d0d;
  border: 1px solid var(--tribe-hair, rgba(255, 255, 255, 0.08));
  border-radius: 4px;
  padding: 14px 18px;
  display: flex; flex-direction: column;
  overflow: hidden;
  font-family: 'Inter', system-ui, sans-serif;
  color: #e8e8e8;
  transition: box-shadow 0.4s ease, border-color 0.4s ease;
}

.panel-header {
  display: flex; align-items: center; gap: 10px;
  padding-bottom: 10px;
  flex-shrink: 0;
}

.brand-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--tribe-smoke, #465a69);
  animation: pulse 1.6s ease-in-out infinite;
  flex-shrink: 0;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.45; }
}

.badge {
  font-family: 'Space Mono', 'JetBrains Mono', ui-monospace, monospace;
  font-size: 10px; font-weight: 500;
  letter-spacing: 0.6px;
  text-transform: lowercase;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid var(--tribe-hair, rgba(255, 255, 255, 0.08));
  color: var(--tribe-smoke, #465a69);
  background: transparent;
}
.badge.with {
  border-color: rgba(255, 255, 255, 0.4);
  color: var(--tribe-ink, #ffffff);
}

.title {
  font-family: 'Space Mono', 'JetBrains Mono', ui-monospace, monospace;
  font-size: 11px;
  letter-spacing: 0.4px;
  color: var(--tribe-smoke, #465a69);
  text-transform: lowercase;
}

.round-badge {
  font-family: 'Space Mono', 'JetBrains Mono', ui-monospace, monospace;
  font-size: 10px;
  letter-spacing: 0.4px;
  text-transform: lowercase;
  padding: 2px 8px;
  border: 1px solid;
  border-radius: 999px;
  background: transparent;
  flex-shrink: 0;
}

.header-meta {
  margin-left: auto;
  font-family: 'Space Mono', 'JetBrains Mono', ui-monospace, monospace;
  font-size: 10px;
  letter-spacing: 0.5px;
  text-transform: lowercase;
  color: var(--tribe-smoke, #465a69);
  flex-shrink: 0;
}

.panel-divider {
  border-top: 1px solid var(--tribe-hair, rgba(255, 255, 255, 0.08));
  margin-bottom: 12px;
  flex-shrink: 0;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
  min-height: 0;
}
.panel-body::-webkit-scrollbar { width: 4px; }
.panel-body::-webkit-scrollbar-thumb {
  background: var(--tribe-hair, rgba(255, 255, 255, 0.08));
  border-radius: 2px;
}

section {
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--tribe-hair, rgba(255, 255, 255, 0.08));
}
section:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

h4 {
  font-family: 'Space Mono', 'JetBrains Mono', ui-monospace, monospace;
  font-size: 10px;
  text-transform: lowercase;
  letter-spacing: 0.6px;
  color: var(--tribe-smoke, #465a69);
  margin: 0 0 6px 0;
  font-weight: 500;
}

p {
  font-size: 13px;
  line-height: 1.55;
  color: #e8e8e8;
  margin: 0;
  font-weight: 400;
}

.empty {
  font-size: 11px;
  color: var(--tribe-smoke, #465a69);
  font-style: italic;
  text-transform: lowercase;
}
</style>
