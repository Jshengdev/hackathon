<template>
  <div class="swarm-status">
    <header class="swarm-header">
      <span class="brand-dot"></span>
      <span class="swarm-eyebrow">7-agent K2 swarm</span>
      <span class="swarm-meta">
        {{ doneCount }} / 7
        <span class="swarm-meta-label">specialists ready</span>
      </span>
    </header>

    <div class="swarm-grid">
      <div
        v-for="net in NETWORKS"
        :key="net"
        class="agent-card"
        :class="cardState(net)"
        :style="cardStyle(net)"
      >
        <div class="agent-card-head">
          <span class="agent-dot" :style="{ background: accent(net) }" />
          <span class="agent-name">{{ pretty(net) }}</span>
          <span class="agent-state-tag">{{ stateTagLabel(net) }}</span>
        </div>

        <div v-if="cardState(net) === 'thinking'" class="agent-shimmer">
          <span class="shimmer-bar"></span>
          <span class="shimmer-bar"></span>
          <span class="shimmer-bar short"></span>
        </div>

        <p v-else-if="cardState(net) === 'done'" class="agent-text">
          {{ truncatedReading(net) }}
        </p>

        <p v-else class="agent-idle-text">queued…</p>

        <div v-if="cardState(net) === 'done'" class="agent-footer">
          <span
            class="agent-conf-badge"
            :class="`conf-${confLevel(net)}`"
            :style="{ borderColor: accent(net) }"
          >
            {{ confLevel(net) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { NETWORK_COLORS } from '../utils/colors.js'

const NETWORKS = [
  'visual',
  'somatomotor',
  'dorsal_attention',
  'ventral_attention',
  'limbic',
  'frontoparietal',
  'default_mode',
]

const props = defineProps({
  // dict { network: { state, text, confidence, completed_at } } or null/empty.
  // Networks not in the dict are treated as 'thinking' once polling has started,
  // 'idle' before the first non-empty payload arrives.
  swarmReadings: { type: Object, default: () => ({}) },
  // Whether we've started receiving any progress at all. When false, every
  // card is in 'idle' (no polling response yet).
  active:        { type: Boolean, default: true },
})

const doneCount = computed(() => {
  const r = props.swarmReadings || {}
  return NETWORKS.filter(n => r[n]?.state === 'done').length
})

function cardState(net) {
  const entry = props.swarmReadings?.[net]
  if (entry?.state === 'done') return 'done'
  if (!props.active) return 'idle'
  return 'thinking'
}

function stateTagLabel(net) {
  const s = cardState(net)
  if (s === 'done') return 'done'
  if (s === 'thinking') return '…'
  return 'idle'
}

function pretty(net) {
  return net.replace(/_/g, ' ')
}

function accent(net) {
  return NETWORK_COLORS[net] || '#9f9b93'
}

function cardStyle(net) {
  const a = accent(net)
  const s = cardState(net)
  if (s === 'done') {
    return {
      borderColor: a,
      boxShadow: `0 0 14px ${a}33, inset 0 0 8px ${a}10`,
    }
  }
  if (s === 'thinking') {
    return { borderColor: a, '--accent': a }
  }
  return {}
}

function truncatedReading(net) {
  const t = props.swarmReadings?.[net]?.text || ''
  // Two short lines worth — keep the grid scannable.
  if (t.length <= 140) return t
  return t.slice(0, 137).trim() + '…'
}

function confLevel(net) {
  const raw = (props.swarmReadings?.[net]?.confidence || '').toLowerCase()
  if (raw.includes('high')) return 'high'
  if (raw.includes('low')) return 'low'
  return 'medium'
}
</script>

<style scoped>
.swarm-status {
  background: rgba(10, 10, 25, 0.6);
  border: 1px solid rgba(218, 212, 200, 0.15);
  border-radius: var(--r-card);
  padding: 10px 14px 12px;
  font-family: var(--font-sans, 'DM Sans', system-ui, sans-serif);
  color: var(--oat-border);
  display: flex; flex-direction: column;
  gap: 10px;
}

.swarm-header {
  display: flex; align-items: center; gap: 10px;
}
.brand-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--activation-hot);
  box-shadow: 0 0 8px var(--activation-hot);
  animation: brand-pulse 1.4s ease-in-out infinite;
}
@keyframes brand-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.swarm-eyebrow {
  font-family: var(--font-mono, 'DM Mono', monospace);
  font-size: 11px;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: var(--oat-border);
  font-weight: 600;
}
.swarm-meta {
  margin-left: auto;
  font-family: var(--font-mono, 'DM Mono', monospace);
  font-size: 11px;
  color: var(--activation-hot);
  letter-spacing: 0.8px;
  display: flex; align-items: center; gap: 6px;
}
.swarm-meta-label {
  color: var(--warm-silver);
  font-size: 9.5px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.swarm-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}
/* Last row of 3 looks balanced; auto-fit handles narrow widths. */
@media (max-width: 720px) {
  .swarm-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

.agent-card {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(218, 212, 200, 0.12);
  border-radius: var(--r-standard);
  padding: 8px 10px;
  min-height: 78px;
  display: flex; flex-direction: column; gap: 4px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;
}
.agent-card.idle {
  opacity: 0.55;
}
.agent-card.thinking {
  animation: card-pulse 1.6s ease-in-out infinite;
}
@keyframes card-pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 var(--accent, rgba(218, 212, 200, 0.4));
  }
  50% {
    box-shadow: 0 0 12px 0 var(--accent, rgba(218, 212, 200, 0.6));
  }
}

.agent-card-head {
  display: flex; align-items: center; gap: 6px;
}
.agent-dot {
  width: 6px; height: 6px; border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 6px currentColor;
}
.agent-name {
  font-family: var(--font-mono, 'DM Mono', monospace);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--pure-white);
  font-weight: 500;
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.agent-state-tag {
  font-family: var(--font-mono, 'DM Mono', monospace);
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--warm-silver);
  flex-shrink: 0;
}
.agent-card.done .agent-state-tag { color: var(--activation-hot); }

.agent-text {
  margin: 0;
  font-family: var(--font-sans, 'DM Sans', system-ui, sans-serif);
  font-size: 11.5px;
  line-height: 1.35;
  color: var(--oat-border);
  /* clamp to 3 lines so all 7 cards stay roughly equal height */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.agent-idle-text {
  margin: 0;
  font-size: 10.5px;
  font-style: italic;
  color: var(--warm-silver);
}

.agent-shimmer {
  display: flex; flex-direction: column; gap: 4px;
  padding: 2px 0;
}
.shimmer-bar {
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(
    90deg,
    rgba(218, 212, 200, 0.06) 0%,
    rgba(218, 212, 200, 0.22) 50%,
    rgba(218, 212, 200, 0.06) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s linear infinite;
}
.shimmer-bar.short { width: 60%; }
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.agent-footer {
  margin-top: auto;
  display: flex; align-items: center; gap: 6px;
}
.agent-conf-badge {
  font-family: var(--font-mono, 'DM Mono', monospace);
  font-size: 9px;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 1px 5px;
  border: 1px solid;
  border-radius: var(--r-pill);
  background: rgba(0, 0, 0, 0.25);
}
.conf-high   { color: var(--activation-hot); }
.conf-medium { color: var(--blueberry-300); }
.conf-low    { color: var(--warm-silver); }
</style>
