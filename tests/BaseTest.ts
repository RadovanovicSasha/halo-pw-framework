import { test as base, expect } from '@playwright/test';
import { HaloLoginPage } from '../pages/HaloLoginPage';
import { HaloProfilePage } from '../pages/HaloProfilePage';
import { LogoutHeaderPage } from '../pages/LogoutHeaderPage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { AdDetailPage } from '../pages/AdDetailPage';

// Extends Playwright's base test with one fixture per page object, so specs
// can request e.g. `haloLoginPage` directly instead of instantiating it.
type Fixtures = {

  haloLoginPage: HaloLoginPage;
  haloProfilePage: HaloProfilePage;
  logoutHeaderPage: LogoutHeaderPage;
  searchResultsPage: SearchResultsPage;
  adDetailPage: AdDetailPage;
};

export const test = base.extend<Fixtures>({

  haloLoginPage: async ({ page }, use) => {
    await use(new HaloLoginPage(page));
  },
  haloProfilePage: async ({ page }, use) => {
  await use(new HaloProfilePage(page));
  },
  logoutHeaderPage: async ({ page }, use) => {
    await use(new LogoutHeaderPage(page));
  },
  searchResultsPage: async ({ page }, use) => {
    await use(new SearchResultsPage(page));
  },
  adDetailPage: async ({ page }, use) => {
    await use(new AdDetailPage(page));
  },
});

export { expect };

test.beforeEach(async ({ page }) => {
  await page.goto('/'); // resolves against baseURL from playwright.config.ts
});