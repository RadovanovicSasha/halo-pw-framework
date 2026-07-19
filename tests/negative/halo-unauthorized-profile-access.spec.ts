import { test, expect } from '../BaseTest';

test('Halo: neulogovan korisnik pri direktnom pristupu profilu biva preusmeren na prijavu', async ({
  haloLoginPage,
  page,
}) => {
  await page.goto('/profil');

  await expect(page).toHaveURL(/\/prijava(\?|$)/);
  await expect(haloLoginPage.loginBtn).toBeVisible();
});
