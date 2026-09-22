<template>
  <div class="s-pagination">
    <button class="s-pagination__btn" :disabled="modelValue <= 1" @click="$emit('update:modelValue', modelValue - 1)">‹</button>
    <span class="s-pagination__label">{{ modelValue }} / {{ pageCount }}</span>
    <button class="s-pagination__btn" :disabled="modelValue >= pageCount" @click="$emit('update:modelValue', modelValue + 1)">›</button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Number,
    default: 1
  },
  pageCount: {
    type: Number,
    default: 1
  }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.s-pagination {
  display: flex;
  align-items: center;
  gap: 0.75em;
}
.s-pagination__btn {
  padding: 0.3em 0.7em;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  cursor: pointer;
}
.s-pagination__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
