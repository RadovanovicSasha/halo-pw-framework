import { test, expect } from '../BaseTest';
import { config } from '../../config/env';

test('Halo: posle izlogovanja direktan pristup profilu ponovo traži prijavu', async ({
  haloLoginPage,
  logoutHeaderPage,
  page,
}) => {
  await haloLoginPage.acceptCookiesIfVisible();
  await haloLoginPage.goToLogin();
  await haloLoginPage.login(config.haloUser, config.haloPass);
  await expect(page).toHaveURL(/\/profil/);

  await logoutHeaderPage.logout();
  await expect(logoutHeaderPage.loginLink).toBeVisible({ timeout: 20000 });

  await page.goto('/profil');
  await expect(page).toHaveURL(/\/prijava(\?|$)/);
});
