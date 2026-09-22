<template>
  <div class="s-spinner" />
</template>

<script setup>
</script>

<style scoped>
.s-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: s-spin 0.7s linear infinite;
}
@keyframes s-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
