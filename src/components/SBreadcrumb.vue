<template>
  <nav class="s-breadcrumb">
    <template v-for="(item, i) in items" :key="i">
      <span v-if="i > 0" class="s-breadcrumb__sep">/</span>
      <a
        class="s-breadcrumb__item"
        :class="{ 's-breadcrumb__item--active': i === items.length - 1 }"
        @click="$emit('select', item)"
      >
        {{ item }}
      </a>
    </template>
  </nav>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => []
  }
})
defineEmits(['select'])
</script>

<style scoped>
.s-breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5em;
  font-size: 0.9em;
}
.s-breadcrumb__item {
  color: #3b82f6;
  cursor: pointer;
  text-decoration: none;
}
.s-breadcrumb__item--active {
  color: #6b7280;
  cursor: default;
  pointer-events: none;
}
.s-breadcrumb__sep {
  color: #9ca3af;
}
</style>
