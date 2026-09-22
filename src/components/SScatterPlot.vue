<template>
  <div class="s-scatter">
    <svg class="s-scatter__svg" :viewBox="`0 0 ${W} ${H}`">
      <line class="s-scatter__axis" :x1="L" :x2="R" :y1="B" :y2="B" />
      <line class="s-scatter__axis" :x1="L" :x2="L" :y1="T" :y2="B" />
      <text class="s-scatter__tick" :x="L" :y="B + 14">{{ xMin }}</text>
      <text class="s-scatter__tick" :x="R" :y="B + 14" text-anchor="end">{{ xMax }}</text>
      <text class="s-scatter__tick" :x="L - 6" :y="B" text-anchor="end">{{ yMin }}</text>
      <text class="s-scatter__tick" :x="L - 6" :y="T + 8" text-anchor="end">{{ yMax }}</text>
      <g v-for="(p, i) in pts" :key="i">
        <circle
          class="s-scatter__dot"
          :class="{ 's-scatter__dot--hover': hover === i }"
          :cx="p.cx"
          :cy="p.cy"
          r="5"
        />
        <circle
          class="s-scatter__hit"
          :cx="p.cx"
          :cy="p.cy"
          r="12"
          @pointerenter="hover = i"
          @pointerleave="hover = null"
        />
      </g>
    </svg>
    <div
      v-if="hover !== null"
      class="s-scatter__tip"
      :style="{ left: `${(pts[hover].cx / W) * 100}%`, top: `${(pts[hover].cy / H) * 100}%` }"
    >
      <strong>{{ points[hover].label || `(${points[hover].x}, ${points[hover].y})` }}</strong>
      <span>{{ points[hover].x }}, {{ points[hover].y }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  points: {
    type: Array,
    default: () => []
  }
})

const W = 320
const H = 200
const L = 36
const R = 308
const T = 12
const B = 164

const hover = ref(null)

const xs = computed(() => props.points.map((p) => p.x))
const ys = computed(() => props.points.map((p) => p.y))
const xMin = computed(() => Math.min(...xs.value, 0))
const xMax = computed(() => Math.max(...xs.value, 1))
const yMin = computed(() => Math.min(...ys.value, 0))
const yMax = computed(() => Math.max(...ys.value, 1))

const pts = computed(() =>
  props.points.map((p) => ({
    cx: L + ((p.x - xMin.value) / (xMax.value - xMin.value || 1)) * (R - L),
    cy: B - ((p.y - yMin.value) / (yMax.value - yMin.value || 1)) * (B - T)
  }))
)
</script>

<style scoped>
.s-scatter {
  --surface: #fcfcfb;
  --ink: #0b0b0b;
  --muted: #898781;
  --axis: #c3c2b7;
  --s1: #2a78d6;
  position: relative;
  background: var(--surface);
  border-radius: 8px;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
}
@media (prefers-color-scheme: dark) {
  :root:where(:not([data-theme='light'])) .s-scatter {
    --surface: #1a1a19;
    --ink: #ffffff;
    --axis: #383835;
    --s1: #3987e5;
  }
}
:root[data-theme='dark'] .s-scatter {
  --surface: #1a1a19;
  --ink: #ffffff;
  --axis: #383835;
  --s1: #3987e5;
}
.s-scatter__svg {
  width: 100%;
  display: block;
  overflow: visible;
}
.s-scatter__axis {
  stroke: var(--axis);
  stroke-width: 1;
}
.s-scatter__tick {
  fill: var(--muted);
  font-size: 9px;
}
.s-scatter__dot {
  fill: var(--s1);
  fill-opacity: 0.85;
  stroke: var(--surface);
  stroke-width: 2;
  transition: r 0.12s;
}
.s-scatter__dot--hover {
  r: 7;
  fill-opacity: 1;
}
.s-scatter__hit {
  fill: transparent;
  cursor: pointer;
}
.s-scatter__tip {
  position: absolute;
  transform: translate(-50%, -130%);
  background: var(--ink);
  color: var(--surface);
  padding: 0.3em 0.55em;
  border-radius: 6px;
  font-size: 0.75em;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
  white-space: nowrap;
}
</style>
