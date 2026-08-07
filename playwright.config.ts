import { defineConfig, devices } from '@playwright/test';
import { config } from './config/env';

// These specs authenticate as the one real Halo Oglasi test account and
// mutate its session state (log in, log out, revisit /profil after
// logging out). Running two of them at once risks one test's login/logout
// racing another's, e.g. test A logs out the shared account mid-way
// through test B's "confirm we're on the profile page" assertion. Verified
// by reading each spec's body, not by filename pattern -- tests/negative/
// also contains specs that touch the login *form* but never authenticate
// with real credentials (halo-invalid-login uses fake ones,
// halo-login-validation and halo-unauthorized-profile-access use none at
// all), so those are safe to run fully parallel and are deliberately left
// out of this list.
const ACCOUNT_TOUCHING_TESTS = [
  'smoke/halo-login.spec.ts',
  'smoke/halo-logout.spec.ts',
  'smoke/halo-profile-search.spec.ts',
  'negative/halo-session-invalidated-after-logout.spec.ts',
  'e2e/halo-search-and-view-ad.spec.ts',
];

export default defineConfig({
  // Where test files live
  testDir: './tests',

  // Overall per-test timeout (ms), environment-configurable via config/env.ts
  timeout: config.timeouts.test,

  // Timeout for expect() assertions, environment-configurable via config/env.ts
  expect: {
    timeout: config.timeouts.expect,
  },

  // Whether tests run in parallel
  fullyParallel: true,

  // Retry count on failure (2x on CI only)
  retries: config.isCi ? 2 : 0,

  // Worker count (capped to 1 on CI)
  workers: config.isCi ? 1 : undefined,

  // Result reporters (list in the terminal + HTML file)
  reporter: [
    ['list'],                      // keeps normal console output
    ['html', { open: 'never' }]    // generates HTML report but doesn't auto-open
  ],

  // Global settings applied to all tests
  use: {

    baseURL: config.baseUrl,

    // Screenshot ONLY on test failure
    screenshot: 'only-on-failure',

    // Video ONLY retained on test failure
    video: 'retain-on-failure',

    // Trace (useful for debugging) ONLY retained on test failure
    trace: 'retain-on-failure',

    // Browser runs headless (true = no GUI, false = visible browser)
    headless: true,

    // Timeout for each action (click, fill...), environment-configurable via config/env.ts
    actionTimeout: config.timeouts.action,
  },

  // Projects -- lets you run tests against different browsers, and here
  // also enforces the account-touching concurrency constraint above.
  projects: [
    {
      // Everything except the account-touching specs: safe to run with the
      // global fullyParallel/workers settings above.
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: ACCOUNT_TOUCHING_TESTS,
    },
    {
      // Account-touching specs only. workers: 1 caps this project to a
      // single worker regardless of the global `workers` setting (or
      // --workers on the CLI), and fullyParallel: false keeps Playwright
      // from trying to parallelize within a single file either -- between
      // the two, these specs always run one at a time, locally and on CI.
      name: 'Chromium-account',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ACCOUNT_TOUCHING_TESTS,
      fullyParallel: false,
      workers: 1,
    },
  ],
});
