<template>
  <button class="s-button" :class="`s-button--${variant}`" @click="$emit('click', $event)">
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary'
  }
})
defineEmits(['click'])
</script>

<style scoped>
.s-button {
  padding: 0.5em 1em;
  border-radius: 6px;
  border: 1px solid transparent;
  font-size: 1em;
  cursor: pointer;
}
.s-button--primary {
  background: #3b82f6;
  color: white;
}
.s-button--secondary {
  background: #e5e7eb;
  color: #111827;
}
</style>
