<template>
  <img class="s-image" :class="{ 's-image--rounded': rounded }" :src="src" :alt="alt" />
</template>

<script setup>
defineProps({
  src: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: ''
  },
  rounded: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.s-image {
  max-width: 100%;
  display: block;
}
.s-image--rounded {
  border-radius: 8px;
}
</style>
