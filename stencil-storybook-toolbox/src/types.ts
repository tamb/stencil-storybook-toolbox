import type { UserConfig } from 'vite';

/**
 * Configuration options for the useStencilVite wrapper.
 * 
 * All options are optional and have sensible defaults that work for most Stencil + Storybook setups.
 * See the README for detailed documentation of each option.
 * 
 * @see {@link ./core/index.ts|DEFAULT_OPTIONS} for default values
 */
export interface UseStencilOptions {
  /**
   * Package name(s) to exclude from optimizeDeps.
   * Can be a single string or an array of strings.
   */
  packageName?: string | string[];

  /**
   * Paths to watch for Stencil build output.
   * Default: array containing the pattern for build output directory
   */
  watchPaths?: string[];

  /**
   * Enable polling for file watching.
   * Useful for better file system compatibility.
   * Default: true
   */
  usePolling?: boolean;

  /**
   * Polling interval in milliseconds.
   * Default: 300
   */
  pollingInterval?: number;

  /**
   * Custom cache directory path.
   * Default: 'node_modules/.vite-storybook' (relative to process.cwd())
   */
  cacheDir?: string;

  /**
   * Disable browser caching of Stencil build artifacts.
   * Default: true
   */
  disableCache?: boolean;

  /**
   * Force Vite to always optimize dependencies.
   * Default: true
   */
  optimizeDepsForce?: boolean;

  /**
   * Automatically clear cache directories before starting Storybook.
   * Default: false
   */
  clearCache?: boolean;

  /**
   * Custom cache directories to clear when clearCache is true.
   * Paths are resolved relative to process.cwd().
   * Default: ['node_modules/.vite-storybook', '.storybook-cache']
   */
  cacheDirs?: string[];
}

/**
 * Type for viteFinal config parameter.
 * 
 * Users can provide either:
 * - A Vite config object that will be merged with the base config
 * - A function that receives the base config and returns a modified config
 * 
 * This allows full customization while still applying Stencil optimizations.
 */
export type ViteFinalConfig =
  | UserConfig
  | ((config: UserConfig) => UserConfig | Promise<UserConfig>);

