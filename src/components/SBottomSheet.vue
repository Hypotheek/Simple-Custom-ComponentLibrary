<template>
  <Teleport to="body">
    <Transition name="s-sheet">
      <div v-if="modelValue" class="s-sheet-overlay" @click.self="close">
        <div class="s-sheet" role="dialog">
          <div class="s-sheet__grip" />
          <h3 v-if="title" class="s-sheet__title">{{ title }}</h3>
          <slot />
        </div>
      </div>
    </Transition>
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
.s-sheet-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
}
.s-sheet {
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  padding: 0.6em 1.25em 1.5em;
  background: white;
  color: #111827;
  border-radius: 16px 16px 0 0;
  box-sizing: border-box;
}
.s-sheet__grip {
  width: 40px;
  height: 4px;
  margin: 0 auto 0.8em;
  border-radius: 999px;
  background: #d1d5db;
}
.s-sheet__title {
  margin: 0 0 0.5em;
}
.s-sheet-enter-active,
.s-sheet-leave-active {
  transition: opacity 0.2s;
}
.s-sheet-enter-active .s-sheet,
.s-sheet-leave-active .s-sheet {
  transition: transform 0.25s ease;
}
.s-sheet-enter-from,
.s-sheet-leave-to {
  opacity: 0;
}
.s-sheet-enter-from .s-sheet,
.s-sheet-leave-to .s-sheet {
  transform: translateY(100%);
}
</style>
