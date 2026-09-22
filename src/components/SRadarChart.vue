<template>
  <div class="s-radar">
    <svg class="s-radar__svg" viewBox="0 0 260 240">
      <polygon
        v-for="ring in rings"
        :key="ring.k"
        class="s-radar__ring"
        :points="ring.points"
      />
      <line
        v-for="(a, i) in axes"
        :key="'a' + i"
        class="s-radar__axis"
        :x1="cx"
        :y1="cy"
        :x2="a.x"
        :y2="a.y"
      />
      <polygon class="s-radar__area" :points="areaPoints" />
      <circle v-for="(p, i) in dataPts" :key="'p' + i" class="s-radar__dot" :cx="p.x" :cy="p.y" r="4">
        <title>{{ data[i].label }}: {{ data[i].value }}</title>
      </circle>
      <text
        v-for="(a, i) in axes"
        :key="'t' + i"
        class="s-radar__label"
        :x="a.lx"
        :y="a.ly"
        :text-anchor="a.anchor"
      >
        {{ data[i].label }}
      </text>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  max: {
    type: Number,
    default: 0
  }
})

const cx = 130
const cy = 120
const radius = 80

const top = computed(() => props.max || Math.max(...props.data.map((d) => d.value), 1))

function angle(i) {
  return -Math.PI / 2 + (i * 2 * Math.PI) / (props.data.length || 1)
}

const axes = computed(() =>
  props.data.map((_, i) => {
    const a = angle(i)
    const cos = Math.cos(a)
    return {
      x: cx + Math.cos(a) * radius,
      y: cy + Math.sin(a) * radius,
      lx: cx + Math.cos(a) * (radius + 12),
      ly: cy + Math.sin(a) * (radius + 12) + 3,
      anchor: Math.abs(cos) < 0.2 ? 'middle' : cos > 0 ? 'start' : 'end'
    }
  })
)

const rings = computed(() =>
  [0.25, 0.5, 0.75, 1].map((f) => ({
    k: f,
    points: props.data
      .map((_, i) => `${cx + Math.cos(angle(i)) * radius * f},${cy + Math.sin(angle(i)) * radius * f}`)
      .join(' ')
  }))
)

const dataPts = computed(() =>
  props.data.map((d, i) => {
    const f = Math.min(1, d.value / top.value)
    return { x: cx + Math.cos(angle(i)) * radius * f, y: cy + Math.sin(angle(i)) * radius * f }
  })
)

const areaPoints = computed(() => dataPts.value.map((p) => `${p.x},${p.y}`).join(' '))
</script>

<style scoped>
.s-radar {
  --surface: #fcfcfb;
  --muted: #898781;
  --grid: #e1e0d9;
  --s1: #2a78d6;
  max-width: 320px;
  background: var(--surface);
  border-radius: 8px;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
}
@media (prefers-color-scheme: dark) {
  :root:where(:not([data-theme='light'])) .s-radar {
    --surface: #1a1a19;
    --grid: #2c2c2a;
    --s1: #3987e5;
  }
}
:root[data-theme='dark'] .s-radar {
  --surface: #1a1a19;
  --grid: #2c2c2a;
  --s1: #3987e5;
}
.s-radar__svg {
  width: 100%;
  display: block;
}
.s-radar__ring {
  fill: none;
  stroke: var(--grid);
  stroke-width: 1;
}
.s-radar__axis {
  stroke: var(--grid);
  stroke-width: 1;
}
.s-radar__area {
  fill: var(--s1);
  fill-opacity: 0.16;
  stroke: var(--s1);
  stroke-width: 2;
  stroke-linejoin: round;
}
.s-radar__dot {
  fill: var(--s1);
  stroke: var(--surface);
  stroke-width: 2;
}
.s-radar__label {
  fill: var(--muted);
  font-size: 10px;
}
</style>
