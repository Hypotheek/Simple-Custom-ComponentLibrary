<template>
  <div class="s-aspect" :style="{ aspectRatio: ratio }">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  ratio: {
    type: String,
    default: '1 / 1'
  }
})
</script>

<style scoped>
.s-aspect {
  overflow: hidden;
}
.s-aspect > :deep(*) {
  width: 100%;
  height: 100%;
}
</style>
