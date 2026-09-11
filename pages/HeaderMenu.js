export class HeaderMenu {
  /**
   * Burger menu + cart icon appear on every authenticated page.
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.openMenuButton = page.getByRole('button', { name: 'Open Menu' });
    this.closeMenuButton = page.getByRole('button', { name: 'Close Menu' });
    this.allItemsLink = page.getByTestId('inventory-sidebar-link');
    this.aboutLink = page.getByTestId('about-sidebar-link');
    this.logoutLink = page.getByTestId('logout-sidebar-link');
    this.resetAppStateLink = page.getByTestId('reset-sidebar-link');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }

  async open() {
    await this.openMenuButton.click();
    await this.logoutLink.waitFor({ state: 'visible' });
  }

  async close() {
    await this.closeMenuButton.click();
    await this.logoutLink.waitFor({ state: 'hidden' });
  }

  async logout() {
    await this.open();
    await this.logoutLink.click({ noWaitAfter: true });
    await this.page.waitForURL((url) => {
      const { pathname } = url;
      return pathname === '/' || pathname === '';
    });
  }

  async goToAllItems() {
    await this.open();
    await this.allItemsLink.click({ noWaitAfter: true });
    await this.page.waitForURL(/\/inventory\.html/);
  }

  async resetAppState() {
    await this.open();
    await this.resetAppStateLink.click();
    await this.close();
  }

  async openAbout() {
    await this.open();
    await this.aboutLink.click();
  }

  async openCart() {
    await this.cartLink.click({ noWaitAfter: true });
    await this.page.waitForURL(/\/cart\.html/);
  }

  cartBadgeLocator() {
    return this.cartBadge;
  }
}
