import SDropdownV2 from './SDropdownV2.vue'

export default {
  title: 'Form controls/SDropdownV2',
  component: SDropdownV2,
  tags: ['autodocs']
}

export const Default = {
  args: {
    "modelValue": "",
    "options": [
      {
        "label": "All",
        "value": ""
      },
      {
        "label": "Active",
        "value": "active"
      },
      {
        "label": "Inactive",
        "value": "inactive"
      }
    ],
    "placeholder": "Select..."
  }
}
