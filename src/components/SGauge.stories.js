import SGauge from './SGauge.vue'

export default {
  title: 'Charts/SGauge',
  component: SGauge,
  tags: ['autodocs']
}

export const Default = {
  args: {
    "value": 72,
    "max": 100,
    "label": "CPU",
    "unit": "%"
  }
}
