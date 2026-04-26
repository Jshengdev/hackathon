<template>
  <div class="persona-shell" :class="`persona-${persona}`">
    <slot />
  </div>
</template>

<script setup>
// `persona` prop is kept for backward-compat with callers (EmpathyDocumentStage
// passes either 'workplace' or 'consumer') but the styling no longer branches
// on it. amy is a single brand: one cream theme with blueberry accent.
defineProps({
  persona: {
    type: String,
    default: 'pavilion',
    validator: v => ['workplace', 'consumer', 'pavilion'].includes(v),
  },
})
</script>

<style scoped>
.persona-shell {
  min-height: 100vh;
  background: var(--warm-cream);
  color: var(--warm-charcoal);
  font-family: var(--font-sans), 'DM Sans', system-ui, sans-serif;
  /* Single Amy theme — children inherit blueberry accent + display-font serif */
  --accent: var(--blueberry-800);
  --accent-soft: var(--blueberry-300);
  --serif: var(--font-display), 'Roboto', system-ui, sans-serif;
}
/* Persona variants are intentionally no-ops — kept as empty rule blocks so the
   class hooks still exist for future per-mode tweaks if we ever bring them back. */
.persona-workplace,
.persona-consumer,
.persona-pavilion {
  /* no-op — single Amy theme */
}
</style>
