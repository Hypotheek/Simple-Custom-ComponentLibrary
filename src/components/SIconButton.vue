<template>
  <button class="s-icon-button" @click="$emit('click', $event)">
    <slot />
  </button>
</template>

<script setup>
defineEmits(['click'])
</script>

<style scoped>
.s-icon-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #f3f4f6;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1em;
}
.s-icon-button:hover {
  background: #e5e7eb;
}
</style>
