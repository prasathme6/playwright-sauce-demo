# Test case to automated test mapping

| Test Case ID | Spec file | Test title / pattern |
| --- | --- | --- |
| TC-LOGIN-001 | tests/login.spec.js | login page shows credentials... |
| TC-LOGIN-002 | tests/login.spec.js | same test (password type) |
| TC-LOGIN-003 | tests/login.spec.js | standard user reaches the products catalog |
| TC-LOGIN-004 | tests/login.spec.js | problem_user can authenticate |
| TC-LOGIN-005 | tests/login.spec.js | error_user can authenticate |
| TC-LOGIN-006 | tests/login.spec.js | visual_user can authenticate |
| TC-LOGIN-007 | tests/login.spec.js | performance_glitch_user reaches products... |
| TC-LOGIN-008 | tests/login.spec.js | locked_out_user cannot sign in |
| TC-LOGIN-009 | tests/login.spec.js | empty username shows username required |
| TC-LOGIN-010 | tests/login.spec.js | empty password shows password required |
| TC-LOGIN-011 | tests/login.spec.js | both fields empty shows username required |
| TC-LOGIN-012 | tests/login.spec.js | unknown-user is rejected |
| TC-LOGIN-013 | tests/login.spec.js | wrong-password is rejected |
| TC-LOGIN-014 | tests/login.spec.js | error banner can be dismissed |
| TC-AUTH-001–006 | tests/auth-guard.spec.js | unauthenticated visit to \<path\> |
| TC-AUTH-007 | tests/auth-guard.spec.js | browser back after logout... |
| TC-PROD-001 | tests/inventory.spec.js | catalog lists six products... |
| TC-PROD-002 | tests/inventory.spec.js | default sort is Name (A to Z) |
| TC-PROD-003 | tests/inventory.spec.js | sort by Name (Z to A) |
| TC-PROD-004 | tests/inventory.spec.js | sort by Price (low to high) |
| TC-PROD-005 | tests/inventory.spec.js | sort by Price (high to low) |
| TC-PROD-006–011 | tests/inventory.spec.js | add then remove \<product\> from the catalog |
| TC-PROD-012 | tests/inventory.spec.js | cart badge counts multiple distinct products |
| TC-PROD-013 | tests/inventory.spec.js | there is no quantity stepper on a product card |
| TC-DET-001 | tests/product-details.spec.js | opening a product by name... |
| TC-DET-002 | tests/product-details.spec.js | opening a product by image... |
| TC-DET-003 | tests/product-details.spec.js | Back to products returns to the catalog |
| TC-DET-004 | tests/product-details.spec.js | add and remove from details... |
| TC-DET-005–010 | tests/product-details.spec.js | details for \<product\> match catalog data |
| TC-CART-001 | tests/cart.spec.js | empty cart shows title... |
| TC-CART-002 | tests/cart.spec.js | added product appears with quantity 1 |
| TC-CART-003 | tests/cart.spec.js | Continue Shopping returns to the catalog |
| TC-CART-004 | tests/cart.spec.js | Checkout opens customer information |
| TC-CART-005 | tests/cart.spec.js | Remove deletes the line item... |
| TC-CART-006 | tests/cart.spec.js | cart can hold two different products |
| TC-CART-007 | tests/cart.spec.js | product name in the cart opens details |
| TC-CART-008 | tests/cart.spec.js | there is no quantity editor in the cart |
| TC-CART-009 | tests/cart.spec.js | all six products can be added to the cart |
| TC-CHK-001 | tests/checkout.spec.js | information page has first name... |
| TC-CHK-002–005 | tests/checkout.spec.js | validation: \<id\> |
| TC-CHK-006 | tests/checkout.spec.js | Cancel from information returns to the cart |
| TC-CHK-007–008 | tests/checkout.spec.js | valid information opens overview with tax math |
| TC-CHK-009 | tests/checkout.spec.js | Cancel from overview returns to the catalog |
| TC-CHK-010 | tests/checkout.spec.js | Finish shows thank-you page... |
| TC-CHK-011 | tests/checkout.spec.js | Back Home from complete returns to products |
| TC-CHK-012 | tests/checkout.spec.js | Generate PDF order is enabled... |
| TC-CHK-013–014 | tests/checkout.spec.js | checkout accepts \<id\> because the app has no format rules |
| TC-CHK-015 | tests/checkout.spec.js | overview tax is 8% of combined item prices |
| TC-MENU-001 | tests/menu.spec.js | burger menu opens All Items... |
| TC-MENU-002 | tests/menu.spec.js | Close Menu hides the sidebar links |
| TC-MENU-003 | tests/menu.spec.js | All Items from the cart returns to the catalog |
| TC-MENU-004 | tests/menu.spec.js | Logout returns to the login page |
| TC-MENU-005 | tests/menu.spec.js | Reset App State clears the cart badge |
| TC-MENU-006 | tests/menu.spec.js | About navigates to Sauce Labs marketing site |
| TC-MENU-007 | tests/menu.spec.js | footer copyright is visible |
| TC-E2E-001 | tests/e2e.spec.js | standard user buys one item |
| TC-E2E-002 | tests/e2e.spec.js | standard user buys two items... |
| TC-E2E-003 | tests/e2e.spec.js | removing an item before checkout... |
| TC-E2E-004 | tests/e2e.spec.js | full catalog checkout completes |
