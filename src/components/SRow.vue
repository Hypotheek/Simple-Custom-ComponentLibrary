<template>
  <div
    class="s-row"
    :style="{
      alignItems: ALIGN[align],
      justifyContent: JUSTIFY[justify],
      flexWrap: wrap ? 'wrap' : 'nowrap',
      gap: `${gutter}px`
    }"
  >
    <slot />
  </div>
</template>

<script>
/**
 * Horizontal layout container. Places its children next to each other in a row.
 *
 * @deprecated Use SFlex with direction="row" instead.
 */
export default {
  name: 'SRow'
}
</script>

<script setup>
const ALIGN = { start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch' }
const JUSTIFY = { start: 'flex-start', center: 'center', end: 'flex-end', between: 'space-between' }

defineProps({
  /**
   * Space between the children, in pixels.
   */
  gutter: {
    type: Number,
    default: 0
  },
  align: {
    type: String,
    default: 'start'
  },
  justify: {
    type: String,
    default: 'start'
  },
  wrap: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.s-row {
  display: flex;
  flex-direction: row;
}
</style>
