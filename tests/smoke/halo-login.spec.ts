import { test, expect } from '../BaseTest';
import { config } from '../../config/env';

test('Halo: cookies -> uloguj se -> user/pass -> uloguj me', async ({ haloLoginPage, haloProfilePage, page }) => {
  await haloLoginPage.handleKnownObstacles();
  await haloLoginPage.goToLogin();

  await haloLoginPage.login(config.haloUser, config.haloPass);

  await expect(page).toHaveURL(/\/profil/);
  await expect(haloProfilePage.profileLink).toBeVisible({ timeout: 30000 });
});
