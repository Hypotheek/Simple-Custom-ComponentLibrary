import SSidebar from './SSidebar.vue'

export default {
  title: 'Navigation/SSidebar',
  component: SSidebar,
  tags: ['autodocs']
}

export const Default = {
  args: {
    "items": [
      {
        "label": "Home",
        "icon": "⌂",
        "value": "home"
      },
      {
        "label": "Stats",
        "icon": "▤",
        "value": "stats"
      }
    ],
    "modelValue": "home",
    "collapsed": false
  }
}
