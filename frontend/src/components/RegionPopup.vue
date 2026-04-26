<template>
  <transition name="fade">
    <div v-if="visible" class="popup-overlay" @click.self="$emit('close')">
      <div
        class="popup-card"
        :style="cssVars"
      >
        <button class="close-btn" @click="$emit('close')" aria-label="close">×</button>

        <!-- 1. Top eyebrow: pulsing dot + lowercase mono network name + K2 Think tag -->
        <div class="popup-eyebrow">
          <span class="brand-dot"></span>
          <span class="net-name">{{ networkLabel }}</span>
          <span class="eyebrow-meta">K2 Think</span>
        </div>

        <!-- 2. Telemetry pill: confidence label + scaleX bar -->
        <div class="popup-telemetry">
          <span class="telemetry-label">{{ confidenceLabel }}</span>
          <div class="telemetry-bar">
            <span
              class="telemetry-fill"
              :style="{ transform: `scaleX(${confidenceRatio})` }"
            ></span>
          </div>
        </div>

        <div v-if="loading" class="popup-loading">
          <div class="spinner" :style="{ borderTopColor: accentColor }" />
          <span>Calling K2 specialist…</span>
        </div>

        <div v-else>
          <!-- 3. Main reading body with left accent bar -->
          <div class="reading-frame">
            <div class="reading-marker"></div>
            <p class="reading-body" v-if="text">{{ text }}</p>
            <p class="reading-body empty" v-else>No narration available.</p>
          </div>

          <!-- 4. Dashed-pulse divider -->
          <div class="dashed-divider"></div>

          <!-- 5. Cite line + runtime metadata -->
          <div class="popup-footer">
            <span class="footer-cite">cite · {{ cite || 'unattributed' }}</span>
            <span class="footer-runtime">{{ runtimeLabel }}</span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  visible:    { type: Boolean, default: false },
  loading:    { type: Boolean, default: false },
  network:    { type: String,  default: '' },
  text:       { type: String,  default: '' },
  confidence: { type: String,  default: '' },
  cite:       { type: String,  default: '' },
  t:          { type: Number,  default: null },
  // Real K2 call latency in seconds. Null = unknown → footer shows just `t=Ns`.
  runtimeSec: { type: Number,  default: null },
  accentColor:{ type: String,  default: '#9f9b93' },
})

defineEmits(['close'])

// CSS custom properties so scoped styles can pick up the network accent.
const cssVars = computed(() => ({
  '--accent': props.accentColor,
  borderColor: props.accentColor,
  boxShadow: `0 0 24px ${props.accentColor}55`,
}))

// Normalize the network identifier into a lowercased, space-separated label
// (e.g. `default_mode` -> `default mode`). Empty strings degrade to a stub.
const networkLabel = computed(() => {
  const n = (props.network || '').replace(/_/g, ' ').trim().toLowerCase()
  return n || 'unknown network'
})

// Map K2 confidence string to a label + ratio. Unknown / null / empty values
// fall back to a neutral mid-rail (0.5) and the literal label "confidence".
const confidenceMap = {
  high:   { label: 'high confidence',   ratio: 1.0 },
  medium: { label: 'medium confidence', ratio: 0.66 },
  low:    { label: 'low confidence',    ratio: 0.33 },
}
const confidenceKey = computed(() => (props.confidence || '').toString().trim().toLowerCase())
const confidenceLabel = computed(() => confidenceMap[confidenceKey.value]?.label ?? 'confidence')
const confidenceRatio = computed(() => confidenceMap[confidenceKey.value]?.ratio ?? 0.5)

// Footer runtime: shows `t={t}s · {runtime}s`. Both legs degrade gracefully.
const runtimeLabel = computed(() => {
  const tPart = props.t != null ? `t=${props.t}s` : 't=—'
  const rPart = props.runtimeSec != null ? `${props.runtimeSec}s` : ''
  return rPart ? `${tPart} · ${rPart}` : tPart
})
</script>

