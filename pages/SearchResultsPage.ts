import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchResultsPage extends BasePage {

  readonly globalSearchInput: Locator;
  readonly adCards: Locator;
  readonly adTitleLinks: Locator;

  constructor(page: Page) {
    super(page);

    // header search input (isti koji koristi i halo-profile-search.spec.ts)
    this.globalSearchInput = page.locator('#search-query');

    // kartica oglasa u rezultatima pretrage
    this.adCards = page.locator('div.product-item');

    // naslov oglasa (link) unutar kartice
    this.adTitleLinks = page.locator('h3.product-title a');
  }

  async search(term: string) {
    await this.globalSearchInput.fill(term);
    await this.globalSearchInput.press('Enter');
  }

  async getFirstAdTitle(): Promise<string> {
    const title = await this.adTitleLinks.first().innerText();
    return title.trim();
  }

  async openFirstAd() {
    await this.adTitleLinks.first().click();
  }
}
