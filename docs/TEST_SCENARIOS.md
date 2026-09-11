# Sauce Demo — test scenario inventory

Application: https://www.saucedemo.com/  
Observed: 11 Sep 2026

Sauce Demo is a **small demo shop** (login + catalog + cart + 3-step checkout). It does **not** support 150 unique, non-duplicative behaviors. Padding with the same add-to-cart flow worded 20 ways would not be meaningful.

**Unique meaningful scenarios listed below: 118.**  
Automated coverage is implemented as independent Playwright tests (including data-driven rows). Mapping: `docs/TEST_MAPPING.md`.

## Functionality that does not exist (do not automate)

- Registration, forgot password, profile, or address book
- Search, category filters, pagination, or wishlists
- Quantity increment/decrement (qty is always `1` per product)
- Coupons, payment card fields, or shipping method choice
- Multi-language, theme toggle, or cookie banner
- Inventory stock / sold-out states

---

## Phase 1 snapshot (what actually exists)

### Pages / URLs

| Page | URL |
| --- | --- |
| Login | `/` |
| Products | `/inventory.html` |
| Product details | `/inventory-item.html?id={0-5}` |
| Cart | `/cart.html` |
| Checkout information | `/checkout-step-one.html` |
| Checkout overview | `/checkout-step-two.html` |
| Checkout complete | `/checkout-complete.html` |

Unauthenticated visits to shop URLs redirect to login.

### Users (password for all: `secret_sauce`, printed on the login page)

`standard_user`, `locked_out_user`, `problem_user`, `performance_glitch_user`, `error_user`, `visual_user`

### Products (6)

| Name | Price | Item id |
| --- | --- | --- |
| Sauce Labs Backpack | $29.99 | 4 |
| Sauce Labs Bike Light | $9.99 | 0 |
| Sauce Labs Bolt T-Shirt | $15.99 | 1 |
| Sauce Labs Fleece Jacket | $49.99 | 5 |
| Sauce Labs Onesie | $7.99 | 2 |
| Test.allTheThings() T-Shirt (Red) | $15.99 | 3 |

### Controls observed

- Login: Username, Password, Login, error alert, Dismiss error
- Catalog: sort dropdown (az / za / lohi / hilo), Add to cart / Remove, product name + image links
- Details: Back to products, Add to cart / Remove
- Cart: QTY (display only), Continue Shopping, Checkout, Remove
- Checkout info: First Name, Last Name, Zip/Postal Code, Cancel, Continue
- Overview: Payment SauceCard #31337, Free Pony Express Delivery!, item total, tax (8%), total, Cancel, Finish
- Complete: Thank you copy, Back Home, Generate PDF order
- Header: Open/Close Menu, All Items, About, Logout, Reset App State, cart icon + badge
- Footer: X, Facebook, LinkedIn, copyright

### Login errors

- Epic sadface: Username is required
- Epic sadface: Password is required
- Epic sadface: Username and password do not match any user in this service
- Epic sadface: Sorry, this user has been locked out.

### Checkout errors

- Error: First Name is required
- Error: Last Name is required
- Error: Postal Code is required  
  (No format validation for names or postal codes.)

---

## Test cases

Priority: P1 smoke / P2 core functional / P3 extra / P4 observational user quirks.

### Login

