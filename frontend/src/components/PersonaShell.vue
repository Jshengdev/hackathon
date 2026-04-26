<template>
  <div class="persona-shell" :class="`persona-${persona}`">
    <slot />
  </div>
</template>

<script setup>
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
  height: 100vh;
  overflow-y: auto;
  background: #050510;
  color: #d0d8ee;
}
.persona-workplace {
  --accent:      #5b6b8a;
  --accent-soft: #2a3a52;
  --serif:       'Crimson Pro', Georgia, serif;
}
.persona-consumer {
  --accent:      #bb8fce;
  --accent-soft: #4a3458;
  --serif:       'Crimson Pro', Georgia, serif;
}
.persona-pavilion {
  --accent:      #4ecdc4;
  --accent-soft: #1a4a48;
  --serif:       'Inter', system-ui, sans-serif;
}
</style>
