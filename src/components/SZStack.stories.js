import SZStack from './SZStack.vue'

export default {
  title: 'Layout & surfaces/SZStack',
  component: SZStack,
  tags: ['autodocs']
}

export const Default = {
  render: (args) => ({
    components: { SZStack },
    setup() {
      return { args }
    },
    template: `<SZStack v-bind="args"><div style="width:120px;height:120px;background:#3b82f6"></div><div style="align-self:end;justify-self:end;padding:0.2em 0.5em;background:#ef4444;color:#fff;border-radius:999px">3</div></SZStack>`
  })
}
