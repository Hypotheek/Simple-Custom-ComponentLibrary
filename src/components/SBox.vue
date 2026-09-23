<template>
  <div
    class="s-box"
    :style="{
      padding,
      margin,
      width,
      height,
      background,
      borderRadius: rounded ? '8px' : undefined
    }"
  >
    <slot />
  </div>
</template>

<script setup>
defineProps({
  padding: {
    type: String,
    default: undefined
  },
  margin: {
    type: String,
    default: undefined
  },
  width: {
    type: String,
    default: undefined
  },
  height: {
    type: String,
    default: undefined
  },
  background: {
    type: String,
    default: undefined
  },
  rounded: {
    type: Boolean,
    default: false
  }
})
</script>
