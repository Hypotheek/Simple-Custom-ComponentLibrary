<template>
  <div class="s-donutchart">
    <div class="s-donutchart__body">
      <svg class="s-donutchart__svg" viewBox="0 0 200 200">
        <g transform="rotate(-90 100 100)">
          <circle
            v-for="(seg, i) in segments"
            :key="seg.label"
            class="s-donutchart__seg"
            :class="{ 's-donutchart__seg--hover': hoverIndex === i }"
            cx="100"
            cy="100"
            :r="radius"
            :stroke="seg.color"
            :stroke-width="hoverIndex === i ? strokeWidth + 4 : strokeWidth"
            :stroke-dasharray="`${seg.dash} ${circumference}`"
            :stroke-dashoffset="-seg.offset"
            fill="none"
            @pointerenter="hoverIndex = i"
            @pointerleave="hoverIndex = null"
          />
        </g>
        <text class="s-donutchart__total" x="100" y="96">{{ total.toLocaleString() }}</text>
        <text class="s-donutchart__total-label" x="100" y="118">{{ centerLabel }}</text>
      </svg>

      <ul class="s-donutchart__legend">
        <li
          v-for="(seg, i) in segments"
          :key="seg.label"
          class="s-donutchart__legend-item"
          :class="{ 's-donutchart__legend-item--hover': hoverIndex === i }"
          @pointerenter="hoverIndex = i"
          @pointerleave="hoverIndex = null"
        >
          <span class="s-donutchart__swatch" :style="{ background: seg.color }" />
          <span class="s-donutchart__legend-label">{{ seg.label }}</span>
          <span class="s-donutchart__legend-value">{{ seg.percent }}%</span>
        </li>
      </ul>
    </div>

    <div v-if="hoverIndex !== null" class="s-donutchart__tooltip">
      <strong>{{ segments[hoverIndex].value.toLocaleString() }}</strong>
      <span>{{ segments[hoverIndex].label }} · {{ segments[hoverIndex].percent }}%</span>
    </div>

    <button class="s-donutchart__toggle" @click="showTable = !showTable">
      {{ showTable ? 'Hide table' : 'View as table' }}
    </button>
    <table v-if="showTable" class="s-donutchart__table">
      <thead>
        <tr><th>Label</th><th>Value</th><th>Share</th></tr>
      </thead>
      <tbody>
        <tr v-for="seg in segments" :key="seg.label">
          <td>{{ seg.label }}</td>
          <td>{{ seg.value.toLocaleString() }}</td>
          <td>{{ seg.percent }}%</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  centerLabel: {
    type: String,
    default: 'Total'
  }
})

const CATEGORICAL = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7', '#e34948']
const OTHER_COLOR = '#898781'
const MAX_SLOTS = 8

const radius = 70
const strokeWidth = 28
const circumference = 2 * Math.PI * radius
const GAP = 3

const hoverIndex = ref(null)
const showTable = ref(false)

const rawData = computed(() => {
  if (props.data.length <= MAX_SLOTS) return props.data
  const shown = props.data.slice(0, MAX_SLOTS - 1)
  const rest = props.data.slice(MAX_SLOTS - 1)
  const otherValue = rest.reduce((sum, d) => sum + d.value, 0)
  return [...shown, { label: 'Other', value: otherValue }]
})

const total = computed(() => rawData.value.reduce((sum, d) => sum + d.value, 0))

const segments = computed(() => {
  let cumulative = 0
  return rawData.value.map((d, i) => {
    const percent = total.value === 0 ? 0 : Math.round((d.value / total.value) * 100)
    const dash = total.value === 0 ? 0 : (d.value / total.value) * circumference
    const offset = cumulative
    cumulative += dash
    return {
      label: d.label,
      value: d.value,
      percent,
      dash: Math.max(dash - GAP, 0),
      offset,
      color: d.label === 'Other' ? OTHER_COLOR : CATEGORICAL[i % CATEGORICAL.length]
    }
  })
})
</script>

<style scoped>
.s-donutchart {
  --surface: #fcfcfb;
  --text-primary: #0b0b0b;
  --text-secondary: #52514e;
  --muted: #898781;
  --grid: #e1e0d9;
  position: relative;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  background: var(--surface);
  color-scheme: light;
}
@media (prefers-color-scheme: dark) {
  :root:where(:not([data-theme='light'])) .s-donutchart {
    --surface: #1a1a19;
    --text-primary: #ffffff;
    --text-secondary: #c3c2b7;
    --muted: #898781;
    --grid: #2c2c2a;
    color-scheme: dark;
  }
}
:root[data-theme='dark'] .s-donutchart {
  --surface: #1a1a19;
  --text-primary: #ffffff;
  --text-secondary: #c3c2b7;
  --muted: #898781;
  --grid: #2c2c2a;
  color-scheme: dark;
}

.s-donutchart__body {
  display: flex;
  align-items: center;
  gap: 1.5em;
  flex-wrap: wrap;
}
.s-donutchart__svg {
  width: 160px;
  height: 160px;
  flex-shrink: 0;
  animation: s-donutchart-in 0.5s ease;
}
@keyframes s-donutchart-in {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.s-donutchart__seg {
  transition: stroke-width 0.15s;
  cursor: pointer;
}
.s-donutchart__total {
  fill: var(--text-primary);
  font-size: 26px;
  font-weight: 700;
  text-anchor: middle;
  transform-origin: 100px 100px;
}
.s-donutchart__total-label {
  fill: var(--muted);
  font-size: 11px;
  text-anchor: middle;
  transform-origin: 100px 100px;
}
.s-donutchart__legend {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  flex: 1;
  min-width: 140px;
}
.s-donutchart__legend-item {
  display: flex;
  align-items: center;
  gap: 0.5em;
  cursor: pointer;
  padding: 0.15em 0.3em;
  border-radius: 4px;
  font-size: 0.85em;
}
.s-donutchart__legend-item--hover {
  background: var(--grid);
}
.s-donutchart__swatch {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  flex-shrink: 0;
}
.s-donutchart__legend-label {
  color: var(--text-primary);
  flex: 1;
}
.s-donutchart__legend-value {
  color: var(--text-secondary);
}
.s-donutchart__tooltip {
  margin-top: 0.75em;
  display: inline-flex;
  flex-direction: column;
  background: var(--text-primary);
  color: var(--surface);
  padding: 0.4em 0.6em;
  border-radius: 6px;
  font-size: 0.8em;
}
.s-donutchart__tooltip strong {
  font-size: 1.05em;
}
.s-donutchart__toggle {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 0.8em;
  cursor: pointer;
  padding: 0.6em 0 0;
  text-decoration: underline;
  display: block;
}
.s-donutchart__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85em;
  margin-top: 0.4em;
}
.s-donutchart__table th,
.s-donutchart__table td {
  text-align: left;
  padding: 0.4em 0.6em;
  border-bottom: 1px solid var(--grid);
  color: var(--text-primary);
}
</style>
