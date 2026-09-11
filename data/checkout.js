export const validCheckout = {
  firstName: 'John',
  lastName: 'Doe',
  postalCode: '12345',
};

export const checkoutValidationCases = [
  {
    id: 'all-empty',
    firstName: '',
    lastName: '',
    postalCode: '',
    expectedError: 'Error: First Name is required',
  },
  {
    id: 'missing-first-name',
    firstName: '',
    lastName: 'Doe',
    postalCode: '12345',
    expectedError: 'Error: First Name is required',
  },
  {
    id: 'missing-last-name',
    firstName: 'John',
    lastName: '',
    postalCode: '12345',
    expectedError: 'Error: Last Name is required',
  },
  {
    id: 'missing-postal-code',
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '',
    expectedError: 'Error: Postal Code is required',
  },
];

/**
 * The app does not validate name/zip format. These cases document that
 * checkout continues with non-typical values rather than inventing rules.
 */
export const checkoutAcceptedWithoutFormatRules = [
  {
    id: 'numeric-names',
    firstName: '123',
    lastName: '456',
    postalCode: '00000',
  },
  {
    id: 'alpha-postal',
    firstName: 'Jane',
    lastName: 'Smith',
    postalCode: 'SW1A1AA',
  },
];
