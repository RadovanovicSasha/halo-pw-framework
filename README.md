# Halo PW Framework

Playwright + TypeScript UI automation framework for [halooglasi.com](https://www.halooglasi.com).

The project covers login, logout, and search functionality within the user profile. It does **not** cover, and is **not intended to cover**, purchasing, payments, or placing real orders.

## Notes

This framework automates a public third-party website (`halooglasi.com`).

Because the target website is protected by Cloudflare and other anti-bot mechanisms, GitHub-hosted CI runners may occasionally be blocked before the application becomes reachable. See [CI Scope & Known Limitations](#ci-scope--known-limitations) below for how the suite is scoped around this and what the framework does when it happens.

## Technologies

- [Playwright Test](https://playwright.dev/) (`@playwright/test`)
- TypeScript
- `dotenv` for loading credentials from `.env`

## Prerequisites

- Node.js (LTS)
- A Halo oglasi account with valid test credentials

## Setup

```bash
npm ci
npx playwright install --with-deps
```

Create a `.env` file in the project root (see `.env.example`) with the credentials used by the tests:

```text
HALO_USER=<your email or username>
HALO_PASS=<your password>

# Optional overrides
# BASE_URL=https://www.halooglasi.com
# TEST_ENV=prod
```

The `.env` file is gitignored and must never be committed.

In CI, credentials are securely injected through GitHub Secrets (`HALO_USER` and `HALO_PASS`).

`TEST_ENV` selects which `config/config.<env>.json` non-sensitive settings (base URL, timeouts) are loaded from; it defaults to `prod`, the only environment this framework currently targets. `BASE_URL` is a further ad-hoc override on top of that. See `config/env.ts` for the full resolution order — credentials never participate in this fallback chain and always come from `process.env` only.

## Running Tests

```bash
npm test              # Run all tests (headless)
npm run test:headed   # Run with a visible browser
npm run test:ui       # Playwright UI mode
npm run test:report   # Open the latest HTML report
```

## Project Structure

```text
halo-pw-framework/
├── config/
│   ├── env.ts                   Resolves baseUrl, timeouts, isCi, haloUser and haloPass
│   └── config.prod.json         Non-sensitive settings for TEST_ENV=prod (base URL, timeouts)
├── support/
│   └── ObstacleHandler.ts       Anti-bot challenge detection + benign obstacle dismissal
├── testdata/
│   ├── searchData.ts            Search terms
│   └── loginData.ts             Invalid credentials for negative tests
├── pages/                       Page Objects
│   ├── BasePage.ts              handleKnownObstacles(), shared by every page object
│   ├── HaloLoginPage.ts
│   ├── HaloProfilePage.ts
│   ├── LogoutHeaderPage.ts
│   ├── SearchResultsPage.ts
│   └── AdDetailPage.ts
├── tests/
│   ├── BaseTest.ts              Shared Playwright fixtures
│   ├── smoke/
│   ├── regression/
│   ├── e2e/
│   └── negative/
├── playwright.config.ts
├── .env.example
└── .github/workflows/playwright.yml
```

The framework follows the **Page Object Model (POM)** design pattern and is organized to promote maintainability, readability, and scalability.

## Reporting

Playwright generates an HTML report in the `playwright-report/` directory (gitignored).

GitHub Actions uploads the report as a workflow artifact after every CI execution.

## Continuous Integration

The GitHub Actions workflow (`.github/workflows/playwright.yml`) runs on:

- every push to `main` or `master` — runs the `Chromium` project only (`--project=Chromium`)
- every pull request targeting `main` or `master` — same, `Chromium` project only
- a scheduled daily run (07:00 UTC) — runs the full suite, including the `Chromium-account` project
- a manual `workflow_dispatch` trigger — same, full suite, run on demand

The two Playwright projects (`playwright.config.ts`) split the suite along one line: whether a spec authenticates as the real Halo Oglasi test account. `Chromium` covers everything that doesn't; `Chromium-account` covers the specs that do, and is capped to a single worker so those never run concurrently against the one shared account. Push/PR only exercising `Chromium` is deliberate — see below.

## CI Scope & Known Limitations

This site sits behind Cloudflare, and this framework automates the real, live `halooglasi.com` — there is no sandbox or staging deployment to point CI at instead. Two things follow from that, and both shaped how CI is scoped:

**Account-touching specs are capped to one worker and kept off every push/PR.** Five specs authenticate as the real test account and mutate its session state (`smoke/halo-login`, `smoke/halo-logout`, `smoke/halo-profile-search`, `negative/halo-session-invalidated-after-logout`, `e2e/halo-search-and-view-ad`); the rest either use fake credentials or none at all and carry no session-state risk. The account-touching set runs serially (`Chromium-account` project, `workers: 1`) so two of them can never race the same login/logout state, and is scoped to the daily cron plus manual `workflow_dispatch` runs rather than every push, so it isn't hammering the shared account and the site's anti-bot protections on every commit.

**GitHub Actions run history backs this up.** The eight runs from the project's early history (2026-03-03 through 2026-03-08, both push and scheduled) all succeeded. The two most recent runs at the time of this pass (2026-07-20, one push and one scheduled, back to back) both failed. Full job log text wasn't accessible for this review — GitHub's API requires repository-admin authentication to download workflow logs, which wasn't available — so the specific failure signature in those two runs isn't confirmed from the logs themselves. Directly hitting `/prijava` from this environment during this pass did reproduce a real Cloudflare managed challenge: HTTP 403, page title `"Just a moment..."`, and a `cf-mitigated: challenge` response header (Cloudflare's own signal for this). The site's home page loaded normally in the same session — the block observed was specific to the login endpoint, not the whole site.

None of this proves the two failed runs hit this exact condition, but it's consistent with it, and it's why `support/ObstacleHandler.ts` now throws a distinct `AntiBotChallengeError` instead of letting a blocked page surface as a generic timeout: a future CI failure ending in that error is immediately diagnosable as this condition rather than needing re-investigation from scratch.

Local execution against a real browser from a residential/dev IP remains the most reliable way to validate a change end-to-end.

