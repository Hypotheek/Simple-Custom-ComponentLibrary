import SLineChart from './SLineChart.vue'

export default {
  title: 'Charts/SLineChart',
  component: SLineChart,
  tags: ['autodocs']
}

export const Default = {
  args: {
    "data": [
      {
        "label": "Jan",
        "value": 420
      },
      {
        "label": "Feb",
        "value": 680
      },
      {
        "label": "Mar",
        "value": 540
      }
    ]
  }
}
