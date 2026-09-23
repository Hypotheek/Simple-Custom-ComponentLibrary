<template>
  <div class="s-center" :style="{ display: inline ? 'inline-flex' : 'flex' }">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  inline: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.s-center {
  align-items: center;
  justify-content: center;
}
</style>
