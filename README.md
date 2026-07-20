# Halo PW Framework

Playwright + TypeScript UI automation framework for [halooglasi.com](https://www.halooglasi.com).

The project covers login, logout, and search functionality within the user profile. It does **not** cover, and is **not intended to cover**, purchasing, payments, or placing real orders.

## Notes

This framework automates a public third-party website (`halooglasi.com`).

Because the target website is protected by Cloudflare and other anti-bot mechanisms, GitHub-hosted CI runners may occasionally be blocked before the application becomes reachable.

In such cases, failed CI executions represent an external infrastructure limitation rather than a defect in the Playwright framework or the implemented test suite. Local execution remains the primary validation method.

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
BASE_URL=https://www.halooglasi.com
```

The `.env` file is gitignored and must never be committed.

In CI, credentials are securely injected through GitHub Secrets (`HALO_USER` and `HALO_PASS`).

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
│   └── env.ts                   Loads baseUrl, haloUser and haloPass from .env
├── testdata/
│   ├── searchData.ts            Search terms
│   └── loginData.ts             Invalid credentials for negative tests
├── pages/                       Page Objects
│   ├── BasePage.ts
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

The GitHub Actions workflow (`.github/workflows/playwright.yml`) automatically executes the complete test suite on:

- every push to `main` or `master`
- every pull request targeting `main` or `master`
- a scheduled daily run (07:00 UTC)

