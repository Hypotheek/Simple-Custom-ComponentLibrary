<template>
  <span class="s-notif">
    <slot />
    <span v-if="dot && !count" class="s-notif__badge s-notif__badge--dot" />
    <span v-else-if="count > 0" class="s-notif__badge">{{ count > max ? `${max}+` : count }}</span>
  </span>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 99
  },
  dot: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.s-notif {
  position: relative;
  display: inline-flex;
}
.s-notif__badge {
  position: absolute;
  top: -6px;
  right: -8px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: #ef4444;
  color: white;
  font-size: 0.7em;
  font-weight: 700;
  box-shadow: 0 0 0 2px white;
}
.s-notif__badge--dot {
  min-width: 10px;
  width: 10px;
  height: 10px;
  padding: 0;
  top: -2px;
  right: -2px;
}
</style>
