<template>
  <div class="s-range">
    <div class="s-range__track" />
    <div class="s-range__fill" :style="{ left: `${leftPct}%`, right: `${100 - rightPct}%` }" />
    <input
      class="s-range__input"
      type="range"
      :min="min"
      :max="max"
      :value="low"
      @input="onLow"
    />
    <input
      class="s-range__input"
      type="range"
      :min="min"
      :max="max"
      :value="high"
      @input="onHigh"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [20, 80]
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  }
})
const emit = defineEmits(['update:modelValue'])

const low = computed(() => props.modelValue[0])
const high = computed(() => props.modelValue[1])
const span = computed(() => props.max - props.min || 1)
const leftPct = computed(() => ((low.value - props.min) / span.value) * 100)
const rightPct = computed(() => ((high.value - props.min) / span.value) * 100)

function onLow(e) {
  emit('update:modelValue', [Math.min(Number(e.target.value), high.value), high.value])
}
function onHigh(e) {
  emit('update:modelValue', [low.value, Math.max(Number(e.target.value), low.value)])
}
</script>

<style scoped>
.s-range {
  position: relative;
  height: 24px;
}
.s-range__track,
.s-range__fill {
  position: absolute;
  top: 10px;
  height: 4px;
  border-radius: 999px;
}
.s-range__track {
  left: 0;
  right: 0;
  background: #e5e7eb;
}
.s-range__fill {
  background: #3b82f6;
}
.s-range__input {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 24px;
  margin: 0;
  background: none;
  pointer-events: none;
  appearance: none;
  -webkit-appearance: none;
}
.s-range__input::-webkit-slider-runnable-track {
  background: transparent;
}
.s-range__input::-webkit-slider-thumb {
  -webkit-appearance: none;
  pointer-events: auto;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3b82f6;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}
.s-range__input::-moz-range-thumb {
  pointer-events: auto;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #3b82f6;
  border: 2px solid white;
  cursor: pointer;
}
</style>
