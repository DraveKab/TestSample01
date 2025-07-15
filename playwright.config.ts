import { defineConfig, devices } from '@playwright/test';

// ✅ กรณีอยากใช้ .env ในอนาคต
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env-demo') });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

 // playwright.config.ts
// ...
reporter: [
  ['line'],
  ['allure-playwright', { resultsDir: 'allure-results' }]
],

// ...

  use: {
    trace: 'on-first-retry',

    // ✅ ถ้าอยากดูการทำงานแบบ interactive (headless false)
    headless: false,

    // ✅ (แนะนำ) slowMo จะช่วยให้เห็นการทำงานช้าลง เหมาะกับ debug
    // slowMo: 100, // หน่วง 100ms ต่อ action (เปิดถ้าต้อง debug UI)
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
});
