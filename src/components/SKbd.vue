<template>
  <kbd class="s-kbd"><slot /></kbd>
</template>

<script setup>
</script>

<style scoped>
.s-kbd {
  display: inline-block;
  padding: 0.15em 0.5em;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  border-bottom-width: 2px;
  background: #f9fafb;
  font-family: monospace;
  font-size: 0.85em;
}
</style>
