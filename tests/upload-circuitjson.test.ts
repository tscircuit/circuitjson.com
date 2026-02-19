import { afterAll, beforeAll, expect, test } from "bun:test"
import { chromium, type Browser, type Page } from "playwright"

const PORT = 4173
const BASE_URL = `http://127.0.0.1:${PORT}`

let serverProcess: Bun.Subprocess
let browser: Browser
let page: Page

const waitForServer = async (url: string, timeoutMs = 20000) => {
  const start = Date.now()

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url)
      if (response.ok) {
        return
      }
    } catch {
      // ignore while server starts
    }

    await new Promise((resolve) => setTimeout(resolve, 250))
  }

  throw new Error(`Timed out waiting for server at ${url}`)
}

beforeAll(async () => {
  serverProcess = Bun.spawn(["bun", "run", "start", "--host", "0.0.0.0", "--port", `${PORT}`], {
    stdout: "ignore",
    stderr: "ignore",
  })

  await waitForServer(BASE_URL)

  browser = await chromium.launch()
  page = await browser.newPage()
})

afterAll(async () => {
  await page?.close()
  await browser?.close()
  serverProcess?.kill()
  await serverProcess?.exited
})

test("uploads a circuit json file and shows the PCB tab", async () => {
  await page.goto(BASE_URL)

  await page.setInputFiles('input[type="file"]', "assets/usb-c-flashlight.json")

  await page.getByText(/PCB/i).waitFor({ timeout: 15000 })

  const pcbTab = page.getByText(/PCB/i)
  expect(await pcbTab.isVisible()).toBe(true)
})
