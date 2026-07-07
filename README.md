# Halo PW Framework

Playwright + TypeScript UI automation framework za [halooglasi.com](https://www.halooglasi.com).

Pokriva: login, logout i pretragu u okviru korisničkog profila. Ne pokriva i neće pokrivati bilo kakvu kupovinu, plaćanje ili slanje realne porudžbine.

## Tehnologije

- [Playwright Test](https://playwright.dev/) (`@playwright/test`)
- TypeScript
- `dotenv` za učitavanje kredencijala iz `.env`

## Preduslovi

- Node.js (LTS)
- Nalog na halooglasi.com sa validnim kredencijalima za testiranje

## Setup

```bash
npm ci
npx playwright install --with-deps
```

Kreiraj `.env` fajl u root-u projekta (videti `.env.example`) sa kredencijalima koje testovi koriste:

```
HALO_USER=<tvoj email ili korisničko ime>
HALO_PASS=<tvoja lozinka>
BASE_URL=https://www.halooglasi.com
```

`.env` je gitignored i nikad se ne commit-uje. Na CI, kredencijali se ubrizgavaju preko GitHub Secrets (`HALO_USER`, `HALO_PASS`).

## Pokretanje testova

```bash
npm test              # svi testovi, headless
npm run test:headed   # sa vidljivim browserom
npm run test:ui       # Playwright UI mode
npm run test:report   # otvara poslednji HTML report
```

## Struktura projekta

```
halo-pw-framework/
├── config/
│   └── env.ts                   baseUrl/haloUser/haloPass iz .env
├── testdata/
│   └── searchData.ts            test podaci (search termovi)
├── pages/                       Page Objects
│   ├── BasePage.ts
│   ├── HaloLoginPage.ts
│   ├── HaloProfilePage.ts
│   └── LogoutHeaderPage.ts
├── tests/
│   ├── BaseTest.ts              Playwright fixture-i (proširen test/expect)
│   ├── smoke/                   osnovne, kritične provere
│   │   ├── halo-login.spec.ts
│   │   ├── halo-logout.spec.ts
│   │   └── halo-profile-search.spec.ts
│   ├── regression/              (za sada prazno)
│   ├── e2e/                     pune korisničke putanje (za sada prazno)
│   └── negative/                negativni scenariji (za sada prazno)
├── playwright.config.ts
├── .env.example
└── .github/workflows/playwright.yml
```

Struktura se postupno usklađuje sa referentnom arhitekturom definisanom u `ai-operating-system` — ovaj README se ažurira uz svaki takav korak.

## Reporting

Playwright generiše HTML report u `playwright-report/` (gitignored) i, na CI, upload-uje se kao artifact.

## CI

`.github/workflows/playwright.yml` pokreće ceo test sabor na push/PR ka `main`/`master` i po dnevnom rasporedu (07:00 UTC).
