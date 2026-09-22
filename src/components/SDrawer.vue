<template>
  <Teleport to="body">
    <div v-if="modelValue" class="s-drawer-overlay" @click.self="close">
      <div class="s-drawer" :class="`s-drawer--${side}`">
        <button class="s-drawer__close" @click="close">&times;</button>
        <slot />
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
  side: {
    type: String,
    default: 'right'
  }
})
const emit = defineEmits(['update:modelValue'])
function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.s-drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
}
.s-drawer {
  background: white;
  color: #111827;
  width: 280px;
  height: 100%;
  padding: 1.5em 1em 1em;
  position: relative;
}
.s-drawer--right {
  margin-left: auto;
}
.s-drawer--left {
  margin-right: auto;
}
.s-drawer__close {
  position: absolute;
  top: 0.75em;
  right: 0.75em;
  background: none;
  border: none;
  font-size: 1.2em;
  cursor: pointer;
}
</style>
