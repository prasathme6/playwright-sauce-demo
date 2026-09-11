import { BasePage } from './BasePage.js';
import { paths } from '../config/env.js';

export class CartPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.title = page.getByTestId('title');
    this.cartList = page.getByTestId('cart-list');
    this.cartItems = this.cartList.getByTestId('inventory-item');
    this.itemNames = this.cartList.getByTestId('inventory-item-name');
    this.itemPrices = this.cartList.getByTestId('inventory-item-price');
    this.quantities = this.cartList.getByTestId('item-quantity');
    this.continueShopping = page.getByRole('button', { name: 'Continue Shopping' });
    this.checkout = page.getByRole('button', { name: 'Checkout' });
  }

  async goto() {
    await this.gotoPath(paths.cart);
  }

  itemName(name) {
    return this.itemNames.filter({ hasText: name });
  }

  itemTitle(product) {
    return this.page.getByTestId(`item-${product.id}-title-link`);
  }

  removeButton(product) {
    return this.page.getByTestId(product.removeTestId);
  }

  async remove(product) {
    await this.removeButton(product).click();
  }

  async continueShoppingToInventory() {
    await this.continueShopping.click({ noWaitAfter: true });
    await this.page.waitForURL(/\/inventory\.html/);
  }

  async proceedToCheckout() {
    await this.checkout.click({ noWaitAfter: true });
    await this.page.waitForURL(/\/checkout-step-one\.html/);
  }

  async openItem(product) {
    await this.itemTitle(product).click({ noWaitAfter: true });
    await this.page.waitForURL(new RegExp(`${paths.inventoryItem}\\?id=${product.id}`));
  }

  async itemNamesText() {
    return this.itemNames.allTextContents();
  }
}
