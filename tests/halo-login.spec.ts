import { test, expect } from './BaseTest';

//Uvozimo proširenu test funkciju iz BaseTest

// test.describe('Swag Labs - Login', () => {
//test.describe() definiše suite (skup) testova — sličan konceptu “Test Suite” u TestNG-u

//  U argumente test funkcije prosledjujemo objekte onih pages stranica koje koristimo u testu

test('Halo: cookies -> uloguj se -> user/pass -> uloguj me', async ({ haloLoginPage, page }) => {
  await haloLoginPage.acceptCookiesIfVisible();
  await haloLoginPage.goToLogin();

  // USER I PASS
  const user = process.env.HALO_USER!;
  const pass = process.env.HALO_PASS!;


  await haloLoginPage.login(user, pass);

  await expect(page).toHaveURL(/\/profil/);
  await expect(page.getByRole('link', { name: /Moj profil/i })).toBeVisible({ timeout: 30000 });
});