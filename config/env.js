/** Environment and app URLs. Sauce Demo has no local app server. */
export const baseURL = process.env.BASE_URL || 'https://www.saucedemo.com';

export const paths = {
  login: '/',
  inventory: '/inventory.html',
  inventoryItem: '/inventory-item.html',
  cart: '/cart.html',
  checkoutStepOne: '/checkout-step-one.html',
  checkoutStepTwo: '/checkout-step-two.html',
  checkoutComplete: '/checkout-complete.html',
};

export const externalUrls = {
  about: 'https://saucelabs.com/',
  twitter: 'https://x.com/saucelabs',
  facebook: 'https://www.facebook.com/saucelabs',
  linkedin: 'https://www.linkedin.com/company/sauce-labs/',
};
