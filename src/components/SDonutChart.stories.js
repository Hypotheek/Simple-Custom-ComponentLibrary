import SDonutChart from './SDonutChart.vue'

export default {
  title: 'Charts/SDonutChart',
  component: SDonutChart,
  tags: ['autodocs']
}

export const Default = {
  args: {
    "data": [
      {
        "label": "Free",
        "value": 420
      },
      {
        "label": "Pro",
        "value": 210
      },
      {
        "label": "Enterprise",
        "value": 95
      }
    ],
    "centerLabel": "Total"
  }
}
