<template>
  <div class="reveal">
    <div class="title">How well does the paragraph capture the brain?</div>
    <div class="subtitle">Iterative scoring — round-by-round, against the swarm's reading.</div>

    <div class="bar-wrap">
      <RoundScoreBar
        :score="currentScore"
        :from-score="prevScore"
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

    <div v-if="error" class="err">{{ error }} <button @click="$emit('reveal-done')">skip →</button></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import RoundScoreBar from '../components/RoundScoreBar.vue'
import { fetchIterativeTrajectory } from '../api/index.js'

const props = defineProps({ clipId: { type: String, required: true } })
defineEmits(['reveal-done'])

const trajectory   = ref([])
const totalRounds  = ref(0)
const currentRound = ref(1)
const currentScore = ref(0)
const prevScore    = ref(0)
const excerpt      = ref('')
const done         = ref(false)
const error        = ref('')
const finalScore   = ref(null)
const hasFinalScore = computed(() => Number.isFinite(finalScore.value))

let timer = null

async function loadAndPlay() {
  try {
    const data = await fetchIterativeTrajectory(props.clipId)
    const rt = data?.round_trajectory || []
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
      excerpt.value = (r.paragraph_excerpt || '').slice(0, 80)
      i += 1
      timer = setTimeout(step, 2000)
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
  background: #050510;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 24px;
  padding: 0 10vw;
  font-family: 'Inter', system-ui, sans-serif;
  color: #d0d8ee;
}
.title {
  font-size: 28px; font-weight: 600;
  color: #f0f4ff; letter-spacing: -0.5px;
}
.subtitle {
  font-size: 13px; color: #6677aa;
  letter-spacing: 1.4px; text-transform: uppercase;
  margin-bottom: 18px;
}
.bar-wrap {
  width: min(60vw, 720px);
}
.excerpt {
  margin-top: 28px;
  font-style: italic;
  font-size: 16px;
  line-height: 1.7;
  color: #aab4cc;
  max-width: 720px;
  text-align: center;
}
.final {
  margin-top: 32px;
  display: flex; flex-direction: column; align-items: center; gap: 14px;
}
.final-score {
  font-family: 'JetBrains Mono', monospace;
  font-size: 20px;
  color: #4ecdc4;
  letter-spacing: 2px;
}
.final-score.failed {
  color: #ff6b6b;
  font-size: 14px;
  letter-spacing: 1.6px;
  border: 1px solid #6a2a2a;
  padding: 6px 14px;
  border-radius: 4px;
}
.next-btn {
  background: rgba(10, 10, 28, 0.92);
  color: #4ecdc4;
  border: 1px solid #2e6a4a;
  padding: 10px 22px;
  border-radius: 5px;
  font-size: 12px; letter-spacing: 1.5px;
  text-transform: uppercase; font-weight: 500;
  cursor: pointer;
  transition: all 0.18s ease;
  font-family: inherit;
}
.next-btn:hover {
  background: rgba(20, 50, 40, 0.92);
  box-shadow: 0 0 18px rgba(78, 205, 196, 0.45);
}
.err {
  color: #ff8866;
  font-size: 12px;
  display: flex; gap: 12px; align-items: center;
}
.err button {
  background: transparent; color: #4ecdc4;
  border: 1px solid #2e6a4a; padding: 6px 14px;
  font-size: 11px; cursor: pointer;
  border-radius: 4px;
  font-family: inherit;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }
</style>
