<template>
  <div class="s-wrap" :style="{ gap, justifyContent: JUSTIFY[justify] }">
    <slot />
  </div>
</template>

<script setup>
const JUSTIFY = { start: 'flex-start', center: 'center', end: 'flex-end', between: 'space-between', around: 'space-around' }

defineProps({
  gap: {
    type: String,
    default: '0.5em'
  },
  justify: {
    type: String,
    default: 'start'
  }
})
</script>

<style scoped>
.s-wrap {
  display: flex;
  flex-wrap: wrap;
}
</style>
