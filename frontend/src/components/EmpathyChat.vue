<template>
  <div class="empathy-chat">
    <div class="section-label">§D · ask about the brain trace</div>

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
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}
.section-label {
  font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 16px;
}

.chat-log {
  display: flex; flex-direction: column; gap: 16px;
  margin-bottom: 16px;
}
.turn { display: flex; flex-direction: column; gap: 4px; }
.turn-role {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; letter-spacing: 1.4px; text-transform: uppercase;
  color: #6677aa;
}
.turn-user .turn-role { color: var(--accent); }
.turn-content {
  font-size: 14px; line-height: 1.6;
  color: #d0d8ee;
  white-space: pre-wrap;
}
.turn-assistant .turn-content { color: #e8ecf8; }

.loading-dot {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; color: #6677aa;
  letter-spacing: 1.4px; text-transform: uppercase;
  margin-bottom: 12px;
}

.chat-error {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #ff6b6b;
  letter-spacing: 1.2px;
  border: 1px solid #6a2a2a;
  padding: 6px 10px;
  border-radius: 4px;
  margin-bottom: 12px;
}

.chat-input {
  display: flex; gap: 8px;
  align-items: stretch;
}
.chat-input input {
  flex: 1;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: 4px;
  padding: 10px 12px;
  font-family: inherit;
  font-size: 13px;
  color: #d0d8ee;
}
.chat-input input::placeholder {
  color: #556688;
}
.chat-input input:focus {
  outline: none;
  border-color: var(--accent);
}
.chat-input button {
  background: rgba(10, 10, 28, 0.92);
  color: var(--accent);
  border: 1px solid var(--accent-soft);
  padding: 10px 18px;
  border-radius: 4px;
  font-family: inherit;
  font-size: 11px;
  letter-spacing: 1.4px; text-transform: uppercase;
  cursor: pointer;
  transition: background 0.18s ease, box-shadow 0.18s ease;
}
.chat-input button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.chat-input button:hover:not(:disabled) {
  background: rgba(20, 50, 40, 0.92);
  box-shadow: 0 0 14px var(--accent-soft);
}

.chat-hint {
  margin-top: 14px;
  font-size: 10px; letter-spacing: 1.2px; text-transform: uppercase;
  color: #556688;
}
</style>
