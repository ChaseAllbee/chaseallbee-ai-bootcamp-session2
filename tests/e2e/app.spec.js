const { test, expect } = require('@playwright/test');

test.describe('App E2E Tests', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/React/);
  });

  test('should display the header', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('To Do App')).toBeVisible();
  });

  test('should display items list', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.items-section ul')).toBeVisible();
  });

  test('should add a new item', async ({ page }) => {
    await page.goto('/');
    const input = page.getByPlaceholder('Enter item name');
    await input.fill('E2E Test Item');
    await page.getByText('Add Item').click();
    await expect(page.getByText('E2E Test Item')).toBeVisible();
  });
});
