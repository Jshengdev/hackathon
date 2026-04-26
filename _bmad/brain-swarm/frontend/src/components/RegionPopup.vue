<template>
  <transition name="fade">
    <div v-if="visible" class="popup-overlay" @click.self="$emit('close')">
      <div class="popup-card" :style="{ borderColor: accentColor, boxShadow: `0 0 24px ${accentColor}55` }">
        <button class="close-btn" @click="$emit('close')" aria-label="close">×</button>

        <div class="popup-header">
          <span class="net-dot" :style="{ background: accentColor }" />
          <span class="net-name" :style="{ color: accentColor }">
            {{ (network || '').replace(/_/g, ' ') }}
          </span>
          <span v-if="t != null" class="t-stamp">t = {{ t }}s</span>
        </div>

        <div v-if="loading" class="popup-loading">
          <div class="spinner" :style="{ borderTopColor: accentColor }" />
          <span>Calling K2 specialist…</span>
        </div>

        <div v-else>
          <div class="narration" v-if="text">{{ text }}</div>
          <div class="narration empty" v-else>No narration available.</div>

          <div v-if="confidence" class="confidence">
            <em>{{ confidence }}</em>
          </div>

          <div v-if="cite" class="cite">
            <em>{{ cite }}</em>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
const props = defineProps({
  visible:    { type: Boolean, default: false },
  loading:    { type: Boolean, default: false },
  network:    { type: String,  default: '' },
  text:       { type: String,  default: '' },
  confidence: { type: String,  default: '' },
  cite:       { type: String,  default: '' },
  t:          { type: Number,  default: null },
  accentColor:{ type: String,  default: '#aaaaaa' },
})

defineEmits(['close'])
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
  background: rgba(10, 10, 28, 0.96);
  border: 1px solid #2a3a6a;
  border-radius: 8px;
  padding: 24px 28px 22px;
  min-width: 420px;
  max-width: 540px;
  color: #d0d8ee;
  font-family: 'Inter', system-ui, sans-serif;
}

.close-btn {
  position: absolute; top: 8px; right: 12px;
  background: transparent; border: none; color: #667;
  font-size: 22px; cursor: pointer; line-height: 1;
}
.close-btn:hover { color: #ddd; }

.popup-header {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 16px;
}
.net-dot {
  width: 10px; height: 10px; border-radius: 50%;
  box-shadow: 0 0 8px currentColor;
}
.net-name {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 1.6px;
  font-weight: 600;
}
.t-stamp {
  margin-left: auto;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; color: #556688;
}

.narration {
  font-size: 15px; line-height: 1.55;
  color: #e8ecf8;
}
.narration.empty { color: #667; font-style: italic; }

.confidence {
  margin-top: 14px;
  font-size: 12px;
  color: #aab4cc;
}
.cite {
  margin-top: 6px;
  font-size: 11px;
  color: #6677aa;
  letter-spacing: 0.3px;
}

.popup-loading {
  display: flex; align-items: center; gap: 12px;
  font-size: 13px; color: #aab4cc;
  padding: 8px 0 4px;
}
.spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.1);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
