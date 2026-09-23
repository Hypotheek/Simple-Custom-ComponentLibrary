import SCenter from './SCenter.vue'

export default {
  title: 'Layout & surfaces/SCenter',
  component: SCenter,
  tags: ['autodocs']
}

export const Default = {
  args: {
      "inline": false
    },
  render: (args) => ({
    components: { SCenter },
    setup() {
      return { args }
    },
    template: `<SCenter v-bind="args"><div style="border:1px dashed #9ca3af;padding:0.5em 1em">Centered</div></SCenter>`
  })
}
