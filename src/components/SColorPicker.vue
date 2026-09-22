<template>
  <input
    type="color"
    class="s-color-picker"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '#3b82f6'
  }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.s-color-picker {
  width: 40px;
  height: 32px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 2px;
  cursor: pointer;
}
</style>
