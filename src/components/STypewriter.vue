<template>
  <span class="s-typewriter">{{ shown }}<span class="s-typewriter__caret" /></span>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  speed: {
    type: Number,
    default: 45
  }
})
const emit = defineEmits(['done'])

const shown = ref('')
let timer = null

function start() {
  clearInterval(timer)
  shown.value = ''
  let i = 0
  timer = setInterval(() => {
    i += 1
    shown.value = props.text.slice(0, i)
    if (i >= props.text.length) {
      clearInterval(timer)
      emit('done')
    }
  }, props.speed)
}

onMounted(start)
watch(() => props.text, start)
onBeforeUnmount(() => clearInterval(timer))
</script>

<style scoped>
.s-typewriter__caret {
  display: inline-block;
  width: 2px;
  height: 1em;
  margin-left: 2px;
  vertical-align: text-bottom;
  background: currentColor;
  animation: s-typewriter-blink 0.9s steps(1) infinite;
}
@keyframes s-typewriter-blink {
  50% {
    opacity: 0;
  }
}
</style>
