<template>
  <div class="s-dropdown-v2" @pointerenter="onEnter" @pointerleave="onLeave">
    <button type="button" class="s-dropdown-v2__trigger">
      <span>{{ selectedLabel || placeholder }}</span>
      <span aria-hidden="true">▾</span>
    </button>
    <ul v-show="open" class="s-dropdown-v2__list" role="listbox">
      <li
        v-for="option in options"
        :key="option.value"
        class="s-dropdown-v2__option"
        :class="{ 's-dropdown-v2__option--selected': option.value === modelValue }"
        role="option"
        :aria-selected="option.value === modelValue"
        @click="select(option)"
      >
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>

<script>
/**
 * Dropdown with a floating option list. The list opens on hover. Desktop only: there is
 * no touch or keyboard support.
 */
export default {
  name: 'SDropdownV2'
}
</script>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  /**
   * Array of `{ label, value }` objects.
   */
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Select...'
  }
})

const emit = defineEmits(['update:modelValue'])

const open = ref(false)

const selectedLabel = computed(() => props.options.find((o) => o.value === props.modelValue)?.label ?? '')

function onEnter(event) {
  if (event.pointerType === 'mouse') open.value = true
}

function onLeave(event) {
  if (event.pointerType === 'mouse') open.value = false
}

function select(option) {
  emit('update:modelValue', option.value)
  open.value = false
}
</script>

<style scoped>
.s-dropdown-v2 {
  position: relative;
  display: inline-block;
}
.s-dropdown-v2__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space_2);
  min-width: 10em;
  padding: var(--spacing_sm) var(--spacing_md);
  border: 1px solid var(--color_border);
  border-radius: 8px;
  background: var(--color_surface);
  color: var(--color_text);
  font-size: var(--size_m);
  cursor: pointer;
}
.s-dropdown-v2__list {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 10;
  min-width: 100%;
  margin: 0;
  padding: var(--space_1) 0;
  list-style: none;
  border: 1px solid var(--color_border);
  border-radius: 8px;
  background: var(--color_surface);
  box-shadow: 0 4px 12px rgba(17, 24, 39, 0.12);
}
.s-dropdown-v2__option {
  padding: var(--spacing_sm) var(--spacing_md);
  font-size: var(--size_m);
  cursor: pointer;
}
.s-dropdown-v2__option:hover {
  background: var(--color_surface_muted);
}
.s-dropdown-v2__option--selected {
  color: var(--color_primary);
  font-weight: 600;
}
</style>
