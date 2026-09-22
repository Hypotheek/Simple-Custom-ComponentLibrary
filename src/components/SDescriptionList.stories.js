import SDescriptionList from './SDescriptionList.vue'

export default {
  title: 'Data display/SDescriptionList',
  component: SDescriptionList,
  tags: ['autodocs']
}

export const Default = {
  args: {
    "items": [
      {
        "term": "Name",
        "description": "Ada"
      },
      {
        "term": "Role",
        "description": "Engineer"
      }
    ]
  }
}
