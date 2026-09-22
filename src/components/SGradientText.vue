<template>
  <span class="s-gradtext" :style="{ backgroundImage: `linear-gradient(90deg, ${from}, ${to})` }">
    <slot />
  </span>
</template>

<script setup>
defineProps({
  from: {
    type: String,
    default: '#3b82f6'
  },
  to: {
    type: String,
    default: '#ec4899'
  }
})
</script>

<style scoped>
.s-gradtext {
  font-weight: 800;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}
</style>
