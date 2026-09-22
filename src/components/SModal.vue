<template>
  <Teleport to="body">
    <div v-if="modelValue" class="s-modal-overlay" @click.self="close">
      <div class="s-modal">
        <div class="s-modal__header">
          <h3 v-if="title">{{ title }}</h3>
          <button class="s-modal__close" @click="close">&times;</button>
        </div>
        <div class="s-modal__body">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update:modelValue'])

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.s-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.s-modal {
  background: white;
  color: #111827;
  border-radius: 8px;
  padding: 1em;
  min-width: 300px;
  max-width: 90vw;
}
.s-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75em;
}
.s-modal__header h3 {
  margin: 0;
}
.s-modal__close {
  background: none;
  border: none;
  font-size: 1.2em;
  cursor: pointer;
}
</style>
