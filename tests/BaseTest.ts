import { test as base, expect } from '@playwright/test';
import { HaloLoginPage } from '../pages/HaloLoginPage';
import { HaloProfilePage } from '../pages/HaloProfilePage';
import { LogoutHeaderPage } from '../pages/LogoutHeaderPage.ts';
//.. jer je nivo iznad
//Uzimam test iz @playwright/test i proširujem ga i nazivam base. Pravi se proširena verzija test funkcije, koja dodaje sopstvene fixture-e ili logiku.

//const BASE_URL = 'https://www.halooglasi.com/';

//Navodimo promenljive i kog su tipa, koristimo ih kasnije u ovom fajlu
type Fixtures = {

  haloLoginPage: HaloLoginPage;
  haloProfilePage: HaloProfilePage;
  logoutHeaderPage: LogoutHeaderPage;
};

//Proširujemo test sa objektima pages klasa, koristimo Fixtures da se zna kog su tipa loginPage, homePage...
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
});

// kompletan smoketest samo jednom koristi login i logout, otvaramo baseURL:
export { expect };

test.beforeEach(async ({ page }) => {
  await page.goto('/'); // koristi baseURL iz playwright.config.ts
});