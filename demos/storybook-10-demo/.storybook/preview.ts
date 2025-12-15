/**
 * Storybook preview configuration
 * 
 * This file configures the preview environment for Storybook.
 * You can add global decorators, parameters, and other preview settings here.
 */

import type { Preview } from '@storybook/html';

import { defineCustomElements } from './../loader';

defineCustomElements();

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;

