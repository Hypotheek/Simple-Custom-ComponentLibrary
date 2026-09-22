<template>
  <div v-if="visible" class="s-banner" :class="`s-banner--${type}`" role="status">
    <span class="s-banner__text"><slot /></span>
    <span class="s-banner__actions">
      <slot name="action" />
      <button v-if="dismissible" class="s-banner__close" @click="dismiss">&times;</button>
    </span>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  type: {
    type: String,
    default: 'info'
  },
  dismissible: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['dismiss'])

const visible = ref(true)
function dismiss() {
  visible.value = false
  emit('dismiss')
}
</script>

<style scoped>
.s-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1em;
  padding: 0.7em 1.1em;
  font-size: 0.92em;
}
.s-banner--info {
  background: #1d4ed8;
  color: white;
}
.s-banner--success {
  background: #166534;
  color: white;
}
.s-banner--warning {
  background: #fef3c7;
  color: #92400e;
}
.s-banner--error {
  background: #991b1b;
  color: white;
}
.s-banner__actions {
  display: inline-flex;
  align-items: center;
  gap: 0.6em;
}
.s-banner__close {
  background: none;
  border: none;
  color: inherit;
  font-size: 1.2em;
  cursor: pointer;
  line-height: 1;
}
</style>
