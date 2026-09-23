<template>
  <div class="s-scrollarea" :style="{ maxHeight, maxWidth }">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  maxHeight: {
    type: String,
    default: '300px'
  },
  maxWidth: {
    type: String,
    default: undefined
  }
})
</script>

<style scoped>
.s-scrollarea {
  overflow: auto;
}
</style>
