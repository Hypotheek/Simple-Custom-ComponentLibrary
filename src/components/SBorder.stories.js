import SBorder from './SBorder.vue'

export default {
  title: 'Layout & surfaces/SBorder',
  component: SBorder,
  tags: ['autodocs']
}

export const Default = {
  args: {
      "width": "1px",
      "color": "#e5e7eb",
      "radius": "8px"
    },
  render: (args) => ({
    components: { SBorder },
    setup() {
      return { args }
    },
    template: `<SBorder v-bind="args"><div style="padding:0.5em 1em">Bordered content</div></SBorder>`
  })
}
