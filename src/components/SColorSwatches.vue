<template>
  <div class="s-swatches">
    <button
      v-for="c in colors"
      :key="c"
      class="s-swatches__btn"
      :class="{ 's-swatches__btn--active': c === modelValue }"
      :style="{ background: c }"
      :aria-label="c"
      @click="$emit('update:modelValue', c)"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  colors: {
    type: Array,
    default: () => ['#ef4444', '#f59e0b', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#111827']
  }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.s-swatches {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0.4em;
}
.s-swatches__btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 1px #d1d5db;
  cursor: pointer;
  transition: transform 0.12s;
}
.s-swatches__btn:hover {
  transform: scale(1.12);
}
.s-swatches__btn--active {
  box-shadow: 0 0 0 2px #111827;
}
</style>
