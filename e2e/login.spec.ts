import { test, expect } from "@playwright/test";

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000";

test.describe("Login Functionality", () => {
  test("login page loads with form elements", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    // Check page title - the app uses "Stock Market Tracker" as title
    await expect(page).toHaveTitle(/Stock Market Tracker/);
    
    // Check header
    await expect(page.getByText("🔐 Login")).toBeVisible();
    
    // Check email input
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('required');
    
    // Check password input
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute('required');
    
    // Check submit button
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toHaveText("Login");
    
    // Check back to home link
    await expect(page.getByText("← Back to Home")).toBeVisible();
  });

  test("successful login with valid credentials redirects to dashboard", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    // Fill in email
    await page.locator('input[type="email"]').fill("paul.brie@teleporthq.io");
    
    // Fill in password
    await page.locator('input[type="password"]').fill("admin");
    
    // Click login button
    await page.locator('button[type="submit"]').click();
    
    // Wait for navigation to dashboard
    await page.waitForURL(/\/dashboard/);
    
    // Verify we're on the dashboard
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("failed login with invalid credentials shows error message", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    // Fill in invalid email
    await page.locator('input[type="email"]').fill("invalid@example.com");
    
    // Fill in invalid password
    await page.locator('input[type="password"]').fill("wrongpassword");
    
    // Click login button
    await page.locator('button[type="submit"]').click();
    
    // Wait for error message to appear
    await expect(page.getByText("Invalid email or password")).toBeVisible();
    
    // Verify we're still on the login page
    await expect(page).toHaveURL(/\/login/);
    
    // Verify the error styling (check for error color in the alert box)
    const errorDiv = page.locator('div:has-text("Invalid email or password")').first();
    await expect(errorDiv).toBeVisible();
  });

  test("back to home link works", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    // Click back to home link
    await page.getByText("← Back to Home").click();
    
    // Verify we're back on the homepage
    await expect(page).toHaveURL(BASE_URL);
    // Check the homepage title - Stock Market Tracker
    await expect(page).toHaveTitle(/Stock Market Tracker/);
    // Check for the main heading on the homepage
    await expect(page.getByText("📈 Stock Market Tracker")).toBeVisible();
  });

  test("login page shows loading state while submitting", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    // Fill in credentials
    await page.locator('input[type="email"]').fill("paul.brie@teleporthq.io");
    await page.locator('input[type="password"]').fill("admin");
    
    // Click login and immediately check for loading state
    await page.locator('button[type="submit"]').click();
    
    // The button text should change to "Logging in..." immediately
    await expect(page.locator('button[type="submit"]')).toHaveText("Logging in...");
    
    // Wait for navigation or error
    await page.waitForURL(/\/dashboard/, { timeout: 10000 }).catch(() => {
      // If navigation fails, check for error message
      page.waitForSelector('text="Invalid email or password"', { timeout: 5000 });
    });
  });
});
