import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { ProductsPage } from '../pages/ProductsPage.js';
import { ProductDetailsPage } from '../pages/ProductDetailsPage.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutInformationPage } from '../pages/CheckoutInformationPage.js';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage.js';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage.js';
import { users } from '../data/users.js';

/**
 * Custom fixtures give every test ready page objects.
 * `asStandardUser` logs in with a fresh browser context (tests stay independent).
 */
export const test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  productDetailsPage: async ({ page }, use) => {
    await use(new ProductDetailsPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutInformationPage: async ({ page }, use) => {
    await use(new CheckoutInformationPage(page));
  },
  checkoutOverviewPage: async ({ page }, use) => {
    await use(new CheckoutOverviewPage(page));
  },
  checkoutCompletePage: async ({ page }, use) => {
    await use(new CheckoutCompletePage(page));
  },
  asStandardUser: async ({ loginPage, productsPage }, use) => {
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(productsPage.title).toHaveText('Products');
    await use(productsPage);
  },
});

export { expect };
