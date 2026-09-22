<template>
  <div v-if="visible" class="s-alert" :class="`s-alert--${type}`">
    <span class="s-alert__message"><slot /></span>
    <button v-if="dismissible" class="s-alert__close" @click="dismiss">&times;</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'info'
  },
  dismissible: {
    type: Boolean,
    default: false
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
.s-alert {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75em 1em;
  border-radius: 6px;
  font-size: 0.95em;
}
.s-alert--info {
  background: #dbeafe;
  color: #1e40af;
}
.s-alert--success {
  background: #dcfce7;
  color: #166534;
}
.s-alert--warning {
  background: #fef3c7;
  color: #92400e;
}
.s-alert--error {
  background: #fee2e2;
  color: #991b1b;
}
.s-alert__close {
  background: none;
  border: none;
  font-size: 1.1em;
  cursor: pointer;
  color: inherit;
  line-height: 1;
}
</style>
