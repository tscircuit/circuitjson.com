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
    rollupOptions: {
      external: [
        // Exclude Node.js native modules from browser bundle
        'fs',
        'path',
        'child_process',
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
      // Use the WASM version instead of the native Node.js version for browser builds
      '@resvg/resvg-js': '@resvg/resvg-wasm',
    },
  },
})
