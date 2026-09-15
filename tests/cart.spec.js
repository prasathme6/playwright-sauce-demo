import { test, expect } from '../fixtures/test.js';
import { backpack, bikeLight, products } from '../data/products.js';
import { paths } from '../config/env.js';

test.describe('Cart @regression', () => {
  test.beforeEach(async ({ asStandardUser }) => {
    await asStandardUser;
  });

  
  test('empty cart shows title and checkout actions without line items @ui @smoke', async ({
    productsPage,
    cartPage,
  }) => {
    await productsPage.openCart(); 
    await expect(cartPage.title).toHaveText('Your Cart');
    await expect(cartPage.itemNames).toHaveCount(0);
    await expect(cartPage.continueShopping).toBeVisible();
    await expect(cartPage.checkout).toBeVisible();
  });

  test('added product appears with quantity 1 @functional @positive', async ({
    productsPage,
    cartPage,
  }) => {
    await productsPage.addToCart(backpack);
    await productsPage.openCart();
    await expect(cartPage.itemName(backpack.name)).toBeVisible();
    await expect(cartPage.itemPrices).toHaveText(`$${backpack.price.toFixed(2)}`);
    await expect(cartPage.quantities).toHaveText('1');
  });

  test('Continue Shopping returns to the catalog @navigation', async ({
    productsPage,
    cartPage,
    page,
  }) => {
    await productsPage.openCart();
    await cartPage.continueShoppingToInventory();
    await expect(page).toHaveURL(new RegExp(`${paths.inventory}$`));
    await expect(productsPage.title).toHaveText('Products');
  });

  test('Checkout opens customer information @navigation @smoke', async ({
    productsPage,
    cartPage,
    checkoutInformationPage,
  }) => {
    await productsPage.addToCart(backpack);
    await productsPage.openCart();
    await cartPage.proceedToCheckout();
    await expect(checkoutInformationPage.title).toHaveText('Checkout: Your Information');
  });

  test('Remove deletes the line item and clears the badge @functional', async ({
    productsPage,
    cartPage,
  }) => {
    await productsPage.addToCart(backpack);
    await productsPage.openCart();
    await cartPage.remove(backpack);
    await expect(cartPage.itemNames).toHaveCount(0);
    await expect(cartPage.menu.cartBadge).toHaveCount(0);
  });

  test('cart can hold two different products @functional', async ({ productsPage, cartPage }) => {
    await productsPage.addToCart(backpack);
    await productsPage.addToCart(bikeLight);
    await productsPage.openCart();
    await expect(cartPage.itemNames).toHaveCount(2);
    expect(await cartPage.itemNamesText()).toEqual(
      expect.arrayContaining([backpack.name, bikeLight.name]),
    );
  });

  test('product name in the cart opens details @navigation', async ({
    productsPage,
    cartPage,
    productDetailsPage,
  }) => {
    await productsPage.addToCart(backpack);
    await productsPage.openCart();
    await cartPage.openItem(backpack);
    await expect(productDetailsPage.name).toHaveText(backpack.name);
  });

  test('there is no quantity editor in the cart @ui', async ({ productsPage, cartPage, page }) => {
    await productsPage.addToCart(backpack);
    await productsPage.openCart();
    await expect(page.getByRole('spinbutton')).toHaveCount(0);
    await expect(cartPage.quantities).toHaveText('1');
  });

  test('all six products can be added to the cart @data-driven @functional', async ({
    productsPage,
    cartPage,
  }) => {
    for (const product of products) {
      await productsPage.addToCart(product);
    }
    await productsPage.openCart();
    await expect(cartPage.itemNames).toHaveCount(6);
    await expect(productsPage.menu.cartBadge).toHaveText('6');
  });
});
