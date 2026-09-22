<template>
  <div class="s-checkgroup">
    <label v-for="opt in options" :key="opt.value" class="s-checkgroup__item">
      <input
        type="checkbox"
        :checked="modelValue.includes(opt.value)"
        @change="toggle(opt.value)"
      />
      <span>{{ opt.label }}</span>
    </label>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  options: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['update:modelValue'])

function toggle(value) {
  const next = props.modelValue.includes(value)
    ? props.modelValue.filter((v) => v !== value)
    : [...props.modelValue, value]
  emit('update:modelValue', next)
}
</script>

<style scoped>
.s-checkgroup {
  display: flex;
  flex-direction: column;
  gap: 0.45em;
}
.s-checkgroup__item {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  cursor: pointer;
}
</style>