<style scoped>
.popup-overlay {
  position: fixed; inset: 0;
  background: rgba(5, 5, 18, 0.55);
  display: flex; align-items: center; justify-content: center;
  z-index: 100;
  backdrop-filter: blur(2px);
}

.popup-card {
  position: relative;
  background: rgba(10, 10, 28, 0.92);
  border: 1px solid rgba(218, 212, 200, 0.15);
  border-radius: var(--r-card);
  padding: 20px 24px 16px;
  min-width: 420px;
  max-width: 540px;
  color: var(--oat-border);
  font-family: var(--font-sans, 'DM Sans', system-ui, sans-serif);
  backdrop-filter: blur(8px);
}

.close-btn {
  position: absolute; top: 8px; right: 12px;
  background: transparent; border: none;
  color: var(--warm-silver);
  font-size: 22px; cursor: pointer; line-height: 1;
  transition: color 0.18s ease;
}
.close-btn:hover { color: var(--pure-white); }

/* 1. Eyebrow ------------------------------------------------------------ */
.popup-eyebrow {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 8px;
}
.brand-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 8px var(--accent);
  animation: pulse 1.4s ease-in-out infinite;
  flex-shrink: 0;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.4; }
}
.net-name {
  font-family: var(--font-mono, 'DM Mono', monospace);
  font-size: 11px;
  letter-spacing: 1.4px;
  text-transform: lowercase;
  color: var(--pure-white);
  font-weight: 500;
}
.eyebrow-meta {
  margin-left: auto;
  font-family: var(--font-mono, 'DM Mono', monospace);
  font-size: 10px;
  letter-spacing: 1.1px;
  text-transform: uppercase;
  color: var(--warm-silver);
}

/* 2. Telemetry pill ----------------------------------------------------- */
.popup-telemetry {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 16px;
  font-family: var(--font-mono, 'DM Mono', monospace);
}
.telemetry-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1.1px;
  color: var(--warm-silver);
  padding: 2px 8px;
  border-radius: var(--r-pill);
  border: 1px solid rgba(218, 212, 200, 0.15);
}
.telemetry-bar {
  width: 72px; height: 3px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 2px; overflow: hidden;
}
.telemetry-fill {
  display: block; height: 100%; width: 100%;
  background: var(--accent);
  transform-origin: left center;
  transition: transform 0.6s ease;
  box-shadow: 0 0 8px var(--accent);
}

/* 3. Reading body with accent marker ----------------------------------- */
.reading-frame {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 4px 0;
}
.reading-marker {
  flex-shrink: 0;
  width: 3px;
  align-self: stretch;
  min-height: 32px;
  background: var(--accent);
  opacity: 0.6;
  border-radius: 2px;
}
.reading-body {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--oat-border);
  font-family: var(--font-sans, 'DM Sans', system-ui, sans-serif);
}
.reading-body.empty {
  color: var(--warm-silver);
  font-style: italic;
}

/* 4. Dashed-pulse divider ---------------------------------------------- */
.dashed-divider {
  border-top: 1px solid rgba(218, 212, 200, 0.10);
  margin: 12px 0 8px;
}

/* 5. Footer cite + runtime --------------------------------------------- */
.popup-footer {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px;
  font-family: var(--font-mono, 'DM Mono', monospace);
  font-size: 10px;
  letter-spacing: 0.6px;
  text-transform: lowercase;
  color: var(--warm-silver);
}
.footer-cite {
  flex: 1; min-width: 0;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  font-style: italic;
}
.footer-runtime {
  flex-shrink: 0;
  color: var(--warm-silver);
}

/* Loading state -------------------------------------------------------- */
.popup-loading {
  display: flex; align-items: center; gap: 12px;
  font-size: 13px; color: var(--oat-border);
  padding: 8px 0 4px;
}
.spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.1);
  border-top-color: var(--pure-white);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
