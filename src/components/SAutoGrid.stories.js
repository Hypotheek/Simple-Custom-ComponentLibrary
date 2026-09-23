import SAutoGrid from './SAutoGrid.vue'

export default {
  title: 'Layout & surfaces/SAutoGrid',
  component: SAutoGrid,
  tags: ['autodocs']
}

export const Default = {
  args: {
      "minWidth": "200px",
      "gap": "1em"
    },
  render: (args) => ({
    components: { SAutoGrid },
    setup() {
      return { args }
    },
    template: `<SAutoGrid v-bind="args"><div style="border:1px dashed #9ca3af;padding:1em">Card 1</div><div style="border:1px dashed #9ca3af;padding:1em">Card 2</div><div style="border:1px dashed #9ca3af;padding:1em">Card 3</div><div style="border:1px dashed #9ca3af;padding:1em">Card 4</div><div style="border:1px dashed #9ca3af;padding:1em">Card 5</div><div style="border:1px dashed #9ca3af;padding:1em">Card 6</div></SAutoGrid>`
  })
}
