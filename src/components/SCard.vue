<template>
  <div class="s-card">
    <h3 v-if="title" class="s-card__title">{{ title }}</h3>
    <div class="s-card__body">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.s-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1em;
}
.s-card__title {
  margin: 0 0 0.5em;
}
</style>
