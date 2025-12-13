/**
 * Storybook preset for the Stencil addon
 * This allows the addon to be used in the addons array
 */

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  managerEntries: [join(__dirname, 'manager.js')],
};
