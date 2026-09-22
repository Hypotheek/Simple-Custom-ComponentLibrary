import STable from './STable.vue'

export default {
  title: 'Data display/STable',
  component: STable,
  tags: ['autodocs']
}

export const Default = {
  args: {
    "columns": [
      "name",
      "role"
    ],
    "rows": [
      {
        "name": "Ada",
        "role": "Engineer"
      },
      {
        "name": "Bob",
        "role": "Designer"
      }
    ]
  }
}
