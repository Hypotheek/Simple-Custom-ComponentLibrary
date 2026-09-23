<template>
  <div class="s-sticky" :style="{ top, zIndex }">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  top: {
    type: String,
    default: '0'
  },
  zIndex: {
    type: [Number, String],
    default: 10
  }
})
</script>

<style scoped>
.s-sticky {
  position: sticky;
}
</style>
