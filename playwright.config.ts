import { defineConfig, devices } from '@playwright/test';
import { config } from './config/env';

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

  // Projects -- lets you run tests against different browsers
  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
