import SSticky from './SSticky.vue'

export default {
  title: 'Layout & surfaces/SSticky',
  component: SSticky,
  tags: ['autodocs']
}

export const Default = {
  args: {
      "top": "0",
      "zIndex": 10
    },
  render: (args) => ({
    components: { SSticky },
    setup() {
      return { args }
    },
    template: `<SSticky v-bind="args"><div style="padding:0.5em 1em;background:#eef2ff">Sticky bar</div></SSticky>`
  })
}
