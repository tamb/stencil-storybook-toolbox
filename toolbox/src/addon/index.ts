/**
 * Main addon entry point
 *
 * Exports types and utilities for the Stencil addon.
 * The actual addon registration is handled by register.ts and preset.ts.
 */

export type {
  StencilComponentInfo,
  StencilProp,
  StencilState,
  StencilMethod,
  StencilEvent,
  StencilListen,
  StencilMixin,
} from './types';

export { extractStencilInfo, getStencilElement } from './utils';
export { renderStencilPanel } from './panel-simple';
