<template>
  <div
    class="s-column"
    :style="{
      alignItems: ALIGN[align],
      justifyContent: JUSTIFY[justify],
      gap: `${gutter}px`
    }"
  >
    <slot />
  </div>
</template>

<script>
/**
 * Vertical layout container. Stacks its children in a column.
 *
 * @deprecated Use SFlex with direction="column" instead.
 */
export default {
  name: 'SColumn'
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
    default: 'stretch'
  },
  justify: {
    type: String,
    default: 'start'
  }
})
</script>

<style scoped>
.s-column {
  display: flex;
  flex-direction: column;
}
</style>
