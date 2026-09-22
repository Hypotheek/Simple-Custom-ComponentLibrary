<template>
  <textarea
    class="s-textarea"
    :value="modelValue"
    :placeholder="placeholder"
    :rows="rows"
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
  },
  rows: {
    type: [Number, String],
    default: 4
  }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.s-textarea {
  width: 100%;
  padding: 0.5em;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 1em;
  font-family: inherit;
  resize: vertical;
}
</style>
