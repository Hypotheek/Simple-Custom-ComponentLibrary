import SRangeSlider from './SRangeSlider.vue'

export default {
  title: 'Form controls/SRangeSlider',
  component: SRangeSlider,
  tags: ['autodocs']
}

export const Default = {
  args: {
    "modelValue": [
      20,
      80
    ],
    "min": 0,
    "max": 100
  }
}
