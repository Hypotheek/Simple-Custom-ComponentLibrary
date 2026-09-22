<template>
  <component :is="`h${level}`" class="s-heading">
    <slot />
  </component>
</template>

<script setup>
defineProps({
  level: {
    type: [Number, String],
    default: 2
  }
})
</script>

<style scoped>
.s-heading {
  margin: 0 0 0.5em;
  color: #111827;
  font-weight: 700;
}
</style>
