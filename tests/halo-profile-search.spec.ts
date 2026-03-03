import { test, expect } from './BaseTest';

//Uvozimo proširenu test funkciju iz BaseTest

// test.describe('Swag Labs - Login', () => {
//test.describe() definiše suite (skup) testova — sličan konceptu “Test Suite” u TestNG-u

//  U argumente test funkcije prosledjujemo objekte onih pages stranica koje koristimo u testu

test('Halo: posle logina radi global search u headeru', async ({ haloLoginPage, page }) => {
  await haloLoginPage.acceptCookiesIfVisible();
  await haloLoginPage.goToLogin();

   const user = process.env.HALO_USER!;
  const pass = process.env.HALO_PASS!;

  await haloLoginPage.login(user, pass);

  await expect(page).toHaveURL(/\/profil/);

  const globalSearch = page.locator('#search-query');
  await expect(globalSearch).toBeVisible();

  await globalSearch.fill('plac');
  await globalSearch.press('Enter');

  // dokaz da je pretraga pokrenuta (napustili smo profil)
  await expect(page).not.toHaveURL(/\/profil\/?$/);
});