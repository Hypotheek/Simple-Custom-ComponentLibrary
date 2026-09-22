<template>
  <label class="s-checkbox">
    <input
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
    <span><slot /></span>
  </label>
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
.s-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  cursor: pointer;
  font-size: 1em;
}
</style>
