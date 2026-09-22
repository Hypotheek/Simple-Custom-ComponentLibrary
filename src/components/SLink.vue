<template>
  <a class="s-link" :href="href">
    <slot />
  </a>
</template>

<script setup>
defineProps({
  href: {
    type: String,
    default: '#'
  }
})
</script>

<style scoped>
.s-link {
  color: #3b82f6;
  text-decoration: none;
}
.s-link:hover {
  text-decoration: underline;
}
</style>
