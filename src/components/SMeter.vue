<template>
  <div class="s-meter">
    <div v-if="label" class="s-meter__head">
      <span>{{ label }}</span>
      <strong>{{ value }} / {{ max }}</strong>
    </div>
    <div class="s-meter__track">
      <div class="s-meter__fill" :class="`s-meter__fill--${level}`" :style="{ width: `${pct}%` }" />
    </div>
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
  }
})

const pct = computed(() => Math.min(100, Math.max(0, props.max ? (props.value / props.max) * 100 : 0)))
const level = computed(() => (pct.value >= 90 ? 'danger' : pct.value >= 70 ? 'warning' : 'ok'))
</script>

<style scoped>
.s-meter__head {
  display: flex;
  justify-content: space-between;
  font-size: 0.85em;
  margin-bottom: 0.35em;
}
.s-meter__track {
  height: 10px;
  border-radius: 999px;
  background: #cde2fb;
  overflow: hidden;
}
.s-meter__fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.4s ease, background 0.2s;
}
.s-meter__fill--ok {
  background: #2a78d6;
}
.s-meter__fill--warning {
  background: #fab219;
}
.s-meter__fill--danger {
  background: #d03b3b;
}
</style>
