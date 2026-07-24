/**
 * Page Object Model for the Todo application.
 * Encapsulates all selectors and interactions for the main todo page.
 */
class TodoPage {
  constructor(page) {
    this.page = page;
    this.nameInput = page.getByPlaceholder('Enter item name');
    this.addButton = page.getByRole('button', { name: 'Add Item' });
    this.itemList = page.locator('ul');
  }

  async goto() {
    await this.page.goto('/');
    await this.page.locator('.items-section li, .items-section .empty-state').first().waitFor({ state: 'visible' });
  }

  async addItem(name) {
    await this.nameInput.fill(name);
    await this.addButton.click();
    await this.getItemRow(name).waitFor({ state: 'visible' });
  }

  getItemRow(name) {
    return this.page.locator('.items-section li').filter({ hasText: name });
  }

  async deleteItem(name) {
    this.page.once('dialog', (dialog) => dialog.accept());
    await this.getItemRow(name)
      .getByRole('button', { name: 'Delete' })
      .click();
  }

  async getItemCount() {
    await this.page.locator('.items-section li, .items-section .empty-state').first().waitFor({ state: 'visible' });
    return this.page.locator('.items-section li').count();
  }
}

module.exports = { TodoPage };
