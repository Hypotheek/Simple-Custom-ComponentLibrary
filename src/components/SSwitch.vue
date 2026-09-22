<template>
  <label class="s-switch">
    <input
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
    <span class="s-switch__track">
      <span class="s-switch__thumb" />
    </span>
    <span v-if="$slots.default"><slot /></span>
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
.s-switch {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  cursor: pointer;
}
.s-switch input {
  display: none;
}
.s-switch__track {
  width: 2.4em;
  height: 1.4em;
  border-radius: 999px;
  background: #d1d5db;
  position: relative;
  transition: background 0.15s;
  flex-shrink: 0;
}
.s-switch__thumb {
  position: absolute;
  top: 0.15em;
  left: 0.15em;
  width: 1.1em;
  height: 1.1em;
  border-radius: 50%;
  background: white;
  transition: transform 0.15s;
}
.s-switch input:checked + .s-switch__track {
  background: #3b82f6;
}
.s-switch input:checked + .s-switch__track .s-switch__thumb {
  transform: translateX(1em);
}
</style>
