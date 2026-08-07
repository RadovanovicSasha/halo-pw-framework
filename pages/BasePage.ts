import { Page } from '@playwright/test';
import { ObstacleHandler } from '../support/ObstacleHandler';

export class BasePage {
  protected page: Page;
  protected obstacleHandler: ObstacleHandler;

  constructor(page: Page) {
    this.page = page;
    this.obstacleHandler = new ObstacleHandler(page);
  }

  /**
   * Call after navigating to a new page: fails fast with AntiBotChallengeError
   * if a Cloudflare/anti-bot challenge is blocking the page, otherwise
   * dismisses the known-benign cookie banner and security notice modal if
   * present. Available on every page object so callers don't need to depend
   * on HaloLoginPage just to reach this.
   *
   * Security notice is dismissed before the cookie banner: the notice modal
   * renders with a static backdrop that, when both appear together, sits on
   * top of and intercepts clicks on the cookie banner underneath it.
   */
  async handleKnownObstacles(): Promise<void> {
    await this.obstacleHandler.assertNoAntiBotChallenge();
    await this.obstacleHandler.dismissSecurityNoticeIfVisible();
    await this.obstacleHandler.acceptCookiesIfVisible();
  }
}
