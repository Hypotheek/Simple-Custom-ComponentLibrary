import SPad from './SPad.vue'

export default {
  title: 'Layout & surfaces/SPad',
  component: SPad,
  tags: ['autodocs']
}

export const Default = {
  args: {
      "size": "1em"
    },
  render: (args) => ({
    components: { SPad },
    setup() {
      return { args }
    },
    template: `<SPad v-bind="args"><div style="border:1px dashed #9ca3af">Padded content</div></SPad>`
  })
}
