/** @type { import('@storybook/vue3-vite').StorybookConfig } */
const config = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    "@storybook/addon-mcp",
    '@storybook/addon-vitest',
    '@storybook/addon-a11y'
  ],
  framework: '@storybook/vue3-vite',
  features: {
    componentsManifest: true,
    experimentalDocgenServer: true,
    experimentalReview: true,

  },
};
export default config;
