import SHorizontalBar from './SHorizontalBar.vue'

export default {
  title: 'Charts/SHorizontalBar',
  component: SHorizontalBar,
  tags: ['autodocs']
}

export const Default = {
  args: {
    "data": [
      {
        "label": "Chrome",
        "value": 640
      },
      {
        "label": "Safari",
        "value": 320
      },
      {
        "label": "Firefox",
        "value": 110
      }
    ]
  }
}
