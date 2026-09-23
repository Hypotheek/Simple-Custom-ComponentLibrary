import SInline from './SInline.vue'

export default {
  title: 'Layout & surfaces/SInline',
  component: SInline,
  tags: ['autodocs']
}

export const Default = {
  args: {
      "gap": "0.5em",
      "align": "center"
    },
  render: (args) => ({
    components: { SInline },
    setup() {
      return { args }
    },
    template: `<SInline v-bind="args"><div style="border:1px dashed #9ca3af;padding:0.2em 0.6em">tag-a</div><div style="border:1px dashed #9ca3af;padding:0.2em 0.6em">tag-b</div></SInline>`
  })
}
