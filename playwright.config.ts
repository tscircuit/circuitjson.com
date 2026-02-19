import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "tests",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "on-first-retry",
  },
  webServer: {
    command: "bunx vite --host 0.0.0.0 --port 4173 --strictPort",
    port: 4173,
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
})
