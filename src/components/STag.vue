<template>
  <span class="s-tag" :class="`s-tag--${color}`">
    <slot />
  </span>
</template>

<script setup>
defineProps({
  color: {
    type: String,
    default: 'gray'
  }
})
</script>

<style scoped>
.s-tag {
  display: inline-block;
  padding: 0.1em 0.5em;
  border-radius: 4px;
  font-size: 0.75em;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.s-tag--gray {
  background: #f3f4f6;
  color: #374151;
}
.s-tag--blue {
  background: #dbeafe;
  color: #1e40af;
}
.s-tag--green {
  background: #dcfce7;
  color: #166534;
}
.s-tag--red {
  background: #fee2e2;
  color: #991b1b;
}
</style>
