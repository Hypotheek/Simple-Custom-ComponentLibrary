import SFlex from './SFlex.vue'

export default {
  title: 'Layout & surfaces/SFlex',
  component: SFlex,
  tags: ['autodocs']
}

export const Default = {
  args: {
      "direction": "row",
      "justify": "start",
      "align": "stretch",
      "wrap": false,
      "gap": "0"
    },
  render: (args) => ({
    components: { SFlex },
    setup() {
      return { args }
    },
    template: `<SFlex v-bind="args"><div style="border:1px dashed #9ca3af;padding:0.5em 1em">A</div><div style="border:1px dashed #9ca3af;padding:0.5em 1em">B</div><div style="border:1px dashed #9ca3af;padding:0.5em 1em">C</div></SFlex>`
  })
}
