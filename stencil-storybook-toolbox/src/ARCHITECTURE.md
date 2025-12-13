# Library Architecture

This document describes the architecture of `storybook-addon-stenciljs` to help developers understand the codebase and add new features.

## Directory Structure

```
src/
├── core/              # Shared core logic (used by all Storybook versions)
│   └── index.ts      # Vite config generation, cache management, option merging
├── v9/                # Storybook 9-specific exports (thin wrapper)
│   └── index.ts      # Exports useStencilVite and useStencilAddon for v9
├── v10/               # Storybook 10-specific exports (thin wrapper)
│   └── index.ts      # Exports useStencilVite and useStencilAddon for v10
├── addon/             # Storybook addon for displaying component info
│   ├── types.ts      # TypeScript interfaces for component metadata
│   ├── utils.ts      # Functions to extract component info from DOM
│   ├── panel-simple.ts # DOM-based panel renderer (no React)
│   ├── manager.ts     # Addon manager (listens for updates)
│   ├── register.ts    # Storybook addon registration
│   └── preset.ts      # Storybook preset configuration
├── types.ts           # Shared TypeScript types (UseStencilOptions, etc.)
└── index.ts           # Main entry point (re-exports types)
```

## Design Principles

### 1. DRY (Don't Repeat Yourself)
- **Core logic is centralized** in `src/core/` to avoid duplication
- **Version-specific files** (v9, v10) are thin wrappers that import from core
- **Adding new Storybook versions** only requires creating a new thin wrapper

### 2. Separation of Concerns
- **Core module**: Vite configuration logic, cache management
- **Version modules**: Storybook version-specific exports
- **Addon module**: Completely separate feature (component info display)
- **Types**: Shared type definitions in one place

### 3. Scalability
- **Easy to add new Storybook versions**: Just create `v11/index.ts` that imports from core
- **Easy to add new features**: Create new modules (e.g., `src/feature-name/`)
- **Easy to extend addon**: Add new metadata types, new panel views, etc.

## Adding New Features

### Adding a New Storybook Version

1. Create `src/v11/index.ts`:
```typescript
import type { StorybookConfig } from '@storybook/html-vite';
import type { UseStencilOptions, ViteFinalConfig } from '../types';
import { createViteFinalWrapper } from '../core';

export function useStencilVite(
  viteFinal?: ViteFinalConfig,
  options?: UseStencilOptions
): StorybookConfig['viteFinal'] {
  return createViteFinalWrapper(viteFinal, options);
}

export function useStencilAddon(): string {
  return require.resolve('../addon/preset.js');
}
```

2. Update `vite.config.ts` to include the new entry point
3. Update `package.json` exports to include the new path

### Adding a New Configuration Option

1. **Update types** (`src/types.ts`):
```typescript
export interface UseStencilOptions {
  // ... existing options
  newOption?: string;
}
```

2. **Update defaults** (`src/core/index.ts`):
```typescript
export const DEFAULT_OPTIONS: Required<UseStencilOptions> = {
  // ... existing defaults
  newOption: 'default-value',
};
```

3. **Update mergeOptions** (`src/core/index.ts`):
```typescript
return {
  // ... existing merges
  newOption: options.newOption ?? DEFAULT_OPTIONS.newOption,
};
```

4. **Use the option** in `createStencilConfig` or wherever needed

### Adding a New Addon Feature

See `src/addon/README.md` for addon-specific architecture details.

## Code Flow

### useStencilVite Flow

```
User calls useStencilVite(options)
  ↓
v9/index.ts or v10/index.ts (thin wrapper)
  ↓
core/index.ts::createViteFinalWrapper()
  ↓
  ├─→ mergeOptions() - Merge user options with defaults
  ├─→ clearCacheDirectories() - Clear cache if requested
  └─→ Returns async function
       ↓
       When Storybook calls it:
       ├─→ Apply user's viteFinal config (if provided)
       └─→ createStencilConfig() - Apply Stencil optimizations
```

### Addon Flow

```
Storybook loads addon
  ↓
register.ts - Registers panel and manager
  ↓
manager.ts - Listens for DOM changes
  ↓
utils.ts::getStencilElement() - Finds component in DOM
  ↓
utils.ts::extractStencilInfo() - Extracts metadata
  ↓
Emits via Storybook channel
  ↓
panel-simple.ts::renderStencilPanel() - Renders UI
```

## Testing Strategy

- **Unit tests**: Test individual functions in isolation
- **E2E tests**: Test integration with Storybook config
- **Version tests**: Test both v9 and v10 implementations

## Build System

- **Vite**: Used for building the library
- **TypeScript**: Type checking and declaration generation
- **Entry points**: Each version and feature has its own entry point
- **Exports**: Package.json defines subpath exports for clean imports

## Future Considerations

- **Storybook 11+**: Easy to add by creating new version wrapper
- **New features**: Can be added as new modules without touching existing code
- **Addon extensions**: Can add new panel types, new metadata extractors, etc.
- **Performance**: Core logic is optimized, addon uses efficient DOM APIs

