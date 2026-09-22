<template>
  <div class="s-loadover">
    <slot />
    <div v-if="loading" class="s-loadover__mask" aria-busy="true">
      <span class="s-loadover__spinner" />
      <span v-if="text" class="s-loadover__text">{{ text }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.s-loadover {
  position: relative;
}
.s-loadover__mask {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6em;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(1px);
  border-radius: inherit;
  z-index: 5;
}
.s-loadover__spinner {
  width: 26px;
  height: 26px;
  border: 3px solid #dbeafe;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: s-loadover-spin 0.7s linear infinite;
}
.s-loadover__text {
  font-size: 0.85em;
  color: #374151;
}
@keyframes s-loadover-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
