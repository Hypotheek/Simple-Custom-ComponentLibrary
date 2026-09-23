import SAspectRatio from './SAspectRatio.vue'

export default {
  title: 'Layout & surfaces/SAspectRatio',
  component: SAspectRatio,
  tags: ['autodocs']
}

export const Default = {
  args: {
      "ratio": "1 / 1"
    },
  render: (args) => ({
    components: { SAspectRatio },
    setup() {
      return { args }
    },
    template: `<SAspectRatio v-bind="args"><div style="width:100%;height:100%;background:#3b82f6"></div></SAspectRatio>`
  })
}
