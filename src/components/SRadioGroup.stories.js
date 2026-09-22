import SRadioGroup from './SRadioGroup.vue'

export default {
  title: 'Form controls/SRadioGroup',
  component: SRadioGroup,
  tags: ['autodocs']
}

export const Default = {
  args: {
    "modelValue": "a",
    "options": [
      {
        "label": "A",
        "value": "a"
      },
      {
        "label": "B",
        "value": "b"
      }
    ],
    "name": "s-radio-group"
  }
}
