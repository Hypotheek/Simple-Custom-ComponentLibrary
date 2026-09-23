<template>
  <div class="s-griditem" :style="{ gridColumn: `span ${span}` }">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  span: {
    type: [Number, String],
    default: 1
  }
})
</script>
