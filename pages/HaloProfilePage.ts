import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HaloProfilePage extends BasePage {

// Lokatori su tipa:
  readonly profileLink: Locator;
  readonly searchInput: Locator;
  readonly searchBtn: Locator;
  readonly resultsCount: Locator;

// Svaki test ima poseban "živi" page koji Playwright automatski kreira.
// Kreiranjem lokatora unutar konstruktora obezbeđuje se da objekti pages klasa
// budu povezani sa upravo tim page-om specifičnim za dati test.
// Svaki test ima svoje odvojene page objekte u kojima se nalazi page jedinstven za taj test.

  constructor(page: Page) {
    super(page);

    // signal da smo na profilu
    this.profileLink = page.getByRole('link', { name: /Moj profil/i });

    // search u "Moji oglasi"
    this.searchInput = page.getByPlaceholder(/Pretražite/i);
    this.searchBtn = page.locator('button[type="submit"], button').filter({
      has: page.locator('i.fa-search, .fa-search'),
    });

    // desno gore u tabeli: "1 oglasa"
    this.resultsCount = page.locator('text=/\\d+\\s+oglasa/i');
  }

//Za async funkcije nema void ako ne vraća nijedan tip podatka

  async assertOnProfile() {
    await expect(this.profileLink).toBeVisible();
    await expect(this.page).toHaveURL(/\/profil/);
  }

  async searchMyAds(term: string) {
    await this.searchInput.fill(term);
    // u slučaju da je dugme teško uhvatiti, Enter radi 100%
    await this.searchInput.press('Enter');
  }

  async expectResultsVisible() {
    await expect(this.resultsCount).toBeVisible();
  }
}