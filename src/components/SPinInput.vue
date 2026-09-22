<template>
  <div class="s-pin">
    <input
      v-for="i in length"
      :key="i"
      :ref="(el) => (inputs[i - 1] = el)"
      class="s-pin__cell"
      maxlength="1"
      inputmode="numeric"
      :value="chars[i - 1]"
      @input="onInput(i - 1, $event)"
      @keydown.backspace="onBackspace(i - 1, $event)"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  length: {
    type: Number,
    default: 4
  }
})
const emit = defineEmits(['update:modelValue'])

const inputs = []
const chars = computed(() => Array.from({ length: props.length }, (_, i) => props.modelValue[i] || ''))

function commit(next) {
  emit('update:modelValue', next.join(''))
}

function onInput(i, e) {
  const digit = e.target.value.replace(/\D/g, '').slice(-1)
  const next = [...chars.value]
  next[i] = digit
  e.target.value = digit
  commit(next)
  if (digit && inputs[i + 1]) inputs[i + 1].focus()
}

function onBackspace(i, e) {
  if (chars.value[i] === '' && i > 0) {
    e.preventDefault()
    const next = [...chars.value]
    next[i - 1] = ''
    commit(next)
    inputs[i - 1].focus()
  }
}
</script>

<style scoped>
.s-pin {
  display: inline-flex;
  gap: 0.5em;
}
.s-pin__cell {
  width: 2.6em;
  height: 3em;
  text-align: center;
  font-size: 1.2em;
  border: 1px solid #d1d5db;
  border-radius: 8px;
}
.s-pin__cell:focus {
  outline: 2px solid #3b82f6;
  border-color: transparent;
}
</style>
