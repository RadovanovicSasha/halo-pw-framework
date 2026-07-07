import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AdDetailPage extends BasePage {

  constructor(page: Page) {
    super(page);
  }

  // Naslov oglasa je dinamičan (menja se od oglasa do oglasa), pa se ne može
  // definisati kao fiksni lokator — poredi se sa naslovom pokupljenim sa kartice u rezultatima.
  titleLocator(adTitle: string): Locator {
    return this.page.getByText(adTitle, { exact: true }).first();
  }
}
