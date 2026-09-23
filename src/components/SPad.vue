<template>
  <div class="s-pad" :style="{ padding: size }">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: '1em'
  }
})
</script>
