<template>
  <div class="s-marquee">
    <div class="s-marquee__track" :style="{ animationDuration: `${speed}s` }">
      <span class="s-marquee__item"><slot /></span>
      <span class="s-marquee__item" aria-hidden="true"><slot /></span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  speed: {
    type: Number,
    default: 14
  }
})
</script>

<style scoped>
.s-marquee {
  overflow: hidden;
  white-space: nowrap;
}
.s-marquee__track {
  display: inline-flex;
  animation: s-marquee-scroll linear infinite;
}
.s-marquee:hover .s-marquee__track {
  animation-play-state: paused;
}
.s-marquee__item {
  padding-right: 3em;
}
@keyframes s-marquee-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
</style>
