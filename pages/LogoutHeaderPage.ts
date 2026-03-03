import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LogoutHeaderPage extends BasePage {

// Lokatori su tipa:  
  readonly myProfileLink: Locator;
  readonly logoutLink: Locator;
  readonly loginLink: Locator;

// Svaki test ima poseban "živi" page koji Playwright automatski kreira.
// Kreiranjem lokatora unutar konstruktora obezbeđuje se da objekti pages klasa
// budu povezani sa upravo tim page-om specifičnim za dati test.
// Svaki test ima svoje odvojene page objekte u kojima se nalazi page jedinstven za taj test.

  constructor(page: Page) {
    super(page);

    // Ovo je link u headeru koji otvara dropdown (tekst: "Moj profil")
    this.myProfileLink = page.getByRole('link', { name: /Moj profil/i });

    // U dropdown meniju (tekst: "Izloguj se")
    this.logoutLink = page.getByRole('link', { name: /Izloguj se/i });

    // Posle logout-a (tekst: "Uloguj se")
    this.loginLink = page.getByRole('link', { name: /Uloguj se/i });
  }

//Za async funkcije nema void ako ne vraća nijedan tip podatka

  async logout() {
    await this.myProfileLink.click();
    await expect(this.logoutLink).toBeVisible({ timeout: 20000 });
    await this.logoutLink.click();
  }

  async assertLoggedOut() {
    await expect(this.loginLink).toBeVisible({ timeout: 20000 });
  }
}