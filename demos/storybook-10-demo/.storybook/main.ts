/**
 * Storybook 10 configuration using storybook-addon-stenciljs
 *
 * This file configures Storybook 10 with the Stencil integration.
 */

import type { StorybookConfig } from '@storybook/html-vite';
import { useStencilVite, useStencilAddon } from 'storybook-addon-stenciljs/v10';

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
  viteFinal: useStencilVite(),
};

export default config;

