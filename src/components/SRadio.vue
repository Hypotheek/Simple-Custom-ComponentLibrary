<template>
  <label class="s-radio">
    <input
      type="radio"
      :name="name"
      :value="value"
      :checked="modelValue === value"
      @change="$emit('update:modelValue', value)"
    />
    <span><slot /></span>
  </label>
</template>

<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  value: {
    type: [String, Number],
    required: true
  },
  name: {
    type: String,
    default: ''
  }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.s-radio {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  cursor: pointer;
}
</style>
