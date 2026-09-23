<template>
  <div class="s-fullbleed" :style="{ background }">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  background: {
    type: String,
    default: undefined
  }
})
</script>

<style scoped>
.s-fullbleed {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
}
</style>
