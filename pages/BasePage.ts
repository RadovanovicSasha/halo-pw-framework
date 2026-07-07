import { Page } from '@playwright/test';

// Page (veliko P) mora da se importuje jer je TypeScript tip, i time se jasno definiše da je promenljiva page tog tipa (odnosno da ima sve metode i osobine koje Playwright-ov Page objekat ima: goto(), click(), locator(), itd).
// U klasi kao što je BasePage, page je samo referenca / parametar, nema “život” sam po sebi.
// Tek u BaseTest (odnosno u testovima koje pokreće Playwright) taj page postaje stvarni objekat koji Playwright automatski kreira i ubrizgava (fixture).


export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }
}

