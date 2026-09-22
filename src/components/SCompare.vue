<template>
  <div class="s-compare">
    <div class="s-compare__stage">
      <div class="s-compare__layer">
        <slot name="after"><img v-if="afterSrc" class="s-compare__img" :src="afterSrc" alt="After" /></slot>
      </div>
      <div class="s-compare__layer" :style="{ clipPath: `inset(0 ${100 - position}% 0 0)` }">
        <slot name="before"><img v-if="beforeSrc" class="s-compare__img" :src="beforeSrc" alt="Before" /></slot>
      </div>
      <div class="s-compare__line" :style="{ left: `${position}%` }">
        <span class="s-compare__knob">↔</span>
      </div>
    </div>
    <input
      v-model.number="position"
      class="s-compare__range"
      type="range"
      min="0"
      max="100"
      aria-label="Comparison position"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  beforeSrc: {
    type: String,
    default: ''
  },
  afterSrc: {
    type: String,
    default: ''
  }
})

const position = ref(50)
</script>

<style scoped>
.s-compare__stage {
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  min-height: 120px;
  background: #e5e7eb;
}
.s-compare__layer {
  position: absolute;
  inset: 0;
}
.s-compare__layer:first-child {
  position: relative;
}
.s-compare__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.s-compare__line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: white;
  transform: translateX(-1px);
  pointer-events: none;
}
.s-compare__knob {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: white;
  color: #111827;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  font-size: 0.85em;
}
.s-compare__range {
  width: 100%;
  margin: 0.5em 0 0;
  accent-color: #3b82f6;
}
</style>
