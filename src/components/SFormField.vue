<template>
  <div class="s-field">
    <label v-if="label" class="s-field__label">
      {{ label }}<span v-if="required" class="s-field__req">*</span>
    </label>
    <slot />
    <p v-if="error" class="s-field__error">{{ error }}</p>
    <p v-else-if="hint" class="s-field__hint">{{ hint }}</p>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.s-field {
  display: flex;
  flex-direction: column;
  gap: 0.3em;
}
.s-field__label {
  font-size: 0.9em;
  font-weight: 600;
  color: #374151;
}
.s-field__req {
  color: #d03b3b;
  margin-left: 0.2em;
}
.s-field__hint,
.s-field__error {
  margin: 0;
  font-size: 0.8em;
}
.s-field__hint {
  color: #6b7280;
}
.s-field__error {
  color: #d03b3b;
}
</style>
