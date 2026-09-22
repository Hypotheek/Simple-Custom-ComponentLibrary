<template>
  <Teleport to="body">
    <div v-if="modelValue" class="s-confirm-overlay">
      <div class="s-confirm">
        <h3 v-if="title">{{ title }}</h3>
        <p><slot /></p>
        <div class="s-confirm__actions">
          <button class="s-confirm__btn s-confirm__btn--cancel" @click="$emit('cancel'); $emit('update:modelValue', false)">Cancel</button>
          <button class="s-confirm__btn s-confirm__btn--confirm" @click="$emit('confirm'); $emit('update:modelValue', false)">Confirm</button>
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
defineEmits(['update:modelValue', 'confirm', 'cancel'])
</script>

<style scoped>
.s-confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.s-confirm {
  background: white;
  color: #111827;
  border-radius: 8px;
  padding: 1.25em;
  min-width: 280px;
}
.s-confirm__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5em;
  margin-top: 1em;
}
.s-confirm__btn {
  padding: 0.4em 1em;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}
.s-confirm__btn--cancel {
  background: #e5e7eb;
}
.s-confirm__btn--confirm {
  background: #ef4444;
  color: white;
}
</style>
