import SCheckboxGroup from './SCheckboxGroup.vue'

export default {
  title: 'Form controls/SCheckboxGroup',
  component: SCheckboxGroup,
  tags: ['autodocs']
}

export const Default = {
  args: {
    "modelValue": [
      "a"
    ],
    "options": [
      {
        "label": "A",
        "value": "a"
      },
      {
        "label": "B",
        "value": "b"
      }
    ]
  }
}
