<template>
  <svg
    class="s-icon"
    :width="SIZES[size]"
    :height="SIZES[size]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
  >
    <path v-if="ICONS[name]" :d="ICONS[name]" />
  </svg>
</template>

<script>
const SIZES = { sm: 16, md: 20, lg: 24 }

const ICONS = {
  plus: 'M12 5v14M5 12h14',
  cross: 'M6 6l12 12M18 6L6 18',
  tick: 'M5 12.5l4.5 4.5L19 7.5',
  pencil: 'M4 20l1-4L16 5l3 3L8 19l-4 1zM14 7l3 3',
  trash: 'M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13',
  magnifier: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM16 16l4 4',
  person: 'M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 20c0-4 4-6 8-6s8 2 8 6',
  calendar: 'M5 6h14v14H5zM5 10h14M9 4v4M15 4v4',
  clock: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM12 8v4l3 2',
  funnel: 'M4 5h16l-6 8v6l-4-2v-4z',
  bars: 'M4 7h16M4 12h16M4 17h16',
  info: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM12 11v5M12 8v.01',
  alert: 'M12 4l9 16H3zM12 10v4M12 17v.01',
  bookmark: 'M7 4h10v16l-5-4-5 4z',
  flag: 'M6 4v17M6 5h11l-2 4 2 4H6',
  pin: 'M12 3a5 5 0 0 0-5 5c0 4 5 12 5 12s5-8 5-12a5 5 0 0 0-5-5zM12 8v.01',
  envelope: 'M4 6h16v12H4zM4 7l8 6 8-6',
  house: 'M4 11l8-7 8 7M6 10v10h12V10',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  lock: 'M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3',
  'arrow-down': 'M12 5v14M6 13l6 6 6-6'
}

export default {
  name: 'SIcon'
}
</script>

<script setup>
defineProps({
  /**
   * Icon name. One of: plus, cross, tick, pencil, trash, magnifier, person, calendar,
   * clock, funnel, bars, info, alert, bookmark, flag, pin, envelope, house, eye, lock,
   * arrow-down. Any other name renders nothing.
   */
  name: {
    type: String,
    required: true,
    validator: (value) => value in ICONS
  },
  size: {
    type: String,
    default: 'md'
  },
  /**
   * Accessible label. Without one the icon is treated as decoration.
   */
  label: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.s-icon {
  flex: none;
  vertical-align: middle;
}
</style>
