import { test, expect } from '../BaseTest';

test('Halo: prijava sa praznim poljima prikazuje validacione greške i ne pušta dalje', async ({
  haloLoginPage,
  page,
}) => {
  await haloLoginPage.acceptCookiesIfVisible();
  await haloLoginPage.goToLogin();
  await haloLoginPage.dismissSecurityNoticeIfVisible();

  await haloLoginPage.loginBtn.click();

  await expect(haloLoginPage.usernameFieldError).toBeVisible();
  await expect(haloLoginPage.passwordFieldError).toBeVisible();
  await expect(page).toHaveURL(/\/prijava/);
});
