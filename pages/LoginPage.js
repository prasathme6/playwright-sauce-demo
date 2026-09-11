import { BasePage } from './BasePage.js';
import { paths } from '../config/env.js';

export class LoginPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.usernameInput = page.getByTestId('username');
    this.passwordInput = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
    this.errorAlert = page.getByTestId('error');
    this.dismissErrorButton = page.getByRole('button', { name: 'Dismiss error' });
    this.acceptedUsernames = page.locator('#login_credentials');
    this.passwordHint = page.locator('.login_password');
  }

  async goto() {
    await this.gotoPath(paths.login);
  }

  /**
   * @param {string} username
   * @param {string} password
   */
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    // Firefox can hang waiting for a click that triggers navigation.
    await this.loginButton.click({ noWaitAfter: true });
  }

  async dismissError() {
    await this.dismissErrorButton.click();
  }
}
