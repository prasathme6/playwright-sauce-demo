import { test, expect } from '../fixtures/test.js';
import { products } from '../data/products.js';
import { sortOptions } from '../data/sorting.js';
import { paths } from '../config/env.js';

test.describe('Products catalog @regression', () => {
  test.beforeEach(async ({ asStandardUser }) => {
    await asStandardUser;
  });

  test('catalog lists six products with name, description, price, image, and add button @smoke @ui', async ({
    productsPage,
    page,
  }) => {
    await expect(page).toHaveURL(new RegExp(`${paths.inventory}$`));
    await expect(productsPage.inventoryItems).toHaveCount(products.length);

    for (const product of products) {
      const card = productsPage.productCard(product.name);
      await expect(productsPage.productTitle(product)).toHaveText(product.name);
      await expect(productsPage.productImage(product.name)).toBeVisible();
      await expect(card.getByText(product.description)).toBeVisible();
      await expect(card.getByTestId('inventory-item-price')).toHaveText(`$${product.price.toFixed(2)}`);
      await expect(productsPage.addToCartButton(product)).toHaveText('Add to cart');
    }
  });

  test('default sort is Name (A to Z) @functional', async ({ productsPage }) => {
    await expect(productsPage.sortDropdown).toHaveValue(sortOptions.nameAz.value);
    const names = await productsPage.productNames();
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  test('sort by Name (Z to A) @functional @data-driven', async ({ productsPage }) => {
    await productsPage.sortBy(sortOptions.nameZa.label);
    const names = await productsPage.productNames();
    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
  });

  test('sort by Price (low to high) @functional @data-driven', async ({ productsPage }) => {
    await productsPage.sortBy(sortOptions.priceLoHi.label);
    const prices = await productsPage.productPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sort by Price (high to low) @functional @data-driven', async ({ productsPage }) => {
    await productsPage.sortBy(sortOptions.priceHiLo.label);
    const prices = await productsPage.productPrices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  for (const product of products) {
    test(`add then remove ${product.name} from the catalog @functional @data-driven`, async ({
      productsPage,
    }) => {
      await productsPage.addToCart(product);
      await expect(productsPage.removeButton(product)).toHaveText('Remove');
      await expect(productsPage.menu.cartBadge).toHaveText('1');
      await productsPage.removeFromCart(product);
      await expect(productsPage.addToCartButton(product)).toHaveText('Add to cart');
      await expect(productsPage.menu.cartBadge).toHaveCount(0);
    });
  }

  test('cart badge counts multiple distinct products @functional @positive', async ({
    productsPage,
  }) => {
    await productsPage.addToCart(products[0]);
    await productsPage.addToCart(products[1]);
    await productsPage.addToCart(products[2]);
    await expect(productsPage.menu.cartBadge).toHaveText('3');
  });

  test('there is no quantity stepper on a product card @ui', async ({ page }) => {
    await expect(page.getByRole('spinbutton')).toHaveCount(0);
    await expect(page.getByRole('button', { name: /increase|decrease|qty/i })).toHaveCount(0);
  });
});
