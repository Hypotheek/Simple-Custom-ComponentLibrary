import SSelect from './SSelect.vue'

export default {
  title: 'Form controls/SSelect',
  component: SSelect,
  tags: ['autodocs']
}

export const Default = {
  args: {
    "modelValue": "free",
    "options": [
      {
        "label": "Free",
        "value": "free"
      },
      {
        "label": "Pro",
        "value": "pro"
      }
    ]
  }
}
