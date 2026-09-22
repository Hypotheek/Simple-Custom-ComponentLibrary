import SBarChart from './SBarChart.vue'

export default {
  title: 'Charts/SBarChart',
  component: SBarChart,
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
