<template>
  <span class="s-popover">
    <span @click="open = !open"><slot name="trigger" /></span>
    <div v-if="open" class="s-popover__content">
      <slot />
    </div>
  </span>
</template>

<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>

<style scoped>
.s-popover {
  position: relative;
  display: inline-block;
}
.s-popover__content {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0.4em;
  background: white;
  color: #111827;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 0.75em;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  min-width: 180px;
}
</style>
