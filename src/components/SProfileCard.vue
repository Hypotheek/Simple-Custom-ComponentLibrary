<template>
  <div class="s-profile">
    <div class="s-profile__avatar">
      <img v-if="avatar" :src="avatar" :alt="name" class="s-profile__img" />
      <span v-else>{{ initials }}</span>
    </div>
    <h4 class="s-profile__name">{{ name }}</h4>
    <span v-if="role" class="s-profile__role">{{ role }}</span>
    <p v-if="bio" class="s-profile__bio">{{ bio }}</p>
    <div v-if="$slots.default" class="s-profile__actions"><slot /></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  }
})

const initials = computed(() =>
  props.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
)
</script>

<style scoped>
.s-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.25em;
  padding: 1.4em 1.2em;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: white;
  color: #111827;
}
.s-profile__avatar {
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  font-size: 1.5em;
  font-weight: 700;
  overflow: hidden;
  margin-bottom: 0.4em;
}
.s-profile__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.s-profile__name {
  margin: 0;
}
.s-profile__role {
  color: #6b7280;
  font-size: 0.85em;
}
.s-profile__bio {
  margin: 0.4em 0 0;
  font-size: 0.88em;
  color: #4b5563;
}
.s-profile__actions {
  display: flex;
  gap: 0.5em;
  margin-top: 0.8em;
}
</style>
