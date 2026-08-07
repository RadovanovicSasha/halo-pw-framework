import { Page } from '@playwright/test';

/**
 * Thrown when the page under test is showing a Cloudflare/anti-bot challenge
 * instead of the actual application. A CI failure log ending in this error
 * points at the hosting infrastructure blocking the runner's IP, not at a
 * framework bug or a regression in the application under test.
 */
export class AntiBotChallengeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AntiBotChallengeError';
  }
}

// Confirmed against a real Cloudflare managed-challenge response from this
// site (HTTP 403, response header `cf-mitigated: challenge`, CSP referencing
// challenges.cloudflare.com): the page title is exactly "Just a moment...";
// on a JS-disabled fallback the body carries "Enable JavaScript and cookies
// to continue". "Attention Required!" and "verify you are human" are kept as
// well since Cloudflare uses them for its other challenge/interstitial
// variants, even though only the managed-challenge title was observed here.
const CHALLENGE_TITLE_MARKERS = [/just a moment/i, /attention required/i];

const CHALLENGE_BODY_MARKERS = [
  /enable javascript and cookies to continue/i,
  /checking your browser before accessing/i,
  /verify you are human/i,
];

/**
 * Handles page-level obstacles that sit between a navigation and the actual
 * application content: the two benign, already-known dismissible ones
 * (cookie banner, security-notice modal) plus the one that must never be
 * silently swallowed (an anti-bot challenge). Lives outside pages/ so any
 * page object can use it without depending on HaloLoginPage specifically.
 */
export class ObstacleHandler {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Throws AntiBotChallengeError if the current page is a Cloudflare/anti-bot
   * challenge rather than real application content. Checked first, before
   * the benign-obstacle dismissal below, because a challenge page won't
   * contain the cookie banner or security notice at all.
   */
  async assertNoAntiBotChallenge(): Promise<void> {
    const title = await this.page.title().catch(() => '');
    if (CHALLENGE_TITLE_MARKERS.some((marker) => marker.test(title))) {
      throw new AntiBotChallengeError(
        `Anti-bot challenge intercepted the page (title: "${title}") at ${this.page.url()}. ` +
          'This is an infrastructure/environment condition (the site is blocking this runner), not a framework or application defect.'
      );
    }

    const bodyText = await this.page.locator('body').innerText().catch(() => '');
    if (CHALLENGE_BODY_MARKERS.some((marker) => marker.test(bodyText))) {
      throw new AntiBotChallengeError(
        `Anti-bot challenge intercepted the page (challenge markup detected in body) at ${this.page.url()}. ` +
          'This is an infrastructure/environment condition (the site is blocking this runner), not a framework or application defect.'
      );
    }
  }

  /** Cookie consent banner: "U redu" button. */
  async acceptCookiesIfVisible(): Promise<void> {
    const cookiesOkBtn = this.page.locator('p.cookie-policy-btn', { hasText: 'U redu' });
    if (await cookiesOkBtn.isVisible().catch(() => false)) {
      await cookiesOkBtn.click();
    }
  }

  /**
   * "Don't share personal data..." notice modal. It can appear with a delay,
   * so this waits briefly for the button rather than checking isVisible()
   * immediately.
   */
  async dismissSecurityNoticeIfVisible(): Promise<void> {
    const securityNoticeOkBtn = this.page
      .locator('.e-system-notifications__item-modal')
      .getByRole('button', { name: 'U redu' });
    await securityNoticeOkBtn.click({ timeout: 5000 }).catch(() => {});
  }
}
