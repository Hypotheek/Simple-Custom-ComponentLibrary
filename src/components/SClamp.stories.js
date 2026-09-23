import SClamp from './SClamp.vue'

export default {
  title: 'Layout & surfaces/SClamp',
  component: SClamp,
  tags: ['autodocs']
}

export const Default = {
  args: {
      "lines": 3
    },
  render: (args) => ({
    components: { SClamp },
    setup() {
      return { args }
    },
    template: `<SClamp v-bind="args">This is a long paragraph of text meant to demonstrate multi-line clamping. It keeps going for a while so you can see where the clamp cuts it off and adds an ellipsis after the configured number of lines.</SClamp>`
  })
}
