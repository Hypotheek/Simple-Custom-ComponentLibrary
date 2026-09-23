import SColumns from './SColumns.vue'

export default {
  title: 'Layout & surfaces/SColumns',
  component: SColumns,
  tags: ['autodocs']
}

export const Default = {
  args: {
      "count": 2,
      "gap": "2em"
    },
  render: (args) => ({
    components: { SColumns },
    setup() {
      return { args }
    },
    template: `<SColumns v-bind="args">This text flows across multiple CSS columns. Add enough of it here so more than one column actually fills up, which is the only way to see the column layout doing anything at all.</SColumns>`
  })
}
