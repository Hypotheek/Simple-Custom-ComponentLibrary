<template>
  <div class="s-gap" :style="{ flexDirection: direction, gap: size }">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  direction: {
    type: String,
    default: 'row'
  },
  size: {
    type: String,
    default: '1em'
  }
})
</script>

<style scoped>
.s-gap {
  display: flex;
}
</style>
