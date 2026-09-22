import STabs from './STabs.vue'

export default {
  title: 'Navigation/STabs',
  component: STabs,
  tags: ['autodocs']
}

export const Default = {
  args: {
    "tabs": [
      "Overview",
      "Billing"
    ],
    "modelValue": "Overview"
  }
}
