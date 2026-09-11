import { test, expect } from '../fixtures/test.js';
import { backpack } from '../data/products.js';
import { externalUrls, paths } from '../config/env.js';

test.describe('Menu, footer, and session @regression', () => {
  test.beforeEach(async ({ asStandardUser }) => {
    await asStandardUser;
  });

  test('burger menu opens All Items, About, Logout, and Reset App State @smoke @ui', async ({
    productsPage,
  }) => {
    await productsPage.menu.open();
    await expect(productsPage.menu.allItemsLink).toBeVisible();
    await expect(productsPage.menu.aboutLink).toBeVisible();
    await expect(productsPage.menu.logoutLink).toBeVisible();
    await expect(productsPage.menu.resetAppStateLink).toBeVisible();
  });

  test('Close Menu hides the sidebar links @ui @navigation', async ({ productsPage }) => {
    await productsPage.menu.open();
    await productsPage.menu.close();
    await expect(productsPage.menu.logoutLink).toBeHidden();
  });

  test('All Items from the cart returns to the catalog @navigation', async ({
    productsPage,
    cartPage,
    page,
  }) => {
    await productsPage.openCart();
    await cartPage.menu.goToAllItems();
    await expect(page).toHaveURL(new RegExp(`${paths.inventory}$`));
    await expect(productsPage.title).toHaveText('Products');
  });

  test('Logout returns to the login page @smoke @functional', async ({
    productsPage,
    loginPage,
    page,
  }) => {
    await productsPage.menu.logout();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(page).toHaveURL(/saucedemo\.com\/?$/);
  });

  test('Reset App State clears the cart badge @functional', async ({ productsPage }) => {
    await productsPage.addToCart(backpack);
    await expect(productsPage.menu.cartBadge).toHaveText('1');
    await productsPage.menu.resetAppState();
    await expect(productsPage.menu.cartBadge).toHaveCount(0);
    await productsPage.goto();
    await expect(productsPage.addToCartButton(backpack)).toHaveText('Add to cart');
  });

  test('About navigates to Sauce Labs marketing site @navigation', async ({ productsPage, page }) => {
    await productsPage.menu.openAbout();
    await expect(page).toHaveURL(/saucelabs\.com/i);
  });

  test('footer copyright is visible @ui', async ({ productsPage }) => {
    await expect(productsPage.footerCopy).toContainText('Sauce Labs');
    await expect(productsPage.twitterLink).toHaveAttribute('href', externalUrls.twitter);
    await expect(productsPage.facebookLink).toHaveAttribute('href', externalUrls.facebook);
    await expect(productsPage.linkedinLink).toHaveAttribute('href', externalUrls.linkedin);
  });
});
