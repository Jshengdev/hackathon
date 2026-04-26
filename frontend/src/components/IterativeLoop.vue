<template>
  <div
    class="iterative-loop"
    :class="[`is-${phase}`, settled && 'is-settled', reducedMotion && 'is-reduced-motion']"
    :style="cssVars"
  >
    <div class="loop-grid"></div>
    <div class="loop-vignette"></div>

    <header class="loop-header">
      <span class="loop-eyebrow">
        <span class="brand-dot"></span>
        Iterative refinement
        <span class="loop-eyebrow-meta">K2 + Opus · Clair-de-Lune inverted</span>
      </span>
      <div class="loop-telemetry">
        <span class="loop-telemetry-value">{{ scoreDisplay }}</span>
        <span class="loop-telemetry-label">cosine similarity</span>
        <div class="loop-telemetry-bar">
          <span
            class="loop-telemetry-fill"
            :style="{ transform: `scaleX(${scoreRatio})` }"
          ></span>
        </div>
      </div>
    </header>

    <div class="loop-body">
      <!-- Circular SVG: round-dots arranged on a ring; arc fills as rounds advance.
           "Refines back" arrow at the closure makes the loop nature explicit. -->
      <svg class="loop-ring" viewBox="0 0 320 320" aria-hidden="true">
        <defs>
          <radialGradient id="loop-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" :stop-color="accent" stop-opacity="0.32" />
            <stop offset="60%" :stop-color="accent" stop-opacity="0.06" />
            <stop offset="100%" :stop-color="accent" stop-opacity="0" />
          </radialGradient>
          <linearGradient :id="arcGradId" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" :stop-color="accent" stop-opacity="0.25" />
            <stop offset="100%" :stop-color="accent" stop-opacity="1" />
          </linearGradient>
        </defs>

        <!-- Center glow disk -->
        <circle cx="160" cy="160" r="118" :fill="`url(#loop-core)`" />

        <!-- Faint outer ring (the track) -->
        <circle
          cx="160" cy="160" r="118"
          fill="none"
          stroke="rgba(180, 200, 255, 0.10)"
          stroke-width="1"
        />

        <!-- The progress arc: gradient stroke, dashoffset reveal -->
        <circle
          class="loop-progress-arc"
          cx="160" cy="160" r="118"
          fill="none"
          :stroke="`url(#${arcGradId})`"
          stroke-width="2.5"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="arcDashOffset"
          transform="rotate(-90 160 160)"
        />

        <!-- "Refines back" curved arrow — only visible once we've gone past round 1. -->
        <g class="loop-back-arrow" :class="{ visible: currentIndex >= 1 }">
          <path
            d="M 160 30 A 130 130 0 0 0 90 70"
            fill="none"
            :stroke="accent"
            stroke-width="1.2"
            stroke-dasharray="3 4"
            opacity="0.55"
          />
          <polygon
            points="86,68 96,62 94,76"
            :fill="accent"
            opacity="0.7"
          />
        </g>

        <!-- Round dots arranged on the ring -->
        <g v-for="(stop, i) in ringStops" :key="`dot-${i}`">
          <circle
            :cx="stop.x"
            :cy="stop.y"
            :r="i === currentIndex ? 7 : 4.5"
            :fill="i <= currentIndex ? accent : 'rgba(140, 160, 200, 0.20)'"
            :stroke="i === currentIndex ? accent : 'transparent'"
            stroke-width="2"
            class="loop-round-dot"
            :class="{
              past: i < currentIndex,
              active: i === currentIndex,
              future: i > currentIndex,
            }"
          />
          <text
            :x="stop.labelX"
            :y="stop.labelY"
            class="loop-round-label"
            :class="{ active: i === currentIndex }"
            text-anchor="middle"
          >R{{ i + 1 }}</text>
        </g>
      </svg>

      <div class="loop-center-text">
        <div class="loop-round-counter">
          round <strong>{{ currentRound }}</strong> / {{ trajectory.length }}
        </div>
        <div class="loop-score-trend" :class="{ rising: lastDelta > 0 }">
          <span v-if="currentIndex === 0">first pass…</span>
          <span v-else-if="lastDelta > 0">+{{ lastDelta.toFixed(2) }} from prior</span>
          <span v-else-if="lastDelta < 0">{{ lastDelta.toFixed(2) }} from prior</span>
          <span v-else>plateau</span>
        </div>
      </div>
    </div>

    <!-- Candidate excerpt — fades + swaps per round (greenchain's status.detail pattern) -->
    <div class="loop-excerpt-frame">
      <div class="loop-excerpt-marker"></div>
      <transition name="loop-fade" mode="out-in">
        <p class="loop-excerpt" :key="currentIndex">
          <span class="loop-excerpt-quote">“</span>{{ currentExcerpt }}<span class="loop-excerpt-quote">”</span>
        </p>
      </transition>
    </div>

    <footer class="loop-footer">
      <div class="loop-phase-rail" role="progressbar" :aria-valuenow="currentRound" :aria-valuemin="1" :aria-valuemax="trajectory.length">
        <span
          v-for="(_, i) in trajectory"
          :key="`rail-${i}`"
          class="loop-phase-dot"
          :class="{
            past: i < currentIndex,
            active: i === currentIndex,
          }"
        ></span>
      </div>
      <div class="loop-footer-meta">
        <span v-if="settled" class="loop-footer-state is-settled">converged · final score {{ scoreDisplay }}</span>
        <span v-else class="loop-footer-state">refining · {{ trajectory.length - currentRound }} rounds remaining</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
  trajectory: {
    type: Array,
    default: () => ([
      { round: 1, score: 0.42, paragraphExcerpt: 'Worker walked through the area, observing materials and tools.' },
      { round: 2, score: 0.58, paragraphExcerpt: 'She entered the scaffolding zone and surveyed the workspace.' },
      { round: 3, score: 0.65, paragraphExcerpt: 'She moved through the scaffolding with deliberate pace.' },
      { round: 4, score: 0.71, paragraphExcerpt: 'She moved through the scaffolding, attention drifting between tasks.' },
      { round: 5, score: 0.79, paragraphExcerpt: 'She moved through the scaffolding like someone with split focus.' },
      { round: 6, score: 0.81, paragraphExcerpt: 'She moved through the scaffolding like someone whose mind was already elsewhere.' },
      { round: 7, score: 0.83, paragraphExcerpt: 'She moved through the scaffolding like someone whose attention had already left for the day.' },
      { round: 8, score: 0.84, paragraphExcerpt: 'She moved through the scaffolding like someone whose attention had already left for the day, body still here, mind clocked out.' },
    ]),
  },
  accent:     { type: String, default: '#f5a142' },
  autoplay:   { type: Boolean, default: true },
  roundMs:    { type: Number, default: 1100 },
  // Once the trajectory reaches its last round, settle and stay there.
  // Set true ONLY for marketing demos that need an endless animation.
  loop:       { type: Boolean, default: false },
  pauseAfterMs: { type: Number, default: 1800 }, // only used when loop=true
})

