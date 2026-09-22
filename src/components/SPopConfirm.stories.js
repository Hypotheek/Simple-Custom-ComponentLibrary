import SPopConfirm from './SPopConfirm.vue'

export default {
  title: 'Overlays/SPopConfirm',
  component: SPopConfirm,
  tags: ['autodocs']
}

export const Default = {
  args: {
    "message": "Are you sure?",
    "confirmText": "Yes",
    "cancelText": "No"
  }
}
