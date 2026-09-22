import SStackedBar from './SStackedBar.vue'

export default {
  title: 'Charts/SStackedBar',
  component: SStackedBar,
  tags: ['autodocs']
}

export const Default = {
  args: {
    "segments": [
      {
        "label": "Web",
        "value": 540
      },
      {
        "label": "iOS",
        "value": 320
      },
      {
        "label": "Android",
        "value": 210
      }
    ]
  }
}
