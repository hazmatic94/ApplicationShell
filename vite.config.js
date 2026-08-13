import fs from "node:fs";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const designSystemRoot = fileURLToPath(
  new URL("./node_modules/@joker/design-system", import.meta.url),
);
const designSystemResolved = fs.realpathSync(designSystemRoot);

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: ["..", designSystemResolved],
    },
    watch: {
      ignored: ["!**/node_modules/@joker/design-system/**"],
    },
  },
  optimizeDeps: {
    exclude: ["@joker/design-system"],
  },
  resolve: {
    alias: [
      {
        find: "@joker/design-system/styles.css",
        replacement: `${designSystemRoot}/src/styles/index.css`,
      },
      {
        find: /^@joker\/design-system\/styles\/(.+)$/,
        replacement: `${designSystemRoot}/src/styles/$1`,
      },
      {
        find: "@joker/design-system",
        replacement: `${designSystemRoot}/dist/index.js`,
      },
    ],
  },
});
