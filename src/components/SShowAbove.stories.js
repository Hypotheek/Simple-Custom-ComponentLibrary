import SShowAbove from './SShowAbove.vue'

export default {
  title: 'Layout & surfaces/SShowAbove',
  component: SShowAbove,
  tags: ['autodocs']
}

export const Default = {
  args: {
      "breakpoint": "md"
    },
  render: (args) => ({
    components: { SShowAbove },
    setup() {
      return { args }
    },
    template: `<SShowAbove v-bind="args">Visible at or above the breakpoint</SShowAbove>`
  })
}
