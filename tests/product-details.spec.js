import { test, expect } from '../fixtures/test.js';
import { products, backpack } from '../data/products.js';
import { paths } from '../config/env.js';

test.describe('Product details @regression', () => {
  test.beforeEach(async ({ asStandardUser }) => {
    await asStandardUser;
  });

  test('opening a product by name shows matching details @smoke @navigation', async ({
    productsPage,
    productDetailsPage,
    page,
  }) => {
    await productsPage.openProductByName(backpack);
    await expect(page).toHaveURL(new RegExp(`${paths.inventoryItem}\\?id=${backpack.id}`));
    await expect(productDetailsPage.name).toHaveText(backpack.name);
    await expect(productDetailsPage.description).toHaveText(backpack.description);
    await expect(productDetailsPage.price).toHaveText(`$${backpack.price.toFixed(2)}`);
    await expect(productDetailsPage.addToCartButton).toBeVisible();
    await expect(productDetailsPage.backToProducts).toBeVisible();
  });

  test('opening a product by image reaches the same details page @navigation', async ({
    productsPage,
    productDetailsPage,
  }) => {
    await productsPage.openProductByImage(backpack);
    await expect(productDetailsPage.name).toHaveText(backpack.name);
  });

  test('Back to products returns to the catalog @navigation', async ({
    productsPage,
    productDetailsPage,
    page,
  }) => {
    await productsPage.openProductByName(backpack);
    await productDetailsPage.back();
    await expect(page).toHaveURL(new RegExp(`${paths.inventory}$`));
    await expect(productsPage.title).toHaveText('Products');
  });

  test('add and remove from details updates the cart badge @functional', async ({
    productsPage,
    productDetailsPage,
  }) => {
    await productsPage.openProductByName(backpack);
    await productDetailsPage.addToCart();
    await expect(productDetailsPage.removeButton).toBeVisible();
    await expect(productDetailsPage.menu.cartBadge).toHaveText('1');
    await productDetailsPage.removeFromCart();
    await expect(productDetailsPage.addToCartButton).toBeVisible();
    await expect(productDetailsPage.menu.cartBadge).toHaveCount(0);
  });

  for (const product of products) {
    test(`details for ${product.name} match catalog data @data-driven @functional`, async ({
      productsPage,
      productDetailsPage,
    }) => {
      await productsPage.openProductByName(product);
      await expect(productDetailsPage.name).toHaveText(product.name);
      await expect(productDetailsPage.description).toHaveText(product.description);
      await expect(productDetailsPage.price).toHaveText(`$${product.price.toFixed(2)}`);
    });
  }
});
