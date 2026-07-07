import { test, expect } from './BaseTest';
import { config } from '../config/env';

//Uvozimo proširenu test funkciju iz BaseTest

// test.describe('Swag Labs - Login', () => {
//test.describe() definiše suite (skup) testova — sličan konceptu “Test Suite” u TestNG-u

//  U argumente test funkcije prosledjujemo objekte onih pages stranica koje koristimo u testu

test('Halo: logout flow', async ({ haloLoginPage, logoutHeaderPage, page }) => {

  // 1Prihvati cookies (ako se pojave)
  await haloLoginPage.acceptCookiesIfVisible();

  // Otvori login stranicu
  await haloLoginPage.goToLogin();

  // Unesi kredencijale
  await haloLoginPage.login(config.haloUser, config.haloPass);

  // Provera da smo na profilu
  await expect(page).toHaveURL(/\/profil/);

  // Logout preko header dropdown-a
  await logoutHeaderPage.logout();

  // Provera da smo uspešno izlogovani
  await logoutHeaderPage.assertLoggedOut();

});