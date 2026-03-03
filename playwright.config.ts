import * as dotenv from 'dotenv';
dotenv.config();

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Gde se nalaze test fajlovi
  testDir: './tests',

  // Globalni timeout za ceo test (ms)
  // Ako test traje duže od 120 sekundi -> prekida se
  timeout: 120 * 1000,

  // Timeout za expect() asercije, koliko dugo čeka da se uslov ispuni pre nego što javi fail
  expect: {
    timeout: 20000, // 20 sekundi
  },

  // Da li se testovi izvršavaju paralelno
  fullyParallel: true,

  // Koliko puta da pokuša ponovo test ako failuje (u CI 2x)
  retries: process.env.CI ? 2 : 0,

  // Broj paralelnih workera (ako si na CI smanjuje na 1)
  workers: process.env.CI ? 1 : undefined,

  // Reporter za rezultate (list u terminalu + HTML fajl)
  reporter: [
    ['list'],                      // keeps normal console output
    ['html', { open: 'never' }]    // generates HTML report but doesn't auto-open
  ],

  // Globalne postavke za sve testove
  use: {

    baseURL: 'https://www.halooglasi.com',
    
    // Screenshot pravi SAMO kad test padne
    screenshot: 'only-on-failure',

    // Video snimak se čuva SAMO kad test padne
    video: 'retain-on-failure',

    // Trace (koristan za debugging) se snima SAMO kad test padne
    trace: 'retain-on-failure',

    // Browser ide u headless modu (true = bez GUI, false = vidiš browser)
    headless: false,

    // Timeout za svaku akciju (click, fill...) – 0 = nema limita
    actionTimeout: 40000,
  },

  // Projekti – možeš pokretati testove na različitim browserima
  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
