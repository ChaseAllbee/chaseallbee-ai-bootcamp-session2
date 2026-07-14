const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

// Use a unique suffix per test run so tests are fully isolated
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

test.describe('Todo workflow', () => {
  let todoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
  });

  test('displays the app header', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'To Do App' })).toBeVisible();
  });

  test('displays the add item form', async ({ page }) => {
    await expect(todoPage.nameInput).toBeVisible();
    await expect(todoPage.addButton).toBeVisible();
  });

  test('can add a new item', async ({ page }) => {
    const name = `Buy groceries ${uid()}`;
    await todoPage.addItem(name);
    await expect(todoPage.getItemRow(name)).toBeVisible();
  });

  test('can delete an item', async ({ page }) => {
    const name = `Delete me ${uid()}`;
    await todoPage.addItem(name);
    await expect(todoPage.getItemRow(name)).toBeVisible();

    await todoPage.deleteItem(name);
    await expect(todoPage.getItemRow(name)).not.toBeVisible();
  });

  test('does not add an item with an empty name', async ({ page }) => {
    const countBefore = await todoPage.getItemCount();
    await todoPage.addButton.click();
    const countAfter = await todoPage.getItemCount();
    expect(countAfter).toBe(countBefore);
  });

  test('clears the input after adding an item', async ({ page }) => {
    await todoPage.addItem(`Clear me ${uid()}`);
    await expect(todoPage.nameInput).toHaveValue('');
  });

  test('shows existing items on load', async ({ page }) => {
    const count = await todoPage.getItemCount();
    expect(count).toBeGreaterThan(0);
  });
});
