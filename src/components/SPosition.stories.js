import SPosition from './SPosition.vue'

export default {
  title: 'Layout & surfaces/SPosition',
  component: SPosition,
  tags: ['autodocs']
}

export const Default = {
  args: {
      "type": "relative"
    },
  render: (args) => ({
    components: { SPosition },
    setup() {
      return { args }
    },
    template: `<SPosition v-bind="args"><div style="border:1px dashed #9ca3af;padding:0.5em 1em">Positioned</div></SPosition>`
  })
}
