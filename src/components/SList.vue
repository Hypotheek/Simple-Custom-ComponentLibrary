<template>
  <ul class="s-list">
    <slot />
  </ul>
</template>

<script setup>
</script>

<style scoped>
.s-list {
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}
</style>
