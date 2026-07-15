import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  base: '/showroom/gameshell/',
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
