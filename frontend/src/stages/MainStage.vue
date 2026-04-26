<template>
  <div class="main-stage">
    <!-- LEFT: 3D brain -->
    <div class="brain-pane">
      <BrainScene
        :clip-id="clipId"
        :activity-data="activityData"
        :current-time="currentTime"
        :is-playing="isPlaying"
        :swarm-readings="swarmReadingsRef"
        layout="left-half"
        :show-hud="true"
        :interactive="true"
        @region-clicked="onRegionClicked"
      />

      <!-- Hint overlay (top-right of brain pane) -->
      <div class="brain-hint">
        click any of the 7 regions to ask K2
      </div>
    </div>

    <!-- RIGHT column: video on top, panels below -->
    <div class="right-pane">
      <div class="video-pane">
        <video
          v-if="props.videoUrl"
          v-show="!videoMissing"
          ref="videoEl"
          :src="videoSrc"
          class="video"
          playsinline
          @timeupdate="onTimeUpdate"
          @play="isPlaying = true"
          @pause="isPlaying = false"
          @loadedmetadata="onMeta"
          @seeking="onSeeking"
          @seeked="onSeeked"
          @ended="onEnded"
          @error="onVideoError"
        />

        <!-- Placeholder when the clip has no .mp4 (e.g. brain-only clips) -->
        <div v-if="videoMissing" class="video-missing">
          <div class="vm-title">no video for this clip</div>
          <div class="vm-sub">brain activity continues to play below.</div>
        </div>

        <!-- Play/pause overlay -->
        <button
          class="play-overlay"
          v-if="!hasStarted && !videoMissing"
          @click="togglePlay"
        >
          <span class="play-icon">▶</span>
          <span class="play-label">Play clip</span>
        </button>

        <!-- Bottom video bar (controls + scrubber) — only when we have a video -->
        <div class="video-bar" v-if="!videoMissing">
          <button class="vb-btn" @click="togglePlay">
            {{ isPlaying ? '❚❚' : '▶' }}
          </button>
          <div class="vb-time">{{ fmtTime(currentTime) }} / {{ fmtTime(duration) }}</div>
          <div class="scrubber" @click="onScrub">
            <div class="scrubber-fill" :style="{ width: scrubPct }" />
          </div>
          <span v-if="stimulus" class="stimulus-tag">“{{ stimulus }}”</span>
        </div>
      </div>

      <!-- Iterative loop + analysis panel — per-region detail lives in
           the click-to-popup, so the always-on swarm rail is dropped to
           give these two more room. -->
      <div class="panels-rail">
        <div class="panels-rail-row">
          <IterativeLoop
            v-if="trajectoryRounds.length > 0"
            class="iter-loop"
            :trajectory="trajectoryRounds"
            :accent="iterativeAccent"
            :round-ms="900"
            :loop="false"
          />
          <div v-else class="panel-loading">iterative loop loading…</div>

          <AnalysisPanel
            v-if="empathyData"
            class="analysis-panel"
            variant="with"
            :data="analysisPanelData"
            :accent-color="iterativeAccent"
            :loop-meta="loopMeta"
          />
          <div v-else class="panel-loading">empathy loading…</div>
        </div>
      </div>
    </div>

    <!-- Next button -->
    <button class="next-btn" @click="$emit('next')">
      Next →
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
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import BrainScene from '../components/BrainScene.vue'
import RegionPopup from '../components/RegionPopup.vue'
import IterativeLoop from '../components/IterativeLoop.vue'
import AnalysisPanel from '../components/AnalysisPanel.vue'
import {
  videoUrl,
  postK2Region,
  fetchIterativeTrajectory,
  fetchEmpathyDocument,
} from '../api/index.js'
import { NETWORK_COLORS } from '../utils/colors.js'
import { useSwarmProgress } from '../composables/useSwarmProgress.js'

const props = defineProps({
  clipId:       { type: String, required: true },
  activityData: { type: Object, required: true },
  videoUrl:     { type: String, default: null },
})

defineEmits(['next'])

const videoEl = ref(null)
const currentTime = ref(0)
const duration    = ref(0)
const isPlaying   = ref(false)
const hasStarted  = ref(false)
const videoMissing = ref(!props.videoUrl)

const videoSrc = computed(() => props.videoUrl || videoUrl(props.clipId))

// ── Swarm + iterative + empathy data ───────────────────────────────────────
const {
  swarmReadings: swarmReadingsRef,
  active: swarmActiveRef,
  start: startSwarmPolling,
  stop: stopSwarmPolling,
} = useSwarmProgress(500)
const iterativeTrajectory = ref(null)  // { round_trajectory, final_score, ... }
const empathyData = ref(null)          // EmpathyDocument

