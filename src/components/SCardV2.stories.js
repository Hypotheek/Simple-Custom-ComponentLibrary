import SCardV2 from './SCardV2.vue'

export default {
  title: 'Layout & surfaces/SCardV2',
  component: SCardV2,
  tags: ['autodocs']
}

export const Default = {
  args: {
      "heading": "Heading",
      "subheading": "Subheading",
      "elevated": false,
      "padding": "md"
    },
  render: (args) => ({
    components: { SCardV2 },
    setup() {
      return { args }
    },
    template: `<SCardV2 v-bind="args">Card content</SCardV2>`
  })
}
