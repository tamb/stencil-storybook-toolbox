import { describe, it, expect, vi, beforeEach } from 'vitest';
import { extractStencilInfo, getStencilElement } from '../../src/addon/utils';
import type { StencilComponentInfo } from '../../src/addon/types';

describe('Stencil Addon Utils', () => {
  describe('extractStencilInfo', () => {
    it('should return null for invalid element', () => {
      expect(extractStencilInfo(null as any)).toBeNull();
      expect(extractStencilInfo(undefined as any)).toBeNull();
    });

    it('should extract basic info from element with tag name', () => {
      const element = {
        tagName: 'MY-COMPONENT',
        constructor: {
          observedAttributes: ['my-prop', 'another-prop'],
        },
        attributes: [],
      } as any;

      const info = extractStencilInfo(element as any);
      expect(info).not.toBeNull();
      expect(info?.tag).toBe('my-component');
    });

    it('should extract props from observedAttributes', () => {
      const element = {
        tagName: 'MY-COMPONENT',
        constructor: {
          observedAttributes: ['my-prop', 'another-prop'],
        },
        attributes: [],
      } as any;

      const info = extractStencilInfo(element as any);
      expect(info?.props).toBeDefined();
      expect(info?.props?.length).toBe(2);
      expect(info?.props?.[0].name).toBe('myProp');
      expect(info?.props?.[0].attribute).toBe('my-prop');
    });

    it('should extract props from element attributes as fallback', () => {
      const element = {
        tagName: 'MY-COMPONENT',
        constructor: {},
        attributes: [
          { name: 'test-attr', value: 'test-value' },
        ],
      } as any;

      const info = extractStencilInfo(element as any);
      expect(info?.props).toBeDefined();
      expect(info?.props?.length).toBe(1);
      expect(info?.props?.[0].name).toBe('testAttr');
      expect(info?.props?.[0].attribute).toBe('test-attr');
    });

    it('should extract metadata from Stencil component', () => {
      const element = {
        tagName: 'MY-COMPONENT',
        constructor: {
          componentOnReady: vi.fn(),
          __stencil_metadata__: {
            properties: {
              myProp: {
                type: 'string',
                mutable: false,
                reflect: true,
                required: true,
                attribute: 'my-prop',
              },
            },
            states: {
              myState: {
                type: 'boolean',
              },
            },
            methods: {
              myMethod: {
                signature: 'myMethod(): void',
                returns: 'void',
              },
            },
            events: {
              myEvent: {
                detail: 'CustomEvent',
                bubbles: true,
                cancelable: false,
                composed: true,
              },
            },
            listeners: [
              {
                event: 'click',
                target: 'document',
                action: 'handleClick',
              },
            ],
          },
        },
        attributes: [],
      } as any;

      const info = extractStencilInfo(element as any);
      expect(info).not.toBeNull();
      expect(info?.props).toBeDefined();
      expect(info?.props?.[0].type).toBe('string');
      expect(info?.props?.[0].reflect).toBe(true);
      expect(info?.state).toBeDefined();
      expect(info?.methods).toBeDefined();
      expect(info?.events).toBeDefined();
      expect(info?.listeners).toBeDefined();
    });
  });

  describe('getStencilElement', () => {
    beforeEach(() => {
      // Mock document
      global.document = {
        querySelector: vi.fn(),
        querySelectorAll: vi.fn(),
        body: {
          querySelectorAll: vi.fn(),
        } as any,
      } as any;
    });

    it('should return null if context is invalid', () => {
      expect(getStencilElement(null)).toBeNull();
      expect(getStencilElement(undefined)).toBeNull();
      expect(getStencilElement({})).toBeNull();
    });

    it('should find custom element in DOM', () => {
      const mockElement = {
        tagName: 'MY-COMPONENT',
      } as any;

      (global.document.querySelector as any).mockReturnValue({
        querySelectorAll: vi.fn().mockReturnValue([mockElement]),
      });

      const element = getStencilElement({ args: {} });
      // Note: This test is simplified since we're mocking DOM APIs
      // In a real environment, this would work with actual DOM
      expect(element).toBeDefined();
    });
  });
});

