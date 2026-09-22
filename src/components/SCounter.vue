<template>
  <span class="s-counter">{{ prefix }}{{ formatted }}{{ suffix }}</span>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  value: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 900
  },
  decimals: {
    type: Number,
    default: 0
  },
  prefix: {
    type: String,
    default: ''
  },
  suffix: {
    type: String,
    default: ''
  }
})

const shown = ref(0)
let raf = null

const formatted = computed(() =>
  shown.value.toLocaleString(undefined, {
    minimumFractionDigits: props.decimals,
    maximumFractionDigits: props.decimals
  })
)

function animate(to) {
  cancelAnimationFrame(raf)
  const from = shown.value
  const start = performance.now()
  const step = (t) => {
    const p = Math.min(1, (t - start) / props.duration)
    const eased = 1 - Math.pow(1 - p, 3)
    shown.value = from + (to - from) * eased
    if (p < 1) raf = requestAnimationFrame(step)
  }
  raf = requestAnimationFrame(step)
}

onMounted(() => animate(props.value))
watch(() => props.value, animate)
onBeforeUnmount(() => cancelAnimationFrame(raf))
</script>

<style scoped>
.s-counter {
  font-variant-numeric: tabular-nums;
}
</style>
