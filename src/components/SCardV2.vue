<template>
  <div class="s-card-v2" :class="[`s-card-v2--${padding}`, { 's-card-v2--elevated': elevated }]">
    <header v-if="heading || subheading || $slots['header-action']" class="s-card-v2__header">
      <div class="s-card-v2__titles">
        <h3 v-if="heading" class="s-card-v2__heading">{{ heading }}</h3>
        <p v-if="subheading" class="s-card-v2__subheading">{{ subheading }}</p>
      </div>
      <div v-if="$slots['header-action']" class="s-card-v2__action">
        <slot name="header-action" />
      </div>
    </header>
    <div class="s-card-v2__body">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="s-card-v2__footer">
      <slot name="footer" />
    </footer>
  </div>
</template>

<script setup>
defineProps({
  heading: {
    type: String,
    default: ''
  },
  subheading: {
    type: String,
    default: ''
  },
  elevated: {
    type: Boolean,
    default: false
  },
  padding: {
    type: String,
    default: 'md'
  }
})
</script>

<style scoped>
.s-card-v2 {
  display: flex;
  flex-direction: column;
  gap: var(--space_3);
  background: var(--color_surface);
  border: 1px solid var(--color_border);
  border-radius: 12px;
  color: var(--color_text);
}
.s-card-v2--sm {
  padding: var(--spacing_sm);
}
.s-card-v2--md {
  padding: var(--spacing_md);
}
.s-card-v2--lg {
  padding: var(--spacing_lg);
}
.s-card-v2--elevated {
  border-color: transparent;
  box-shadow: 0 2px 8px rgba(17, 24, 39, 0.12);
}
.s-card-v2__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space_3);
}
.s-card-v2__heading {
  margin: 0;
  font-size: var(--size_l);
}
.s-card-v2__subheading {
  margin: 2px 0 0;
  font-size: var(--size_s);
  color: var(--color_text_muted);
}
.s-card-v2__footer {
  padding-top: var(--space_3);
  border-top: 1px solid var(--color_border);
}
</style>
