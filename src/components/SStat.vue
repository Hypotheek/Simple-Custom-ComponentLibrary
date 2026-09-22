<template>
  <div class="s-stat">
    <span class="s-stat__label">{{ label }}</span>
    <span class="s-stat__value">{{ value }}</span>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: ''
  },
  value: {
    type: [String, Number],
    default: ''
  }
})
</script>

<style scoped>
.s-stat {
  display: flex;
  flex-direction: column;
  gap: 0.25em;
}
.s-stat__label {
  font-size: 0.85em;
  color: #6b7280;
}
.s-stat__value {
  font-size: 1.6em;
  font-weight: 700;
  color: #111827;
}
</style>