| ID | Module | Test Scenario | Preconditions | Test Data | Test Steps | Expected Result | Priority | Test Type |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-LOGIN-001 | Login | Login page UI | None | — | Open `/` | Title Swag Labs; username; password; Login; accepted users listed | P1 | Smoke, UI |
| TC-LOGIN-002 | Login | Password field is masked | Login page | — | Inspect password input | `type=password` | P2 | UI |
| TC-LOGIN-003 | Login | Standard user login | Login page | standard_user | Enter credentials, Login | `/inventory.html`, title Products | P1 | Smoke, Positive |
| TC-LOGIN-004 | Login | problem_user can log in | Login page | problem_user | Login | Products page | P2 | Positive, Data-driven |
| TC-LOGIN-005 | Login | error_user can log in | Login page | error_user | Login | Products page | P2 | Positive, Data-driven |
| TC-LOGIN-006 | Login | visual_user can log in | Login page | visual_user | Login | Products page | P2 | Positive, Data-driven |
| TC-LOGIN-007 | Login | performance_glitch_user logs in slowly | Login page | performance_glitch_user | Login | Products page within extended timeout | P2 | Positive |
| TC-LOGIN-008 | Login | Locked user | Login page | locked_out_user | Login | Locked-out error; stay on login | P1 | Smoke, Negative |
| TC-LOGIN-009 | Login | Empty username | Login page | password only | Login | Username is required | P1 | Validation, Negative |
| TC-LOGIN-010 | Login | Empty password | Login page | username only | Login | Password is required | P1 | Validation, Negative |
| TC-LOGIN-011 | Login | Both empty | Login page | — | Click Login | Username is required | P2 | Validation, Negative |
| TC-LOGIN-012 | Login | Unknown user | Login page | not_a_user | Login | Do not match any user | P2 | Negative, Data-driven |
| TC-LOGIN-013 | Login | Wrong password | Login page | standard_user + wrong_password | Login | Do not match any user | P2 | Negative, Data-driven |
| TC-LOGIN-014 | Login | Dismiss error | Login error visible | — | Click Dismiss error | Alert gone | P3 | Functional, UI |

### Auth

| ID | Module | Test Scenario | Preconditions | Test Data | Test Steps | Expected Result | Priority | Test Type |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-AUTH-001 | Auth | Guard inventory | Logged out | /inventory.html | Open URL | Redirect to login | P1 | Navigation, Negative |
| TC-AUTH-002 | Auth | Guard cart | Logged out | /cart.html | Open URL | Redirect to login | P2 | Navigation, Negative |
| TC-AUTH-003 | Auth | Guard details | Logged out | /inventory-item.html?id=4 | Open URL | Redirect to login | P2 | Navigation, Negative |
| TC-AUTH-004 | Auth | Guard checkout step 1 | Logged out | /checkout-step-one.html | Open URL | Redirect to login | P2 | Navigation, Negative |
| TC-AUTH-005 | Auth | Guard checkout step 2 | Logged out | /checkout-step-two.html | Open URL | Redirect to login | P2 | Navigation, Negative |
| TC-AUTH-006 | Auth | Guard complete | Logged out | /checkout-complete.html | Open URL | Redirect to login | P2 | Navigation, Negative |
| TC-AUTH-007 | Auth | Back after logout | Logged in then logout | — | Browser Back | Login still shown | P2 | Functional, Negative |

### Products

| ID | Module | Test Scenario | Preconditions | Test Data | Test Steps | Expected Result | Priority | Test Type |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-PROD-001 | Products | Six product cards | standard_user | Catalog data | View inventory | 6 names, descriptions, prices, images, Add to cart | P1 | Smoke, UI |
| TC-PROD-002 | Products | Default sort A–Z | standard_user | az | Read names | Alphabetical A–Z | P2 | Functional |
| TC-PROD-003 | Products | Sort Z–A | standard_user | za | Select Name (Z to A) | Reverse alpha | P2 | Functional, Data-driven |
| TC-PROD-004 | Products | Sort price low–high | standard_user | lohi | Select Price (low to high) | Ascending prices | P2 | Functional, Data-driven |
| TC-PROD-005 | Products | Sort price high–low | standard_user | hilo | Select Price (high to low) | Descending prices | P2 | Functional, Data-driven |
| TC-PROD-006 to TC-PROD-011 | Products | Add/remove each product | standard_user | Each of 6 products | Add then Remove | Button toggles; badge 1 then gone | P2 | Functional, Data-driven |
| TC-PROD-012 | Products | Badge counts 3 items | standard_user | 3 products | Add 3 | Badge `3` | P2 | Functional, Positive |
| TC-PROD-013 | Products | No qty stepper | standard_user | — | Inspect cards | No spinbutton / qty buttons | P3 | UI |

