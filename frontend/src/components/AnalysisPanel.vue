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
        <h4>Summary</h4>
        <p>{{ data.summary }}</p>
      </section>

      <section v-if="data?.emotional_assessment">
        <h4>Emotional assessment</h4>
        <p>{{ data.emotional_assessment }}</p>
      </section>

      <section v-if="data?.cognitive_processes">
        <h4>Cognitive processes</h4>
        <p>{{ data.cognitive_processes }}</p>
      </section>

      <section v-if="variant === 'with' && data?.neural_signatures">
        <h4 :style="{ color: accentColor }">Neural signatures</h4>
        <p>{{ data.neural_signatures }}</p>
      </section>

      <div v-if="!hasContent" class="empty">No data available.</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant:     { type: String, default: 'without' },  // 'without' | 'with'
  data:        { type: Object, default: () => ({}) },
  accentColor: { type: String, default: '#82e0aa' },
  loopMeta:    {
    type: Object,
    default: () => ({ rounds: 8, finalScore: 0.84 }),
  },
})

const title = computed(() =>
  props.variant === 'without' ? 'Vision-only analysis' : 'TRIBE-augmented analysis',
)

const metaTag = computed(() =>
  props.variant === 'without' ? 'vision-only · qwen3-vl' : 'tribe-augmented · 8 rounds',
)

const glowStyle = computed(() => ({
  borderColor: props.accentColor,
  boxShadow: `0 0 18px ${props.accentColor}33, inset 0 0 14px ${props.accentColor}14`,
}))

const brandDotStyle = computed(() => {
  const color = props.variant === 'with' ? props.accentColor : '#6677aa'
  return {
    background: color,
    boxShadow: `0 0 8px ${color}`,
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
  background: rgba(10, 10, 25, 0.92);
  border: 1px solid #2a3a6a;
  border-radius: 6px;
  padding: 12px 16px;
  display: flex; flex-direction: column;
  overflow: hidden;
  font-family: 'Inter', system-ui, sans-serif;
  color: #d0d8ee;
  transition: box-shadow 0.4s ease, border-color 0.4s ease;
}
.panel.with-tribe {
  border-width: 1.5px;
}

.panel-header {
  display: flex; align-items: center; gap: 8px;
  padding-bottom: 8px;
  flex-shrink: 0;
}

.brand-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #6677aa;
  box-shadow: 0 0 8px #6677aa;
  animation: pulse 1.4s ease-in-out infinite;
  flex-shrink: 0;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; font-weight: 600;
  letter-spacing: 1.4px;
  text-transform: lowercase;
  padding: 3px 8px;
  border-radius: 3px;
}
.badge.without {
  background: #2a2a3a; color: #99a3bb;
  border: 1px solid #3a3a55;
}
.badge.with {
  background: #1a3a2a; color: #82e0aa;
  border: 1px solid #2e6a4a;
  box-shadow: 0 0 6px rgba(130, 224, 170, 0.4);
}

.title {
  font-size: 12px;
  color: #a0aac0;
  letter-spacing: 0.6px;
}

.round-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 2px 6px;
  border: 1px solid;
  border-radius: 3px;
  background: rgba(130, 224, 170, 0.06);
  flex-shrink: 0;
}

.header-meta {
  margin-left: auto;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #6677aa;
  flex-shrink: 0;
}

.panel-divider {
  border-top: 1px dashed rgba(180, 200, 255, 0.18);
  margin-bottom: 8px;
  flex-shrink: 0;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
  min-height: 0;
}
.panel-body::-webkit-scrollbar { width: 6px; }
.panel-body::-webkit-scrollbar-thumb { background: #2a3a6a; border-radius: 3px; }

section { margin-bottom: 8px; }
section:last-child { margin-bottom: 0; }

h4 {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1.4px;
  color: #6677aa;
  margin-bottom: 4px;
  font-weight: 600;
}

p {
  font-size: 12.5px;
  line-height: 1.5;
  color: #d0d8ee;
}

.empty {
  font-size: 12px; color: #557; font-style: italic;
}
</style>
