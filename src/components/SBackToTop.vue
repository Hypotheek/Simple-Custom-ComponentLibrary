<template>
  <Transition name="s-btt">
    <button v-if="visible" class="s-backtotop" aria-label="Back to top" @click="toTop">↑</button>
  </Transition>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  threshold: {
    type: Number,
    default: 300
  }
})

const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > props.threshold
}
function toTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.s-backtotop {
  position: fixed;
  right: 1.5em;
  bottom: 5.6em;
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 50%;
  background: #111827;
  color: white;
  font-size: 1.2em;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  z-index: 500;
}
.s-btt-enter-active,
.s-btt-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.s-btt-enter-from,
.s-btt-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
