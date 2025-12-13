# Stencil Addon Architecture

This directory contains the Storybook addon that displays Stencil component information.

## File Structure

```
addon/
├── types.ts          # TypeScript interfaces for Stencil component metadata
├── utils.ts          # Utility functions for extracting component info from DOM
├── panel-simple.ts   # Simple DOM-based panel renderer (no React dependency)
├── manager.ts        # Addon manager logic (listens for component updates)
├── register.ts       # Storybook addon registration
├── preset.ts         # Storybook preset configuration
└── index.ts          # Public exports
```

## Architecture Overview

### Component Information Flow

1. **Detection**: `utils.ts` detects Stencil components in the DOM
2. **Extraction**: `extractStencilInfo()` extracts metadata from component constructors
3. **Communication**: Manager emits component info via Storybook's channel API
4. **Display**: Panel receives info and renders it in collapsible sections

### Adding New Metadata Types

To add support for new Stencil metadata (e.g., CSS variables, slots):

1. **Update Types** (`types.ts`):
   ```typescript
   export interface StencilComponentInfo {
     // ... existing fields
     cssVariables?: StencilCssVariable[];
   }
   ```

2. **Update Extraction** (`utils.ts`):
   ```typescript
   if (metadata.cssVariables) {
     info.cssVariables = metadata.cssVariables.map(...);
   }
   ```

3. **Update Panel** (`panel-simple.ts`):
   Add a new collapsible section to display the new metadata

### Adding New Features

The addon is designed to be extensible:

- **New Panel Types**: Create new panel files (e.g., `panel-advanced.ts`)
- **New Extractors**: Add functions to `utils.ts` for different metadata sources
- **New Integrations**: Extend `manager.ts` to listen for additional events

## Dependencies

- **Minimal**: The addon uses only Storybook's built-in APIs
- **No React**: `panel-simple.ts` uses vanilla DOM APIs
- **No React**: Uses vanilla DOM APIs for maximum compatibility

