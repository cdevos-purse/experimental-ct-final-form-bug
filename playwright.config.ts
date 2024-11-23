import {defineConfig, devices} from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './src/',
  testMatch: /.*(e2e)\.(ts)/,

  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'line',
  use: {
    baseURL: 'http://localhost:8000',
  },
  projects: [
    {
      name: 'Google Chrome',
      use: {
        ...devices['Desktop Chrome'], channel: 'chrome'

      },
    },
  ],

  webServer: [
    {
      command: 'npm run test:utils',
      port: 3000,
      ignoreHTTPSErrors: true,
      stdout: 'pipe',
      stderr: 'pipe',
    }
    , {
      command: 'npm run serve',
      port: 8000,
      ignoreHTTPSErrors: true,
      stdout: 'pipe',
      stderr: 'pipe',
    }],
});
