import SToggleGroup from './SToggleGroup.vue'

export default {
  title: 'Form controls/SToggleGroup',
  component: SToggleGroup,
  tags: ['autodocs']
}

export const Default = {
  args: {
    "modelValue": "day",
    "options": [
      {
        "label": "Day",
        "value": "day"
      },
      {
        "label": "Week",
        "value": "week"
      }
    ]
  }
}
