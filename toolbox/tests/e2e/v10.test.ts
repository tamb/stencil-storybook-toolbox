import { describe, it, expect } from 'vitest';
import { useStencilVite } from '../../src/v10/index';
import type { StorybookConfig } from '@storybook/html-vite';

/**
 * E2E test for Storybook 10 integration
 *
 * This test verifies that useStencilVite works correctly when used
 * in an actual Storybook configuration.
 */
describe('E2E: Storybook 10 Integration', () => {
  it('should create a valid Storybook config with useStencilVite', () => {
    const config: StorybookConfig = {
      stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
      framework: {
        name: '@storybook/html-vite',
        options: {},
      },
      viteFinal: useStencilVite(),
    };

    expect(config.viteFinal).toBeDefined();
    expect(typeof config.viteFinal).toBe('function');
  });

  it('should work with options', () => {
    const config: StorybookConfig = {
      stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
      framework: {
        name: '@storybook/html-vite',
        options: {},
      },
      viteFinal: useStencilVite(undefined, {
        packageName: 'test-stencil-components',
        usePolling: false,
      }),
    };

    expect(config.viteFinal).toBeDefined();
    expect(typeof config.viteFinal).toBe('function');
  });

  it('should work with custom viteFinal config', async () => {
    const config: StorybookConfig = {
      stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
      framework: {
        name: '@storybook/html-vite',
        options: {},
      },
      viteFinal: useStencilVite(baseConfig => ({
        ...baseConfig,
        build: {
          outDir: 'storybook-static',
        },
      })),
    };

    expect(config.viteFinal).toBeDefined();

    // Test that the function works
    if (config.viteFinal) {
      const result = await config.viteFinal(
        {
          server: { port: 6006 },
          // biome-ignore lint/suspicious/noExplicitAny: Test type assertion
        } as any,
        // biome-ignore lint/suspicious/noExplicitAny: Test type assertion
        {} as any,
      );

      expect(result.build?.outDir).toBe('storybook-static');
      expect(result.server?.watch).toBeDefined();
    }
  });

  it('should produce a config that can be used by Storybook', async () => {
    const viteFinal = useStencilVite(undefined, {
      packageName: 'my-components',
    });

    if (!viteFinal) {
      throw new Error('viteFinal should be defined');
    }

    const baseConfig = {
      server: {
        port: 6006,
      },
    };

    // biome-ignore lint/suspicious/noExplicitAny: Test type assertion
    const result = await viteFinal(baseConfig as any, {} as any);

    // Verify the result is a valid Vite config
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
    expect(result.server).toBeDefined();
    expect(result.optimizeDeps).toBeDefined();
    expect(result.cacheDir).toBeDefined();
  });

  it('should support clearCache option without throwing', () => {
    // This verifies that clearCache option works without errors
    // Actual cache clearing behavior is tested by verifying the function doesn't throw
    const viteFinal = useStencilVite(undefined, {
      clearCache: true,
      packageName: 'test-pkg',
    });

    expect(viteFinal).toBeDefined();
    expect(typeof viteFinal).toBe('function');
  });

  it('should support custom cacheDirs option', () => {
    const viteFinal = useStencilVite(undefined, {
      clearCache: true,
      cacheDirs: ['custom-cache-1', 'custom-cache-2'],
      packageName: 'test-pkg',
    });

    expect(viteFinal).toBeDefined();
    expect(typeof viteFinal).toBe('function');
  });
});
