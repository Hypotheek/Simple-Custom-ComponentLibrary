import SFullBleed from './SFullBleed.vue'

export default {
  title: 'Layout & surfaces/SFullBleed',
  component: SFullBleed,
  tags: ['autodocs']
}

export const Default = {
  render: (args) => ({
    components: { SFullBleed },
    setup() {
      return { args }
    },
    template: `<SFullBleed v-bind="args"><div style="padding:1em;background:#eef2ff;text-align:center">Full-bleed content</div></SFullBleed>`
  })
}
