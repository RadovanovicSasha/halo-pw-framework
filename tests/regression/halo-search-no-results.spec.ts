import { test, expect } from '../BaseTest';

test('Halo: pretraga nepostojećeg pojma ne vraća kartice oglasa', async ({
  haloLoginPage,
  searchResultsPage,
}) => {
  await haloLoginPage.acceptCookiesIfVisible();

  await searchResultsPage.search('zzzzxxxxqqqqnepostojeciwqe12345');

  await expect(searchResultsPage.adCards).toHaveCount(0);
});
