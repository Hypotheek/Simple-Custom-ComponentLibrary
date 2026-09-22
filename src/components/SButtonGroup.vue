<template>
  <div class="s-button-group">
    <slot />
  </div>
</template>

<script setup>
</script>

<style scoped>
.s-button-group {
  display: inline-flex;
}
.s-button-group :deep(button) {
  border-radius: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}
.s-button-group :deep(button:first-child) {
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
}
.s-button-group :deep(button:last-child) {
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  border-right: none;
}
</style>
