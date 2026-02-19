import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), tailwindcss()],
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
    alias: {
      "@resvg/resvg-js": "@resvg/resvg-wasm",
      buffer: "buffer/",
    },
  },
})
