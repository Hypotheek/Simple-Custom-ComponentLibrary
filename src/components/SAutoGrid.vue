<template>
  <div class="s-autogrid" :style="{ gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}, 1fr))`, gap }">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  minWidth: {
    type: String,
    default: '200px'
  },
  gap: {
    type: String,
    default: '1em'
  }
})
</script>

<style scoped>
.s-autogrid {
  display: grid;
}
</style>