const iterativeAccent = '#82e0aa'

const MAX_ROUNDS = 3
const trajectoryRounds = computed(() => {
  const rt = iterativeTrajectory.value?.round_trajectory || []
  return rt.slice(0, MAX_ROUNDS).map((r, i) => ({
    round: r.round ?? i + 1,
    score: typeof r.score === 'number' ? r.score : (r.cosine ?? 0),
    paragraphExcerpt:
      r.paragraph_excerpt
      || r.paragraphExcerpt
      || r.paragraph
      || r.excerpt
      || '',
  }))
})

const loopMeta = computed(() => {
  const rt = trajectoryRounds.value
  return {
    rounds: rt.length || 0,
    finalScore:
      iterativeTrajectory.value?.final_score
      ?? (rt.length ? rt[rt.length - 1].score : 0),
  }
})

// AnalysisPanel takes a flat dict; map EmpathyDocument fields onto its slots,
// preferring the polished synthesis_document paragraph when present.
const analysisPanelData = computed(() => {
  const e = empathyData.value
  if (!e) return {}
  const synth = e.synthesis_document || {}
  const polished = synth.synthesis_paragraph || e.polished_paragraph || ''
  const summary = polished || e.best_paragraph || ''
  const fals = e.falsification || {}
  const verdict = fals.verdict || ''
  const delta = typeof fals.delta === 'number' ? fals.delta.toFixed(3) : null
  const neuralBits = []
  // synthesis_document.neural_evidence is a list of {network, evidence} dicts.
  if (Array.isArray(synth.neural_evidence) && synth.neural_evidence.length) {
    for (const ev of synth.neural_evidence) {
      if (ev?.evidence) {
        neuralBits.push(`${(ev.network || '').replace(/_/g, ' ')}: ${ev.evidence}`)
      }
    }
  }
  if (verdict) neuralBits.push(`falsification: ${verdict}`)
  if (delta != null) neuralBits.push(`Δ=${delta}`)
  const inflection = synth.inflection_moment
    ? (typeof synth.inflection_moment === 'string'
        ? synth.inflection_moment
        : synth.inflection_moment.description || '')
    : ''
  return {
    summary,
    emotional_assessment: synth.temporal_arc || '',
    cognitive_processes: inflection,
    neural_signatures: neuralBits.join(' · '),
  }
})

const stimulus = computed(() => {
  const data = props.activityData
  if (!data?.frames?.length) return ''
  const fps = data.fps || 1
  const idx = Math.floor(currentTime.value * fps)
  const safe = ((idx % data.frames.length) + data.frames.length) % data.frames.length
  // Walk back to last stimulus
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
  if (!v || videoMissing.value) return
  if (v.paused) {
    v.play().catch(err => console.warn('video play blocked:', err))
    hasStarted.value = true
  } else {
    v.pause()
  }
}

function onVideoError() {
  videoMissing.value = true
  isPlaying.value = false
  hasStarted.value = true
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
// Seeking events fire both on programmatic + scrubber jumps. Updating
// currentTime synchronously snaps the brain to the seeked time even before
// the video resumes — required so a pause-scrub-resume sequence keeps the
// brain frame-accurate.
function onSeeking() {
  currentTime.value = videoEl.value?.currentTime || 0
}
function onSeeked() {
  currentTime.value = videoEl.value?.currentTime || 0
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

// Keep currentTime ticking forward when video is playing without timeupdate
// firing fast enough for smooth swarm motion. RAF reads videoEl.currentTime
// directly each frame.
let rafId = null
function tick() {
  if (videoEl.value && !videoEl.value.paused) {
    currentTime.value = videoEl.value.currentTime
  }
  rafId = requestAnimationFrame(tick)
}

async function loadIterativeAndEmpathy() {
  const cid = props.clipId
  if (!cid) return
  // Fetch in parallel; both are cached server-side after warmup.
  const [iterRes, empathyRes] = await Promise.allSettled([
    fetchIterativeTrajectory(cid),
    fetchEmpathyDocument(cid),
  ])
  if (iterRes.status === 'fulfilled') {
    iterativeTrajectory.value = iterRes.value
  } else {
    console.warn('iterative-trajectory load failed:', iterRes.reason)
  }
  if (empathyRes.status === 'fulfilled') {
    empathyData.value = empathyRes.value
  } else {
    console.warn('empathy load failed:', empathyRes.reason)
  }
}

onMounted(() => {
  tick()
  startSwarmPolling(props.clipId)
  loadIterativeAndEmpathy()
})

watch(() => props.clipId, (id) => {
  iterativeTrajectory.value = null
  empathyData.value = null
  videoMissing.value = !props.videoUrl
  hasStarted.value = false
  stopSwarmPolling()
  startSwarmPolling(id)
  loadIterativeAndEmpathy()
})

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
  stopSwarmPolling()
})
</script>

<style scoped>
.main-stage {
  position: relative;
  width: 100vw; height: 100vh;
  background: #050510;
  display: flex;
  font-family: 'Inter', system-ui, sans-serif;
  color: #d0d8ee;
  overflow: hidden;
}

.brain-pane {
  flex: 1;
  position: relative;
  border-right: 1px solid #1a1a2a;
}

.brain-hint {
  position: absolute;
  top: 16px; right: 16px;
  font-size: 10.5px;
  color: #6677aa;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  background: rgba(10, 10, 25, 0.65);
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid #1f2a4a;
  pointer-events: none;
  z-index: 5;
}

.right-pane {
  flex: 1;
  display: flex; flex-direction: column;
  min-width: 0;
  min-height: 0;
}

.video-pane {
  position: relative;
  background: #000;
  display: flex; align-items: center; justify-content: center;
  flex: 0 0 45%;
  min-height: 0;
}

.panels-rail {
  flex: 1 1 55%;
  display: flex; flex-direction: column;
  gap: 8px;
  padding: 12px 14px 56px;
  background: #050510;
  border-top: 1px solid #1a1a2a;
  overflow-y: auto;
  min-height: 0;
}
.panels-rail-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 8px;
  flex: 1;
  min-height: 0;
}
.iter-loop, .analysis-panel {
  min-width: 0;
  min-height: 0;
}
.panel-loading {
  background: rgba(10, 10, 25, 0.6);
  border: 1px dashed #2a3a6a;
  border-radius: 6px;
  padding: 14px 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #6677aa;
  letter-spacing: 1px;
  text-transform: uppercase;
  display: flex; align-items: center; justify-content: center;
}
@media (max-width: 1100px) {
  .panels-rail-row { grid-template-columns: 1fr; }
}

