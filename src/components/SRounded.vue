<template>
  <div class="s-rounded" :style="{ borderRadius: radius }">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  radius: {
    type: String,
    default: '8px'
  }
})
</script>

<style scoped>
.s-rounded {
  overflow: hidden;
}
</style>
