import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 3110,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    chunkSizeWarningLimit: 2000, // Increase limit to 2000 kB to reduce warnings
    rollupOptions: {
      external: [
        "@resvg/resvg-js",
        // Node.js built-in modules that can't run in browser
        "fs",
        "path",
        "util",
        "crypto",
        "node:fs",
        "node:path",
        "node:child_process",
        "node:buffer",
        "fs/promises",
        "child_process",
      ],
    },
  },
  define: {
    global: "globalThis",
  },
  optimizeDeps: {
    exclude: [
      '@resvg/resvg-js',
      'posthog-node',
    ],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  resolve: {
    alias: {
      "@resvg/resvg-js": "@resvg/resvg-wasm",
    },
  },
})
