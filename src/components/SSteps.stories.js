import SSteps from './SSteps.vue'

export default {
  title: 'Navigation/SSteps',
  component: SSteps,
  tags: ['autodocs']
}

export const Default = {
  args: {
    "steps": [
      "Cart",
      "Shipping",
      "Payment"
    ],
    "modelValue": 1
  }
}
