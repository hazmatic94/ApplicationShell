import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vitest/config';

const appBase = '/showroom/gameshell/';
const designSystemRoot = fileURLToPath(new URL('../DesignSystemGames', import.meta.url));

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
  plugins: [react(), redirectMissingBaseSlash()],
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
    alias: [
      {
        find: '@joker/design-system/styles.css',
        replacement: `${designSystemRoot}/src/styles/index.css`,
      },
      {
        find: /^@joker\/design-system\/styles\/(.+)$/,
        replacement: `${designSystemRoot}/src/styles/$1`,
      },
      {
        find: '@joker/design-system',
        replacement: `${designSystemRoot}/dist/index.js`,
      },
      {
        find: '../EnterBetPrecursor/index.js',
        replacement: fileURLToPath(
          new URL('../DesignSystemGames/dist/components/EnterBetPrecursor/index.js', import.meta.url),
        ),
      },
    ],
  },
});
