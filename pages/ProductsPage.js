import { BasePage } from './BasePage.js';
import { paths } from '../config/env.js';

export class ProductsPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.title = page.getByTestId('title');
    this.sortDropdown = page.getByTestId('product-sort-container');
    this.inventoryContainer = page.getByTestId('inventory-container');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.inventoryItems = page.locator('.inventory_item');
  }

  async goto() {
    await this.gotoPath(paths.inventory);
  }

  productCard(name) {
    return this.inventoryItems.filter({ hasText: name });
  }

  productTitle(product) {
    return this.page.getByTestId(`item-${product.id}-title-link`);
  }

  productImageLink(product) {
    return this.page.getByTestId(`item-${product.id}-img-link`);
  }

  productImage(name) {
    return this.page.getByRole('img', { name, exact: true });
  }

  addToCartButton(product) {
    return this.page.getByTestId(product.addToCartTestId);
  }

  removeButton(product) {
    return this.page.getByTestId(product.removeTestId);
  }

  async addToCart(product) {
    await this.addToCartButton(product).click();
  }

  async removeFromCart(product) {
    await this.removeButton(product).click();
  }

  async openProductByName(product) {
    await this.productTitle(product).click();
    await this.page.waitForURL(new RegExp(`${paths.inventoryItem}\\?id=${product.id}`));
  }

  async openProductByImage(product) {
    await this.productImageLink(product).click();
    await this.page.waitForURL(new RegExp(`${paths.inventoryItem}\\?id=${product.id}`));
  }

  async sortBy(optionLabel) {
    await this.sortDropdown.selectOption({ label: optionLabel });
  }

  async productNames() {
    return this.itemNames.allTextContents();
  }

  async productPrices() {
    const texts = await this.itemPrices.allTextContents();
    return texts.map((text) => Number(text.replace('$', '')));
  }
}
