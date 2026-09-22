<template>
  <div class="s-avgroup">
    <span
      v-for="(a, i) in shown"
      :key="a.name + i"
      class="s-avgroup__item"
      :style="{ width: size, height: size, background: color(a.name) }"
      :title="a.name"
    >
      <img v-if="a.src" :src="a.src" :alt="a.name" class="s-avgroup__img" />
      <template v-else>{{ initials(a.name) }}</template>
    </span>
    <span
      v-if="extra > 0"
      class="s-avgroup__item s-avgroup__item--more"
      :style="{ width: size, height: size }"
    >
      +{{ extra }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  avatars: {
    type: Array,
    default: () => []
  },
  max: {
    type: Number,
    default: 4
  },
  size: {
    type: String,
    default: '36px'
  }
})

const PALETTE = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444']

const shown = computed(() => props.avatars.slice(0, props.max))
const extra = computed(() => Math.max(0, props.avatars.length - props.max))

function initials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
function color(name) {
  let h = 0
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % PALETTE.length
  return PALETTE[h]
}
</script>

<style scoped>
.s-avgroup {
  display: inline-flex;
}
.s-avgroup__item {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -10px;
  border: 2px solid white;
  border-radius: 50%;
  color: white;
  font-size: 0.78em;
  font-weight: 700;
  overflow: hidden;
  box-sizing: border-box;
}
.s-avgroup__item:first-child {
  margin-left: 0;
}
.s-avgroup__item--more {
  background: #e5e7eb;
  color: #374151;
}
.s-avgroup__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
