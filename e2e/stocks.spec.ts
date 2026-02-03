import { test, expect } from "@playwright/test";

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000";

test.describe("Stock Market Tracker", () => {
  test("homepage loads with title and stock cards", async ({ page }) => {
    await page.goto(BASE_URL);
    
    await expect(page).toHaveTitle(/Stock Market Tracker/);
    await expect(page.getByText("Stock Market Tracker")).toBeVisible();
    await expect(page.getByText("Real-time stock prices updated every 5 seconds")).toBeVisible();
    
    const symbols = ["AMZN", "GOOG", "GOOGL", "AMD", "NVDA"];
    for (const symbol of symbols) {
      await expect(page.getByText(symbol, { exact: true })).toBeVisible();
    }
  });

  test("stock cards display price and change information", async ({ page }) => {
    await page.goto(BASE_URL);
    
    await page.waitForSelector("text=AMZN");
    
    const priceElements = page.locator("text=$").first();
    await expect(priceElements).toBeVisible();
    
    const changeElements = page.locator("text=/\\+\\d+\\.\\d+/").or(page.locator("text=/-\\d+\\.\\d+/"));
    await expect(changeElements.first()).toBeVisible();
  });

  test("stock data comes from Massive API", async ({ page }) => {
    const apiResponse = await page.request.get(`${BASE_URL}/api/stocks`);
    
    expect(apiResponse.status()).toBe(200);
    
    const data = await apiResponse.json();
    
    expect(data).toHaveProperty('stocks');
    expect(data).toHaveProperty('timestamp');
    expect(Array.isArray(data.stocks)).toBe(true);
    expect(data.stocks.length).toBeGreaterThan(0);
    
    const stock = data.stocks[0];
    expect(stock).toHaveProperty('symbol');
    expect(stock).toHaveProperty('price');
    expect(stock).toHaveProperty('change');
    expect(stock).toHaveProperty('changePercent');
    expect(stock).toHaveProperty('volume');
    expect(stock).toHaveProperty('lastUpdate');
    expect(stock).toHaveProperty('open');
    expect(stock).toHaveProperty('high');
    expect(stock).toHaveProperty('low');
    
    expect(typeof stock.price).toBe('number');
    expect(stock.price).toBeGreaterThan(0);
    expect(typeof stock.change).toBe('number');
    expect(typeof stock.changePercent).toBe('number');
    expect(stock.lastUpdate).toBeTruthy();
  });

  test("clicking on stock card navigates to detail page", async ({ page }) => {
    await page.goto(BASE_URL);
    
    await page.waitForSelector("text=AMZN");
    
    const amznCard = page.locator('a[href*="/stock/AMZN"]').first();
    await amznCard.click();
    
    await expect(page).toHaveURL(/\/stock\/AMZN/);
    await expect(page.getByText("AMZN").first()).toBeVisible();
    await expect(page.getByRole('main').getByRole('link', { name: /Back to Dashboard/ })).toBeVisible();
    await expect(page.getByText("Price Information")).toBeVisible();
    await expect(page.getByText("Performance Overview")).toBeVisible();
  });

  test("stock detail page shows real-time data", async ({ page }) => {
    await page.goto(`${BASE_URL}/stock/NVDA`);
    
    await page.waitForTimeout(2000);
    
    await expect(page.getByText("NVDA").first()).toBeVisible();
    
    const priceText = page.locator("text=/\\$\\d+\\.\\d+/").first();
    await expect(priceText).toBeVisible();
    
    await expect(page.getByText("Volume").first()).toBeVisible();
    await expect(page.getByText("High").first()).toBeVisible();
    await expect(page.getByText("Low").first()).toBeVisible();
  });

  test("back button works on detail page", async ({ page }) => {
    await page.goto(BASE_URL);
    
    await page.waitForSelector("text=GOOG");
    
    const googCard = page.locator('a[href*="/stock/GOOG"]').first();
    await googCard.click();
    
    await expect(page).toHaveURL(/\/stock\/GOOG/);
    
    await page.getByRole('main').getByRole('link', { name: /Back to Dashboard/ }).click();
    
    await expect(page).toHaveURL(BASE_URL);
    await expect(page.getByText("Stock Market Tracker")).toBeVisible();
  });

  test("data refreshes automatically", async ({ page }) => {
    await page.goto(BASE_URL);
    
    await page.waitForSelector("text=AMZN");
    
    const initialTime = await page.getByText(/Last updated:/).textContent();
    
    await page.waitForTimeout(6000);
    
    const updatedTime = await page.getByText(/Last updated:/).textContent();
    expect(updatedTime).not.toEqual(initialTime);
  });

  test("footer shows data source information", async ({ page }) => {
    await page.goto(BASE_URL);
    
    await expect(page.getByText("Data provided by Massive API")).toBeVisible();
    await expect(page.getByText("Updates every 5 seconds")).toBeVisible();
    await expect(page.getByText("Tracking: AMZN, GOOG, GOOGL, AMD, NVDA")).toBeVisible();
  });
});
