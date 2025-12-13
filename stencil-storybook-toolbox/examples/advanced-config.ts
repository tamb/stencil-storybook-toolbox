/**
 * Advanced example showing all configuration options
 * 
 * This demonstrates how to use useStencilVite with custom viteFinal config
 * and all available options.
 */

import type { StorybookConfig } from '@storybook/html-vite';
import { useStencilVite, useStencilAddon } from 'storybook-addon-stenciljs/v9';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  
  addons: [
    useStencilAddon(),
  ],
  
  // Example: Using useStencilVite with custom viteFinal config and options
  viteFinal: useStencilVite(
    // Custom viteFinal function - runs before Stencil optimizations
    (baseConfig) => ({
      ...baseConfig,
      // Add custom Vite plugins
      // plugins: [...baseConfig.plugins, myCustomPlugin()],
      
      // Custom build options
      build: {
        ...baseConfig.build,
        outDir: 'storybook-static',
      },
    }),
    // Stencil-specific options
    {
      // Exclude multiple packages from optimizeDeps
      packageName: ['my-stencil-components', 'another-stencil-package'],
      
      // Watch multiple build output directories
      watchPaths: ['**/dist/**', '**/build/**', '**/output/**'],
      
      // Disable polling (use native file watching)
      usePolling: false,
      
      // Custom polling interval (if polling is enabled)
      pollingInterval: 500,
      
      // Custom cache directory
      cacheDir: './custom-cache/.vite-storybook',
      
      // Disable cache control headers (allow browser caching)
      disableCache: false,
      
      // Don't force optimizeDeps (use Vite's default behavior)
      optimizeDepsForce: false,
      
      // Automatically clear cache on startup
      clearCache: true,
      
      // Custom cache directories to clear
      cacheDirs: [
        'node_modules/.vite-storybook',
        '.storybook-cache',
        './custom-cache',
      ],
    }
  ),
};

export default config;

