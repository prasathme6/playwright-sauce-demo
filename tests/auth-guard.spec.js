import { test, expect } from '../fixtures/test.js';
import { LoginPage } from '../pages/LoginPage.js';
import { paths } from '../config/env.js';

const protectedPaths = [
  paths.inventory,
  paths.cart,
  `${paths.inventoryItem}?id=4`,
  paths.checkoutStepOne,
  paths.checkoutStepTwo,
  paths.checkoutComplete,
];

test.describe('Auth guard @regression @negative', () => {
  for (const path of protectedPaths) {
    test(`unauthenticated visit to ${path} redirects to login @navigation @data-driven`, async ({
      page,
    }) => {
      const loginPage = new LoginPage(page);
      await page.goto(path);
      await loginPage.expectRedirectToLogin();
      await expect(loginPage.loginButton).toBeVisible();
    });
  }

  test('browser back after logout does not restore a shop session @functional @negative', async ({
    asStandardUser,
    productsPage,
    loginPage,
    page,
  }) => {
    await asStandardUser;
    await productsPage.menu.logout();
    await expect(loginPage.loginButton).toBeVisible();
    await page.goBack();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(page).not.toHaveURL(/inventory\.html/);
  });
});
