/**
 * Page Object Model for the Todo application.
 * Encapsulates all selectors and interactions for the main todo page.
 */
class TodoPage {
  constructor(page) {
    this.page = page;
    this.nameInput = page.getByPlaceholder('Enter task name');
    this.addButton = page.getByRole('button', { name: 'Add Task' });
    this.itemList = page.locator('ul');
  }

  async goto() {
    await this.page.goto('/');
  }

  async addItem(name) {
    await this.nameInput.fill(name);
    await this.addButton.click();
  }

  getItemRow(name) {
    return this.page.locator('li').filter({ hasText: name });
  }

  async deleteItem(name) {
    await this.getItemRow(name)
      .getByRole('button', { name: 'Delete' })
      .click();
  }

  async getItemCount() {
    return this.page.locator('li').count();
  }
}

module.exports = { TodoPage };
