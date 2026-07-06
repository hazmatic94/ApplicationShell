import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vite';

export default defineConfig({
  plugins: [react()],
  base: '/gameshell/',
  resolve: {
    alias: {
      '../EnterBetPrecursor/index.js': fileURLToPath(
        new URL('./node_modules/@joker/design-system/dist/components/EnterBetPrecursor/index.js', import.meta.url),
      ),
    },
  },
});
