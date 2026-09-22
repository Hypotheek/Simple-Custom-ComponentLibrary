<template>
  <div class="s-progress">
    <div class="s-progress__bar" :style="{ width: `${Math.min(100, Math.max(0, value))}%` }" />
  </div>
</template>

<script setup>
defineProps({
  value: {
    type: Number,
    default: 0
  }
})
</script>

<style scoped>
.s-progress {
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: #e5e7eb;
  overflow: hidden;
}
.s-progress__bar {
  height: 100%;
  background: #3b82f6;
  transition: width 0.2s;
}
</style>
