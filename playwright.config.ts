import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    // Build inside the webServer so E2E always tests fresh dist — but the
    // reCAPTCHA site key is inlined at build time from VITE_RECAPTCHA_SITE_KEY,
    // which exists only in the CI job environment, not this command shell.
    // Pass it through or the env-inlining guard test (mailbox-reservation
    // spec:45) fails closed. See the 2026-10-21 empty-object inline incident.
    command: 'npm run build && npm run preview',
    env: {
      VITE_RECAPTCHA_SITE_KEY: process.env.VITE_RECAPTCHA_SITE_KEY || '',
    },
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
