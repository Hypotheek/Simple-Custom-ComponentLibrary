<template>
  <div class="s-kpi">
    <span class="s-kpi__label">{{ label }}</span>
    <div class="s-kpi__row">
      <span class="s-kpi__value">{{ value }}</span>
      <SSparkline v-if="trend.length" :data="trend" :positive="good" class="s-kpi__spark" />
    </div>
    <span v-if="delta !== null" class="s-kpi__delta" :class="good ? 's-kpi__delta--good' : 's-kpi__delta--bad'">
      {{ delta >= 0 ? '▲' : '▼' }} {{ Math.abs(delta) }}% {{ period }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import SSparkline from './SSparkline.vue'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  value: {
    type: [String, Number],
    default: ''
  },
  delta: {
    type: Number,
    default: null
  },
  period: {
    type: String,
    default: 'vs last period'
  },
  trend: {
    type: Array,
    default: () => []
  },
  upIsGood: {
    type: Boolean,
    default: true
  }
})

const good = computed(() => (props.delta === null ? null : props.delta >= 0 === props.upIsGood))
</script>

<style scoped>
.s-kpi {
  display: flex;
  flex-direction: column;
  gap: 0.3em;
  padding: 1em;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
}
.s-kpi__label {
  font-size: 0.85em;
  color: #6b7280;
}
.s-kpi__row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1em;
}
.s-kpi__value {
  font-size: 1.9em;
  font-weight: 700;
  line-height: 1.1;
}
.s-kpi__delta {
  font-size: 0.8em;
  font-weight: 600;
}
.s-kpi__delta--good {
  color: #006300;
}
.s-kpi__delta--bad {
  color: #d03b3b;
}
</style>
