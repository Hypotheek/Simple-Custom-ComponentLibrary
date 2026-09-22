<template>
  <div class="s-gauge">
    <svg class="s-gauge__svg" viewBox="0 0 200 124">
      <path class="s-gauge__track" :d="arc" />
      <path
        class="s-gauge__fill"
        :class="`s-gauge__fill--${level}`"
        :d="arc"
        :stroke-dasharray="`${dash} ${len}`"
      />
      <text class="s-gauge__value" x="100" y="96">{{ value.toLocaleString() }}{{ unit }}</text>
      <text v-if="label" class="s-gauge__label" x="100" y="116">{{ label }}</text>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  label: {
    type: String,
    default: ''
  },
  unit: {
    type: String,
    default: ''
  }
})

const arc = 'M 20 100 A 80 80 0 0 1 180 100'
const len = Math.PI * 80

const pct = computed(() => Math.min(1, Math.max(0, props.max ? props.value / props.max : 0)))
const dash = computed(() => pct.value * len)
const level = computed(() => (pct.value >= 0.9 ? 'danger' : pct.value >= 0.7 ? 'warning' : 'ok'))
</script>

<style scoped>
.s-gauge {
  --surface: #fcfcfb;
  --track: #cde2fb;
  --ink: #0b0b0b;
  --muted: #898781;
  --ok: #2a78d6;
  --warning: #fab219;
  --danger: #d03b3b;
  max-width: 260px;
  background: var(--surface);
  border-radius: 8px;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
}
@media (prefers-color-scheme: dark) {
  :root:where(:not([data-theme='light'])) .s-gauge {
    --surface: #1a1a19;
    --track: #184f95;
    --ink: #ffffff;
    --ok: #3987e5;
  }
}
:root[data-theme='dark'] .s-gauge {
  --surface: #1a1a19;
  --track: #184f95;
  --ink: #ffffff;
  --ok: #3987e5;
}
.s-gauge__svg {
  width: 100%;
  display: block;
}
.s-gauge__track,
.s-gauge__fill {
  fill: none;
  stroke-width: 14;
  stroke-linecap: round;
}
.s-gauge__track {
  stroke: var(--track);
}
.s-gauge__fill {
  transition: stroke-dasharray 0.6s ease;
}
.s-gauge__fill--ok {
  stroke: var(--ok);
}
.s-gauge__fill--warning {
  stroke: var(--warning);
}
.s-gauge__fill--danger {
  stroke: var(--danger);
}
.s-gauge__value {
  fill: var(--ink);
  font-size: 26px;
  font-weight: 700;
  text-anchor: middle;
}
.s-gauge__label {
  fill: var(--muted);
  font-size: 11px;
  text-anchor: middle;
}
</style>
