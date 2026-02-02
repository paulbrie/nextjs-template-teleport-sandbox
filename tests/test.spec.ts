import { test, expect } from "@playwright/test";

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000";

test.describe("Stock Market Tracker", () => {
  test("homepage loads with title and stock cards", async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Check page title
    await expect(page).toHaveTitle(/Stock Market Tracker/);
    
    // Check header
    await expect(page.getByText("📈 Stock Market Tracker")).toBeVisible();
    await expect(page.getByText("Real-time stock prices updated every 5 seconds")).toBeVisible();
    
    // Check that all stock symbols are displayed
    const symbols = ["AMZN", "GOOG", "GOOGL", "AMD", "NVDA"];
    for (const symbol of symbols) {
      await expect(page.getByText(symbol, { exact: true })).toBeVisible();
    }
  });

  test("stock cards display price and change information", async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Wait for stock data to load
    await page.waitForSelector("text=AMZN");
    
    // Check that price is displayed (contains $)
    const priceElements = page.locator("text=$").first();
    await expect(priceElements).toBeVisible();
    
    // Check that change information is displayed (contains + or -)
    const changeElements = page.locator("text=/\\+\\d+\\.\\d+/").or(page.locator("text=/-\\d+\\.\\d+/"));
    await expect(changeElements.first()).toBeVisible();
  });

  test("clicking on stock card navigates to detail page", async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Wait for stock data to load
    await page.waitForSelector("text=AMZN");
    
    // Click on AMZN card - click on the card container
    const amznCard = page.locator('a[href*="/stock/AMZN"]').first();
    await amznCard.click();
    
    // Check that we're on the detail page
    await expect(page).toHaveURL(/\/stock\/AMZN/);
    
    // Check detail page content
    await expect(page.getByText("AMZN").first()).toBeVisible();
    await expect(page.getByText("Back to Dashboard")).toBeVisible();
    
    // Check that detailed information is displayed
    await expect(page.getByText("Price Information")).toBeVisible();
    await expect(page.getByText("Performance Overview")).toBeVisible();
    await expect(page.getByText("Market Status")).toBeVisible();
  });

  test("stock detail page shows real-time data", async ({ page }) => {
    await page.goto(`${BASE_URL}/stock/NVDA`);
    
    // Wait for data to load
    await page.waitForTimeout(2000);
    
    // Check that stock symbol is displayed
    await expect(page.getByText("NVDA").first()).toBeVisible();
    
    // Check that price is displayed
    const priceText = page.locator("text=/\\$\\d+\\.\\d+/").first();
    await expect(priceText).toBeVisible();
    
    // Check that volume is displayed
    await expect(page.getByText("Volume").first()).toBeVisible();
    
    // Check that high/low prices are displayed
    await expect(page.getByText("High").first()).toBeVisible();
    await expect(page.getByText("Low").first()).toBeVisible();
  });

  test("back button works on detail page", async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Wait for stock data to load
    await page.waitForSelector("text=GOOG");
    
    // Click on GOOG card
    const googCard = page.locator('a[href*="/stock/GOOG"]').first();
    await googCard.click();
    
    // Verify we're on the detail page
    await expect(page).toHaveURL(/\/stock\/GOOG/);
    
    // Click back button
    await page.getByText("Back to Dashboard").click();
    
    // Verify we're back on the homepage
    await expect(page).toHaveURL(BASE_URL);
    await expect(page.getByText("📈 Stock Market Tracker")).toBeVisible();
  });

  test("data refreshes automatically", async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Wait for initial load
    await page.waitForSelector("text=AMZN");
    
    // Get initial timestamp
    const initialTime = await page.getByText(/Last updated:/).textContent();
    
    // Wait for auto-refresh (5 seconds)
    await page.waitForTimeout(6000);
    
    // Check that the timestamp has updated
    const updatedTime = await page.getByText(/Last updated:/).textContent();
    expect(updatedTime).not.toEqual(initialTime);
  });

  test("footer shows data source information", async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Check footer content
    await expect(page.getByText("Data provided by Massive API")).toBeVisible();
    await expect(page.getByText("Updates every 5 seconds")).toBeVisible();
    await expect(page.getByText("Tracking: AMZN, GOOG, GOOGL, AMD, NVDA")).toBeVisible();
  });
});
