<template>
  <div class="s-hbar">
    <div v-for="row in rows" :key="row.label" class="s-hbar__row">
      <span class="s-hbar__label">{{ row.label }}</span>
      <div class="s-hbar__track">
        <div class="s-hbar__fill" :style="{ width: `${row.pct}%` }" />
      </div>
      <span class="s-hbar__value">{{ row.value.toLocaleString() }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const rows = computed(() => {
  const max = Math.max(...props.data.map((d) => d.value), 1)
  return props.data.map((d) => ({ label: d.label, value: d.value, pct: (d.value / max) * 100 }))
})
</script>

<style scoped>
.s-hbar {
  display: flex;
  flex-direction: column;
  gap: 0.55em;
  font-size: 0.85em;
}
.s-hbar__row {
  display: grid;
  grid-template-columns: 90px 1fr 56px;
  align-items: center;
  gap: 0.6em;
}
.s-hbar__label {
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.s-hbar__track {
  height: 14px;
}
.s-hbar__fill {
  height: 100%;
  max-width: 100%;
  background: #2a78d6;
  border-radius: 0 4px 4px 0;
  transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.s-hbar__value {
  font-weight: 600;
  text-align: right;
}
</style>
