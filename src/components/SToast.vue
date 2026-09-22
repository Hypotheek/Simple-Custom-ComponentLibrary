<template>
  <Teleport to="body">
    <Transition name="s-toast-fade">
      <div v-if="modelValue" class="s-toast" :class="`s-toast--${type}`">
        <slot />
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
  type: {
    type: String,
    default: 'info'
  }
})
</script>

<style scoped>
.s-toast {
  position: fixed;
  bottom: 1.5em;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.75em 1.25em;
  border-radius: 6px;
  background: #111827;
  color: white;
  z-index: 2000;
}
.s-toast--success {
  background: #166534;
}
.s-toast--error {
  background: #991b1b;
}
.s-toast--warning {
  background: #92400e;
}
.s-toast-fade-enter-active,
.s-toast-fade-leave-active {
  transition: opacity 0.2s;
}
.s-toast-fade-enter-from,
.s-toast-fade-leave-to {
  opacity: 0;
}
</style>
