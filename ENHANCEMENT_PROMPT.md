# Enhancement Prompt — `halo-pw-framework` (halooglasi.com, Playwright)

## Context

Repo: `C:\QA_Projects\halo-pw-framework`, `github.com/RadovanovicSasha/halo-pw-framework`. Playwright Test + TypeScript, Page Object Model, tests run against the same real, live site as `halooglasi-selenium-pom` (`https://www.halooglasi.com`) — login, logout, profile, search, ad-detail. Does not and must not cover purchasing/payments (the site doesn't have that surface for this test account's scope, and it's out of scope by design).

This repo is structurally thinner than its Java siblings (`halooglasi-selenium-pom`, `selenium-ui-automation-ci`) — it was built earlier and hasn't had the same hardening pass. This prompt closes that gap where Playwright's own idioms don't already cover it. **Do not port Java patterns that Playwright's test runner already handles natively** (see section 0) — only add what's genuinely missing.

**Hard constraint on framing (non-negotiable):** commit messages, code comments, and the README must describe changes as normal feature/hardening work on *this* repo. Never reference the Selenium siblings, never frame this as "porting," "matching," or "syncing" structure from another project. Never frame anything as a learning/school exercise — professional-grade framework, full stop.

## 0. What NOT to change (Playwright already handles this)

- No `DriverManager`/`DriverFactory`/`ThreadLocal` equivalent needed — Playwright's fixture system (`test.extend` in `tests/BaseTest.ts`) already creates and injects an isolated browser context per test. Don't add a manual driver-lifecycle layer.
- No JUnit-style `Suite` classes needed — the `tests/{smoke,regression,e2e,negative}/` folder split plus Playwright's `--grep`/`projects` filtering already serves that role.

## Current state (verified by reading the code, not assumed)

```
config/env.ts            — single environment, BASE_URL/HALO_USER/HALO_PASS via dotenv, no -D-style
                            override, no CI detection (process.env.CI exists and is already used
                            directly in playwright.config.ts, but not exposed as a named config getter)
pages/BasePage.ts         — holds only `protected page: Page`, no shared helper methods at all
pages/HaloLoginPage.ts    — has acceptCookiesIfVisible() and dismissSecurityNoticeIfVisible(),
                            but they live here only; nothing else in the framework can reach them
                            without depending on HaloLoginPage specifically
tests/BaseTest.ts         — Playwright fixtures for 5 page objects, beforeEach navigates to baseURL;
                            comments mix Serbian and English
playwright.config.ts      — fullyParallel: true, workers: undefined locally (full CPU parallelism),
                            workers: 1 only on CI; retries 2x on CI only; no per-suite/tag scoping
.github/workflows/playwright.yml — runs full `npx playwright test` on push (main/master), PR, AND a
                            daily 07:00 UTC cron — no scoping of login-touching tests at all
README.md                 — states the site "is protected by Cloudflare and other anti-bot mechanisms"
                            and that CI "may occasionally be blocked" — evidence of real risk already
                            acknowledged, but no code-level detection/diagnostic exists
Smoke_Test_Cases_HaloOglasi.docx — sits in repo root (the equivalent file was already removed from
                            halooglasi-selenium-pom)
```

Approved scope for this pass (confirmed): CI safety scoping, local parallelism safety, an obstacle/anti-bot detection layer, extracting duplicated dismiss logic into `BasePage`, multi-environment config (well-commented), and the two polish items below. All items are in scope — nothing here is deferred.

## 1. CI safety scoping (mandatory)

The README already states CI has been blocked before — this is *already-observed* evidence, not a hypothesis to test from scratch like the original halooglasi Selenium investigation was. Don't skip investigation entirely, but frame it as confirming current state, not discovering it fresh:

1. Review the actual GitHub Actions run history for this repo (pass/fail pattern, any visible Cloudflare/challenge signatures in failed run logs).
2. Tag or otherwise mark tests that authenticate or otherwise touch the real account (`halo-login`, `halo-logout`, `halo-profile-search`, `halo-session-invalidated-after-logout`, `halo-unauthorized-profile-access`, `halo-invalid-login`, `halo-login-validation` — verify by reading each spec, not by filename guess). Playwright doesn't have JUnit-style `@Tag`; use `test.describe('... @account', ...)` naming plus `--grep`/`--grep-invert`, or split into a separate `projects` entry in `playwright.config.ts` scoped by `testMatch`.
3. Scope `push`/`pull_request` triggers to exclude account-touching tests. Keep the daily cron and/or add a `workflow_dispatch` (matching the manual-control pattern already used for the account-sensitive Selenium suite) for the full account-touching set, run less frequently or on demand rather than on every push.
4. Document the decision and the evidence behind it in the README, in this repo's own voice — a "CI Scope & Known Limitations" section is a reasonable heading, but write the content fresh from what's actually found here.

## 2. Local parallelism safety (mandatory)

`fullyParallel: true` with `workers: undefined` locally means Playwright will run every test file concurrently by default, including the account-touching ones identified in section 1 — real risk of two tests fighting over the same login/logout/profile state on the one real account.

Add a second `projects` entry (or `test.describe.configure({ mode: 'serial' })` at the top of each account-touching spec file — pick whichever is cleaner once you see how many files are affected) so account-touching tests never run concurrently with each other, locally or on CI, while everything else keeps `fullyParallel: true`. Comment the reasoning inline in `playwright.config.ts`, same level of explanation as the Java siblings' `junit-platform.properties` comments — explain *why*, not just *what*.

## 3. Obstacle / anti-bot detection layer (mandatory)

Add a `support/` folder (sibling to `pages/`, `config/`, `testdata/`) with an `ObstacleHandler.ts`-equivalent:

- Detects known Cloudflare/Turnstile challenge markers (page title/body text like "verify you are human", "checking your browser", "just a moment", or challenge iframe/wrapper markup — check what the real challenge page actually looks like if you can trigger one, don't guess the exact selectors) and throws a distinct, clearly-named error (e.g. `AntiBotChallengeError`) with a message that says this is an infrastructure/environment condition, not a framework or app defect — so a CI failure log is immediately diagnosable instead of looking like a generic timeout.
- Separately handles the two *known, benign* obstacles already identified in `HaloLoginPage.ts` (`acceptCookiesIfVisible`, `dismissSecurityNoticeIfVisible`) — move this logic here so any page object can use it, not just login.
- Wire it into `BasePage.ts` (section 4) so it's available framework-wide, not opt-in per page.

## 4. `BasePage.ts` helpers (mandatory)

`BasePage` currently holds only a `page` reference. Now that section 3 exists, give `BasePage` shared methods that use it — e.g. a `handleKnownObstacles()` or similar that page objects call after navigation, replacing the page-specific `acceptCookiesIfVisible()`/`dismissSecurityNoticeIfVisible()` calls currently scattered wherever `HaloLoginPage` happens to be reachable. Check whether other page objects (`HaloProfilePage`, `SearchResultsPage`, `AdDetailPage`, `LogoutHeaderPage`) have their own duplicated interaction patterns while you're in there — only extract what's genuinely repeated, don't add helpers speculatively.

## 5. Multi-environment config, with comments (mandatory)

Bring `config/env.ts` up to the same capability as the Java `ConfigReader`/`EnvConfig` pair, adapted to TypeScript idiom (there's no Maven `-D` system property equivalent — use an environment variable like `TEST_ENV`, defaulting to a sensible value, read via `process.env.TEST_ENV`):

- Environment-selected config source (e.g. `config/config.<env>.json` or `.env.<env>`, selected by `TEST_ENV`, default `prod`) for non-sensitive settings (base URL, timeouts).
- Keep credentials sourced from `process.env` first (CI/GitHub Secrets), falling back to `.env` locally — same precedence already established.
- Add an explicit `isCi` getter wrapping `process.env.CI` (already used directly in `playwright.config.ts` — centralize it here so the rest of the framework has one place to check it, matching the `config` object's role as the single source of truth).
- Comment every non-obvious piece — why environment selection works this way, why credentials never get a default. Match the explanatory density already present in the Java siblings' config classes, not terse one-liners.

## 6. Polish (mandatory, small)

- `git rm Smoke_Test_Cases_HaloOglasi.docx` — delete it, it's stale and the sibling repo already removed its equivalent.
- Normalize existing Serbian/English-mixed comments in `tests/BaseTest.ts` and `pages/BasePage.ts` (and anywhere else you touch during this pass) to English, matching the rest of the codebase's comment language.

## Git workflow

Work directly on `main`/`master` (matches existing history). Conventional Commits, one logical change per commit. Run `npx playwright test` (or at least `npx tsc --noEmit` for a fast compile check) after each structural commit. Suggested sequence:

1. `chore: remove stale test case document`
2. `refactor: normalize comment language to English`
3. `feat: add anti-bot obstacle detection layer`
4. `refactor: extract shared obstacle handling into BasePage`
5. `feat: add multi-environment configuration support`
6. `fix: prevent concurrent execution of account-dependent tests`
7. `ci: scope account-touching tests out of automatic push/PR runs`
8. `docs: document CI scope and known limitations`

Report back after each numbered section: what was actually found (especially section 1's CI history review and section 3's real challenge-page markup, if triggerable), and flag anything that needs a judgment call rather than guessing.
