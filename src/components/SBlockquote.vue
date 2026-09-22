<template>
  <blockquote class="s-blockquote">
    <slot />
  </blockquote>
</template>

<script setup>
</script>

<style scoped>
.s-blockquote {
  margin: 0;
  padding: 0.5em 1em;
  border-left: 4px solid #3b82f6;
  color: #4b5563;
  font-style: italic;
}
</style>
