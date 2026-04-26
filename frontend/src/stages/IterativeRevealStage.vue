<template>
  <div class="reveal">
    <div class="title">How well does the paragraph capture the brain?</div>
    <div class="subtitle">Iterative scoring — round-by-round, against the swarm's reading.</div>

    <div class="bar-wrap">
      <RoundScoreBar
        :score="progressValue"
        :from-score="prevProgressValue"
        :display-value="currentScore"
        :duration="1500"
        :height="14"
        :label="`round ${currentRound} / ${totalRounds || '?'}`"
      />
    </div>

    <transition name="fade">
      <div v-if="excerpt" :key="currentRound" class="excerpt">
        “{{ excerpt }}…”
      </div>
    </transition>

    <div v-if="done" class="final">
      <div v-if="hasFinalScore" class="final-score">final · {{ finalScore.toFixed(2) }}</div>
      <div v-else class="final-score failed">final · FAILED — score missing</div>
      <button class="next-btn" @click="$emit('reveal-done')">view full document →</button>
    </div>

    <div v-if="error" class="err">{{ error }} <button class="skip-btn" @click="$emit('reveal-done')">skip →</button></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import RoundScoreBar from '../components/RoundScoreBar.vue'
import { fetchIterativeTrajectory } from '../api/index.js'
import { filterRealRounds } from '../utils/trajectory.js'

const props = defineProps({ clipId: { type: String, required: true } })
defineEmits(['reveal-done'])

const trajectory       = ref([])
const totalRounds      = ref(0)
const currentRound     = ref(1)
const currentScore     = ref(0)
const prevScore        = ref(0)
// Bar fill is driven by ROUND PROGRESS (i/N), not score — so round 1/2
// fills the bar to 50%, round 2/2 to 100%. The score is still surfaced
// via the bar's right-side readout via :display-value.
const progressValue    = ref(0)
const prevProgressValue = ref(0)
const excerpt          = ref('')
const done             = ref(false)
const error            = ref('')
const finalScore       = ref(null)
const hasFinalScore    = computed(() => Number.isFinite(finalScore.value))

let timer = null

async function loadAndPlay() {
  try {
    const data = await fetchIterativeTrajectory(props.clipId)
    const rt = filterRealRounds(data?.round_trajectory)
    if (!rt.length) {
      error.value = 'no trajectory available'
      return
    }
    trajectory.value = rt
    totalRounds.value = rt.length
    finalScore.value = data?.final_score
    if (!Number.isFinite(finalScore.value)) {
      console.error('[iterative-reveal] final_score missing or non-finite', {
        clip_id: props.clipId,
        received: data?.final_score,
      })
    }

    let i = 0
    const step = () => {
      if (i >= rt.length) {
        done.value = true
        return
      }
      const r = rt[i]
      prevScore.value = currentScore.value
      currentScore.value = r.score ?? 0
      currentRound.value = r.round ?? (i + 1)
      prevProgressValue.value = progressValue.value
      progressValue.value = (i + 1) / rt.length
      excerpt.value = (r.paragraph_excerpt || '').slice(0, 80)
      i += 1
      // 10s between rounds — gives the audience time to read each candidate
      // excerpt and watch the bar advance discretely.
      timer = setTimeout(step, 10000)
    }
    step()
  } catch (e) {
    console.error(e)
    error.value = 'preview unavailable'
  }
}

onMounted(loadAndPlay)
onBeforeUnmount(() => { if (timer) clearTimeout(timer) })
</script>

<style scoped>
.reveal {
  width: 100vw; height: 100vh;
  background: var(--warm-cream);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 24px;
  padding: 0 10vw;
  font-family: var(--font-sans), 'DM Sans', system-ui, sans-serif;
  color: var(--warm-charcoal);
  overflow: hidden;
}
.title {
  font-family: var(--font-display), 'Roboto', system-ui, sans-serif;
  font-size: 28px; font-weight: 600;
  color: var(--clay-black); letter-spacing: -0.02em;
}
.subtitle {
  font-family: var(--font-mono), 'DM Mono', monospace;
  font-size: 13px; color: var(--warm-silver);
  letter-spacing: 1.4px; text-transform: uppercase;
  margin-bottom: 18px;
}
.bar-wrap {
  width: min(60vw, 720px);
}
.excerpt {
  margin-top: 28px;
  font-family: var(--font-display), 'Roboto', system-ui, sans-serif;
  font-style: italic;
  font-size: 16px;
  line-height: 1.7;
  color: var(--warm-charcoal);
  max-width: 720px;
  text-align: center;
}
.final {
  margin-top: 32px;
  display: flex; flex-direction: column; align-items: center; gap: 14px;
}
.final-score {
  font-family: var(--font-mono), 'DM Mono', monospace;
  font-size: 20px;
  color: var(--blueberry-800);
  letter-spacing: 2px;
}
.final-score.failed {
  color: var(--red);
  font-size: 14px;
  letter-spacing: 1.6px;
  border: 1px solid var(--red-soft);
  padding: 6px 14px;
  border-radius: var(--r-standard);
}
.next-btn {
  background: var(--clay-black);
  color: var(--pure-white);
  border: none;
  padding: 12px 28px;
  border-radius: var(--r-pill);
  font-family: var(--font-sans), 'DM Sans', system-ui, sans-serif;
  font-size: 12px; letter-spacing: 1.5px;
  text-transform: uppercase; font-weight: 500;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
.next-btn:hover {
  transform: rotateZ(-4deg) translateY(-2px);
  box-shadow: var(--clay-black) -7px 7px;
}
.err {
  font-family: var(--font-mono), 'DM Mono', monospace;
  color: var(--red);
  font-size: 12px;
  display: flex; gap: 12px; align-items: center;
}
.skip-btn {
  background: var(--clay-black);
  color: var(--pure-white);
  border: none;
  padding: 8px 16px;
  border-radius: var(--r-pill);
  font-family: var(--font-sans), 'DM Sans', system-ui, sans-serif;
  font-size: 11px; letter-spacing: 1.2px; text-transform: uppercase;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
.skip-btn:hover {
  transform: rotateZ(-4deg) translateY(-2px);
  box-shadow: var(--clay-black) -5px 5px;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }
</style>
