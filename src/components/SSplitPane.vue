<template>
  <div ref="root" class="s-split" :style="{ height }">
    <div class="s-split__pane" :style="{ width: `${percent}%` }"><slot name="left" /></div>
    <div
      class="s-split__handle"
      role="separator"
      aria-orientation="vertical"
      @pointerdown="start"
      @pointermove="move"
      @pointerup="stop"
      @pointercancel="stop"
    />
    <div class="s-split__pane s-split__pane--grow"><slot name="right" /></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  initial: {
    type: Number,
    default: 50
  },
  min: {
    type: Number,
    default: 15
  },
  height: {
    type: String,
    default: '200px'
  }
})

const root = ref(null)
const percent = ref(props.initial)
let dragging = false

function start(e) {
  dragging = true
  e.target.setPointerCapture(e.pointerId)
}
function move(e) {
  if (!dragging || !root.value) return
  const rect = root.value.getBoundingClientRect()
  const p = ((e.clientX - rect.left) / rect.width) * 100
  percent.value = Math.min(100 - props.min, Math.max(props.min, p))
}
function stop(e) {
  dragging = false
  if (e.target.hasPointerCapture?.(e.pointerId)) e.target.releasePointerCapture(e.pointerId)
}
</script>

<style scoped>
.s-split {
  display: flex;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
}
.s-split__pane {
  overflow: auto;
  padding: 0.75em;
  box-sizing: border-box;
}
.s-split__pane--grow {
  flex: 1;
}
.s-split__handle {
  width: 6px;
  flex-shrink: 0;
  background: #e5e7eb;
  cursor: col-resize;
  touch-action: none;
  transition: background 0.15s;
}
.s-split__handle:hover {
  background: #3b82f6;
}
</style>
