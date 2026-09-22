<template>
  <ul class="s-tree" role="tree">
    <li
      v-for="row in rows"
      :key="row.key"
      class="s-tree__row"
      :class="{ 's-tree__row--selected': row.key === selected }"
      :style="{ paddingLeft: `${row.depth * 1.1 + 0.4}em` }"
      role="treeitem"
      @click="pick(row)"
    >
      <span class="s-tree__caret">{{ row.hasChildren ? (expanded.has(row.key) ? '▾' : '▸') : '' }}</span>
      <span>{{ row.node.label }}</span>
    </li>
  </ul>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  nodes: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['select'])

const expanded = ref(new Set())
const selected = ref('')

const rows = computed(() => {
  const out = []
  const walk = (list, depth, prefix) => {
    list.forEach((node, i) => {
      const key = prefix ? `${prefix}.${i}` : `${i}`
      const hasChildren = Array.isArray(node.children) && node.children.length > 0
      out.push({ key, node, depth, hasChildren })
      if (hasChildren && expanded.value.has(key)) walk(node.children, depth + 1, key)
    })
  }
  walk(props.nodes, 0, '')
  return out
})

function pick(row) {
  selected.value = row.key
  if (row.hasChildren) {
    if (expanded.value.has(row.key)) expanded.value.delete(row.key)
    else expanded.value.add(row.key)
  }
  emit('select', row.node)
}
</script>

<style scoped>
.s-tree {
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 0.92em;
}
.s-tree__row {
  display: flex;
  align-items: center;
  gap: 0.35em;
  padding-top: 0.3em;
  padding-bottom: 0.3em;
  padding-right: 0.5em;
  border-radius: 5px;
  cursor: pointer;
  user-select: none;
}
.s-tree__row:hover {
  background: #f3f4f6;
}
.s-tree__row--selected {
  background: #eff6ff;
  color: #1d4ed8;
}
.s-tree__caret {
  width: 1em;
  color: #6b7280;
  font-size: 0.85em;
}
</style>
