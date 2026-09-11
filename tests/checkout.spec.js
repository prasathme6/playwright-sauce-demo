import { test, expect } from '../fixtures/test.js';
import { backpack, bikeLight } from '../data/products.js';
import {
  validCheckout,
  checkoutValidationCases,
  checkoutAcceptedWithoutFormatRules,
} from '../data/checkout.js';
import { checkoutCompleteCopy, overviewCopy } from '../data/messages.js';
import { expectedTax, expectedGrandTotal, sumPrices } from '../utils/price.js';
import { randomCheckoutInfo } from '../utils/randomData.js';
import { paths } from '../config/env.js';

test.describe('Checkout @regression', () => {
  test.beforeEach(async ({ asStandardUser, productsPage }) => {
    await asStandardUser;
    await productsPage.addToCart(backpack);
    await productsPage.openCart();
  });

  test('information page has first name, last name, postal code, cancel, and continue @smoke @ui', async ({
    cartPage,
    checkoutInformationPage,
  }) => {
    await cartPage.proceedToCheckout();
    await expect(checkoutInformationPage.title).toHaveText('Checkout: Your Information');
    await expect(checkoutInformationPage.firstName).toBeVisible();
    await expect(checkoutInformationPage.lastName).toBeVisible();
    await expect(checkoutInformationPage.postalCode).toBeVisible();
    await expect(checkoutInformationPage.cancelButton).toBeVisible();
    await expect(checkoutInformationPage.continueButton).toBeVisible();
  });

  for (const scenario of checkoutValidationCases) {
    test(`validation: ${scenario.id} @validation @negative @data-driven`, async ({
      cartPage,
      checkoutInformationPage,
    }) => {
      await cartPage.proceedToCheckout();
      await checkoutInformationPage.submit(scenario);
      await expect(checkoutInformationPage.errorAlert).toHaveText(scenario.expectedError);
    });
  }

  test('Cancel from information returns to the cart @navigation', async ({
    cartPage,
    checkoutInformationPage,
    page,
  }) => {
    await cartPage.proceedToCheckout();
    await checkoutInformationPage.cancel();
    await expect(page).toHaveURL(new RegExp(`${paths.cart}$`));
    await expect(cartPage.title).toHaveText('Your Cart');
  });

  test('valid information opens overview with tax math @smoke @positive', async ({
    cartPage,
    checkoutInformationPage,
    checkoutOverviewPage,
  }) => {
    await cartPage.proceedToCheckout();
    await checkoutInformationPage.submit(validCheckout);
    await expect(checkoutOverviewPage.title).toHaveText('Checkout: Overview');
    await expect(checkoutOverviewPage.itemNames).toHaveText(backpack.name);
    await expect(checkoutOverviewPage.paymentLabel).toHaveText(overviewCopy.paymentLabel);
    await expect(checkoutOverviewPage.paymentValue).toHaveText(overviewCopy.paymentValue);
    await expect(checkoutOverviewPage.shippingLabel).toHaveText(overviewCopy.shippingLabel);
    await expect(checkoutOverviewPage.shippingValue).toHaveText(overviewCopy.shippingValue);

    const itemTotal = backpack.price;
    expect(await checkoutOverviewPage.itemTotalValue()).toBe(itemTotal);
    expect(await checkoutOverviewPage.taxValue()).toBe(expectedTax(itemTotal));
    expect(await checkoutOverviewPage.grandTotalValue()).toBe(expectedGrandTotal(itemTotal));
  });

  test('Cancel from overview returns to the catalog @navigation', async ({
    cartPage,
    checkoutInformationPage,
    checkoutOverviewPage,
    productsPage,
    page,
  }) => {
    await cartPage.proceedToCheckout();
    await checkoutInformationPage.submit(validCheckout);
    await checkoutOverviewPage.cancel();
    await expect(page).toHaveURL(new RegExp(`${paths.inventory}$`));
    await expect(productsPage.title).toHaveText('Products');
  });

  test('Finish shows thank-you page and clears the cart badge @smoke @end-to-end', async ({
    cartPage,
    checkoutInformationPage,
    checkoutOverviewPage,
    checkoutCompletePage,
  }) => {
    await cartPage.proceedToCheckout();
    await checkoutInformationPage.submit(randomCheckoutInfo());
    await checkoutOverviewPage.finish();
    await expect(checkoutCompletePage.title).toHaveText('Checkout: Complete!');
    await expect(checkoutCompletePage.completeHeader).toHaveText(checkoutCompleteCopy.header);
    await expect(checkoutCompletePage.completeText).toHaveText(checkoutCompleteCopy.text);
    await expect(checkoutCompletePage.ponyImage).toBeVisible();
    await expect(checkoutCompletePage.generatePdf).toBeVisible();
    await expect(checkoutCompletePage.menu.cartBadge).toHaveCount(0);
  });

  test('Back Home from complete returns to products @navigation', async ({
    cartPage,
    checkoutInformationPage,
    checkoutOverviewPage,
    checkoutCompletePage,
    productsPage,
    page,
  }) => {
    await cartPage.proceedToCheckout();
    await checkoutInformationPage.submit(validCheckout);
    await checkoutOverviewPage.finish();
    await checkoutCompletePage.backHomeToInventory();
    await expect(page).toHaveURL(new RegExp(`${paths.inventory}$`));
    await expect(productsPage.title).toHaveText('Products');
  });

  test('Generate PDF order is enabled after a completed purchase @functional', async ({
    cartPage,
    checkoutInformationPage,
    checkoutOverviewPage,
    checkoutCompletePage,
  }) => {
    await cartPage.proceedToCheckout();
    await checkoutInformationPage.submit(validCheckout);
    await checkoutOverviewPage.finish();
    await expect(checkoutCompletePage.generatePdf).toBeEnabled();
  });

  for (const info of checkoutAcceptedWithoutFormatRules) {
    test(`checkout accepts ${info.id} because the app has no format rules @boundary @data-driven`, async ({
      cartPage,
      checkoutInformationPage,
      checkoutOverviewPage,
    }) => {
      await cartPage.proceedToCheckout();
      await checkoutInformationPage.submit(info);
      await expect(checkoutOverviewPage.title).toHaveText('Checkout: Overview');
    });
  }
});

test.describe('Checkout totals @regression', () => {
  test('overview tax is 8% of combined item prices @functional', async ({
    asStandardUser,
    productsPage,
    cartPage,
    checkoutInformationPage,
    checkoutOverviewPage,
  }) => {
    await asStandardUser;
    await productsPage.addToCart(backpack);
    await productsPage.addToCart(bikeLight);
    await productsPage.openCart();
    await cartPage.proceedToCheckout();
    await checkoutInformationPage.submit(validCheckout);
    const itemTotal = sumPrices([backpack.price, bikeLight.price]);
    expect(await checkoutOverviewPage.itemTotalValue()).toBe(itemTotal);
    expect(await checkoutOverviewPage.taxValue()).toBe(expectedTax(itemTotal));
    expect(await checkoutOverviewPage.grandTotalValue()).toBe(expectedGrandTotal(itemTotal));
  });
});
