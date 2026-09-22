<template>
  <div class="s-result">
    <div class="s-result__icon" :class="`s-result__icon--${status}`">{{ icons[status] || icons.info }}</div>
    <h3 class="s-result__title">{{ title }}</h3>
    <p v-if="subtitle" class="s-result__subtitle">{{ subtitle }}</p>
    <div v-if="$slots.default" class="s-result__extra"><slot /></div>
  </div>
</template>

<script setup>
defineProps({
  status: {
    type: String,
    default: 'success'
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  }
})

const icons = { success: '✓', error: '✕', warning: '!', info: 'i' }
</script>

<style scoped>
.s-result {
  text-align: center;
  padding: 1.5em 1em;
}
.s-result__icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 0.8em;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: white;
  font-size: 1.6em;
  font-weight: 700;
}
.s-result__icon--success {
  background: #22c55e;
}
.s-result__icon--error {
  background: #ef4444;
}
.s-result__icon--warning {
  background: #f59e0b;
}
.s-result__icon--info {
  background: #3b82f6;
}
.s-result__title {
  margin: 0 0 0.25em;
}
.s-result__subtitle {
  margin: 0;
  color: #6b7280;
}
.s-result__extra {
  margin-top: 1em;
}
</style>
