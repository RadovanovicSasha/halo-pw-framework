import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HaloLoginPage extends BasePage {

  readonly loginLink: Locator;

  readonly username: Locator;
  readonly password: Locator;
  readonly loginBtn: Locator;
  readonly invalidLoginError: Locator;
  readonly usernameFieldError: Locator;
  readonly passwordFieldError: Locator;

  constructor(page: Page) {
    super(page);

    // header link: "Uloguj se" (href starts with /prijava)
    this.loginLink = page.locator('a[href^="/prijava"]');

    // login form
    this.username = page.getByLabel(/E-mail ili korisničko ime/i);
    this.password = page.getByLabel(/Lozinka/i);
    this.loginBtn = page.getByRole('button', { name: /Uloguj me/i });

    // error box shown on invalid credentials
    this.invalidLoginError = page.getByText('Neispravno korisničko ime ili lozinka.');

    // fields get this class when the form is submitted empty (client/server validation)
    this.usernameFieldError = page.locator('#EMailOrUsername.input-validation-error');
    this.passwordFieldError = page.locator('#Password.input-validation-error');
  }

  async login(user: string, pass: string) {
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.loginBtn.click();
  }

  async goToLogin() {
    await this.page.goto('/prijava');
  }
}
