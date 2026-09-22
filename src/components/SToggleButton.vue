<template>
  <button
    class="s-togglebtn"
    :class="{ 's-togglebtn--on': modelValue }"
    :aria-pressed="modelValue"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.s-togglebtn {
  padding: 0.45em 1em;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 0.95em;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.s-togglebtn:hover {
  background: #f9fafb;
}
.s-togglebtn--on {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}
.s-togglebtn--on:hover {
  background: #2563eb;
}
</style>
