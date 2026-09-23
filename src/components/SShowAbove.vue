<template>
  <div :class="`s-showabove s-showabove--${breakpoint}`">
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
.s-showabove {
  display: none;
}
@media (min-width: 640px) {
  .s-showabove--sm {
    display: block;
  }
}
@media (min-width: 768px) {
  .s-showabove--md {
    display: block;
  }
}
@media (min-width: 1024px) {
  .s-showabove--lg {
    display: block;
  }
}
</style>
