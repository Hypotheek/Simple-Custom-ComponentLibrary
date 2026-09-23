<template>
  <div class="s-spread" :style="{ alignItems: ALIGN[align] }">
    <slot />
  </div>
</template>

<script setup>
const ALIGN = { start: 'flex-start', center: 'center', end: 'flex-end' }

defineProps({
  align: {
    type: String,
    default: 'center'
  }
})
</script>

<style scoped>
.s-spread {
  display: flex;
  justify-content: space-between;
}
</style>
