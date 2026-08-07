import { test, expect } from '../BaseTest';
import { config } from '../../config/env';

test('Halo: logout flow', async ({ haloLoginPage, logoutHeaderPage, page }) => {

  // Dismiss cookie banner / security notice if present
  await haloLoginPage.handleKnownObstacles();

  // Open the login page
  await haloLoginPage.goToLogin();

  // Enter credentials
  await haloLoginPage.login(config.haloUser, config.haloPass);

  // Confirm we landed on the profile page
  await expect(page).toHaveURL(/\/profil/);

  // Logout via the header dropdown
  await logoutHeaderPage.logout();

  // Confirm we're logged out
  await expect(logoutHeaderPage.loginLink).toBeVisible({ timeout: 20000 });

});
