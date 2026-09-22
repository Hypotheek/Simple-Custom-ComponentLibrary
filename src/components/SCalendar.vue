<template>
  <div class="s-cal">
    <div class="s-cal__head">
      <button class="s-cal__nav" aria-label="Previous month" @click="shift(-1)">‹</button>
      <strong>{{ monthName }} {{ year }}</strong>
      <button class="s-cal__nav" aria-label="Next month" @click="shift(1)">›</button>
    </div>
    <div class="s-cal__grid">
      <span v-for="d in weekdays" :key="d" class="s-cal__dow">{{ d }}</span>
      <button
        v-for="cell in cells"
        :key="cell.key"
        class="s-cal__day"
        :class="{
          's-cal__day--blank': !cell.day,
          's-cal__day--selected': cell.iso === modelValue,
          's-cal__day--today': cell.iso === todayIso
        }"
        :disabled="!cell.day"
        @click="$emit('update:modelValue', cell.iso)"
      >
        {{ cell.day }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})
defineEmits(['update:modelValue'])

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const pad = (n) => String(n).padStart(2, '0')
const now = new Date()
const todayIso = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`

const seed = props.modelValue ? props.modelValue.split('-').map(Number) : [now.getFullYear(), now.getMonth() + 1]
const year = ref(seed[0])
const month = ref(seed[1] - 1)

const monthName = computed(() => MONTHS[month.value])

const cells = computed(() => {
  const first = new Date(year.value, month.value, 1).getDay()
  const total = new Date(year.value, month.value + 1, 0).getDate()
  const out = []
  for (let i = 0; i < first; i++) out.push({ key: `b${i}`, day: 0, iso: '' })
  for (let d = 1; d <= total; d++) {
    out.push({ key: `d${d}`, day: d, iso: `${year.value}-${pad(month.value + 1)}-${pad(d)}` })
  }
  return out
})

function shift(delta) {
  const d = new Date(year.value, month.value + delta, 1)
  year.value = d.getFullYear()
  month.value = d.getMonth()
}
</script>

<style scoped>
.s-cal {
  width: 260px;
  padding: 0.75em;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: white;
  color: #111827;
}
.s-cal__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5em;
}
.s-cal__nav {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: #f3f4f6;
  cursor: pointer;
}
.s-cal__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  text-align: center;
}
.s-cal__dow {
  font-size: 0.72em;
  color: #9ca3af;
  padding: 0.3em 0;
}
.s-cal__day {
  aspect-ratio: 1;
  border: none;
  border-radius: 6px;
  background: none;
  font-size: 0.85em;
  cursor: pointer;
}
.s-cal__day:hover:not(:disabled) {
  background: #eff6ff;
}
.s-cal__day--blank {
  visibility: hidden;
}
.s-cal__day--today {
  box-shadow: inset 0 0 0 1px #3b82f6;
}
.s-cal__day--selected {
  background: #3b82f6;
  color: white;
}
.s-cal__day--selected:hover:not(:disabled) {
  background: #3b82f6;
}
</style>
