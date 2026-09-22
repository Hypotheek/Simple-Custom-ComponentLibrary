<template>
  <div class="s-pricing" :class="{ 's-pricing--highlight': highlighted }">
    <span v-if="highlighted" class="s-pricing__flag">Most popular</span>
    <h4 class="s-pricing__title">{{ title }}</h4>
    <p class="s-pricing__price">
      <strong>{{ price }}</strong>
      <span v-if="period" class="s-pricing__period">/ {{ period }}</span>
    </p>
    <ul class="s-pricing__features">
      <li v-for="f in features" :key="f">✓ {{ f }}</li>
    </ul>
    <button class="s-pricing__btn" @click="$emit('select')">{{ buttonText }}</button>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  price: {
    type: String,
    default: ''
  },
  period: {
    type: String,
    default: 'month'
  },
  features: {
    type: Array,
    default: () => []
  },
  highlighted: {
    type: Boolean,
    default: false
  },
  buttonText: {
    type: String,
    default: 'Choose plan'
  }
})
defineEmits(['select'])
</script>

<style scoped>
.s-pricing {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.6em;
  padding: 1.4em 1.2em;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: white;
  color: #111827;
}
.s-pricing--highlight {
  border-color: #3b82f6;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.22);
}
.s-pricing__flag {
  position: absolute;
  top: -0.8em;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.15em 0.8em;
  background: #3b82f6;
  color: white;
  border-radius: 999px;
  font-size: 0.72em;
  font-weight: 700;
  white-space: nowrap;
}
.s-pricing__title {
  margin: 0;
  color: #6b7280;
  font-weight: 600;
}
.s-pricing__price {
  margin: 0;
}
.s-pricing__price strong {
  font-size: 2.2em;
  line-height: 1;
}
.s-pricing__period {
  color: #9ca3af;
  font-size: 0.9em;
}
.s-pricing__features {
  list-style: none;
  margin: 0.4em 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35em;
  font-size: 0.9em;
  color: #374151;
}
.s-pricing__btn {
  margin-top: auto;
  padding: 0.6em;
  border: none;
  border-radius: 8px;
  background: #111827;
  color: white;
  font-size: 0.95em;
  cursor: pointer;
}
.s-pricing--highlight .s-pricing__btn {
  background: #3b82f6;
}
</style>
