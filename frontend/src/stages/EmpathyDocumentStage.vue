<template>
  <PersonaShell :persona="personaMode">
    <div class="doc">
      <div v-if="loading" class="loading">loading empathy document…</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <template v-else>
        <header class="hdr">
          <div class="kicker">empathy layer · {{ scenarioLabel || scenario }}</div>
          <div class="clip">{{ clipId }}</div>
        </header>

        <!-- §A Vision Report -->
        <section class="vision">
          <div class="section-label">§A · vision report</div>
          <p class="scene">{{ vision?.scene_summary || '(no scene summary)' }}</p>
          <ul v-if="actions.length" class="actions">
            <li v-for="(a, i) in actions" :key="i">{{ a }}</li>
          </ul>
        </section>

        <!-- §B Empathy Paragraph -->
        <section class="empathy">
          <div class="section-label">§B · empathy layer</div>
          <p class="paragraph">{{ empathyParagraph }}</p>
          <div class="similarity">
            brain-pattern similarity ·
            <span class="num">{{ (finalScore ?? 0).toFixed(2) }}</span>
          </div>
        </section>

        <!-- §C Falsification -->
        <section class="falsif">
          <div class="section-label">§C · falsification evidence</div>
          <div class="verdict" :class="verdictClass">
            {{ verdictLine }}
          </div>
          <details class="attrib" v-if="attributionRows.length">
            <summary>per-region attribution</summary>
            <table>
              <thead>
                <tr>
                  <th>network</th>
                  <th>match</th>
                  <th>target</th>
                  <th>justification</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in attributionRows" :key="row.network">
                  <td class="net">{{ row.network }}</td>
                  <td class="num">{{ (row.candidate_match ?? 0).toFixed(2) }}</td>
                  <td class="num">{{ (row.target ?? 0).toFixed(2) }}</td>
                  <td>{{ row.justification }}</td>
                </tr>
              </tbody>
            </table>
          </details>
          <details class="trajectory" v-if="trajectory.length">
            <summary>round-by-round trajectory</summary>
            <ol>
              <li v-for="r in trajectory" :key="r.round">
                round {{ r.round }} · score {{ (r.score ?? 0).toFixed(2) }} —
                <em>{{ (r.paragraph_excerpt || '').slice(0, 80) }}…</em>
              </li>
            </ol>
          </details>
        </section>

        <!-- §D Opus chat — viewer Q&A grounded in this clip's brain trace -->
        <EmpathyChat :clip-id="clipId" />
      </template>
    </div>
  </PersonaShell>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import PersonaShell from '../components/PersonaShell.vue'
import EmpathyChat from '../components/EmpathyChat.vue'
import { fetchEmpathyDocument } from '../api/index.js'
import { filterRealRounds } from '../utils/trajectory.js'

const props = defineProps({
  clipId:        { type: String, required: true },
  scenario:      { type: String, default: 'consumer' },
  scenarioLabel: { type: String, default: '' },
})

const loading = ref(true)
const error   = ref('')
const empathy = ref(null)

const personaMode = computed(() =>
  props.scenario === 'ironside' ? 'workplace' : 'consumer'
)

const vision = computed(() => empathy.value?.vision_report || null)
const actions = computed(() => vision.value?.actions || [])
const empathyParagraph = computed(() =>
  empathy.value?.polished_paragraph || empathy.value?.best_paragraph || '(empathy paragraph not yet generated)'
)
const finalScore = computed(() => empathy.value?.final_score)

const trajectory = computed(() => filterRealRounds(empathy.value?.round_trajectory))
const attributionRows = computed(() => {
  const a = empathy.value?.per_region_attribution || {}
  return Object.entries(a).map(([network, v]) => ({ network, ...v }))
})

const verdictLine = computed(() => {
  const f = empathy.value?.falsification
  if (!f) return 'falsification: pending'
  return `delta = ${(f.delta ?? 0).toFixed(2)} (main ${(f.main_score ?? 0).toFixed(2)} − control ${(f.control_score ?? 0).toFixed(2)}) · verdict: ${f.verdict}`
})
const verdictClass = computed(() =>
  empathy.value?.falsification?.verdict === 'anchored' ? 'anchored' : 'generic'
)

onMounted(async () => {
  try {
    empathy.value = await fetchEmpathyDocument(props.clipId)
  } catch (e) {
    console.error(e)
    error.value = 'could not load empathy document'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.doc {
  max-width: 880px;
  margin: 0 auto;
  padding: 64px 32px 96px;
  font-family: 'Inter', system-ui, sans-serif;
  color: #d0d8ee;
}
.loading, .error {
  color: #6677aa;
  text-align: center;
  margin-top: 40vh;
  font-size: 13px;
  letter-spacing: 1.6px;
  text-transform: uppercase;
}
.error { color: #ff8866; }

.hdr { margin-bottom: 36px; }
.kicker {
  color: var(--accent);
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
}
.clip {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px; color: #6677aa;
  margin-top: 4px;
}

.section-label {
  font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 12px;
}

.vision .scene {
  font-size: 14px; line-height: 1.6; color: #aab4cc;
}
.actions {
  margin-top: 12px; padding-left: 18px;
  font-size: 13px; color: #99a3bb;
  columns: 2; column-gap: 32px;
}
.actions li { margin-bottom: 4px; break-inside: avoid; }

.empathy {
  margin: 56px 0;
  padding: 32px 40px;
  border-left: 2px solid var(--accent);
  background: linear-gradient(180deg, rgba(255,255,255,0.02), transparent);
}
.paragraph {
  font-family: var(--serif);
  font-size: 1.4rem;
  line-height: 1.7;
  color: #f0f4ff;
  max-width: 70ch;
  margin: 0;
}
.similarity {
  margin-top: 28px;
  font-size: 11px;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  color: #6677aa;
}
.similarity .num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 24px;
  color: var(--accent);
  margin-left: 8px;
  letter-spacing: 0;
}

.falsif { margin-top: 44px; }
.verdict {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  padding: 12px 16px;
  border-radius: 4px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
}
.verdict.anchored { color: #82e0aa; border-color: #2e6a4a; }
.verdict.generic  { color: #f7c97a; border-color: #6a4a1a; }

.attrib, .trajectory {
  margin-top: 16px;
  font-size: 12px;
}
.attrib summary, .trajectory summary {
  cursor: pointer;
  color: #99a3bb;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  font-size: 10px;
  padding: 6px 0;
}
.attrib table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
  font-family: 'JetBrains Mono', monospace;
}
.attrib th, .attrib td {
  padding: 6px 8px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  text-align: left;
}
.attrib th { color: #6677aa; font-weight: 500; font-size: 10px; }
.attrib .net { color: var(--accent); }
.attrib .num { text-align: right; }
.trajectory ol { margin: 8px 0 0 18px; color: #aab4cc; }
.trajectory em { color: #99a3bb; }
</style>
