import { test, expect } from '../BaseTest';
import { config } from '../../config/env';
import { searchData } from '../../testdata/searchData';

test('Halo: posle logina radi global search u headeru', async ({ haloLoginPage, searchResultsPage, page }) => {
  await haloLoginPage.handleKnownObstacles();
  await haloLoginPage.goToLogin();

  await haloLoginPage.login(config.haloUser, config.haloPass);

  await expect(page).toHaveURL(/\/profil/);

  await expect(searchResultsPage.globalSearchInput).toBeVisible();
  await searchResultsPage.search(searchData.globalSearchTerm);

  // proof the search actually ran (we navigated away from the profile page)
  await expect(page).not.toHaveURL(/\/profil\/?$/);
});
