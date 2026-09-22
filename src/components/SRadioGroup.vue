<template>
  <div class="s-radio-group">
    <label v-for="opt in options" :key="opt.value" class="s-radio-group__item">
      <input
        type="radio"
        :name="name"
        :value="opt.value"
        :checked="modelValue === opt.value"
        @change="$emit('update:modelValue', opt.value)"
      />
      <span>{{ opt.label }}</span>
    </label>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  name: {
    type: String,
    default: 's-radio-group'
  }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.s-radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}
.s-radio-group__item {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  cursor: pointer;
}
</style>
