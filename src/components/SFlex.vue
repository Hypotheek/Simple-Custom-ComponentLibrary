<template>
  <div
    class="s-flex"
    :style="{
      flexDirection: direction,
      justifyContent: JUSTIFY[justify],
      alignItems: ALIGN[align],
      flexWrap: wrap ? 'wrap' : 'nowrap',
      gap
    }"
  >
    <slot />
  </div>
</template>

<script setup>
const JUSTIFY = { start: 'flex-start', center: 'center', end: 'flex-end', between: 'space-between', around: 'space-around', evenly: 'space-evenly' }
const ALIGN = { start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch', baseline: 'baseline' }

defineProps({
  direction: {
    type: String,
    default: 'row'
  },
  justify: {
    type: String,
    default: 'start'
  },
  align: {
    type: String,
    default: 'stretch'
  },
  wrap: {
    type: Boolean,
    default: false
  },
  gap: {
    type: String,
    default: '0'
  }
})
</script>

<style scoped>
.s-flex {
  display: flex;
}
</style>
