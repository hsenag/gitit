// @ts-check
const { defineConfig, devices } = require('@playwright/test');

const port = process.env.GITIT_TEST_PORT || '5099';

module.exports = defineConfig({
  testDir: './specs',
  // All tests share one wiki, and some of them edit it.
  workers: 1,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // e.g. PLAYWRIGHT_CHANNEL=chrome to use an installed Google Chrome
        // instead of Playwright's bundled Chromium.
        channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
      },
    },
  ],
  webServer: {
    command: 'sh ./start-gitit.sh',
    url: `http://127.0.0.1:${port}/`,
    env: { GITIT_TEST_PORT: port, GITIT_TEST_USE_CACHE: 'yes' },
    reuseExistingServer: false,
    timeout: 120 * 1000,
  },
});
