<template>
  <div class="s-stack" :style="{ gap, alignItems: ALIGN[align] }">
    <slot />
  </div>
</template>

<script setup>
const ALIGN = { start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch' }

defineProps({
  gap: {
    type: String,
    default: '1em'
  },
  align: {
    type: String,
    default: 'stretch'
  }
})
</script>

<style scoped>
.s-stack {
  display: flex;
  flex-direction: column;
}
</style>
