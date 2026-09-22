<template>
  <div class="s-menu">
    <div class="s-menu__trigger" @click="open = !open">
      <slot name="trigger" />
    </div>
    <div v-if="open" class="s-menu__list">
      <div
        v-for="item in items"
        :key="item"
        class="s-menu__item"
        @click="select(item)"
      >
        {{ item }}
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
const emit = defineEmits(['select'])
const open = ref(false)

function select(item) {
  emit('select', item)
  open.value = false
}
</script>

<style scoped>
.s-menu {
  position: relative;
  display: inline-block;
}
.s-menu__list {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0.25em;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  min-width: 140px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
}
.s-menu__item {
  padding: 0.5em 0.9em;
  cursor: pointer;
  color: #111827;
}
.s-menu__item:hover {
  background: #f3f4f6;
}
</style>
