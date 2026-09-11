import { BasePage } from './BasePage.js';
import { paths } from '../config/env.js';

export class ProductDetailsPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.backToProducts = page.getByRole('button', { name: 'Back to products' });
    // Catalog cards stay in the DOM and can still count as "visible".
    // Details copy uses inventory_details_* classes; catalog uses inventory_item_*.
    this.name = page.locator('.inventory_details_name');
    this.description = page.locator('.inventory_details_desc');
    this.price = page.locator('.inventory_details_price');
    this.addToCartButton = page.getByTestId('add-to-cart');
    this.removeButton = page.getByTestId('remove');
  }

  /**
   * @param {number} id
   */
  async gotoById(id) {
    await this.gotoPath(`${paths.inventoryItem}?id=${id}`);
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async removeFromCart() {
    await this.removeButton.click();
  }

  async back() {
    await this.backToProducts.click({ noWaitAfter: true });
    await this.page.waitForURL(/\/inventory\.html/);
  }
}
