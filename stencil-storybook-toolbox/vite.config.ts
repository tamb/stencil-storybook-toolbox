import { defineConfig } from 'vite';
import { resolve } from 'path';

/**
 * Vite build configuration for the library.
 * 
 * This configures multiple entry points:
 * - Main entry: Type exports
 * - Version entries: v9 and v10 wrappers
 * - Addon entries: Storybook addon components
 * 
 * Each entry point is built separately to allow tree-shaking and clean imports.
 */
export default defineConfig({
  build: {
    lib: {
      entry: {
        // Main entry point (exports types)
        index: resolve(__dirname, 'src/index.ts'),
        // Storybook version-specific exports
        'v9/index': resolve(__dirname, 'src/v9/index.ts'),
        'v10/index': resolve(__dirname, 'src/v10/index.ts'),
        // Addon entry points (loaded by Storybook)
        'addon/manager': resolve(__dirname, 'src/addon/register.ts'),
        'addon/preset': resolve(__dirname, 'src/addon/preset.ts'),
        'addon/panel-simple': resolve(__dirname, 'src/addon/panel-simple.ts'),
      },
      formats: ['es'],
      fileName: (format, entryName) => {
        if (entryName === 'index') {
          return 'index.js';
        }
        return `${entryName}.js`;
      },
    },
    rollupOptions: {
      external: ['vite', '@storybook/html-vite'],
    },
    sourcemap: true,
    minify: false,
  },
});

