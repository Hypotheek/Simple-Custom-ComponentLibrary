<template>
  <div class="s-skeleton" :style="{ width, height }" />
</template>

<script setup>
defineProps({
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '1em'
  }
})
</script>

<style scoped>
.s-skeleton {
  border-radius: 4px;
  background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
  background-size: 200% 100%;
  animation: s-skeleton-shimmer 1.5s infinite;
}
@keyframes s-skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
