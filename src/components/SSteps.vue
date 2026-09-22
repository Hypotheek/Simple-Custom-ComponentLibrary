<template>
  <div class="s-steps">
    <div v-for="(step, i) in steps" :key="step" class="s-steps__item">
      <div class="s-steps__circle" :class="{ 's-steps__circle--active': i <= modelValue }">{{ i + 1 }}</div>
      <span class="s-steps__label">{{ step }}</span>
      <div v-if="i < steps.length - 1" class="s-steps__line" :class="{ 's-steps__line--active': i < modelValue }" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  steps: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: Number,
    default: 0
  }
})
</script>

<style scoped>
.s-steps {
  display: flex;
  align-items: center;
}
.s-steps__item {
  display: flex;
  align-items: center;
  flex: 1;
}
.s-steps__circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e5e7eb;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85em;
  flex-shrink: 0;
}
.s-steps__circle--active {
  background: #3b82f6;
  color: white;
}
.s-steps__label {
  margin: 0 0.75em;
  white-space: nowrap;
  font-size: 0.9em;
}
.s-steps__line {
  flex: 1;
  height: 2px;
  background: #e5e7eb;
}
.s-steps__line--active {
  background: #3b82f6;
}
</style>
