<template>
  <div class="s-context" @contextmenu.prevent="show">
    <slot />
    <Teleport to="body">
      <ul
        v-if="open"
        class="s-context__menu"
        :style="{ left: `${x}px`, top: `${y}px` }"
        @click.stop
      >
        <li
          v-for="item in items"
          :key="item"
          class="s-context__item"
          @click="choose(item)"
        >
          {{ item }}
        </li>
      </ul>
    </Teleport>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

defineProps({
  items: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['select'])

const open = ref(false)
const x = ref(0)
const y = ref(0)

function show(e) {
  x.value = e.clientX
  y.value = e.clientY
  open.value = true
}
function choose(item) {
  emit('select', item)
  open.value = false
}
function close() {
  open.value = false
}
function onKey(e) {
  if (e.key === 'Escape') close()
}

onMounted(() => {
  window.addEventListener('click', close)
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('click', close)
  window.removeEventListener('keydown', onKey)
})
</script>

<style scoped>
.s-context__menu {
  position: fixed;
  min-width: 160px;
  margin: 0;
  padding: 0.25em;
  list-style: none;
  background: white;
  color: #111827;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18);
  z-index: 4000;
}
.s-context__item {
  padding: 0.45em 0.8em;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
}
.s-context__item:hover {
  background: #eff6ff;
}
</style>
