import SRadarChart from './SRadarChart.vue'

export default {
  title: 'Charts/SRadarChart',
  component: SRadarChart,
  tags: ['autodocs']
}

export const Default = {
  args: {
    "data": [
      {
        "label": "Speed",
        "value": 80
      },
      {
        "label": "Power",
        "value": 60
      },
      {
        "label": "Range",
        "value": 90
      },
      {
        "label": "Skill",
        "value": 50
      }
    ],
    "max": 0
  }
}