// Emitted once when the playback reaches its final round and settles. Used
// by parent stages to gate "next" affordances until the visual completes.
const emit = defineEmits(['settled'])

const currentIndex = ref(0)
const settled = ref(false)
const reducedMotion = ref(false)
let raf = null
let phaseTimer = null

const phase = computed(() => {
  if (settled.value) return 'settled'
  if (currentIndex.value === 0) return 'priming'
  if (currentIndex.value < props.trajectory.length - 1) return 'refining'
  return 'converging'
})

const currentRound = computed(() => currentIndex.value + 1)
const currentScore = computed(() => props.trajectory[currentIndex.value]?.score ?? 0)
const currentExcerpt = computed(() => props.trajectory[currentIndex.value]?.paragraphExcerpt ?? '')
const scoreRatio = computed(() => Math.max(0, Math.min(1, currentScore.value)))
const scoreDisplay = computed(() => currentScore.value.toFixed(2))
const lastDelta = computed(() => {
  if (currentIndex.value === 0) return 0
  return props.trajectory[currentIndex.value].score - props.trajectory[currentIndex.value - 1].score
})

const cssVars = computed(() => ({
  '--accent': props.accent,
}))

// Stable id for the SVG gradient so multiple loop instances don't collide.
const arcGradId = `loop-arc-${Math.random().toString(36).slice(2, 8)}`

