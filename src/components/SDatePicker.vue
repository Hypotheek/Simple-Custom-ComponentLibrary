<template>
  <input
    type="date"
    class="s-date-picker"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.s-date-picker {
  padding: 0.5em;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 1em;
}
</style>
