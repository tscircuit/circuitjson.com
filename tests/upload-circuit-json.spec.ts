import { expect, test } from "@playwright/test"

test("uploads a circuit json file and shows pcb tab", async ({ page }) => {
  await page.goto("/")

  await page.locator('input[type="file"]').setInputFiles("assets/usb-c-flashlight.json")

  await expect(page.getByRole("button", { name: /^PCB$/i })).toBeVisible({
    timeout: 60000,
  })
})
