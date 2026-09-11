import { BasePage } from './BasePage.js';
import { paths } from '../config/env.js';

export class CheckoutInformationPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.title = page.getByTestId('title');
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.errorAlert = page.getByTestId('error');
    this.dismissErrorButton = page.getByRole('button', { name: 'Dismiss error' });
  }

  async goto() {
    await this.gotoPath(paths.checkoutStepOne);
  }

  /**
   * @param {{ firstName: string, lastName: string, postalCode: string }} info
   */
  async fillInformation(info) {
    await this.firstName.fill(info.firstName);
    await this.lastName.fill(info.lastName);
    await this.postalCode.fill(info.postalCode);
  }

  async continue() {
    await this.continueButton.click({ noWaitAfter: true });
  }

  async cancel() {
    await this.cancelButton.click({ noWaitAfter: true });
    await this.page.waitForURL(/\/cart\.html/);
  }

  async submit(info) {
    await this.fillInformation(info);
    await this.continue();
  }
}
