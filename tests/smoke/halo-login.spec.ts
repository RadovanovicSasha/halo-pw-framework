import { test, expect } from '../BaseTest';
import { config } from '../../config/env';

//Uvozimo proširenu test funkciju iz BaseTest

// test.describe('Swag Labs - Login', () => {
//test.describe() definiše suite (skup) testova — sličan konceptu “Test Suite” u TestNG-u

//  U argumente test funkcije prosledjujemo objekte onih pages stranica koje koristimo u testu

test('Halo: cookies -> uloguj se -> user/pass -> uloguj me', async ({ haloLoginPage, haloProfilePage, page }) => {
  await haloLoginPage.acceptCookiesIfVisible();
  await haloLoginPage.goToLogin();

  await haloLoginPage.login(config.haloUser, config.haloPass);

  await expect(page).toHaveURL(/\/profil/);
  await expect(haloProfilePage.profileLink).toBeVisible({ timeout: 30000 });
});
