<template>
  <div class="tabstrip" role="tablist">
    <button
      v-for="opt in options"
      :key="opt.value"
      class="tab"
      :class="{ active: opt.value === modelValue }"
      role="tab"
      :aria-selected="opt.value === modelValue"
      @click="select(opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  options:    { type: Array,  required: true },
  modelValue: { type: String, required: true },
})
const emit = defineEmits(['update:modelValue'])

function select(value) {
  if (value !== props.modelValue) emit('update:modelValue', value)
}
</script>

<style scoped>
.tabstrip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'Space Mono', 'JetBrains Mono', ui-monospace, monospace;
}

.tab {
  appearance: none;
  background: transparent;
  border: 1px solid var(--tribe-hair, rgba(255, 255, 255, 0.08));
  color: var(--tribe-smoke, #465a69);
  padding: 6px 14px;
  font-size: 12px;
  letter-spacing: 0.4px;
  text-transform: lowercase;
  border-radius: 999px;
  cursor: pointer;
  font-family: inherit;
  transition:
    color 150ms ease,
    border-color 150ms ease,
    background 150ms ease;
}

.tab:hover {
  border-color: rgba(255, 255, 255, 0.5);
  color: var(--tribe-ink, #ffffff);
}

.tab.active {
  border-color: var(--tribe-ink, #ffffff);
  color: var(--tribe-ink, #ffffff);
  background: transparent;
}

.tab:focus-visible {
  outline: 1px solid var(--tribe-ink, #ffffff);
  outline-offset: 2px;
}
</style>
