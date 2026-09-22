<template>
  <div class="s-grid" :style="{ gridTemplateColumns: `repeat(${columns}, 1fr)`, gap }">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  columns: {
    type: [Number, String],
    default: 2
  },
  gap: {
    type: String,
    default: '1em'
  }
})
</script>

<style scoped>
.s-grid {
  display: grid;
}
</style>
