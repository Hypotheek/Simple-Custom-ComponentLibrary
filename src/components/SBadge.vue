<template>
  <span class="s-badge" :class="`s-badge--${variant}`">
    <slot />
  </span>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'default'
  }
})
</script>

<style scoped>
.s-badge {
  display: inline-block;
  padding: 0.15em 0.6em;
  border-radius: 999px;
  font-size: 0.8em;
  font-weight: 600;
}
.s-badge--default {
  background: #e5e7eb;
  color: #111827;
}
.s-badge--primary {
  background: #3b82f6;
  color: white;
}
.s-badge--success {
  background: #22c55e;
  color: white;
}
.s-badge--danger {
  background: #ef4444;
  color: white;
}
</style>
