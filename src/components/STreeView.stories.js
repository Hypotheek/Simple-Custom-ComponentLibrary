import STreeView from './STreeView.vue'

export default {
  title: 'Navigation/STreeView',
  component: STreeView,
  tags: ['autodocs']
}

export const Default = {
  args: {
    "nodes": [
      {
        "label": "src",
        "children": [
          {
            "label": "index.js"
          },
          {
            "label": "components",
            "children": [
              {
                "label": "SButton.vue"
              }
            ]
          }
        ]
      },
      {
        "label": "package.json"
      }
    ]
  }
}
