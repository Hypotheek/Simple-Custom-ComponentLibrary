<template>
  <button class="s-fab" @click="$emit('click', $event)">
    <slot>+</slot>
  </button>
</template>

<script setup>
defineEmits(['click'])
</script>

<style scoped>
.s-fab {
  position: fixed;
  bottom: 1.5em;
  right: 1.5em;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 500;
}
</style>
