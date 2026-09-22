<template>
  <nav class="s-sidebar" :class="{ 's-sidebar--collapsed': collapsed }">
    <button
      v-for="item in items"
      :key="item.value"
      class="s-sidebar__item"
      :class="{ 's-sidebar__item--active': item.value === modelValue }"
      :title="item.label"
      @click="$emit('update:modelValue', item.value)"
    >
      <span class="s-sidebar__icon">{{ item.icon }}</span>
      <span v-if="!collapsed" class="s-sidebar__label">{{ item.label }}</span>
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
  },
  collapsed: {
    type: Boolean,
    default: false
  }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.s-sidebar {
  display: flex;
  flex-direction: column;
  gap: 0.2em;
  width: 200px;
  padding: 0.6em;
  background: #111827;
  border-radius: 10px;
  transition: width 0.2s;
}
.s-sidebar--collapsed {
  width: 56px;
}
.s-sidebar__item {
  display: flex;
  align-items: center;
  gap: 0.7em;
  padding: 0.55em 0.7em;
  border: none;
  border-radius: 7px;
  background: transparent;
  color: #d1d5db;
  cursor: pointer;
  font-size: 0.92em;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
}
.s-sidebar__item:hover {
  background: rgba(255, 255, 255, 0.08);
}
.s-sidebar__item--active {
  background: #3b82f6;
  color: white;
}
.s-sidebar__icon {
  width: 1.3em;
  text-align: center;
  flex-shrink: 0;
}
</style>
