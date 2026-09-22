import SNumberInput from './SNumberInput.vue'

export default {
  title: 'Form controls/SNumberInput',
  component: SNumberInput,
  tags: ['autodocs']
}

export const Default = {
  args: {
    "modelValue": 0,
    "min": 0,
    "max": 100,
    "step": 1
  }
}
