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
    // WebKit runs weekly on main via the CI schedule (e2e-webkit-weekly job,
    // which sets PLAYWRIGHT_WEBKIT=1 and pins ubuntu-24.04), not per-PR.
    // Rationale (2026-11-17, Frank): the suite asserts DOM/behavior only —
    // no visual/screenshot tests — so a third engine adds ~1/3 E2E time per
    // PR for near-zero signal. The pinned webkit-2370 build also broke when
    // ubuntu-latest migrated to Ubuntu 26.04 (missing libicudata.so.74).
    // Revisit if a Safari-specific bug ships.
    ...(process.env.PLAYWRIGHT_WEBKIT
      ? [{ name: 'webkit', use: { ...devices['Desktop Safari'] } }]
      : []),
  ],
  webServer: {
    // In CI, build-and-test (22.x) already built dist/ with VITE_RECAPTCHA_SITE_KEY
    // inlined and uploaded build-output-22.x, which the e2e job downloads into dist/.
    // Reusing that artifact avoids two redundant 387-page Astro builds per PR.
    // Locally, keep building fresh dist with VITE_RECAPTCHA_SITE_KEY passed through.
    command: process.env.CI ? 'npm run preview' : 'npm run build && npm run preview',
    env: {
      VITE_RECAPTCHA_SITE_KEY: process.env.VITE_RECAPTCHA_SITE_KEY || '',
    },
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
