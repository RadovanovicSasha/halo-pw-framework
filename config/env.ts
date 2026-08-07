import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// dotenv.config() only fills in process.env keys that aren't already set, so
// it never overrides real values injected by the shell/CI -- it's purely a
// local convenience for developers who don't want to export env vars by hand.
dotenv.config();

const DEFAULT_BASE_URL = 'https://www.halooglasi.com';
const DEFAULT_ACTION_TIMEOUT_MS = 40000;
const DEFAULT_EXPECT_TIMEOUT_MS = 20000;
const DEFAULT_TEST_TIMEOUT_MS = 120 * 1000;

// Node/npm has no equivalent of Maven's `-D` system-property override, so
// environment selection here goes through a plain env var instead. Defaults
// to 'prod' because this framework only targets one real, live deployment
// of halooglasi.com today -- there is no separate staging/QA environment to
// point at. The selector still exists, and is read the same way regardless,
// so pointing at a second environment later (if one is ever stood up) only
// means adding a config.<env>.json next to config.prod.json -- no code
// changes required here or in playwright.config.ts.
const testEnv = process.env.TEST_ENV ?? 'prod';

interface EnvSettings {
  baseUrl?: string;
  actionTimeout?: number;
  expectTimeout?: number;
  testTimeout?: number;
}

function loadEnvSettings(env: string): EnvSettings {
  const configPath = path.join(__dirname, `config.${env}.json`);
  if (!fs.existsSync(configPath)) {
    // Not an error: a missing config.<env>.json just means "fall through to
    // the hardcoded defaults below". This keeps `prod` usable out of the box
    // and keeps a typo'd TEST_ENV from hard-crashing config loading itself
    // (it'll just silently use defaults, which is acceptable for the
    // non-sensitive settings this file covers).
    return {};
  }
  return JSON.parse(fs.readFileSync(configPath, 'utf-8')) as EnvSettings;
}

const envSettings = loadEnvSettings(testEnv);

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(`[config] Required environment variable not set: ${name}`);
  }
  return value;
}

export const config = {
  // Resolution order: explicit BASE_URL env var (ad-hoc override for a
  // one-off run) > config.<TEST_ENV>.json > hardcoded default. This three-way
  // fallback exists only for non-sensitive settings -- credentials below
  // never get a default, on purpose.
  baseUrl: process.env.BASE_URL ?? envSettings.baseUrl ?? DEFAULT_BASE_URL,

  timeouts: {
    action: envSettings.actionTimeout ?? DEFAULT_ACTION_TIMEOUT_MS,
    expect: envSettings.expectTimeout ?? DEFAULT_EXPECT_TIMEOUT_MS,
    test: envSettings.testTimeout ?? DEFAULT_TEST_TIMEOUT_MS,
  },

  // Credentials are sourced from process.env only -- never from
  // config.<env>.json, and never with a default value. In CI they come from
  // GitHub Secrets; locally they come from .env via the dotenv.config() call
  // above. Because dotenv never overrides an already-set process.env value,
  // a real CI secret always wins over whatever a local .env happens to
  // contain, and a missing credential fails loudly via requireEnv() instead
  // of silently authenticating as some placeholder account.
  get haloUser(): string {
    return requireEnv('HALO_USER');
  },

  get haloPass(): string {
    return requireEnv('HALO_PASS');
  },

  // Centralizes the CI check. playwright.config.ts previously read
  // process.env.CI directly; now that check lives in exactly one place, same
  // as every other setting config exposes.
  get isCi(): boolean {
    return Boolean(process.env.CI);
  },
};
