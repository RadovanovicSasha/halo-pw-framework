import { test, expect } from '../BaseTest';
import { loginData } from '../../testdata/loginData';

test('Halo: login sa pogrešnim kredencijalima prikazuje error poruku', async ({ haloLoginPage, page }) => {
  await haloLoginPage.acceptCookiesIfVisible();
  await haloLoginPage.goToLogin();

  await haloLoginPage.login(loginData.invalidUsername, loginData.invalidPassword);

  await expect(haloLoginPage.invalidLoginError).toBeVisible();
  await expect(page).not.toHaveURL(/\/profil/);
});
