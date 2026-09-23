<template>
  <div class="s-equalcols" :style="{ gap }">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  gap: {
    type: String,
    default: '1em'
  }
})
</script>

<style scoped>
.s-equalcols {
  display: flex;
}
.s-equalcols > :deep(*) {
  flex: 1 1 0;
  min-width: 0;
}
</style>
