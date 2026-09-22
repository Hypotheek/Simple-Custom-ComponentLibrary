<template>
  <span class="s-tooltip">
    <slot />
    <span class="s-tooltip__bubble">{{ text }}</span>
  </span>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.s-tooltip {
  position: relative;
  display: inline-block;
}
.s-tooltip__bubble {
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  background: #111827;
  color: white;
  padding: 0.3em 0.6em;
  border-radius: 4px;
  font-size: 0.8em;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s;
}
.s-tooltip:hover .s-tooltip__bubble {
  opacity: 1;
}
</style>
