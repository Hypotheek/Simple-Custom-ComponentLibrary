<template>
  <div class="s-password">
    <input
      class="s-password__input"
      :type="visible ? 'text' : 'password'"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <button class="s-password__toggle" type="button" @click="visible = !visible">
      {{ visible ? 'Hide' : 'Show' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Password'
  }
})
defineEmits(['update:modelValue'])

const visible = ref(false)
</script>

<style scoped>
.s-password {
  display: flex;
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding-right: 0.5em;
}
.s-password__input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0.5em;
  font-size: 1em;
  background: transparent;
}
.s-password__toggle {
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 0.8em;
  cursor: pointer;
}
</style>
