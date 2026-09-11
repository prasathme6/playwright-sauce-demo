import { test, expect } from '../fixtures/test.js';
import { users, invalidUsers, validShoppers } from '../data/users.js';
import { loginErrors } from '../data/messages.js';
import { paths } from '../config/env.js';

test.describe('Login @regression', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('login page shows credentials, username, password, and login control @smoke @ui', async ({
    loginPage,
    page,
  }) => {
    await expect(page).toHaveTitle('Swag Labs');
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.acceptedUsernames).toContainText('standard_user');
    await expect(loginPage.acceptedUsernames).toContainText('locked_out_user');
    await expect(loginPage.passwordHint).toContainText(users.standard.password);
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('standard user reaches the products catalog @smoke @positive', async ({
    loginPage,
    productsPage,
    page,
  }) => {
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(new RegExp(`${paths.inventory}$`));
    await expect(productsPage.title).toHaveText('Products');
  });

  for (const shopper of validShoppers.filter(
    (user) => user.username !== users.performance.username && user.username !== users.standard.username,
  )) {
    test(`${shopper.username} can authenticate @positive @data-driven`, async ({
      loginPage,
      productsPage,
    }) => {
      await loginPage.login(shopper.username, shopper.password);
      await expect(productsPage.title).toHaveText('Products');
    });
  }

  test('performance_glitch_user reaches products after a slower login @positive', async ({
    loginPage,
    productsPage,
  }) => {
    test.setTimeout(45_000);
    await loginPage.login(users.performance.username, users.performance.password);
    await expect(productsPage.title).toHaveText('Products', { timeout: 20_000 });
  });

  test('locked_out_user cannot sign in @negative @smoke', async ({ loginPage, page }) => {
    await loginPage.login(users.locked.username, users.locked.password);
    await expect(loginPage.errorAlert).toHaveText(loginErrors.lockedOut);
    await expect(page).toHaveURL(/saucedemo\.com\/?$/);
  });

  test('empty username shows username required @validation @negative', async ({ loginPage }) => {
    await loginPage.login('', users.standard.password);
    await expect(loginPage.errorAlert).toHaveText(loginErrors.usernameRequired);
  });

  test('empty password shows password required @validation @negative', async ({ loginPage }) => {
    await loginPage.login(users.standard.username, '');
    await expect(loginPage.errorAlert).toHaveText(loginErrors.passwordRequired);
  });

  test('both fields empty shows username required @validation @negative', async ({ loginPage }) => {
    await loginPage.loginButton.click();
    await expect(loginPage.errorAlert).toHaveText(loginErrors.usernameRequired);
  });

  for (const invalid of invalidUsers) {
    test(`${invalid.id} is rejected @negative @data-driven`, async ({ loginPage }) => {
      await loginPage.login(invalid.username, invalid.password);
      await expect(loginPage.errorAlert).toHaveText(invalid.expectedError);
    });
  }

  test('error banner can be dismissed @functional @ui', async ({ loginPage }) => {
    await loginPage.loginButton.click();
    await expect(loginPage.errorAlert).toBeVisible();
    await loginPage.dismissError();
    await expect(loginPage.errorAlert).toHaveCount(0);
  });
});