.video {
  width: 100%; height: 100%;
  object-fit: contain;
  background: #000;
}

.video-missing {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 8px;
  background: #050510;
  color: #6677aa;
  font-family: 'JetBrains Mono', monospace;
  text-align: center;
  padding: 0 24px;
}
.vm-title {
  font-size: 12px;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  color: #aab4cc;
}
.vm-sub {
  font-size: 11px;
  letter-spacing: 0.6px;
  color: #557;
}

.play-overlay {
  position: absolute; inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 12px;
  border: none; cursor: pointer;
  color: #f0f4ff;
  font-family: inherit;
}
.play-overlay:hover .play-icon {
  transform: scale(1.06);
  border-color: #4ecdc4;
  color: #4ecdc4;
}
.play-icon {
  width: 64px; height: 64px;
  border: 1.5px solid #f0f4ff;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px;
  padding-left: 5px;
  transition: all 0.18s ease;
}
.play-label {
  font-size: 12px; letter-spacing: 2px;
  text-transform: uppercase;
  color: #aab4cc;
}

.video-bar {
  position: absolute; bottom: 0; left: 0; right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.85), transparent);
  padding: 14px 18px 12px;
  display: flex; align-items: center; gap: 12px;
}
.vb-btn {
  background: transparent;
  color: #f0f4ff;
  border: 1px solid #2a3a6a;
  width: 32px; height: 32px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}
.vb-btn:hover { border-color: #4ecdc4; color: #4ecdc4; }
.vb-time {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #aab4cc;
  min-width: 80px;
}
.scrubber {
  flex: 1;
  height: 3px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  cursor: pointer;
  position: relative;
}
.scrubber-fill {
  position: absolute; top: 0; left: 0; height: 100%;
  background: #4ecdc4;
  border-radius: 2px;
  box-shadow: 0 0 8px rgba(78, 205, 196, 0.6);
  transition: width 0.1s linear;
}
.stimulus-tag {
  font-size: 11px;
  font-style: italic;
  color: #f7dc6f;
  max-width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.next-btn {
  position: fixed;
  bottom: 20px; right: 20px;
  background: rgba(10, 10, 28, 0.92);
  color: #4ecdc4;
  border: 1px solid #2e6a4a;
  padding: 10px 22px;
  border-radius: 5px;
  font-size: 12px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.18s ease;
  box-shadow: 0 0 12px rgba(78, 205, 196, 0.18);
  z-index: 50;
}
.next-btn:hover {
  background: rgba(20, 50, 40, 0.92);
  box-shadow: 0 0 18px rgba(78, 205, 196, 0.45);
  transform: translateY(-1px);
}
</style>
