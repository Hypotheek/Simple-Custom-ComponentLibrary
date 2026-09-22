<template>
  <ol class="s-vsteps">
    <li
      v-for="(step, i) in steps"
      :key="step.title"
      class="s-vsteps__item"
      :class="{
        's-vsteps__item--done': i < modelValue,
        's-vsteps__item--active': i === modelValue
      }"
    >
      <span class="s-vsteps__dot">{{ i < modelValue ? '✓' : i + 1 }}</span>
      <div class="s-vsteps__body">
        <strong class="s-vsteps__title">{{ step.title }}</strong>
        <span v-if="step.description" class="s-vsteps__desc">{{ step.description }}</span>
      </div>
    </li>
  </ol>
</template>

<script setup>
defineProps({
  steps: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: Number,
    default: 0
  }
})
</script>

<style scoped>
.s-vsteps {
  list-style: none;
  margin: 0;
  padding: 0;
}
.s-vsteps__item {
  position: relative;
  display: flex;
  gap: 0.8em;
  padding-bottom: 1.4em;
}
.s-vsteps__item:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 13px;
  top: 28px;
  bottom: 2px;
  width: 2px;
  background: #e5e7eb;
}
.s-vsteps__item--done:not(:last-child)::before {
  background: #3b82f6;
}
.s-vsteps__dot {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #e5e7eb;
  color: #6b7280;
  font-size: 0.8em;
  font-weight: 700;
}
.s-vsteps__item--done .s-vsteps__dot,
.s-vsteps__item--active .s-vsteps__dot {
  background: #3b82f6;
  color: white;
}
.s-vsteps__body {
  display: flex;
  flex-direction: column;
  padding-top: 0.2em;
}
.s-vsteps__title {
  font-size: 0.95em;
}
.s-vsteps__desc {
  font-size: 0.82em;
  color: #6b7280;
}
</style>
