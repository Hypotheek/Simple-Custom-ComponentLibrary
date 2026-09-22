<template>
  <div class="s-spacer" :style="{ height: size, width: size }" />
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: '1em'
  }
})
</script>
