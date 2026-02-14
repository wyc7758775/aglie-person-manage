import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.PLAYWRIGHT_WEB_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'functional',
      testMatch: /tests\/functional\/.+\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'performance',
      testMatch: /tests\/performance\/.+\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'security',
      testMatch: /tests\/security\/.+\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'accessibility',
      testMatch: /tests\/accessibility\/.+\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'contract',
      testMatch: /tests\/contract\/.+\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'chaos',
      testMatch: /tests\/chaos\/.+\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'cd ../web && pnpm exec next dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
