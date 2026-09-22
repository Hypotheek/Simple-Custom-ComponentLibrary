<template>
  <article class="s-media">
    <div class="s-media__cover">
      <img v-if="image" class="s-media__img" :src="image" :alt="title" />
      <div v-else class="s-media__placeholder" />
    </div>
    <div class="s-media__body">
      <h4 class="s-media__title">{{ title }}</h4>
      <p v-if="subtitle" class="s-media__subtitle">{{ subtitle }}</p>
      <div class="s-media__content"><slot /></div>
      <div v-if="$slots.actions" class="s-media__actions"><slot name="actions" /></div>
    </div>
  </article>
</template>

<script setup>
defineProps({
  image: {
    type: String,
    default: ''
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
</script>

<style scoped>
.s-media {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  color: #111827;
}
.s-media__cover {
  height: 140px;
}
.s-media__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.s-media__placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
}
.s-media__body {
  padding: 0.9em 1em 1em;
}
.s-media__title {
  margin: 0;
  font-size: 1.05em;
}
.s-media__subtitle {
  margin: 0.15em 0 0.5em;
  font-size: 0.85em;
  color: #6b7280;
}
.s-media__content {
  font-size: 0.9em;
  color: #374151;
}
.s-media__actions {
  display: flex;
  gap: 0.5em;
  margin-top: 0.8em;
}
</style>
