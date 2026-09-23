import SHStack from './SHStack.vue'

export default {
  title: 'Layout & surfaces/SHStack',
  component: SHStack,
  tags: ['autodocs']
}

export const Default = {
  args: {
      "gap": "1em",
      "align": "center"
    },
  render: (args) => ({
    components: { SHStack },
    setup() {
      return { args }
    },
    template: `<SHStack v-bind="args"><div style="border:1px dashed #9ca3af;padding:0.5em 1em">A</div><div style="border:1px dashed #9ca3af;padding:0.5em 1em">B</div><div style="border:1px dashed #9ca3af;padding:0.5em 1em">C</div></SHStack>`
  })
}
