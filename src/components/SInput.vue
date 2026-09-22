<template>
  <input
    class="s-input"
    :value="modelValue"
    :placeholder="placeholder"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.s-input {
  padding: 0.5em;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 1em;
}
</style>
