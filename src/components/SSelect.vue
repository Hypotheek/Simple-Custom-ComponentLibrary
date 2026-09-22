<template>
  <select
    class="s-select"
    :value="modelValue"
    @change="$emit('update:modelValue', $event.target.value)"
  >
    <option v-for="option in options" :key="option.value" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.s-select {
  padding: 0.5em;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 1em;
  background: white;
}
</style>
