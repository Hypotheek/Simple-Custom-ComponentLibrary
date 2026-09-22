<template>
  <Teleport to="body">
    <div v-if="modelValue" class="s-cmd-overlay" @click.self="close">
      <div class="s-cmd" role="dialog" aria-label="Command palette">
        <input
          ref="field"
          v-model="query"
          class="s-cmd__input"
          placeholder="Type a command..."
          @keydown.down.prevent="move(1)"
          @keydown.up.prevent="move(-1)"
          @keydown.enter.prevent="run"
          @keydown.esc="close"
        />
        <ul class="s-cmd__list">
          <li
            v-for="(cmd, i) in filtered"
            :key="cmd.label"
            class="s-cmd__item"
            :class="{ 's-cmd__item--active': i === active }"
            @mouseenter="active = i"
            @click="choose(cmd)"
          >
            <span>{{ cmd.label }}</span>
            <kbd v-if="cmd.hint" class="s-cmd__hint">{{ cmd.hint }}</kbd>
          </li>
          <li v-if="!filtered.length" class="s-cmd__empty">No matching commands</li>
        </ul>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  commands: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['update:modelValue', 'select'])

const query = ref('')
const active = ref(0)
const field = ref(null)

const filtered = computed(() => {
  const q = query.value.toLowerCase()
  return props.commands.filter((c) => c.label.toLowerCase().includes(q))
})

watch(
  () => props.modelValue,
  async (open) => {
    if (open) {
      query.value = ''
      active.value = 0
      await nextTick()
      field.value?.focus()
    }
  }
)
watch(query, () => (active.value = 0))

function close() {
  emit('update:modelValue', false)
}
function move(delta) {
  const n = filtered.value.length
  if (n) active.value = (active.value + delta + n) % n
}
function choose(cmd) {
  emit('select', cmd)
  close()
}
function run() {
  const cmd = filtered.value[active.value]
  if (cmd) choose(cmd)
}
</script>

<style scoped>
.s-cmd-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  padding-top: 14vh;
  z-index: 3500;
}
.s-cmd {
  width: min(520px, 92vw);
  height: fit-content;
  background: white;
  color: #111827;
  border-radius: 12px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
  overflow: hidden;
}
.s-cmd__input {
  width: 100%;
  box-sizing: border-box;
  padding: 0.9em 1.1em;
  border: none;
  border-bottom: 1px solid #e5e7eb;
  font-size: 1.05em;
  outline: none;
}
.s-cmd__list {
  list-style: none;
  margin: 0;
  padding: 0.35em;
  max-height: 300px;
  overflow-y: auto;
}
.s-cmd__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.55em 0.8em;
  border-radius: 7px;
  cursor: pointer;
}
.s-cmd__item--active {
  background: #eff6ff;
}
.s-cmd__hint {
  font-size: 0.75em;
  padding: 0.1em 0.45em;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  color: #4b5563;
}
.s-cmd__empty {
  padding: 0.8em;
  color: #9ca3af;
  text-align: center;
}
</style>
