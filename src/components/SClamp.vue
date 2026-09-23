<template>
  <div class="s-clamp" :style="{ WebkitLineClamp: lines }">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  lines: {
    type: [Number, String],
    default: 3
  }
})
</script>

<style scoped>
.s-clamp {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
