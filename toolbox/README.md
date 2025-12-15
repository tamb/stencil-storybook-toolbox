# storybook-addon-stenciljs

A TypeScript-first library that provides a `useStencilVite()` wrapper function for Storybook's `viteFinal` configuration. Optimized for use with Stencil 4 components in Storybook 9 and 10.

## Features

- 🎯 **TypeScript-first** - Full TypeScript support with proper type definitions
- 📦 **Storybook 9 & 10** - Support for both Storybook versions
- ⚙️ **Configurable** - Sensible defaults with full customization options
- 🔧 **Stencil 4 Ready** - Optimized for Stencil 4 build outputs
- 📊 **Component Info Addon** - View Stencil component props, state, methods, events, and more in Storybook
- 🧪 **Well Tested** - Comprehensive unit and e2e tests

## Installation

```bash
npm install --save-dev storybook-addon-stenciljs
```

## Usage

### Basic Usage (Storybook 9)

```typescript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/html-vite';
import { useStencilVite, useStencilAddon } from 'storybook-addon-stenciljs/v9';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  addons: [
    useStencilAddon(), // Adds Stencil component info panel
  ],
  viteFinal: useStencilVite(),
};

export default config;
```

### Basic Usage (Storybook 10)

```typescript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/html-vite';
import { useStencilVite, useStencilAddon } from 'storybook-addon-stenciljs/v10';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  addons: [
    useStencilAddon(), // Adds Stencil component info panel
  ],
  viteFinal: useStencilVite(),
};

export default config;
```

### With Options

```typescript
import { useStencilVite } from 'storybook-addon-stenciljs/v9';

export default {
  viteFinal: useStencilVite(undefined, {
    packageName: 'my-stencil-components',
    watchPaths: ['**/dist/**', '**/build/**'],
    usePolling: false,
  }),
};
```

### With Automatic Cache Clearing

```typescript
import { useStencilVite } from 'storybook-addon-stenciljs/v9';

export default {
  viteFinal: useStencilVite(undefined, {
    packageName: 'my-stencil-components',
  }),
};
```

### With Custom Cache Directories

```typescript
import { useStencilVite } from 'storybook-addon-stenciljs/v9';

export default {
  viteFinal: useStencilVite(undefined, {
    clearCache: true,
    cacheDirs: [
      'node_modules/.vite-storybook',
      '.storybook-cache',
      'custom-cache-dir', // Add your own cache directories
    ],
    packageName: 'my-stencil-components',
  }),
};
```

### With Custom viteFinal Config

```typescript
import { useStencilVite } from 'storybook-addon-stenciljs/v9';

export default {
  viteFinal: useStencilVite((config) => ({
    ...config,
    build: {
      outDir: 'storybook-static',
    },
  })),
};
```

### With Both Config and Options

```typescript
import { useStencilVite } from 'storybook-addon-stenciljs/v9';

export default {
  viteFinal: useStencilVite(
    (config) => ({
      ...config,
      build: {
        outDir: 'storybook-static',
      },
    }),
    {
      packageName: ['pkg1', 'pkg2'],
      usePolling: true,
    }
  ),
};
```

### npm scripts
```json
// package.json 
"scripts": {
  // default stencil scripts
  "dev": "npx concurrently \"npm run build:watch\" \"npm run storybook\"",
  "build": "stencil build",
  "build:watch": "stencil build --watch",
  "storybook": "storybook dev -p 6006"
}
```

**NOTE:** 
Before first run you must run `npm run build` to create a cache for stencil.

### tsconfig.json
```json
"compilerOptions": {
  //options
  "exclude": [
    "node_modules",
    "**/*.stories.ts", // added
    ".storybook" //added
  ]
}
```

## Configuration Options

The `useStencilVite()` function accepts an optional options object with the following properties:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `packageName` | `string \| string[]` | `[]` | Package name(s) to exclude from `optimizeDeps` |
| `watchPaths` | `string[]` | `['**/dist/**']` | Paths to watch for Stencil build output |
| `usePolling` | `boolean` | `true` | Enable polling for file watching |
| `pollingInterval` | `number` | `300` | Polling interval in milliseconds |
| `cacheDir` | `string` | `node_modules/.vite-storybook` | Custom cache directory path |
| `disableCache` | `boolean` | `true` | Disable browser caching of Stencil artifacts |
| `optimizeDepsForce` | `boolean` | `true` | Force Vite to always optimize dependencies |
| `clearCache` (WIP) | `boolean` | `false` | Automatically clear cache directories before starting |
| `cacheDirs` | `string[]` | `['node_modules/.vite-storybook', '.storybook-cache']` | Custom cache directories to clear when `clearCache` is true. Paths are resolved relative to `process.cwd()` |

## Default Behavior

The wrapper applies the following optimizations by default:

- **Server Watch**: Watches `**/dist/**` with polling enabled (interval: 300ms)
- **Cache Control**: Sets `Cache-Control: no-store, no-cache, must-revalidate` headers
- **OptimizeDeps**: Forces dependency optimization (exclude list is empty by default)
- **Cache Directory**: Uses `node_modules/.vite-storybook` for Vite cache

All defaults can be customized via the options parameter.

## Stencil Component Info Addon

The library includes a Storybook addon that displays detailed information about your Stencil components in a dedicated panel. The addon shows:

- **Props** - Component properties with types, defaults, and attributes
- **State** - Internal component state
- **Methods** - Public methods with signatures
- **Events** - Custom events the component emits
- **Listeners** - Event listeners configured on the component
- **Mixins** - Applied mixins and their properties

All sections are collapsible for easy navigation. The addon automatically detects Stencil components in your stories and extracts their metadata.

### Using the Addon

Simply add `useStencilAddon()` to your Storybook config's `addons` array:

```typescript
import { useStencilVite, useStencilAddon } from 'storybook-addon-stenciljs/v9';

export default {
  addons: [
    useStencilAddon(),
    // ... other addons
  ],
  viteFinal: useStencilVite(),
};
```

The addon will appear as a "Stencil" tab in Storybook's addon panel when viewing stories that render Stencil components.

## API

### `useStencilVite(viteFinal?, options?)`

#### Parameters

- `viteFinal` (optional): A Vite config object or function that returns a Vite config
- `options` (optional): Configuration options (see table above)

#### Returns

A function that can be used as `viteFinal` in your Storybook config.

### `useStencilAddon()`

Returns the addon configuration string for use in Storybook's `addons` array.

#### Returns

A string path to the addon preset that Storybook can load.

## TypeScript

Full TypeScript support is included. Types are automatically exported:

```typescript
import type { UseStencilOptions } from 'storybook-addon-stenciljs';
```

## Recommended npm Scripts

For a typical Stencil + Storybook setup, you may want to add these scripts to your `package.json`:

```json
{
  "scripts": {
    "build:watch": "stencil build --watch",
    "storybook": "storybook dev -p 6006",
    "dev": "npm run build:watch & npm run storybook",
    "clean:cache": "node -e \"const fs=require('fs');['node_modules/.vite-storybook','.storybook-cache'].forEach(d=>{try{fs.rmSync(d,{recursive:true,force:true})}catch(e){}})\""
  }
}
```

**Note**: If you set `clearCache: true` in your `useStencilVite()` options, you don't need the `clean:cache` script as the cache will be cleared automatically when Storybook starts.

## Requirements

- Storybook 9.x or 10.x with `@storybook/html-vite`
- Vite 5.x or 7.x
- Node.js 18+

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build the library
npm run build

# Type check
npm run typecheck
```

## License

MIT

