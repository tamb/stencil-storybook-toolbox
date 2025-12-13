/**
 * Storybook 9 Implementation
 * 
 * This module provides Storybook 9-specific exports for the Stencil integration.
 * The actual implementation logic is shared in the core module to avoid duplication.
 * 
 * Architecture:
 * - This file is a thin wrapper that imports shared logic from ../core
 * - Storybook 9 and 10 have identical functionality, so they share the same core
 * - If Storybook 11+ requires different behavior, we can add version-specific logic here
 */

import type { StorybookConfig } from '@storybook/html-vite';
import type { UseStencilOptions, ViteFinalConfig } from '../types';
import { createViteFinalWrapper } from '../core';

/**
 * Wrapper function for Storybook 9's viteFinal configuration.
 * Applies Stencil-optimized defaults while allowing full customization.
 *
 * This function delegates to the shared core implementation, ensuring
 * consistency across Storybook versions.
 *
 * @param viteFinal - Optional viteFinal config (object or function)
 * @param options - Optional configuration options
 * @returns A function that can be used as viteFinal in Storybook config
 *
 * @example
 * ```typescript
 * import { useStencilVite } from 'storybook-addon-stenciljs/v9';
 *
 * export default {
 *   viteFinal: useStencilVite(),
 * };
 * ```
 */
export function useStencilVite(
  viteFinal?: ViteFinalConfig,
  options?: UseStencilOptions
): StorybookConfig['viteFinal'] {
  return createViteFinalWrapper(viteFinal, options);
}

/**
 * Returns the Stencil addon configuration for Storybook 9
 * 
 * @returns Addon configuration (preset path)
 * 
 * @example
 * ```typescript
 * import { useStencilAddon } from 'storybook-addon-stenciljs/v9';
 * 
 * export default {
 *   addons: [
 *     useStencilAddon(),
 *   ],
 * };
 * ```
 */
export function useStencilAddon(): string {
  // Return the preset path that Storybook can load
  return require.resolve('../addon/preset.js');
}

