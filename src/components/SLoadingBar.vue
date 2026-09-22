<template>
  <Teleport to="body">
    <div v-if="active" class="s-loadingbar" role="progressbar" aria-busy="true">
      <div class="s-loadingbar__bar" />
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  active: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.s-loadingbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  overflow: hidden;
  z-index: 3000;
}
.s-loadingbar__bar {
  height: 100%;
  width: 40%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  animation: s-loadingbar-slide 1.1s ease-in-out infinite;
}
@keyframes s-loadingbar-slide {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(250%);
  }
}
</style>
