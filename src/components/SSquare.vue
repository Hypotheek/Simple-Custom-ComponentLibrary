<template>
  <div class="s-square" :style="{ width: size, aspectRatio: '1 / 1' }">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: '4em'
  }
})
</script>
