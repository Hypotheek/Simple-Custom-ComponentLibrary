<template>
  <dl class="s-desc">
    <div v-for="item in items" :key="item.term" class="s-desc__row">
      <dt class="s-desc__term">{{ item.term }}</dt>
      <dd class="s-desc__detail">{{ item.description }}</dd>
    </div>
  </dl>
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
.s-desc {
  margin: 0;
}
.s-desc__row {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 1em;
  padding: 0.6em 0;
  border-bottom: 1px solid #e5e7eb;
}
.s-desc__row:last-child {
  border-bottom: none;
}
.s-desc__term {
  color: #6b7280;
  font-size: 0.9em;
}
.s-desc__detail {
  margin: 0;
  color: #111827;
}
</style>
