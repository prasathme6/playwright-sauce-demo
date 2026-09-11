import { BasePage } from './BasePage.js';
import { paths } from '../config/env.js';

export class CheckoutCompletePage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.title = page.getByTestId('title');
    this.completeHeader = page.getByTestId('complete-header');
    this.completeText = page.getByTestId('complete-text');
    this.ponyImage = page.getByTestId('pony-express');
    this.backHome = page.getByRole('button', { name: 'Back Home' });
    this.generatePdf = page.getByRole('button', { name: 'Generate PDF order' });
  }

  async goto() {
    await this.gotoPath(paths.checkoutComplete);
  }

  async backHomeToInventory() {
    await this.backHome.click({ noWaitAfter: true });
    await this.page.waitForURL(/\/inventory\.html/);
  }
}
