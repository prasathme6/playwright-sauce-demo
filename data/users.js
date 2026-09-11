/**
 * Usernames and the shared password are published on the Sauce Demo login page.
 * There is no sign-up, forgot-password, or role-based permission model.
 */
export const password = 'secret_sauce';

export const users = {
  standard: {
    username: 'standard_user',
    password,
    description: 'Fully working shopper used for happy-path tests',
  },
  locked: {
    username: 'locked_out_user',
    password,
    description: 'Cannot authenticate',
  },
  problem: {
    username: 'problem_user',
    password,
    description: 'Logs in but catalog/images/cart actions can be incorrect',
  },
  performance: {
    username: 'performance_glitch_user',
    password,
    description: 'Logs in slowly; needs a longer assertion timeout',
  },
  error: {
    username: 'error_user',
    password,
    description: 'Logs in; some checkout/sort actions can fail',
  },
  visual: {
    username: 'visual_user',
    password,
    description: 'Logs in with visual/CSS differences',
  },
};

export const invalidUsers = [
  {
    id: 'unknown-user',
    username: 'not_a_user',
    password,
    expectedError: 'Epic sadface: Username and password do not match any user in this service',
  },
  {
    id: 'wrong-password',
    username: 'standard_user',
    password: 'wrong_password',
    expectedError: 'Epic sadface: Username and password do not match any user in this service',
  },
];

export const validShoppers = [
  users.standard,
  users.problem,
  users.performance,
  users.error,
  users.visual,
];
