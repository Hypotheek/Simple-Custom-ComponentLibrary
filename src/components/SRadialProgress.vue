<template>
  <div class="s-radial" :style="{ width: size, height: size }">
    <svg class="s-radial__svg" viewBox="0 0 100 100">
      <circle class="s-radial__track" cx="50" cy="50" r="42" />
      <circle
        class="s-radial__fill"
        cx="50"
        cy="50"
        r="42"
        :stroke-dasharray="`${dash} ${circ}`"
        transform="rotate(-90 50 50)"
      />
    </svg>
    <span class="s-radial__text"><slot>{{ Math.round(pct) }}%</slot></span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: Number,
    default: 0
  },
  size: {
    type: String,
    default: '96px'
  }
})

const circ = 2 * Math.PI * 42
const pct = computed(() => Math.min(100, Math.max(0, props.value)))
const dash = computed(() => (pct.value / 100) * circ)
</script>

<style scoped>
.s-radial {
  position: relative;
  display: inline-block;
}
.s-radial__svg {
  width: 100%;
  height: 100%;
}
.s-radial__track,
.s-radial__fill {
  fill: none;
  stroke-width: 8;
}
.s-radial__track {
  stroke: #e5e7eb;
}
.s-radial__fill {
  stroke: #3b82f6;
  stroke-linecap: round;
  transition: stroke-dasharray 0.5s ease;
}
.s-radial__text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.95em;
}
</style>
