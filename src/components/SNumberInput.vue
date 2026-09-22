<template>
  <div class="s-number">
    <button class="s-number__btn" :disabled="modelValue <= min" @click="change(-step)">−</button>
    <input
      class="s-number__input"
      type="number"
      :value="modelValue"
      :min="min"
      :max="max"
      :step="step"
      @input="onInput"
    />
    <button class="s-number__btn" :disabled="modelValue >= max" @click="change(step)">+</button>
  </div>
</template>

<script setup>
const props = defineProps({
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
  },
  step: {
    type: Number,
    default: 1
  }
})
const emit = defineEmits(['update:modelValue'])

function clamp(v) {
  return Math.min(props.max, Math.max(props.min, v))
}
function change(delta) {
  emit('update:modelValue', clamp(props.modelValue + delta))
}
function onInput(e) {
  const v = Number(e.target.value)
  if (!Number.isNaN(v)) emit('update:modelValue', clamp(v))
}
</script>

<style scoped>
.s-number {
  display: inline-flex;
  align-items: stretch;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  overflow: hidden;
}
.s-number__btn {
  width: 34px;
  border: none;
  background: #f3f4f6;
  font-size: 1.1em;
  cursor: pointer;
}
.s-number__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.s-number__input {
  width: 64px;
  border: none;
  text-align: center;
  font-size: 1em;
  padding: 0.4em 0;
  appearance: textfield;
  -moz-appearance: textfield;
}
.s-number__input::-webkit-outer-spin-button,
.s-number__input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
