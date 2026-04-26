<template>
  <div class="main-stage">
    <!-- LEFT: 3D brain -->
    <div class="brain-pane">
      <BrainScene
        :activity-data="activityData"
        :current-time="currentTime"
        :is-playing="isPlaying"
        layout="left-half"
        :show-hud="true"
        :interactive="true"
        @region-clicked="onRegionClicked"
      />

      <!-- Hint overlay (top-left of brain pane — kicker style) -->
      <div class="brain-hint">
        click any of the 7 regions to ask k2
      </div>

      <!-- Correlation legend (top-right of brain pane) -->
      <div class="legend-anchor">
        <Legend label="correlation" :min="0.0" :max="0.4" />
      </div>

      <!-- View tabs (bottom-center of brain pane) -->
      <div class="tabstrip-anchor">
        <TabStrip
          v-model="brainView"
          :options="viewOptions"
        />
      </div>
    </div>

    <!-- RIGHT: video -->
    <div class="video-pane">
      <video
        ref="videoEl"
        :src="videoSrc"
        class="video"
        playsinline
        @timeupdate="onTimeUpdate"
        @play="isPlaying = true"
        @pause="isPlaying = false"
        @loadedmetadata="onMeta"
        @ended="onEnded"
      />

      <!-- Play/pause overlay -->
      <button class="play-overlay" v-if="!hasStarted" @click="togglePlay">
        <span class="play-icon">▶</span>
        <span class="play-label">play clip</span>
      </button>

      <!-- Stimulus tag (bottom-left, italic smoke) -->
      <span v-if="stimulus" class="stimulus-tag">"{{ stimulus }}"</span>

      <!-- Bottom video bar (controls + scrubber) -->
      <div class="video-bar">
        <button class="vb-btn" :class="{ playing: isPlaying }" @click="togglePlay" :aria-label="isPlaying ? 'pause' : 'play'">
          <span v-if="isPlaying" class="vb-pause">
            <span /><span />
          </span>
          <span v-else class="vb-play" />
        </button>
        <div class="vb-time">{{ fmtTime(currentTime) }} / {{ fmtTime(duration) }}</div>
        <div class="scrubber" @click="onScrub">
          <div class="scrubber-fill" :style="{ width: scrubPct }" />
        </div>
      </div>
    </div>

    <!-- Next button -->
    <button class="next-btn" @click="$emit('next')">
      next →
    </button>

    <!-- K2 region popup -->
    <RegionPopup
      :visible="popup.visible"
      :loading="popup.loading"
      :network="popup.network"
      :text="popup.text"
      :confidence="popup.confidence"
      :cite="popup.cite"
      :t="popup.t"
      :accent-color="popup.accent"
      @close="popup.visible = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import BrainScene from '../components/BrainScene.vue'
import RegionPopup from '../components/RegionPopup.vue'
import Legend from '../components/Legend.vue'
import TabStrip from '../components/TabStrip.vue'
import { videoUrl, postK2Region } from '../api/index.js'
import { NETWORK_COLORS } from '../utils/colors.js'

const props = defineProps({
  clipId:       { type: String, required: true },
  activityData: { type: Object, required: true },
})

defineEmits(['next'])

const videoEl = ref(null)
const currentTime = ref(0)
const duration    = ref(0)
const isPlaying   = ref(false)
const hasStarted  = ref(false)

const videoSrc = computed(() => videoUrl(props.clipId))

const viewOptions = [
  { value: 'normal',   label: 'Normal' },
  { value: 'inflated', label: 'Inflated' },
  { value: 'open',     label: 'Open' },
  { value: 'close',    label: 'Close' },
]
const brainView = ref('normal')

const stimulus = computed(() => {
  const data = props.activityData
  if (!data?.frames?.length) return ''
  const fps = data.fps || 1
  const idx = Math.floor(currentTime.value * fps)
  const safe = ((idx % data.frames.length) + data.frames.length) % data.frames.length
  for (let i = safe; i >= 0; i--) {
    if (data.frames[i]?.stimulus) return data.frames[i].stimulus
  }
  return ''
})

const scrubPct = computed(() => {
  if (!duration.value) return '0%'
  return `${(currentTime.value / duration.value) * 100}%`
})

// ── Popup state ────────────────────────────────────────────────────────────
const popup = ref({
  visible: false, loading: false,
  network: '', text: '', confidence: '', cite: '',
  t: 0, accent: '#aaaaaa',
})

async function onRegionClicked(network) {
  const t = Math.floor(currentTime.value)
  popup.value = {
    visible: true,
    loading: true,
    network,
    text: '', confidence: '', cite: '',
    t,
    accent: NETWORK_COLORS[network] || '#aaaaaa',
  }
  try {
    const res = await postK2Region({ clipId: props.clipId, network, t })
    popup.value = {
      ...popup.value,
      loading: false,
      text: res.text || res.narration || res.message || '',
      confidence: res.confidence || '',
      cite: res.cite || res.citation || '',
    }
  } catch (e) {
    console.error('k2-region failed', e)
    popup.value = {
      ...popup.value,
      loading: false,
      text: 'Could not reach K2 — try again in a moment.',
    }
  }
}

// ── Video controls ─────────────────────────────────────────────────────────
function togglePlay() {
  const v = videoEl.value
  if (!v) return
  if (v.paused) {
    v.play().catch(err => console.warn('video play blocked:', err))
    hasStarted.value = true
  } else {
    v.pause()
  }
}

