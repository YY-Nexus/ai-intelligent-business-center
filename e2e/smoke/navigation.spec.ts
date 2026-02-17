import { test, expect } from "@playwright/test"

test.describe("Navigation Tests", () => {
  test("should navigate to homepage", async ({ page }) => {
    await page.goto("http://localhost:3000/")
    await expect(page).toHaveTitle(/言语云/)
    await expect(page.locator("text=智能门户")).toBeVisible()
  })

  test("should open API config page", async ({ page }) => {
    await page.goto("http://localhost:3000/api-config")
    await expect(page.locator("text=API中心")).toBeVisible()
  })

  test('should not contain "新" badges in sidebar', async ({ page }) => {
    await page.goto("http://localhost:3000/")
    const badges = await page.locator("text=新").count()
    expect(badges).toBe(0)
  })
})
