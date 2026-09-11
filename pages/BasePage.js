import { HeaderMenu } from './HeaderMenu.js';
import { paths } from '../config/env.js';

export class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.menu = new HeaderMenu(page);
    this.appLogo = page.locator('.app_logo');
    this.footerCopy = page.getByTestId('footer-copy');
    this.twitterLink = page.getByTestId('social-x');
    this.facebookLink = page.getByTestId('social-facebook');
    this.linkedinLink = page.getByTestId('social-linkedin');
  }

  async gotoPath(path) {
    await this.page.goto(path);
  }

  async openCart() {
    await this.menu.openCart();
  }

  /**
   * Unauthenticated visits to shop URLs redirect to login (`/`).
   */
  async expectRedirectToLogin() {
    await this.page.waitForURL((url) => {
      const { pathname } = url;
      return pathname === '/' || pathname === '' || pathname === paths.login;
    });
  }
}
