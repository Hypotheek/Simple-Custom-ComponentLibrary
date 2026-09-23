import SStack from './SStack.vue'

export default {
  title: 'Layout & surfaces/SStack',
  component: SStack,
  tags: ['autodocs']
}

export const Default = {
  args: {
      "gap": "1em",
      "align": "stretch"
    },
  render: (args) => ({
    components: { SStack },
    setup() {
      return { args }
    },
    template: `<SStack v-bind="args"><div style="border:1px dashed #9ca3af;padding:0.5em 1em">A</div><div style="border:1px dashed #9ca3af;padding:0.5em 1em">B</div><div style="border:1px dashed #9ca3af;padding:0.5em 1em">C</div></SStack>`
  })
}
