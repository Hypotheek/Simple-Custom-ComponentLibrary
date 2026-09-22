import SAutocomplete from './SAutocomplete.vue'

export default {
  title: 'Form controls/SAutocomplete',
  component: SAutocomplete,
  tags: ['autodocs']
}

export const Default = {
  args: {
    "modelValue": "",
    "options": [
      "Apple",
      "Apricot",
      "Banana",
      "Blueberry",
      "Cherry"
    ],
    "placeholder": ""
  }
}
