<template>
  <span class="s-dots" role="status" aria-label="Loading">
    <span class="s-dots__dot" />
    <span class="s-dots__dot" />
    <span class="s-dots__dot" />
  </span>
</template>

<script setup>
</script>

<style scoped>
.s-dots {
  display: inline-flex;
  gap: 5px;
  align-items: center;
}
.s-dots__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3b82f6;
  animation: s-dots-bounce 1s ease-in-out infinite;
}
.s-dots__dot:nth-child(2) {
  animation-delay: 0.15s;
}
.s-dots__dot:nth-child(3) {
  animation-delay: 0.3s;
}
@keyframes s-dots-bounce {
  0%,
  80%,
  100% {
    transform: translateY(0);
    opacity: 0.45;
  }
  40% {
    transform: translateY(-6px);
    opacity: 1;
  }
}
</style>
