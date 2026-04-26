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
  accentColor: { type: String, default: '#f5a142' },
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
  const color = props.variant === 'with' ? props.accentColor : '#9f9b93'
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
  background: rgba(10, 10, 25, 0.6);
  border: 1px solid rgba(218, 212, 200, 0.15);
  border-radius: var(--r-card);
  padding: 12px 16px;
  display: flex; flex-direction: column;
  overflow: hidden;
  font-family: var(--font-sans, 'DM Sans', system-ui, sans-serif);
  color: var(--oat-border);
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
  background: var(--warm-silver);
  box-shadow: 0 0 8px var(--warm-silver);
  animation: pulse 1.4s ease-in-out infinite;
  flex-shrink: 0;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.badge {
  font-family: var(--font-mono, 'DM Mono', monospace);
  font-size: 10px; font-weight: 600;
  letter-spacing: 1.4px;
  text-transform: lowercase;
  padding: 3px 8px;
  border-radius: var(--r-pill);
}
.badge.without {
  background: rgba(0, 0, 0, 0.3);
  color: var(--warm-silver);
  border: 1px solid rgba(218, 212, 200, 0.15);
}
.badge.with {
  background: rgba(245, 161, 66, 0.12);
  color: var(--activation-hot);
  border: 1px solid rgba(245, 161, 66, 0.4);
  box-shadow: 0 0 6px rgba(245, 161, 66, 0.3);
}

.title {
  font-size: 12px;
  color: var(--oat-border);
  letter-spacing: 0.6px;
}

.round-badge {
  font-family: var(--font-mono, 'DM Mono', monospace);
  font-size: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 2px 6px;
  border: 1px solid;
  border-radius: var(--r-pill);
  background: rgba(0, 0, 0, 0.25);
  flex-shrink: 0;
}

.header-meta {
  margin-left: auto;
  font-family: var(--font-mono, 'DM Mono', monospace);
  font-size: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--warm-silver);
  flex-shrink: 0;
}

.panel-divider {
  border-top: 1px solid rgba(218, 212, 200, 0.10);
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
.panel-body::-webkit-scrollbar-thumb {
  background: rgba(218, 212, 200, 0.20);
  border-radius: 3px;
}

section { margin-bottom: 8px; }
section:last-child { margin-bottom: 0; }

h4 {
  font-family: var(--font-mono, 'DM Mono', monospace);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1.4px;
  color: var(--warm-silver);
  margin-bottom: 4px;
  font-weight: 600;
}

p {
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--oat-border);
}

.empty {
  font-size: 12px;
  color: var(--warm-silver);
  font-style: italic;
}
</style>
