import { describe, it, expect } from 'vitest';
import type { UserConfig } from 'vite';
import { useStencilVite as useStencilViteV9 } from '../../src/v9/index';
import { useStencilVite as useStencilViteV10 } from '../../src/v10/index';

describe('useStencilVite', () => {
  const baseConfig: UserConfig = {
    server: {
      port: 6006,
    },
  };

  describe('v9', () => {
    it('should apply default Stencil optimizations', async () => {
      const viteFinal = useStencilViteV9();
      const result = await viteFinal(baseConfig);

      expect(result.server?.watch).toEqual({
        ignored: ['!**/dist/**'],
        usePolling: true,
        interval: 300,
      });
      expect(result.server?.headers).toEqual({
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      });
      expect(result.optimizeDeps?.force).toBe(true);
      expect(result.cacheDir).toContain('node_modules/.vite-storybook');
    });

    it('should merge with existing config', async () => {
      const viteFinal = useStencilViteV9();
      const result = await viteFinal({
        ...baseConfig,
        server: {
          port: 6006,
          host: 'localhost',
        },
      });

      expect(result.server?.port).toBe(6006);
      expect(result.server?.host).toBe('localhost');
      expect(result.server?.watch).toBeDefined();
    });

    it('should accept custom viteFinal config object', async () => {
      const customConfig = {
        build: {
          outDir: 'custom-dist',
        },
      };

      const viteFinal = useStencilViteV9(customConfig);
      const result = await viteFinal(baseConfig);

      expect(result.build?.outDir).toBe('custom-dist');
      expect(result.server?.watch).toBeDefined();
    });

    it('should accept custom viteFinal config function', async () => {
      const customConfig = (config: UserConfig) => ({
        ...config,
        build: {
          outDir: 'custom-dist',
        },
      });

      const viteFinal = useStencilViteV9(customConfig);
      const result = await viteFinal(baseConfig);

      expect(result.build?.outDir).toBe('custom-dist');
      expect(result.server?.watch).toBeDefined();
    });

    it('should accept options with packageName as string', async () => {
      const viteFinal = useStencilViteV9(undefined, {
        packageName: 'my-stencil-components',
      });
      const result = await viteFinal(baseConfig);

      expect(result.optimizeDeps?.exclude).toContain('my-stencil-components');
    });

    it('should accept options with packageName as array', async () => {
      const viteFinal = useStencilViteV9(undefined, {
        packageName: ['pkg1', 'pkg2'],
      });
      const result = await viteFinal(baseConfig);

      expect(result.optimizeDeps?.exclude).toContain('pkg1');
      expect(result.optimizeDeps?.exclude).toContain('pkg2');
    });

    it('should accept custom watchPaths', async () => {
      const viteFinal = useStencilViteV9(undefined, {
        watchPaths: ['**/dist/**', '**/build/**'],
      });
      const result = await viteFinal(baseConfig);

      expect(result.server?.watch?.ignored).toContain('!**/dist/**');
      expect(result.server?.watch?.ignored).toContain('!**/build/**');
    });

    it('should accept custom polling settings', async () => {
      const viteFinal = useStencilViteV9(undefined, {
        usePolling: false,
        pollingInterval: 500,
      });
      const result = await viteFinal(baseConfig);

      expect(result.server?.watch?.usePolling).toBe(false);
      expect(result.server?.watch?.interval).toBe(500);
    });

    it('should accept custom cacheDir', async () => {
      const customCacheDir = '/custom/cache/dir';
      const viteFinal = useStencilViteV9(undefined, {
        cacheDir: customCacheDir,
      });
      const result = await viteFinal(baseConfig);

      expect(result.cacheDir).toBe(customCacheDir);
    });

    it('should disable cache headers when disableCache is false', async () => {
      const viteFinal = useStencilViteV9(undefined, {
        disableCache: false,
      });
      const result = await viteFinal(baseConfig);

      // When disableCache is false and there are no existing headers,
      // headers should be undefined or not contain Cache-Control
      if (result.server?.headers) {
        expect(result.server.headers).not.toHaveProperty('Cache-Control');
      } else {
        expect(result.server?.headers).toBeUndefined();
      }
    });

    it('should accept optimizeDepsForce option', async () => {
      const viteFinal = useStencilViteV9(undefined, {
        optimizeDepsForce: false,
      });
      const result = await viteFinal(baseConfig);

      expect(result.optimizeDeps?.force).toBe(false);
    });

    it('should merge existing optimizeDeps exclude', async () => {
      const viteFinal = useStencilViteV9(
        {
          optimizeDeps: {
            exclude: ['existing-pkg'],
          },
        },
        {
          packageName: 'new-pkg',
        },
      );
      const result = await viteFinal(baseConfig);

      expect(result.optimizeDeps?.exclude).toContain('existing-pkg');
      expect(result.optimizeDeps?.exclude).toContain('new-pkg');
    });

    it('should merge existing server watch ignored', async () => {
      const viteFinal = useStencilViteV9({
        server: {
          watch: {
            ignored: ['existing-pattern'],
          },
        },
      });
      const result = await viteFinal(baseConfig);

      expect(result.server?.watch?.ignored).toContain('existing-pattern');
      expect(result.server?.watch?.ignored).toContain('!**/dist/**');
    });

    it('should work with both viteFinal config and options', async () => {
      const viteFinal = useStencilViteV9(
        {
          build: {
            outDir: 'custom-dist',
          },
        },
        {
          packageName: 'my-pkg',
          usePolling: false,
        },
      );
      const result = await viteFinal(baseConfig);

      expect(result.build?.outDir).toBe('custom-dist');
      expect(result.optimizeDeps?.exclude).toContain('my-pkg');
      expect(result.server?.watch?.usePolling).toBe(false);
    });

    it('should support clearCache option', () => {
      // This test verifies the option is accepted and doesn't throw
      // Actual cache clearing is tested in e2e tests
      const viteFinal = useStencilViteV9(undefined, {
        clearCache: true,
      });
      expect(viteFinal).toBeDefined();
      expect(typeof viteFinal).toBe('function');
    });

    it('should support custom cacheDirs option', () => {
      const viteFinal = useStencilViteV9(undefined, {
        clearCache: true,
        cacheDirs: ['custom-cache-dir', 'another-cache'],
      });
      expect(viteFinal).toBeDefined();
      expect(typeof viteFinal).toBe('function');
    });
  });

  describe('v10', () => {
    it('should apply default Stencil optimizations', async () => {
      const viteFinal = useStencilViteV10();
      const result = await viteFinal(baseConfig);

      expect(result.server?.watch).toEqual({
        ignored: ['!**/dist/**'],
        usePolling: true,
        interval: 300,
      });
      expect(result.server?.headers).toEqual({
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      });
      expect(result.optimizeDeps?.force).toBe(true);
      expect(result.cacheDir).toContain('node_modules/.vite-storybook');
    });

    it('should have same behavior as v9', async () => {
      const viteFinalV9 = useStencilViteV9(undefined, { packageName: 'test-pkg' });
      const viteFinalV10 = useStencilViteV10(undefined, { packageName: 'test-pkg' });

      const resultV9 = await viteFinalV9(baseConfig);
      const resultV10 = await viteFinalV10(baseConfig);

      expect(resultV9.optimizeDeps?.exclude).toEqual(resultV10.optimizeDeps?.exclude);
      expect(resultV9.server?.watch).toEqual(resultV10.server?.watch);
    });
  });
});
