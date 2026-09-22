<template>
  <Teleport to="body">
    <div v-if="modelValue" class="s-backdrop" @click="$emit('update:modelValue', false)" />
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.s-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 900;
}
</style>
