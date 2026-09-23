<template>
  <div class="s-zstack">
    <slot />
  </div>
</template>

<script setup>
</script>

<style scoped>
.s-zstack {
  display: grid;
  grid-template-areas: 'stack';
}
.s-zstack > :deep(*) {
  grid-area: stack;
}
</style>
