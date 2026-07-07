import { test, expect } from '../BaseTest';
import { config } from '../../config/env';
import { searchData } from '../../testdata/searchData';

test('Halo: login, pretraga, otvaranje oglasa i pregled detalja', async ({
  haloLoginPage,
  searchResultsPage,
  adDetailPage,
  page,
}) => {
  await haloLoginPage.acceptCookiesIfVisible();
  await haloLoginPage.goToLogin();
  await haloLoginPage.login(config.haloUser, config.haloPass);
  await expect(page).toHaveURL(/\/profil/);

  await searchResultsPage.search(searchData.e2eSearchTerm);
  await expect(searchResultsPage.adCards.first()).toBeVisible();

  const firstAdTitle = await searchResultsPage.getFirstAdTitle();
  await searchResultsPage.openFirstAd();

  await expect(adDetailPage.titleLocator(firstAdTitle)).toBeVisible();
});
