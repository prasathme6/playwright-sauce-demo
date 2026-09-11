/** Parse "$29.99" or "Item total: $29.99" into a number. */
export function parsePrice(text) {
  const match = String(text).match(/\$?(\d+\.\d{2})/);
  if (!match) {
    throw new Error(`Could not parse price from: ${text}`);
  }
  return Number(match[1]);
}

export function sumPrices(prices) {
  return prices.reduce((total, price) => total + price, 0);
}

/**
 * Sauce Demo tax is 8% of item total, rounded to two decimals
 * (observed: $29.99 item total -> Tax $2.40, Total $32.39).
 */
export function expectedTax(itemTotal) {
  return Number((itemTotal * 0.08).toFixed(2));
}

export function expectedGrandTotal(itemTotal) {
  return Number((itemTotal + expectedTax(itemTotal)).toFixed(2));
}

export function formatPrice(amount) {
  return `$${amount.toFixed(2)}`;
}
