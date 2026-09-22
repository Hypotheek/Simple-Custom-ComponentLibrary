import SKpiCard from './SKpiCard.vue'

export default {
  title: 'Charts/SKpiCard',
  component: SKpiCard,
  tags: ['autodocs']
}

export const Default = {
  args: {
    "label": "Revenue",
    "value": "$48.2k",
    "delta": 12,
    "period": "vs last period",
    "trend": [
      3,
      5,
      4,
      8,
      7,
      11
    ],
    "upIsGood": true
  }
}
