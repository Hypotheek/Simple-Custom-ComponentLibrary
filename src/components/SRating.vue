<template>
  <span class="s-rating">
    <span
      v-for="i in max"
      :key="i"
      class="s-rating__star"
      :class="{ 's-rating__star--filled': i <= modelValue }"
      @click="$emit('update:modelValue', i)"
    >★</span>
  </span>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 5
  }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.s-rating__star {
  font-size: 1.3em;
  color: #d1d5db;
  cursor: pointer;
}
.s-rating__star--filled {
  color: #f59e0b;
}
</style>
