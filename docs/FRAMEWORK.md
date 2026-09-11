# Framework design

Playwright Test + JavaScript + Page Object Model against https://www.saucedemo.com/.

## Folder responsibilities

| Path | Responsibility |
| --- | --- |
| `tests/` | Spec files. Business-level steps and assertions only. Tagged `@smoke`, `@regression`, `@negative`, etc. |
| `pages/` | Locators and reusable UI actions per page (plus shared header/menu). |
| `fixtures/test.js` | Custom fixtures: page objects and `asStandardUser` login. |
| `data/` | Users, products, sort options, checkout payloads, expected messages. |
| `utils/` | Price/tax math and small random checkout values. |
| `config/env.js` | Base URL, path constants, external footer/About URLs. |
| `playwright.config.js` | Browsers, reporters, artifacts on failure, `data-test` as test id. |
| `reports/` | HTML + JUnit output (generated). |
| `docs/` | Scenario inventory, this design, test-case mapping. |

## Page classes

- `LoginPage` — credentials, errors, dismiss
- `ProductsPage` — sort, add/remove, open details
- `ProductDetailsPage` — add/remove, back
- `CartPage` — line items, continue, checkout
- `CheckoutInformationPage` — form + validation
- `CheckoutOverviewPage` — totals, finish/cancel
- `CheckoutCompletePage` — thank you, Back Home, PDF
- `HeaderMenu` / `BasePage` — cart badge, burger menu, footer, auth redirect helper

## Locators

`playwright.config.js` sets `use.testIdAttribute = 'data-test'` so `getByTestId()` binds to Sauce Demo’s stable attributes (for example `product-sort-container`, `shopping-cart-badge`).

Preferred:

- `getByRole` for Login, Add to cart, Checkout, Finish (accessible names)
- `getByPlaceholder` for Username, Password, First Name, Last Name, Zip/Postal Code
- `getByTestId` for `data-test` ids (`product-sort-container`, `item-{id}-title-link`)
- `getByRole('img', { name, exact: true })` for product photos

Product **names are not exposed as links** in the accessibility tree. They are buttons named `View details for <product>`. Using `getByRole('link', { name: product })` fails. We click `getByTestId('item-{id}-title-link')` instead (stable Sauce Demo attribute, unique per product).

Avoided: long XPath, generated CSS, `nth()` for product picking, `waitForTimeout()`.

## Fixtures

Every test gets a **new browser context**. `asStandardUser` logs in as `standard_user` and waits for Products so cart state never leaks across tests.

## Reporting

- List reporter in the terminal
- HTML → `reports/html` (`npx playwright show-report reports/html`)
- JUnit → `reports/junit/results.xml`
- Screenshot, video, and trace **on failure** (`trace: retain-on-failure`)

Open a trace: `npx playwright show-trace test-results/.../trace.zip`

## Browsers and commands

Projects: Chromium, Firefox, WebKit.

```bash
npx playwright test
npx playwright test --grep @smoke
npx playwright test --grep @regression
npx playwright test tests/login.spec.js
npx playwright test tests/login.spec.js -g "standard user"
npx playwright test --project=chromium
npx playwright test --headed
npx playwright test --debug
npx playwright test --ui
```

npm aliases: `npm test`, `npm run test:smoke`, `test:regression`, `test:chromium`, `test:headed`, `test:debug`, `test:ui`, `npm run report`.

## Design decisions

- **No shared cart** between tests (fresh context + login fixture).
- **Tax helper** encodes the observed 8% rule instead of hardcoding $2.40 in every test.
- **problem_user / visual_user / error_user**: only login is asserted. Catalog/checkout quirks are demo bugs, not a second specification.
- **Generate PDF order** is asserted as visible/enabled. The site does not document a filename; we do not invent a download contract.
- **About** hits a third-party site; it is tagged but can be slower than in-app tests.
