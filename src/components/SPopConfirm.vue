<template>
  <span class="s-popconfirm">
    <span @click="open = !open"><slot /></span>
    <div v-if="open" class="s-popconfirm__bubble">
      <p class="s-popconfirm__msg">{{ message }}</p>
      <div class="s-popconfirm__actions">
        <button class="s-popconfirm__btn" @click="cancel">{{ cancelText }}</button>
        <button class="s-popconfirm__btn s-popconfirm__btn--ok" @click="confirm">{{ confirmText }}</button>
      </div>
    </div>
  </span>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  message: {
    type: String,
    default: 'Are you sure?'
  },
  confirmText: {
    type: String,
    default: 'Yes'
  },
  cancelText: {
    type: String,
    default: 'No'
  }
})
const emit = defineEmits(['confirm', 'cancel'])

const open = ref(false)

function confirm() {
  open.value = false
  emit('confirm')
}
function cancel() {
  open.value = false
  emit('cancel')
}
</script>

<style scoped>
.s-popconfirm {
  position: relative;
  display: inline-block;
}
.s-popconfirm__bubble {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  min-width: 190px;
  padding: 0.75em;
  background: white;
  color: #111827;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.16);
  z-index: 30;
}
.s-popconfirm__msg {
  margin: 0 0 0.6em;
  font-size: 0.9em;
}
.s-popconfirm__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.4em;
}
.s-popconfirm__btn {
  padding: 0.25em 0.8em;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.85em;
}
.s-popconfirm__btn--ok {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}
</style>
