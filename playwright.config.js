const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'npm run start:backend',
      port: parseInt(process.env.BACKEND_PORT) || 3030,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm run start:frontend',
      port: parseInt(process.env.PORT) || 3000,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
