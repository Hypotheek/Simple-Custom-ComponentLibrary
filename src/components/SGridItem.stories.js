import SGridItem from './SGridItem.vue'

export default {
  title: 'Layout & surfaces/SGridItem',
  component: SGridItem,
  tags: ['autodocs']
}

export const Default = {
  args: {
      "span": 1
    },
  render: (args) => ({
    components: { SGridItem },
    setup() {
      return { args }
    },
    template: `<SGridItem v-bind="args">Item</SGridItem>`
  })
}
