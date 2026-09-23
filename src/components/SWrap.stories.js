import SWrap from './SWrap.vue'

export default {
  title: 'Layout & surfaces/SWrap',
  component: SWrap,
  tags: ['autodocs']
}

export const Default = {
  args: {
      "gap": "0.5em",
      "justify": "start"
    },
  render: (args) => ({
    components: { SWrap },
    setup() {
      return { args }
    },
    template: `<SWrap v-bind="args"><div style="border:1px dashed #9ca3af;padding:0.5em 1em">Item 1</div><div style="border:1px dashed #9ca3af;padding:0.5em 1em">Item 2</div><div style="border:1px dashed #9ca3af;padding:0.5em 1em">Item 3</div><div style="border:1px dashed #9ca3af;padding:0.5em 1em">Item 4</div><div style="border:1px dashed #9ca3af;padding:0.5em 1em">Item 5</div><div style="border:1px dashed #9ca3af;padding:0.5em 1em">Item 6</div></SWrap>`
  })
}
