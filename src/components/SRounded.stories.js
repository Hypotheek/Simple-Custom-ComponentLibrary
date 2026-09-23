import SRounded from './SRounded.vue'

export default {
  title: 'Layout & surfaces/SRounded',
  component: SRounded,
  tags: ['autodocs']
}

export const Default = {
  args: {
      "radius": "8px"
    },
  render: (args) => ({
    components: { SRounded },
    setup() {
      return { args }
    },
    template: `<SRounded v-bind="args"><div style="width:120px;height:80px;background:#3b82f6"></div></SRounded>`
  })
}
