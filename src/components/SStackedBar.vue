<template>
  <div class="s-stacked">
    <div class="s-stacked__bar">
      <div
        v-for="seg in items"
        :key="seg.label"
        class="s-stacked__seg"
        :style="{ width: `${seg.pct}%`, background: seg.color }"
        :title="`${seg.label}: ${seg.value.toLocaleString()} (${seg.pct.toFixed(0)}%)`"
      />
    </div>
    <ul class="s-stacked__legend">
      <li v-for="seg in items" :key="seg.label" class="s-stacked__item">
        <span class="s-stacked__swatch" :style="{ background: seg.color }" />
        <span>{{ seg.label }}</span>
        <strong>{{ seg.value.toLocaleString() }}</strong>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  segments: {
    type: Array,
    default: () => []
  }
})

const COLORS = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7', '#e34948']

const items = computed(() => {
  const total = props.segments.reduce((s, d) => s + d.value, 0) || 1
  return props.segments.map((d, i) => ({
    label: d.label,
    value: d.value,
    pct: (d.value / total) * 100,
    color: COLORS[i % COLORS.length]
  }))
})
</script>

<style scoped>
.s-stacked__bar {
  display: flex;
  gap: 2px;
  height: 14px;
  border-radius: 999px;
  overflow: hidden;
}
.s-stacked__seg {
  transition: width 0.4s ease;
}
.s-stacked__legend {
  list-style: none;
  margin: 0.75em 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4em 1.2em;
  font-size: 0.85em;
}
.s-stacked__item {
  display: flex;
  align-items: center;
  gap: 0.4em;
}
.s-stacked__swatch {
  width: 10px;
  height: 10px;
  border-radius: 2px;
}
</style>
