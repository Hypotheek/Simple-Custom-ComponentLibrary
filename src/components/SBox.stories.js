import SBox from './SBox.vue'

export default {
  title: 'Layout & surfaces/SBox',
  component: SBox,
  tags: ['autodocs']
}

export const Default = {
  args: {
      "rounded": false
    },
  render: (args) => ({
    components: { SBox },
    setup() {
      return { args }
    },
    template: `<SBox v-bind="args">Boxed content</SBox>`
  })
}
