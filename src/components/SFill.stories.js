import SFill from './SFill.vue'

export default {
  title: 'Layout & surfaces/SFill',
  component: SFill,
  tags: ['autodocs']
}

export const Default = {
  render: (args) => ({
    components: { SFill },
    setup() {
      return { args }
    },
    template: `<SFill v-bind="args"><div style="width:100%;height:100%;background:#3b82f6"></div></SFill>`
  })
}
