import SSnackbar from './SSnackbar.vue'

export default {
  title: 'Feedback & status/SSnackbar',
  component: SSnackbar,
  tags: ['autodocs']
}

export const Default = {
  args: {
    "modelValue": false,
    "message": "",
    "actionLabel": "",
    "timeout": 4000
  }
}
