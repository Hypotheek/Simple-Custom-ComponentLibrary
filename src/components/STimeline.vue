<template>
  <div class="s-timeline">
    <div v-for="(item, i) in items" :key="i" class="s-timeline__item">
      <span class="s-timeline__dot" />
      <div class="s-timeline__content">
        <slot :item="item">{{ item }}</slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.s-timeline {
  border-left: 2px solid #e5e7eb;
  padding-left: 1.25em;
}
.s-timeline__item {
  position: relative;
  padding-bottom: 1.25em;
}
.s-timeline__dot {
  position: absolute;
  left: -1.55em;
  top: 0.2em;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #3b82f6;
}
</style>
