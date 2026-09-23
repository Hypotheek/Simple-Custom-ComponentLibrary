<template>
  <div class="s-position" :style="{ position: type, top, right, bottom, left }">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'relative'
  },
  top: {
    type: String,
    default: undefined
  },
  right: {
    type: String,
    default: undefined
  },
  bottom: {
    type: String,
    default: undefined
  },
  left: {
    type: String,
    default: undefined
  }
})
</script>
