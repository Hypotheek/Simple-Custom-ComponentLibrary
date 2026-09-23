<template>
  <div class="s-truncate">
    <slot />
  </div>
</template>

<script setup>
</script>

<style scoped>
.s-truncate {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
