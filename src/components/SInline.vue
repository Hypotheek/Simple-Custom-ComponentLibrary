<template>
  <div class="s-inline" :style="{ gap, alignItems: ALIGN[align] }">
    <slot />
  </div>
</template>

<script setup>
const ALIGN = { start: 'flex-start', center: 'center', end: 'flex-end', baseline: 'baseline' }

defineProps({
  gap: {
    type: String,
    default: '0.5em'
  },
  align: {
    type: String,
    default: 'center'
  }
})
</script>

<style scoped>
.s-inline {
  display: inline-flex;
}
</style>
