import { Page, expect } from '@playwright/test';

// Page (veliko P) mora da se importuje jer je TypeScript tip, i time se jasno definiše da je promenljiva page tog tipa (odnosno da ima sve metode i osobine koje Playwright-ov Page objekat ima: goto(), click(), locator(), itd).
// U klasi kao što je BasePage, page je samo referenca / parametar, nema “život” sam po sebi.
// Tek u BaseTest (odnosno u testovima koje pokreće Playwright) taj page postaje stvarni objekat koji Playwright automatski kreira i ubrizgava (fixture).
// expect je direktno Playwright funkcija


export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Web stranica je učitana, basic verzija
  //async waitForAppReadyBasic(selector: string, timeout: number = 30_000) {
    //await this.page.waitForLoadState('domcontentloaded');
    //await this.page.waitForLoadState('load');
    //await this.page.waitForLoadState('networkidle');
    //await expect(this.page.locator(selector)).toBeVisible({ timeout });
  //}

  // Web stranica je učitana, masivna full verzija
  //async waitForAppReadyFull(selector: string, timeout: number = 15000) {
  //const { page } = this;

  // 1. Sve Playwright load state faze
  //await page.waitForLoadState('domcontentloaded', { timeout });
  //await page.waitForLoadState('load', { timeout });
  //await page.waitForLoadState('networkidle', { timeout });

  // 2. Dodatne provere stabilnosti stranice
  //await page.waitForFunction(() => {
    //const docReady = document.readyState === 'complete';
    //const imgsLoaded = Array.from(document.images).every(
      //(img) => img.complete && img.naturalWidth > 0
    //);
    //const fontsLoaded =
      //!('fonts' in document) || (document as any).fonts.status === 'loaded';
    //const noAnimations =
      //!(document as any).getAnimations ||
      //(document as any)
        //.getAnimations({ subtree: true })
        //.every((a: any) => a.playState !== 'running');
    //return docReady && imgsLoaded && fontsLoaded && noAnimations;
  //}, { timeout });

  // 3. Ciljani element spreman i vidljiv
  //const locator = page.locator(selector);
  //await expect(locator).toBeVisible({ timeout });

  // 4. Kratka pauza za potpuno stabilizovanje UI-a
  //await page.waitForTimeout(30000);

// Poziva sve tri Playwright faze load-a stranice (domcontentloaded, load, networkidle).
// Čeka da su sve slike, fontovi i animacije završene.
// Proverava da je ciljani Web element vidljiv i spreman za interakciju.
// Dodaje kratku stabilizacionu pauzu od 300 ms za potpunu sigurnost.
}

