import SShowBelow from './SShowBelow.vue'

export default {
  title: 'Layout & surfaces/SShowBelow',
  component: SShowBelow,
  tags: ['autodocs']
}

export const Default = {
  args: {
      "breakpoint": "md"
    },
  render: (args) => ({
    components: { SShowBelow },
    setup() {
      return { args }
    },
    template: `<SShowBelow v-bind="args">Visible below the breakpoint</SShowBelow>`
  })
}
