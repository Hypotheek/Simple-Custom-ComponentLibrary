<template>
  <div class="s-togglegroup" role="group">
    <button
      v-for="opt in options"
      :key="opt.value"
      class="s-togglegroup__btn"
      :class="{ 's-togglegroup__btn--active': opt.value === modelValue }"
      :aria-pressed="opt.value === modelValue"
      @click="$emit('update:modelValue', opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.s-togglegroup {
  display: inline-flex;
  padding: 3px;
  background: #f3f4f6;
  border-radius: 8px;
  gap: 2px;
}
.s-togglegroup__btn {
  padding: 0.35em 0.9em;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-size: 0.9em;
  color: #4b5563;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.s-togglegroup__btn--active {
  background: white;
  color: #111827;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}
</style>
