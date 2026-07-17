import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vitest/config';

const appBase = '/showroom/gameshell/';

function repairIncompleteRouletteWheelBuild() {
  const wrapperReplacement = fileURLToPath(
    new URL('./src/vendor/RouletteWrapper.jsx', import.meta.url),
  );
  const pathsReplacement = fileURLToPath(
    new URL('./src/vendor/rouletteWheelPaths.js', import.meta.url),
  );

  return {
    name: 'repair-incomplete-roulette-wheel-build',
    enforce: 'pre',
    resolveId(source, importer) {
      if (
        source === './RouletteWrapper' &&
        importer?.includes('/@joker/design-system/dist/components/RouletteWheel/')
      ) {
        return wrapperReplacement;
      }

      if (
        source === './rouletteWheelPaths' &&
        importer?.includes('/@joker/design-system/dist/components/RouletteWheel/')
      ) {
        return pathsReplacement;
      }

      return null;
    },
  };
}

function redirectMissingBaseSlash() {
  const baseWithoutSlash = appBase.replace(/\/$/, '');

  return {
    name: 'redirect-missing-base-slash',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0] ?? '';

        if (url === baseWithoutSlash) {
          const query = req.url?.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
          res.writeHead(301, {Location: `${appBase}${query}`});
          res.end();
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), repairIncompleteRouletteWheelBuild(), redirectMissingBaseSlash()],
  base: appBase,
  test: {
    environment: 'node',
    include: ['src/**/*.test.{js,jsx}'],
    server: {
      deps: {
        inline: ['@joker/design-system'],
      },
    },
  },
  server: {
    host: true,
    allowedHosts: true,
    watch: {
      ignored: ['!**/DesignSystemGames/**'],
    },
    fs: {
      allow: ['..'],
    },
  },
  optimizeDeps: {
    exclude: ['@joker/design-system'],
  },
  resolve: {
    alias: {
      '../EnterBetPrecursor/index.js': fileURLToPath(
        new URL('./node_modules/@joker/design-system/dist/components/EnterBetPrecursor/index.js', import.meta.url),
      ),
    },
  },
});