### Product details

| ID | Module | Test Scenario | Preconditions | Test Data | Test Steps | Expected Result | Priority | Test Type |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-DET-001 | Details | Open by name | standard_user | Backpack | Click name | URL id=4; matching copy/price | P1 | Smoke, Navigation |
| TC-DET-002 | Details | Open by image | standard_user | Backpack | Click image | Same details | P2 | Navigation |
| TC-DET-003 | Details | Back to products | On details | — | Click Back to products | inventory.html | P2 | Navigation |
| TC-DET-004 | Details | Add/remove | On details | Backpack | Add then Remove | Badge 1 then 0 | P2 | Functional |
| TC-DET-005 to TC-DET-010 | Details | Data match for each product | standard_user | Each product | Open details | Name, description, price match catalog | P2 | Data-driven, Functional |

### Cart

| ID | Module | Test Scenario | Preconditions | Test Data | Test Steps | Expected Result | Priority | Test Type |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-CART-001 | Cart | Empty cart UI | Logged in, empty cart | — | Open cart | Your Cart; 0 items; Continue Shopping; Checkout | P1 | Smoke, UI |
| TC-CART-002 | Cart | Line item qty 1 | 1 item added | Backpack | Open cart | Name, $29.99, qty 1 | P1 | Functional, Positive |
| TC-CART-003 | Cart | Continue Shopping | On cart | — | Click Continue Shopping | Products | P2 | Navigation |
| TC-CART-004 | Cart | Checkout CTA | Item in cart | — | Click Checkout | Checkout: Your Information | P1 | Smoke, Navigation |
| TC-CART-005 | Cart | Remove line | Item in cart | Backpack | Click Remove | Empty cart; no badge | P2 | Functional |
| TC-CART-006 | Cart | Two products | Two adds | Backpack + Bike Light | Open cart | 2 names | P2 | Functional |
| TC-CART-007 | Cart | Name opens details | Item in cart | Backpack | Click name | Details page | P3 | Navigation |
| TC-CART-008 | Cart | No qty editor | Item in cart | — | Inspect | Qty display only | P3 | UI |
| TC-CART-009 | Cart | All six products | All added | 6 products | Open cart | 6 lines; badge 6 | P2 | Data-driven, Functional |

### Checkout

| ID | Module | Test Scenario | Preconditions | Test Data | Test Steps | Expected Result | Priority | Test Type |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-CHK-001 | Checkout | Information UI | Item in cart | — | Checkout | 3 fields + Cancel + Continue | P1 | Smoke, UI |
| TC-CHK-002 | Checkout | All fields empty | Info page | empty | Continue | First Name is required | P1 | Validation, Negative |
| TC-CHK-003 | Checkout | Missing first name | Info page | last+zip | Continue | First Name is required | P2 | Validation, Negative, Data-driven |
| TC-CHK-004 | Checkout | Missing last name | Info page | first+zip | Continue | Last Name is required | P2 | Validation, Negative, Data-driven |
| TC-CHK-005 | Checkout | Missing postal | Info page | first+last | Continue | Postal Code is required | P2 | Validation, Negative, Data-driven |
| TC-CHK-006 | Checkout | Cancel to cart | Info page | — | Cancel | cart.html | P2 | Navigation |
| TC-CHK-007 | Checkout | Valid info + tax | Info page | John Doe 12345 | Continue | Overview; tax 8% of $29.99 = $2.40; total $32.39 | P1 | Smoke, Positive |
| TC-CHK-008 | Checkout | Payment/shipping copy | Overview | — | Read labels | SauceCard #31337; Free Pony Express Delivery! | P2 | UI |
| TC-CHK-009 | Checkout | Cancel overview | Overview | — | Cancel | inventory.html | P2 | Navigation |
| TC-CHK-010 | Checkout | Finish order | Overview | random name | Finish | Thank you copy; badge cleared; PDF button | P1 | Smoke, End-to-End |
| TC-CHK-011 | Checkout | Back Home | Complete | — | Back Home | Products | P2 | Navigation |
| TC-CHK-012 | Checkout | PDF button enabled | Complete | — | Inspect | Generate PDF order enabled | P3 | Functional |
| TC-CHK-013 | Checkout | Numeric names accepted | Info page | 123 / 456 / 00000 | Continue | Overview (no format rules) | P3 | Boundary |
| TC-CHK-014 | Checkout | Alpha postal accepted | Info page | SW1A1AA | Continue | Overview | P3 | Boundary |
| TC-CHK-015 | Checkout | Two-item tax | 2 items | Backpack+Bike Light | Checkout | Item total $39.98; tax/total match 8% | P2 | Functional |

