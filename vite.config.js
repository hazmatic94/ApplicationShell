import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vite';

export default defineConfig({
  plugins: [react()],
  base: '/showroom/gameshell/',
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
