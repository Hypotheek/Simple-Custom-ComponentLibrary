<template>
  <div class="s-taginput" @click="$refs.field.focus()">
    <span v-for="(tag, i) in modelValue" :key="tag + i" class="s-taginput__tag">
      {{ tag }}
      <button type="button" class="s-taginput__remove" @click.stop="remove(i)">&times;</button>
    </span>
    <input
      ref="field"
      v-model="draft"
      class="s-taginput__field"
      :placeholder="modelValue.length ? '' : placeholder"
      @keydown.enter.prevent="add"
      @keydown.,="add"
      @keydown.backspace="onBackspace"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Add a tag...'
  }
})
const emit = defineEmits(['update:modelValue'])

const draft = ref('')

function add(e) {
  if (e && e.key === ',') e.preventDefault()
  const value = draft.value.trim()
  if (value && !props.modelValue.includes(value)) {
    emit('update:modelValue', [...props.modelValue, value])
  }
  draft.value = ''
}
function remove(i) {
  emit('update:modelValue', props.modelValue.filter((_, idx) => idx !== i))
}
function onBackspace() {
  if (!draft.value && props.modelValue.length) remove(props.modelValue.length - 1)
}
</script>

<style scoped>
.s-taginput {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35em;
  padding: 0.35em;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: text;
}
.s-taginput__tag {
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
  padding: 0.15em 0.6em;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 0.85em;
}
.s-taginput__remove {
  border: none;
  background: none;
  color: inherit;
  cursor: pointer;
  line-height: 1;
}
.s-taginput__field {
  flex: 1;
  min-width: 90px;
  border: none;
  outline: none;
  font-size: 0.95em;
  padding: 0.2em;
}
</style>
