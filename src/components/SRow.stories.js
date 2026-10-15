import SRow from './SRow.vue'

export default {
  title: 'Layout & surfaces/SRow',
  component: SRow,
  tags: ['autodocs']
}

export const Default = {
  args: {
      "gutter": 0,
      "align": "start",
      "justify": "start",
      "wrap": false
    },
  render: (args) => ({
    components: { SRow },
    setup() {
      return { args }
    },
    template: `<SRow v-bind="args"><div style="border:1px dashed #9ca3af;padding:0.5em 1em">A</div><div style="border:1px dashed #9ca3af;padding:0.5em 1em">B</div><div style="border:1px dashed #9ca3af;padding:0.5em 1em">C</div></SRow>`
  })
}
