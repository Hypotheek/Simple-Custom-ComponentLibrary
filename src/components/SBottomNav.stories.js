import SBottomNav from './SBottomNav.vue'

export default {
  title: 'Navigation/SBottomNav',
  component: SBottomNav,
  tags: ['autodocs']
}

export const Default = {
  args: {
    "items": [
      {
        "label": "Home",
        "icon": "⌂",
        "value": "home"
      },
      {
        "label": "Stats",
        "icon": "▤",
        "value": "stats"
      }
    ],
    "modelValue": "home"
  }
}
