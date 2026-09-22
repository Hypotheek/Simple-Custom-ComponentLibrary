import SVerticalSteps from './SVerticalSteps.vue'

export default {
  title: 'Navigation/SVerticalSteps',
  component: SVerticalSteps,
  tags: ['autodocs']
}

export const Default = {
  args: {
    "steps": [
      {
        "title": "One",
        "description": "first"
      },
      {
        "title": "Two"
      },
      {
        "title": "Three"
      }
    ],
    "modelValue": 1
  }
}
