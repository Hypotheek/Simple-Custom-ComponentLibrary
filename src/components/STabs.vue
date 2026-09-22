<template>
  <div class="s-tabs">
    <div class="s-tabs__nav">
      <button
        v-for="tab in tabs"
        :key="tab"
        class="s-tabs__tab"
        :class="{ 's-tabs__tab--active': tab === modelValue }"
        @click="$emit('update:modelValue', tab)"
      >
        {{ tab }}
      </button>
    </div>
    <div class="s-tabs__content">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  tabs: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: String,
    default: ''
  }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.s-tabs__nav {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
}
.s-tabs__tab {
  padding: 0.6em 1em;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1em;
  border-bottom: 2px solid transparent;
}
.s-tabs__tab--active {
  border-bottom-color: #3b82f6;
  color: #3b82f6;
  font-weight: 600;
}
.s-tabs__content {
  padding: 1em 0;
}
</style>
