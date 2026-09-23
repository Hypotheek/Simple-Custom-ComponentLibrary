import SGap from './SGap.vue'

export default {
  title: 'Layout & surfaces/SGap',
  component: SGap,
  tags: ['autodocs']
}

export const Default = {
  args: {
      "direction": "row",
      "size": "1em"
    },
  render: (args) => ({
    components: { SGap },
    setup() {
      return { args }
    },
    template: `<SGap v-bind="args"><div style="border:1px dashed #9ca3af;padding:0.5em 1em">A</div><div style="border:1px dashed #9ca3af;padding:0.5em 1em">B</div></SGap>`
  })
}
