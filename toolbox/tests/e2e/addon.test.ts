import { describe, it, expect } from 'vitest';
import { useStencilAddon as useStencilAddonV9 } from '../../src/v9/index';
import { useStencilAddon as useStencilAddonV10 } from '../../src/v10/index';
import type { StorybookConfig } from '@storybook/html-vite';

/**
 * E2E tests for the Stencil addon
 */
describe('E2E: Stencil Addon', () => {
  describe('Storybook 9', () => {
    it('should return addon configuration', () => {
      const addon = useStencilAddonV9();
      expect(typeof addon).toBe('string');
      expect(addon).toContain('addon');
    });

    it('should work in Storybook config', () => {
      const config: StorybookConfig = {
        stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
        framework: {
          name: '@storybook/html-vite',
          options: {},
        },
        addons: [useStencilAddonV9()],
      };

      expect(config.addons).toBeDefined();
      expect(config.addons?.length).toBe(1);
    });
  });

  describe('Storybook 10', () => {
    it('should return addon configuration', () => {
      const addon = useStencilAddonV10();
      expect(typeof addon).toBe('string');
      expect(addon).toContain('addon');
    });

    it('should work in Storybook config', () => {
      const config: StorybookConfig = {
        stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
        framework: {
          name: '@storybook/html-vite',
          options: {},
        },
        addons: [useStencilAddonV10()],
      };

      expect(config.addons).toBeDefined();
      expect(config.addons?.length).toBe(1);
    });
  });

  describe('Integration', () => {
    it('should work with useStencilVite', async () => {
      const { useStencilVite, useStencilAddon } = await import('../../src/v9/index.js');

      const config: StorybookConfig = {
        stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
        framework: {
          name: '@storybook/html-vite',
          options: {},
        },
        addons: [useStencilAddon()],
        viteFinal: useStencilVite(),
      };

      expect(config.addons).toBeDefined();
      expect(config.viteFinal).toBeDefined();
    });
  });
});
