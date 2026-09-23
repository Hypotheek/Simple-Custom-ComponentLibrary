import SOverlay from './SOverlay.vue'

export default {
  title: 'Layout & surfaces/SOverlay',
  component: SOverlay,
  tags: ['autodocs']
}

export const Default = {
  render: (args) => ({
    components: { SOverlay },
    setup() {
      return { args }
    },
    template: `<SOverlay v-bind="args"><div style="width:100%;height:100%;background:rgba(59,130,246,0.35)"></div></SOverlay>`
  })
}
