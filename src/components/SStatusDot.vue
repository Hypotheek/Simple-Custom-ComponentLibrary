<template>
  <span class="s-status">
    <span class="s-status__dot" :class="`s-status__dot--${status}`" />
    <span v-if="label || $slots.default" class="s-status__label"><slot>{{ label }}</slot></span>
  </span>
</template>

<script setup>
defineProps({
  status: {
    type: String,
    default: 'online'
  },
  label: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.s-status {
  display: inline-flex;
  align-items: center;
  gap: 0.45em;
  font-size: 0.9em;
}
.s-status__dot {
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #9ca3af;
}
.s-status__dot--online {
  background: #22c55e;
}
.s-status__dot--online::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: #22c55e;
  animation: s-status-ping 1.6s ease-out infinite;
}
.s-status__dot--away {
  background: #f59e0b;
}
.s-status__dot--busy {
  background: #ef4444;
}
@keyframes s-status-ping {
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  100% {
    transform: scale(2.6);
    opacity: 0;
  }
}
</style>
