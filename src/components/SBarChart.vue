<template>
  <div class="s-barchart">
    <svg
      class="s-barchart__svg"
      :viewBox="`0 0 ${vbWidth} ${vbHeight}`"
      preserveAspectRatio="xMidYMid meet"
    >
      <line
        class="s-barchart__baseline"
        :x1="padding"
        :x2="vbWidth - padding"
        :y1="chartBottom"
        :y2="chartBottom"
      />
      <g v-for="(bar, i) in bars" :key="bar.label">
        <rect
          class="s-barchart__bar"
          :class="{ 's-barchart__bar--in': mounted, 's-barchart__bar--hover': hoverIndex === i }"
          :x="bar.x"
          :y="bar.y"
          :width="bar.width"
          :height="bar.height"
          :style="{ transitionDelay: `${i * 40}ms` }"
          rx="4"
        />
        <rect
          class="s-barchart__hit"
          :x="bar.x - 2"
          y="0"
          :width="bar.width + 4"
          :height="chartBottom"
          @pointerenter="hoverIndex = i"
          @pointerleave="hoverIndex = null"
        />
        <text class="s-barchart__value" :x="bar.x + bar.width / 2" :y="bar.y - 6">
          {{ bar.value.toLocaleString() }}
        </text>
        <text class="s-barchart__label" :x="bar.x + bar.width / 2" :y="chartBottom + 16">
          {{ bar.label }}
        </text>
      </g>
    </svg>

    <div
      v-if="hoverIndex !== null"
      class="s-barchart__tooltip"
      :style="{ left: `${tooltipLeft}%` }"
    >
      <strong>{{ bars[hoverIndex].value.toLocaleString() }}</strong>
      <span>{{ bars[hoverIndex].label }}</span>
    </div>

    <button class="s-barchart__toggle" @click="showTable = !showTable">
      {{ showTable ? 'Hide table' : 'View as table' }}
    </button>
    <table v-if="showTable" class="s-barchart__table">
      <thead>
        <tr><th>Label</th><th>Value</th></tr>
      </thead>
      <tbody>
        <tr v-for="bar in bars" :key="bar.label">
          <td>{{ bar.label }}</td>
          <td>{{ bar.value.toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const vbWidth = 320
const vbHeight = 200
const padding = 12
const chartTop = 24
const chartBottom = 160

const mounted = ref(false)
const hoverIndex = ref(null)
const showTable = ref(false)

onMounted(() => {
  requestAnimationFrame(() => {
    mounted.value = true
  })
})

const bars = computed(() => {
  const n = props.data.length
  if (!n) return []
  const max = Math.max(...props.data.map((d) => d.value), 1)
  const available = vbWidth - padding * 2
  const gap = 8
  const rawWidth = (available - gap * (n - 1)) / n
  const width = Math.min(24, rawWidth)
  const totalWidth = width * n + gap * (n - 1)
  const startX = padding + (available - totalWidth) / 2
  const maxBarHeight = chartBottom - chartTop

  return props.data.map((d, i) => {
    const height = max === 0 ? 0 : (d.value / max) * maxBarHeight
    return {
      label: d.label,
      value: d.value,
      x: startX + i * (width + gap),
      y: chartBottom - height,
      width,
      height
    }
  })
})

const tooltipLeft = computed(() => {
  if (hoverIndex.value === null || !bars.value[hoverIndex.value]) return 0
  const bar = bars.value[hoverIndex.value]
  return ((bar.x + bar.width / 2) / vbWidth) * 100
})
</script>

<style scoped>
.s-barchart {
  --surface: #fcfcfb;
  --text-primary: #0b0b0b;
  --text-secondary: #52514e;
  --muted: #898781;
  --grid: #e1e0d9;
  --baseline: #c3c2b7;
  --series-1: #2a78d6;
  --series-1-hover: #1c5cab;
  position: relative;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  background: var(--surface);
  color-scheme: light;
}
@media (prefers-color-scheme: dark) {
  :root:where(:not([data-theme='light'])) .s-barchart {
    --surface: #1a1a19;
    --text-primary: #ffffff;
    --text-secondary: #c3c2b7;
    --muted: #898781;
    --grid: #2c2c2a;
    --baseline: #383835;
    --series-1: #3987e5;
    --series-1-hover: #6da7ec;
    color-scheme: dark;
  }
}
:root[data-theme='dark'] .s-barchart {
  --surface: #1a1a19;
  --text-primary: #ffffff;
  --text-secondary: #c3c2b7;
  --muted: #898781;
  --grid: #2c2c2a;
  --baseline: #383835;
  --series-1: #3987e5;
  --series-1-hover: #6da7ec;
  color-scheme: dark;
}

.s-barchart__svg {
  width: 100%;
  height: auto;
  display: block;
  overflow: visible;
}
.s-barchart__baseline {
  stroke: var(--baseline);
  stroke-width: 1;
}
.s-barchart__bar {
  fill: var(--series-1);
  transform-box: fill-box;
  transform-origin: bottom;
  transform: scaleY(0);
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), fill 0.15s;
}
.s-barchart__bar--in {
  transform: scaleY(1);
}
.s-barchart__bar--hover {
  fill: var(--series-1-hover);
}
.s-barchart__hit {
  fill: transparent;
  cursor: pointer;
}
.s-barchart__value {
  fill: var(--text-secondary);
  font-size: 10px;
  text-anchor: middle;
}
.s-barchart__label {
  fill: var(--muted);
  font-size: 10px;
  text-anchor: middle;
}
.s-barchart__tooltip {
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
.s-barchart__tooltip strong {
  font-size: 1.05em;
}
.s-barchart__toggle {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 0.8em;
  cursor: pointer;
  padding: 0.3em 0;
  text-decoration: underline;
}
.s-barchart__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85em;
  margin-top: 0.4em;
}
.s-barchart__table th,
.s-barchart__table td {
  text-align: left;
  padding: 0.4em 0.6em;
  border-bottom: 1px solid var(--grid);
  color: var(--text-primary);
}
</style>
