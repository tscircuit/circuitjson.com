import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3110,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  define: {
    global: "globalThis",
  },
  resolve: {
    tsconfigPaths: true,
    alias: {
      "@resvg/resvg-js": "@resvg/resvg-wasm",
      buffer: "buffer/",
    },
  },
})
