import { BasePage } from './BasePage.js';
import { parsePrice } from '../utils/price.js';
import { paths } from '../config/env.js';

export class CheckoutOverviewPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.title = page.getByTestId('title');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.paymentLabel = page.getByTestId('payment-info-label');
    this.paymentValue = page.getByTestId('payment-info-value');
    this.shippingLabel = page.getByTestId('shipping-info-label');
    this.shippingValue = page.getByTestId('shipping-info-value');
    this.subtotal = page.getByTestId('subtotal-label');
    this.tax = page.getByTestId('tax-label');
    this.total = page.getByTestId('total-label');
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.finishButton = page.getByRole('button', { name: 'Finish' });
  }

  async goto() {
    await this.gotoPath(paths.checkoutStepTwo);
  }

  async finish() {
    await this.finishButton.click({ noWaitAfter: true });
    await this.page.waitForURL(/\/checkout-complete\.html/);
  }

  async cancel() {
    await this.cancelButton.click({ noWaitAfter: true });
    await this.page.waitForURL(/\/inventory\.html/);
  }

  async itemTotalValue() {
    return parsePrice(await this.subtotal.innerText());
  }

  async taxValue() {
    return parsePrice(await this.tax.innerText());
  }

  async grandTotalValue() {
    return parsePrice(await this.total.innerText());
  }
}
