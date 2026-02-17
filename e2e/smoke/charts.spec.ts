import { test, expect } from "@playwright/test"

test.describe("Charts Tests", () => {
  test("should render category distribution chart", async ({ page }) => {
    await page.goto("http://localhost:3000/ecommerce-engine?tab=market-analysis")

    // Wait for chart to load
    await page.waitForSelector("text=品类分布", { timeout: 10000 })

    // Check if chart is visible
    const chartCard = page.locator("text=品类分布").locator("..")
    await expect(chartCard).toBeVisible()

    // Check if data is rendered
    await expect(page.locator("text=电子产品")).toBeVisible()
  })
})
