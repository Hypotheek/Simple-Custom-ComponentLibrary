<template>
  <Teleport to="body">
    <div v-if="modelValue" class="s-lightbox" @click="close">
      <button class="s-lightbox__close" aria-label="Close" @click.stop="close">&times;</button>
      <img class="s-lightbox__img" :src="src" :alt="alt" @click.stop />
      <p v-if="alt" class="s-lightbox__caption">{{ alt }}</p>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  src: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update:modelValue'])

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.s-lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.88);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75em;
  z-index: 5000;
}
.s-lightbox__img {
  max-width: 90vw;
  max-height: 80vh;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}
.s-lightbox__caption {
  margin: 0;
  color: #e5e7eb;
  font-size: 0.9em;
}
.s-lightbox__close {
  position: absolute;
  top: 1em;
  right: 1.2em;
  background: none;
  border: none;
  color: white;
  font-size: 2em;
  cursor: pointer;
  line-height: 1;
}
</style>
