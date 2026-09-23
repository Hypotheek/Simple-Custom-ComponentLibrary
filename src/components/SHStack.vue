<template>
  <div class="s-hstack" :style="{ gap, alignItems: ALIGN[align] }">
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
    default: 'center'
  }
})
</script>

<style scoped>
.s-hstack {
  display: flex;
  flex-direction: row;
}
</style>
