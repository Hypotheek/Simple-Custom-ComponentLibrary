<template>
  <li class="s-list-item" @click="$emit('click', $event)">
    <slot />
  </li>
</template>

<script setup>
defineEmits(['click'])
</script>

<style scoped>
.s-list-item {
  padding: 0.7em 1em;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
}
.s-list-item:last-child {
  border-bottom: none;
}
.s-list-item:hover {
  background: #f9fafb;
}
</style>
