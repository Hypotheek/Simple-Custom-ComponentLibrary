<template>
  <div class="s-auto">
    <input
      class="s-auto__input"
      :value="modelValue"
      :placeholder="placeholder"
      @input="onInput"
      @focus="open = true"
      @blur="open = false"
    />
    <ul v-if="open && filtered.length" class="s-auto__list">
      <li
        v-for="opt in filtered"
        :key="opt"
        class="s-auto__item"
        @mousedown.prevent="choose(opt)"
      >
        {{ opt }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update:modelValue'])

const open = ref(false)

const filtered = computed(() => {
  const q = props.modelValue.toLowerCase()
  return props.options.filter((o) => o.toLowerCase().includes(q)).slice(0, 8)
})

function onInput(e) {
  open.value = true
  emit('update:modelValue', e.target.value)
}
function choose(opt) {
  emit('update:modelValue', opt)
  open.value = false
}
</script>

<style scoped>
.s-auto {
  position: relative;
  display: inline-block;
}
.s-auto__input {
  padding: 0.5em;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1em;
  width: 100%;
  box-sizing: border-box;
}
.s-auto__list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin: 0.2em 0 0;
  padding: 0.2em;
  list-style: none;
  background: white;
  color: #111827;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  z-index: 20;
}
.s-auto__item {
  padding: 0.4em 0.6em;
  border-radius: 4px;
  cursor: pointer;
}
.s-auto__item:hover {
  background: #eff6ff;
}
</style>
