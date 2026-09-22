<template>
  <span class="s-chip">
    <slot />
    <button v-if="closable" class="s-chip__close" @click="$emit('close')">&times;</button>
  </span>
</template>

<script setup>
defineProps({
  closable: {
    type: Boolean,
    default: false
  }
})
defineEmits(['close'])
</script>

<style scoped>
.s-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  padding: 0.25em 0.7em;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 0.85em;
}
.s-chip__close {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 1em;
  line-height: 1;
}
</style>
