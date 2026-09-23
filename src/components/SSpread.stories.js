import SSpread from './SSpread.vue'

export default {
  title: 'Layout & surfaces/SSpread',
  component: SSpread,
  tags: ['autodocs']
}

export const Default = {
  args: {
      "align": "center"
    },
  render: (args) => ({
    components: { SSpread },
    setup() {
      return { args }
    },
    template: `<SSpread v-bind="args"><strong>Title</strong><div style="border:1px dashed #9ca3af;padding:0.3em 0.8em">Action</div></SSpread>`
  })
}
