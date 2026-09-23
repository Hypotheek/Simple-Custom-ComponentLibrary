import SSquare from './SSquare.vue'

export default {
  title: 'Layout & surfaces/SSquare',
  component: SSquare,
  tags: ['autodocs']
}

export const Default = {
  args: {
      "size": "4em"
    },
  render: (args) => ({
    components: { SSquare },
    setup() {
      return { args }
    },
    template: `<SSquare v-bind="args"><div style="width:100%;height:100%;background:#3b82f6"></div></SSquare>`
  })
}
