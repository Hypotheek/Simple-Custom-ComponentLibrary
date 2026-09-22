<template>
  <div class="s-ribbon">
    <slot />
    <span class="s-ribbon__tag" :class="`s-ribbon__tag--${color}`">{{ text }}</span>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: 'New'
  },
  color: {
    type: String,
    default: 'blue'
  }
})
</script>

<style scoped>
.s-ribbon {
  position: relative;
  overflow: hidden;
}
.s-ribbon__tag {
  position: absolute;
  top: 14px;
  right: -34px;
  width: 120px;
  padding: 0.25em 0;
  text-align: center;
  transform: rotate(45deg);
  color: white;
  font-size: 0.72em;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}
.s-ribbon__tag--blue {
  background: #3b82f6;
}
.s-ribbon__tag--red {
  background: #ef4444;
}
.s-ribbon__tag--green {
  background: #22c55e;
}
</style>
