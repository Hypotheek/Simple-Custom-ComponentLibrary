import SJsonViewer from './SJsonViewer.vue'

export default {
  title: 'Data display/SJsonViewer',
  component: SJsonViewer,
  tags: ['autodocs']
}

export const Default = {
  args: {
    "value": {
      "name": "lib",
      "version": 1,
      "tags": [
        "a",
        "b"
      ],
      "ok": true
    }
  }
}
