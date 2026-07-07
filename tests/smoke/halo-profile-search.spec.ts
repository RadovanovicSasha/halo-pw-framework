import { test, expect } from '../BaseTest';
import { config } from '../../config/env';
import { searchData } from '../../testdata/searchData';

//Uvozimo proširenu test funkciju iz BaseTest

// test.describe('Swag Labs - Login', () => {
//test.describe() definiše suite (skup) testova — sličan konceptu “Test Suite” u TestNG-u

//  U argumente test funkcije prosledjujemo objekte onih pages stranica koje koristimo u testu

test('Halo: posle logina radi global search u headeru', async ({ haloLoginPage, searchResultsPage, page }) => {
  await haloLoginPage.acceptCookiesIfVisible();
  await haloLoginPage.goToLogin();

  await haloLoginPage.login(config.haloUser, config.haloPass);

  await expect(page).toHaveURL(/\/profil/);

  await expect(searchResultsPage.globalSearchInput).toBeVisible();
  await searchResultsPage.search(searchData.globalSearchTerm);

  // dokaz da je pretraga pokrenuta (napustili smo profil)
  await expect(page).not.toHaveURL(/\/profil\/?$/);
});
