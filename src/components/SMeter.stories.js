import SMeter from './SMeter.vue'

export default {
  title: 'Feedback & status/SMeter',
  component: SMeter,
  tags: ['autodocs']
}

export const Default = {
  args: {
    "value": 45,
    "max": 100,
    "label": "Storage"
  }
}
