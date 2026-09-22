<template>
  <nav class="s-bottomnav">
    <button
      v-for="item in items"
      :key="item.value"
      class="s-bottomnav__item"
      :class="{ 's-bottomnav__item--active': item.value === modelValue }"
      @click="$emit('update:modelValue', item.value)"
    >
      <span class="s-bottomnav__icon">{{ item.icon }}</span>
      <span class="s-bottomnav__label">{{ item.label }}</span>
    </button>
  </nav>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: String,
    default: ''
  }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.s-bottomnav {
  display: flex;
  border-top: 1px solid #e5e7eb;
  background: white;
}
.s-bottomnav__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15em;
  padding: 0.55em 0.3em;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
}
.s-bottomnav__item--active {
  color: #3b82f6;
}
.s-bottomnav__icon {
  font-size: 1.25em;
}
.s-bottomnav__label {
  font-size: 0.72em;
  font-weight: 600;
}
</style>
