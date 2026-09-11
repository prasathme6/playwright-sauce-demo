import { test, expect } from '../fixtures/test.js';
import { backpack, bikeLight, products } from '../data/products.js';
import { validCheckout } from '../data/checkout.js';
import { checkoutCompleteCopy } from '../data/messages.js';
import { expectedGrandTotal, sumPrices } from '../utils/price.js';

test.describe('End-to-end purchase @regression @end-to-end', () => {
  test('standard user buys one item @smoke', async ({
    asStandardUser,
    productsPage,
    cartPage,
    checkoutInformationPage,
    checkoutOverviewPage,
    checkoutCompletePage,
  }) => {
    await asStandardUser;
    await productsPage.addToCart(backpack);
    await productsPage.openCart();
    await cartPage.proceedToCheckout();
    await checkoutInformationPage.submit(validCheckout);
    await checkoutOverviewPage.finish();
    await expect(checkoutCompletePage.completeHeader).toHaveText(checkoutCompleteCopy.header);
  });

  test('standard user buys two items and pays combined total', async ({
    asStandardUser,
    productsPage,
    cartPage,
    checkoutInformationPage,
    checkoutOverviewPage,
    checkoutCompletePage,
  }) => {
    await asStandardUser;
    await productsPage.addToCart(backpack);
    await productsPage.addToCart(bikeLight);
    await productsPage.openCart();
    await cartPage.proceedToCheckout();
    await checkoutInformationPage.submit(validCheckout);
    const itemTotal = sumPrices([backpack.price, bikeLight.price]);
    expect(await checkoutOverviewPage.grandTotalValue()).toBe(expectedGrandTotal(itemTotal));
    await checkoutOverviewPage.finish();
    await expect(checkoutCompletePage.completeHeader).toHaveText(checkoutCompleteCopy.header);
  });

  test('removing an item before checkout purchases only the remaining item', async ({
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
    await cartPage.remove(bikeLight);
    await cartPage.proceedToCheckout();
    await checkoutInformationPage.submit(validCheckout);
    await expect(checkoutOverviewPage.itemNames).toHaveText(backpack.name);
    expect(await checkoutOverviewPage.itemTotalValue()).toBe(backpack.price);
  });

  test('full catalog checkout completes @functional', async ({
    asStandardUser,
    productsPage,
    cartPage,
    checkoutInformationPage,
    checkoutOverviewPage,
    checkoutCompletePage,
  }) => {
    await asStandardUser;
    for (const product of products) {
      await productsPage.addToCart(product);
    }
    await productsPage.openCart();
    await expect(cartPage.itemNames).toHaveCount(products.length);
    await cartPage.proceedToCheckout();
    await checkoutInformationPage.submit(validCheckout);
    const itemTotal = sumPrices(products.map((product) => product.price));
    expect(await checkoutOverviewPage.itemTotalValue()).toBe(itemTotal);
    await checkoutOverviewPage.finish();
    await expect(checkoutCompletePage.completeHeader).toHaveText(checkoutCompleteCopy.header);
  });
});
