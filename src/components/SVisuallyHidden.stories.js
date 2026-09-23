import SVisuallyHidden from './SVisuallyHidden.vue'

export default {
  title: 'Layout & surfaces/SVisuallyHidden',
  component: SVisuallyHidden,
  tags: ['autodocs']
}

export const Default = {
  render: (args) => ({
    components: { SVisuallyHidden },
    setup() {
      return { args }
    },
    template: `<SVisuallyHidden v-bind="args">Announced to screen readers only</SVisuallyHidden>`
  })
}
