import SScatterPlot from './SScatterPlot.vue'

export default {
  title: 'Charts/SScatterPlot',
  component: SScatterPlot,
  tags: ['autodocs']
}

export const Default = {
  args: {
    "points": [
      {
        "x": 1,
        "y": 3,
        "label": "A"
      },
      {
        "x": 2,
        "y": 7,
        "label": "B"
      },
      {
        "x": 4,
        "y": 5,
        "label": "C"
      }
    ]
  }
}
