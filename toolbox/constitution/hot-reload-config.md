I want to make a `useStencil()` wrapper method for `viteFinal` in a storybook config. I want to cover both storybook 9 and storybook 10 and cater to stencil 4.  This should be typescript-first.  IT should be a library that a user can install in dev dependencies and it will work.  I want to be able to import a wrapper for v9 and v10 of storybook like this `import {useStencil} from 'stencil-storybook/v9'` and the same path pattern for v10.  I need e2e testing for this library, I need unit testing for this library, I need the wrapper to accept the entire viteFinal object as a config, but use the defaults posted in the code I will give.  

### main.ts
```ts
// ./storybook/main.ts
import { type StorybookConfig } from '@storybook/html-vite';
import { dirname, join, resolve } from "path";

const config: StorybookConfig = {
  staticDirs: ['static'], // or [{ from: 'static', to: '/' }]
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    /**
    Optional
    getAbsolutePath("@storybook/addon-designs"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-interactions"),
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-links"), 
    getAbsolutePath("@storybook/addon-docs")
    */
  ],
  framework: {
    name: getAbsolutePath('@storybook/html-vite'),
    options: {},
  },
  async viteFinal(config) {
    return {
      ...config,
      server: {
        ...config.server,
        watch: {
          ...config.server?.watch,
          // Watch the Stencil build output for changes
          ignored: ['!**/dist/**'],
          // Kind of a backup method to watching
          usePolling: true,
          interval: 300,
        },
        headers: {
          // Prevent browser caching of Stencil build artifacts
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      },
      // Disable Vite's aggressive caching for Stencil build artifacts
      optimizeDeps: {
        ...config.optimizeDeps,
        exclude: [...(config.optimizeDeps?.exclude || []), 'YOUR_PACKAGE_NAME_HERE'],
        force: true,
      },
      // Force Vite to always fetch fresh versions of build artifacts
      // You might have to swap `../node_modules with ./node_modules (note the "./")`
      cacheDir: resolve(__dirname, '../node_modules/.vite-storybook'),
    };
  },
  docs: {},
};

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
export default config;

```

### package.json
```json
//package.json
 "build:watch": "stencil build --watch",
 "dev": "npm run clean:cache && npx concurrently \"npm run build:watch\" \"npm run storybook\"",
 "clean:cache": "node -e \"const fs=require('fs');['node_modules/.vite-storybook','.storybook-cache'].forEach(d=>{try{fs.rmSync(d,{recursive:true,force:true})}catch(e){}})\"",
 "storybook": "storybook dev -p 6001 --quiet",


```