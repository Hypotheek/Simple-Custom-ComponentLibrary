<template>
  <Teleport to="body">
    <Transition name="s-snack">
      <div v-if="modelValue" class="s-snackbar" role="status">
        <span>{{ message }}</span>
        <button v-if="actionLabel" class="s-snackbar__action" @click="$emit('action')">
          {{ actionLabel }}
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: ''
  },
  actionLabel: {
    type: String,
    default: ''
  },
  timeout: {
    type: Number,
    default: 4000
  }
})
const emit = defineEmits(['update:modelValue', 'action'])

let timer = null
watch(
  () => props.modelValue,
  (open) => {
    clearTimeout(timer)
    if (open && props.timeout > 0) {
      timer = setTimeout(() => emit('update:modelValue', false), props.timeout)
    }
  },
  { immediate: true }
)
onBeforeUnmount(() => clearTimeout(timer))
</script>

<style scoped>
.s-snackbar {
  position: fixed;
  left: 50%;
  bottom: 1.5em;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 1.2em;
  padding: 0.7em 1.1em;
  background: #111827;
  color: white;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  z-index: 2000;
}
.s-snackbar__action {
  background: none;
  border: none;
  color: #93c5fd;
  font-weight: 600;
  cursor: pointer;
}
.s-snack-enter-active,
.s-snack-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.s-snack-enter-from,
.s-snack-leave-to {
  opacity: 0;
  transform: translate(-50%, 12px);
}
</style>
