/**
 * Storybook 9 configuration using storybook-addon-stenciljs
 *
 * This file configures Storybook 9 with the Stencil integration.
 */

import type { StorybookConfig } from '@storybook/html-vite';
import { useStencilVite, useStencilAddon } from 'storybook-addon-stenciljs/v9';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],

  framework: {
    name: '@storybook/html-vite',
    options: {},
  },

  // Add the Stencil addon to display component information
  addons: [
    useStencilAddon(),
    // Add other addons here
    // '@storybook/addon-essentials',
    // '@storybook/addon-docs',
  ],

  // Configure Vite for optimal Stencil integration
  viteFinal: useStencilVite(undefined, {
    // Specify your Stencil component package name(s)
    packageName: 'storybook-9-demo',

    // Optional: Customize cache clearing
    // clearCache: true,

    // Optional: Add additional watch paths
    // watchPaths: ['**/dist/**', '**/build/**'],
  }),

  // docs: {
  //   autodocs: true,
  // },
};

export default config;
