<template>
  <div class="s-flip" :style="{ height }" @click="flipped = !flipped">
    <div class="s-flip__inner" :class="{ 's-flip__inner--flipped': flipped }">
      <div class="s-flip__face s-flip__front"><slot name="front" /></div>
      <div class="s-flip__face s-flip__back"><slot name="back" /></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  height: {
    type: String,
    default: '160px'
  }
})

const flipped = ref(false)
</script>

<style scoped>
.s-flip {
  perspective: 900px;
  cursor: pointer;
}
.s-flip__inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}
.s-flip__inner--flipped {
  transform: rotateY(180deg);
}
.s-flip__face {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1em;
  box-sizing: border-box;
  border-radius: 12px;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  text-align: center;
}
.s-flip__front {
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: white;
}
.s-flip__back {
  background: #111827;
  color: white;
  transform: rotateY(180deg);
}
</style>