// Pre-compute round-dot positions on a ring of radius 118 around (160,160),
// starting at the top (-90°) and walking clockwise. Add label coords slightly
// outside the ring so they don't overlap the dot.
const ringStops = computed(() => {
  const N = props.trajectory.length
  const cx = 160, cy = 160, r = 118, lr = 138
  return Array.from({ length: N }, (_, i) => {
    const angle = -Math.PI / 2 + (i / N) * Math.PI * 2
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      labelX: cx + lr * Math.cos(angle),
      labelY: cy + lr * Math.sin(angle) + 4,
    }
  })
})

// Arc geometry: full circumference; reveal proportional to (currentIndex+1)/N.
const circumference = 2 * Math.PI * 118
const arcDashOffset = computed(() => {
  const fraction = (currentIndex.value + 1) / props.trajectory.length
  return circumference * (1 - fraction)
})

function advance() {
  if (currentIndex.value < props.trajectory.length - 1) {
    currentIndex.value += 1
    schedule()
  } else {
    settled.value = true
    emit('settled')
    if (props.loop) {
      phaseTimer = setTimeout(() => {
        settled.value = false
        currentIndex.value = 0
        schedule()
      }, props.pauseAfterMs)
    }
  }
}

function schedule() {
  if (!props.autoplay) return
  phaseTimer = setTimeout(advance, props.roundMs)
}

onMounted(() => {
  reducedMotion.value =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reducedMotion.value) {
    // Skip animation entirely; show the converged frame.
    currentIndex.value = props.trajectory.length - 1
    settled.value = true
    emit('settled')
    return
  }

  if (props.autoplay) schedule()
})

onBeforeUnmount(() => {
  if (raf) cancelAnimationFrame(raf)
  if (phaseTimer) clearTimeout(phaseTimer)
})

// If the trajectory is replaced (e.g. switching clips), reset.
watch(
  () => props.trajectory,
  () => {
    if (phaseTimer) clearTimeout(phaseTimer)
    currentIndex.value = 0
    settled.value = false
    if (!reducedMotion.value && props.autoplay) schedule()
  },
)
</script>

<style scoped>
.iterative-loop {
  position: relative;
  background: rgba(10, 10, 25, 0.6);
  border: 1px solid rgba(218, 212, 200, 0.15);
  border-radius: var(--r-card);
  padding: 10px 16px 12px;
  font-family: var(--font-sans, 'DM Sans', system-ui, sans-serif);
  color: var(--oat-border);
  overflow: hidden;
  display: flex; flex-direction: column;
  transition: border-color 0.4s ease, box-shadow 0.4s ease;
}
.iterative-loop.is-settled {
  border-color: var(--accent);
  box-shadow: 0 0 18px color-mix(in srgb, var(--accent) 25%, transparent),
              inset 0 0 14px color-mix(in srgb, var(--accent) 8%, transparent);
}

.loop-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(218, 212, 200, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(218, 212, 200, 0.04) 1px, transparent 1px);
  background-size: 36px 36px;
  mask-image: radial-gradient(circle at center, #000 25%, transparent 75%);
  pointer-events: none;
  opacity: 0.6;
}
.loop-vignette {
  position: absolute; inset: 0;
  background: radial-gradient(circle at 50% 60%,
    color-mix(in srgb, var(--accent) 8%, transparent) 0%,
    transparent 55%);
  pointer-events: none;
}

.loop-header {
  position: relative; z-index: 2;
  display: flex; align-items: center; justify-content: space-between;
  gap: 16px;
  margin-bottom: 2px;
}
.loop-eyebrow {
  display: flex; align-items: center; gap: 8px;
  font-family: var(--font-mono, 'DM Mono', monospace);
  font-size: 11px; letter-spacing: 1.4px;
  text-transform: uppercase; color: var(--oat-border);
}
.loop-eyebrow-meta {
  font-family: var(--font-mono, 'DM Mono', monospace);
  font-size: 10px; letter-spacing: 0.6px;
  text-transform: lowercase;
  color: var(--warm-silver);
  margin-left: 6px;
}
.brand-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 8px var(--accent);
  animation: pulse 1.4s ease-in-out infinite;
}
.iterative-loop.is-settled .brand-dot { animation: none; }
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.loop-telemetry {
  display: flex; align-items: center; gap: 10px;
  font-family: var(--font-mono, 'DM Mono', monospace);
}
.loop-telemetry-value {
  font-size: 16px; font-weight: 500; color: var(--accent);
  letter-spacing: 0.4px;
}
.loop-telemetry-label {
  font-size: 10px; color: var(--warm-silver);
  text-transform: uppercase; letter-spacing: 1.1px;
}
.loop-telemetry-bar {
  width: 80px; height: 3px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 2px; overflow: hidden;
}
.loop-telemetry-fill {
  display: block; height: 100%; width: 100%;
  background: var(--accent);
  transform-origin: left center;
  transition: transform 0.6s ease;
  box-shadow: 0 0 8px var(--accent);
}

