/**
 * Main entry point for storybook-addon-stenciljs
 *
 * This file exports shared types that can be imported from the main package.
 * For the actual functionality, import from version-specific paths:
 *
 * - Storybook 9: import { useStencilVite, useStencilAddon } from 'storybook-addon-stenciljs/v9'
 * - Storybook 10: import { useStencilVite, useStencilAddon } from 'storybook-addon-stenciljs/v10'
 *
 * @see {@link https://github.com/your-org/storybook-addon-stenciljs#readme|README} for usage examples
 */

export type { UseStencilOptions, ViteFinalConfig } from './types';
