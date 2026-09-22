<template>
  <div class="s-avatar" :style="{ width: size, height: size }">
    <img v-if="src" :src="src" :alt="alt" class="s-avatar__img" />
    <span v-else class="s-avatar__initials">{{ initials }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: '40px'
  }
})

const initials = computed(() =>
  props.alt
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
)
</script>

<style scoped>
.s-avatar {
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-size: 0.9em;
  font-weight: 600;
  flex-shrink: 0;
}
.s-avatar__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
