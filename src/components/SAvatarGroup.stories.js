import SAvatarGroup from './SAvatarGroup.vue'

export default {
  title: 'Cards & media/SAvatarGroup',
  component: SAvatarGroup,
  tags: ['autodocs']
}

export const Default = {
  args: {
    "avatars": [
      {
        "name": "Ada L"
      },
      {
        "name": "Bob K"
      },
      {
        "name": "Cy D"
      },
      {
        "name": "Di E"
      }
    ],
    "max": 3,
    "size": "36px"
  }
}
