<template>
  <nav class="s-navbar">
    <span class="s-navbar__title">{{ title }}</span>
    <div class="s-navbar__actions">
      <slot />
    </div>
  </nav>
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
.s-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75em 1.25em;
  background: #111827;
  color: white;
}
.s-navbar__title {
  font-weight: 600;
  font-size: 1.1em;
}
.s-navbar__actions {
  display: flex;
  align-items: center;
  gap: 0.75em;
}
</style>