function onTimeUpdate() {
  currentTime.value = videoEl.value?.currentTime || 0
}
function onMeta() {
  duration.value = videoEl.value?.duration || 0
}
function onEnded() {
  isPlaying.value = false
}
function onScrub(ev) {
  const v = videoEl.value
  if (!v || !duration.value) return
  const rect = ev.currentTarget.getBoundingClientRect()
  const pct = (ev.clientX - rect.left) / rect.width
  v.currentTime = Math.max(0, Math.min(duration.value, pct * duration.value))
}

function fmtTime(s) {
  if (!Number.isFinite(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60).toString().padStart(2, '0')
  return `${m}:${sec}`
}

let rafId = null
function tick() {
  if (videoEl.value && !videoEl.value.paused) {
    currentTime.value = videoEl.value.currentTime
  }
  rafId = requestAnimationFrame(tick)
}
onMounted(() => { tick() })
onBeforeUnmount(() => { if (rafId) cancelAnimationFrame(rafId) })
</script>

<style scoped>
.main-stage {
  position: relative;
  width: 100vw; height: 100vh;
  background: var(--tribe-bg, #000000);
  display: flex;
  font-family: 'Inter', system-ui, sans-serif;
  color: var(--tribe-ink, #ffffff);
  overflow: hidden;
}

.brain-pane {
  flex: 1;
  position: relative;
  background: var(--tribe-bg, #000000);
  border-right: 1px solid var(--tribe-hair, rgba(255, 255, 255, 0.08));
}

/* Kicker — top-left of brain pane */
.brain-hint {
  position: absolute;
  top: 16px; left: 18px;
  font-family: 'Space Mono', 'JetBrains Mono', ui-monospace, monospace;
  font-size: 10.5px;
  letter-spacing: 0.6px;
  text-transform: lowercase;
  color: var(--tribe-smoke, #465a69);
  pointer-events: none;
  z-index: 5;
}

.legend-anchor {
  position: absolute;
  top: 16px; right: 16px;
  z-index: 5;
}

.tabstrip-anchor {
  position: absolute;
  bottom: 22px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
}

.video-pane {
  flex: 1;
  position: relative;
  background: #000;
  display: flex; align-items: center; justify-content: center;
}

.video {
  width: 100%; height: 100%;
  object-fit: contain;
  background: #000;
}

.play-overlay {
  position: absolute; inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 14px;
  border: none; cursor: pointer;
  color: var(--tribe-ink, #ffffff);
  font-family: inherit;
}
.play-overlay:hover .play-icon {
  background: var(--tribe-ink, #ffffff);
  color: #000;
}
.play-icon {
  width: 56px; height: 56px;
  border: 1px solid var(--tribe-ink, #ffffff);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px;
  padding-left: 4px;
  transition: background 150ms ease, color 150ms ease;
}
.play-label {
  font-family: 'Space Mono', 'JetBrains Mono', ui-monospace, monospace;
  font-size: 11px; letter-spacing: 1px;
  text-transform: lowercase;
  color: var(--tribe-smoke, #465a69);
}

.video-bar {
  position: absolute; bottom: 0; left: 0; right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.92), transparent);
  padding: 18px 22px 16px;
  display: flex; align-items: center; gap: 14px;
}

/* TRIBE-style 28px round white-outline play button */
.vb-btn {
  position: relative;
  appearance: none;
  background: transparent;
  border: 1px solid var(--tribe-ink, #ffffff);
  width: 28px; height: 28px;
  border-radius: 50%;
  cursor: pointer;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 150ms ease;
}
.vb-btn:hover { background: rgba(255, 255, 255, 0.08); }

.vb-play {
  width: 0; height: 0;
  border-left: 7px solid var(--tribe-ink, #ffffff);
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  margin-left: 2px;
}
.vb-pause {
  display: inline-flex;
  gap: 3px;
}
.vb-pause span {
  width: 2px; height: 9px;
  background: var(--tribe-ink, #ffffff);
}

.vb-time {
  font-family: 'Space Mono', 'JetBrains Mono', ui-monospace, monospace;
  font-size: 11px;
  color: var(--tribe-smoke, #465a69);
  min-width: 80px;
  letter-spacing: 0.4px;
  font-variant-numeric: tabular-nums;
}

/* 1px hairline scrubber */
.scrubber {
  flex: 1;
  height: 1px;
  background: var(--tribe-hair, rgba(255, 255, 255, 0.08));
  cursor: pointer;
  position: relative;
}
.scrubber:hover { height: 2px; }
.scrubber-fill {
  position: absolute; top: 0; left: 0; height: 100%;
  background: linear-gradient(90deg, #d83a00 0%, #f9a000 60%, #ffd84a 100%);
  transition: width 0.08s linear;
}

/* Stimulus tag — italic smoke, bottom-left of video pane, above the video bar */
.stimulus-tag {
  position: absolute;
  left: 22px;
  bottom: 70px;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 11px;
  font-style: italic;
  color: var(--tribe-smoke, #465a69);
  max-width: 60%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
  text-transform: lowercase;
}

/* TRIBE-pill next button */
.next-btn {
  position: fixed;
  bottom: 22px; right: 22px;
  background: transparent;
  color: var(--tribe-ink, #ffffff);
  border: 1px solid var(--tribe-ink, #ffffff);
  padding: 8px 22px;
  border-radius: 999px;
  font-family: 'Space Mono', 'JetBrains Mono', ui-monospace, monospace;
  font-size: 12px;
  letter-spacing: 0.4px;
  text-transform: lowercase;
  cursor: pointer;
  transition: background 150ms ease, color 150ms ease;
  z-index: 50;
}
.next-btn:hover {
  background: var(--tribe-ink, #ffffff);
  color: #000;
}
</style>
