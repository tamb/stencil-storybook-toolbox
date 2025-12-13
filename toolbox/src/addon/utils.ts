import type { StencilComponentInfo } from './types';

/**
 * Extracts Stencil component information from a custom element.
 *
 * This function attempts multiple strategies to extract component metadata:
 * 1. Stencil's internal metadata (__stencil_metadata__) - most complete
 * 2. observedAttributes from the constructor - standard Web Components API
 * 3. Element attributes as fallback - least reliable but works for any custom element
 *
 * @param element - The custom element to extract information from
 * @returns Component information object, or null if extraction fails
 *
 * @example
 * ```typescript
 * const element = document.querySelector('my-component');
 * const info = extractStencilInfo(element);
 * if (info) {
 *   console.log('Component props:', info.props);
 * }
 * ```
 */
export function extractStencilInfo(element: HTMLElement): StencilComponentInfo | null {
  if (!element || !element.tagName) {
    return null;
  }

  const tag = element.tagName.toLowerCase();
  const info: StencilComponentInfo = {
    tag,
  };

  // Strategy 1: Try to get component metadata from the element's constructor
  // This works for any custom element that follows the Web Components standard
  // biome-ignore lint/suspicious/noExplicitAny: Need to access internal Stencil metadata
  const ElementConstructor = element.constructor as any;

  // Extract props from observedAttributes (standard Web Components API)
  // observedAttributes lists all attributes that trigger attributeChangedCallback
  if (ElementConstructor.observedAttributes) {
    info.props = ElementConstructor.observedAttributes.map((attr: string) => ({
      name: attr.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()),
      type: 'string',
      attribute: attr,
    }));
  }

  // Strategy 2: Try to get Stencil's internal metadata (most complete)
  // Stencil components have a componentOnReady method and store metadata
  // This gives us the richest information: types, defaults, events, etc.
  if (ElementConstructor.componentOnReady) {
    // This is a Stencil component - access its internal metadata
    // biome-ignore lint/suspicious/noExplicitAny: Stencil's internal metadata structure
    const metadata = (ElementConstructor as any).__stencil_metadata__ as
      | {
          properties?: Record<string, { type?: string; mutable?: boolean; reflect?: boolean; required?: boolean; default?: string; attribute?: string }>;
          states?: Record<string, { type?: string }>;
          methods?: Record<string, { signature?: string; returns?: string }>;
          events?: Record<string, { detail?: string; bubbles?: boolean; cancelable?: boolean; composed?: boolean }>;
          listeners?: Array<{ event: string; target?: string; action: string }>;
        }
      | undefined;
    if (metadata) {
      if (metadata.properties) {
        info.props = Object.entries(metadata.properties).map(([name, prop]) => ({
          name,
          type: prop.type || 'unknown',
          mutable: prop.mutable,
          reflect: prop.reflect,
          required: prop.required,
          default: prop.default,
          attribute: prop.attribute || name.toLowerCase(),
        }));
      }

      if (metadata.states) {
        info.state = Object.entries(metadata.states).map(([name, state]) => ({
          name,
          type: state.type || 'unknown',
        }));
      }

      if (metadata.methods) {
        info.methods = Object.entries(metadata.methods).map(([name, method]) => ({
          name,
          signature: method.signature || `${name}()`,
          returns: method.returns,
        }));
      }

      if (metadata.events) {
        info.events = Object.entries(metadata.events).map(([name, event]) => ({
          name,
          detail: event.detail,
          bubbles: event.bubbles,
          cancelable: event.cancelable,
          composed: event.composed,
        }));
      }

      if (metadata.listeners) {
        info.listeners = metadata.listeners.map(listener => ({
          event: listener.event,
          target: listener.target,
          action: listener.action,
        }));
      }
    }
  }

  // Strategy 3: Fallback - Extract from element attributes
  // This is the least reliable method but works for any custom element
  // We can only infer string types and attribute names
  if (!info.props && element.attributes) {
    info.props = Array.from(element.attributes).map((attr: Attr) => ({
      name: attr.name.replace(/-([a-z])/g, (_: string, letter: string) => letter.toUpperCase()),
      type: 'string',
      attribute: attr.name,
      default: attr.value || undefined,
    }));
  }

  return info;
}

/**
 * Gets the Stencil component element from the story context.
 *
 * This function searches the DOM for custom elements (Stencil components).
 * Custom elements are identified by their tag names containing hyphens.
 *
 * Search strategy:
 * 1. Look for undefined custom elements (not yet registered)
 * 2. Look for defined custom elements (already registered)
 *
 * @param context - Storybook story context (currently unused, reserved for future use)
 * @returns The first Stencil component found in the DOM, or null
 *
 * @example
 * ```typescript
 * const element = getStencilElement(context);
 * if (element) {
 *   const info = extractStencilInfo(element);
 * }
 * ```
 */
export function getStencilElement(context: unknown): HTMLElement | null {
  // Type guard to check if context has args property
  if (context && typeof context === 'object' && 'args' in context) {
    // Context is available but we don't use it for DOM search
    // This is reserved for future use
  }

  // Check if DOM APIs are available (e.g., in test environments)
  if (typeof document === 'undefined' || !document.body || !document.body.querySelectorAll) {
    return null;
  }

  // Try to find the component in the DOM
  // Storybook may wrap stories in a specific root element
  const storyElement = document.querySelector('[data-storybook-root]') || document.body;

  // Ensure storyElement has querySelectorAll method
  if (!storyElement || typeof storyElement.querySelectorAll !== 'function') {
    return null;
  }

  // Strategy 1: Look for undefined custom elements (not yet registered with customElements.define)
  // These are elements that exist in the DOM but haven't been upgraded yet
  const customElements = storyElement.querySelectorAll(':not(:defined)');
  if (customElements && customElements.length > 0) {
    return customElements[0] as HTMLElement;
  }

  // Strategy 2: Look for defined custom elements (those with hyphens in tag name)
  // Custom elements must have hyphens in their tag names per Web Components spec
  const allElements = storyElement.querySelectorAll('*');
  if (!allElements) {
    return null;
  }
  const definedElements = Array.from(allElements).find((el: Element) => el.tagName.includes('-')) as HTMLElement | undefined;

  return definedElements || null;
}
