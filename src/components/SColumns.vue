<template>
  <div class="s-columns" :style="{ columnCount: count, columnGap: gap }">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  count: {
    type: [Number, String],
    default: 2
  },
  gap: {
    type: String,
    default: '2em'
  }
})
</script>
