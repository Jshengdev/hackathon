<template>
  <div class="empathy-chat">
    <div class="section-label">§D · ask about the brain trace</div>

    <div class="ethics-banner">
      <span class="ethics-tag">heads up</span>
      Answers are <strong>interpretive reads of the brain trace</strong>,
      not definitive accounts of what the person felt or thought. Brain
      activity is one signal among many — body language, context, and the
      person's own report tell the rest. Treat anything Opus says here as
      a starting hypothesis, not a verdict.
    </div>

    <div v-if="turns.length" class="chat-log">
      <div
        v-for="(t, i) in turns"
        :key="i"
        class="turn"
        :class="`turn-${t.role}`"
      >
        <div class="turn-role">{{ t.role === 'user' ? 'you' : 'opus 4.7' }}</div>
        <div class="turn-content">{{ t.content }}</div>
      </div>
    </div>

    <div v-if="loading" class="loading-dot">opus is thinking…</div>
    <div v-if="error" class="chat-error">{{ error }}</div>

    <form class="chat-input" @submit.prevent="onSubmit">
      <input
        v-model="draft"
        type="text"
        :disabled="loading"
        placeholder="ask anything — e.g. 'what was the worker likely feeling at t=18s?'"
      />
      <button type="submit" :disabled="loading || !draft.trim()">send</button>
    </form>

    <div class="chat-hint">
      Answers are grounded in this clip's brain trace; interpretive claims
      are hedged ("likely," "consistent with") and cite the network +
      timestamp informing them.
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { postEmpathyChat } from '../api/index.js'

const props = defineProps({
  clipId: { type: String, required: true },
})

const turns   = ref([])
const draft   = ref('')
const loading = ref(false)
const error   = ref('')

async function onSubmit() {
  const text = draft.value.trim()
  if (!text || loading.value) return
  draft.value = ''
  error.value = ''
  turns.value.push({ role: 'user', content: text })
  loading.value = true
  try {
    const reply = await postEmpathyChat(props.clipId, turns.value)
    turns.value.push({ role: 'assistant', content: reply })
  } catch (e) {
    error.value = `FAILED — ${e?.message || e}`
    console.error('[empathy-chat]', e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.empathy-chat {
  margin-top: 56px;
  padding-top: 28px;
  border-top: 1px solid var(--oat-border);
  font-family: var(--font-sans), 'DM Sans', system-ui, sans-serif;
}
.section-label {
  font-family: var(--font-mono), 'DM Mono', monospace;
  font-size: 10px; letter-spacing: 1.6px; text-transform: uppercase;
  color: var(--blueberry-800);
  margin-bottom: 16px;
}

.ethics-banner {
  font-family: var(--font-sans), 'DM Sans', system-ui, sans-serif;
  font-size: 12px;
  line-height: 1.55;
  color: #8a5a18;
  background: rgba(245, 161, 66, 0.06);
  border-left: 2px solid #f5a142;
  padding: 12px 14px;
  border-radius: 0 var(--r-standard) var(--r-standard) 0;
  margin-bottom: 22px;
}
.ethics-banner strong {
  color: #8a5a18;
  font-weight: 600;
}
.ethics-tag {
  display: inline-block;
  font-family: var(--font-mono), 'DM Mono', monospace;
  font-size: 9px;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  color: #f5a142;
  background: rgba(245, 161, 66, 0.10);
  padding: 2px 7px;
  border-radius: 3px;
  margin-right: 8px;
  vertical-align: 1px;
}

.chat-log {
  display: flex; flex-direction: column; gap: 16px;
  margin-bottom: 16px;
}
.turn { display: flex; flex-direction: column; gap: 4px; }
.turn-role {
  font-family: var(--font-mono), 'DM Mono', monospace;
  font-size: 9px; letter-spacing: 1.4px; text-transform: uppercase;
  color: var(--warm-silver);
}
.turn-user .turn-role { color: var(--blueberry-800); }
.turn-content {
  font-family: var(--font-sans), 'DM Sans', system-ui, sans-serif;
  font-size: 14px; line-height: 1.6;
  color: var(--warm-charcoal);
  white-space: pre-wrap;
}
.turn-assistant .turn-content { color: var(--clay-black); }

.loading-dot {
  font-family: var(--font-mono), 'DM Mono', monospace;
  font-size: 11px; color: var(--warm-silver);
  letter-spacing: 1.4px; text-transform: uppercase;
  margin-bottom: 12px;
}

.chat-error {
  font-family: var(--font-mono), 'DM Mono', monospace;
  font-size: 11px;
  color: var(--red);
  letter-spacing: 1.2px;
  border: 1px solid var(--red-soft);
  padding: 6px 10px;
  border-radius: var(--r-standard);
  margin-bottom: 12px;
  background: rgba(252, 121, 129, 0.05);
}

.chat-input {
  display: flex; gap: 8px;
  align-items: stretch;
}
.chat-input input {
  flex: 1;
  background: var(--pure-white);
  border: 1px solid var(--oat-border);
  border-radius: var(--r-standard);
  padding: 10px 12px;
  font-family: var(--font-sans), 'DM Sans', system-ui, sans-serif;
  font-size: 13px;
  color: var(--warm-charcoal);
}
.chat-input input::placeholder {
  color: var(--warm-silver);
}
.chat-input input:focus {
  outline: none;
  border-color: var(--blueberry-800);
  box-shadow: 0 0 0 3px rgba(1, 65, 141, 0.10);
}
.chat-input button {
  background: var(--clay-black);
  color: var(--pure-white);
  border: none;
  padding: 10px 20px;
  border-radius: var(--r-pill);
  font-family: var(--font-sans), 'DM Sans', system-ui, sans-serif;
  font-size: 11px;
  letter-spacing: 1.4px; text-transform: uppercase;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
.chat-input button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.chat-input button:hover:not(:disabled) {
  transform: rotateZ(-4deg) translateY(-2px);
  box-shadow: var(--clay-black) -5px 5px;
}

.chat-hint {
  margin-top: 14px;
  font-family: var(--font-mono), 'DM Mono', monospace;
  font-size: 10px; letter-spacing: 1.2px; text-transform: uppercase;
  color: var(--warm-silver);
}
</style>
