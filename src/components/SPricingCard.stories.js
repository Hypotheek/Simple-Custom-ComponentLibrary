import SPricingCard from './SPricingCard.vue'

export default {
  title: 'Cards & media/SPricingCard',
  component: SPricingCard,
  tags: ['autodocs']
}

export const Default = {
  args: {
    "title": "Pro",
    "price": "$19",
    "period": "month",
    "features": [
      "Feature 1",
      "Feature 2"
    ],
    "highlighted": false,
    "buttonText": "Choose plan"
  }
}
