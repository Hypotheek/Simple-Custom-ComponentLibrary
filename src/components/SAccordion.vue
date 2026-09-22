<template>
  <div class="s-accordion">
    <div v-for="(item, i) in items" :key="i" class="s-accordion__item">
      <button class="s-accordion__header" @click="toggle(i)">
        {{ item.title }}
        <span>{{ openIndex === i ? '−' : '+' }}</span>
      </button>
      <div v-if="openIndex === i" class="s-accordion__body">
        {{ item.content }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  items: {
    type: Array,
    default: () => []
  }
})

const openIndex = ref(-1)
function toggle(i) {
  openIndex.value = openIndex.value === i ? -1 : i
}
</script>

<style scoped>
.s-accordion__item {
  border-bottom: 1px solid #e5e7eb;
}
.s-accordion__header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75em 0;
  background: none;
  border: none;
  font-size: 1em;
  cursor: pointer;
  text-align: left;
}
.s-accordion__body {
  padding: 0 0 0.75em;
  color: #4b5563;
}
</style>
