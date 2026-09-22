<template>
  <button class="s-copy" :class="{ 's-copy--done': copied }" @click="copy">
    <slot>{{ copied ? 'Copied!' : 'Copy' }}</slot>
  </button>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['copied'])

const copied = ref(false)
let timer = null

async function copy() {
  try {
    await navigator.clipboard.writeText(props.text)
  } catch {
    const el = document.createElement('textarea')
    el.value = props.text
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  }
  copied.value = true
  emit('copied')
  clearTimeout(timer)
  timer = setTimeout(() => (copied.value = false), 1500)
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<style scoped>
.s-copy {
  padding: 0.35em 0.9em;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #111827;
  cursor: pointer;
  font-size: 0.9em;
  transition: background 0.15s, border-color 0.15s;
}
.s-copy:hover {
  background: #f9fafb;
}
.s-copy--done {
  border-color: #22c55e;
  color: #166534;
}
</style>
