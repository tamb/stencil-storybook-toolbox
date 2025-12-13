/**
 * Storybook Manager API registration for the Stencil addon
 * This file registers the addon panel in Storybook's manager UI
 */

import type { StencilComponentInfo } from './types';
import { extractStencilInfo, getStencilElement } from './utils';

// Storybook addon API types
interface AddonAPI {
  getChannel: () => {
    on: (event: string, callback: (data: any) => void) => void;
    emit: (event: string, data: any) => void;
  };
  on: (event: string, callback: (data: any) => void) => void;
  off: (event: string, callback: (data: any) => void) => void;
}

/**
 * Registers the Stencil addon panel
 * This should be called from the addon's manager entry point
 */
export function registerStencilAddon(api: AddonAPI) {
  const channel = api.getChannel();

  // Listen for story updates to extract component info
  channel.on('storybookjs/knobs/knobChange', () => {
    updateComponentInfo();
  });

  channel.on('storybookjs/knobs/reset', () => {
    updateComponentInfo();
  });

  // Update component info when story changes
  function updateComponentInfo() {
    const element = getStencilElement(null);
    const info = element ? extractStencilInfo(element) : null;
    channel.emit('stencil-addon/component-info', info);
  }

  // Initial update
  setTimeout(updateComponentInfo, 100);

  // Also listen for DOM updates
  if (typeof window !== 'undefined') {
    const observer = new MutationObserver(() => {
      updateComponentInfo();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
}

