import SHeatmap from './SHeatmap.vue'

export default {
  title: 'Charts/SHeatmap',
  component: SHeatmap,
  tags: ['autodocs']
}

export const Default = {
  args: {
    "data": [
      [
        1,
        4,
        8,
        3
      ],
      [
        2,
        6,
        9,
        5
      ],
      [
        0,
        3,
        7,
        2
      ]
    ],
    "rowLabels": [
      "Mon",
      "Tue",
      "Wed"
    ],
    "colLabels": [
      "9a",
      "12p",
      "3p",
      "6p"
    ]
  }
}
