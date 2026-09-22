<template>
  <div class="s-countdown" role="timer">
    <div v-for="unit in units" :key="unit.label" class="s-countdown__unit">
      <span class="s-countdown__num">{{ unit.value }}</span>
      <span class="s-countdown__label">{{ unit.label }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  target: {
    type: [String, Number],
    default: 0
  }
})
const emit = defineEmits(['done'])

const now = ref(Date.now())
let timer = null
let finished = false

const remaining = computed(() => Math.max(0, new Date(props.target).getTime() - now.value))

const units = computed(() => {
  const total = Math.floor(remaining.value / 1000)
  const pad = (n) => String(n).padStart(2, '0')
  return [
    { label: 'days', value: Math.floor(total / 86400) },
    { label: 'hrs', value: pad(Math.floor((total % 86400) / 3600)) },
    { label: 'min', value: pad(Math.floor((total % 3600) / 60)) },
    { label: 'sec', value: pad(total % 60) }
  ]
})

function tick() {
  now.value = Date.now()
  if (remaining.value === 0 && !finished) {
    finished = true
    emit('done')
  }
}

onMounted(() => {
  tick()
  timer = setInterval(tick, 1000)
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<style scoped>
.s-countdown {
  display: inline-flex;
  gap: 0.6em;
}
.s-countdown__unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 3.4em;
  padding: 0.5em 0.4em;
  background: #111827;
  color: white;
  border-radius: 8px;
}
.s-countdown__num {
  font-size: 1.5em;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.s-countdown__label {
  font-size: 0.65em;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #9ca3af;
}
</style>
