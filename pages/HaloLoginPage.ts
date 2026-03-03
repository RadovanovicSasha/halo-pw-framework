import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HaloLoginPage extends BasePage {

//readonly da ne bi kasnije u izvršavanju koda dolazilo do promena vrednosti lokatora
//Moramo navesti kog tipa su lokatori jer koristimo TypeScript a po njemu je tip Locator

  readonly cookiesOkBtn: Locator;
  readonly loginLink: Locator;

  readonly username: Locator;
  readonly password: Locator;
  readonly loginBtn: Locator;

// Svaki test ima poseban "živi" page koji Playwright automatski kreira.
// Kreiranjem lokatora unutar konstruktora obezbeđuje se da objekti pages klasa
// budu povezani sa upravo tim page-om specifičnim za dati test.
// Svaki test ima svoje odvojene page objekte u kojima se nalazi page jedinstven za taj test.

  constructor(page: Page) {
    super(page);

    // cookies: "U redu"
    this.cookiesOkBtn = page.locator('p.cookie-policy-btn', { hasText: 'U redu' });

    // header link: "Uloguj se" (href počinje sa /prijava)
    this.loginLink = page.locator('a[href^="/prijava"]');

    // login forma
  this.username = page.getByLabel(/E-mail ili korisničko ime/i);
  this.password = page.getByLabel(/Lozinka/i);
  this.loginBtn = page.getByRole('button', { name: /Uloguj me/i });
  }

//Za async funkcije nema void ako ne vraća nijedan tip podatka
//TypeScript je tipiziran tako da moramo navesti kog tipa su user i pass

  async login(user: string, pass: string) {
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.loginBtn.click();
  }

  async acceptCookiesIfVisible() {
    if (await this.cookiesOkBtn.isVisible().catch(() => false)) {
      await this.cookiesOkBtn.click();
    }
  }

async goToLogin() {
  // direktan odlazak na login stranicu
  await this.page.goto('/prijava');

  // čekanje na učitavanje forme
  await expect(this.username).toBeVisible({ timeout: 30000 });
}

}