.loop-body {
  position: relative; z-index: 2;
  display: flex; align-items: center; justify-content: center;
  margin: 2px 0 4px;
  min-height: 0;
}
/* max-width tuned so the whole component fits ~340px tall in ComparisonStage's
   right pane (between WITHOUT-TRIBE and WITH-TRIBE AnalysisPanels). */
.loop-ring {
  width: 100%; max-width: 220px; height: auto;
  flex-shrink: 1;
}
.loop-progress-arc {
  transition: stroke-dashoffset 0.6s ease;
  filter: drop-shadow(0 0 4px var(--accent));
}
.loop-back-arrow {
  opacity: 0; transition: opacity 0.5s ease;
}
.loop-back-arrow.visible { opacity: 1; }
.loop-round-dot {
  transition: r 0.3s ease, fill 0.3s ease;
}
.loop-round-dot.active {
  filter: drop-shadow(0 0 6px var(--accent));
}
.loop-round-label {
  font-family: var(--font-mono, 'DM Mono', monospace);
  font-size: 9px;
  letter-spacing: 0.6px;
  fill: #9f9b93;
  transition: fill 0.3s ease;
}
.loop-round-label.active { fill: var(--accent); }

.loop-center-text {
  position: absolute;
  text-align: center;
  pointer-events: none;
}
.loop-round-counter {
  font-family: var(--font-mono, 'DM Mono', monospace);
  font-size: 11px; letter-spacing: 1.4px;
  text-transform: uppercase;
  color: var(--oat-border);
}
.loop-round-counter strong {
  color: var(--accent);
  font-weight: 600;
  font-size: 13px;
}
.loop-score-trend {
  margin-top: 4px;
  font-family: var(--font-mono, 'DM Mono', monospace);
  font-size: 10px; color: var(--warm-silver);
  letter-spacing: 0.6px;
}
.loop-score-trend.rising { color: var(--accent); }

.loop-excerpt-frame {
  position: relative; z-index: 2;
  display: flex; align-items: flex-start; gap: 10px;
  border-top: 1px solid rgba(218, 212, 200, 0.10);
  padding-top: 8px;
  min-height: 44px;
}
.loop-excerpt-marker {
  flex-shrink: 0;
  width: 3px; min-height: 36px;
  background: var(--accent);
  border-radius: 2px;
  opacity: 0.6;
  margin-top: 2px;
}
.loop-excerpt {
  margin: 0;
  font-family: var(--font-sans, 'DM Sans', system-ui, sans-serif);
  font-size: 13px; line-height: 1.5;
  color: var(--oat-border);
  font-style: italic;
}
.loop-excerpt-quote {
  color: var(--accent);
  font-weight: 600;
  margin: 0 2px;
}

.loop-fade-enter-active, .loop-fade-leave-active {
  transition: opacity 0.45s ease, transform 0.45s ease;
}
.loop-fade-enter-from { opacity: 0; transform: translateY(4px); }
.loop-fade-leave-to   { opacity: 0; transform: translateY(-4px); }

.loop-footer {
  position: relative; z-index: 2;
  display: flex; align-items: center; justify-content: space-between;
  gap: 14px;
  margin-top: 6px;
}
.loop-phase-rail {
  display: flex; align-items: center; gap: 5px;
}
.loop-phase-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: rgba(218, 212, 200, 0.18);
  transition: background 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
}
.loop-phase-dot.past { background: color-mix(in srgb, var(--accent) 55%, transparent); }
.loop-phase-dot.active {
  background: var(--accent);
  transform: scale(1.4);
  box-shadow: 0 0 6px var(--accent);
}
.loop-footer-meta {
  font-family: var(--font-mono, 'DM Mono', monospace);
  font-size: 10px; letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--warm-silver);
}
.loop-footer-state.is-settled { color: var(--accent); }

.iterative-loop.is-reduced-motion .loop-progress-arc,
.iterative-loop.is-reduced-motion .loop-telemetry-fill {
  transition: none;
}
</style>
