<template>
  <div class="s-collapse">
    <button class="s-collapse__head" :aria-expanded="modelValue" @click="$emit('update:modelValue', !modelValue)">
      <span>{{ title }}</span>
      <span class="s-collapse__chev" :class="{ 's-collapse__chev--open': modelValue }">▾</span>
    </button>
    <div class="s-collapse__body" :class="{ 's-collapse__body--open': modelValue }">
      <div class="s-collapse__inner"><slot /></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.s-collapse {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}
.s-collapse__head {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.7em 1em;
  border: none;
  background: #f9fafb;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
}
.s-collapse__chev {
  transition: transform 0.2s;
}
.s-collapse__chev--open {
  transform: rotate(180deg);
}
.s-collapse__body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.25s ease;
}
.s-collapse__body--open {
  grid-template-rows: 1fr;
}
.s-collapse__inner {
  overflow: hidden;
  padding: 0 1em;
}
.s-collapse__body--open .s-collapse__inner {
  padding: 0.8em 1em;
}
</style>
