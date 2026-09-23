import SScrollArea from './SScrollArea.vue'

export default {
  title: 'Layout & surfaces/SScrollArea',
  component: SScrollArea,
  tags: ['autodocs']
}

export const Default = {
  args: {
      "maxHeight": "300px"
    },
  render: (args) => ({
    components: { SScrollArea },
    setup() {
      return { args }
    },
    template: `<SScrollArea v-bind="args"><p>Paragraph 1 of scrollable content.</p><p>Paragraph 2 of scrollable content.</p><p>Paragraph 3 of scrollable content.</p><p>Paragraph 4 of scrollable content.</p><p>Paragraph 5 of scrollable content.</p><p>Paragraph 6 of scrollable content.</p><p>Paragraph 7 of scrollable content.</p><p>Paragraph 8 of scrollable content.</p></SScrollArea>`
  })
}
