/**
 * Storybook Manager API registration for the Stencil addon
 * This file registers the addon panel in Storybook's manager UI
 */

import { extractStencilInfo, getStencilElement } from './utils';

// Storybook addon API types
export interface AddonAPI {
  getChannel: () => {
    on: (event: string, callback: (data: unknown) => void) => void;
    emit: (event: string, data: unknown) => void;
  };
  on: (event: string, callback: (data: unknown) => void) => void;
  off: (event: string, callback: (data: unknown) => void) => void;
  add: (
    id: string,
    config: {
      type: string;
      title: string;
      match: (params: { viewMode: string }) => boolean;
      render: (params: { active?: boolean; key: string }) => HTMLElement;
    },
  ) => void;
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
