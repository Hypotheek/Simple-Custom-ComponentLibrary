import SColumn from './SColumn.vue'

export default {
  title: 'Layout & surfaces/SColumn',
  component: SColumn,
  tags: ['autodocs']
}

export const Default = {
  args: {
      "gutter": 0,
      "align": "stretch",
      "justify": "start"
    },
  render: (args) => ({
    components: { SColumn },
    setup() {
      return { args }
    },
    template: `<SColumn v-bind="args"><div style="border:1px dashed #9ca3af;padding:0.5em 1em">A</div><div style="border:1px dashed #9ca3af;padding:0.5em 1em">B</div><div style="border:1px dashed #9ca3af;padding:0.5em 1em">C</div></SColumn>`
  })
}
