import SEqualCols from './SEqualCols.vue'

export default {
  title: 'Layout & surfaces/SEqualCols',
  component: SEqualCols,
  tags: ['autodocs']
}

export const Default = {
  args: {
      "gap": "1em"
    },
  render: (args) => ({
    components: { SEqualCols },
    setup() {
      return { args }
    },
    template: `<SEqualCols v-bind="args"><div style="border:1px dashed #9ca3af;padding:0.5em">Col A</div><div style="border:1px dashed #9ca3af;padding:0.5em">Col B</div><div style="border:1px dashed #9ca3af;padding:0.5em">Col C</div></SEqualCols>`
  })
}
