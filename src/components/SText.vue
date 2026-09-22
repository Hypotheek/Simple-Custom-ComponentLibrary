<template>
  <p class="s-text" :class="`s-text--${variant}`">
    <slot />
  </p>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'body'
  }
})
</script>

<style scoped>
.s-text {
  margin: 0 0 0.5em;
  color: #374151;
}
.s-text--muted {
  color: #9ca3af;
  font-size: 0.9em;
}
.s-text--small {
  font-size: 0.85em;
}
</style>