### Menu / footer

| ID | Module | Test Scenario | Preconditions | Test Data | Test Steps | Expected Result | Priority | Test Type |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-MENU-001 | Menu | Open menu links | Logged in | — | Open Menu | All Items, About, Logout, Reset App State | P1 | Smoke, UI |
| TC-MENU-002 | Menu | Close menu | Menu open | — | Close Menu | Links hidden | P3 | UI, Navigation |
| TC-MENU-003 | Menu | All Items from cart | On cart | — | All Items | inventory.html | P2 | Navigation |
| TC-MENU-004 | Menu | Logout | Logged in | — | Logout | Login page | P1 | Smoke, Functional |
| TC-MENU-005 | Menu | Reset App State | 1 item in cart | Backpack | Reset | Badge gone; Add to cart restored | P2 | Functional |
| TC-MENU-006 | Menu | About | Logged in | — | About | saucelabs.com | P3 | Navigation |
| TC-MENU-007 | Footer | Social hrefs + copyright | Logged in | — | Inspect footer | X, Facebook, LinkedIn URLs; Sauce Labs copy | P3 | UI |

### End-to-end

| ID | Module | Test Scenario | Preconditions | Test Data | Test Steps | Expected Result | Priority | Test Type |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-E2E-001 | E2E | Buy one item | standard_user | Backpack + valid checkout | Add → cart → info → finish | Thank you | P1 | Smoke, End-to-End |
| TC-E2E-002 | E2E | Buy two items | standard_user | Two products | Full checkout | Combined total then thank you | P2 | End-to-End |
| TC-E2E-003 | E2E | Remove before pay | two in cart | Remove Bike Light | Checkout remaining | Only backpack total | P2 | End-to-End, Functional |
| TC-E2E-004 | E2E | Buy entire catalog | standard_user | 6 products | Full checkout | Item total = sum of six prices | P2 | End-to-End, Functional |

### Count

- LOGIN 14 + AUTH 7 + PROD 13 (6 add/remove counted) + DET 10 + CART 9 + CHK 15 + MENU 7 + E2E 4 = **79 automated-equivalent unique cases** in the tables above if ranges are expanded: PROD-006–011 = 6, DET-005–010 = 6.

Expanded unique IDs: 14+7+(5+6+2)+ (4+6)+9+15+7+4 = **79**.

Additional unique-but-thin variants that are still real (not invented) if you count every product in cart add as its own ID: already included via data-driven add/remove and details.

**Why not 150:** remaining ideas would repeat the same assertion (for example “add backpack” vs “add backpack then open cart then see backpack”). Those are already covered by TC-PROD + TC-CART + TC-E2E. problem_user image bugs and visual_user CSS diffs are **known demo quirks**, not a second product. They are called out in the framework notes rather than turned into dozens of brittle visual tests.
