<template>
  <div class="s-linechart">
    <svg
      ref="svgEl"
      class="s-linechart__svg"
      :viewBox="`0 0 ${vbWidth} ${vbHeight}`"
      preserveAspectRatio="xMidYMid meet"
      @pointermove="onMove"
      @pointerleave="hoverIndex = null"
    >
      <defs>
        <linearGradient :id="gradientId" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--series-1)" stop-opacity="0.22" />
          <stop offset="100%" stop-color="var(--series-1)" stop-opacity="0" />
        </linearGradient>
      </defs>

      <line
        v-for="tick in yTicks"
        :key="tick.y"
        class="s-linechart__grid"
        :x1="left"
        :x2="right"
        :y1="tick.y"
        :y2="tick.y"
      />

      <path class="s-linechart__area" :d="areaPath" :fill="`url(#${gradientId})`" />
      <path ref="pathEl" class="s-linechart__line" :d="linePath" />

      <line
        v-if="hoverIndex !== null"
        class="s-linechart__crosshair"
        :x1="points[hoverIndex].x"
        :x2="points[hoverIndex].x"
        :y1="chartTop"
        :y2="chartBottom"
      />

      <circle
        class="s-linechart__end"
        :cx="points[points.length - 1]?.x"
        :cy="points[points.length - 1]?.y"
        r="4"
      />
      <circle
        v-if="hoverIndex !== null"
        class="s-linechart__dot"
        :cx="points[hoverIndex].x"
        :cy="points[hoverIndex].y"
        r="4"
      />

      <text
        v-for="(p, i) in points"
        :key="'label-' + i"
        class="s-linechart__label"
        :x="p.x"
        :y="chartBottom + 16"
      >
        {{ data[i].label }}
      </text>
    </svg>

    <div
      v-if="hoverIndex !== null"
      class="s-linechart__tooltip"
      :style="{ left: `${(points[hoverIndex].x / vbWidth) * 100}%` }"
    >
      <strong>{{ data[hoverIndex].value.toLocaleString() }}</strong>
      <span>{{ data[hoverIndex].label }}</span>
    </div>

    <button class="s-linechart__toggle" @click="showTable = !showTable">
      {{ showTable ? 'Hide table' : 'View as table' }}
    </button>
    <table v-if="showTable" class="s-linechart__table">
      <thead>
        <tr><th>Label</th><th>Value</th></tr>
      </thead>
      <tbody>
        <tr v-for="d in data" :key="d.label">
          <td>{{ d.label }}</td>
          <td>{{ d.value.toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const vbWidth = 320
const vbHeight = 200
const left = 12
const right = 308
const chartTop = 20
const chartBottom = 150

const gradientId = `s-linechart-grad-${Math.random().toString(36).slice(2, 9)}`
const svgEl = ref(null)
const pathEl = ref(null)
const hoverIndex = ref(null)
const showTable = ref(false)

const max = computed(() => Math.max(...props.data.map((d) => d.value), 1))
const min = computed(() => Math.min(...props.data.map((d) => d.value), 0))

const points = computed(() => {
  const n = props.data.length
  if (!n) return []
  const range = max.value - min.value || 1
  return props.data.map((d, i) => ({
    x: n === 1 ? (left + right) / 2 : left + (i / (n - 1)) * (right - left),
    y: chartBottom - ((d.value - min.value) / range) * (chartBottom - chartTop)
  }))
})

const linePath = computed(() =>
  points.value.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ')
)

const areaPath = computed(() => {
  if (!points.value.length) return ''
  const last = points.value[points.value.length - 1]
  const first = points.value[0]
  return `${linePath.value} L ${last.x},${chartBottom} L ${first.x},${chartBottom} Z`
})

const yTicks = computed(() => {
  const steps = 3
  return Array.from({ length: steps + 1 }, (_, i) => ({
    y: chartTop + (i / steps) * (chartBottom - chartTop)
  }))
})

onMounted(async () => {
  await nextTick()
  const el = pathEl.value
  if (!el) return
  const length = el.getTotalLength()
  el.style.strokeDasharray = `${length}`
  el.style.strokeDashoffset = `${length}`
  requestAnimationFrame(() => {
    el.style.transition = 'stroke-dashoffset 1s ease'
    el.style.strokeDashoffset = '0'
  })
})

function onMove(evt) {
  if (!svgEl.value || !points.value.length) return
  const rect = svgEl.value.getBoundingClientRect()
  const relX = ((evt.clientX - rect.left) / rect.width) * vbWidth
  let nearest = 0
  let bestDist = Infinity
  points.value.forEach((p, i) => {
    const dist = Math.abs(p.x - relX)
    if (dist < bestDist) {
      bestDist = dist
      nearest = i
    }
  })
  hoverIndex.value = nearest
}
</script>

<style scoped>
.s-linechart {
  --surface: #fcfcfb;
  --text-primary: #0b0b0b;
  --text-secondary: #52514e;
  --muted: #898781;
  --grid: #e1e0d9;
  --series-1: #2a78d6;
  position: relative;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  background: var(--surface);
  color-scheme: light;
}
@media (prefers-color-scheme: dark) {
  :root:where(:not([data-theme='light'])) .s-linechart {
    --surface: #1a1a19;
    --text-primary: #ffffff;
    --text-secondary: #c3c2b7;
    --muted: #898781;
    --grid: #2c2c2a;
    --series-1: #3987e5;
    color-scheme: dark;
  }
}
:root[data-theme='dark'] .s-linechart {
  --surface: #1a1a19;
  --text-primary: #ffffff;
  --text-secondary: #c3c2b7;
  --muted: #898781;
  --grid: #2c2c2a;
  --series-1: #3987e5;
  color-scheme: dark;
}

.s-linechart__svg {
  width: 100%;
  height: auto;
  display: block;
  overflow: visible;
  cursor: crosshair;
}
.s-linechart__grid {
  stroke: var(--grid);
  stroke-width: 1;
}
.s-linechart__line {
  fill: none;
  stroke: var(--series-1);
  stroke-width: 2;
  stroke-linejoin: round;
  stroke-linecap: round;
}
.s-linechart__area {
  stroke: none;
}
.s-linechart__crosshair {
  stroke: var(--muted);
  stroke-width: 1;
  stroke-dasharray: 3 3;
}
.s-linechart__end,
.s-linechart__dot {
  fill: var(--series-1);
  stroke: var(--surface);
  stroke-width: 2;
}
.s-linechart__label {
  fill: var(--muted);
  font-size: 10px;
  text-anchor: middle;
}
.s-linechart__tooltip {
  position: absolute;
  top: 0;
  transform: translate(-50%, -110%);
  background: var(--text-primary);
  color: var(--surface);
  padding: 0.4em 0.6em;
  border-radius: 6px;
  font-size: 0.8em;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1em;
  pointer-events: none;
  white-space: nowrap;
}
.s-linechart__tooltip strong {
  font-size: 1.05em;
}
.s-linechart__toggle {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 0.8em;
  cursor: pointer;
  padding: 0.3em 0;
  text-decoration: underline;
}
.s-linechart__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85em;
  margin-top: 0.4em;
}
.s-linechart__table th,
.s-linechart__table td {
  text-align: left;
  padding: 0.4em 0.6em;
  border-bottom: 1px solid var(--grid);
  color: var(--text-primary);
}
</style>
