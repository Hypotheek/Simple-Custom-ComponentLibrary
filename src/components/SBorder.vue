<template>
  <div class="s-border" :style="{ border: `${width} solid ${color}`, borderRadius: radius }">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  width: {
    type: String,
    default: '1px'
  },
  color: {
    type: String,
    default: '#e5e7eb'
  },
  radius: {
    type: String,
    default: '8px'
  }
})
</script>
