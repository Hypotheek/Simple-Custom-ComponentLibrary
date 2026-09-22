<template>
  <div class="s-heatmap" :style="{ gridTemplateColumns: `auto repeat(${cols}, 1fr)` }">
    <span />
    <span v-for="(c, i) in colLabels" :key="'c' + i" class="s-heatmap__col">{{ c }}</span>
    <template v-for="(row, r) in data" :key="'r' + r">
      <span class="s-heatmap__row">{{ rowLabels[r] }}</span>
      <div
        v-for="(v, c) in row"
        :key="c"
        class="s-heatmap__cell"
        :style="{ opacity: opacity(v) }"
        :title="`${rowLabels[r] ?? r} / ${colLabels[c] ?? c}: ${v}`"
      />
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  rowLabels: {
    type: Array,
    default: () => []
  },
  colLabels: {
    type: Array,
    default: () => []
  }
})

const cols = computed(() => (props.data[0] ? props.data[0].length : 0))
const flat = computed(() => props.data.flat())
const min = computed(() => Math.min(...flat.value, 0))
const max = computed(() => Math.max(...flat.value, 1))

function opacity(v) {
  return 0.12 + 0.88 * ((v - min.value) / (max.value - min.value || 1))
}
</script>

<style scoped>
.s-heatmap {
  display: grid;
  gap: 3px;
  align-items: center;
  font-size: 0.75em;
  color: #6b7280;
}
.s-heatmap__col {
  text-align: center;
}
.s-heatmap__row {
  padding-right: 0.5em;
  text-align: right;
}
.s-heatmap__cell {
  height: 26px;
  border-radius: 4px;
  background: #2a78d6;
  transition: transform 0.12s;
}
.s-heatmap__cell:hover {
  transform: scale(1.12);
}
</style>
