<template>
  <svg class="s-sparkline" :viewBox="`0 0 ${vbWidth} ${vbHeight}`" preserveAspectRatio="none" :data-positive="positive">
    <path :d="areaPath" class="s-sparkline__area" />
    <path :d="linePath" class="s-sparkline__line" />
    <circle v-if="points.length" :cx="points[points.length - 1].x" :cy="points[points.length - 1].y" r="2.5" class="s-sparkline__dot" />
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  positive: {
    type: Boolean,
    default: null
  }
})

const vbWidth = 100
const vbHeight = 28

const points = computed(() => {
  const n = props.data.length
  if (!n) return []
  const max = Math.max(...props.data, 1)
  const min = Math.min(...props.data, 0)
  const range = max - min || 1
  return props.data.map((v, i) => ({
    x: n === 1 ? vbWidth / 2 : (i / (n - 1)) * vbWidth,
    y: vbHeight - ((v - min) / range) * vbHeight
  }))
})

const linePath = computed(() =>
  points.value.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ')
)

const areaPath = computed(() => {
  if (!points.value.length) return ''
  const last = points.value[points.value.length - 1]
  const first = points.value[0]
  return `${linePath.value} L ${last.x},${vbHeight} L ${first.x},${vbHeight} Z`
})
</script>

<style scoped>
.s-sparkline {
  --line-color: #2a78d6;
  width: 100px;
  height: 28px;
  display: block;
  overflow: visible;
}
.s-sparkline[data-positive='true'] {
  --line-color: #006300;
}
.s-sparkline[data-positive='false'] {
  --line-color: #d03b3b;
}
.s-sparkline__line {
  fill: none;
  stroke: var(--line-color);
  stroke-width: 1.5;
  stroke-linejoin: round;
  stroke-linecap: round;
}
.s-sparkline__area {
  fill: var(--line-color);
  opacity: 0.12;
  stroke: none;
}
.s-sparkline__dot {
  fill: var(--line-color);
}
</style>
