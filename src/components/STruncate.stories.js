import STruncate from './STruncate.vue'

export default {
  title: 'Layout & surfaces/STruncate',
  component: STruncate,
  tags: ['autodocs']
}

export const Default = {
  render: (args) => ({
    components: { STruncate },
    setup() {
      return { args }
    },
    template: `<STruncate v-bind="args">This is a long line of text that should be truncated with an ellipsis instead of wrapping</STruncate>`
  })
}
