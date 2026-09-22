<template>
  <div class="s-search">
    <span class="s-search__icon">🔍</span>
    <input
      class="s-search__input"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <button v-if="modelValue" class="s-search__clear" @click="$emit('update:modelValue', '')">&times;</button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Search...'
  }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.s-search {
  display: flex;
  align-items: center;
  gap: 0.4em;
  padding: 0.4em 0.7em;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}
.s-search__input {
  border: none;
  outline: none;
  flex: 1;
  font-size: 1em;
}
.s-search__clear {
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
}
</style>
