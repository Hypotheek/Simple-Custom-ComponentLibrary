<template>
  <div class="s-carousel">
    <button class="s-carousel__nav" @click="prev">‹</button>
    <div class="s-carousel__slide">
      <slot :item="slides[index]" :index="index">{{ slides[index] }}</slot>
    </div>
    <button class="s-carousel__nav" @click="next">›</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  slides: {
    type: Array,
    default: () => []
  }
})

const index = ref(0)
function next() {
  index.value = (index.value + 1) % props.slides.length
}
function prev() {
  index.value = (index.value - 1 + props.slides.length) % props.slides.length
}
</script>

<style scoped>
.s-carousel {
  display: flex;
  align-items: center;
  gap: 0.75em;
}
.s-carousel__slide {
  flex: 1;
  text-align: center;
  padding: 1em;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}
.s-carousel__nav {
  background: #e5e7eb;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  font-size: 1.1em;
}
</style>
