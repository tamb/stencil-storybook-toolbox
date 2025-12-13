Let's include an addon to this library that will render a new UI tab in storybook with stenciljs info.  This will include Prop, State, Method, Event, Listen declarations, Mixin delcarations, info like that collapsible sections that will be handy for people wanting to look over their stencil component. It should have versions for storybook 9 and 10.

The user should be able to use this addon like:


```ts
// .storybook/main.ts

import { useStencilVite, useStencilAddon } from 'stencil-storybook/v[x]';

// config...
addons: [
    useStencilAddon(), // addon usage
    //...
],
viteFinal: useStencilVite()
```

We need unit and e2e test. We should use minimal dependencies, if any. The current vite setup for this library is what we want to maintain.  We are just adding another method/feature.