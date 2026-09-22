<template>
  <div class="s-empty">
    <div class="s-empty__icon">🗒️</div>
    <p class="s-empty__text">{{ text }}</p>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: 'No data'
  }
})
</script>

<style scoped>
.s-empty {
  text-align: center;
  padding: 2em 1em;
  color: #9ca3af;
}
.s-empty__icon {
  font-size: 2em;
  margin-bottom: 0.25em;
}
</style>
