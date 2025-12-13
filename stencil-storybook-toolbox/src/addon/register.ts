/**
 * Addon registration entry point
 * This file is used by Storybook to register the addon
 */

import { registerStencilAddon } from './manager';

// Storybook will provide the API
declare const addons: {
  register: (id: string, callback: (api: any) => void) => void;
  getChannel: () => {
    on: (event: string, callback: (data: any) => void) => void;
    emit: (event: string, data: any) => void;
  };
};

const ADDON_ID = 'storybook-addon-stenciljs';
const PANEL_ID = `${ADDON_ID}/panel`;

// Register the addon
if (typeof addons !== 'undefined') {
  addons.register(ADDON_ID, (api) => {
    // Register the panel
    api.add(PANEL_ID, {
      type: 'panel',
      title: 'Stencil',
      match: ({ viewMode }: { viewMode: string }) => viewMode === 'story',
      render: ({ active, key }: { active?: boolean; key: string }) => {
        // Create panel element
        const panelElement = document.createElement('div');
        panelElement.id = `stencil-panel-${key}`;
        
        // Import the render function dynamically
        import('./panel-simple.js').then(({ renderStencilPanel }) => {
          // Listen for component info updates
          const channel = api.getChannel();
          const updatePanel = (info: any) => {
            renderStencilPanel(panelElement, info);
          };
          
          channel.on('stencil-addon/component-info', updatePanel);
          
          // Initial render
          updatePanel(null);
        });
        
        return panelElement;
      },
    });

    // Register the addon functionality
    registerStencilAddon(api);
  });
}

