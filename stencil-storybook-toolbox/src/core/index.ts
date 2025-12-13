/**
 * Core shared functionality for Storybook Stencil integration
 * 
 * This module contains the shared logic used by both Storybook 9 and 10 implementations.
 * By centralizing this code, we ensure consistency and make maintenance easier.
 * 
 * Architecture:
 * - Core logic lives here (vite config generation, cache management, etc.)
 * - Version-specific exports (v9/v10) are thin wrappers that import from here
 * - This allows us to add new Storybook versions easily by creating new thin wrappers
 */

import type { UserConfig } from 'vite';
import { resolve } from 'path';
import { rmSync } from 'fs';
import type { UseStencilOptions, ViteFinalConfig } from '../types';

/**
 * Default cache directories to clear when clearCache option is enabled.
 * These are the standard locations where Storybook and Vite store cache files.
 */
const DEFAULT_CACHE_DIRS = [
  'node_modules/.vite-storybook',
  '.storybook-cache',
];

/**
 * Default configuration options for useStencilVite.
 * These provide sensible defaults that work for most Stencil + Storybook setups.
 */
export const DEFAULT_OPTIONS: Required<UseStencilOptions> = {
  packageName: [],
  watchPaths: ['**/dist/**'],
  usePolling: true,
  pollingInterval: 300,
  cacheDir: resolve(process.cwd(), 'node_modules/.vite-storybook'),
  disableCache: true,
  optimizeDepsForce: true,
  clearCache: false,
  cacheDirs: DEFAULT_CACHE_DIRS,
};

/**
 * Clears the specified cache directories.
 * 
 * This function is called when clearCache option is enabled.
 * It safely removes cache directories, ignoring errors if they don't exist.
 * 
 * @param cacheDirs - Array of cache directory paths (relative to process.cwd())
 * 
 * @internal
 */
export function clearCacheDirectories(cacheDirs: string[]): void {
  const resolvedDirs = cacheDirs.map((dir) => resolve(process.cwd(), dir));

  resolvedDirs.forEach((dir) => {
    try {
      rmSync(dir, { recursive: true, force: true });
    } catch (error) {
      // Ignore errors if directory doesn't exist or can't be deleted.
      // This is expected in some cases (e.g., first run, permissions) and shouldn't fail the build.
    }
  });
}

/**
 * Merges user-provided options with defaults.
 * 
 * Uses nullish coalescing to only override defaults when values are explicitly provided.
 * This ensures that undefined values don't override sensible defaults.
 * 
 * @param options - Optional user-provided options
 * @returns Merged options with all required fields filled
 * 
 * @internal
 */
export function mergeOptions(options?: UseStencilOptions): Required<UseStencilOptions> {
  if (!options) {
    return DEFAULT_OPTIONS;
  }

  return {
    packageName: options.packageName ?? DEFAULT_OPTIONS.packageName,
    watchPaths: options.watchPaths ?? DEFAULT_OPTIONS.watchPaths,
    usePolling: options.usePolling ?? DEFAULT_OPTIONS.usePolling,
    pollingInterval: options.pollingInterval ?? DEFAULT_OPTIONS.pollingInterval,
    cacheDir: options.cacheDir ?? DEFAULT_OPTIONS.cacheDir,
    disableCache: options.disableCache ?? DEFAULT_OPTIONS.disableCache,
    optimizeDepsForce: options.optimizeDepsForce ?? DEFAULT_OPTIONS.optimizeDepsForce,
    clearCache: options.clearCache ?? DEFAULT_OPTIONS.clearCache,
    cacheDirs: options.cacheDirs ?? DEFAULT_OPTIONS.cacheDirs,
  };
}

/**
 * Creates a Stencil-optimized Vite configuration by merging base config with optimizations.
 * 
 * This function applies the following optimizations:
 * - Server watch configuration for Stencil build output
 * - Cache control headers to prevent stale builds
 * - OptimizeDeps exclusions for Stencil packages
 * - Custom cache directory
 * 
 * @param baseConfig - Base Vite configuration (may include user customizations)
 * @param options - Merged options with defaults applied
 * @returns Enhanced Vite configuration optimized for Stencil
 * 
 * @internal
 */
export function createStencilConfig(
  baseConfig: UserConfig,
  options: Required<UseStencilOptions>
): UserConfig {
  // Normalize packageName to always be an array
  const packageNames = Array.isArray(options.packageName)
    ? options.packageName
    : options.packageName
      ? [options.packageName]
      : [];

  // Convert watch paths to ignored patterns (Vite uses negation patterns)
  // e.g., '**/dist/**' becomes '!**/dist/**' (watch this, don't ignore it)
  const watchIgnored = options.watchPaths.map((path) => `!${path}`);

  // Handle existing ignored patterns - they can be an array or a single value
  const existingIgnored = Array.isArray(baseConfig.server?.watch?.ignored)
    ? baseConfig.server.watch.ignored
    : baseConfig.server?.watch?.ignored
      ? [baseConfig.server.watch.ignored]
      : [];

  return {
    ...baseConfig,
    server: {
      ...baseConfig.server,
      watch: {
        ...baseConfig.server?.watch,
        // Merge existing ignored patterns with our watch paths
        ignored: [...existingIgnored, ...watchIgnored],
        usePolling: options.usePolling,
        interval: options.pollingInterval,
      },
      headers: options.disableCache
        ? {
            ...baseConfig.server?.headers,
            'Cache-Control': 'no-store, no-cache, must-revalidate',
          }
        : baseConfig.server?.headers,
    },
    optimizeDeps: {
      ...baseConfig.optimizeDeps,
      exclude: [
        ...(baseConfig.optimizeDeps?.exclude || []),
        ...packageNames,
      ],
      force: options.optimizeDepsForce,
    },
    cacheDir: options.cacheDir,
  };
}

/**
 * Creates the viteFinal function for Storybook configuration.
 * 
 * This is the main entry point that:
 * 1. Merges user options with defaults
 * 2. Optionally clears cache directories
 * 3. Returns a function that Storybook will call with the base Vite config
 * 
 * @param viteFinal - Optional user-provided viteFinal config (object or function)
 * @param options - Optional configuration options
 * @returns A function compatible with Storybook's viteFinal type
 * 
 * @internal
 */
export function createViteFinalWrapper(
  viteFinal?: ViteFinalConfig,
  options?: UseStencilOptions
) {
  const mergedOptions = mergeOptions(options);

  // Clear cache if requested (runs once when the wrapper is created, not when viteFinal is called)
  if (mergedOptions.clearCache) {
    clearCacheDirectories(mergedOptions.cacheDirs);
  }

  return async (config: UserConfig) => {
    // Apply user's viteFinal config first if provided
    // This allows users to customize the config before our optimizations are applied
    let baseConfig = config;
    if (viteFinal) {
      if (typeof viteFinal === 'function') {
        baseConfig = await viteFinal(config);
      } else {
        baseConfig = { ...config, ...viteFinal };
      }
    }

    // Apply Stencil optimizations on top of the user's config
    return createStencilConfig(baseConfig, mergedOptions);
  };
}

