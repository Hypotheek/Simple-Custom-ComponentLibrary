<template>
  <div :class="`s-showbelow s-showbelow--${breakpoint}`">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  breakpoint: {
    type: String,
    default: 'md'
  }
})
</script>

<style scoped>
.s-showbelow {
  display: block;
}
@media (min-width: 640px) {
  .s-showbelow--sm {
    display: none;
  }
}
@media (min-width: 768px) {
  .s-showbelow--md {
    display: none;
  }
}
@media (min-width: 1024px) {
  .s-showbelow--lg {
    display: none;
  }
}
</style>
