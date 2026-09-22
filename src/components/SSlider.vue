<template>
  <input
    type="range"
    class="s-slider"
    :min="min"
    :max="max"
    :value="modelValue"
    @input="$emit('update:modelValue', Number($event.target.value))"
  />
</template>

<script setup>
defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.s-slider {
  width: 100%;
  accent-color: #3b82f6;
}
</style>
